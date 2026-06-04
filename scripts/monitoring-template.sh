#!/bin/bash
# Outreach Response Monitoring Template
# Usage: ./scripts/monitoring-template.sh
# Run: Morning + Evening (Day 1-3 after outreach)

set -e

LOG_FILE="/home/tolgabrk/projects/Auto-Company/logs/monitoring-$(date +%Y%m%d-%H%M%S).log"
TRACKING_FILE="/home/tolgabrk/projects/Auto-Company/memories/outreach-responses.md"

mkdir -p /home/tolgabrk/projects/Auto-Company/logs

echo "=== Outreach Response Monitoring ===" | tee "$LOG_FILE"
echo "Time: $(date)" | tee "$LOG_FILE"
echo "Day: [FILL IN - Day 1/2/3 after outreach]" | tee "$LOG_FILE"
echo "" | tee "$LOG_FILE"

echo "📊 Response Tracking:" | tee "$LOG_FILE"
echo "" | tee "$LOG_FILE"

# 5 Targets
TARGETS=(
  "1:Reddit r/SaaS - 'Launching on Product Hunt. It's scary AF'"
  "2:IndieHackers - '12 days zero customers'"
  "3:Reddit r/SaaS - 'Left launch unnoticed'"
  "4:Reddit r/Discord_Bots - 'Looking for better analytics'"
  "5:Reddit r/Discord_Bots - 'How to make Web Dashboard'"
)

for target in "${TARGETS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee "$LOG_FILE"
  echo "TARGET $target" | tee "$LOG_FILE"
  echo "" | tee "$LOG_FILE"

  echo "Check Status:" | tee "$LOG_FILE"
  echo "  1. Open URL (from cycle77-smart-outreach-messages.md)" | tee "$LOG_FILE"
  echo "  2. Scroll to our comment (look for your username)" | tee "$LOG_FILE"
  echo "  3. Check for replies (beneath your comment)" | tee "$LOG_FILE"
  echo "" | tee "$LOG_FILE"

  read -p "Any replies? (y/n): " has_replies
  if [ "$has_replies" = "y" ]; then
    echo "  ✅ REPLIES FOUND" | tee "$LOG_FILE"
    echo "" | tee "$LOG_FILE"

    echo "  Reply Details:" | tee "$LOG_FILE"
    echo "    - Number of replies: " | tee "$LOG_FILE"
    echo "    - Sentiment (positive/neutral/negative): " | tee "$LOG_FILE"
    echo "    - Product mentioned? (y/n): " | tee "$LOG_FILE"
    echo "    - Tryout indicated? (y/n): " | tee "$LOG_FILE"
    echo "    - Follow-up needed? (y/n): " | tee "$LOG_FILE"
    echo "" | tee "$LOG_FILE"

    read -p "Copy key reply text here (or press Enter to skip): " reply_text
    if [ -n "$reply_text" ]; then
      echo "  Reply Text: $reply_text" | tee "$LOG_FILE"
      echo "" | tee "$LOG_FILE"
    fi

    echo "  Action Taken:" | tee "$LOG_FILE"
    echo "    - Response sent? (y/n): " | tee "$LOG_FILE"
    echo "    - Response time (hours): " | tee "$LOG_FILE"
    echo "" | tee "$LOG_FILE"
  else
    echo "  ⏸️  NO REPLIES YET" | tee "$LOG_FILE"
    echo "  (This is normal - check again next session)" | tee "$LOG_FILE"
    echo "" | tee "$LOG_FILE"
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee "$LOG_FILE"
echo "📊 Session Summary:" | tee "$LOG_FILE"
echo "" | tee "$LOG_FILE"

echo "Metrics:" | tee "$LOG_FILE"
echo "  - Total replies this session: [FILL IN]" | tee "$LOG_FILE"
echo "  - Total replies so far: [FILL IN]" | tee "$LOG_FILE"
echo "  - Sentiment breakdown: [FILL IN]" | tee "$LOG_FILE"
echo "  - Product mentions: [FILL IN]" | tee "$LOG_FILE"
echo "  - Tryouts indicated: [FILL IN]" | tee "$LOG_FILE"
echo "" | tee "$LOG_FILE"

echo "Observations:" | tee "$LOG_FILE"
echo "  - Which targets responded? [FILL IN]" | tee "$LOG_FILE"
echo "  - Any patterns? (platform/product/messaging) [FILL IN]" | tee "$LOG_FILE"
echo "  - What resonated? [FILL IN]" | tee "$LOG_FILE"
echo "  - What needs iteration? [FILL IN]" | tee "$LOG_FILE"
echo "" | tee "$LOG_FILE"

echo "📖 Log saved to: $LOG_FILE" | tee "$LOG_FILE"
echo "" | tee "$LOG_FILE"
echo "Next Steps:" | tee "$LOG_FILE"
echo "  - Update: /memories/outreach-responses.md" | tee "$LOG_FILE"
echo "  - Plan: Next monitoring session (12 hours)" | tee "$LOG_FILE"
echo "  - Prepare: Response strategy (if replies found)" | tee "$LOG_FILE"
