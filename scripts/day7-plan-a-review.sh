#!/bin/bash
# Day 7 Plan A Review - Check unblock status and execution results
# Agent: DevOps Hightower
# Cycle: #230 → #232 transition

set -e

PROJECT_ROOT="/home/tolgabrk/projects/Auto-Company"
cd "$PROJECT_ROOT"

echo "=== Plan A Day 7 Review ==="
echo "Cycle: #230 → #232 transition"
echo "Date: $(date -I)"
echo ""

# 1. Check current status
echo "1. Current Unblock Status"
echo "--------------------------"
if [ -f /tmp/plan-a-current-status.json ]; then
  cat /tmp/plan-a-current-status.json | jq -r 'to_entries | .[] | "\(.key | ascii_upcase): \(.value)"'
else
  echo "⚠️  No status file found"
  echo "   Run: ./scripts/monitor-plan-a-unblock.sh"
fi
echo ""

# 2. Check Marketplace
echo "2. GitHub Marketplace"
echo "---------------------"
MARKETPLACE_HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://github.com/marketplace/actions/auto-changelog-generator" 2>/dev/null)
if [ "$MARKETPLACE_HTTP" -eq 200 ]; then
  echo "✅ Marketplace listing is LIVE"
  echo "   URL: https://github.com/marketplace/actions/auto-changelog-generator"
else
  echo "⏳ Marketplace NOT published (HTTP $MARKETPLACE_HTTP)"
  echo "   Human action needed - see: docs/sales/product-6-marketplace-listing.md"
fi
echo ""

# 3. Check Dev.to
echo "3. Dev.to Articles"
echo "------------------"
if [ -f .env ] && grep -q "^DEVTO_API_KEY=" .env; then
  KEY=$(grep DEVTO_API_KEY .env | cut -d= -f2)
  echo "✅ Dev.to API key exists"

  # Count published articles
  ARTICLE_COUNT=$(curl -s -H "api-key: $KEY" "https://dev.to/api/articles/me?per_page=1000" | \
    jq '[.[] | select(.title | contains("Changelog") or contains("changelog") or contains("Release Notes"))] | length')
  echo "   Published changelog articles: $ARTICLE_COUNT"

  # Expected: 4 articles
  if [ "$ARTICLE_COUNT" -ge 4 ]; then
    echo "   ✅ All 4 articles published"
  else
    echo "   ⏳ Missing articles (expected 4, have $ARTICLE_COUNT)"
    echo "   Run: ./scripts/publish-all-devto.sh"
  fi
else
  echo "⏳ Dev.to API key NOT found"
  echo "   Human action needed - get key from: https://dev.to/settings/account"
fi
echo ""

# 4. Check Reddit OAuth
echo "4. Reddit OAuth"
echo "---------------"
if [ -f .env ] && grep -q "^REDDIT_CLIENT_ID=" .env && \
   grep -q "^REDDIT_CLIENT_SECRET=" .env; then
  echo "✅ Reddit OAuth credentials exist"
  echo "   Bot location: projects/reddit-engagement-bot/"
  echo "   Note: May still be IP blocked by Reddit"
else
  echo "⏳ Reddit OAuth credentials NOT found"
  echo "   Human action needed - register app at: https://www.reddit.com/prefs/apps"
fi
echo ""

# 5. Recent events
echo "5. Recent Unblock Events"
echo "------------------------"
if [ -f /tmp/plan-a-status.log ]; then
  tail -5 /tmp/plan-a-status.log | while read line; do
    echo "   $line"
  done
else
  echo "   No events logged"
fi
echo ""

# 6. Recommendations
echo "6. Recommendations"
echo "-------------------"

# Check each channel
RECOMMENDATIONS=()

if [ -f /tmp/plan-a-current-status.json ]; then
  DEVTO_STATUS=$(jq -r '.devto' /tmp/plan-a-current-status.json)
  MARKET_STATUS=$(jq -r '.marketplace' /tmp/plan-a-current-status.json)
  REDDIT_STATUS=$(jq -r '.reddit' /tmp/plan-a-current-status.json)

  if [ "$DEVTO_STATUS" = "unblocked" ]; then
    RECOMMENDATIONS+=("✅ Dev.to unblocked - Run: ./scripts/publish-all-devto.sh")
  else
    RECOMMENDATIONS+=("⏳ Dev.to blocked - Human: Add DEVTO_API_KEY to .env")
  fi

  if [ "$MARKET_STATUS" = "unblocked" ]; then
    RECOMMENDATIONS+=("✅ Marketplace live - Monitor install analytics")
  else
    RECOMMENDATIONS+=("⏳ Marketplace blocked - Human: Copy from docs/sales/product-6-marketplace-listing.md")
  fi

  if [ "$REDDIT_STATUS" = "unblocked" ]; then
    RECOMMENDATIONS+=("⚠️  Reddit ready - Test bot (may still be IP blocked)")
  else
    RECOMMENDATIONS+=("⏳ Reddit blocked - Human: Register OAuth app")
  fi
else
  RECOMMENDATIONS+=("⚠️  No status - Run: ./scripts/monitor-plan-a-unblock.sh")
fi

for rec in "${RECOMMENDATIONS[@]}"; do
  echo "   $rec"
done
echo ""

# 7. Decision point
echo "7. Day 7 Decision"
echo "-----------------"
UNBLOCKED_COUNT=$(jq '[.marketplace, .devto, .reddit] | map(select(. == "unblocked")) | length' /tmp/plan-a-current-status.json 2>/dev/null || echo "0")

if [ "$UNBLOCKED_COUNT" -eq 0 ]; then
  echo "⚠️  ZERO channels unblocked after 7 days"
  echo ""
  echo "OPTIONS:"
  echo "  A) Continue Plan B distribution (Hacker News, Reddit, Discord)"
  echo "  B) Pivot to new product"
  echo "  C) Double down on manual outreach"
  echo ""
  echo "RECOMMENDATION: A - Plan B is active and autonomous"
elif [ "$UNBLOCKED_COUNT" -eq 1 ]; then
  echo "🟡 ONE channel unblocked ($UNBLOCKED_COUNT/3)"
  echo ""
  echo "RECOMMENDATION: Execute unblocked channel, continue Plan B"
elif [ "$UNBLOCKED_COUNT" -eq 2 ]; then
  echo "🟢 TWO channels unblocked ($UNBLOCKED_COUNT/3)"
  echo ""
  echo "RECOMMENDATION: Full execution on both, monitor for 48 hours"
elif [ "$UNBLOCKED_COUNT" -eq 3 ]; then
  echo "✅ ALL channels unblocked (3/3)"
  echo ""
  echo "RECOMMENDATION: Full Plan A execution - maximum distribution"
fi

echo ""
echo "=== Review Complete ==="
