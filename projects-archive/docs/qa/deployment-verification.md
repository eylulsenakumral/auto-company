# Telegram Notion Bot - Deployment Verification Plan
**QA Strategist:** James Bach | **Date:** 2026-06-03 | **Context:** Production Deployment Verification

## Philosophy
Testing is about **discovering risks**, not verifying checkboxes. This plan focuses on:
- **Exploration over scripts** - Think critically, don't just follow steps
- **Risk-based testing** - Test what matters most, not everything
- **Information provision** - Give stakeholders data to make decisions
- **Rapid feedback** - Find problems fast, fix them fast

---

## Pre-Deployment Verification (Before Running DEPLOY_NOW.sh)

### 1. Environment Risk Check (5 minutes)

**What we're testing:** That the bot has valid credentials to function in production.

**Test approach:** Don't trust declarations. Verify.

```bash
# Get the bot token from environment or prompt
# Then verify it's actually valid with Telegram API
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
```

**Expected outcome:** JSON response with bot username, not "401 Unauthorized"

**Risk discovered if:**
- Token is invalid → Bot won't work at all. STOP deployment.
- Token belongs to wrong bot → Wrong bot deployed. High confusion risk.

### 2. Railway Configuration Verification (3 minutes)

**What we're testing:** Railway project exists and can accept deployments.

**Test approach:**
```bash
railway status
railway list
```

**Expected outcome:** You see the telegram-notion-bot project

**Risk discovered if:**
- No Railway project → DEPLOY_NOW.sh will create one, but verify it's the right one
- Wrong project linked → Deploy to production instead of dev? CATASTROPHIC.

### 3. Database Schema Sanity Check (2 minutes)

**What we're testing:** SQLite database structure supports the bot's operations.

**Test approach:** Look at `src/database.ts`. Find the schema. Ask:
- "What tables MUST exist for the bot to work?"
- "What happens if orders table doesn't exist?"

**Critical paths:**
1. Bot needs to create orders during `/templates` → buy flow
2. Bot needs to fetch orders during `/myorders`
3. Bot needs to update order status on payment completion

**Risk discovered if:**
- Database initialization missing → Bot crashes on first purchase
- No WAL mode → Database corruption under concurrent requests

### 4. Webhook Secret Verification (1 minute)

**What we're testing:** Webhook security is actually configured.

**Test approach:** Check if WEBHOOK_SECRET is set or will be generated:
```bash
grep -r "WEBHOOK_SECRET" projects/telegram-notion-bot/
```

**Risk discovered if:**
- Secret hardcoded in source → SECURITY VULNERABILITY. Any webhook can be spoofed.
- No secret planned → Anyone can send fake payment events.

---

## Smoke Test Plan (First 10 Minutes After Deploy)

### Philosophy
Don't automate this. **Human exploration** reveals more than scripts. These 5 commands give you confidence that CORE user paths work.

### Test 1: Bot Responds to /start (30 seconds)

**Why this matters:** If the bot doesn't respond, nothing else works.

**Human exploration:**
1. Open Telegram
2. Search for your bot username
3. Click START
4. Send `/start`
5. **Observe:** Response arrives within 2 seconds?

**Expected response:**
```
🚀 Telegram Notion Templates'a Hoş Geldin!
...
👇 Başlamak için /templates komutunu kullan.
```

**Risk discovered if:**
- No response → Webhook broken OR bot crashed OR network failure
- Slow response (>5 seconds) → Performance issue, users will churn
- Error message → Bot crashed, check Railway logs

**Follow-up exploration:**
```bash
# While testing, watch logs in real-time
railway logs --tail
# You should see YOUR /start request appear in logs
```

### Test 2: Templates List Loads (30 seconds)

**Why this matters:** Templates are the product. If users can't see them, no sales.

**Human exploration:**
1. Send `/templates`
2. **Observe:** List appears with buttons?

**Expected response:**
- Shows 5 templates with inline buttons
- Each button shows template name + price in Stars

