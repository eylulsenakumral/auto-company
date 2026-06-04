# RTSP Camera Setup Guide - NextVision Pilot Deployment

**Target:** Turkish Factory Floor Occupational Safety Monitoring
**Deployment:** Week 1, Cycle 32
**Owner:** DevOps/SRE - Hightower

## Overview

RTSP (Real-Time Streaming Protocol) cameras are the primary video input source for NextVision occupational safety monitoring. This guide covers configuration, network requirements, and troubleshooting for factory deployment.

---

## Camera Requirements

### Minimum Specifications

| Requirement | Specification | Notes |
|-------------|---------------|-------|
| **Video Protocol** | RTSP (TCP/UDP) | Must support standard RTSP streaming |
| **Resolution** | 720p minimum (1080p recommended) | Higher resolution improves detection accuracy |
| **Frame Rate** | 15 FPS minimum (30 FPS recommended) | Smoother motion tracking |
| **Latency** | < 500ms | Critical for real-time safety alerts |
| **Authentication** | Basic/Digest Auth | Supports password-protected streams |
| **Network** | Wired Ethernet (WiFi not recommended) | Factory floor interference |

### Recommended Camera Brands

- **Hikvision** - Factory rugged, good RTSP support
- **Dahua** - Excellent low-light performance
- **Axis Communications** - Enterprise-grade, high reliability
- **Hanwha Techwin** - Wide temperature range

---

## Network Configuration

### Network Topology

```
Factory Floor
├── Camera Subnet: 192.168.10.0/24
│   ├── Camera 1: 192.168.10.100 (Production Line A)
│   ├── Camera 2: 192.168.10.101 (Production Line B)
│   └── Camera 3: 192.168.10.102 (Loading Dock)
└── Edge Server: 192.168.10.50 (NextVision Host)
```

### Port Requirements

| Service | Protocol | Port | Direction |
|---------|----------|------|----------|
| RTSP Stream | TCP | 554 | Inbound (from cameras) |
| RTCP | UDP | 555-559 | Inbound |
| HTTP (Camera config) | TCP | 80/443 | Bidirectional |
| ONVIF | TCP | 8080 | Optional |

### Firewall Rules

```bash
# Allow RTSP streams from camera subnet
iptables -A INPUT -p tcp -s 192.168.10.0/24 --dport 554 -j ACCEPT

# Allow camera HTTP/HTTPS (for configuration)
iptables -A INPUT -p tcp -s 192.168.10.0/24 --dport 80 -j ACCEPT
iptables -A INPUT -p tcp -s 192.168.10.0/24 --dport 443 -j ACCEPT

# Allow RTCP (UDP)
iptables -A INPUT -p udp -s 192.168.10.0/24 --dport 555:559 -j ACCEPT
```

---

## Camera Configuration Templates

### Hikvision Configuration

```bash
# RTSP URL Format
rtsp://<username>:<password>@<ip>:554/Streaming/Channels/101

# Example for Production Line A
RTSP_CAMERA_1_URL=rtsp://admin:password123@192.168.10.100:554/Streaming/Channels/101
RTSP_CAMERA_1_NAME="Production Line A - Main View"
RTSP_CAMERA_1_LOCATION="factory_floor_north"

# Stream Parameters
# /101 = Main stream (high resolution)
# /102 = Sub stream (low resolution, use if bandwidth limited)
```

### Dahua Configuration

```bash
# RTSP URL Format
rtsp://<username>:<password>@<ip>:554/cam/realmonitor?channel=1&subtype=0

# Example
RTSP_CAMERA_2_URL=rtsp://admin:password123@192.168.10.101:554/cam/realmonitor?channel=1&subtype=0
RTSP_CAMERA_2_NAME="Production Line B - Assembly Area"
RTSP_CAMERA_2_LOCATION="factory_floor_south"

# subtype=0 = Main stream
# subtype=1 = Sub stream
```

### Axis Configuration

```bash
# RTSP URL Format
rtsp://<username>:<password>@<ip>:554/axis-media/media.amp

# Example
RTSP_CAMERA_3_URL=rtsp://admin:password123@192.168.10.102:554/axis-media/media.amp
RTSP_CAMERA_3_NAME="Loading Dock - Entry/Exit"
RTSP_CAMERA_3_LOCATION="loading_dock_main"

# Add parameters for resolution
# ?resolution=1920x1080&fps=30
```

### Generic ONVIF Configuration

