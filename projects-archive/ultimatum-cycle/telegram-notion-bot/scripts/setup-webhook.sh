#!/bin/bash

# Webhook Setup Script for Railway Deployment
# Usage: ./scripts/setup-webhook.sh <BOT_TOKEN> <RAILWAY_DOMAIN> [WEBHOOK_SECRET]

set -e

if [ $# -lt 2 ]; then
  echo "Usage: $0 <BOT_TOKEN> <RAILWAY_DOMAIN> [WEBHOOK_SECRET]"
  echo ""
  echo "Example:"
  echo "  $0 123456789:ABC telegram-notion-bot.up.railway.app my-secret"
  echo ""
  echo "Get BOT_TOKEN from @BotFather"
  echo "Get RAILWAY_DOMAIN from: railway domain"
  exit 1
fi

BOT_TOKEN="$1"
RAILWAY_DOMAIN="$2"
WEBHOOK_SECRET="${3:-}"

WEBHOOK_URL="https://${RAILWAY_DOMAIN}/telegram/webhook"

echo "Setting webhook for bot..."
echo "URL: ${WEBHOOK_URL}"
echo ""

if [ -n "$WEBHOOK_SECRET" ]; then
  echo "Using webhook secret for verification"
  curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"${WEBHOOK_URL}\", \"secret_token\": \"${WEBHOOK_SECRET}\"}"
else
  echo "No webhook secret - setting without verification"
  curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"${WEBHOOK_URL}\"}"
fi

echo ""
echo "Verifying webhook status..."
sleep 2
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"

echo ""
echo "Webhook setup complete!"
echo "Send a message to your bot to test."
