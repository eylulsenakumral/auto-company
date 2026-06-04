#!/bin/bash

# Product #1 Monitoring Script
# Runs daily to track GitHub metrics for self-hosted-analytics

REPO="eylulsenakumral/self-hosted-analytics"
LOG_DIR="docs/operations"
LOG_FILE="$LOG_DIR/cycle129-product-1-monitoring.log"
METRICS_FILE="$LOG_DIR/cycle129-adoption-metrics.json"

# Create log directory if not exists
mkdir -p "$LOG_DIR"

# Timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

echo "========================================" >> "$LOG_FILE"
echo "Product #1 Monitoring - $TIMESTAMP" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"

# Get GitHub metrics
echo "Fetching GitHub metrics..." >> "$LOG_FILE"

STARS=$(gh repo view "$REPO" --json stargazerCount --jq '.stargazerCount' 2>/dev/null || echo "0")
FORKS=$(gh repo view "$REPO" --json forkCount --jq '.forkCount' 2>/dev/null || echo "0")
OPEN_ISSUES=$(gh repo view "$REPO" --json openIssuestotalCount --jq '.openIssuestotalCount' 2>/dev/null || echo "0")
WATCHERS=$(gh repo view "$REPO" --json watcherstotalCount --jq '.watchers.totalCount' 2>/dev/null || echo "0")

# Log metrics
echo "Stars: $STARS" >> "$LOG_FILE"
echo "Forks: $FORKS" >> "$LOG_FILE"
echo "Open Issues: $OPEN_ISSUES" >> "$LOG_FILE"
echo "Watchers: $WATCHERS" >> "$LOG_FILE"

# Calculate adoption rate (conservative estimate)
# Assumptions:
# - 30% of stars actually clone
# - 50% of clones complete setup
# - 40% of setups deploy
ESTIMATED_CLONES=$((STARS * 30 / 100))
ESTIMATED_SETUPS=$((ESTIMATED_CLONES * 50 / 100))
ESTIMATED_DEPLOYMENTS=$((ESTIMATED_SETUPS * 40 / 100))

echo "" >> "$LOG_FILE"
echo "Estimated Adoption (Conservative):" >> "$LOG_FILE"
echo "- Clones: $ESTIMATED_CLONES" >> "$LOG_FILE"
echo "- Setups: $ESTIMATED_SETUPS" >> "$LOG_FILE"
echo "- Deployments: $ESTIMATED_DEPLOYMENTS" >> "$LOG_FILE"

# Update metrics JSON
cat > "$METRICS_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "cycle": 129,
  "product": "self-hosted-analytics",
  "github": {
    "stars": $STARS,
    "forks": $FORKS,
    "open_issues": $OPEN_ISSUES,
    "watchers": $WATCHERS
  },
  "estimated_adoption": {
    "clones": $ESTIMATED_CLONES,
    "setups": $ESTIMATED_SETUPS,
    "deployments": $ESTIMATED_DEPLOYMENTS
  },
  "day_30_targets": {
    "stars_min": 150,
    "clones_min": 150,
    "setups_min": 75
  }
}
EOF

echo "" >> "$LOG_FILE"
echo "Metrics saved to: $METRICS_FILE" >> "$LOG_FILE"

# Decision matrix check
echo "" >> "$LOG_FILE"
echo "DECISION MATRIX (Day 30 Targets):" >> "$LOG_FILE"

if [ "$STARS" -ge 150 ] && [ "$ESTIMATED_CLONES" -ge 150 ] && [ "$ESTIMATED_SETUPS" -ge 75 ]; then
    echo "STATUS: SUCCESS (continue experiment)" >> "$LOG_FILE"
    echo "All targets met or exceeded" >> "$LOG_FILE"
elif [ "$STARS" -ge 50 ] && [ "$ESTIMATED_CLONES" -ge 50 ] && [ "$ESTIMATED_SETUPS" -ge 25 ]; then
    echo "STATUS: REFINE (adjust quality bar)" >> "$LOG_FILE"
    echo "Moderate adoption, consider improvements" >> "$LOG_FILE"
else
    echo "STATUS: FAILED (reconsider mission)" >> "$LOG_FILE"
    echo "Below minimum adoption threshold" >> "$LOG_FILE"
fi

echo "" >> "$LOG_FILE"
echo "Monitoring complete - $TIMESTAMP" >> "$LOG_FILE"
echo "========================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Output to stdout
echo "Product #1 Monitoring Complete"
echo "Stars: $STARS | Forks: $FORKS"
echo "Est. Clones: $ESTIMATED_CLONES | Setups: $ESTIMATED_SETUPS | Deployments: $ESTIMATED_DEPLOYMENTS"
echo "Metrics: $METRICS_FILE"
