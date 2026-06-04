# Operations Runbook - Telegram Notion Bot

## Quick Reference

| Command | Purpose |
|---------|---------|
| `railway up` | Deploy |
| `railway logs` | View logs |
| `railway open` | Open dashboard |
| `railway shell` | Access shell |
| `railway rollback <id>` | Rollback |
| `./scripts/deploy.sh` | Full deploy script |
| `./scripts/rollback.sh` | Quick rollback |

## Common Issues & Solutions

### Issue: Bot Not Responding

**Symptoms:**
- Bot doesn't reply to messages
- /start command has no effect
- Webhook updates not processed

**Diagnosis:**
```bash
# 1. Check health
curl https://your-app.railway.app/health

# 2. Check logs
railway logs

# 3. Verify webhook
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

**Solutions:**

**A. Service Down:**
```bash
# Check deployment status
railway status

# Restart service
railway up

# If failing, check logs for errors
railway logs | grep -i error
```

**B. Webhook Not Set:**
```bash
# Reset webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-app.railway.app/webhook", "secret_token": "SECRET"}'
```

**C. Bot Token Invalid:**
```bash
# Verify bot exists
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# If error, get new token from @BotFather
# Update in Railway dashboard: Settings → Variables
railway variables set TELEGRAM_BOT_TOKEN=new_token
```

**D. Webhook Secret Mismatch:**
```bash
# Check secret in logs
railway logs | grep -i webhook

# Regenerate and update
railway variables set WEBHOOK_SECRET=$(openssl rand -hex 32)

# Reset webhook with new secret
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d '{"url": "https://your-app.railway.app/webhook", "secret_token": "NEW_SECRET"}'
```

### Issue: Database Errors

**Symptoms:**
- "Database is locked" errors
- Orders not saving
- Query failures

**Diagnosis:**
```bash
# Access shell
railway shell

# Check database exists
ls -la data/

# Check database integrity
sqlite3 data/orders.db "PRAGMA integrity_check;"
```

**Solutions:**

**A. Database Locked:**
```bash
# Check for open connections
lsof data/orders.db

# Restart service to release locks
railway restart
```

**B. Database Corrupted:**
```bash
# Restore from backup
railway shell
cp data/orders.db.backup.YYYYMMDD data/orders.db

# If no backup, recreate
rm data/orders.db
exit
railway restart  # Will recreate schema
```

**C. Volume Issues:**
```bash
# Check volume status
railway volume ls

# If missing, recreate
railway volume add data
```

### Issue: Payment Failures

**Symptoms:**
- Payments not processing
- "Payment failed" errors
- Orders stuck in "pending"

**Diagnosis:**
```bash
# Check payment-related logs
railway logs | grep -i payment

# Check database for pending orders
railway shell
sqlite3 data/orders.db "SELECT * FROM orders WHERE payment_status='pending';"
```

**Solutions:**

**A. Telegram Stars Not Configured:**
```bash
# Verify bot has Telegram Stars enabled
curl "https://api.telegram.org/bot<TOKEN>/getMe"

# Check response for "can_join_groups": true
```

**B. Payment Handler Error:**
```bash
# Check bot.ts implementation
railway shell
cat dist/bot.js | grep -A 20 "pre_checkout_query"

# Ensure payment handler is registered
```

**C. Webhook Timeout:**
```bash
# Railway healthcheck timeout may be too short
# Update railway.toml:
[deploy]
healthcheckTimeout = 600  # Increase to 10 minutes
```

### Issue: High Memory Usage

**Symptoms:**
- Service crashes/restarts
- "Out of memory" in logs
- Slow response times

**Diagnosis:**
```bash
# Check memory usage
railway metrics

# Check logs for memory warnings
railway logs | grep -i memory
```

**Solutions:**

**A. Memory Leak:**
```bash
# Restart service to clear memory
railway restart

# If recurring, analyze code for leaks
# Check for:
# - Unclosed database connections
# - Large object caches
# - Event listeners not removed
```

**B. Upgrade Tier:**
```bash
# If consistently > 512MB
# Upgrade in Railway dashboard: Settings → Plan
# Or add more RAM in project settings
```

### Issue: Deployment Failures

**Symptoms:**
- `railway up` fails
- Build errors
- Service not starting

**Diagnosis:**
```bash
# Check build logs
railway logs --build

# Test build locally
npm run build
npm start
```

**Solutions:**

**A. Build Error:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build

# Redeploy
railway up --force
```

**B. Missing Dependencies:**
```bash
# Check package.json
cat package.json

# Install missing deps
npm install <package>

# Commit and push
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

**C. Port Conflict:**
```bash
# Ensure PORT is from Railway env
# In server.ts:
const port = process.env.PORT || 3000;

