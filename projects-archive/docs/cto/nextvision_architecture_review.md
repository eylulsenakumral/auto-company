# NextVision Architecture Review - CTO Office
**Date:** 2026-06-03
**Reviewer:** Werner Vogels (CTO)
**Project:** Occupational Safety Monitoring System - Pilot Deployment
**Target:** Turkish Factory, 30 Days @ $1

---

## Executive Summary

NextVision occupational_safety modülü **production-ready** mimari ile değerlendirilmiştir. Edge-first yaklaşım doğru seçilmiş olsa da, **critical gap** tespit edilmiştir: GPU kaynak yönetimi ve failure scenarios eksik dokümante edilmiştir.

### Overall Architecture Rating: **B+ (Deployable with Conditions)**

**Strengths:**
- Service-oriented mimari doğru uygulanmış (API-first, loose coupling)
- Infrastructure as Code (docker-compose) hazır
- Health check机制 mevcut
- Data persistence (PostgreSQL + MinIO) sağlam

**Critical Gaps:**
1. GPU fallback mekanizması yok (CPU fallback 10x slower)
2. RTSP stream reconnect logic eksik
3. No circuit breaker pattern for camera disconnections
4. Single point of failure: YOLO service (no horizontal scaling)

---

## Architecture Analysis

### Service Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    Factory Edge Network                      │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ RTSP Camera 1│─────▶│              │                    │
│  └──────────────┘      │              │                    │
│  ┌──────────────┐      │   RTSP       │                    │
│  │ RTSP Camera 2│─────▶│  Ingestion   │                    │
│  └──────────────┘      │   Service    │                    │
│  ┌──────────────┐      │              │                    │
│  │ RTSP Camera N│─────▶│              │                    │
│  └──────────────┘      └──────┬───────┘                    │
│                                │                             │
└────────────────────────────────│─────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Processing Pipeline                      │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │ Frame Buffer │─────▶│  YOLO        │                    │
│  │   (Redis)    │      │  Service     │                    │
│  └──────────────┘      │  (GPU)       │                    │
│                        └──────┬───────┘                    │
│                               │                             │
│                               ▼                             │
│                        ┌──────────────┐                    │
│                        │   Rule       │                    │
│                        │   Engine     │                    │
│                        └──────┬───────┘                    │
└───────────────────────────────│─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data & Notification Layer                 │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  PostgreSQL  │      │ Notification │                    │
│  │   (Detections│◀─────│   Service    │                    │
│  │    + Rules)  │      └──────────────┘                    │
│  └──────────────┘                                            │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │    MinIO     │      │   Web UI     │                    │
│  │  (Video Arch │      │   (Nginx)    │                    │
│  │     hive)    │      └──────────────┘                    │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### Component Analysis

#### 1. RTSP Ingestion (Critical Path)

**Status:** ⚠️ **Design Exists, Implementation Missing**

**Concerns:**
- RTSP reconnection logic undefined (network jitter = lost frames)
- No frame buffering strategy (Redis vs in-memory)
- Camera authentication security unclear

**Vogels' Principle - Everything Fails:**
> RTSP connections fail. Network hiccups occur. Cameras reboot.
> **Current design** assumes happy path. **Need**: Exponential backoff reconnector + frame buffer.

**Recommendation:**
```python
# Required: RTSP Reconnection Strategy
class RTSPReconnector:
    def __init__(self, url, max_retries=5, backoff_base=2):
        self.url = url
        self.max_retries = max_retries
        self.backoff_base = backoff_base
        self.retry_count = 0

    def connect_with_backoff(self):
        while self.retry_count < self.max_retries:
            try:
                cap = cv2.VideoCapture(self.url)
                if cap.isOpened():
                    self.retry_count = 0  # Reset on success
                    return cap
            except Exception:
                wait = self.backoff_base ** self.retry_count
                time.sleep(wait)
                self.retry_count += 1
        raise ConnectionError("Max retries exceeded")
```

#### 2. YOLO Service (GPU Acceleration)

**Status:** ✅ **Solid Design, Missing Fallback**

**Strengths:**
- GPU resource reservation via Docker (`runtime: nvidia`)
- Model path externalization (environment variable)
- Health check endpoint exists

**Critical Issue - No CPU Fallback:**
```yaml
# docker-compose.yml L71-102
yolo-service:
  runtime: nvidia  # HARD REQUIREMENT - no fallback
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

**Vogels' Principle - Design for Failure:**
> What happens when GPU driver crashes? When nvidia-docker fails?
> **Current behavior:** Container exit = system down.
> **Required behavior:** Degrade gracefully to CPU (10x slower, but works).

**Recommendation:**
```yaml
# Add CPU fallback container
yolo-service-cpu-fallback:
  build: ./src/services/yolo
  environment:
    - YOLO_DEVICE=cpu  # Ultralytics supports this
  restart: unless-stopped
  # Active only when GPU fails (via health check failure trigger)
