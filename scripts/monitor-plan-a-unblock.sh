#!/bin/bash
# Plan A Unblock Monitor - Run hourly via cron or systemd
# Agent: DevOps Hightower
# Cycle: #230 - HYBRID STRATEGY

set -e

LOG_FILE="/tmp/plan-a-status.log"
STATUS_FILE="/tmp/plan-a-current-status.json"
PROJECT_ROOT="/home/tolgabrk/projects/Auto-Company"

# Initialize status
if [ ! -f "$STATUS_FILE" ]; then
  echo '{"marketplace":"blocked","devto":"blocked","reddit":"blocked"}' > "$STATUS_FILE"
  echo "$(date -Iseconds) INITIALIZED" >> "$LOG_FILE"
fi

cd "$PROJECT_ROOT"

# Check Marketplace (HTTP 200 means published)
echo "Checking GitHub Marketplace status..."
MARKETPLACE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://github.com/marketplace/actions/auto-changelog-generator" 2>/dev/null || echo "000")

if [ "$MARKETPLACE_STATUS" -eq 200 ]; then
  CURRENT_STATUS=$(jq -r '.marketplace' "$STATUS_FILE")
  if [ "$CURRENT_STATUS" != "unblocked" ]; then
    echo "$(date -Iseconds) MARKETPLACE_UNBLOCKED (HTTP $MARKETPLACE_STATUS)" >> "$LOG_FILE"
    jq '.marketplace = "unblocked"' "$STATUS_FILE" > /tmp/status.json && mv /tmp/status.json "$STATUS_FILE"
    echo "✅ Marketplace UNBLOCKED"
  else
    echo "✅ Marketplace remains unblocked"
  fi
else
  echo "⏳ Marketplace still blocked (HTTP $MARKETPLACE_STATUS)"
fi

# Check Dev.to Key
echo ""
echo "Checking Dev.to API key..."
if [ -f .env ] && grep -q "^DEVTO_API_KEY=" .env; then
  KEY=$(grep DEVTO_API_KEY .env | cut -d= -f2)
  if curl -s -H "api-key: $KEY" "https://dev.to/api/articles/me" 2>/dev/null | grep -q "id"; then
    CURRENT_STATUS=$(jq -r '.devto' "$STATUS_FILE")
    if [ "$CURRENT_STATUS" != "unblocked" ]; then
      echo "$(date -Iseconds) DEVTO_UNBLOCKED (key valid)" >> "$LOG_FILE"
      jq '.devto = "unblocked"' "$STATUS_FILE" > /tmp/status.json && mv /tmp/status.json "$STATUS_FILE"
      echo "✅ Dev.to UNBLOCKED - Ready to publish!"
    else
      echo "✅ Dev.to remains unblocked"
    fi
  else
    echo "❌ Dev.to key exists but invalid"
  fi
else
  echo "⏳ Dev.to API key not found in .env"
fi

# Check Reddit OAuth
echo ""
echo "Checking Reddit OAuth credentials..."
if [ -f .env ] && grep -q "^REDDIT_CLIENT_ID=" .env && \
   grep -q "^REDDIT_CLIENT_SECRET=" .env; then
  CURRENT_STATUS=$(jq -r '.reddit' "$STATUS_FILE")
  if [ "$CURRENT_STATUS" != "unblocked" ]; then
    echo "$(date -Iseconds) REDDIT_OAUTH_READY" >> "$LOG_FILE"
    jq '.reddit = "unblocked"' "$STATUS_FILE" > /tmp/status.json && mv /tmp/status.json "$STATUS_FILE"
    echo "✅ Reddit OAuth UNBLOCKED - Bot ready!"
  else
    echo "✅ Reddit OAuth remains unblocked"
  fi
else
  echo "⏳ Reddit OAuth credentials not found"
fi

# Display current status
echo ""
echo "=== Plan A Unblock Status ==="
cat "$STATUS_FILE" | jq -r 'to_entries | .[] | "\(.key): \(.value)"'

echo ""
echo "Recent events:"
tail -5 "$LOG_FILE" 2>/dev/null || echo "No events yet"

# Check if anything just unblocked (for alerting)
UNBLOCKED_COUNT=$(jq '[.marketplace, .devto, .reddit] | map(select(. == "unblocked")) | length' "$STATUS_FILE")
if [ "$UNBLOCKED_COUNT" -gt 0 ]; then
  echo ""
  echo "🚀 $UNBLOCKED_COUNT channel(s) unblocked - ready to execute!"
  echo "   Run: ./scripts/publish-all-devto.sh (if Dev.to unblocked)"
fi
