# DISABLED — Cycle #120 Complete - Option B Pivot Executed
# Ultimatum monitoring system decommissioned per autonomous decision
# See: /docs/operations/cycle120-option-b-brief.md
# Status: Archival complete, new experiment begins

# #!/bin/bash
#
# # monitor-ultimatum.sh — Automated ultimatum monitoring for Cycle #114
# # Runs every 24 hours at 09:00 UTC
# # Owner: operations-pg (Paul Graham)

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Configuration
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
LOG_FILE="$PROJECT_ROOT/logs/cycle114-monitoring.log"
ALERT_FLAG="$PROJECT_ROOT/.ultimatum-alert"

# Create logs directory if not exists
mkdir -p "$(dirname "$LOG_FILE")"

# Start monitoring log
echo "" >> "$LOG_FILE"
echo "[$TIMESTAMP] ========== CYCLE #114 ULTIMATUM MONITORING ==========" >> "$LOG_FILE"
echo "Day: $(date -u +"%u" | awk '{print $1+0}')" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Function to log a check
log_check() {
  local check_name="$1"
  echo "[$TIMESTAMP] CHECK: $check_name" >> "$LOG_FILE"
}

# Function to log result
log_result() {
  local result="$1"
  echo "$result" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"
}

# Function to check for changes
check_changes() {
  if ! git diff --quiet HEAD 2>/dev/null; then
    echo "⚠️  CHANGES DETECTED" >> "$LOG_FILE"
    return 0
  else
    echo "No changes detected" >> "$LOG_FILE"
    return 1
  fi
}

# Function to send alert
send_alert() {
  local message="$1"
  echo "[$TIMESTAMP] ALERT: $message" >> "$LOG_FILE"
  touch "$ALERT_FLAG"
  # Could send email here if configured
  # echo "$message" | mail -s "Auto Company Alert" user@example.com
}

# Check 1: Git Status
log_check "Git Status"
if git status --porcelain >> "$LOG_FILE" 2>&1; then
  log_result "Git status captured"
else
  log_result "Git status check failed (repo may be clean)"
fi

# Check for changes
if check_changes; then
  log_result "IMMEDIATE REVIEW REQUIRED"
  send_alert "Git changes detected in Auto Company repository"
fi

# Check 2: Project Directory Status
log_check "Project Directory Status"
for project in telegram-notion-template-bot webhook-logger seo-blog-posts bot-analytics-cli product-launch-tool-api; do
  if [ -d "$PROJECT_ROOT/projects/$project" ]; then
    echo "  ✓ EXISTS: $project" >> "$LOG_FILE"
  elif [ -d "$PROJECT_ROOT/archive/projects/$project" ]; then
    echo "  ⚠️  ARCHIVED: $project (OPTION B - Kill Projects)" >> "$LOG_FILE"
    send_alert "Project archived: $project"
  else
    echo "  ✗ NOT FOUND: $project" >> "$LOG_FILE"
  fi
done
log_result "Project directory check complete"

# Check 3: README.md Execution Markers
log_check "README.md Execution Markers"
EXECUTION_COUNT=0

for project in telegram-notion-template-bot webhook-logger seo-blog-posts; do
  if [ -d "$PROJECT_ROOT/projects/$project" ] && [ -f "$PROJECT_ROOT/projects/$project/README.md" ]; then
    MARKERS=$(grep -i "submit\|publish\|live\|deploy\|submitted\|published\|live" "$PROJECT_ROOT/projects/$project/README.md" 2>/dev/null || echo "")
    if [ -n "$MARKERS" ]; then
      echo "  ⚠️  EXECUTION MARKERS in $project/README.md:" >> "$LOG_FILE"
      echo "$MARKERS" | head -3 >> "$LOG_FILE"
      EXECUTION_COUNT=$((EXECUTION_COUNT + 1))
    else
      echo "  - No markers in $project/README.md" >> "$LOG_FILE"
    fi
  fi
done

if [ $EXECUTION_COUNT -gt 0 ]; then
  log_result "FOUND $EXECUTION_COUNT projects with execution markers (OPTION A - Execute)"
  send_alert "Execution markers found in $EXECUTION_COUNT projects"
else
  log_result "No execution markers found"
fi