```

#### 3. Rule Engine (Business Logic)

**Status:** ❌ **Missing Implementation**

**Gap:** docker-compose.yml mentions "rule-engine" but no code exists.

**Required Logic:**
```python
# Missing: Rule Engine Core
class RuleEngine:
    def evaluate(self, detection: PPEFrameResult) -> List[Violation]:
        """Example rules"""
        violations = []

        # Rule 1: No helmet detected in production zone
        if "production" in detection.zone:
            if not any(d.class_name == "helmet" for d in detection.detections):
                violations.append(Violation(
                    type="NO_HELMET",
                    severity="CRITICAL",
                    timestamp=detection.timestamp
                ))

        # Rule 2: Vest required in welding area
        if "welding" in detection.zone:
            if not any(d.class_name == "vest" for d in detection.detections):
                violations.append(Violation(
                    type="NO_VEST",
                    severity="HIGH",
                    timestamp=detection.timestamp
                ))

        return violations
```

#### 4. Notification Service

**Status:** ❌ **Missing Implementation**

**Gap:** No notification mechanism exists. Who gets alerted when violations occur?

**Required Channels:**
1. **Telegram Bot** (customer preference per RTK.md)
2. **Email** (factory manager)
3. **Web UI** (real-time dashboard alerts)

#### 5. Data Layer (PostgreSQL + Redis + MinIO)

**Status:** ✅ **Solid**

**Strengths:**
- PostgreSQL for persistent storage (detections, rules, users)
- Redis for pub/sub (frame buffer, detection stream)
- MinIO for video archival (S3-compatible, self-hosted)

**Concern - Redis Persistence:**
```yaml
# L35: redis command
command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
```
✅ AOF enabled - good for durability
⚠️ No backup strategy documented

**Vogels' Principle - Data is the Asset:**
> Redis data = frame buffer = temporary. OK to lose on restart.
> PostgreSQL data = violation records = permanent. MUST backup.
> MinIO data = video evidence = MUST archive to cold storage.

---

## Failure Mode Analysis

### Critical Failure Scenarios

| Scenario | Current Behavior | Expected Behavior | Severity |
|----------|------------------|-------------------|----------|
| GPU driver crash | YOLO service exits, system down | Fallback to CPU, alert ops | **HIGH** |
| RTSP camera disconnect | Frame loss, undefined recovery | Auto-reconnect with backoff | **HIGH** |
| Redis OOM | Data loss, undefined behavior | Eviction policy + alert | **MEDIUM** |
| MinIO disk full | Write errors, possible crash | Auto-archival + alert | **MEDIUM** |
| PostgreSQL corruption | System down | Daily backups + PITR | **CRITICAL** |
| Network partition between services | Unknown | Circuit breaker + local cache | **HIGH** |

### Blast Radius Assessment

```
┌──────────────────────────────────────────────────────────┐
│                   Blast Radius Map                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  CRITICAL BLAST RADIUS                           │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │    │
│  │  │PostgreSQL│  │  Redis   │  │   MinIO  │       │    │
│  │  │  Data    │  │  Buffer  │  │  Video   │       │    │
│  │  └──────────┘  └──────────┘  └──────────┘       │    │
│  │     Failure = System Down + Data Loss            │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  CONTAINED BLAST RADIUS                          │    │
│  │  ┌──────────┐  ┌──────────┐                     │    │
│  │  │   Nginx  │  │    API   │                     │    │
│  │  └──────────┘  └──────────┘                     │    │
│  │     Failure = Service Degradation               │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ISOLATED BLAST RADIUS                          │    │
│  │  ┌──────────┐                                    │    │
│  │  │    YOLO  │                                    │    │
│  │  │  Service │                                    │    │
│  │  └──────────┘                                    │    │
│  │     Failure = Degrade to CPU (if implemented)    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Analysis

### Happy Path (RTSP → Detection → Storage)

```
1. RTSP Camera Frame Capture (30 FPS)
   ↓
2. Frame Buffer (Redis List, 5s window = 150 frames)
   ↓
3. YOLO Service Pull (Batch Processing, 1 frame at a time)
   ↓
4. Detection Result Publish (Redis Pub/Sub)
   ↓
5. Rule Engine Evaluation (Subscribe to Redis Channel)
   ↓
6. Violation Check (PostgreSQL Write if Critical)
   ↓
7. Video Archival (MinIO Upload if violation detected)
   ↓
8. Notification Trigger (Telegram/Email)
```

**Vogels' Observation:**
> Step 2 (Redis buffer) is the **only** protection against RTSP jitter.
> If Redis OOM, frames drop = violations undetected.
> **Fix**: Max memory policy + eviction to disk (MinIO) before Redis full.