**Risk discovered if:**
- "No templates available" → `templates.json` missing or malformed
- Buttons don't work → Inline keyboard markup broken
- Templates have wrong prices → Business logic error

**Follow-up exploration:**
Click a template button. Does it show details?

### Test 3: Template Details Display (30 seconds)

**Why this matters:** Users need details before purchase. This is the decision point.

**Human exploration:**
1. Click ANY template button from previous test
2. **Observe:** Detailed view appears?

**Expected response:**
```
📦 [Template Name]
📝 Açıklama: [Description]
✨ Özellikler:
✅ Feature 1
✅ Feature 2
💰 Fiyat: ⭐ [Price] Stars
```

**Risk discovered if:**
- Details don't load → Template data incomplete
- No purchase button → Conversion path broken
- Wrong template shown → Template lookup broken

**Follow-up exploration:**
Check if features list renders correctly. Any HTML escaping issues?

### Test 4: Order Creation (Without Real Money) (1 minute)

**Why this matters:** This tests the ENTIRE purchase flow EXCEPT payment. Database, session management, order ID generation.

**Human exploration:**
1. Click "⭐ Stars ile Satın Al" button
2. **Observe:** Payment prompt appears?

**Expected response:**
```
💳 Ödeme İşlemi
📦 Şablon: [Template Name]
💰 Tutar: ⭐ [Price] Stars

[Stars payment button]
```

**Risk discovered if:**
- "Order creation error" → Database write failed
- No payment button → Invoice generation broken
- Wrong price → Price lookup uses wrong template

**Follow-up exploration:**
```bash
# Check database immediately after
railway shell
sqlite3 data/orders.db "SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;"
# You should see your pending order with payment_status='pending'
```

### Test 5: My Orders Display (30 seconds)

**Why this matters:** Users need to track purchases. Trust builder.

**Human exploration:**
1. Send `/myorders`
2. **Observe:** Shows order from Test 4?

**Expected response:**
```
📋 Sipariş Geçmişin

⏳ [Template Name]
💰 ⭐ [Price] | 📅 [Today's date]
```

**Risk discovered if:**
- "No orders" → Database read failed OR user ID mismatch
- Shows wrong orders → User identification broken
- Crashes → SQL query malformed

---

## Payment Flow Verification (Without Real Money)

### Philosophy
We can't test real payments without real money. But we CAN verify the payment integration points are correct.

### Test 6: Pre-Checkout Query Handling (2 minutes)

**What we're testing:** Bot properly validates payment requests BEFORE Telegram charges user.

**Exploration approach:**
1. Start a purchase (Test 4)
2. Click "Stars ile Ödeme Yap"
3. DON'T complete payment. Just observe the payment prompt

**Expected outcome:** Payment prompt shows correct amount and allows payment

**Risk discovered if:**
- Payment prompt fails → `pre_checkout_query` handler broken
- Wrong amount → Price calculation error
- Error "Payment processing failed" → Invoice validation too strict

### Test 7: Webhook Signature Verification (2 minutes)

**What we're testing:** Security. Only Telegram can send payment events.

**Exploration approach:**
```bash
# Try to send a FAKE payment event without proper signature
curl -X POST https://your-app.railway.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"update_id": 1, "message": {"message_id": 1, "from": {"id": 123}, "chat": {"id": 123}, "text": "/start"}}'

# Expected: 403 Forbidden (no webhook secret header)
# Risk: If you get 200 OK, security is BROKEN.
```

**Risk discovered if:**
- Request accepted without secret → ANYONE can spoof webhooks
- No logs for unauthorized attempts → Security monitoring missing

---

## Day 1 Monitoring Plan

### Philosophy
You're not just watching for "errors." You're watching for **anomalies that indicate risk**.

### What to Check (First 24 Hours)

#### Every 30 Minutes (Quick Health Check - 30 seconds)

```bash
railway logs --tail 20 | grep -E "\[ERROR\|\[WARN\|successful_payment"
```

