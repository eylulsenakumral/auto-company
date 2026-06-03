# Webhook Handlers - Implementation Guide

## Overview
Two serverless functions that receive events from SendGrid and Twilio, parse them, and update Supabase in real-time.

## Architecture

```
SendGrid → /api/webhooks/sendgrid → Update prospects table
Twilio  → /api/webhooks/twilio  → Update calls table
```

## Deploy to Vercel

### 1. Copy Webhook Files
```bash
mkdir -p automation/dashboard/api/webhooks
cp automation/webhooks/sendgrid.js automation/dashboard/api/webhooks/sendgrid.js
cp automation/webhooks/twilio.js automation/dashboard/api/webhooks/twilio.js
```

### 2. Install Dependencies
```bash
cd automation/dashboard
npm install @supabase/supabase-js twilio
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Get Webhook URLs
After deployment, Vercel will provide:
- SendGrid webhook: `https://auto-company-dashboard.vercel.app/api/webhooks/sendgrid`
- Twilio webhook: `https://auto-company-dashboard.vercel.app/api/webhooks/twilio`

## SendGrid Webhook Configuration

### 1. Configure SendGrid
Go to SendGrid Dashboard → Settings → Mail Settings → Event Webhook

**Events to track:**
- ✅ Delivered
- ✅ Open
- ✅ Click
- ✅ Bounce
- ✅ Spam report
- ✅ Dropped

**Webhook URL:** `https://auto-company-dashboard.vercel.app/api/webhooks/sendgrid`

**Settings:**
- Send JSON: ✅ Yes
- Send custom parameters: ✅ Yes (add prospect_id, campaign_id)

### 2. Test SendGrid Webhook
```bash
curl -X POST https://auto-company-dashboard.vercel.app/api/webhooks/sendgrid \
  -H "Content-Type: application/json" \
  -d '[
    {
      "email": "test@example.com",
      "event": "delivered",
      "sg_event_id": "test-event-123",
      "timestamp": 1714780800
    }
  ]'
```

Expected response:
```json
{
  "success": true,
  "processed": 1,
  "results": ["ok"]
}
```

### 3. Verify in Supabase
Check `prospects` table:
- `email_status` = 'delivered'
- `email_delivered_at` = timestamp

## Twilio Webhook Configuration

### 1. Configure Twilio Number
Go to Twilio Console → Phone Numbers → Your number → Voice & Fax

**Voice Configuration:**
- Accept: Incoming Voice Calls
- Configure: Webhook
- Webhook URL: `https://auto-company-dashboard.vercel.app/api/webhooks/twilio/twiml`
- HTTP POST

**Status Callbacks:**
- URL: `https://auto-company-dashboard.vercel.app/api/webhooks/twilio/status`
- Events: completed, busy, no-answer, failed, voicemail

**Recording:**
- URL: `https://auto-company-dashboard.vercel.app/api/webhooks/twilio/recording`
- Format: mp3

### 2. Test Twilio Webhook
```bash
# Test TwiML endpoint
curl "https://auto-company-dashboard.vercel.app/api/webhooks/twilio/twiml"

Expected: XML response with <Response><Say>...</Say></Response>
```

### 3. Verify in Supabase
Check `calls` table:
- `twilio_call_sid` = Call SID
- `call_status` = 'completed' / 'busy' / 'no-answer'
- `recording_url` = Twilio recording URL

## Webhook Security

### Signature Verification (Recommended)

#### SendGrid
```javascript
const crypto = require('crypto');

const verifySendGridSignature = (payload, signature, timestamp) => {
  const publicKey = process.env.SENDGRID_PUBLIC_KEY;
  const decodedSignature = crypto.createSign('sha256')
    .update(timestamp + payload)
    .verify(publicKey, signature);

  return decodedSignature;
};
```

#### Twilio
```javascript
const twilio = require('twilio');

const verifyTwilioSignature = (url, payload, signature) => {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return client.validateRequest(signature, process.env.TWILIO_AUTH_TOKEN, url, payload);
};
```

**TODO:** Add signature verification to both handlers before production

## Error Handling

### SendGrid Events
- **Bounce:** Mark email_status = 'bounced', trigger alert
- **Spam report:** Mark email_status = 'spam', PAUSE CAMPAIGN
- **Dropped:** Mark email_status = 'dropped', log reason

### Twilio Events
- **Busy:** Reschedule call for 2 hours later
- **No-answer:** Log as voicemail, update call_duration = 25
- **Failed:** Investigate phone number, mark as invalid

### Retry Logic
```javascript
// If webhook processing fails, retry up to 3 times
const retry = async (fn, maxAttempts = 3) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## Alert Triggers

### Critical Alerts (Immediate Action)
1. **Spam report:** Pause email campaign
2. **Bounce rate > 5%:** Investigate sender reputation
3. **Webhook failure rate > 10%:** Check Vercel logs

### Warning Alerts (Monitor)
1. **Open rate < 20%:** Improve subject lines
2. **Call connect rate < 25%:** Adjust call timing
3. **Gatekeeper rate > 50%:** Refine gatekeeper script

## Monitoring

### Vercel Logs
```bash
# View real-time logs
vercel logs

# View specific function logs
vercel logs --filter="/api/webhooks/sendgrid"
```

### Key Metrics
- **Webhook success rate:** Target > 99%
- **Processing time:** Target < 500ms
- **Error rate:** Target < 1%

## Troubleshooting

### Webhook receives events but Supabase doesn't update
**Cause:** Database connection failed
**Fix:** Check SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel env vars

### SendGrid webhook returns 404
**Cause:** Wrong URL or function not deployed
**Fix:** Verify Vercel deployment URL, check `/api/webhooks` directory exists

### Twilio webhook returns 403
**Cause:** Signature verification failed (if enabled)
**Fix:** Verify TWILIO_AUTH_TOKEN matches console

### Events missing from dashboard
**Cause:** Real-time subscriptions not enabled
**Fix:** Run `ALTER publication supabase_realtime ADD TABLE prospects;`

## Rollback Plan (5-second rollback)

```bash
# If webhook breaks, disable in external service:

# SendGrid: Disable event webhook
# Twilio: Unset voice webhook URL

# Or rollback Vercel deployment
vercel rollback
```

## Testing Checklist

- [ ] SendGrid webhook deployed
- [ ] Twilio webhook deployed
- [ ] SendGrid events configured (6 event types)
- [ ] Twilio voice webhook configured
- [ ] Test SendGrid events (delivered, open, click)
- [ ] Test Twilio call (status callback, recording)
- [ ] Verify Supabase updates in real-time
- [ ] Test error scenarios (bounce, spam, failed)
- [ ] Monitor Vercel logs for errors
- [ ] Test retry logic

## Known Issues

### Issue: SendGrid signature verification fails
**Workaround:** Disable signature verification temporarily
**Fix:** Verify public key matches SendGrid account

### Issue: Twilio recording URL 404
**Cause:** Recording not yet processed
**Fix:** Add 5-second delay before fetching recording

### Issue: Webhook timeout on batch events
**Cause:** SendGrid sends up to 1000 events per batch
**Fix:** Add pagination to process events in chunks of 100

---

**Status:** Implementation complete, awaiting deployment and testing
**Created by:** DevOps-Hightower
**Date:** 2026-06-03
**Cycle:** #37 Day 2
