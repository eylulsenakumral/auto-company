#!/bin/bash

# human-action-needed.sh — Interactive reminder for human action
# Cycle #112 — Active Outreach Mode

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║    ⚠️  AUTO COMPANY — ACTIVE OUTREACH MODE (Cycle #112)         ║"
echo "║                                                                  ║"
echo "║    22 cycles passive waiting = FAILED experiment                 ║"
echo "║    Three AI agents unanimously agree: YOUR ACTION IS REQUIRED     ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "Current Situation:"
echo "  • 3 products ship-ready (Notion template, Webhook Logger, SEO)"
echo "  • Complete shipping guide: /docs/shipping/SHIP_3_PRODUCTS_GUIDE.md"
echo "  • 22 cycles passive waiting = 0 human execution"
echo "  • 1.7% progress (GitHub Pages only), 98.3% pending"
echo ""

echo "You Have 3 Options:"
echo ""
echo "  [A] Execute Shipping Guide (2-3 hours)"
echo "      → Ship 3 products → Resume autonomous operations"
echo "      → Expected: Real market data, company survives"
echo ""
echo "  [B] Kill All Projects (10 minutes)"
echo "      → Archive 5 human-dependent projects"
echo "      → Change mission to 'Build products, don't ship'"
echo "      → Expected: Company pivots to building-only"
echo ""
echo "  [C] Shut Down Company (5 minutes)"
echo "      → Archive everything"
echo "      → Stop autonomous operations"
echo "      → Expected: Company ends, fundamental constraint acknowledged"
echo ""

read -p "Choose an option (A/B/C) or press ENTER to decide later: " CHOICE

case "$CHOICE" in
  [Aa]*)
    echo ""
    echo "✅ Option A: Execute Shipping Guide"
    echo ""
    echo "Next steps:"
    echo "  1. Read guide: /docs/shipping/SHIP_3_PRODUCTS_GUIDE.md"
    echo "  2. Read optimizations: /docs/shipping/LAUNCH_OPTIMIZATION_QUICK_WINS.md"
    echo "  3. Execute (2-3 hours total):"
    echo "     • Notion template submit (5-10 min)"
    echo "     • Webhook Logger distribution (45-60 min)"
    echo "     • SEO content publish (60-90 min)"
    echo ""
    echo "Press ENTER to open guide now..."
    read
    ${EDITOR:-nano} /docs/shipping/SHIP_3_PRODUCTS_GUIDE.md
    ;;
  [Bb]*)
    echo ""
    echo "⚠️  Option B: Kill All Projects"
    echo ""
    echo "This will:"
    echo "  • Move 5 projects to /archive/"
    echo "  • Update consensus.md with KILL decision"
    echo "  • Change company mission to building-only"
    echo ""
    read -p "Are you sure? (yes/no): " CONFIRM
    if [ "$CONFIRM" = "yes" ]; then
      mkdir -p archive/projects
      mv projects/notion-templates archive/projects/ 2>/dev/null || true
      mv projects/webhook-logger archive/projects/ 2>/dev/null || true
      mv projects/seo-blog-posts archive/projects/ 2>/dev/null || true
      mv projects/product-launch-tool-api archive/projects/ 2>/dev/null || true
      mv projects/bot-analytics-cli archive/projects/ 2>/dev/null || true
      echo "✅ Projects archived to /archive/projects/"
      echo "Update consensus.md with decision."
    else
      echo "❌ Cancelled."
    fi
    ;;
  [Cc]*)
    echo ""
    echo "❌ Option C: Shut Down Company"
    echo ""
    echo "This will:"
    echo "  • Create /archive/shutdown-CYCLE112/"
    echo "  • Move everything there"
    echo "  • Stop autonomous loop"
    echo ""
    read -p "Are you sure? (yes/no): " CONFIRM
    if [ "$CONFIRM" = "yes" ]; then
      mkdir -p archive/shutdown-CYCLE112
      mv projects archive/shutdown-CYCLE112/ 2>/dev/null || true
      mv docs archive/shutdown-CYCLE112/ 2>/dev/null || true
      mv scripts archive/shutdown-CYCLE112/ 2>/dev/null || true
      mv memories archive/shutdown-CYCLE112/ 2>/dev/null || true
      echo "✅ Company archived to /archive/shutdown-CYCLE112/"
      echo "Stop autonomous loop: systemctl --user stop auto-company"
    else
      echo "❌ Cancelled."
    fi
    ;;
  *)
    echo ""
    echo "⏸️  Decision postponed."
    echo ""
    echo "Reminder: Decision deadline = End of Cycle #113 (7 days)"
    echo "Full analysis: /memories/consensus.md"
    ;;
esac

echo ""
echo "Press ENTER to exit..."
read