# Railway sets PORT automatically
# Don't hardcode port
```

### Issue: Webhook Not Receiving Updates

**Symptoms:**
- No logs showing webhook calls
- Telegram shows webhook set but no updates
- Bot works in polling mode but not webhook

**Diagnosis:**
```bash
# Check webhook info
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Test webhook manually
curl -X POST https://your-app.railway.app/webhook \
  -H "Content-Type: application/json" \
  -H "X-Telegram-Bot-Api-Secret-Token: SECRET" \
  -d '{"update_id": 1, "message": {"text": "test"}}'
```

**Solutions:**

**A. Webhook URL Wrong:**
```bash
# Get correct domain
railway domain

# Reset webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d '{"url": "https://CORRECT_DOMAIN/webhook"}'
```

**B. Railway Service Not Public:**
```bash
# Check service is public
railway status

# Ensure not in private network
# Settings → Service → Public: true
```

**C. Firewall/Security:**
```bash
# Railway has no firewall restrictions
# Check if custom middleware blocking
# Check server.ts for any rate limiting
```

## Maintenance Tasks

### Daily (Automated)

- **Database Backup:** Automated via cron
- **Log Rotation:** Railway handles automatically
- **Health Checks:** Railway monitors continuously

### Weekly (Manual)

```bash
# Check deployment status
railway status

# Review logs for errors
railway logs | grep ERROR | tail -50

# Check database size
railway shell
du -h data/orders.db

# Check memory usage
railway metrics
```

### Monthly (Manual)

```bash
# Review all deployments
railway deployments

# Clean old backups
railway shell
rm data/orders.db.backup.$(date -d '3 months ago' +%Y%m%d)*

# Update dependencies
npm update
npm audit fix

# Test rollback procedure
./scripts/rollback.sh <previous-deployment-id>
```

## Emergency Procedures

### Emergency Rollback (< 30 seconds)

```bash
# Quick rollback script
./scripts/rollback.sh

# Or manual
railway deployments
railway rollback <stable-deployment-id>
```

### Emergency Shutdown

```bash
# Pause service immediately
railway pause

# Or delete webhook to stop processing
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
```

### Emergency Scale-Up

```bash
# If under heavy load
# Upgrade tier in dashboard
railway open

# Or add more resources
# Settings → Service → Add RAM
```

## Performance Tuning

### Database Optimization

**Current:** SQLite sufficient for < 10K orders

**When to optimize:**
- Queries > 100ms
- Database > 100MB
- Frequent locks

**Optimization steps:**
```bash
# Analyze queries
railway shell
sqlite3 data/orders.db "EXPLAIN QUERY PLAN SELECT * FROM orders WHERE user_id=123;"

# Add indexes if needed
sqlite3 data/orders.db "CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);"

# Vacuum database
sqlite3 data/orders.db "VACUUM;"
```

### Logging Optimization

**Current:** Structured logging via `logger.ts`

**When to optimize:**
- Logs > 1GB/day
- Slow log writes

**Optimization steps:**
```typescript
// Reduce log level in production
process.env.LOG_LEVEL = 'warn';  // Only log warnings and errors

// Batch log writes
const logBuffer = [];
setInterval(() => {
  if (logBuffer.length > 0) {
    logger.info(logBuffer);
    logBuffer.length = 0;
  }
}, 5000);
```

### Caching Strategy

**Current:** No caching (not needed yet)

**When to add caching:**
- 10K+ requests/day
- Slow template metadata queries

**Implementation:**
```typescript
// Simple in-memory cache
const templateCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

function getCachedTemplate(id: string) {
  const cached = templateCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = fetchTemplate(id);
  templateCache.set(id, { data, timestamp: Date.now() });
  return data;
}
```

## Scaling Strategy

### Vertical Scaling (Railway)

**Current:** 512MB RAM, 1GB storage

**Scale triggers:**
- RAM usage > 80% consistently
- Storage > 80%
- Response time > 500ms p95

**Scale steps:**
1. Upgrade Railway tier ($5/month base)
2. Add RAM (1GB, 2GB options)
3. Add storage (10GB, 100GB options)

### Horizontal Scaling (Future)

**When needed:**
- 100K+ requests/day
- Multiple regions needed
- High availability required

**Approach:**
1. Add load balancer (Railway Load Balancer)
2. Multiple service instances
3. Shared database (PostgreSQL)
4. Session cache (Redis)

## Monitoring Setup

### Key Metrics to Monitor

**Technical:**
- Health check status (uptime)
- Response time (p50, p95, p99)
- Error rate (%)
- Memory usage (%)
- Disk usage (%)
- Request rate (req/min)

**Business:**
- Orders/day
- Revenue/day
- Conversion rate (%)
- Average order value
- Payment success rate (%)

### Alert Configuration

**Railway Dashboard:**
- Settings → Notifications
- Add Slack/email/webhook

**Alert Rules:**
```yaml
alerts:
  - name: Health Check Failure
    condition: health_check != 200
    duration: 3m
    severity: P0

  - name: High Error Rate
    condition: error_rate > 5%
    duration: 5m
    severity: P1

  - name: High Memory Usage
    condition: memory_usage > 90%
    duration: 10m
    severity: P1

  - name: Disk Space Low
    condition: disk_usage > 85%
    duration: 15m
    severity: P2