**What you're looking for:**
- ERROR patterns growing → Crashes, exceptions
- WARN patterns growing → Degraded performance
- successful_payment events → Actual purchases happening

**Risk threshold:** More than 5 errors in 20 logs = investigate NOW.

#### Every 4 Hours (Usage Trends - 2 minutes)

```bash
# Check request volume
railway logs --tail 1000 | grep -c "handleUpdate"

# Check payment success rate
railway logs --tail 1000 | grep -c "successful_payment"
railway logs --tail 1000 | grep -c "Order creation error"

# Check database growth
railway shell
sqlite3 data/orders.db "SELECT COUNT(*) FROM orders WHERE created_at > datetime('now', '-4 hours');"
```

**What you're looking for:**
- Requests increasing → Marketing working?
- Payments low vs requests high → Conversion problem
- Database not growing → Payment flow broken?

#### Every 12 Hours (Deep Dive - 5 minutes)

```bash
# Check for ANY errors in last 12 hours
railway logs --since 12h | grep "\[ERROR\]" | tail -50

# Check webhook health
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
# Look for "pending_update_count": 0 (no backlog)

# Check database integrity
railway shell
sqlite3 data/orders.db "PRAGMA integrity_check;"
# Should return: "ok"
```

**Risk discovered if:**
- Pending updates > 100 → Bot can't keep up
- Database corruption → WAL mode failed or disk full
- Error patterns repeating → Code has bug, not transient issue

### Response Time Expectations

| Endpoint | Expected | Warning | Critical |
|----------|----------|---------|----------|
| `/health` | < 100ms | > 500ms | > 1s |
| `/webhook` (any command) | < 500ms | > 2s | > 5s |
| `/templates` button click | < 300ms | > 1s | > 3s |
| Payment flow | < 2s | > 5s | > 10s |

**How to measure:** Watch logs for timestamps between request and response.

**Risk action plan:**
- Warning range → Monitor for 10 minutes. If sustained, investigate.
- Critical range → Investigate IMMEDIATELY. Users are experiencing delays.

---

## Rollback Decision Matrix

### Philosophy
Rollback isn't failure. It's **rapid recovery**. Know when to rollback vs debug live.

### Decision Framework

#### Rollback Immediately (< 5 min decision)

**Rollback if:**
1. **Payments failing** - Users charged but no orders delivered
2. **Data corruption** - Database inconsistent or crashing
3. **Security breach** - Webhook verification bypassed, unauthorized access
4. **Total outage** - Bot not responding to ANY command
5. **Wrong data displayed** - Templates wrong, prices wrong, catastrophic UX

**Why:** These affect revenue or user trust immediately.

**Rollback command:**
```bash
# Option 1: Revert to previous deployment
railway rollback

# Option 2: Disable bot (stop new requests)
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"

# Option 3: Emergency stop (if you have Railway access)
railway stop
```

#### Debug Live (15-30 min investigation)

**Debug live if:**
1. **Single template broken** - One template not showing, others work
2. **Edge case error** - Specific user interaction fails, rare
3. **Performance degradation** - Slow but working, can investigate
4. **Non-critical bugs** - Typos, formatting issues, minor UX

**Why:** These don't block core functionality. Investigation informs fix.

**Debug approach:**
```bash
# 1. Get specific error
railway logs --tail 100 | grep "\[ERROR\]"

# 2. Reproduce manually in Telegram
# 3. Add debug logging if needed
# 4. Test fix locally, then deploy
```

### Rollback Execution (< 5 minutes total)

#### Step 1: Verify Rollback Need (1 minute)

```bash
# Confirm failure
railway logs --tail 50

# Quick health check
curl https://your-app.railway.app/health
```

#### Step 2: Execute Rollback (30 seconds)

```bash
# View deployments
railway deployments

# Rollback (copy previous deployment ID)
railway rollback <previous-id>

# OR: Disable webhook immediately
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
```

#### Step 3: Verify Rollback (2 minutes)

