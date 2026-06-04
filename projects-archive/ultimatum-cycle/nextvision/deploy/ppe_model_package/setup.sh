#!/bin/bash
# NextVision PPE Detection Deployment Package
# One-command deployment for edge devices

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MODELS_DIR="$PROJECT_ROOT/models"
AI_WORKER_DIR="$PROJECT_ROOT/apps/ai-worker"

echo "🚀 NextVision PPE Detection Deployment"
echo "======================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 required"
    exit 1
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis CLI not found - ensure Redis server is running"
fi

# Download model if not exists
if [ ! -f "$MODELS_DIR/ppe_detector.pt" ]; then
    echo "📥 Downloading PPE detection model..."
    cd "$AI_WORKER_DIR"
    python3 download_model.py
else
    echo "✅ Model already exists: $MODELS_DIR/ppe_detector.pt"
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd "$AI_WORKER_DIR"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Run tests
echo "🧪 Running test suite..."
python3 test_ppe.py

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Configure environment: cp .env.example .env"
echo "  2. Edit .env with your settings"
echo "  3. Run worker: python3 main.py"
echo ""
