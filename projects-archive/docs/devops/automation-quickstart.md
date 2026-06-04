# NextVision Outreach Automation - Quick Start Guide

**Deployment Time:** 3 hours (with this guide)
**Prerequisites:** None (all services have free tiers)
**Goal:** From zero to working email + VoIP automation

---

## Phase 1: Account Setup (30 minutes)

### 1.1 SendGrid (Email API)

```bash
# 1. Create account
# Visit: https://signup.sendgrid.com/
# Email: hello@nextvision.ai (use business email)

# 2. Verify sender domain
# Settings → Sender Authentication → Verify SPF/DKIM
# (Skip DNS setup if using @gmail.com, but deliverability will suffer)

# 3. Create API key
# Settings → API Keys → Create API Key
# Permissions: Mail Send → Full Access
# Name: "NextVision Outreach Worker"
# COPY THIS KEY (will not be shown again)

# 4. Test API key
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "personalizations": [{
      "to": [{"email": "your-test@email.com"}],
      "subject": "SendGrid Test"
    }],
    "from": {"email": "hello@nextvision.ai"},
    "content": [{"type": "text/plain", "value": "Hello from NextVision!"}]
  }'
```

**Expected Result:** Test email received within 30 seconds
**Troubleshooting:** If fails → Check API key permissions, verify sender domain

### 1.2 Twilio (VoIP API)

```bash
# 1. Create account
# Visit: https://www.twilio.com/console
# Email: hello@nextvision.ai
# $15 trial credit included

# 2. Buy Turkey phone number
# Phone Numbers → Buy a Number
# Country: Turkey (+90)
# Capabilities: Voice + SMS
# Region: Bursa (if available) or Istanbul
# Cost: ~$1/month

# 3. Get API credentials
# Dashboard → Account SID (starts with AC)
# Dashboard → Auth Token (CLICK "Show" to reveal)
# COPY BOTH

# 4. Test Twilio connection
curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
  -d "Url=https://demo.twilio.com/docs/voice.xml" \
  -d "To=YOUR_PERSONAL_PHONE" \
  -d "From=YOUR_TWILIO_PHONE_NUMBER"
```

**Expected Result:** Test call received within 10 seconds
**Troubleshooting:** If fails → Check account SID format, verify phone number active

### 1.3 Supabase (Database)

```bash
# 1. Create project
# Visit: https://app.supabase.com/
# Email: hello@nextvision.ai
# Organization: Auto Company
# Project Name: nextvision-outreach
# Database Password: (generate strong password - SAVE THIS)
# Region: EU Central (Frankfurt) - GDPR compliance
# Pricing Plan: Free

# 2. Get connection details
# Project Settings → API
# Project URL: https://xxx.supabase.co
# anon public key: eyJxxx...
# service_role key: eyJyyy... (KEEP THIS SECRET - full admin access)

# 3. Run schema
# SQL Editor → New Query
# Copy-paste contents of: docs/devops/automation-schema.sql
# Click "Run" (should see "Success" in 2-3 seconds)

# 4. Verify tables created
# Table Editor → Should see: prospects, activity_logs, outreach_templates, daily_metrics

# 5. Load test data
# Table Editor → prospects → Insert
# Add 2-3 test companies (from bursa-outreach-tracker.csv)
```

**Expected Result:** 4 tables created, 2-3 test prospects visible
**Troubleshooting:** If SQL fails → Check PostgreSQL syntax, verify extensions enabled

---

## Phase 2: Cloudflare Workers Setup (1 hour)

### 2.1 Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Verify installation
wrangler --version
# Should show: 4.x.x

# Login to Cloudflare
wrangler login
# Opens browser → Login with Cloudflare account
```

### 2.2 Create Workers Project

```bash
# Create project directory
mkdir -p ~/projects/nextvision-outreach
cd ~/projects/nextvision-outreach

# Initialize project
wrangler init --yes
# Creates: wrangler.toml, src/index.ts, package.json

# Install dependencies
npm install twilio @supabase/supabase-js
npm install -D @cloudflare/workers-types typescript
```

### 2.3 Configure Environment Secrets

```bash
# SendGrid API Key
wrangler secret put SENDGRID_API_KEY
# Paste: SG.xxxxxxxxxxxxxxxxxx
# Press Enter (will not echo back - normal behavior)

