"""
PPE Detection Worker for NextVision
YOLOv8-based Personal Protective Equipment detection

Target classes: helmet, vest, gloves, safety_shoe, goggles, mask
"""

import os
import json
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

import cv2
import numpy as np
from ultralytics import YOLO
import redis
from loguru import logger

from config import settings


@dataclass
class Detection:
    """Single detection result"""
    class_id: int
    class_name: str
    confidence: float
    bbox: List[int]  # [x1, y1, x2, y2]


@dataclass
class PPEFrameResult:
    """Complete PPE detection result for a frame"""
    frame_id: int
    timestamp: float
    detections: List[Detection]
    image_shape: tuple


class PPEDetector:
    """
    YOLOv8-based PPE detection

    Production-ready, optimized for edge deployment
    """

    # Class mapping (matches HuggingFace model)
    CLASS_NAMES = {
        0: "Gloves",
        1: "Vest",
        2: "goggles",
        3: "helmet",
        4: "mask",
        5: "safety_shoe"
    }

    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize PPE detector

        Args:
            model_path: Path to .pt model file (defaults to models/ppe_detector.pt)
        """
        if model_path is None:
            model_path = settings.MODEL_PATH

        self.model_path = Path(model_path)
        self.model = None
        self.redis_client = None

        logger.info(f"PPE Detector initialized with model: {self.model_path}")

    def load_model(self) -> bool:
        """Load YOLOv8 model into memory"""
        try:
            if not self.model_path.exists():
                logger.error(f"Model file not found: {self.model_path}")
                logger.info("Download model from: https://huggingface.co/Tanishjain9/yolov8n-ppe-detection-6classes")
                return False

            self.model = YOLO(str(self.model_path))
            logger.info(f"Model loaded successfully: {self.model_path}")

            # Warmup
            dummy = np.zeros((640, 640, 3), dtype=np.uint8)
            _ = self.model.predict(dummy, verbose=False)

            return True

        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return False

    def connect_redis(self) -> bool:
        """Connect to Redis for pub/sub"""
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                decode_responses=True
            )

            # Test connection
            self.redis_client.ping()
            logger.info(f"Connected to Redis: {settings.REDIS_HOST}:{settings.REDIS_PORT}")
            return True

        except Exception as e:
            logger.error(f"Redis connection failed: {e}")
            return False

    def detect(
        self,
        image: np.ndarray,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45
    ) -> PPEFrameResult:
        """
        Run PPE detection on a single frame

        Args:
            image: Input image (BGR format from OpenCV)
            conf_threshold: Confidence threshold for detections
            iou_threshold: IoU threshold for NMS

        Returns:
            PPEFrameResult with all detections
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        start_time = time.time()

        # Run inference
        results = self.model.predict(
            image,
            conf=conf_threshold,
            iou=iou_threshold,
            imgsz=640,
            verbose=False
        )[0]

        # Parse detections
        detections = []

        if results.boxes is not None:
            boxes = results.boxes.cpu().numpy()

            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].astype(int).tolist()

                detections.append(Detection(
                    class_id=class_id,
                    class_name=self.CLASS_NAMES.get(class_id, "unknown"),
                    confidence=confidence,
                    bbox=bbox
                ))

        return PPEFrameResult(
            frame_id=0,  # Will be set by worker
            timestamp=time.time(),
            detections=detections,
            image_shape=image.shape
        )

    def publish_result(self, result: PPEFrameResult, channel: str = "ppe:detections"):
        """Publish detection results to Redis"""
        if self.redis_client is None:
            logger.warning("Redis not connected, skipping publish")
            return

        # Convert to JSON-serializable format
        payload = {
            "frame_id": result.frame_id,
            "timestamp": result.timestamp,
            "image_shape": result.image_shape,
            "detections": [
                {
                    "class_id": d.class_id,
                    "class_name": d.class_name,
                    "confidence": d.confidence,
                    "bbox": d.bbox
                }
                for d in result.detections
            ]
        }

        try:
            self.redis_client.publish(channel, json.dumps(payload))
            logger.debug(f"Published {len(result.detections)} detections to {channel}")

        except Exception as e:
            logger.error(f"Failed to publish result: {e}")

    def process_frame(
        self,
        image: np.ndarray,
        frame_id: int,
        publish: bool = True
    ) -> PPEFrameResult:
        """
        Complete pipeline: detect + publish

        Args:
            image: Input frame
            frame_id: Sequential frame identifier
            publish: Whether to publish to Redis

        Returns:
            PPEFrameResult
        """
        result = self.detect(image)
        result.frame_id = frame_id

        if publish:
            self.publish_result(result)

        return result

    def run_stream_demo(self, video_path: str, max_frames: int = 100):
        """
        Demo: Run detection on video file

        Args:
            video_path: Path to video file
            max_frames: Maximum frames to process (for testing)
        """
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            logger.error(f"Cannot open video: {video_path}")
            return

        frame_count = 0
        fps_sum = 0
        fps_count = 0

        logger.info(f"Starting demo on {video_path}")

        try:
            while frame_count < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break

                start = time.time()
                result = self.process_frame(frame, frame_id=frame_count, publish=False)
                elapsed = time.time() - start

                fps = 1.0 / elapsed if elapsed > 0 else 0
                fps_sum += fps
                fps_count += 1

                if frame_count % 10 == 0:
                    avg_fps = fps_sum / fps_count if fps_count > 0 else 0
                    logger.info(
                        f"Frame {frame_count}: {len(result.detections)} detections, "
                        f"FPS: {avg_fps:.1f}"
                    )

                frame_count += 1

        finally:
            cap.release()
            avg_fps = fps_sum / fps_count if fps_count > 0 else 0
            logger.info(f"Demo complete. Processed {frame_count} frames at {avg_fps:.1f} FPS")


def main():
    """Demo entry point"""
    detector = PPEDetector()

    if not detector.load_model():
        logger.error("Failed to load model")
        return

    logger.info("PPE Detector ready")
    logger.info("Classes: " + ", ".join(detector.CLASS_NAMES.values()))
    logger.info("Model: " + str(detector.model_path))


if __name__ == "__main__":
    main()
