# NextVision Occupational Safety - Pilot Deployment Runbook

**Target:** Turkish Factory Floor - 30 Day Pilot @ $1
**Deployment Window:** Week 1 of Cycle
**Owner:** DevOps/SRE - Hightower
**Last Updated:** 2026-06-03

## Executive Summary

NextVision occupational safety monitoring system deployment for Turkish factory pilot. This runbook ensures safe, repeatable deployment with rollback capability.

### Service Stack
- **PostgreSQL 16** - Production database
- **Redis 7** - Cache & message queue  
- **MinIO** - Video object storage
- **YOLO Service** - Computer vision detection (GPU accelerated)
- **NextVision API** - Main application
- **Nginx** - Reverse proxy & SSL termination

---

## Pre-Deployment Checklist

### Hardware Validation

```bash
# Check GPU availability (required for YOLO)
nvidia-smi

# Expected output: NVIDIA GPU details with CUDA version
# If fails: YOLO service will run on CPU (10x slower)

# Check disk space (minimum 100GB for video storage)
df -h

# Check RAM (minimum 16GB recommended)
free -h

# Check CPU cores (minimum 4 cores)
nproc
```

### Dependency Validation

```bash
# Docker & Docker Compose
docker --version  # >= 24.0
docker compose version  # >= 2.20

# Network ports availability
netstat -tuln | grep -E ':(443|80|3000|5432|6379|9000|8000)'

# Should return empty - all ports must be free
```

### Environment Setup

```bash
# 1. Clone repository
cd /opt/nextvision
git clone <repo-url> .

# 2. Create environment file
cp .env.example .env
nano .env  # Edit all required values

# 3. Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 16  # For database passwords

# 4. Create required directories
mkdir -p models config/postgres config/nginx/ssl logs/data
```

---

## Deployment Sequence

### Phase 1: Infrastructure Boot (5 minutes)

```bash
# 1. Start core infrastructure services
docker compose up -d postgres redis minio

# 2. Wait for health checks (automated via healthcheck)
docker compose ps

# Expected: All 3 services showing "healthy"
```

**Verification:**
```bash
# PostgreSQL
docker exec nextvision-postgres pg_isready -U nextvision_user

# Redis  
docker exec nextvision-redis redis-cli -a $REDIS_PASSWORD ping

# MinIO
curl http://localhost:9000/minio/health/live
```

### Phase 2: YOLO Service Deployment (3 minutes)

```bash
# 1. Download YOLO models (first time only)
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -O models/yolov8n.pt

# 2. Build and start YOLO service
docker compose up -d yolo-service

# 3. Verify GPU access
docker exec nextvision-yolo nvidia-smi
```

**Verification:**
```bash
# Health check
curl http://localhost:8000/health

# Expected response: {"status":"healthy","gpu":"available"}
```

### Phase 3: Application Deployment (2 minutes)

```bash
# 1. Build and start API
docker compose up -d api

# 2. Run database migrations
docker exec nextvision-api npm run migrate

# 3. Seed initial data
docker exec nextvision-api npm run seed
```

**Verification:**
```bash
# API health
curl http://localhost:3000/health

# Expected: {"status":"ok","database":"connected","redis":"connected"}
```

### Phase 4: Reverse Proxy & SSL (2 minutes)

```bash
# 1. Generate self-signed SSL certificate (production: use Let's Encrypt)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout config/nginx/ssl/key.pem \
  -out config/nginx/ssl/cert.pem

# 2. Start nginx
docker compose up -d nginx

# 3. Verify SSL
curl -k https://localhost/api/health
```

### Phase 5: RTSP Camera Integration (Variable)

```bash
# 1. Add camera configuration to .env
RTSP_CAMERA_1_URL=rtsp://192.168.1.100:554/stream1
RTSP_CAMERA_1_NAME="Production Line A"
RTSP_CAMERA_1_LOCATION="factory_floor_north"

# 2. Test RTSP stream
ffplay rtsp://192.168.1.100:554/stream1

# 3. Restart API to load camera config
docker compose restart api

# 4. Verify camera connection
docker exec nextvision-api npm run test-camera
```

---

## Health Verification

### Comprehensive Health Check

```bash
# Run comprehensive health script
bash scripts/comprehensive-health.sh

# Expected output:
# ✓ PostgreSQL: Connected (5432)
# ✓ Redis: Connected (6379)  
# ✓ MinIO: Available (9000)
# ✓ YOLO Service: Healthy (8000, GPU: Yes)
# ✓ API: Healthy (3000)
# ✓ Nginx: Running (443)
```

