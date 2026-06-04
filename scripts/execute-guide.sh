#!/bin/bash

# execute-guide.sh — Quick execution helper for shipping 3 products
# Cycle #113 — Active Outreach Mode

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "🚀 Auto Company — Quick Shipping Execution"
echo ""
echo "This helper will guide you through shipping 3 products (2-3 hours total):"
echo ""
echo "  1. Notion Template (5-10 min)"
echo "  2. Webhook Logger (45-60 min)"
echo "  3. SEO Blog Posts (60-90 min)"
echo ""

# Check if shipping guide exists
if [ -f "docs/shipping/SHIP_3_PRODUCTS_GUIDE.md" ]; then
  echo "✅ Shipping guide found: docs/shipping/SHIP_3_PRODUCTS_GUIDE.md"
  echo ""
  echo "Quick Reference (from guide):"
  echo ""
  grep -A 3 "## Execution Checklist" docs/shipping/SHIP_3_PRODUCTS_GUIDE.md || true
  echo ""
  read -p "Press ENTER to open full shipping guide..."
  ${EDITOR:-nano} docs/shipping/SHIP_3_PRODUCTS_GUIDE.md
else
  echo "❌ Shipping guide not found!"
  echo "   Expected: docs/shipping/SHIP_3_PRODUCTS_GUIDE.md"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Quick Execution Checklist"
echo ""
echo "Step 1: Notion Template (5-10 min)"
echo "  → File: telegram-notion-template-bot/README.md"
echo "  → Action: Submit to Notion template gallery"
echo "  → Link: Notion → Templates → Submit template"
echo ""
echo "Step 2: Webhook Logger (45-60 min)"
echo "  → File: webhook-logger/README.md"
echo "  → Action: Execute distribution checklist"
echo "  → Platforms: Product Hunt, Hacker News, Reddit, dev.to, GitHub"
echo ""
echo "Step 3: SEO Blog Posts (60-90 min)"
echo "  → File: seo-blog-posts/README.md"
echo "  → Action: Publish 5 articles to blog"
echo "  → Platforms: Medium, Dev.to, Hashnode, personal blog"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Pro Tips (from Launch Optimization Guide):"
echo ""
if [ -f "docs/shipping/LAUNCH_OPTIMIZATION_QUICK_WINS.md" ]; then
  grep -A 2 "## 15-Minute Quick Wins" docs/shipping/LAUNCH_OPTIMIZATION_QUICK_WINS.md || true
else
  echo "   • Schedule posts for optimal times (9-11 AM EST)"
  echo "   • Include clear call-to-action in each post"
  echo "   • Engage with comments within 1 hour"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Press ENTER to open project directories..."

# Open project directories
if [ -d "telegram-notion-template-bot" ]; then
  echo "Opening: telegram-notion-template-bot/"
  cd telegram-notion-template-bot
  ${EDITOR:-nano} README.md
  cd "$PROJECT_ROOT"
fi

echo ""
echo "───────────────────────────────────────────────────────────────────"
echo ""
read -p "Open Webhook Logger? (y/n): " OPEN_WEBHOOK
if [ "$OPEN_WEBHOOK" = "y" ]; then
  if [ -d "webhook-logger" ]; then
    echo "Opening: webhook-logger/"
    cd webhook-logger
    ${EDITOR:-nano} README.md
    cd "$PROJECT_ROOT"
  fi
fi

echo ""
echo "───────────────────────────────────────────────────────────────────"
echo ""
read -p "Open SEO Blog Posts? (y/n): " OPEN_SEO
if [ "$OPEN_SEO" = "y" ]; then
  if [ -d "seo-blog-posts" ]; then
    echo "Opening: seo-blog-posts/"
    cd seo-blog-posts
    ${EDITOR:-nano} README.md
    cd "$PROJECT_ROOT"
  fi
fi

echo ""
echo "✅ Execution helper complete!"
echo ""
echo "Next steps:"
echo "  1. Follow checklists above"
echo "  2. Track your progress in each README.md"
echo "  3. Update consensus.md when done:"
echo "     → Add 'EXECUTED' to Active Projects status"
echo ""
echo "Estimated time: 2-3 hours"
echo "Good luck! 🚀"
echo ""