```bash
# Check new deployment status
railway status

# Test bot is working
# Send /start in Telegram → should get response

# Check logs for errors
railway logs --tail 20
```

#### Step 4: Communicate (1 minute)

**Document what happened:**
- What broke?
- When did it break?
- What's the rollback state?
- What's the investigation plan?

**Where:** `docs/qa/incident-<date>.md`

---

## Monitoring Dashboard Setup

### Philosophy
Dashboards aren't for aesthetics. They're for **rapid situational awareness**.

### Critical Metrics (What to Watch)

#### Health Indicators

**Metric:** Bot Uptime
**How to check:** `railway logs | grep -c "Bot started successfully"` (should be 1)
**Risk:** If 0, bot crashed. If >1, multiple restarts = instability.

**Metric:** Request Success Rate
**How to check:** `railway logs | grep -c "handleUpdate"` vs `railway logs | grep -c "\[ERROR\]"`
**Risk:** If errors > 10% of requests, investigate.

**Metric:** Webhook Lag
**How to check:** `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo` → look at `pending_update_count`
**Risk:** If > 0, bot falling behind. If > 100, critical.

#### Business Indicators

**Metric:** Orders Created (Hourly)
**How to check:** `sqlite3 data/orders.db "SELECT COUNT(*) FROM orders WHERE created_at > datetime('now', '-1 hour');"`
**Risk:** If suddenly 0, payment flow broken.

**Metric:** Payment Success Rate
**How to check:** `railway logs | grep -c "successful_payment"` vs `railway logs | grep -c "pre_checkout_query"`
**Risk:** If < 80%, users abandoning payment or technical issues.

### Dashboard Layout (Text-Based, Copy-Paste)

```bash
# Quick Health Dashboard (run every hour)
#!/bin/bash
echo "=== Bot Health Check ===" && \
echo "Uptime:" && railway status && \
echo "" && \
echo "Recent Errors:" && railway logs --tail 100 | grep "\[ERROR\]" | tail -5 && \
echo "" && \
echo "Orders (Last Hour):" && railway shell -c "sqlite3 data/orders.db \"SELECT COUNT(*) FROM orders WHERE created_at > datetime('now', '-1 hour');\"" && \
echo "" && \
echo "Webhook Status:" && curl -s https://api.telegram.org/bot<token>/getWebhookInfo | jq '.pending_update_count'
```

Run this hourly. If anything looks wrong, investigate.

---

## Post-Deployment Learning (What to Document)

### Philosophy
Every deployment teaches something. Document it so next deployment is safer.

### Incident Report Template

**If something goes wrong, document:**

```markdown
# Incident Report - [Date]

## What Happened
- Symptom: [What users experienced]
- Time: [When it started]
- Duration: [How long until fixed]

## Root Cause
- Trigger: [What caused it]
- Technical: [Code/infrastructure issue]
- Process: [Why testing didn't catch it]

## Resolution
- Fix: [What we did]
- Time to resolve: [How long]

## Lessons Learned
- Test: [What test would have caught this]
- Monitor: [What alert would have warned us]
- Process: [What to change in deployment]
```

**Where:** `docs/qa/incidents/`

---

## Final Thoughts

### Testing ≠ Checking
This plan gives you CHECKS (automated verification) and TESTING (exploration, risk discovery).

**Checks:**
- Health endpoint returns 200
- Webhook configured
- Database exists

**Testing:**
- Bot actually works in REAL Telegram app
- Payment flow feels smooth to users
- Error messages are helpful
- Performance is acceptable

### Be Skeptical
- Don't trust green checkmarks.
- Don't trust "it works on my machine."
- Don't trust automated tests fully.
- **Trust your exploration.**

### When in Doubt, Rollback
Rollback is reversible. Lost user trust is not.

**Deploy → Monitor → React → Learn**

---

**Prepared By:** QA-Bach (James Bach Agent)
**Context:** Telegram Notion Bot Production Deployment
**Next:** Execute DEPLOY_NOW.sh, then follow this plan step-by-step.
