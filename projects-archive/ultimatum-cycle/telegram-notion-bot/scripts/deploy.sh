#!/bin/bash
# One-command deployment script for Telegram Notion Bot
# Usage: ./scripts/deploy.sh

set -e  # Exit on error

echo "🚀 Telegram Notion Bot - Railway Deployment"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
  echo -e "\n📋 Checking prerequisites..."

  if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Install with: npm install -g @railway/cli"
    exit 1
  fi
  echo -e "${GREEN}✓${NC} Railway CLI installed"

  if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Railway${NC}"
    echo "Login with: railway login"
    exit 1
  fi
  echo -e "${GREEN}✓${NC} Logged in to Railway"

  if [ ! -f "dist/server.js" ]; then
    echo -e "${YELLOW}⚠ Build not found, building...${NC}"
    npm run build
  fi
  echo -e "${GREEN}✓${NC} Build ready"
}

# Check or create Railway project
setup_project() {
  echo -e "\n🔧 Setting up Railway project..."

  # Check if already linked
  if railway status &> /dev/null; then
    echo -e "${GREEN}✓${NC} Already linked to Railway project"
  else
    echo "Initializing new Railway project..."
    railway init --yes
    echo -e "${GREEN}✓${NC} Railway project created"
  fi
}

# Set environment variables
setup_environment() {
  echo -e "\n🔐 Setting environment variables..."

  # Check if bot token exists
  if railway variables get TELEGRAM_BOT_TOKEN 2>/dev/null | grep -q "null"; then
    echo -e "${YELLOW}⚠ TELEGRAM_BOT_TOKEN not set${NC}"
    echo "Set it in Railway dashboard or run:"
    echo "  railway variables set TELEGRAM_BOT_TOKEN=your_token"
    echo ""
    read -p "Enter your Telegram Bot Token: " bot_token
    if [ -n "$bot_token" ]; then
      railway variables set TELEGRAM_BOT_TOKEN="$bot_token"
    fi
  else
    echo -e "${GREEN}✓${NC} TELEGRAM_BOT_TOKEN already set"
  fi

  # Generate webhook secret if not set
  if railway variables get WEBHOOK_SECRET 2>/dev/null | grep -q "null"; then
    echo "Generating webhook secret..."
    secret=$(openssl rand -hex 32)
    railway variables set WEBHOOK_SECRET="$secret"
    echo -e "${GREEN}✓${NC} WEBHOOK_SECRET generated"
  else
    echo -e "${GREEN}✓${NC} WEBHOOK_SECRET already set"
  fi

  # Set production environment
  railway variables set NODE_ENV=production 2>/dev/null || true
  railway variables set LOG_LEVEL=info 2>/dev/null || true
  railway variables set DATABASE_URL="sqlite:./data/orders.db" 2>/dev/null || true

  echo -e "${GREEN}✓${NC} Environment variables configured"
}

# Setup persistent volume
setup_volume() {
  echo -e "\n💾 Setting up persistent volume..."

  # Check if volume exists
  if railway volume ls 2>/dev/null | grep -q "data"; then
    echo -e "${GREEN}✓${NC} Volume 'data' already exists"
  else
    echo "Creating volume 'data' for database..."
    railway volume add data
    echo -e "${GREEN}✓${NC} Volume created"
  fi
}

# Deploy to Railway
deploy() {
  echo -e "\n🚀 Deploying to Railway..."

  railway up

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
  else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
  fi
}

# Get deployment info
get_deployment_info() {
  echo -e "\n📊 Deployment Information:"
  echo "================================"

  # Get project URL
  DOMAIN=$(railway domain 2>/dev/null | head -n1)
  if [ -n "$DOMAIN" ]; then
    echo "Public URL: https://$DOMAIN"
  fi

  # Get service URL
  echo ""
  echo "View logs: railway logs"
  echo "Open dashboard: railway open"
  echo ""
}

# Health check
health_check() {
  echo -e "⏳ Running health check..."

  # Get domain
  DOMAIN=$(railway domain 2>/dev/null | head -n1)
  if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠ Could not determine domain, skipping health check${NC}"
    return
  fi

  # Wait for deployment to be ready
  sleep 5

  # Check health endpoint
  HEALTH_URL="https://$DOMAIN/health"
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")

  if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed (200 OK)${NC}"
  else
    echo -e "${YELLOW}⚠ Health check returned $RESPONSE${NC}"
    echo "Manual check: curl $HEALTH_URL"
  fi
}

# Setup webhook
setup_webhook() {
  echo -e "\n🔗 Setting up Telegram webhook..."

  # Get domain
  DOMAIN=$(railway domain 2>/dev/null | head -n1)
  if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠ Could not determine domain, skipping webhook setup${NC}"
    echo "Set it manually with:"
    echo "  curl -X POST 'https://api.telegram.org/bot<TOKEN>/setWebhook' \\"
    echo "    -H 'Content-Type: application/json' \\"
    echo "    -d '{\"url\": \"https://YOUR_DOMAIN/webhook\"}'"
    return
  fi

  # Get bot token
  BOT_TOKEN=$(railway variables get TELEGRAM_BOT_TOKEN 2>/dev/null)
  if [ -z "$BOT_TOKEN" ] || [ "$BOT_TOKEN" = "null" ]; then
    echo -e "${RED}❌ TELEGRAM_BOT_TOKEN not set${NC}"
    echo "Set it first: railway variables set TELEGRAM_BOT_TOKEN=your_token"
    return
  fi

  # Get webhook secret
  WEBHOOK_SECRET=$(railway variables get WEBHOOK_SECRET 2>/dev/null)

  # Set webhook
  WEBHOOK_URL="https://$DOMAIN/webhook"
  echo "Setting webhook to: $WEBHOOK_URL"

  RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$WEBHOOK_URL\", \"secret_token\": \"$WEBHOOK_SECRET\"}")

  if echo "$RESPONSE" | grep -q '"ok":true'; then
    echo -e "${GREEN}✅ Webhook set successfully${NC}"
  else
    echo -e "${RED}❌ Webhook setup failed${NC}"
    echo "Response: $RESPONSE"
  fi
}

# Main execution
main() {
  check_prerequisites
  setup_project
  setup_environment
  setup_volume
  deploy
  get_deployment_info
  health_check

  echo ""
  read -p "Set up Telegram webhook now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    setup_webhook
  fi

  echo -e "\n${GREEN}============================================${NC}"
  echo -e "${GREEN}✅ Deployment Complete!${NC}"
  echo -e "${GREEN}============================================${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Test your bot in Telegram"
  echo "  2. View logs: railway logs"
  echo "  3. Open dashboard: railway open"
  echo ""
  echo "Quick rollback: railway rollback <deployment-id>"
  echo ""
}

# Run main function
main
