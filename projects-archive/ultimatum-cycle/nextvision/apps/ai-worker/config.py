"""
Configuration for PPE Detection Worker
Environment-based settings for production deployment
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings"""

    # Model paths
    MODEL_PATH = os.getenv(
        "MODEL_PATH",
        Path(__file__).parent.parent.parent / "models" / "ppe_detector.pt"
    )

    # Redis connection
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))

    # Detection thresholds
    CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
    IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.45"))

    # Processing
    IMAGE_SIZE = int(os.getenv("IMAGE_SIZE", "640"))
    MAX_BATCH_SIZE = int(os.getenv("MAX_BATCH_SIZE", "1"))

    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    # Performance monitoring
    ENABLE_METRICS = os.getenv("ENABLE_METRICS", "true").lower() == "true"


settings = Settings()
