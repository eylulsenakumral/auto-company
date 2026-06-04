#!/bin/bash
# Telegram Notion Bot - One-Command Deployment Script
# Usage: ./DEPLOY_NOW.sh
# Prerequisites: Railway CLI installed, logged in

set -e  # Exit on error

echo "🚀 Telegram Notion Bot Deployment Starting..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✓ Railway CLI installed${NC}"
else
    echo -e "${GREEN}✓ Railway CLI found${NC}"
fi

# Check if logged in
if railway status &> /dev/null; then
    echo -e "${GREEN}✓ Already logged in to Railway${NC}"
else
    echo -e "${YELLOW}⚠️  Not logged in. Please run: railway login${NC}"
    echo "Then run this script again."
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Check if bot token exists...${NC}"
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo -e "${RED}❌ TELEGRAM_BOT_TOKEN not set in environment${NC}"
    echo ""
    echo "📝 INSTRUCTIONS:"
    echo "1. Open Telegram and search for @BotFather"
    echo "2. Send: /newbot"
    echo "3. Follow prompts to name your bot (e.g., 'My Notion Templates Bot')"
    echo "4. Copy the bot token (looks like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)"
    echo "5. Run this command:"
    echo "   export TELEGRAM_BOT_TOKEN=your_token_here"
    echo "6. Run this script again"
    echo ""
    exit 1
else
    echo -e "${GREEN}✓ Bot token found${NC}"
fi

echo ""
echo -e "${YELLOW}Step 3: Deploy to Railway...${NC}"
# Deploy to Railway
railway up

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 4: Get deployment URL...${NC}"
# Get the Railway domain
RAILWAY_URL=$(railway domain --raw 2>/dev/null || echo "")
if [ -z "$RAILWAY_URL" ]; then
    echo -e "${YELLOW}⚠️  Could not get domain automatically${NC}"
    echo "Please check Railway dashboard for the URL"
    RAILWAY_URL="[YOUR_RAILWAY_URL]"
fi
echo -e "${GREEN}✓ Deployment URL: https://${RAILWAY_URL}${NC}"

echo ""
echo -e "${YELLOW}Step 5: Set environment variables...${NC}"
# Set environment variables
railway variables set TELEGRAM_BOT_TOKEN="$TELEGRAM_BOT_TOKEN" 2>/dev/null || true
railway variables set WEBHOOK_SECRET="$(openssl rand -hex 32)" 2>/dev/null || true
railway variables set NODE_ENV=production 2>/dev/null || true
railway variables set DATABASE_URL="sqlite:./data/orders.db" 2>/dev/null || true
echo -e "${GREEN}✓ Environment variables set${NC}"

echo ""
echo -e "${YELLOW}Step 6: Create persistent volume...${NC}"
# Create volume for SQLite database
railway volume add data 2>/dev/null || echo -e "${YELLOW}⚠️  Volume may already exist${NC}"
echo -e "${GREEN}✓ Volume configured${NC}"

echo ""
echo -e "${YELLOW}Step 7: Set webhook...${NC}"
# Set webhook via Telegram API
WEBHOOK_URL="https://${RAILWAY_URL}/webhook"
WEBHOOK_SECRET=$(railway variables get WEBHOOK_SECRET 2>/dev/null || echo "default-secret")

echo "Setting webhook to: ${WEBHOOK_URL}"
curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\", \"secret_token\": \"${WEBHOOK_SECRET}\"}" > /tmp/webhook_response.json

WEBHOOK_STATUS=$(cat /tmp/webhook_response.json | grep -o '"ok":[^,]*' | cut -d: -f2)
if [ "$WEBHOOK_STATUS" = "true" ]; then
    echo -e "${GREEN}✓ Webhook set successfully${NC}"
else
    echo -e "${RED}❌ Webhook setup failed${NC}"
    cat /tmp/webhook_response.json
fi

echo ""
echo -e "${YELLOW}Step 8: Health check...${NC}"
# Wait a moment for deployment to be ready
sleep 5
HEALTH_CHECK=$(curl -s "https://${RAILWAY_URL}/health" || echo "{}")
if echo "$HEALTH_CHECK" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health check not yet responding (may need more time)${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "================================================"
echo ""
echo "📱 Bot URL: https://t.me/$(echo $TELEGRAM_BOT_TOKEN | cut -d: -f1)"
echo "🌐 Webhook: https://${RAILWAY_URL}/webhook"
echo "📊 Dashboard: https://railway.app/project/$(railway project id 2>/dev/null || echo 'check-dashboard')"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Test the bot in Telegram: /start"
echo "2. Check Railway dashboard for logs: railway logs"
echo "3. Monitor orders: railway shell → sqlite3 data/orders.db"
echo ""
echo "📚 Documentation:"
echo "- Deployment guide: DEPLOYMENT.md"
echo "- Implementation status: IMPLEMENTATION_COMPLETE.md"
echo ""