# Twilio Credentials
wrangler secret put TWILIO_ACCOUNT_SID
# Paste: ACxxxxxxxxxxxxxxxxx

wrangler secret put TWILIO_AUTH_TOKEN
# Paste: xxxxxxxxxxxxxxxxxxx

wrangler secret put TWILIO_PHONE_NUMBER
# Paste: +905551234567

# Supabase Credentials
wrangler secret put SUPABASE_URL
# Paste: https://xxx.supabase.co

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Paste: eyJyyyyyyyyyyyyyyyyy

# Automation Control
wrangler secret put AUTOMATION_ENABLED
# Paste: true

# Verify secrets set
wrangler secret list
```

**Expected Result:** 7 secrets listed (all hidden)
**Troubleshooting:** If command hangs → Ctrl+C, retry, check network

### 2.4 Deploy Test Worker

```bash
# Copy wrangler.toml from docs
cp ~/projects/Auto-Company/docs/devops/automation-wrangler.toml wrangler.toml

# Edit account_id
# YOUR_CLOUDFLARE_ACCOUNT_ID → Your actual account ID (from wrangler whoami)

# Deploy
wrangler deploy

# Expected output:
# ✨ Built in 123ms
# ✨ Uploaded nextvision-outreach
# ✨ Published nextvision-outreach
#   https://nextvision-outreach.YOUR_SUBDOMAIN.workers.rs
```

---

## Phase 3: Implement Email Worker (45 minutes)

### 3.1 Create Email Worker

```bash
# Create email worker file
mkdir -p src/workers
touch src/workers/email-worker.ts
```

**Copy this code to email-worker.ts:**

```typescript
import { Env } from '../types';

export interface EmailEvent {
  prospect_id: string;
  email: string;
  name: string;
  company: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Check automation enabled
    if (env.AUTOMATION_ENABLED !== 'true') {
      console.log('Automation disabled - skipping');
      return;
    }

    console.log(`Email worker triggered at ${event.scheduledTime}`);

    // Fetch prospects to contact today
    const prospects = await env.SUPABASE
      .from('prospects')
      .select('*')
      .eq('status', 'cold')
      .lte('next_action_date', new Date().toISOString().split('T')[0])
      .limit(10);

    if (prospects.error) {
      console.error('Supabase query failed:', prospects.error);
      throw new Error('Database query failed');
    }

    console.log(`Found ${prospects.data.length} prospects to contact`);

    for (const prospect of prospects.data) {
      try {
        // Send email via SendGrid
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: prospect.contact_email }],
              subject: 'Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu',
            }],
            from: { email: 'hello@nextvision.ai', name: 'NextVision' },
            content: [{
              type: 'text/plain',
              value: `Merhaba ${prospect.contact_name || 'İş Güvenliği Uzmanı'},

Bursa'daki 40 otomotiv tedarikçisinin iş güvenliği verilerini analiz eden bir sistem kurduk.
İSG uzmanları arasında anonim benchmark raporu hazırlıyoruz — katılım ücretsiz.

Sizin verilerinizi dahil etmek ister misiniz? 5 dakikalık demo ile sonuçları görebilirsiniz.

Saygılarımla,
NextVision Team

CE: +90 555 123 4567 | Web: nextvision.ai`,
            }],
            custom_args: {
              prospect_id: prospect.id,
              company_name: prospect.company_name,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`SendGrid failed: ${response.status} ${response.statusText}`);
        }

        // Log activity
        await env.SUPABASE.from('activity_logs').insert({
          prospect_id: prospect.id,
          event_type: 'email_sent',
          event_metadata: {
            email: prospect.contact_email,
            status: response.status,
            template: 'a',
          },
        });

        // Update prospect
        await env.SUPABASE
          .from('prospects')
          .update({
            email_sent: true,
            status: 'contacted',
            last_contacted: new Date().toISOString(),
          })
          .eq('id', prospect.id);

        console.log(`✅ Email sent to ${prospect.contact_email} (${prospect.company_name})`);

      } catch (error) {
        console.error(`❌ Failed to email ${prospect.contact_email}:`, error);

        // Log error
        await env.SUPABASE.from('activity_logs').insert({
          prospect_id: prospect.id,
          event_type: 'automation_error',
          event_metadata: {
            error: error.message,
            action: 'email_send',
          },
        });
      }
    }

    console.log('Email worker completed');
  },
};
```

### 3.2 Deploy & Test

```bash
# Deploy email worker
wrangler deploy email-worker

