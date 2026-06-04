FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY apps/ai-worker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY apps/ai-worker/ /app/ai-worker/
COPY models/ /app/models/

# Create directories
RUN mkdir -p /app/logs

# Set environment
ENV PYTHONPATH=/app
ENV MODEL_PATH=/app/models/ppe_detector.pt

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "from ai_worker.ppe_detector import PPEDetector; detector = PPEDetector(); exit(0 if detector.load_model() else 1)"

# Run worker
CMD ["python", "-m", "ai_worker.main"]