```

### Dashboard Setup

**Railway Built-in:**
- Metrics tab shows all metrics
- Logs tab shows real-time logs
- Deployments tab shows deployment history

**Custom Dashboard (Optional):**
```typescript
// Add /metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    orders_today: getOrdersCount(Date.now() - 86400000),
    revenue_today: getRevenueToday()
  });
});
```

## Security Checklist

### Environment Variables

- [ ] `TELEGRAM_BOT_TOKEN` set in Railway only (never in code)
- [ ] `WEBHOOK_SECRET` randomly generated (32+ chars)
- [ ] No secrets in `.env` files committed to git
- [ ] `.gitignore` includes `.env*`

### Webhook Security

- [ ] Webhook secret verification implemented
- [ ] HTTPS only (Railway provides SSL)
- [ ] Rate limiting on webhook endpoint
- [ ] Input validation on all updates

### Database Security

- [ ] No remote database access
- [ ] Database file on persistent volume only
- [ ] Regular backups automated
- [ ] Backups encrypted (if sensitive data)

### Code Security

- [ ] Dependencies scanned: `npm audit`
- [ ] No hardcoded secrets
- [ ] Error messages don't leak info
- [ ] SQL queries parameterized

## Troubleshooting Commands

### Quick Diagnostics

```bash
# Full system check
railway status && \
railway logs | tail -20 && \
curl -s https://your-app.railway.app/health && \
curl -s "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

### Database Inspection

```bash
# Access shell
railway shell

# Check database
sqlite3 data/orders.db "
  SELECT
    COUNT(*) as total_orders,
    SUM(CASE WHEN payment_status='completed' THEN 1 ELSE 0 END) as completed,
    SUM(amount_stars) as total_stars
  FROM orders;
"

# Check recent orders
sqlite3 data/orders.db "
  SELECT * FROM orders
  ORDER BY created_at DESC
  LIMIT 10;
"
```

### Performance Analysis

```bash
# Check resource usage
railway metrics

# Check slow queries (if added logging)
railway logs | grep "slow_query"

# Check response times
railway logs | grep "duration"
```

## Incident Response

### Incident Levels

**P0 - Critical (Immediate Response):**
- Service completely down
- Payments failing
- Data loss suspected
- Response time: < 15 minutes

**P1 - High (Response < 1 hour):**
- Degraded performance
- Intermittent errors
- Feature broken
- Response time: < 1 hour

**P2 - Medium (Response < 4 hours):**
- Minor bugs
- UX issues
- Response time: < 4 hours

**P3 - Low (Response < 24 hours):**
- Enhancements
- Questions
- Response time: < 24 hours

### Incident Workflow

```
1. Detect (Monitoring alert or user report)
   ↓
2. Assess (Determine severity and impact)
   ↓
3. Contain (If P0, rollback immediately)
   ↓
4. Communicate (Notify stakeholders if P0/P1)
   ↓
5. Fix (Implement fix or workaround)
   ↓
6. Verify (Test fix in staging)
   ↓
7. Deploy (Deploy fix to production)
   ↓
8. Monitor (Watch for 1 hour post-deploy)
   ↓
9. Document (Write post-mortem)
```

### Post-Incident Review

**Questions to ask:**
1. What happened?
2. Why did it happen?
3. How did we detect it?
4. How long did it take to fix?
5. What went well?
6. What could be improved?
7. Action items to prevent recurrence?

**Document in:** `docs/devops/incidents.md`

---

**Runbook Philosophy:**
- Fast recovery > perfect understanding
- Automate repetitive tasks
- Document every incident
- Learn from failures

**Success Criteria:**
- P0 incidents: < 15 minute MTTR
- P1 incidents: < 1 hour MTTR
- No recurring incidents
- Continuous improvement
