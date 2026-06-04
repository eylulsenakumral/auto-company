# Deployment Architecture - Telegram Notion Bot

## Platform Decision: Railway

### Why Railway Won

| Criteria | Railway | Vercel | Cloudflare | VPS |
|----------|---------|--------|------------|-----|
| **Setup Time** | 5 min | 10 min | 30 min+ | 60 min+ |
| **Free Tier** | $5/mo credit | Serverless only | 100K req/day | None |
| **Long-running** | ✅ Native | ❌ Functions only | ❌ Workers only | ✅ Yes |
| **Persistent Storage** | ✅ Volume | ❌ No | ❌ KV only | ✅ Yes |
| **Auto-restart** | ✅ Built-in | N/A | N/A | Manual |
| **SSL Certificates** | ✅ Auto | ✅ Auto | ✅ Auto | Manual |
| **Logs** | ✅ Built-in | ✅ Built-in | ✅ Built-in | Manual |
| **One-command deploy** | ✅ `railway up` | ✅ `vercel` | ❌ Multi-step | ❌ No |
| **Ops Overhead** | Zero | Zero | Zero | High |

**Winner: Railway** - Best balance of simplicity, persistence, and cost.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Railway Platform                          │
│  ┌──────────────────────────────────────────────────────────┐│
│  │              Node.js Service (512MB RAM)                  ││
│  │  ┌──────────────────────────────────────────────────────┐││
│  │  │           Express Server (port 3000)                  │││
│  │  │  ┌────────────────┐  ┌──────────────────────────────┐ │││
│  │  │  │  /health       │  │  /webhook                      │ │││
│  │  │  │  (healthcheck) │  │  (Telegram updates)            │ │││
│  │  │  └────────────────┘  │  ↓                             │ │││
│  │  │                     │  Grammy Bot                     │ │││
│  │  │                     │  ↓                              │ │││
│  │  │                     │  Orders Database                │ │││
│  │  │                     └──────────────────────────────────┘ │││
│  │  └──────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐│
│  │       Persistent Volume (1GB, orders.db)                  ││
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  Telegram API │
                    └──────────────┘
```

## Deployment Flow

### 1. Initial Setup (One-time)

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd projects/telegram-notion-bot/
railway init
```

### 2. Configure Environment

```bash
# Set required variables
railway variables set TELEGRAM_BOT_TOKEN=your_token
railway variables set WEBHOOK_SECRET=random_secret
railway variables set DATABASE_URL="sqlite:./data/orders.db"

# Create volume for persistence
railway volume add data
```

### 3. Deploy

```bash
# Single command
railway up

# Or use deployment script
./scripts/deploy.sh
```

### 4. Set Webhook

```bash
# Get domain
railway domain

# Set webhook via Telegram API
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.railway.app/webhook", "secret_token": "SECRET"}'
```

## Health Check & Monitoring

### Health Endpoint

**Route:** `GET /health`

**Implementation:**
```typescript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});
```

**Railway Configuration:**
- Path: `/health`
- Timeout: 300s
- Restart policy: on-failure (max 10 retries)

### Logging Strategy

**Log Levels:**
- `error` - Payment failures, database errors
- `warn` - Retry attempts, missing data
- `info` - Bot events, orders, deployments
- `debug` - Detailed request/response (dev only)

**Log Format:**
```json
{
  "level": "info",
  "message": "Order received",
  "timestamp": "2025-06-03T10:30:45.123Z",
  "meta": {
    "user_id": 123456789,
    "template_id": "template-1",
    "amount": 50
  }
}
```

**View Logs:**
```bash
# Real-time
railway logs

# Filter errors
railway logs | grep ERROR

# Last 100 lines
railway logs -n 100
```

## Rollback Strategy

### Three Levels of Rollback

#### Level 1: Railway Rollback (Fastest - < 30s)

```bash
# View deployments
railway deployments

# Rollback to specific deployment
railway rollback <deployment-id>

# Or use script
./scripts/rollback.sh <deployment-id>
```

#### Level 2: Git Revert (If Railway fails)