# Trigger test run (manual invocation)
# Visit: https://developers.cloudflare.com/workers/wrangler/commands/#trigger
# Or wait for 8:00 AM Turkey time (cron trigger)

# Check logs
wrangler tail

# Expected output:
# Email worker triggered at 2024-06-03T05:00:00Z
# Found 3 prospects to contact
# ✅ Email sent to info@akmetalas.com (AKMETAL)
# ✅ Email sent to info@ototrim.com (Ototrim Panel)
# ✅ Email sent to info@akwel.com (AKWEL)
# Email worker completed
```

---

## Phase 4: Implement VoIP Worker (45 minutes)

### 4.1 Create VoIP Worker

```bash
touch src/workers/voip-worker.ts
```

**Copy this code to voip-worker.ts:**

```typescript
import { Env } from '../types';

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    if (env.AUTOMATION_ENABLED !== 'true') {
      console.log('Automation disabled - skipping');
      return;
    }

    console.log(`VoIP worker triggered at ${event.scheduledTime}`);

    // Fetch prospects to call
    const prospects = await env.SUPABASE
      .from('prospects')
      .select('*')
      .eq('phone_called', false)
      .not('contact_phone', 'is', null)
      .limit(5);

    if (prospects.error) {
      console.error('Supabase query failed:', prospects.error);
      throw new Error('Database query failed');
    }

    console.log(`Found ${prospects.data.length} prospects to call`);

    for (const prospect of prospects.data) {
      try {
        // Make call via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Calls.json`;

        const formData = new URLSearchParams({
          To: prospect.contact_phone,
          From: env.TWILIO_PHONE_NUMBER,
          Twiml: `<Response>
            <Say language="tr-TR" voice="google">
              Merhaba. NextVision'dan arıyorum. Bursa otomotiv sektöründeki iş güvenliği benchmark raporu hakkında konuşmak istiyoruz.
              Lütfen info at nextvision ai nokta com adresinden e-posta gönderin.
            </Say>
          </Response>`,
          StatusCallback: `https://nextvision-outreach.YOUR_SUBDOMAIN.workers.rs/webhooks/twilio`,
          StatusCallbackEvent: 'initiated,ringing,answered,completed',
        });

        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          throw new Error(`Twilio failed: ${response.status} ${response.statusText}`);
        }

        const callData = await response.json();

        // Log call
        await env.SUPABASE.from('activity_logs').insert({
          prospect_id: prospect.id,
          event_type: 'phone_called',
          event_metadata: {
            callSid: callData.sid,
            phone: prospect.contact_phone,
            status: callData.status,
          },
        });

        // Update prospect
        await env.SUPABASE
          .from('prospects')
          .update({ phone_called: true })
          .eq('id', prospect.id);

        console.log(`📞 Call initiated to ${prospect.contact_phone} (${prospect.company_name})`);

        // Rate limiting: wait 30 seconds between calls
        await new Promise(resolve => setTimeout(resolve, 30000));

      } catch (error) {
        console.error(`❌ Failed to call ${prospect.contact_phone}:`, error);

        await env.SUPABASE.from('activity_logs').insert({
          prospect_id: prospect.id,
          event_type: 'automation_error',
          event_metadata: {
            error: error.message,
            action: 'phone_call',
          },
        });
      }
    }

    console.log('VoIP worker completed');
  },
};
```

### 4.2 Deploy & Test

```bash
# Deploy voip worker
wrangler deploy voip-worker

# Trigger test
# Wait for 8:00 AM or trigger manually

# Check logs
wrangler tail | grep "Call initiated"

# Expected output:
# VoIP worker triggered at 2024-06-03T05:30:00Z
# Found 3 prospects to call
# 📞 Call initiated to +902242400202 (AKMETAL)
# 📞 Call initiated to +902242438140 (Ototrim Panel)
# 📞 Call initiated to +902242806800 (AKWEL)
# VoIP worker completed
```

---

## Phase 5: Verification (15 minutes)

### 5.1 Dashboard Check

```bash
# Visit Supabase dashboard
# https://app.supabase.com/project/xxx/editor

