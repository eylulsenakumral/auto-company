#!/usr/bin/env python3
"""
Download PPE Detection Model from Hugging Face

Model: YOLOv8n PPE Detection (6 Classes)
Source: https://huggingface.co/Tanishjain9/yolov8n-ppe-detection-6classes
"""

import os
import sys
from pathlib import Path
from loguru import logger

try:
    from huggingface_hub import hf_hub_download
except ImportError:
    logger.error("huggingface-hub not installed. Run: pip install huggingface-hub")
    sys.exit(1)


REPO_ID = "Tanishjain9/yolov8n-ppe-detection-6classes"
FILENAME = "best.pt"


def download_model(target_dir: Path = None) -> Path:
    """
    Download PPE detection model from Hugging Face

    Args:
        target_dir: Directory to save model (defaults to models/)

    Returns:
        Path to downloaded model file
    """
    if target_dir is None:
        target_dir = Path(__file__).parent.parent.parent / "models"

    target_dir.mkdir(parents=True, exist_ok=True)
    model_path = target_dir / FILENAME

    logger.info(f"Downloading model from {REPO_ID}...")
    logger.info(f"Target: {model_path}")

    try:
        downloaded_path = hf_hub_download(
            repo_id=REPO_ID,
            filename=FILENAME,
            local_dir=str(target_dir),
            local_dir_use_symlinks=False
        )

        logger.success(f"Model downloaded successfully: {downloaded_path}")
        logger.info(f"File size: {os.path.getsize(downloaded_path) / 1024 / 1024:.1f} MB")

        return Path(downloaded_path)

    except Exception as e:
        logger.error(f"Failed to download model: {e}")
        logger.info("Manual download: https://huggingface.co/Tanishjain9/yolov8n-ppe-detection-6classes")
        sys.exit(1)


def main():
    """CLI entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="Download PPE detection model")
    parser.add_argument(
        "--target-dir",
        type=Path,
        help="Target directory for model file",
        default=None
    )

    args = parser.parse_args()

    model_path = download_model(args.target_dir)

    logger.info(f"Model ready: {model_path}")
    logger.info("Set MODEL_PATH environment variable to use this model")


if __name__ == "__main__":
    main()
