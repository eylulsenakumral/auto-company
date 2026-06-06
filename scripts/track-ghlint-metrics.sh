#!/bin/bash
# gh-lint-cli metrics tracking script
# Run daily to monitor promotion performance
# Decision Rule: 7 days, >=20 stars = continue, <20 = deprecate

set -euo pipefail

REPO="eylulsenakumral/gh-lint-cli"
LOG_DIR="/home/tolgabrk/projects/Auto-Company/docs/marketing"
LOG_FILE="$LOG_DIR/ghlint-metrics.log"
START_DATE="2026-06-06"  # Launch date

# Create log dir if missing
mkdir -p "$LOG_DIR"

# Fetch metrics via gh CLI
REPO_DATA=$(gh repo view "$REPO" --json stargazerCount,forkCount 2>/dev/null || echo '{"stargazerCount":0,"forkCount":0}')
STARS=$(echo "$REPO_DATA" | jq -r '.stargazerCount // 0')
FORKS=$(echo "$REPO_DATA" | jq -r '.forkCount // 0')

# Timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Calculate days since launch
DAYS_SINCE=$(( ($(date +%s) - $(date -d "$START_DATE" +%s 2>/dev/null || echo "0")) / 86400 ))
[ "$DAYS_SINCE" -lt 0 ] && DAYS_SINCE=0

# Write log entry
echo "[$TIMESTAMP] repo=$REPO stars=$STARS forks=$FORKS days_since_launch=$DAYS_SINCE" >> "$LOG_FILE"

# Print to stdout
echo "=== gh-lint-cli Metrics ==="
echo "Timestamp: $TIMESTAMP"
echo "Stars: $STARS"
echo "Forks: $FORKS"
echo "Days since launch: $DAYS_SINCE"
echo ""

# Decision check at day 7
if [ "$DAYS_SINCE" -ge 7 ]; then
    if [ "$STARS" -ge 20 ]; then
        echo "DECISION: PASS (>=20 stars in 7 days) - Continue project"
        echo "[$TIMESTAMP] DECISION=PASS stars=$STARS >=20" >> "$LOG_FILE"
    else
        echo "DECISION: FAIL (<20 stars in 7 days) - Deprecate project"
        echo "[$TIMESTAMP] DECISION=FAIL stars=$STARS <20" >> "$LOG_FILE"
    fi
else
    REMAINING=$((7 - DAYS_SINCE))
    echo "Status: Tracking... ($REMAINING days until decision)"
    echo "[$TIMESTAMP] STATUS=TRACKING days_remaining=$REMAINING" >> "$LOG_FILE"
fi

echo "Log: $LOG_FILE"
