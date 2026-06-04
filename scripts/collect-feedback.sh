#!/bin/bash
# Feedback Collection Script
# Collects comments and mentions from distribution channels

FEEDBACK_DIR="/home/tolgabrk/projects/Auto-Company/logs/feedback"
DATE=$(date +%Y%m%d)
OUTPUT="$FEEDBACK_DIR/feedback-$DATE.md"

mkdir -p "$FEEDBACK_DIR"

echo "# Feedback Summary - $(date +%Y-%m-%d)" > "$OUTPUT"
echo "" >> "$OUTPUT"
echo "## Product #6: Changelog Generator" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "### GitHub Issues" >> "$OUTPUT"

# Fetch open issues for Product #6
if gh auth status &>/dev/null; then
    gh issue list --repo eylulsenakumral/changelog-generator --state open --limit 10 >> "$OUTPUT" 2>/dev/null || echo "No issues or gh not auth" >> "$OUTPUT"
else
    echo "GitHub CLI not authenticated" >> "$OUTPUT"
fi

echo "" >> "$OUTPUT"
echo "### Product #7: Landing Pages" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "### GitHub Issues" >> "$OUTPUT"

if gh auth status &>/dev/null; then
    gh issue list --repo eylulsenakumral/smoke-test-landing-pages --state open --limit 10 >> "$OUTPUT" 2>/dev/null || echo "No issues or gh not auth" >> "$OUTPUT"
else
    echo "GitHub CLI not authenticated" >> "$OUTPUT"
fi

echo "" >> "$OUTPUT"
echo "## Manual Entry" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Add HN/Reddit comments manually:" >> "$OUTPUT"
echo "- HN: [link] - summary" >> "$OUTPUT"
echo "- Reddit r/github: [link] - summary" >> "$OUTPUT"
echo "- Reddit r/javascript: [link] - summary" >> "$OUTPUT"
echo "" >> "$OUTPUT"
echo "Saved to: $OUTPUT"

echo "Feedback collection complete: $OUTPUT"