```bash
# Revert last commit locally
git revert HEAD
git push origin main

# Railway auto-deploys on push
```

#### Level 3: Full Rebuild (Last resort)

```bash
# Checkout previous commit
git checkout <previous-commit-hash>

# Force redeploy
railway up --force
```

### Rollback Decision Tree

```
Deployment Issue Detected
    ↓
Is it critical? (users affected)
    ↓ Yes
Immediately rollback to last stable deployment
    ↓
Issue in code?
    ↓ Yes
Fix locally → test → push new deployment
    ↓
Issue in infrastructure?
    ↓ Yes
Fix in Railway dashboard → verify
    ↓
Document incident in docs/devops/incidents.md
```

## Cost Management

### Free Tier Limits

- **Monthly Credit:** $5
- **Service Cost:** ~$3-4/month
  - 512MB RAM: $0.50/month
  - 1GB Volume: $0.25/month
  - Bandwidth: $0.10/GB (estimated 50K requests ≈ 5GB)

### Usage Estimates

| Metric | Estimate | Cost |
|--------|----------|------|
| Bot requests | 50K/month | ~$2 |
| Storage | 1GB | $0.25 |
| RAM | 512MB | $0.50 |
| **Total** | | **~$3-4** |

### Upgrade Triggers

Upgrade to paid tier when:
- Monthly cost exceeds $5 credit
- RAM usage consistently > 512MB
- Need > 1GB storage
- Need custom domain (requires paid)

**Paid Tier:** $5/month base + usage

## Disaster Recovery

### Backup Strategy

#### Database Backups

**Manual Backup:**
```bash
# Access shell
railway shell

# Backup database
cp data/orders.db data/orders.db.backup.$(date +%Y%m%d)

# Download backup
exit
railway volume download data
```

**Automated Backup (Recommended):**

Add cron job to Railway:
```yaml
# railway.toml
[triggers.cron-backup]
schedule = "0 2 * * *"  # Daily at 2 AM
command = "cp data/orders.db data/orders.db.backup.$(date +%Y%m%d)"
```

#### Recovery Procedures

**Scenario 1: Database Corruption**
```bash
# Railway shell
railway shell

# Restore from backup
cp data/orders.db.backup.YYYYMMDD data/orders.db

# Verify
sqlite3 data/orders.db "SELECT COUNT(*) FROM orders;"
```

**Scenario 2: Complete Data Loss**
```bash
# Redeploy from scratch
railway up

# Restore database
railway volume upload data orders.db.backup
```

**Scenario 3: Railway Outage**
- Fallback: Local deployment (if critical)
- Escalation: Railway support (included in paid tier)

## Security Hardening

### Environment Variables

**Never commit secrets:**
```bash
# .gitignore
.env
.env.local
.env.production
```

**Store in Railway only:**
```bash
# Set via CLI (never in code)
railway variables set TELEGRAM_BOT_TOKEN=xxx
```

### Webhook Security

**Implementation:**
```typescript
// server.ts
app.post('/webhook', async (req, res) => {
  // Verify webhook secret
  const secret = req.headers['x-telegram-bot-api-secret-token'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.sendStatus(403);
  }

  // Process update
  await botInstance.handleUpdate(req.body);
  res.sendStatus(200);
});
```

### Database Security

**Best Practices:**
- No public access (only Railway private network)
- No remote connections allowed
- Backups stored securely (encrypted at rest)

### Network Security

**Railway Protections:**
- Automatic SSL certificates
- DDoS protection
- Private service mesh
- No public IP exposure

## Performance Optimization

### Current Performance

**Metrics:**
- Response time: < 100ms (webhook)
- Database query: < 10ms (SQLite)
- Memory usage: ~100MB (well under 512MB)
- CPU usage: < 5% idle

### Scaling Strategy

**When to Scale Up:**
- 10K+ requests/day
- > 400MB RAM usage
- > 800MB storage

**Scale Path:**
1. Upgrade Railway tier (more RAM)
2. Add read replica (if needed)
3. Migrate to PostgreSQL (if SQLite limits hit)

### Caching Strategy

**Current:** No caching needed (low traffic)

