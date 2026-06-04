# Railway Deployment Guide - Telegram Notion Bot

## Overview
This guide covers deploying the Telegram Notion Bot to Railway using the provided `railway.toml` configuration.

## Prerequisites

### Railway Account
1. Sign up at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`
3. Authenticate: `railway login`

### Telegram Bot Setup
1. Create bot via [@BotFather](https://t.me/BotFather)
2. Save the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
3. Note: Webhook URL will be configured after deployment

## Environment Variables

The following environment variables are configured in `railway.toml`:

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Production mode |
| `LOG_LEVEL` | `info` | Logging verbosity |
| `DATABASE_URL` | `sqlite:./orders.db` | SQLite database path |
| `PORT` | `3000` | Express server port |

### Additional Variables to Set in Railway

You must add these in Railway dashboard after project creation:

1. **TELEGRAM_BOT_TOKEN** (Required)
   - Get from BotFather
   - Format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Keep secret, never commit to git

2. **WEBHOOK_SECRET** (Optional but recommended)
   - Random string for webhook verification
   - Generate: `openssl rand -hex 32`
   - Example: `a1b2c3d4e5f6...`

## Deployment Steps

### 1. Create Railway Project

```bash
# Navigate to project directory
cd /home/tolgabrk/projects/Auto-Company/projects/telegram-notion-bot

# Initialize Railway project
railway init
```

Or create via Railway dashboard:
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your repository
4. Railway will auto-detect the project from `railway.toml`

### 2. Configure Environment Variables

In Railway dashboard:
1. Go to project Settings → Variables
2. Add `TELEGRAM_BOT_TOKEN` (from BotFather)
3. Add `WEBHOOK_SECRET` (optional but recommended)

### 3. Deploy

```bash
# Deploy to Railway
railway up

# Or trigger deployment from dashboard
# Railway auto-deploys on git push to main branch
```

### 4. Get Deployment URL

```bash
# Get public URL
railway domain

# Or find in dashboard:
# Settings → Domains → Copy the public URL
```

Example: `https://telegram-notion-bot.up.railway.app`

## Webhook Configuration

After deployment, configure Telegram webhook:

### 1. Get Webhook URL

Combine your Railway domain with the webhook path:
```
https://<your-project-domain>.up.railway.app/telegram/webhook
```

Example:
```
https://telegram-notion-bot.up.railway.app/telegram/webhook
```

### 2. Set Webhook via Telegram API

```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-project-domain.up.railway.app/telegram/webhook",
    "secret_token": "YOUR_WEBHOOK_SECRET"
  }'
```

Replace:
- `<TELEGRAM_BOT_TOKEN>` with your actual bot token
- `your-project-domain.up.railway.app` with your Railway domain
- `YOUR_WEBHOOK_SECRET` with the secret you set (if any)

### 3. Verify Webhook

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo"
```

Expected response:
```json
{
  "ok": true,
  "result": {
    "url": "https://your-project-domain.up.railway.app/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": 0,
    "last_error_message": "",
    "active": true
  }
}
```

## Health Check

Railway will automatically check `/health` endpoint to ensure the service is running.

The Express server should include:
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: Date.now() });
});
```

## Monitoring

### Railway Dashboard
- View logs in Dashboard → Logs
- Monitor metrics in Dashboard → Metrics
- Check deployment status in Dashboard → Deployments

### View Logs via CLI

```bash
# Stream logs in real-time
railway logs

# View last 100 lines
railway logs -n 100
```

## Troubleshooting

### Bot Not Responding

1. **Check deployment status**
   ```bash
   railway status
   ```

2. **View logs for errors**
   ```bash
   railway logs
   ```

3. **Verify webhook is set**
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
   ```

4. **Check Telegram API connectivity**
   - Ensure Railway domain is accessible
   - Verify no firewall blocking Telegram API

### Database Issues

The SQLite database is stored at `./orders.db` relative to the working directory.

**Important**: Railway uses ephemeral storage. Database will be lost on redeployment.

For production, consider:
1. Railway Volume (persistent disk)
2. External database (Supabase, PostgreSQL)

### Environment Variables Not Set

```bash
# Verify variables are set
railway variables

# List all variables (values are masked)
railway variables list
```

## Scaling

Railway automatically scales based on load:

- **Min instances**: 1 (always on)
- **Max instances**: Auto-scales with traffic
- **Concurrency**: Handles multiple simultaneous requests

For manual scaling:
1. Dashboard → Settings → Scaling
2. Adjust min/max instances

## CI/CD Integration

Railway auto-deploys on git push:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
# Railway auto-deploys
```

Branch previews:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
# Railway creates preview URL
```

## Cost Estimates

Railway pricing (as of 2025):
- **Free tier**: $5/month credit
- **Hobby**: $5/month (~1.7GB RAM, 0.5 vCPU)
- **Pro**: $20/month (~4GB RAM, 1 vCPU)

Telegram bot is lightweight:
- **RAM**: ~100-200MB
- **CPU**: Minimal (event-driven)
- **Network**: Low (webhook payload only)

Estimated cost: **$5/month or less** (Hobby plan sufficient)

## Security Checklist

- [ ] TELEGRAM_BOT_TOKEN set in Railway variables (not in code)
- [ ] WEBHOOK_SECRET configured for webhook verification
- [ ] Railway project set to private (if applicable)
- [ ] Logs don't expose sensitive data
- [ ] Database credentials not hardcoded
- [ ] HTTPS enforced (Railway automatic)
- [ ] Rate limiting configured (if applicable)

## Quick Start Command Summary

```bash
# Complete deployment flow
railway login
cd /home/tolgabrk/projects/Auto-Company/projects/telegram-notion-bot
railway init
railway up
railway domain  # Get deployment URL
# Set webhook with the domain
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d '{"url": "https://<domain>.up.railway.app/telegram/webhook"}'
```

## Next Steps

1. Deploy bot to Railway
2. Configure webhook
3. Test bot functionality on Telegram
4. Set up monitoring and alerts
5. Configure persistent storage (Railway Volume) for database

---

**DevOps-Hightower**: Deployment configuration complete. Ready to ship.