```bash
# RTSP URL Format (most ONVIF cameras)
rtsp://<username>:<password>@<ip>:554/onvif/profile1

# Example for unknown camera brand
RTSP_CAMERA_4_URL=rtsp://admin:password123@192.168.10.103:554/onvif/profile1
```

---

## Integration with NextVision

### Environment Configuration

```bash
# .env file configuration
RTSP_CAMERA_1_URL=rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101
RTSP_CAMERA_1_NAME="Production Line A"
RTSP_CAMERA_1_LOCATION="factory_floor_north"
RTSP_CAMERA_1_ENABLED=true

RTSP_CAMERA_2_URL=rtsp://admin:password@192.168.10.101:554/cam/realmonitor?channel=1&subtype=0
RTSP_CAMERA_2_NAME="Production Line B"
RTSP_CAMERA_2_LOCATION="factory_floor_south"
RTSP_CAMERA_2_ENABLED=true
```

### Camera Testing Before Deployment

```bash
# 1. Test RTSP stream manually
ffplay rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101

# Expected: Video stream displays within 3 seconds

# 2. Test with FFprobe (check stream details)
ffprobe -v quiet -print_format json -show_streams \
  rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101

# Expected output:
# {
#   "streams": [{
#     "codec_name": "h264",
#     "width": 1920,
#     "height": 1080,
#     "r_frame_rate": "30/1"
#   }]
# }

# 3. Test latency measurement
timeout 10 ffplay -t 5 rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101 \
  -nodisp 2>&1 | grep -i "delay"

# 4. Test network connectivity
ping -c 10 192.168.10.100
# Expected: < 2ms latency, 0% packet loss

# 5. Test RTSP port connectivity
telnet 192.168.10.100 554
# Expected: Connection established
```

---

## Troubleshooting Guide

### Issue: Camera Unreachable

**Symptoms:**
- "Connection timeout" errors
- RTSP URL fails to connect

**Diagnosis:**
```bash
# 1. Check network connectivity
ping -c 5 192.168.10.100

# 2. Check RTSP port
telnet 192.168.10.100 554

# 3. Check ARP table (camera is on network)
arp -n | grep 192.168.10.100

# 4. Check camera HTTP interface
curl http://192.168.10.100/

# 5. Test with VLC (RTSP diagnostic tool)
vlc -vvv rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101
```

**Solutions:**
1. Verify camera is powered on (check LED indicators)
2. Check network cable connection
3. Verify IP address is correct
4. Check camera's web interface (http://<camera-ip>)
5. Restart camera via web interface

---

### Issue: Authentication Failed

**Symptoms:**
- "401 Unauthorized"
- "Authentication required"

**Diagnosis:**
```bash
# Test with different credentials
curl -v --digest -u admin:password \
  rtsp://192.168.10.100:554/Streaming/Channels/101
```

**Solutions:**
1. Verify username/password in camera web interface
2. Check if camera uses Digest Auth (most common) or Basic Auth
3. Reset camera to factory defaults if password unknown
4. Create dedicated RTSP user for NextVision

---

### Issue: Video Lag/High Latency

**Symptoms:**
- Video delay > 2 seconds
- Frame drops/stuttering

**Diagnosis:**
```bash
# Measure network latency
ping -c 100 192.168.10.100 | tail -n 1

# Check packet loss
mtr -r -c 100 192.168.10.100

# Check RTCP statistics (if available)
ffprobe -v error -show_error rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101
```

**Solutions:**
1. Reduce video resolution (use sub-stream)
2. Reduce frame rate (30 FPS → 15 FPS)
3. Use wired Ethernet instead of WiFi
4. Check network switch port capacity
5. Add QoS for RTSP traffic

---

### Issue: Intermittent Connection

**Symptoms:**
- Camera connects, then disconnects
- Video freezes periodically

**Diagnosis:**
```bash
# Monitor connection stability
watch -n 1 'ping -c 1 192.168.10.100'

# Check RTSP keepalive
tcpdump -i eth0 host 192.168.10.100 and port 554
```

**Solutions:**
1. Disable camera's power-saving mode
2. Set RTCP keepalive in camera settings
3. Replace network cable (check for CRC errors)
4. Update camera firmware
5. Use RTSP over TCP instead of UDP

---

### Issue: Poor Detection Accuracy

**Symptoms:**
- YOLO misses safety violations
- False positive detections

