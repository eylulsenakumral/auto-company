#!/bin/bash
# Zero-Friction Outreach Execution Script
# Usage: ./scripts/execute-outreach.sh
# Time: 10-15 min (5 messages, rate-limited)

set -e

MESSAGE_FILE="/home/tolgabrk/projects/Auto-Company/docs/operations/cycle77-smart-outreach-messages.md"
LOG_FILE="/home/tolgabrk/projects/Auto-Company/logs/outreach-execution-$(date +%Y%m%d-%H%M%S).log"

mkdir -p /home/tolgabrk/projects/Auto-Company/logs

echo "=== Smart Outreach Execution ===" | tee -a "$LOG_FILE"
echo "Time: $(date)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Target URLs
TARGETS=(
  "https://www.reddit.com/r/SaaS/comments/18wvp86/launching_on_product_hunt_its_scary_af/"
  "https://www.indiehackers.com/post/i-m-launching-on-product-hunt-in-12-days-with-zero-customers-here-s-my-exact-plan-beaab1d1e1"
  "https://www.reddit.com/r/SaaS/comments/1f0ux8c/i_left_my_product_hunt_launch_unnoticed_lol/"
  "https://www.reddit.com/r/Discord_Bots/comments/1llzuk8/looking_for_better_analytics_tools_for_managing_a/"
  "https://www.reddit.com/r/Discord_Bots/comments/1koca01/how_to_make_web_dashboard_for_discord_bots/"
)

echo "📋 Outreach Plan:" | tee -a "$LOG_FILE"
echo "   - 5 targets identified" | tee -a "$LOG_FILE"
echo "   - Personalized value-first messages ready" | tee -a "$LOG_FILE"
echo "   - Execution time: 10-15 min" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "📖 Execution Guide:" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

for i in {1..5}; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
  echo "TARGET $i:" | tee -a "$LOG_FILE"
  echo "  URL: ${TARGETS[$((i-1))]}" | tee -a "$LOG_FILE"
  echo "  Message: See $MESSAGE_FILE (Target $i section)" | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"
  echo "  Steps:" | tee -a "$LOG_FILE"
  echo "    1. Open URL in browser" | tee -a "$LOG_FILE"
  echo "    2. Log in (if needed)" | tee -a "$LOG_FILE"
  echo "    3. Click Reply/Comment" | tee -a "$LOG_FILE"
  echo "    4. Copy message from file" | tee -a "$LOG_FILE"
  echo "    5. Paste and submit" | tee -a "$LOG_FILE"
  echo "    6. Wait 30-60 sec (rate limiting)" | tee -a "$LOG_FILE"
  echo "" | tee -a "$LOG_FILE"

  read -p "✅ Completed TARGET $i? (y/n): " completed
  if [ "$completed" = "y" ]; then
    echo "  ✅ TARGET $i: COMPLETED at $(date)" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"

    if [ $i -lt 5 ]; then
      echo "⏸️  Next: TARGET $((i+1))" | tee -a "$LOG_FILE"
      echo "" | tee -a "$LOG_FILE"
    fi
  else
    echo "  ⏭️  TARGET $i: SKIPPED at $(date)" | tee -a "$LOG_FILE"
    echo "  Reason: [USER INPUT REQUIRED]" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOG_FILE"
echo "🎉 Outreach Execution Complete!" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📊 Summary:" | tee -a "$LOG_FILE"
echo "   - Execution Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "   - Next: Monitor replies (Day 1-3)" | tee -a "$LOG_FILE"
echo "   - Decision Framework: Day 7" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "📖 Quick Start Monitoring:" | tee -a "$LOG_FILE"
echo "   - Morning: Check threads, respond to replies" | tee -a "$LOG_FILE"
echo "   - Evening: Check threads, respond to replies" | tee -a "$LOG_FILE"
echo "   - Template: /scripts/monitoring-template.sh" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "✅ Execution Complete. Log saved to: $LOG_FILE"
