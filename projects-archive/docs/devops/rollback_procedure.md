# NextVision Rollback Procedures

**Version:** 1.0
**Last Updated:** 2026-06-03
**Owner:** DevOps/SRE - Hightower
**Severity:** Critical - Production Safety

---

## Executive Summary

This document defines rollback procedures for NextVision occupational safety monitoring system. Rollback is the emergency brake - when deployment fails or system becomes unstable, these procedures restore the previous working state quickly and safely.

### Rollback Decision Criteria

**Immediate Rollback Required:**
- Critical service down > 5 minutes
- Data corruption detected
- Security breach suspected
- Detection accuracy drops > 50%
- Camera connectivity lost > 10 minutes

**Consider Rollback:**
- API response time > 5 seconds (p95)
- Memory usage > 90% sustained
- GPU utilization > 95% sustained
- Error rate > 10% in logs

---

## Pre-Rollback Checklist

### Safety First

```bash
# 1. NOTIFY STAKEHOLDERS before rollback
echo "NOTIFICATION: Rollback initiated at $(date)" | \
  tee -a /var/log/nextvision/rollback.log

# Send alert (Telegram/Email)
# Subject: URGENT - NextVision Rollback in Progress
# Body: Rollback initiated, ETA to restore: 5 minutes

# 2. Check current system state
docker compose ps  # Note which services are running
df -h              # Note disk usage
free -h            # Note memory usage

# 3. Last healthy timestamp (from logs)
grep "healthy" /var/log/nextvision/*.log | tail -n 1
```

### Backup Verification

```bash
# Verify backups exist and are recent
ls -lh /opt/nextvision/backups/

# Expected:
# postgres_backup_20260603_1200.tar.gz  (within last 24 hours)
# redis_backup_20260603_1200.tar.gz
# minio_buckets_backup_20260603_1200.tar.gz
# nextvision_config_20260603_1200.tar.gz
```

---

## Rollback Procedures

### Level 1: Service Restart (Fastest - 1 minute)

**When to use:** Single service failure, no data corruption

```bash
#!/bin/bash
# rollback-level1.sh - Service restart only

echo "Level 1 Rollback: Service Restart"

# 1. Restart failed service
docker compose restart <service-name>

# 2. Monitor logs for 30 seconds
docker compose logs -f --tail=50 <service-name> | timeout 30 cat

# 3. Verify health
bash scripts/comprehensive-health.sh

# 4. If still failing, proceed to Level 2
if [ $? -ne 0 ]; then
  echo "Level 1 failed - escalate to Level 2"
  exit 1
fi

echo "Level 1 Rollback: Complete"
```

### Level 2: Container Rebuild (Fast - 3 minutes)

**When to use:** Container corruption, config issues

```bash
#!/bin/bash
# rollback-level2.sh - Container rebuild

echo "Level 2 Rollback: Container Rebuild"

# 1. Stop affected service
docker compose stop <service-name>

# 2. Remove container (preserves volumes)
docker compose rm -f <service-name>

# 3. Rebuild from last known good image
docker compose up -d --force-recreate <service-name>

# 4. Run migrations if database
if [ "<service-name>" = "api" ]; then
  docker exec nextvision-api npm run migrate
fi

# 5. Verify health
bash scripts/comprehensive-health.sh

echo "Level 2 Rollback: Complete"
```

### Level 3: Code Rollback (Medium - 5 minutes)

**When to use:** Bad deployment, logic errors, new bugs

```bash
#!/bin/bash
# rollback-level3.sh - Code rollback to previous git tag

echo "Level 3 Rollback: Code Rollback"

# 1. Stop all services
docker compose down

# 2. Find last stable deployment
git tag | grep "stable" | tail -n 1
LAST_STABLE=$(git tag | grep "stable" | tail -n 1)

# 3. Rollback code
git checkout $LAST_STABLE

# 4. Rebuild and restart
docker compose build --no-cache
docker compose up -d

# 5. Run migrations (may need down migration)
docker exec nextvision-api npm run migrate:down
docker exec nextvision-api npm run migrate

# 6. Verify health
bash scripts/comprehensive-health.sh

echo "Level 3 Rollback: Complete (rolled back to $LAST_STABLE)"
```