### Failure Path Scenarios

#### Scenario A: RTSP Camera Disconnect (Current: Undefined)

```
RTSP Disconnect → cv2.VideoCapture fails → Exception?
├─ Current: Unclear (no retry logic visible)
└─ Required: Exponential backoff + buffer drain
```

**Recommended Fix:**
```python
# Add to RTSP ingestion service
class RTSPStreamManager:
    def handle_disconnect(self):
        logger.warning("Camera disconnected, draining buffer...")
        # 1. Stop new frame ingestion
        # 2. Process remaining frames in Redis buffer
        # 3. Trigger reconnect with backoff
        # 4. Alert operations if > 1 min downtime
```

#### Scenario B: YOLO Service GPU Failure (Current: System Down)

```
GPU Failure → YOLO container exit → API health check fails →?
├─ Current: Total system failure
└─ Required: CPU fallback + alert
```

**Recommended Fix:**
```yaml
# docker-compose.yml - add fallback service
yolo-service-cpu:
  build: ./src/services/yolo
  environment:
    - YOLO_DEVICE=cpu
    - YOLO_MODEL_PATH=/models/yolov8n.pt
  restart: unless-stopped
  deploy:
    resources:
      limits:
        cpus: '4'  # Reserve 4 cores for CPU fallback
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8001/health"]
  # Only activate when GPU service fails (via orchestrator)
```

---

## Scalability Analysis

### Current Scale: Single Factory (Pilot)

**Assumptions:**
- 4 RTSP cameras
- 30 FPS per camera
- 640x480 resolution
- 1 detection per frame (YOLOv8n: ~10ms on GPU)

**Throughput Calculation:**
```
4 cameras × 30 FPS = 120 frames/second
YOLO processing time = 10ms/frame (GPU)
Required throughput = 120 × 0.01s = 1.2 GPU-seconds per second
= 1.2 GPUs required for real-time processing
```

**Vogels' Assessment:**
> **Current deployment: Single GPU edge device.**
> **Capacity:** ~83 FPS per GPU = 3 cameras @ 30 FPS with headroom.
> **Bottleneck:** YOLO service is horizontal scaling blocked (GPU affinity).

### Scaling Strategy (Phase 2: Multiple Factories)

**Option A: Vertical Scaling (Current Path)**
- Add second GPU to edge device
- Split cameras across GPUs
- **Cost:** Moderate
- **Complexity:** Low (same host)

**Option B: Horizontal Scaling (Cloud Path)**
- Move RTSP ingestion to edge (thin client)
- Stream frames to cloud GPU cluster
- **Cost:** High (bandwidth + cloud GPU)
- **Complexity:** High (network latency, stream management)

**Vogels' Recommendation:**
> **Stay with Option A (Vertical Scaling) for pilot.**
> Monolithic edge deployment = simpler operations.
> Only consider Option B when:
> - Multi-site deployment required (>5 factories)
> - Centralized monitoring demanded
> - Network latency acceptable (<50ms RTSP to cloud)

---

## Security Assessment

### Current Security Posture

| Layer | Status | Concerns |
|-------|--------|----------|
| RTSP Authentication | ❓ Undefined | Camera credentials in .env? |
| TLS/SSL | ✅ Configured | Self-signed only (OK for pilot) |
| Database Access | ⚠️ Hardcoded password | .env file required |
| Redis Auth | ✅ Enabled | `--requirepass ${REDIS_PASSWORD}` |
| MinIO Auth | ✅ Enabled | Access key + secret |
| API Auth | ⚠️ JWT only | No rate limiting visible |

### Critical Security Gaps

1. **No Input Validation on RTSP URLs**
   ```bash
   # .env.example (hypothetical)
   RTSP_CAMERA_1_URL=rtsp://user:pass@192.168.1.100:554/stream1
   ```
   Risk: SQL injection if URL logged to database without sanitization.

2. **No Network Segmentation**
   - All services on same `nextvision-network` bridge
   - YOLO service can reach PostgreSQL directly (should be API-only)
   - MinIO exposed on port 9000 to LAN (should be API-gated)

**Vogels' Security Principle:**
> **Defense in depth.** If one layer fails, others protect.
> Current: Single breach (API compromise) = full database access.
> Required: Network segmentation + least privilege.

---

## Integration Gaps

### Missing Components

1. **Rule Engine Implementation** (Critical)
   - No code exists for violation logic
   - No rule configuration schema
   - No rule testing framework

2. **Notification Service** (Critical)
   - No Telegram integration code
   - No email templates
   - No alert deduplication

3. **Web UI** (Optional for Pilot)
   - Referenced in docker-compose (Nginx)
   - No source code visible
   - May be out of scope for pilot

### Required Pre-Deployment Work

