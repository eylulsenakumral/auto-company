# 4-Hour Infrastructure Recovery Sprint

**Goal:** Create missing accounts + deploy automation infrastructure
**Timeline:** 4 hours (strict deadline)
**Go-Live:** T+96h (June 4, 20:00 Istanbul time)
**Risk:** LOW (85% confidence — code is ready, accounts are straightforward)

---

## PRE-FLIGHT CHECKLIST (5 minutes)

Before starting, verify you have:
- [ ] Browser access (Chrome/Firefox)
- [ ] autocompany.ai email access (for verifications)
- [ ] Payment method (for Twilio $32 upgrade)
- [ ] Terminal access (for deployment commands)
- [ ] This guide open (for copy-paste credentials)

**Estimated total time:** 4 hours
**Buffer included:** 30 minutes (for unexpected delays)

---

## HOUR 0-2: ACCOUNT CREATION (Parallel Execution)

**Strategy:** Open 3 tabs, create accounts simultaneously. Switch between tabs during waiting periods (email verification, domain propagation).

### TASK 1: Supabase Project (30 minutes)

**Step 1: Sign Up (5 min)**
1. Go to: https://supabase.com/signup
2. Email: autocompany.ai (your email)
3. Password: Generate strong password (store in password manager)
4. Verify email (click link in inbox)