### Level 4: Database Restore (Slow - 15 minutes)

**When to use:** Data corruption, bad migration, data loss

```bash
#!/bin/bash
# rollback-level4.sh - Database restore from backup

echo "Level 4 Rollback: Database Restore"

# 1. STOP ALL SERVICES (critical)
docker compose down

# 2. Select backup file
BACKUP_FILE="/opt/nextvision/backups/postgres_backup_$(date +%Y%m%d)_*.tar.gz"
ls -lh $BACKUP_FILE

# 3. Stop PostgreSQL container
docker stop nextvision-postgres

# 4. Backup current data (before restore)
docker run --rm -v nextvision_postgres_data:/data -v \
  /opt/nextvision/backups:/backup alpine \
  tar czf /backup/postgres_pre_restore_$(date +%Y%m%d_%H%M).tar.gz -C /data .

# 5. Restore from backup
docker run --rm -v nextvision_postgres_data:/data -v \
  /opt/nextvision/backups:/backup alpine \
  tar xzf $BACKUP_FILE -C /data

# 6. Start PostgreSQL
docker start nextvision-postgres

# 7. Wait for PostgreSQL to be ready
sleep 10
docker exec nextvision-postgres pg_isready -U nextvision_user

# 8. Start other services
docker compose up -d

# 9. Verify data integrity
docker exec nextvision-postgres psql -U nextvision_user -d nextvision_db \
  -c "SELECT COUNT(*) FROM detections;"

# 10. Verify health
bash scripts/comprehensive-health.sh

echo "Level 4 Rollback: Complete (database restored from $BACKUP_FILE)"
```

### Level 5: Full System Restore (Slowest - 30 minutes)

**When to use:** Complete system failure, disaster recovery

```bash
#!/bin/bash
# rollback-level5.sh - Full system restore from backups

echo "Level 5 Rollback: Full System Restore"

# 1. EMERGENCY SHUTDOWN
docker compose down
systemctl stop docker  # Complete stop

# 2. Verify all backup files
POSTGRES_BACKUP="/opt/nextvision/backups/postgres_backup_$(date +%Y%m%d)_*.tar.gz"
REDIS_BACKUP="/opt/nextvision/backups/redis_backup_$(date +%Y%m%d)_*.tar.gz"
MINIO_BACKUP="/opt/nextvision/backups/minio_backup_$(date +%Y%m%d)_*.tar.gz"
CONFIG_BACKUP="/opt/nextvision/backups/config_backup_$(date +%Y%m%d)_*.tar.gz"

for backup in "$POSTGRES_BACKUP" "$REDIS_BACKUP" "$MINIO_BACKUP" "$CONFIG_BACKUP"; do
  if [ ! -f "$backup" ]; then
    echo "CRITICAL: Backup file missing: $backup"
    exit 1
  fi
done

# 3. Restore Docker volumes
for service in postgres redis minio; do
  docker run --rm -v nextvision_${service}_data:/data \
    -v /opt/nextvision/backups:/backup alpine \
    tar xzf /opt/nextvision/backups/${service}_backup_*.tar.gz -C /data
done

# 4. Restore configuration
tar xzf $CONFIG_BACKUP -C /opt/nextvision

# 5. Restore Docker Compose file
cd /opt/nextvision
git checkout $(git tag | grep "stable" | tail -n 1)

# 6. Restart Docker
systemctl start docker

# 7. Start services
docker compose up -d

# 8. Full health verification
bash scripts/comprehensive-health.sh

# 9. Data integrity check
docker exec nextvision-postgres psql -U nextvision_user -d nextvision_db \
  -c "SELECT COUNT(*) FROM detections; SELECT COUNT(*) FROM cameras; SELECT COUNT(*) FROM alerts;"

# 10. Camera connectivity test
for camera_url in "${RTSP_CAMERA_URLS[@]}"; do
  timeout 5 ffplay -t 3 "$camera_url" -nodisp 2>/dev/null && echo "Camera OK" || echo "Camera FAILED"
done

echo "Level 5 Rollback: Complete (full system restored)"
```

---

## Rollback Validation

### Post-Rollback Health Check

