# Resource Requirements - NextVision Pilot Deployment
**Date:** 2026-06-03
**Author:** Werner Vogels (CTO)
**Target:** Turkish Factory - 30 Day Pilot @ $1

---

## Executive Summary

NextVision occupational_safety modülü için **minimum production resource requirements** tanımlandı. Pilot deployment (4 kamera) için **2 GPU + 16GB RAM + 200GB disk** gereklidir.

**Critical Finding:** GPU resource management eksik. Single GPU failure = total system failure.

---

## Hardware Requirements

### Minimum Specification (Pilot - 4 Cameras)

#### Edge Device (On-Premise at Factory)

| Component | Minimum | Recommended | Rationale |
|-----------|---------|-------------|-----------|
| **GPU** | 1x NVIDIA T4 (16GB VRAM) | 2x NVIDIA T4 (16GB VRAM each) | YOLO inference GPU-bound. 1 GPU = 80 FPS capacity, 2 GPUs = 160 FPS (headroom) |
| **CPU** | 8 cores (Intel Xeon/AMD EPYC) | 16 cores | RTSP ingestion + API + background workers |
| **RAM** | 16 GB | 32 GB | Frame buffer + Redis + PostgreSQL + OS overhead |
| **Storage** | 200 GB SSD | 500 GB NVMe | Video archival (30 gün × 4 kamera × 5 GB/gün = 600 GB) |
| **Network** | 1 Gbps | 10 Gbps | RTSP streams (4 × 5 Mbps) + API + internal traffic |

#### Vogels' Assessment

> **GPU is the bottleneck.** Single GPU deployment = single point of failure.
> Minimum production-ready config: **2 GPUs** (active-active or active-passive).
> Cost delta: +$500/month. Failure cost: System down = customer churn.
> **Verdict: Budget for 2 GPUs.**

### Storage Breakdown

```
Total Storage: 500 GB (recommended)
├─ System + Docker Images:       50 GB
├─ PostgreSQL Data:             20 GB
├─ Redis Persistence:            5 GB
├─ MinIO Video Storage (30 gün): 400 GB
│   └─ 4 cameras × 5 MB/min × 60 min × 8 hr × 30 gün = 288 GB
│   └─ Overhead + metadata = 400 GB
└─ Buffer + Logs:               25 GB
```

**Growth Projection (Multi-Factory):**

```
1 factory (4 cameras):   400 GB/month
5 factories (20 cameras): 2 TB/month
10 factories (40 cameras): 4 TB/month
```

**Vogels' Recommendation:**
> Start with 500 GB local storage. At 80% capacity, trigger archival to cold storage (S3 Glacier equivalent).

---

## Software Requirements

### Operating System

| Component | Requirement | Version | Rationale |
|-----------|-------------|---------|-----------|
| **OS** | Ubuntu Server | 22.04 LTS | Long-term support until 2027 |
| **Kernel** | Linux kernel | 5.15+ | NVIDIA driver compatibility |
| **Docker** | Docker CE | 24.0+ | Docker Compose v2 syntax support |
| **NVIDIA Driver** | NVIDIA Driver | 525+ | CUDA 12.0 compatibility |

### Software Stack

```yaml
# Production stack versions
infrastructure:
  postgres: "16-alpine"
  redis: "7-alpine"
  minio: "latest"

ml_inference:
  ultralytics: "8.3.0"  # YOLOv8
  opencv: "4.10.0.84"
  torch: "2.4.0"  # PyTorch with CUDA support
  onnxruntime: "1.19.2"  # CPU fallback option

application:
  nodejs: "20+"  # Next.js API
  python: "3.12+"  # AI worker
  nginx: "alpine"  # Reverse proxy
```

### External Dependencies

```bash
# Required for YOLO GPU inference
nvidia-container-toolkit  # Docker GPU support
cuda-libraries  # CUDA runtime (12.0+)
cudnn  # Deep learning primitives

# Required for RTSP ingestion
ffmpeg  # Video stream processing
libopencv-dev  # OpenCV dependencies

# Required for operations
openssl  # Certificate generation
curl  # Health checks
logrotate  # Log management
```