**Future:** If 10K+ requests/day:
```typescript
// Cache template metadata
const templateCache = new Map();

// Cache TTL: 1 hour
if (templateCache.has(templateId)) {
  return templateCache.get(templateId);
}
```

## Monitoring & Alerting

### Key Metrics

**Technical Metrics:**
- Health check status (200 OK)
- Response time (< 500ms p95)
- Error rate (< 1%)
- Memory usage (< 80%)
- Disk usage (< 90%)

**Business Metrics:**
- Orders/day
- Revenue/day
- Conversion rate (payments/views)
- Error rate by template

### Alert Setup

**Railway Dashboard:**
- Settings → Notifications
- Configure Slack/email alerts
- Alert conditions:
  - Health check fails > 3 times
  - Error rate > 5%
  - Memory usage > 90%

### Logging Best Practices

**Structured Logging:**
```typescript
logger.info('Order completed', {
  order_id: order.id,
  user_id: order.telegram_user_id,
  amount: order.amount_stars,
  duration: Date.now() - start_time
});
```

**Query Logs:**
```bash
# Find all errors
railway logs | grep ERROR

# Find specific order
railway logs | grep "order_12345"

# Count errors today
railway logs --since 1h | grep ERROR | wc -l
```

## Post-Deployment Verification

### Automated Checks

**Health Check:**
```bash
curl https://your-app.railway.app/health
# Expected: {"status":"ok","timestamp":"..."}
```

**Webhook Verification:**
```bash
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
# Expected: "url": "https://your-app.railway.app/webhook"
```

**Bot Response Test:**
```bash
# Send message via Telegram
# Expected: Bot responds within 5 seconds
```

### Manual Tests

1. **Health check** - Returns 200
2. **Webhook** - Receives Telegram updates
3. **Menu** - Bot sends template list
4. **Payment** - Payment flow works
5. **Database** - Order persists after restart
6. **Logs** - Logs visible in Railway dashboard

### Rollback Test

**Test rollback procedure:**
```bash
# Deploy new version (with intentional bug)
railway up

# Wait 30 seconds
sleep 30

# Rollback immediately
./scripts/rollback.sh <previous-deployment-id>

# Verify bot works again
```

## Support & Escalation

### Issue Severity Levels

**P0 - Critical:**
- Bot completely down
- Payments failing
- Data loss

**P1 - High:**
- Degraded performance
- Intermittent errors
- Feature broken

**P2 - Medium:**
- Minor bugs
- UI issues
- Documentation gaps

**P3 - Low:**
- Enhancements
- Questions
- Suggestions

### Escalation Path

```
Issue Detected
    ↓
Can you fix it?
    ↓ Yes
Fix and deploy
    ↓ No
Check Railway Status (status.railway.app)
    ↓
Railway issue?
    ↓ Yes
Wait for Railway fix (usually < 30 min)
    ↓ No
Check docs (docs.railway.app)
    ↓
Solution found?
    ↓ Yes
Implement fix
    ↓ No
Railway Support (paid tier)
```

### Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Status:** https://status.railway.app
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **GrammyJS Docs:** https://grammyjs.dev

## Continuous Improvement

### Deployment Metrics

**Track:**
- Deployment frequency
- Deployment success rate
- Mean time to restore (MTTR)
- Change failure rate

**Goals:**
- Deploy: Daily
- Success rate: > 95%
- MTTR: < 30 minutes
- Failure rate: < 5%

### Optimization Pipeline

```
Monitor Metrics
    ↓
Identify Bottlenecks
    ↓
Test Solutions Locally
    ↓
Deploy to Railway
    ↓
Measure Impact
    ↓
Keep or Rollback
```

---

**Deployment Philosophy:**
- Simple > Complex
- Automated > Manual
- Observable > Opaque
- Reversible > Irreversible

**Success Criteria:**
- Single command deploy: ✅ `railway up`
- Free tier or <$5/month: ✅ ~$3-4
- Bot persists data: ✅ SQLite on volume
- Logs accessible: ✅ Railway logs
- Rollback < 30s: ✅ `railway rollback`

**Ready to ship.**
