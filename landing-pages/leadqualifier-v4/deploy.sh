#!/bin/bash
# LeadQualifier v4 — One-Click Deploy
# Deploys landing page to Vercel and form API to Cloudflare Workers

set -e

echo "🚀 LeadQualifier v4 — Deployment"
echo "================================"

# Check prerequisites
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not found. Run: npm i -g vercel"; exit 1; }
command -v wrangler >/dev/null 2>&1 || { echo "❌ Wrangler not found. Run: npm i -g wrangler"; exit 1; }

# Deploy landing page to Vercel
echo ""
echo "📦 Deploying landing page to Vercel..."
cd "$(dirname "$0")"
vercel --prod --yes

echo ""
echo "⚡ Deploying form API to Cloudflare Workers..."
cd form
wrangler publish

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 URLs:"
echo "  - Landing page: https://leadqualifier-v4.vercel.app"
echo "  - Form API: https://leadqualifier-v4-form.your-subdomain.workers.dev"
echo ""
echo "🔧 To check form submissions:"
echo "  curl https://leadqualifier-v4-form.your-subdomain.workers.dev"
echo ""