```bash
# Run comprehensive health check
bash scripts/comprehensive-health.sh | tee /tmp/rollback_validation.log

# Expected output:
# ✓ All services healthy
# ✓ Database connected
# ✓ Redis connected
# ✓ MinIO available
# ✓ YOLO service working
# ✓ API responding
# ✓ Cameras connected
```

### Data Integrity Verification

```bash
# 1. Check record counts
docker exec nextvision-postgres psql -U nextvision_user -d nextvision_db -c "
  SELECT
    (SELECT COUNT(*) FROM detections) as detection_count,
    (SELECT COUNT(*) FROM cameras) as camera_count,
    (SELECT COUNT(*) FROM alerts) as alert_count,
    (SELECT COUNT(*) FROM users) as user_count;
"

# 2. Check recent data
docker exec nextvision-postgres psql -U nextvision_user -d nextvision_db -c "
  SELECT * FROM detections ORDER BY created_at DESC LIMIT 5;
"

# 3. Check video storage
docker exec nextvision-minio mc ls local/nextvision-videos/ | tail -n 10
```

### Functional Testing

```bash
# 1. Test API endpoints
curl -k https://localhost/api/v1/detections/summary
curl -k https://localhost/api/v1/cameras/status
curl -k https://localhost/api/v1/alerts/active

# 2. Test YOLO detection
curl -X POST https://localhost/api/v1/test-detection \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://test-image.jpg"}'

# 3. Test camera streaming
for camera in "${CAMERAS[@]}"; do
  timeout 5 ffplay -t 3 "$camera" -nodisp 2>/dev/null && echo "✓ $camera" || echo "✗ $camera"
done
```

---

## Backup Strategy

### Automated Backups (Every 6 Hours)

```bash
#!/bin/bash
# backup-automated.sh - Run via cron every 6 hours

BACKUP_DIR="/opt/nextvision/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M)
RETENTION_DAYS=7

# 1. Create backup directory
mkdir -p "$BACKUP_DIR"

# 2. Backup PostgreSQL
docker exec nextvision-postgres pg_dump -U nextvision_user nextvision_db | \
  gzip > "$BACKUP_DIR/postgres_backup_${TIMESTAMP}.sql.gz"

# 3. Backup Redis
docker exec nextvision-redis redis-cli --rdb /tmp/dump.rdb
docker cp nextvision-redis:/tmp/dump.rdb "$BACKUP_DIR/redis_backup_${TIMESTAMP}.rdb"
gzip "$BACKUP_DIR/redis_backup_${TIMESTAMP}.rdb"

# 4. Backup MinIO buckets
docker exec nextvision-minio mc mirror --overwrite /data /tmp/minio_backup
docker cp nextvision-minio:/tmp/minio_backup "$BACKUP_DIR/minio_backup_${TIMESTAMP}"
tar czf "$BACKUP_DIR/minio_backup_${TIMESTAMP}.tar.gz" -C /tmp minio_backup
rm -rf /tmp/minio_backup

# 5. Backup configuration
tar czf "$BACKUP_DIR/config_backup_${TIMESTAMP}.tar.gz" \
  /opt/nextvision/.env \
  /opt/nextvision/docker-compose.yml \
  /opt/nextvision/config/

# 6. Cleanup old backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.rdb.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $TIMESTAMP"
```

### Manual Backup (Before Changes)

```bash
#!/bin/bash
# backup-manual.sh - Run before deployments

TIMESTAMP=$(date +%Y%m%d_%H%M)
BACKUP_DIR="/opt/nextvision/backups/manual"

mkdir -p "$BACKUP_DIR"

# Tag current git state
git tag -a "backup_before_${TIMESTAMP}" -m "Manual backup before deployment"

# Full system backup
./scripts/backup-automated.sh

# Copy to manual backup directory
cp /opt/nextvision/backups/*_${TIMESTAMP}.* "$BACKUP_DIR/"

echo "Manual backup completed: backup_before_${TIMESTAMP}"
```

---

## Emergency Rollback Decision Tree