# Run verification query
SELECT
  COUNT(*) FILTER (WHERE email_sent = true) AS emails_sent,
  COUNT(*) FILTER (WHERE phone_called = true) AS calls_made,
  COUNT(*) FILTER (WHERE status = 'contacted') AS prospects_contacted
FROM prospects;

# Expected output:
# emails_sent: 3
# calls_made: 3
# prospects_contacted: 3
```

### 5.2 Email Verification

```bash
# Check personal inbox (test email address)
# Should see: "Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu"
# From: hello@nextvision.ai
# Body: Turkish template with greeting

# If no email:
# 1. Check SendGrid dashboard → Email Activity → Should show 3 sent
# 2. Check Spam folder
# 3. Verify sender domain SPF/DKIM records
```

### 5.3 VoIP Verification

```bash
# Check Twilio dashboard
# https://www.twilio.com/console/monitor/logs/calls
# Should show 3 calls

# Click each call → See status:
# - completed: Answered (rare for cold call)
# - no-answer: Voicemail left (expected 70-80%)
# - busy: Line busy
# - failed: Wrong number

# Check personal phone (if test number in list)
# Should see: Missed call from +90 555 123 4567
# Voicemail: Turkish TTS message
```

---

## Phase 6: Emergency Rollback Test (5 minutes)

```bash
# 1. Disable automation
wrangler secret put AUTOMATION_ENABLED
# Enter: false

# 2. Verify disabled
wrangler secret list | grep AUTOMATION_ENABLED
# Should show: AUTOMATION_ENABLED (hidden)

# 3. Trigger test (should skip)
# Expected log: "Automation disabled - skipping"

# 4. Re-enable
wrangler secret put AUTOMATION_ENABLED
# Enter: true
```

---

## Troubleshooting Guide

### Issue: "SendGrid 401 Unauthorized"

**Solution:**
```bash
# Verify API key
curl https://api.sendgrid.com/v3/user/profile \
  -H "Authorization: Bearer YOUR_API_KEY"

# If fails → Regenerate API key in SendGrid dashboard
# Update secret:
wrangler secret put SENDGRID_API_KEY
```

### Issue: "Twilio 403 Forbidden"

**Solution:**
```bash
# Verify credentials
echo $TWILIO_ACCOUNT_SID  # Should start with AC
echo $TWILIO_AUTH_TOKEN   # Should be 32 characters

# If fails → Reset Auth Token in Twilio dashboard
# Update secret:
wrangler secret put TWILIO_AUTH_TOKEN
```

### Issue: "Supabase connection failed"

**Solution:**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# If fails → Check service_role key (not anon key)
# Verify project URL format: https://xxx.supabase.co
# Update secrets:
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Issue: "Worker deployment failed"

**Solution:**
```bash
# Check wrangler.toml syntax
wrangler dev

# If error → Fix syntax errors
# Common issues:
# - Missing account_id
# - Invalid cron expression
# - Wrong main file path

# Re-deploy
wrangler deploy
```

---

## Production Checklist

Before going live with 100 companies:

- [ ] SendGrid sender domain verified (SPF/DKIM)
- [ ] Twilio phone number active (Turkey region)
- [ ] Supabase tables populated (100 prospects)
- [ ] Email worker deployed (tested with 3 prospects)
- [ ] VoIP worker deployed (tested with 3 prospects)
- [ ] Dashboard live (Vercel or Supabase studio)
- [ ] Monitoring active (wrangler tail running)
- [ ] Rollback tested (AUTOMATION_ENABLED = false works)
- [ ] Rate limiting configured (100 emails/day, 50 calls/day)
- [ ] Error logging verified (activity_logs populating)

---

## Next Steps

After successful deployment:

1. **Monitor First 24 Hours** → Watch error rates, spam flags
2. **Review Metrics** → Email open rate, call connect rate
3. **Optimize Templates** → A/B test subject lines, call scripts
4. **Scale Gradually** → 7 → 20 → 50 → 100 companies
5. **Build Dashboard** → Vercel Next.js for real-time metrics

**Total Build Time:** 3 hours
**First Outreach:** Day 4 (T+96h from human delegation)
**Scale Target:** 100 companies by Day 7

---

*Deployment by Kelsey Hightower principles — serverless, edge, observable, fail-safe*
