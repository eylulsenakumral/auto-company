# Deployment Verification Quick Reference
**Print this for deployment day.** 

## Pre-Deploy (Before DEPLOY_NOW.sh)

```bash
# 1. Verify bot token valid (30 seconds)
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
# Expected: Bot info JSON, not 401

# 2. Check Railway status (10 seconds)
railway status
# Expected: Project exists and ready

# 3. Quick database schema check (code review)
# Look at src/database.ts - ensure createOrder, getOrdersByUser, updateOrderStatus exist
```

## Smoke Tests (Immediately After Deploy)

**Test 1: Bot Responding**
```
Send: /start
Expected: Welcome message within 2 seconds
If fails: railway logs --tail
```

**Test 2: Templates Load**
```
Send: /templates
Expected: 5 templates with buttons
If fails: Check templates.json exists
```

**Test 3: Template Details**
```
Click any template button
Expected: Details with features, price, purchase button
If fails: Template data malformed
```

**Test 4: Order Creation**
```
Click "Stars ile Satın Al"
Expected: Payment prompt with correct price
If fails: railway shell → sqlite3 data/orders.db "SELECT * FROM orders;"
```

**Test 5: Order History**
```
Send: /myorders
Expected: Shows order from Test 4
If fails: User ID mismatch or DB read error
```

## Day 1 Monitoring

### Every 30 Minutes (30 seconds)
```bash
railway logs --tail 20 | grep -E "\[ERROR\|\[WARN\|successful_payment"
# More than 5 errors = investigate
```

### Every 4 Hours (2 minutes)
```bash
# Check request volume
railway logs --tail 1000 | grep -c "handleUpdate"

# Check payment success
railway logs --tail 1000 | grep -c "successful_payment"

# Check database growth
railway shell
sqlite3 data/orders.db "SELECT COUNT(*) FROM orders WHERE created_at > datetime('now', '-4 hours');"
```

### Every 12 Hours (5 minutes)
```bash
# Deep error check
railway logs --since 12h | grep "\[ERROR\]" | tail -50

# Webhook health
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
# Look for "pending_update_count": 0

# Database integrity
railway shell
sqlite3 data/orders.db "PRAGMA integrity_check;"
# Expected: "ok"
```

## Rollback Triggers

**Rollback immediately if:**
- Users charged but no orders delivered
- Database corruption or crashes
- Webhook security bypassed
- Bot not responding to ANY command
- Templates/prices completely wrong

**Rollback command:**
```bash
railway rollback
# OR emergency stop:
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
```

**Debug live if:**
- Single template broken (others work)
- Edge case errors (rare)
- Performance slow but working
- Minor UX bugs

## Critical Metrics

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| /health | <100ms | >500ms | >1s |
| /webhook response | <500ms | >2s | >5s |
| Payment flow | <2s | >5s | >10s |
| Error rate | <1% | 5-10% | >10% |

## Emergency Contacts

**If everything fails:**
1. Railway dashboard: https://railway.app
2. Railway docs: https://docs.railway.app
3. Telegram API: https://core.telegram.org/bots/api

## Quick Dashboard Command

```bash
# Run hourly for health snapshot
railway status && \
railway logs --tail 100 | grep "\[ERROR\]" | tail -5 && \
railway shell -c "sqlite3 data/orders.db \"SELECT COUNT(*) FROM orders WHERE created_at > datetime('now', '-1 hour');\""
```

---

**Remember:** This is a guide. Trust your exploration. If something feels wrong, investigate.