---

## Network Requirements

### Bandwidth Calculation

```
RTSP Streams (4 cameras @ 30 FPS, 640x480, H.264):
├─ Per camera: 5 Mbps (worst case)
├─ Total inbound: 4 × 5 = 20 Mbps
└─ Total outbound (API + monitoring): 2 Mbps

Peak bandwidth: 22 Mbps
Average bandwidth: 15 Mbps (motion-adaptive encoding)
```

### Latency Requirements

| Connection | Max Latency | Rationale |
|------------|-------------|-----------|
| RTSP Camera → Edge Device | 10 ms | Local network, minimal jitter |
| Edge Device → PostgreSQL | 1 ms | Local container, localhost |
| Edge Device → MinIO | 1 ms | Local container, localhost |
| Edge Device → Customer Network | 50 ms | VPN tunnel for remote access |

### Firewall Requirements

```yaml
# Required inbound ports (from LAN)
inbound:
  - port: 443
    proto: TCP
    source: Factory LAN
    desc: HTTPS API access
  - port: 9001
    proto: TCP
    source: Management subnet
    desc: MinIO console (admin only)

# Required outbound ports (to internet)
outbound:
  - port: 443
    proto: TCP
    desc: Telegram Bot API (notifications)
  - port: 53
    proto: UDP/TCP
    desc: DNS resolution

# Internal container traffic (bridge network)
internal:
  - postgres: 5432
  - redis: 6379
  - minio: 9000
  - yolo-service: 8000
  - api: 3000
```

---

## Human Resources

### Pre-Deployment (Week 1)

| Role | Hours | Tasks |
|------|-------|-------|
| Fullstack Engineer | 16h | Implement RTSP reconnection, Rule engine, Notification service |
| DevOps Engineer | 12h | Configure GPU fallback, Monitoring stack, Backup scripts |
| QA Engineer | 8h | End-to-end testing, Failure injection testing |

**Total: 36 hours (1 week)**

### Pilot Operations (30 Days)

| Role | Time Commitment | Responsibilities |
|------|-----------------|-------------------|
| DevOps (On-Call) | 2 hours/day | Health checks, Incident response, Backup verification |
| Fullstack (As Needed) | 5 hours/week | Bug fixes, Rule configuration updates |
| Customer Support | 1 hour/day | User questions, Training |

**Total: ~80 hours over 30 days**

### Post-Pilot (Transition)

| Role | Hours | Tasks |
|------|-------|-------|
| Sales | 8h | Customer feedback, Renewal negotiation |
| Product | 8h | Feature prioritization, Roadmap planning |
| CTO | 4h | Architecture review, Scale planning |

---

## Financial Requirements

### One-Time Costs (Pilot Setup)

| Item | Cost | Notes |
|------|------|-------|
| Edge Device (2x GPU, 32GB RAM, 500GB NVMe) | $3,500 | Capital expenditure |
| Network switch (10 Gbps) | $500 | Factory network upgrade |
| UPS + Rack | $300 | Power protection |
| Installation + Travel | $1,000 | On-site setup |
| **Total One-Time** | **$5,300** | |

### Monthly Recurring Costs

| Item | Cost | Notes |
|------|------|-------|
| Edge Device hosting (electricity + cooling) | $150 | Factory-provided space |
| Internet connection (100 Mbps dedicated) | $100 | Factory network upgrade |
| Backup storage (cloud archival) | $50 | 200 GB/month to S3 Glacier |
| Monitoring service (Grafana Cloud) | $0 | Self-hosted alternative |
| Telegram Bot API | $0 | Free tier |
| **Total Monthly** | **$300** | |

### Pilot Revenue (30 Days @ $1)

```
Revenue: $1 (pilot pricing)
Net margin: $1 - $300 = -$299 (loss leader)
```

**Vogels' Assessment:**
> Pilot pricing ($1) operationally irrelevant. Focus on **conversion pricing** ($500/month post-pilot) for ROI calculation.

