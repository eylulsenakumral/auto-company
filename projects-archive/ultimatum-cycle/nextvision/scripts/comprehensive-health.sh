#!/bin/bash

##############################################################################
# NextVision Comprehensive Health Check Script
# Checks all critical services and dependencies for pilot deployment
# Usage: bash scripts/comprehensive-health.sh
##############################################################################

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service configuration
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-nextvision_user}"
POSTGRES_DB="${POSTGRES_DB:-nextvision_db}"

REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

MINIO_ENDPOINT="${MINIO_ENDPOINT:-localhost:9000}"
YOLO_SERVICE_URL="${YOLO_SERVICE_URL:-localhost:8000}"
API_URL="${API_URL:-localhost:3000}"

# Health check counters
PASS=0
FAIL=0
WARN=0

##############################################################################
# Utility Functions
##############################################################################

print_header() {
    echo -e "\n${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  $1${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}\n"
}

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

##############################################################################
# Pre-flight Checks
##############################################################################

print_header "PRE-FLIGHT CHECKS"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   check_warn "Running as root - not recommended for health checks"
fi

# Check if Docker is running
if docker ps >/dev/null 2>&1; then
    check_pass "Docker daemon is running"
else
    check_fail "Docker daemon is not running"
    exit 1
fi

# Check if docker compose is available
if docker compose version >/dev/null 2>&1; then
    check_pass "Docker Compose is available"
else
    check_fail "Docker Compose is not available"
fi

##############################################################################
# Service Health Checks
##############################################################################

print_header "CORE SERVICES"

