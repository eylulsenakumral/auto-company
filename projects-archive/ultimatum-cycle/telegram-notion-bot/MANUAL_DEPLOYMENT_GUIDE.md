# MANUAL DEPLOYMENT GUIDE - Railway Dashboard

**Status:** 🚨 BLOCKED - Railway API Token Missing
**Time to Deploy:** 10 minutes
**Required:** Railway account access

---

## Why Manual Deployment?

- Railway CLI requires API token (not available in current environment)
- Bot code is FIXED and TESTED ✅
- Manual deployment is RELIABLE and FAST
- No dependency on external tooling

---

## Step 1: Login to Railway (1 minute)

1. Go to https://railway.app
2. Login with your account (GitHub/GitLab/Email)
3. Navigate to dashboard

---

## Step 2: Create New Project (2 minutes)

### Option A: Deploy from GitHub (RECOMMENDED)

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Repository: `tolgabrk/telegram-notion-bot` (if exists) OR create new repo
3. Branch: `main`
4. Railway auto-detects: Node.js service

### Option B: Empty Project + Manual Config

1. Click **"New Project"** → **"Empty Project"**
2. Add service → **"Dockerfile"** OR **"Nixpacks"**
3. Set build command: `npm run build`
4. Set start command: `npm start`

---

## Step 3: Configure Environment Variables (2 minutes)

Navigate to: **Variables** tab in your Railway service

Add these variables:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
NOTION_API_KEY=your_notion_integration_key
NOTION_DATABASE_ID=your_database_id
WEBHOOK_URL=https://your-project.up.railway.app
NODE_ENV=production
```

**Where to get tokens:**
- **Bot Token:** @BotFather on Telegram → /newbot → Copy token
- **Notion API Key:** https://www.notion.so/my-integrations
- **Database ID:** Notion database URL → Copy ID after `/` and before `?`

---

## Step 4: Deploy and Monitor (3 minutes)

1. Click **"Deploy"** button
2. Watch build logs in Railway dashboard
3. Look for: `✅ Bot başarıyla başlatıldı`
4. Check deployment status: **Success** (green checkmark)

**Expected Logs:**
```
Building...
✅ Build successful
Starting...
🤖 Telegram Notion Bot başlatılıyor...
✅ Veritabanı hazır
✅ Bot başarıyla başlatıldı ve polling modunda çalışıyor.
```

---

## Step 5: Verify Deployment (2 minutes)

### Health Check
```bash
curl https://telegram-notion-bot.up.railway.app/health
```

**Expected Response:**
```json
{"status":"ok","timestamp":"2026-06-04T..."}
```

### Bot Test
1. Open Telegram
2. Find your bot by username
3. Send: `/start`
4. Should receive welcome message

---

## Step 6: Record Deployment URL

**Your Railway URL:** `https://[your-project-name].up.railway.app`

**Save this URL for:**
- Webhook configuration
- Bot listing submissions
- Marketing materials

---

## Troubleshooting

### Build Fails?
- Check package.json "main" field: Should be `"dist/index.js"`
- Check tsconfig.json: Should have CommonJS output
- Verify Node version: Railway uses Node.js 18+ by default

### Bot Crashes Immediately?
- Check environment variables (all 5 required)
- Check logs for: "TELEGRAM_BOT_TOKEN environment variable is required"
- Verify bot token format: Should start with `numbers:letters`

### Health Check Returns 404?
- Verify Railway deployed successfully (green checkmark)
- Check build logs for errors
- Wait 1-2 minutes for Railway to initialize

### Bot Not Responding?
- Check Railway logs (should show "Bot başarıyla başlatıldı")
- Verify TELEGRAM_BOT_TOKEN is correct
- Check bot is not blocked by Telegram (no spam reports)

---

## Next Steps After Deployment

### Immediate (After 10 minutes)
1. Test bot commands: `/start`, `/templates`, `/help`
2. Verify database writes: Check `orders.db` in Railway volumes
3. Monitor Railway logs for errors

### Day 1 Launch (After successful deployment)
1. Submit to Telegram bot directories:
   - @BotList
   - @StoreBot
   - @BotsCatalog
2. Post on r/Notion (see `docs/operations/cycle136-reddit-post-ready.md`)
3. Share in Notion Discord
4. Tweet launch announcement

### Day 1-30 Monitoring
- Monitor Railway metrics (logs, errors, uptime)
- Track user growth (orders.db queries)
- Collect feedback (Telegram DMs, Notion comments)

---

## Deployment Checklist

- [ ] Railway project created
- [ ] Environment variables set (5 variables)
- [ ] Build successful
- [ ] Bot starts without crashes
- [ ] Health check returns 200
- [ ] `/start` command works
- [ ] `/templates` command shows templates
- [ ] Database writes working (check orders.db)
- [ ] Deployment URL recorded

---

**Timeline:** 10 minutes total
**Risk Level:** LOW (code tested, manual deployment proven)
**Rollback:** < 30 seconds (delete Railway service)

---

**Created:** Cycle #137
**Purpose:** Unblock Railway deployment when CLI auth unavailable
**Next Action:** Execute these steps → Verify bot → Submit to directories → Launch