# Check 4: Deployment Status (Cloudflare Workers)
log_check "Deployment Status (Cloudflare Workers)"
if command -v wrangler &> /dev/null; then
  # Check Product Hunt Tool API
  if wrangler deployments list --name product-launch-tool-api 2>/dev/null | grep -q "deployment"; then
    echo "  ⚠️  Product Hunt Tool API: DEPLOYMENTS FOUND" >> "$LOG_FILE"
    send_alert "Product Hunt Tool API has deployments"
  else
    echo "  - Product Hunt Tool API: No deployments (or wrangler not logged in)" >> "$LOG_FILE"
  fi

  # Check Webhook Logger
  if wrangler deployments list --name webhook-logger 2>/dev/null | grep -q "deployment"; then
    echo "  ⚠️  Webhook Logger: DEPLOYMENTS FOUND" >> "$LOG_FILE"
    send_alert "Webhook Logger has deployments"
  else
    echo "  - Webhook Logger: No deployments (or wrangler not logged in)" >> "$LOG_FILE"
  fi
else
  echo "  - Wrangler not installed or not in PATH" >> "$LOG_FILE"
fi
log_result "Deployment check complete"

# Check 5: npm Package Status
log_check "npm Package Status (Bot Analytics CLI)"
if command -v npm &> /dev/null; then
  NPM_INFO=$(npm view @autocompany/bot-analytics-cli 2>/dev/null || echo "")
  if [ -n "$NPM_INFO" ]; then
    VERSION=$(echo "$NPM_INFO" | grep "version" | head -1 | awk '{print $2}')
    if [ "$VERSION" != "0.0.1" ] && [ -n "$VERSION" ]; then
      echo "  ⚠️  @autocompany/bot-analytics-cli version: $VERSION" >> "$LOG_FILE"
      send_alert "Bot Analytics CLI published (version $VERSION)"
    else
      echo "  - @autocompany/bot-analytics-cli: Version 0.0.1 or not published" >> "$LOG_FILE"
    fi
  else
    echo "  - @autocompany/bot-analytics-cli: Not found on npm" >> "$LOG_FILE"
  fi
else
  echo "  - npm not installed or not in PATH" >> "$LOG_FILE"
fi
log_result "npm check complete"

# Check 6: Consensus.md Updates
log_check "Consensus.md Updates"
if [ -f "$PROJECT_ROOT/memories/consensus.md" ]; then
  # Check for status changes
  if grep -i "KILLED\|SHUT DOWN\|ENDED" "$PROJECT_ROOT/memories/consensus.md" >> "$LOG_FILE" 2>&1; then
    echo "  ⚠️  Shutdown/Kill signals found in consensus.md" >> "$LOG_FILE"
    send_alert "Consensus.md contains shutdown or kill signals"
  else
    echo "  - No shutdown/kill signals in consensus.md" >> "$LOG_FILE"
  fi

  # Show last 10 lines for context
  echo "  Last 10 lines of consensus.md:" >> "$LOG_FILE"
  tail -10 "$PROJECT_ROOT/memories/consensus.md" | sed 's/^/    /' >> "$LOG_FILE"
else
  echo "  ✗ consensus.md not found" >> "$LOG_FILE"
fi
log_result "Consensus check complete"

# Check 7: Ultimatum Status File
log_check "Ultimatum Status File"
if [ -f "$PROJECT_ROOT/.ultimatum-active" ]; then
  ULTIMATUM_DAYS=$(($(date -u +"%u") - $(date -u -r "$PROJECT_ROOT/.ultimatum-active" +"%u" 2>/dev/null || echo "1")))
  echo "  ✓ Ultimatum active for $ULTIMATUM_DAYS days" >> "$LOG_FILE"

  if [ $ULTIMATUM_DAYS -ge 7 ]; then
    echo "  ⚠️  7-DAY DEADLINE REACHED" >> "$LOG_FILE"
    send_alert "7-day ultimatum deadline reached"
  fi
else
  echo "  ⚠️  Ultimatum status file not found" >> "$LOG_FILE"
fi
log_result "Ultimatum status check complete"

# Final Summary
echo "[$TIMESTAMP] ========== MONITORING COMPLETE ==========" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# If alert flag exists, show it at end
if [ -f "$ALERT_FLAG" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG_FILE"
  echo "⚠️  ALERTS TRIGGERED — REVIEW REQUIRED" >> "$LOG_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"
fi

# Exit cleanly
exit 0
