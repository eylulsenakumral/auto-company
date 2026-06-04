# NextVision AI Worker - PPE Detection

Personal Protective Equipment (PPE) detection worker using YOLOv8.

## Architecture

**Monolith First** - Single deployment unit with:
- YOLOv8 model inference
- Redis pub/sub for real-time results
- Health monitoring
- Performance metrics

## Quick Start

### 1. Install Dependencies

```bash
cd apps/ai-worker
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Download Model

```bash
python download_model.py
```

This downloads the model from [Hugging Face](https://huggingface.co/Tanishjain9/yolov8n-ppe-detection-6classes).

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Redis settings
```

### 4. Run Tests

```bash
python test_ppe.py
```

## Detection Classes

| Class ID | Class Name |
|----------|------------|
| 0 | Gloves |
| 1 | Vest |
| 2 | goggles |
| 3 | helmet |
| 4 | mask |
| 5 | safety_shoe |

## Model Performance

- **mAP@50:** ~0.81
- **Inference Speed:** ~30-60 FPS (CPU), ~100+ FPS (GPU)
- **Model Size:** ~6 MB (YOLOv8n)

## Integration

The worker publishes detection results to Redis:

```python
# Subscribe to detections
redis_client.pubsub().subscribe("ppe:detections")

# Result format
{
    "frame_id": 123,
    "timestamp": 1234567890.123,
    "image_shape": [1080, 1920, 3],
    "detections": [
        {
            "class_id": 3,
            "class_name": "helmet",
            "confidence": 0.92,
            "bbox": [100, 150, 200, 250]
        }
    ]
}
```

## Deployment

See `deploy/` directory for deployment scripts and configurations.

## Fine-tuning (Phase 3)

To fine-tune on factory-specific data:

1. Collect dataset from factory cameras
2. Annotate using Roboflow/CVAT
3. Train using Ultralytics CLI
4. Export ONNX for edge deployment

## License

Model: Apache 2.0 (see Hugging Face model card)
Code: ISC
