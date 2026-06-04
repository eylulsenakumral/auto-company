# Telegram Notion Bot - Deployment Guide

## Platform Decision: Railway

**Rationale:**
- ✅ Already configured (railway.toml exists)
- ✅ Free tier: $5 credit monthly, 512MB RAM sufficient
- ✅ Persistent volume for SQLite (no DB migration needed)
- ✅ Built-in health checks and auto-restart
- ✅ One-command deploy: `railway up`
- ✅ Native Node.js support (no Docker needed)

**Alternatives Rejected:**
- ❌ Vercel: No long-running processes, limited to serverless functions
- ❌ Cloudflare Workers: No native Node.js support, requires significant rewrite
- ❌ Bare VPS: Manual ops overhead, violates "zero maintenance" principle

## Deployment Timeline: < 5 minutes

### Prerequisites

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

### Step 1: Create Project (1 minute)

```bash
cd projects/telegram-notion-bot/
railway init
railway link  # Link to existing project if any
```

### Step 2: Set Environment Variables (1 minute)

Via CLI:
```bash
railway variables set TELEGRAM_BOT_TOKEN=your_bot_token
railway variables set WEBHOOK_SECRET=your_random_secret
railway variables set NODE_ENV=production
railway variables set LOG_LEVEL=info
```

Or via Railway dashboard: Settings → Variables

### Step 3: Add Persistent Volume (1 minute)

```bash
# Create volume for SQLite database
railway volume add data

# Set DATABASE_URL to use volume
railway variables set DATABASE_URL=sqlite:./data/orders.db
```

### Step 4: Deploy (1 minute)

```bash
railway up
```

**Output:**
```
Building...
✓ Built in 23s
Deploying...
✓ Deployed to railway.app
```

### Step 5: Set Webhook (1 minute)

Get your Railway URL:
```bash
railway domain
```

Set webhook via Telegram API:
```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.railway.app/webhook",
    "secret_token": "your-webhook-secret"
  }'
```

### Step 6: Verify (30 seconds)

```bash
# Health check
curl https://your-app.railway.app/health

# Should return: {"status":"ok","timestamp":"2025-06-03T..."}
```

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot token from BotFather | `123456789:ABC...` |
| `WEBHOOK_SECRET` | ✅ | Webhook verification secret | `random-string-123` |
| `DATABASE_URL` | ✅ | SQLite path (with volume) | `sqlite:./data/orders.db` |
| `NODE_ENV` | Optional | Environment | `production` |
| `LOG_LEVEL` | Optional | Logging verbosity | `info` |
| `PORT` | Auto | Server port (Railway sets this) | Auto |

## Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-03T10:30:45.123Z"
}
```

**Railway Configuration:** Already set in `railway.toml`
- Path: `/health`
- Timeout: 300s
- Retries: 10 (auto-restart on failure)

## Monitoring & Logging

### View Logs

```bash
# Real-time logs
railway logs

# Last 100 lines
railway logs -n 100

# Filter by service
railway logs --service telegram-notion-bot
```

### Log Format

```
[INFO] 2025-06-03T10:30:45.123Z Server running on port 3000
[INFO] 2025-06-03T10:30:45.124Z Webhook mode enabled
[INFO] 2025-06-03T10:30:45.125Z Bot started successfully
```

### Error Tracking

Errors automatically logged to Railway dashboard:
- Metrics → Logs
- Filter by: `[ERROR]`
- Set up alerts (Settings → Notifications)

## Rollback Procedure

**Time to rollback: < 30 seconds**

### Option 1: Via CLI (Fastest)

```bash
# View deployments
railway deployments

# Rollback to previous deployment
railway rollback <previous-deployment-id>
```

### Option 2: Via Dashboard

1. Open Railway dashboard
2. Select project → Deployments
3. Click "Revert" on previous deployment
4. Confirm

### Option 3: Git-based (Ultimate Fallback)

```bash
# Revert commit locally
git revert HEAD
git push origin main

# Railway auto-deploys on push
```

## Cost Analysis

### Railway Free Tier

- **Monthly Credit:** $5
- **Actual Cost:** ~$3-4/month
  - Service: $0.50/month (512MB RAM)
  - Volume: $0.25/month (1GB storage)
  - Bandwidth: $0.10/GB
- **Estimated Usage:** 50K bot requests/month ≈ $3.50

### Upgrade Threshold

Upgrade to paid tier when:
- Monthly cost exceeds $5 credit
- RAM usage > 512MB consistently
- Need > 1GB storage

**Paid Tier:** $5/month base + usage
- Still cheapest managed option for scale

## Disaster Recovery

### Database Backup

```bash
# Manual backup via Railway shell
railway shell
cp data/orders.db data/orders.db.backup

# Download backup
railway volume download data
```

### Automatic Backups (Recommended)

Add to `scripts/backup.sh`:
```bash
#!/bin/bash
railway shell "cp data/orders.db data/orders.db.$(date +%Y%m%d).db"
```

Schedule via Railway cron or external cron job.

### Recovery from Scratch

```bash
# Redeploy from scratch
railway up

# Restore database
railway shell
# Paste orders.db content to data/orders.db
```

## Troubleshooting

### Bot Not Responding

1. Check logs: `railway logs`
2. Verify webhook: `curl https://api.telegram.org/bot<token>/getWebhookInfo`
3. Health check: `curl https://your-app.railway.app/health`

### Database Errors

1. Check volume status: `railway volume ls`
2. Verify DATABASE_URL: `railway variables get DATABASE_URL`
3. Manual inspection: `railway shell` → `sqlite3 data/orders.db`

### Deployment Failures

1. Check build logs: `railway logs --build`
2. Verify build config: `railway build`
3. Test locally: `npm run build && npm start`

## Post-Deployment Checklist

- [ ] Health check returns 200
- [ ] Webhook verified via Telegram API
- [ ] Test bot message → receives response
- [ ] Test payment flow → order recorded in DB
- [ ] Logs visible in Railway dashboard
- [ ] Volume created and persistent
- [ ] Rollback tested (deploy → rollback → verify)

## Security Considerations

1. **Webhook Secret:** Always use random string, never commit to git
2. **Bot Token:** Store in Railway variables, never in code
3. **Database:** No public access, only via Railway private network
4. **HTTPS:** Railway provides automatic SSL certificates

## Next Actions

1. Set up monitoring alerts (Railway dashboard)
2. Configure error tracking (Sentry or similar, optional)
3. Add business metrics (orders/day, revenue, conversion rate)
4. Document scaling plan (when to upgrade tier)

## Support Resources

- Railway Docs: https://docs.railway.app
- Telegram Bot API: https://core.telegram.org/bots/api
- GrammyJS Docs: https://grammyjs.dev

---

**Deployment success criteria:**
- Single command deploy: `railway up`
- Free tier or <$5/month
- Bot responds to messages
- Orders persist across restarts
- Rollback < 30 seconds