### Post-Pilot Pricing Model

**Projected Monthly Cost (Single Factory):**

| Item | Cost | Notes |
|------|------|-------|
| Edge Device depreciation | $100 | 36-month amortization |
| Hosting + Internet | $300 | Factory network |
| Operations (on-call) | $500 | 20 hours/month @ $25/hr |
| Backup + Archival | $100 | Cloud storage + retention |
| **Total Cost** | **$1,000/month** | |

**Gross Margin Target:**
```
Target price: $1,500/month
Cost: $1,000/month
Gross margin: $500/month (33%)
```

**Vogels' Pricing Principle:**
> **Margin > Complexity.** If operations cost > 50% of revenue, simplify or raise prices.
> Current: $500 ops cost on $1500 price = 33% ✅ Acceptable.

---

## Scalability Requirements

### Horizontal Scaling (Multi-Factory)

**Per-Factory Resource Requirements:**

| Component | 1 Factory | 5 Factories | 10 Factories |
|-----------|-----------|-------------|---------------|
| **Edge Devices** | 1× 2-GPU | 5× 2-GPU | 10× 2-GPU |
| **Central Services** | Shared | Shared | Shared |
| ├─ PostgreSQL | 4 CPU, 8 GB | 8 CPU, 16 GB | 16 CPU, 32 GB |
| ├─ Redis | 2 CPU, 4 GB | 4 CPU, 8 GB | 8 CPU, 16 GB |
| ├─ MinIO | 4 CPU, 8 GB | 8 CPU, 16 GB + 2 TB | 16 CPU, 32 GB + 5 TB |
| └─ API Cluster | 2 instances | 4 instances | 8 instances |

**Central Infrastructure (Optional):**

```yaml
# Cloud-hosted central services (alternative to edge-only)
architecture: hybrid_edge_cloud

edge:
  - RTSP ingestion (thin client)
  - Frame buffering (Redis)
  - YOLO inference (GPU)

cloud:
  - PostgreSQL (managed)
  - MinIO (S3)
  - API cluster (auto-scaling)
  - Notification service
  - Monitoring (Grafana Cloud)

trade_offs:
  - Pros: Horizontal scaling, centralized ops, simplified updates
  - Cons: Network latency, bandwidth cost, single point of failure
```

**Vogels' Scaling Recommendation:**
> **Stay edge-only until 10 factories.** Cloud overhead (latency, bandwidth) outweighs benefits at small scale.
> At 10+ factories, evaluate hybrid architecture.

---

## Reliability Requirements

### Uptime Target

| Metric | Target | Measurement |
|--------|--------|-------------|
| **System Uptime** | 99.5% | All services healthy |
| **Detection Availability** | 99% | At least 3 of 4 cameras processing |
| **Data Durability** | 99.99% | No detection data loss |
| **Recovery Time** | < 5 minutes | Service restoration |
| **Data Recovery** | < 1 hour | Database restoration |

### Failure Mode Coverage

```yaml
failure_modes:
  gpu_crash:
    detection: Health check failure (YOLO service)
    recovery: CPU fallback activation
    time_to_recover: 30 seconds
    data_loss: 0 (frames in Redis buffer)

  camera_disconnect:
    detection: RTSP frame timeout
    recovery: Exponential backoff reconnect
    time_to_recover: 2 minutes (5 retries)
    data_loss: Frames during disconnect (acceptable)

  postgresql_corruption:
    detection: Health check failure
    recovery: Daily backup restore
    time_to_recover: 1 hour
    data_loss: < 24 hours (acceptable for pilot)

  disk_full:
    detection: MinIO write error
    recovery: Auto-archival to cloud
    time_to_recover: 10 minutes
    data_loss: 0 (upload queue drains to cloud)
```

### Backup Strategy