# PostgreSQL Health Check
echo "Checking PostgreSQL..."
if docker exec nextvision-postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
    POSTGRES_VERSION=$(docker exec nextvision-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT version();" | head -n 1 | grep -oP '\d+\.\d+' || echo "unknown")
    check_pass "PostgreSQL: Connected (port $POSTGRES_PORT, version $POSTGRES_VERSION)"

    # Check database size
    DB_SIZE=$(docker exec nextvision-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT pg_size_pretty(pg_database_size('$POSTGRES_DB'));" | xargs)
    echo -e "  └─ Database size: $DB_SIZE"

    # Check connection count
    CONN_COUNT=$(docker exec nextvision-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT count(*) FROM pg_stat_activity;" | xargs)
    MAX_CONN=100
    CONN_PERCENT=$((CONN_COUNT * 100 / MAX_CONN))
    if [ $CONN_PERCENT -lt 80 ]; then
        check_pass "PostgreSQL connections: $CONN_COUNT/$MAX_CONN ($CONN_PERCENT%)"
    else
        check_warn "PostgreSQL connections: $CONN_COUNT/$MAX_CONN ($CONN_PERCENT%) - approaching limit"
    fi
else
    check_fail "PostgreSQL: Not connected (port $POSTGRES_PORT)"
fi

# Redis Health Check
echo "Checking Redis..."
if docker exec nextvision-redis redis-cli ping >/dev/null 2>&1; then
    REDIS_VERSION=$(docker exec nextvision-redis redis-cli INFO server | grep redis_version | cut -d: -f2 | tr -d '\r')
    check_pass "Redis: Connected (port $REDIS_PORT, version $REDIS_VERSION)"

    # Check memory usage
    REDIS_MEMORY=$(docker exec nextvision-redis redis-cli INFO memory | grep used_memory_human | cut -d: -f2 | tr -d '\r')
    echo -e "  └─ Memory usage: $REDIS_MEMORY"

    # Check client connections
    REDIS_CLIENTS=$(docker exec nextvision-redis redis-cli INFO clients | grep connected_clients | cut -d: -f2 | tr -d '\r')
    echo -e "  └─ Connected clients: $REDIS_CLIENTS"
else
    check_fail "Redis: Not connected (port $REDIS_PORT)"
fi

# MinIO Health Check
echo "Checking MinIO..."
if curl -sf "http://$MINIO_ENDPOINT/minio/health/live" >/dev/null 2>&1; then
    check_pass "MinIO: Available ($MINIO_ENDPOINT)"

    # Check storage capacity
    if docker exec nextvision-minio mc alias set local http://localhost:9000 "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY" >/dev/null 2>&1; then
        STORAGE_INFO=$(docker exec nextvision-minio mc admin info local --json 2>/dev/null || echo "{}")
        if command -v jq >/dev/null 2>&1; then
            DISK_INFO=$(echo "$STORAGE_INFO" | jq -r '.disks // "N/A"')
            echo -e "  └─ Storage status: $DISK_INFO"
        fi
    fi
else
    check_fail "MinIO: Not available ($MINIO_ENDPOINT)"
fi

##############################################################################
# Application Services
##############################################################################

print_header "APPLICATION SERVICES"

# YOLO Service Health Check
echo "Checking YOLO Service..."
if curl -sf "http://$YOLO_SERVICE_URL/health" >/dev/null 2>&1; then
    YOLO_RESPONSE=$(curl -s "http://$YOLO_SERVICE_URL/health")
    check_pass "YOLO Service: Healthy ($YOLO_SERVICE_URL)"

    # Check GPU availability
    if docker exec nextvision-yolo nvidia-smi >/dev/null 2>&1; then
        GPU_NAME=$(docker exec nextvision-yolo nvidia-smi --query-gpu=name --format=csv,noheader | head -n 1)
        check_pass "YOLO GPU: $GPU_NAME"
    else
        check_warn "YOLO GPU: Not available (running on CPU)"
    fi

    # Check YOLO model
    if docker exec nextvision-yolo test -f /models/yolov8n.pt >/dev/null 2>&1; then
        MODEL_SIZE=$(docker exec nextvision-yolo stat -c%s /models/yolov8n.pt 2>/dev/null | awk '{printf "%.2f MB", $1/1024/1024}')
        echo -e "  └─ Model loaded: yolov8n.pt ($MODEL_SIZE)"
    else
        check_warn "YOLO model file not found"
    fi
else
    check_fail "YOLO Service: Not healthy ($YOLO_SERVICE_URL)"
fi

# NextVision API Health Check
echo "Checking NextVision API..."
if curl -sf "http://$API_URL/health" >/dev/null 2>&1; then
    API_RESPONSE=$(curl -s "http://$API_URL/health")
    check_pass "API: Healthy ($API_URL)"

    # Parse JSON response if available
    if command -v jq >/dev/null 2>&1; then
        API_STATUS=$(echo "$API_RESPONSE" | jq -r '.status // "unknown"')
        DB_STATUS=$(echo "$API_RESPONSE" | jq -r '.database // "unknown"')
        REDIS_STATUS=$(echo "$API_RESPONSE" | jq -r '.redis // "unknown"')

        echo -e "  └─ Status: $API_STATUS"
        echo -e "  └─ Database: $DB_STATUS"
        echo -e "  └─ Redis: $REDIS_STATUS"
    fi
else
    check_fail "API: Not healthy ($API_URL)"
fi

# Nginx Health Check
echo "Checking Nginx..."
if docker ps | grep nextvision-nginx >/dev/null 2>&1; then
    check_pass "Nginx: Running (ports 80/443)"

    # Check SSL certificate
    if docker exec nextvision-nginx test -f /etc/nginx/ssl/cert.pem; then
        CERT_EXPIRY=$(docker exec nextvision-nginx openssl x509 -in /etc/nginx/ssl/cert.pem -noout -enddate | cut -d= -f2)
        echo -e "  └─ SSL certificate expires: $CERT_EXPIRY"
    else
        check_warn "SSL certificate not found"
    fi
else
    check_fail "Nginx: Not running"
fi

##############################################################################
# Resource Usage
##############################################################################

print_header "RESOURCE USAGE"

# Docker container resource usage
echo "Container resource usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep nextvision

# Check disk space
DISK_USAGE=$(df -h /opt/nextvision | tail -n 1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    check_pass "Disk usage: ${DISK_USAGE}% (healthy)"
elif [ $DISK_USAGE -lt 90 ]; then
    check_warn "Disk usage: ${DISK_USAGE}% (warning)"
else
    check_fail "Disk usage: ${DISK_USAGE}% (critical)"
fi

# Check memory
MEM_TOTAL=$(free -g | grep Mem | awk '{print $2}')
MEM_USED=$(free -g | grep Mem | awk '{print $3}')
MEM_PERCENT=$((MEM_USED * 100 / MEM_TOTAL))
if [ $MEM_PERCENT -lt 80 ]; then
    check_pass "Memory usage: ${MEM_USED}GB/${MEM_TOTAL}GB (${MEM_PERCENT}%)"
else
    check_warn "Memory usage: ${MEM_USED}GB/${MEM_TOTAL}GB (${MEM_PERCENT}%)"
fi

##############################################################################
# RTSP Camera Connectivity
##############################################################################

print_header "RTSP CAMERA CONNECTIVITY"

if [ -n "${RTSP_CAMERA_1_URL:-}" ]; then
    echo "Testing RTSP camera connection..."
    if timeout 5 ffplay -t 3 "$RTSP_CAMERA_1_URL" -nodisp 2>/dev/null; then
        check_pass "RTSP Camera: Connected ($RTSP_CAMERA_1_URL)"
    else
        check_fail "RTSP Camera: Cannot connect ($RTSP_CAMERA_1_URL)"
        echo -e "  └─ Try: ffplay $RTSP_CAMERA_1_URL"
    fi
else
    check_warn "RTSP camera URL not configured (RTSP_CAMERA_1_URL)"
fi

##############################################################################
# Summary
##############################################################################

print_header "HEALTH CHECK SUMMARY"

TOTAL=$((PASS + FAIL + WARN))
echo -e "Total checks: $TOTAL"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"

if [ $FAIL -eq 0 ]; then
    echo -e "\n${GREEN}✓ All critical services are healthy${NC}\n"
    exit 0
else
    echo -e "\n${RED}✗ Some services are unhealthy - review failures above${NC}\n"
    exit 1
fi
