# NextVision - Occupational Safety AI

**Autonomous AI Company - Product Line**

Real-time Personal Protective Equipment (PPE) detection for factory safety compliance.

## Mission

**Zero workplace injuries through AI-powered safety monitoring.**

## Product

NextVision detects PPE violations in real-time using computer vision:

- **Helmet detection** - Hard hat compliance
- **Vest detection** - High-visibility safety vests
- **Gloves detection** - Hand protection
- **Safety shoes detection** - Foot protection
- **Goggles & masks** - Eye and face protection

## Architecture

**Monolith-first design** - Simple, deployable, maintainable:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ RTSP Camera │ ──> │ PPE Worker   │ ──> │ Redis Pub   │
│ (IP Camera) │     │ (YOLOv8)     │     │ (Results)   │
└─────────────┘     └──────────────┘     └─────────────┘
                                                  │
                                                  ↓
                                          ┌─────────────┐
                                          │ Frontend    │
                                          │ (Dashboard) │
                                          └─────────────┘
```

## Quick Start

### 1. Clone & Setup

```bash
cd projects/nextvision/deploy/ppe_model_package
./setup.sh
```

### 2. Configure

```bash
cp apps/ai-worker/.env.example apps/ai-worker/.env
# Edit .env with your settings
```

### 3. Deploy

```bash
docker-compose up -d
```

## Performance

- **Accuracy:** mAP@50 0.81
- **Speed:** 30-60 FPS (CPU), 100+ FPS (GPU)
- **Latency:** <50ms per frame
- **Model:** 6 MB (edge-friendly)

## Documentation

- [Integration Guide](docs/fullstack/ppe_model_integration.md) - Implementation details
- [Test Results](docs/fullstack/ppe_model_test_results.md) - Performance benchmarks
- [AI Worker README](apps/ai-worker/README.md) - Worker documentation

## Roadmap

### ✅ Phase 1: Pretrained Model (COMPLETE)

Production-ready PPE detection using YOLOv8n pretrained model.

- [x] Model selection and integration
- [x] Redis pub/sub pipeline
- [x] Docker deployment
- [x] Test suite
- [x] Documentation

### 📋 Phase 2: Data Collection (CURRENT)

Collect real factory data for domain-specific fine-tuning.

- [ ] Deploy to pilot location
- [ ] Record 100-500 hours footage
- [ ] Extract violation examples
- [ ] Build annotation dataset

### 🔮 Phase 3: Fine-tuning (FUTURE)

Optimize for specific factory environments.

- [ ] Train on factory-specific data
- [ ] Improve accuracy to >0.90 mAP
- [ ] Optimize for lighting conditions
- [ ] Deploy updated model

## Tech Stack

- **AI/ML:** Ultralytics YOLOv8, PyTorch, OpenCV
- **Infrastructure:** Redis, Docker, Docker Compose
- **Monitoring:** Loguru, performance metrics
- **Hardware:** CPU/GPU, NVIDIA Jetson (edge)

## Business Model

### Pilot Program

**Target:** Small-medium manufacturers (10-100 workers)

**Offering:**
- Free 2-week pilot
- Hardware: 1-2 cameras
- Software: NextVision PPE detection
- Reporting: Daily violation reports

**Pricing:** $500-1000/month after pilot

### Enterprise

**Target:** Large manufacturers (100+ workers)

**Offering:**
- Multi-site deployment
- Custom fine-tuning
- Real-time alerting
- API integration

**Pricing:** $2000-5000/month/site

## Deployment Guide

See [deploy/ppe_model_package/](deploy/ppe_model_package/) for:
- Setup scripts
- Docker configuration
- Environment variables
- Health checks

## Monitoring

### Key Metrics

1. **Detection Accuracy** - mAP@50 target: >0.80
2. **Performance** - FPS target: >30
3. **Uptime** - Target: >99.5%
4. **False Positives** - Target: <5%

### Alerts

- FPS < 25: Performance issue
- Latency > 150ms: Network bottleneck
- CPU/GPU > 90%: Scale up

## License

- **Model:** Apache 2.0 (Hugging Face)
- **Code:** ISC
- **Commercial use:** Allowed

## Support

For deployment issues or questions, see documentation in `docs/fullstack/`.

---

**Auto Company - Autonomous AI Company**
*Make money legally. Build valuable products. Ship fast.*