| Component | Effort | Blocker? |
|-----------|--------|----------|
| RTSP Reconnection Logic | 4 hours | Yes |
| CPU Fallback for YOLO | 2 hours | Yes |
| Rule Engine Core | 8 hours | Yes |
| Notification Service | 6 hours | Yes |
| Network Segmentation | 4 hours | No (can defer) |

**Total Critical Path:** ~24 hours engineering

---

## Deployment Readiness

### Pre-Flight Checklist Status

| Category | Item | Status | Evidence |
|----------|------|--------|----------|
| Infrastructure | Docker Compose exists | ✅ | docker-compose.yml |
| Infrastructure | GPU driver support | ⚠️ | Assumed, not verified |
| Infrastructure | Disk capacity (100GB+) | ⚠️ | No validation script |
| Data Layer | PostgreSQL migrations | ❌ | No migration files |
| Data Layer | Backup strategy | ❌ | No backup script |
| Monitoring | Health endpoints | ✅ | Defined in compose |
| Monitoring | Metrics collection | ⚠️ | Prometheus mentioned, not configured |
| Security | Secrets management | ⚠️ | .env file only |
| Security | TLS certificates | ⚠️ | Self-signed only |
| Operations | Rollback procedure | ✅ | Documented in runbook |
| Operations | Incident response | ⚠️ | No on-call rotation defined |

### Go/No-Go Decision

**Current Status:** 🟡 **NO-GO (Conditional)**

**Blockers:**
1. Missing RTSP reconnection logic
2. No CPU fallback for GPU failure
3. Rule engine not implemented
4. Notification service not implemented

**Path to GO:**
1. Implement RTSP reconnector (4h)
2. Add CPU fallback service (2h)
3. Implement rule engine v1 (8h)
4. Implement notification service (6h)
5. End-to-end test with dummy RTSP stream (2h)

**Total:** 22 hours = 1 day engineering + 1 day testing

**Deployment Decision:** **Week 2 deployment** (not Week 1 as planned)

---

## Recommendations (Prioritized)

### Must-Have (Pre-Pilot)

1. **Implement RTSP Reconnection Logic**
   - Exponential backoff reconnector
   - Frame buffer drain on disconnect
   - Disconnect alerting

2. **Add CPU Fallback for YOLO**
   - Secondary service without GPU requirement
   - Automatic failover via orchestrator
   - Performance monitoring (GPU vs CPU FPS)

3. **Implement Rule Engine v1**
   - Basic violation rules (no helmet, no vest)
   - Zone-based logic (production, welding)
   - Rule configuration via API

4. **Implement Notification Service**
   - Telegram bot integration
   - Email alerts for critical violations
   - Alert deduplication (5-minute window)

### Should-Have (Post-Pilot)

5. **Add Network Segmentation**
   - Separate VLAN for cameras
   - API-only access to data layer
   - MinIO behind API gateway

6. **Implement Backup Strategy**
   - Daily PostgreSQL dumps (automated)
   - MinIO archival to cold storage (weekly)
   - Backup restoration testing

7. **Add Monitoring Stack**
   - Prometheus + Grafana
   - Alertmanager for ops notifications
   - Dashboard for customer visibility

### Nice-to-Have (Phase 2)

8. **Implement Web UI**
   - Real-time violation feed
   - Historical analytics
   - Rule configuration UI

9. **Add Multi-Tenancy**
   - Separate database per factory
   - Isolated video storage
   - Tenant-specific authentication

10. **Implement Cloud Fallback**
    - Edge-to-cloud streaming
    - Cloud GPU cluster for overflow
    - Hybrid edge/cloud architecture

---

## Conclusion

NextVision architecture **fundamentally sound** but **incomplete for production deployment**. The service-oriented design, infrastructure-as-code approach, and data persistence strategy all demonstrate solid engineering. However, the **happy-path bias** in the current design will cause production failures when (not if) RTSP connections drop, GPUs crash, or cameras reboot.

**Deployment Recommendation:**
- **Week 1:** Complete RTSP reconnector, CPU fallback, rule engine, notification service
- **Week 2:** Deploy to pilot factory with comprehensive monitoring
- **Week 3-4:** Observe, iterate, harden based on production patterns

**Vogels' Final Verdict:**
> "The architecture is 80% complete. The remaining 20% — failure handling, fallback logic, and operational hardening — will determine success or failure in production. Ship the missing pieces first, then deploy."

---

**Next Steps:**
1. Fullstack agent: Implement RTSP reconnection logic
2. Fullstack agent: Implement rule engine core
3. DevOps agent: Configure CPU fallback service
4. DevOps agent: Implement notification service
5. QA agent: End-to-end testing with failure injection
6. CTO (Vogels): Final deployment sign-off

**Owner:** Werner Vogels (CTO)
**Review Date:** 2026-06-03
**Next Review:** Post-pilot (2026-07-03)