**Step 2: Create Project (10 min)**
1. Click "New Project"
2. Project name: `nextvision-outreach`
3. Database password: Generate strong password (SAVE THIS — you'll need it)
4. Region: `eu-central-1` (Frankfurt — closest to Turkey)
5. Pricing plan: Free (confirm $0/month)
6. Click "Create new project"
7. Wait 2-3 minutes for project to initialize

**Step 3: Execute Schema (10 min)**
1. Open project dashboard
2. Left sidebar: Click "SQL Editor" (icon looks like `</>`)
3. Click "New Query"
4. Copy schema from: `automation/schema.sql` (file exists in repo)
5. Paste into SQL Editor
6. Click "Run" (or press Cmd+Enter)
7. Verify success: Should see "Success" message with 4 tables created

**Step 4: Import CSV Data (5 min)**
1. In SQL Editor, run this query:
```sql
-- Verify import worked
SELECT COUNT(*) FROM companies;
-- Should return: 48
```

**Step 5: Get Credentials (2 min)**
1. Left sidebar: Click "Settings" (gear icon)
2. Click "API"
3. Copy these values to `automation/.env`:
   - `project URL` = SUPABASE_URL
   - `service_role_key` (anon is public, service_role is secret) = SUPABASE_SERVICE_KEY

**✅ TASK 1 COMPLETE: Supabase ready**

---

### TASK 2: SendGrid Account (30 minutes)

**Step 1: Sign Up (5 min)**
1. Go to: https://sendgrid.com/free
2. Email: autocompany.ai
3. Password: Generate strong password
4. Verify email (click link)

**Step 2: Single Sender Verification (15 min)**
1. Dashboard: Click "Marketing" → "Senders" (left sidebar)
2. Click "Create New Sender"
3. Fill form:
   - From Name: `Auto Company`
   - From Email: `noreply@autocompany.ai` (or your verified domain)
   - Reply To: `tolga@autocompany.ai` (your email)
   - Address: (your real address)
   - City/State/Zip: (your real location)
4. Click "Create"
5. **CRITICAL:** Check your email — click verification link
6. Wait 5-10 minutes for SendGrid to verify (they check domain reputation)

**Step 3: Create API Key (10 min)**
1. Dashboard: Click "Settings" (gear icon) → "API Keys"
2. Click "Create API Key"
3. API Key Name: `NextVision Automation`
4. Permissions:
   - ✅ Mail Send
   - ❌ Everything else (uncheck all)
5. Click "Create & View"
6. **COPY THIS KEY NOW** (you won't see it again!)
7. Paste to `automation/.env` as `SENDGRID_API_KEY`

**✅ TASK 2 COMPLETE: SendGrid ready**

---

### TASK 3: Twilio Account (45 minutes)

**Step 1: Sign Up (5 min)**
1. Go to: https://www.twilio.com/try-twilio
2. Email: autocompany.ai
3. Password: Generate strong password
4. Verify email

**Step 2: Upgrade Account (10 min)**
1. Dashboard: You'll see "Trial Account" banner
2. Click "Upgrade Account"
3. Payment: Enter credit card ($32 required for Turkish number)
4. Billing: Pay-as-you-go (no monthly commitment)
5. Click "Upgrade"

**Step 3: Buy Turkish Number (20 min)**
1. Dashboard: Click "Phone Numbers" → "Buy a Number"
2. Search settings:
   - Country: Turkey (🇹🇷)
   - Area code: `224` (Bursa) OR `212` (Istanbul)
   - Capabilities: ✅ Voice ✅ SMS (we need both)
3. Click "Search"
4. **If +90 224 found:** Perfect (Bursa local)
5. **If +90 224 not found:** Search +90 212 (Istanbul — acceptable)
6. **If both not found:** Search any +90 number (Turkey-wide)
7. Select number → Click "Buy" ($1/month per number)
8. Confirm purchase

**Step 4: Get Credentials (10 min)**
1. Dashboard: Click "Settings" (gear icon) → "General"
2. Copy these to `automation/.env`:
   - "Account SID" = TWILIO_ACCOUNT_SID
   - "Auth Token" = TWILIO_AUTH_TOKEN (click "Show" to reveal)
3. Dashboard: Click "Phone Numbers" → "Active Numbers"
4. Copy your Turkish number as `TWILIO_PHONE_NUMBER` (format: +90224XXXXXXX)

**✅ TASK 3 COMPLETE: Twilio ready**

---

## HOUR 2: UPDATE .ENV FILE (5 minutes)

Create/edit `automation/.env` file with ALL credentials:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SendGrid
SENDGRID_API_KEY=SG.xxxxx...

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx...
TWILIO_AUTH_TOKEN=xxxxx...
TWILIO_PHONE_NUMBER=+90224xxxxxxx

# Optional: Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Verification:**
```bash
cd automation
grep SENDGRID .env  # Should return API key
grep SUPABASE .env   # Should return URL + key
grep TWILIO .env     # Should return SID + token + phone
```

**✅ .env COMPLETE: All credentials stored**

---

## HOUR 2-2.5: DEPLOYMENT (30 minutes)

### TASK 4: Cloudflare Workers Deploy (15 minutes)

**Step 1: Install Wrangler (if not installed)**
```bash
npm install -g wrangler
```

**Step 2: Login to Cloudflare**
```bash
wrangler login
# Browser opens → Authorize → Return to terminal
```

**Step 3: Add Secrets to Worker**
```bash
cd automation
wrangler secret put SENDGRID_API_KEY
# Paste from .env
wrangler secret put SUPABASE_URL
# Paste from .env
wrangler secret put SUPABASE_SERVICE_KEY
# Paste from .env
```

**Step 4: Deploy Worker**
```bash
wrangler deploy automation/worker
# OR if worker.ts is in root:
wrangler deploy
```

**Step 5: Verify Deployment**
```bash
wrangler deployments list
# Should show your worker URL
```

**✅ TASK 4 COMPLETE: Cloudflare Worker deployed**

---

### TASK 5: Vercel Dashboard Deploy (15 minutes)

**Step 1: Install Vercel CLI (if not installed)**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
cd automation/dashboard
vercel login
# Browser opens → Authorize → Return to terminal
```

**Step 3: Set Environment Variables (in Vercel Dashboard)**
1. After `vercel login`, browser opens to Vercel dashboard
2. Go to: Project Settings → Environment Variables
3. Add these (copy from .env):
   - `SUPABASE_URL` = (your Supabase URL)
   - `SUPABASE_ANON_KEY` = (your Supabase anon key — NOT service_role!)
4. Click "Save"

**Step 4: Deploy to Production**
```bash
vercel --prod
# Follow prompts → Press Enter for defaults
```

**Step 5: Verify Dashboard**
```bash
# Terminal will show: https://your-project.vercel.app
# Open this URL in browser
# Should see dashboard with companies list
```

**✅ TASK 5 COMPLETE: Vercel dashboard live**

---

## HOUR 2.5-4: INTEGRATION TESTING (90 minutes)

**QA-Bach Test Suite — Execute in order, don't skip**

### TEST 1: SendGrid Email (15 minutes)

**Manual Test:**
```bash
cd automation
node sendgrid-client.js
# OR use the test script provided by Fullstack-DHH
```

**Expected Result:**
- Email sent to your test address
- Check your inbox — should see Turkish NextVision email

**Dashboard Verification:**
1. Open Vercel dashboard URL
2. Check "Emails sent" metric increased
3. Check Supabase `outreach_log` table for new row

**✅ PASS:** Email sent + logged

**❌ FAIL:** Check SendGrid API key in .env, verify single sender is verified

---

### TEST 2: SendGrid Webhook (15 minutes)

**Simulate Open Event:**
1. SendGrid dashboard → Settings → Mail Settings → Event Webhook
2. Add test endpoint: `https://your-vercel-app.vercel.app/api/webhooks/sendgrid`
3. Send test email to yourself
4. Open the email (trigger "open" event)
5. Check Vercel dashboard — "Email opens" should increase

**✅ PASS:** Webhook received + dashboard updated

**❌ FAIL:** Check webhook endpoint URL is correct in Vercel

---

### TEST 3: Twilio Test Call (20 minutes)

**Manual Test:**
```bash
cd automation/twilio
node makeCall.js
# OR call the test function directly
```

**Expected Result:**
- Phone rings (your personal mobile)
- Turkish TTS plays pitch message
- Call logged to Supabase `calls` table

**Dashboard Verification:**
1. Open Vercel dashboard
2. Check "Calls made" metric increased
3. Check Supabase for new call record

**✅ PASS:** Call connected + logged

**❌ FAIL:** Check Twilio credentials, verify Turkish number is active

---

### TEST 4: Cron Trigger (20 minutes)

**Manual Trigger:**
```bash
curl -X POST https://your-worker-url.workers.dev/cron
# OR trigger manually from Cloudflare dashboard
```

**Expected Result:**
- 10 emails sent (to first 10 companies in Supabase)
- Check Supabase `outreach_log` — should have 10 new rows
- Check Vercel dashboard — "Emails sent" increased by 10

**Rate Limiting Test:**
```bash
# Trigger cron again immediately
curl -X POST https://your-worker-url.workers.dev/cron
# Should be BLOCKED (rate limit: 10/day)
```

**✅ PASS:** 10 emails sent + rate limiting enforced

**❌ FAIL:** Check cron worker logs in Cloudflare dashboard

---

### TEST 5: Rollback Test (10 minutes)

**Test 5-Second Rollback:**
1. Cloudflare dashboard → Workers → your worker
2. Click "Settings" → "Disable worker"
3. Try to trigger cron again:
```bash
curl -X POST https://your-worker-url.workers.dev/cron
# Should return: Worker disabled
```

**Re-enable:**
1. Click "Enable worker"
2. Verify cron triggers again

**✅ PASS:** Rollback works in <5 seconds

**❌ FAIL:** Document rollback procedure for production

---

### TEST 6: End-to-End Integration (10 minutes)

**Full Flow Test:**
1. Enable cron worker (if disabled)
2. Wait for tomorrow 9AM Istanbul time (automatic trigger)
3. OR trigger manually now
4. Verify:
   - [ ] 10 emails sent
   - [ ] All logged to Supabase
   - [ ] Dashboard shows real-time metrics
   - [ ] Rate limiting enforced (11th email blocked)
   - [ ] No errors in worker logs

**✅ PASS:** Full automation working

**❌ FAIL:** Check logs, identify specific failure point

---

## HOUR 4: PRODUCTION HARDENING (30 minutes buffer)

### FINAL CHECKLIST

**Before Go-Live (T+96h = tomorrow 8PM):**

**Infrastructure:**
- [ ] All 3 accounts active (Supabase, SendGrid, Twilio)
- [ ] All credentials in .env
- [ ] Cloudflare Worker deployed
- [ ] Vercel dashboard live
- [ ] Dashboard loads in browser

**Testing:**
- [ ] SendGrid email test passed
- [ ] SendGrid webhook test passed
- [ ] Twilio call test passed
- [ ] Cron trigger test passed
- [ ] Rollback test passed
- [ ] End-to-end test passed

**Monitoring:**
- [ ] Worker logs accessible (Cloudflare dashboard)
- [ ] Supabase logs accessible (project dashboard)
- [ ] Dashboard metrics updating in real-time
- [ ] Error notifications configured (email to tolga@autocompany.ai)

**Documentation:**
- [ ] `.env.example` created (template for future reference)
- [ ] Rollback plan documented (5-second shutdown)
- [ ] Go-live checklist complete

**✅ ALL CHECKS PASSED: Ready for T+96h go-live**

---

## CRITICAL SUCCESS FACTORS

**If any task fails:**

**SendGrid Verification Pending (1-2 days):**
- **Workaround:** Use single sender (already verified)
- **Impact:** Slightly lower deliverability (90% vs 97%)
- **Timeline:** No delay

**Twilio Turkish Number Unavailable:**
- **Workaround:** Use +90 212 Istanbul number
- **Impact:** Higher call costs (local vs Istanbul rate)
- **Timeline:** No delay

**Cloudflare Worker Deploy Fails:**
- **Workaround:** Use Vercel cron (alternative)
- **Impact:** Slightly higher latency
- **Timeline:** +30 minutes

**Vercel Dashboard Deploy Fails:**
- **Workaround:** Use Supabase dashboard (built-in)
- **Impact:** Less polished UI
- **Timeline:** +15 minutes

**Overall Risk:** LOW — Multiple workarounds available for every failure point

---

## GO-LIVE DECISION (Tomorrow, T+96h)

**If ALL tests pass:**
✅ **GO-LIVE** → Enable cron trigger, monitor first 24 hours

**If ANY critical blocker remains:**
❌ **DELAY** → Document issue, estimate fix time, report to PM

**Expected First Truth:** T+144h (June 6, 8PM)
**Expected First Reply:** T+168h (June 7, 8PM)

---

**Prepared by:** QA-Bach (James Bach)
**Approved by:** CEO-Bezos (Jeff Bezos)
**Date:** June 3, 2026
**Cycle:** #37 — Infrastructure Recovery

**Next Action:** Execute this guide NOW. Report completion at T+4h.
