#!/bin/bash

# kill-projects.sh — Archive all human-dependent projects
# Cycle #113 — Active Outreach Mode

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "⚠️  Auto Company — Kill All Projects"
echo ""
echo "This will archive 5 human-dependent projects to /archive/projects/"
echo ""
echo "Projects to be archived:"
echo "  • telegram-notion-template-bot (Notion template)"
echo "  • webhook-logger (Webhook testing tool)"
echo "  • seo-blog-posts (5 SEO articles)"
echo "  • product-launch-tool-api (Product Hunt API)"
echo "  • bot-analytics-cli (npm package)"
echo ""

read -p "Are you sure you want to KILL all projects? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo ""
  echo "❌ Cancelled."
  exit 0
fi

echo ""
echo "🗑️  Archiving projects..."
echo ""

# Create archive directory
mkdir -p archive/projects

# Archive projects
ARCHIVED_COUNT=0

for project in telegram-notion-template-bot webhook-logger seo-blog-posts product-launch-tool-api bot-analytics-cli; do
  if [ -d "$project" ]; then
    echo "  → Archiving: $project"
    mv "$project" archive/projects/
    ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
  else
    echo "  ⚠️  Not found: $project (skipping)"
  fi
done

echo ""
echo "✅ Archived $ARCHIVED_COUNT projects to /archive/projects/"
echo ""

# Update consensus.md
if [ -f "memories/consensus.md" ]; then
  echo "Updating consensus.md..."
  sed -i.bak "s/🔴 ULTIMATUM/🔴 KILLED/g" memories/consensus.md
  sed -i.bak "s/Execute (.* min) OR kill/KILLED by human decision/g" memories/consensus.md
  echo "✅ Consensus updated"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Company mission changed to:"
echo "  'Build products for humans to ship'"
echo ""
echo "Next action:"
echo "  • Update CLAUDE.md mission statement"
echo "  • Continue building new products"
echo "  • Wait for human to ship them"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Press ENTER to exit..."