### Smoke Tests

```bash
# 1. Test API endpoints
curl -k https://localhost/api/v1/cameras
curl -k https://localhost/api/v1/detections/summary

# 2. Test RTSP stream processing
docker exec nextvision-api npm run test-detection

# 3. Verify video storage
docker exec nextvision-minio mc alias set local http://localhost:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY
docker exec nextvision-minio mc ls local/nextvision-videos
```

---

## Monitoring Setup

### Log Aggregation

```bash
# View all logs
docker compose logs -f

# Service-specific logs
docker compose logs -f yolo-service
docker compose logs -f api
```

### Metrics Collection

```bash
# Access metrics endpoint
curl http://localhost:9090/metrics

# Key metrics to monitor:
# - yolo_detection_duration_seconds
# - api_request_duration_seconds
# - database_connection_pool
# - redis_memory_usage
```

---

## Rollback Procedure

**If any phase fails:**

1. **Stop current deployment:**
   ```bash
   docker compose down
   ```

2. **Restore from backup:**
   ```bash
   # Database
   docker run --rm -v nextvision_postgres_data:/data -v $(pwd)/backups:/backup alpine \
     tar xzf /backup/postgres_backup.tar.gz -C /

   # Redis
   docker run --rm -v nextvision_redis_data:/data -v $(pwd)/backups:/backup alpine \
     tar xzf /backup/redis_backup.tar.gz -C /
   ```

3. **Restart previous version:**
   ```bash
   git checkout <previous-stable-tag>
   docker compose up -d
   ```

4. **Verify rollback:**
   ```bash
   bash scripts/comprehensive-health.sh
   ```

---

## Troubleshooting

### YOLO Service Won't Start

**Symptom:** Container exits immediately  
**Cause:** GPU not available  
**Solution:**
```bash
# Check NVIDIA driver
nvidia-smi

# Install NVIDIA Container Toolkit (if missing)
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  tee /etc/apt/sources.list.d/nvidia-docker.list

apt-get update && apt-get install -y nvidia-container-toolkit
systemctl restart docker
```

### RTSP Camera Connection Failed

**Symptom:** "Camera unreachable" error  
**Solution:**
```bash
# 1. Test RTSP URL manually
ffplay rtsp://<camera_ip>:554/stream1

# 2. Check network connectivity
ping <camera_ip>
telnet <camera_ip> 554

# 3. Verify camera credentials (if auth required)
RTSP_CAMERA_1_URL=rtsp://user:pass@192.168.1.100:554/stream1

# 4. Check RTSP protocol version
# Some cameras require rtsp:// instead of rtspv://
```

### Database Migration Failed

**Symptom:** API starts but returns 500 errors  
**Solution:**
```bash
# 1. Check database connection
docker exec nextvision-postgres psql -U nextvision_user -d nextvision_db

# 2. Manually run migrations
docker exec nextvision-api npm run migrate:status
docker exec nextvision-api npm run migrate:latest

# 3. If corrupted, drop and recreate
docker exec nextvision-postgres psql -U nextvision_user -c "DROP DATABASE nextvision_db;"
docker exec nextvision-postgres psql -U nextvision_user -c "CREATE DATABASE nextvision_db;"
docker exec nextvision-api npm run migrate
```

---

## Post-Deployment Validation

### Day 1 Checks (Hourly for 8 hours)

- [ ] All services healthy
- [ ] RTSP streams processing
- [ ] Detections being generated
- [ ] Video storage working
- [ ] API response time < 200ms
- [ ] No error logs in any service

### Day 2-7 Checks (Daily)

- [ ] Database growth within expected bounds
- [ ] Redis memory usage stable
- [ ] MinIO storage capacity > 80% free
- [ ] GPU utilization < 90%
- [ ] No camera disconnections > 1 minute

### Day 8-30 Checks (Weekly)

- [ ] Full system health report
- [ ] Performance metrics review
- [ ] Security updates applied
- [ ] Backup verification
- [ ] Customer satisfaction check

---

## Emergency Contacts

**DevOps On-Call:** +90 XXX XXX XX XX  
**Engineering Lead:** +90 XXX XXX XX XX  
**Customer Contact:** +90 XXX XXX XX XX (Turkish Factory)

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-06-03 | 1.0 | Initial pilot deployment runbook | Hightower |