**Diagnosis:**
```bash
# Check video quality
ffprobe -v error -show_streams \
  rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101

# Save sample frame for analysis
ffmpeg -i rtsp://admin:password@192.168.10.100:554/Streaming/Channels/101 \
  -vframes 1 /tmp/camera_sample.jpg
```

**Solutions:**
1. Increase camera resolution (720p → 1080p)
2. Improve lighting conditions
3. Adjust camera angle/position
4. Clean camera lens
5. Reduce motion blur (faster shutter speed)

---

## Advanced Configuration

### Multi-Camera Setup

```bash
# .env configuration for 3 cameras
RTSP_CAMERA_1_URL=rtsp://admin:pass@192.168.10.100:554/Streaming/Channels/101
RTSP_CAMERA_1_NAME="Production Line A"
RTSP_CAMERA_1_LOCATION="north"

RTSP_CAMERA_2_URL=rtsp://admin:pass@192.168.10.101:554/cam/realmonitor?channel=1&subtype=0
RTSP_CAMERA_2_NAME="Production Line B"
RTSP_CAMERA_2_LOCATION="south"

RTSP_CAMERA_3_URL=rtsp://admin:pass@192.168.10.102:554/axis-media/media.amp
RTSP_CAMERA_3_NAME="Loading Dock"
RTSP_CAMERA_3_LOCATION="loading_dock"

# Enable load balancing
RTSP_LOAD_BALANCE=true
RTSP_MAX_CAMERAS=10
```

### RTSP over TCP (More Reliable)

```bash
# Force TCP transport (more reliable, slightly more latency)
RTSP_TRANSPORT=tcp

# FFmpeg command with TCP
ffmpeg -rtsp_transport tcp -i rtsp://...
```

### Video Recording Configuration

```bash
# Configure recording duration (seconds)
RTSP_RECORD_DURATION=300  # 5 minutes clips

# Configure recording quality
RTSP_RECORD_QUALITY=high  # low|medium|high

# Configure storage path
RTSP_RECORD_PATH=/opt/nextvision/data/recordings
```

---

## Security Best Practices

### Network Isolation

```bash
# Separate camera VLAN
VLAN ID: 100 (Cameras)
VLAN ID: 200 (NextVision Server)

# Inter-VLAN routing only for RTSP
```

### Authentication

```bash
# Use dedicated RTSP accounts
Username: nextvision_rtsp
Password: <strong_random_password>

# Never use default admin credentials
# Enable camera access logs
```

### Encryption

```bash
# RTSP over SSL (if camera supports)
rtsps://admin:password@192.168.10.100:5554/Streaming/Channels/101

# VPN tunnel for remote camera access
# SSH tunnel: ssh -L 554:192.168.10.100:554 user@vpn-gateway
```

---

## Pre-Deployment Validation Checklist

- [ ] All cameras powered on and accessible via web interface
- [ ] Network connectivity verified (ping, telnet)
- [ ] RTSP streams tested with ffplay
- [ ] Video quality acceptable (resolution, lighting, angle)
- [ ] Authentication credentials confirmed
- [ ] Latency < 500ms measured
- [ ] Firewall rules configured
- [ ] IP addresses documented
- [ ] Backup power supply tested (UPS)
- [ ] Camera positions marked on factory floor plan

---

## Post-Deployment Monitoring

### Daily Checks

```bash
# Test all camera connections
for camera in "${CAMERAS[@]}"; do
  echo "Testing $camera..."
  timeout 5 ffplay -t 3 "$camera" -nodisp 2>/dev/null && echo "OK" || echo "FAILED"
done
```

### Metrics to Monitor

- **Connection uptime** (target: > 99%)
- **Frame rate consistency** (target: 25-30 FPS)
- **Bitrate stability** (target: 2-5 Mbps)
- **Detection rate** (target: > 95% for violations)

---

## Emergency Procedures

### Camera Failure

1. Switch to backup camera (if available)
2. Check camera power supply
3. Restart camera via web interface
4. Replace camera if hardware failure

### Network Failure

1. Check network switch status
2. Verify VLAN configuration
3. Test network cable with Fluke tester
4. Deploy temporary WiFi camera (last resort)

---

**Contact Information:**
- **Network Admin:** +90 XXX XXX XX XX
- **Camera Vendor Support:** [Vendor Phone]
- **DevOps On-Call:** +90 XXX XXX XX XX

---

*Last Updated: 2026-06-03*
*Version: 1.0 - Pilot Deployment*