```
START
  │
  ├─ Is API responding?
  │   ├─ NO → Level 1: Service Restart
  │   │         │
  │   │         ├─ Works? → DONE
  │   │         └─ Fails → Level 2: Container Rebuild
  │   │                   │
  │   │                   ├─ Works? → DONE
  │   │                   └─ Fails → Level 3: Code Rollback
  │   │                             │
  │   │                             ├─ Works? → DONE
  │   │                             └─ Fails → CHECK DATABASE
  │   └─ YES → Check functionality
  │             │
  │             ├─ Database errors? → Level 4: Database Restore
  │             │                        │
  │             │                        ├─ Works? → DONE
  │             │                        └─ Fails → Level 5: Full Restore
  │             │
  │             └─ Camera issues? → RTSP Troubleshooting (See Camera Guide)
  │
  └─ Complete system failure? → Level 5: Full System Restore
```

---

## Rollback Communication

### Pre-Rollback Notification

```bash
# Send to all stakeholders
SUBJECT="⚠️ URGENT - NextVision Rollback Initiated"
BODY="
Rollback initiated at $(date)
Affected System: NextVision Production
Impact: Safety monitoring temporarily offline
ETA to Restore: 5-30 minutes (depending on rollback level)
Contact: DevOps On-Call +90 XXX XXX XX XX
"
```

### Post-Rollback Report

```bash
# Send after rollback complete
SUBJECT="✅ NextVision Rollback Complete"
BODY="
Rollback completed at $(date)
Rollback Level: [1-5]
Root Cause: [Brief description]
Current Status: System healthy
Data Integrity: Verified
Next Steps: [Investigation timeline]
"
```

---

## Rollback Prevention

### Pre-Deployment Testing

```bash
# 1. Staging environment test
docker compose -f docker-compose.staging.yml up -d
bash scripts/comprehensive-health.sh

# 2. Load testing
ab -n 1000 -c 10 https://staging.example.com/api/v1/detections

# 3. Database migration test
docker exec nextvision-api npm run migrate:rollback
docker exec nextvision-api npm run migrate

# 4. Camera connectivity test
for camera in "${CAMERAS[@]}"; do
  timeout 5 ffplay -t 10 "$camera" -nodisp 2>/dev/null || echo "Camera test failed"
done
```

### Deployment Gates

```bash
# Deployment script with automatic rollback
#!/bin/bash
# deploy-with-gates.sh

# Deploy to staging
docker compose -f docker-compose.staging.yml up -d --build

# Run health check
if ! bash scripts/comprehensive-health.sh; then
  echo "Staging deployment failed - aborting production deployment"
  exit 1
fi

# Deploy to production
docker compose up -d --build

# Production health check
sleep 30  # Allow services to stabilize
if ! bash scripts/comprehensive-health.sh; then
  echo "Production deployment failed - initiating rollback"
  ./rollback-level3.sh  # Automatic code rollback
  exit 1
fi

echo "Deployment successful"
```

---

## Post-Rollback Analysis

### Root Cause Investigation

```bash
# 1. Collect logs from failed deployment
docker compose logs --since "1 hour ago" > /tmp/deployment_failure.log

# 2. Analyze error patterns
grep -i "error\|fail\|exception" /tmp/deployment_failure.log | \
  awk '{print $5}' | sort | uniq -c | sort -rn

# 3. Check resource exhaustion
free -h
df -h
docker stats --no-stream

# 4. Database lock analysis
docker exec nextvision-postgres psql -U nextvision_user -d nextvision_db \
  -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

### Incident Report Template

```markdown
# NextVision Deployment Failure - Post-Rollback Analysis

**Date:** $(date)
**Rollback Level:** [1-5]
**Downtime Duration:** X minutes
**Root Cause:** [Detailed analysis]
**Impact:** [User impact, data impact]
**Prevention Actions:** [How to prevent recurrence]
**Follow-up Tasks:** [Owner, Due Date]
```

---

## Contacts and Escalation

| Role | Contact | Availability |
|------|---------|--------------|
| DevOps On-Call | +90 XXX XXX XX XX | 24/7 |
| Engineering Lead | +90 XXX XXX XX XX | Business hours |
| Customer Contact | +90 XXX XXX XX XX | Business hours |
| Management | +90 XXX XXX XX XX | Emergency only |

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-06-03 | 1.0 | Initial rollback procedures | Hightower |

---

*This document is part of NextVision production operations. Test rollback procedures in staging before production use.*
