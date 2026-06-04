#!/bin/bash
# Publish all Product #6 Dev.to articles immediately
# Agent: DevOps Hightower
# Prerequisite: DEVTO_API_KEY must exist in .env

set -e

PROJECT_ROOT="/home/tolgabrk/projects/Auto-Company"
cd "$PROJECT_ROOT"

echo "=== Dev.to Bulk Publisher ==="
echo ""

# Check API key
echo "Checking Dev.to API key..."
if [ ! -f .env ]; then
  echo "❌ ERROR: .env file not found"
  echo "   Add DEVTO_API_KEY=your_key to .env"
  exit 1
fi

if ! grep -q "^DEVTO_API_KEY=" .env; then
  echo "❌ ERROR: DEVTO_API_KEY not found in .env"
  echo "   Get your key from: https://dev.to/settings/account"
  exit 1
fi

KEY=$(grep DEVTO_API_KEY .env | cut -d= -f2)
echo "✅ API key found"

# Validate key works
echo ""
echo "Validating API key..."
if ! curl -s -H "api-key: $KEY" "https://dev.to/api/articles/me" | grep -q "id"; then
  echo "❌ ERROR: API key is invalid"
  echo "   Check your key at: https://dev.to/settings/account"
  exit 1
fi
echo "✅ API key valid"

# Articles to publish (in order)
ARTICLES=(
  "posts/product-6-github-changelog-generator.md"
  "posts/product-6-how-i-automated-release-notes.md"
  "posts/product-6-stop-writing-changelogs.md"
  "posts/product-6-readable-changelog-format.md"
)

echo ""
echo "Articles to publish: ${#ARTICLES[@]}"
echo ""

# Check TypeScript and dependencies
if ! command -v npx &> /dev/null; then
  echo "❌ ERROR: npx not found. Install Node.js."
  exit 1
fi

# Publish each article
SUCCESS_COUNT=0
FAIL_COUNT=0

for i in "${!ARTICLES[@]}"; do
  ARTICLE="${ARTICLES[$i]}"
  NUM=$((i + 1))
  TOTAL=${#ARTICLES[@]}

  echo "[$NUM/$TOTAL] Publishing: $ARTICLE"

  if [ ! -f "$ARTICLE" ]; then
    echo "  ❌ File not found: $ARTICLE"
    FAIL_COUNT=$((FAIL_COUNT + 1))
    continue
  fi

  # Publish with rate limit respect
  if npx tsx scripts/devto-publish.ts --file "$ARTICLE" 2>/dev/null; then
    echo "  ✅ Published successfully"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    echo "  ❌ Publish failed (check logs above)"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi

  # Rate limit: Dev.to allows 10 requests per 30 seconds
  # We use 5 seconds between articles to be safe
  if [ $NUM -lt $TOTAL ]; then
    echo "  ⏳ Waiting 5 seconds (rate limit)..."
    sleep 5
  fi

  echo ""
done

# Summary
echo "=== Publish Summary ==="
echo "✅ Published: $SUCCESS_COUNT/${#ARTICLES[@]}"
if [ $FAIL_COUNT -gt 0 ]; then
  echo "❌ Failed: $FAIL_COUNT/${#ARTICLES[@]}"
  exit 1
fi

echo ""
echo "🚀 All articles published!"
echo "   View them at: https://dev.to/latest"
echo "   Check your Dev.to dashboard"
