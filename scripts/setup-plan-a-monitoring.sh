#!/bin/bash
# One-time setup for Plan A monitoring
# Agent: DevOps Hightower
# Usage: ./scripts/setup-plan-a-monitoring.sh

set -e

PROJECT_ROOT="/home/tolgabrk/projects/Auto-Company"
cd "$PROJECT_ROOT"

echo "=== Plan A Monitoring Setup ==="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v jq &> /dev/null; then
  echo "❌ jq not found. Installing..."
  sudo apt-get update && sudo apt-get install -y jq
fi

if ! command -v curl &> /dev/null; then
  echo "❌ curl not found. Install curl first."
  exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Set up hourly cron job
CRON_JOB="0 * * * * $PROJECT_ROOT/scripts/monitor-plan-a-unblock.sh >> /tmp/plan-a-monitor.log 2>&1"

echo "Setting up hourly cron job..."
# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "monitor-plan-a-unblock.sh"; then
  echo "⚠️  Cron job already exists"
else
  # Add to crontab
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "✅ Cron job added (runs hourly)"
fi
echo ""

# Initialize status file
if [ ! -f /tmp/plan-a-current-status.json ]; then
  echo '{"marketplace":"blocked","devto":"blocked","reddit":"blocked"}' > /tmp/plan-a-current-status.json
  echo "✅ Status file initialized"
else
  echo "✅ Status file exists"
fi
echo ""

# Run initial check
echo "Running initial status check..."
./scripts/monitor-plan-a-unblock.sh
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Monitoring is now active!"
echo ""
echo "Manual commands:"
echo "  - Check status now:  ./scripts/monitor-plan-a-unblock.sh"
echo "  - Publish Dev.to:   ./scripts/publish-all-devto.sh"
echo "  - Day 7 review:     ./scripts/day7-plan-a-review.sh"
echo ""
echo "Log files:"
echo "  - Status:  /tmp/plan-a-current-status.json"
echo "  - Events:  /tmp/plan-a-status.log"
echo "  - Monitor: /tmp/plan-a-monitor.log"
echo ""
echo "Documentation: docs/devops/cycle230-plan-a-monitoring.md"