```yaml
backups:
  postgresql:
    frequency: daily
    retention: 7 days
    method: pg_dump + upload to cloud
    rpo: 24 hours
    rto: 1 hour

  redis:
    frequency: continuous (AOF)
    retention: 1 day
    method: AOF file sync
    rpo: 1 second
    rto: 5 minutes

  minio:
    frequency: daily
    retention: 30 days (local) + 90 days (cloud)
    method: mc mirror to cloud
    rpo: 24 hours
    rto: 4 hours
```

---

## Security Requirements

### Access Control

```yaml
access_levels:
  admin:
    - Full system access
    - Database management
    - User management
    - assigned_to: [DevOps, CTO]

  operator:
    - View detection feed
    - Manage camera configuration
    - View reports
    - assigned_to: [Factory Manager]

  viewer:
    - View detection feed
    - View reports
    - assigned_to: [Safety Officers, Factory Staff]
```

### Audit Requirements

| Event | Logging Required | Retention |
|-------|-----------------|-----------|
| User login | ✅ | 1 year |
| Detection result | ✅ | 90 days |
| System configuration change | ✅ | 1 year |
| Camera connect/disconnect | ✅ | 30 days |
| API access (admin endpoints) | ✅ | 1 year |

---

## Monitoring Requirements

### Metrics Collection

```yaml
metrics:
  system_metrics:
    - cpu_usage_percent (all services)
    - memory_usage_bytes (all services)
    - disk_io_percent (MinIO, PostgreSQL)
    - gpu_usage_percent (YOLO service)
    - network_throughput (RTSP ingestion)

  application_metrics:
    - rtsp_frames_ingested_total
    - rtsp_frames_dropped_total
    - yolo_inference_duration_seconds
    - yolo_fps_current
    - redis_buffer_size
    - postgresql_write_duration_seconds
    - minio_upload_duration_seconds

  business_metrics:
    - violations_detected_total
    - violations_by_severity
    - cameras_connected_total
    - uptime_percent
```

### Alerting Rules

```yaml
alerts:
  critical:
    - GPU service down > 1 minute
    - PostgreSQL unavailable
    - MinIO disk > 90% full
    - > 2 cameras disconnected

  warning:
    - GPU utilization > 90%
    - Redis memory > 80%
    - API latency > 500ms
    - Frame drop rate > 5%

  info:
    - Daily backup completed
    - System health report ready
```

---

## Deployment Checklist

### Pre-Deployment Validation

- [ ] Hardware procured and tested (2x GPU, 32GB RAM, 500GB NVMe)
- [ ] Network configured (1 Gbps LAN, firewall rules)
- [ ] OS installed (Ubuntu 22.04 LTS, NVIDIA drivers)
- [ ] Docker + NVIDIA Container Toolkit installed
- [ ] SSL certificates generated (self-signed OK for pilot)
- [ ] Environment variables configured (.env file)
- [ ] PostgreSQL migrations tested
- [ ] YOLO model downloaded and verified
- [ ] RTSP camera credentials tested
- [ ] Backup destination configured (cloud storage)
- [ ] Monitoring stack deployed (Prometheus + Grafana)
- [ ] Alerting configured (Telegram bot integration)
- [ ] Runbook reviewed and printed
- [ ] On-call rotation defined

### Day 1 Validation

- [ ] All 4 cameras connected and streaming
- [ ] YOLO service processing at 80+ FPS
- [ ] Detection results visible in database
- [ ] MinIO storing video clips
- [ ] Notification service sending alerts
- [ ] Grafana dashboard showing all metrics
- [ ] Customer training completed

---

## Conclusion

NextVision pilot deployment için **minimum resource requirements** tanımlandı. En kritik resource GPU'dir (2x NVIDIA T4 recommended). Total one-time cost: $5,300, monthly cost: $300.

**Vogels' Final Recommendation:**
> Budget for 2 GPUs from day one. Single GPU failure = total system failure = customer lost.
> $500/month additional GPU cost is insurance against $1,500/month customer churn.

---

**Owner:** Werner Vogels (CTO)
**Date:** 2026-06-03
**Approved By:** CEO (Bezos) - Pending
**Next Action:** Procurement approval from CEO
