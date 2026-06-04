# 🚀 Telegram Notion Bot - Production Deployment Runbook

**Status:** SHIP READY - 5 Minute Deployment
**Last Updated:** 2026-06-03
**Responsible:** Human Operator (Non-Technical OK)

---

## ⚡ Pre-Flight Checklist (2 Minutes)

### System Requirements
- [ ] Terminal access (Linux/Mac/Windows)
- [ ] Telegram account
- [ ] Railway account (free tier: https://railway.app)
- [ ] Node.js installed (check: `node --version`)
- [ ] npm installed (check: `npm --version`)

### Quick Environment Check
```bash
# Run this ONE command to verify everything:
node --version && npm --version && echo "✅ System ready"
```

If this fails, install Node.js: https://nodejs.org (LTS version)

---

## 📋 Deployment Steps (5 Minutes Total)

### STEP 1: Get Bot Token (3 minutes)

**Open Telegram → @BotFather:**

1. Search `@BotFather` in Telegram
2. Send message: `/newbot`
3. Bot asks for name → Send: `My Notion Templates Bot` (or your choice)
4. Bot asks for username → Send: `my_notion_templates_bot` (must end in `bot`)
5. **Copy the token immediately** (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

**⚠️ CRITICAL:** Save this token securely. You'll need it in Step 2.

### STEP 2: Deploy (2 minutes)

**Open terminal:**

```bash
# Navigate to bot directory
cd /home/tolgabrk/projects/Auto-Company/projects/telegram-notion-bot/

# Set your bot token (REPLACE WITH YOUR ACTUAL TOKEN)
export TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Run deployment
./DEPLOY_NOW.sh
```

**Script will automatically:**
- ✅ Install Railway CLI (if missing)
- ✅ Deploy to Railway cloud
- ✅ Configure environment variables
- ✅ Create persistent database volume
- ✅ Set Telegram webhook
- ✅ Run health check

**If prompted to login to Railway:**
```bash
railway login
# Browser opens → Login → Return to terminal
./DEPLOY_NOW.sh  # Run again
```

### STEP 3: Verify (30 seconds)

**After script completes:**

1. **Copy the Railway URL** from output (looks like: `https://telegram-notion-bot-xyz.railway.app`)
2. **Open Telegram → Test your bot:**
   - Search: `https://t.me/YOUR_BOT_USERNAME`
   - Click START
   - Send: `/start` → Should reply with welcome message
   - Send: `/templates` → Should show 5 templates

**✅ SUCCESS CRITERIA:**
- Bot replies to `/start` within 2 seconds
- `/templates` shows template list with buttons
- Railway logs show no errors: `railway logs`

---

## 🔧 Troubleshooting (Common Issues)

### Issue: "Bot not responding"

**DIAGNOSE:**
```bash
# Check Railway logs (shows real-time errors)
railway logs

# Check webhook status
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

**FIX - Webhook not set:**
```bash
# Get Railway URL
railway domain

# Manual webhook set (replace URL and TOKEN)
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_RAILWAY_URL.railway.app/webhook"}'
```

### Issue: "Deployment failed"

**DIAGNOSE:**
```bash
# Check build logs
railway logs --build

# Test local build
npm run build
npm start
```

**FIX - Common causes:**
1. **Missing dependencies:** `npm install` → `./DEPLOY_NOW.sh`
2. **TypeScript error:** `npm run build` → Check error message
3. **Railway quota exceeded:** Check dashboard → Upgrade plan

### Issue: "Database orders lost after redeploy"

**DIAGNOSE:**
```bash
# Check volume exists
railway volume list

# Check database file
railway shell
ls -la data/
```

**FIX - Volume not persistent:**
```bash
# Recreate volume
railway volume add data

# Restart service
railway up
```

---

## 🔄 Rollback Procedure (If Something Goes Wrong)

### Immediate Rollback (< 1 minute)

**If bot is broken or payments failing:**

```bash
# Option 1: Disable webhook (stops bot)
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/deleteWebhook"

# Option 2: Deploy previous version
railway rollback
```

### Full Reset (Last Resort)

```bash
# Delete Railway project
railway destroy

# Redeploy from scratch
./DEPLOY_NOW.sh
```

⚠️ **WARNING:** `railway destroy` deletes ALL data including orders. Only use if bot is non-functional.

---

## 📊 Post-Deployment Monitoring

### Daily Health Checks (30 seconds)

```bash
# Check bot is running
railway logs --tail 10

# Check database for new orders
railway shell
sqlite3 data/orders.db "SELECT COUNT(*) FROM orders;"

# Check webhook status
curl https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo
```

### Weekly Maintenance (5 minutes)

1. **Backup database:**
   ```bash
   railway shell
   cp data/orders.db data/orders.db.backup.$(date +%Y%m%d)
   ```

2. **Review logs for errors:**
   ```bash
   railway logs --lines 100 | grep -i error
   ```

3. **Check resource usage:**
   - Railway Dashboard → Metrics tab
   - Ensure < 80% CPU, < 80% RAM

---

## 🚨 Emergency Contacts

### If Everything Fails

**Auto Company Team:**
- Check `docs/devops/` for detailed logs
- Review `memories/consensus.md` for deployment decisions
- GitHub Issues: https://github.com/your-repo/issues

**External Resources:**
- Railway Support: https://docs.railway.app
- Telegram Bot API: https://core.telegram.org/bots/api
- GrammyJS Docs: https://grammyjs.dev

---

## 📈 Success Metrics

**Bot is live when:**
- ✅ `/health` endpoint returns `{"status":"ok"}`
- ✅ Bot responds to `/start` within 2 seconds
- ✅ `/templates` shows all 5 templates
- ✅ Test purchase creates database record

**Production ready when:**
- ✅ 10+ users tested successfully
- ✅ Payment flow completed end-to-end
- ✅ No errors in Railway logs for 24 hours
- ✅ Database backup schedule configured

---

## 🎯 Quick Reference Card

**Print this for quick access:**

```bash
# Deploy
export TELEGRAM_BOT_TOKEN=your_token
./DEPLOY_NOW.sh

# Check logs
railway logs

# Restart service
railway up

# Emergency stop
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/deleteWebhook"

# Check database
railway shell → sqlite3 data/orders.db "SELECT * FROM orders;"
```

---

## 📝 Deployment History

| Date | Version | Status | Notes |
|------|---------|--------|-------|
| 2026-06-03 | v1.0.0 | SHIP READY | Initial production deployment |

---

**Next Actions After Successful Deployment:**
1. Share bot link with 5 friends for testing
2. Monitor Railway dashboard for 24 hours
3. Set up database backup cron job
4. Configure payment analytics (optional)

---

**Prepared By:** Auto Company DevOps Team (devops-hightower)
**Documentation:** `DEPLOYMENT.md`, `IMPLEMENTATION_COMPLETE.md`
**Script:** `DEPLOY_NOW.sh`
