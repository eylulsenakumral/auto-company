# QA-Bach Verification Suite — Auto Company Automation

**Created:** 2025-06-03  
**Purpose:** Comprehensive testing of outreach automation infrastructure  
**Environment:** Production-proven Cloudflare Workers + Supabase

---

## Test 1: Send Test Email → Check Dashboard

**Objective:** Verify end-to-end email delivery and dashboard reflection  
**Risk Level:** Low (single email, no batch operations)  
**Duration:** ~2 minutes

### Test Command

```bash
# 1. Set test environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-key"
export SENDGRID_API_KEY="your-sendgrid-key"

# 2. Run test script
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-1-send-email.js
```

### Test Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-1-send-email.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testSingleEmail() {
  console.log('🧪 TEST 1: Single Email Delivery\n');

  // 1. Create test prospect
  const testProspect = {
    company_name: 'Test Company QA',
    tier: 'tier-2',
    contact_email: 'tolga@nextvision.ai', // Replace with test email
    contact_name: 'QA Test User',
    contact_phone: '+905551234567',
    status: 'cold',
    phase: 'Phase 1',
    email_bounced: false,
    email_suppressed: false
  };

  console.log('📝 Creating test prospect...');
  const { data: prospect, error: createError } = await supabase
    .from('prospects')
    .insert([testProspect])
    .select()
    .single();

  if (createError) {
    console.error('❌ Failed to create prospect:', createError);
    return false;
  }

  console.log(`✅ Prospect created: ${prospect.id}`);

  // 2. Trigger worker manually via HTTP
  console.log('📧 Triggering email send...');
  const workerUrl = 'https://nextvision-outreach-worker.your-subdomain.workers.dev/trigger';
  
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    console.error('❌ Worker trigger failed:', response.status);
    await cleanup(prospect.id);
    return false;
  }

  const result = await response.json();
  console.log('✅ Worker response:', JSON.stringify(result, null, 2));

  // 3. Verify prospect status updated
  console.log('🔍 Verifying prospect status...');
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for DB update

  const { data: updatedProspect } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospect.id)
    .single();

  if (!updatedProspect.email_sent || updatedProspect.status !== 'contacted') {
    console.error('❌ Prospect not updated correctly');
    console.log('Expected: email_sent=true, status=contacted');
    console.log('Got:', updatedProspect);
    await cleanup(prospect.id);
    return false;
  }

  console.log('✅ Prospect status updated correctly');
  console.log('   - email_sent:', updatedProspect.email_sent);
  console.log('   - status:', updatedProspect.status);
  console.log('   - last_contacted:', updatedProspect.last_contacted);

  // 4. Verify activity log
  console.log('📋 Checking activity logs...');
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('event_type', 'email_sent')
    .eq('event_metadata->>to', testProspect.contact_email)
    .order('created_at', { ascending: false })
    .limit(1);

  if (!logs || logs.length === 0) {
    console.error('❌ No activity log found');
    await cleanup(prospect.id);
    return false;
  }

  console.log('✅ Activity log created');
  console.log('   - Message ID:', logs[0].event_metadata.message_id);
  console.log('   - Template:', logs[0].event_metadata.template_id);

  // 5. Cleanup
  await cleanup(prospect.id);

  console.log('\n🎉 TEST 1 PASSED: Email delivery verified end-to-end');
  return true;
}

async function cleanup(prospectId) {
  console.log('🧹 Cleaning up test data...');
  await supabase.from('prospects').delete().eq('id', prospectId);
  await supabase.from('activity_logs')
    .delete()
    .eq('event_type', 'email_sent')
    .eq('event_metadata->>company_name', 'Test Company QA');
  console.log('✅ Cleanup complete');
}

testSingleEmail().then(success => {
  process.exit(success ? 0 : 1);
});
```

### Success Criteria

- [ ] Prospect created in Supabase
- [ ] Worker returns HTTP 200 with `success: true`
- [ ] Prospect `email_sent` field updated to `true`
- [ ] Prospect `status` changed to `contacted`
- [ ] Activity log entry created with `event_type: email_sent`
- [ ] SendGrid message ID present in logs

### Expected Output

```
🧪 TEST 1: Single Email Delivery

📝 Creating test prospect...
✅ Prospect created: uuid-1234-5678
📧 Triggering email send...
✅ Worker response: {
  "success": true,
  "summary": {
    "timestamp": "2025-06-03T10:30:00.000Z",
    "companiesProcessed": 1,
    "emailsSent": 1,
    "emailsFailed": 0,
    "rateLimitHit": false,
    "errors": []
  }
}
🔍 Verifying prospect status...
✅ Prospect status updated correctly
   - email_sent: true
   - status: contacted
   - last_contacted: 2025-06-03T10:30:02.000Z
📋 Checking activity logs...
✅ Activity log created
   - Message ID: msg-xyz-123
   - Template: b
🧹 Cleaning up test data...
✅ Cleanup complete

🎉 TEST 1 PASSED: Email delivery verified end-to-end
```

### Rollback Procedure

If test fails:

1. **Check worker logs:** `wrangler tail nextvision-outreach-worker`
2. **Verify SendGrid API:** Check API key is valid and not rate limited
3. **Check Supabase connection:** Verify service key has write permissions
4. **Cleanup test data:**
   ```bash
   # Manual cleanup if script fails
   export SUPABASE_URL="https://your-project.supabase.co"
   export SUPABASE_SERVICE_KEY="your-key"
   
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=eq.Test%20Company%20QA" \
     -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
   ```

---

## Test 2: Test Webhook (Fake SendGrid Event)

**Objective:** Verify webhook handler processes events correctly  
**Risk Level:** Low (local test, no real emails)  
**Duration:** ~30 seconds

### Test Command

```bash
# Run webhook test
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-2-webhook.js
```

### Test Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-2-webhook.js
const http = require('http');

const webhookUrl = 'http://localhost:3000/api/webhooks/sendgrid'; // Adjust for deployment

async function testWebhook() {
  console.log('🧪 TEST 2: SendGrid Webhook Handler\n');

  // 1. Create test prospect first
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const testProspect = {
    company_name: 'Webhook Test Company',
    contact_email: 'webhook-test@example.com',
    status: 'contacted',
    email_sent: true
  };

  const { data: prospect } = await supabase
    .from('prospects')
    .insert([testProspect])
    .select()
    .single();

  console.log(`✅ Test prospect created: ${prospect.id}`);

  // 2. Test delivery event
  console.log('📤 Testing delivery event...');
  const deliveryEvent = [{
    email: 'webhook-test@example.com',
    event: 'delivered',
    sg_event_id: 'delivered_test_123',
    timestamp: Math.floor(Date.now() / 1000),
    'X-Message-ID': 'msg-test-123'
  }];

  const deliveryResult = await sendWebhookEvent(deliveryEvent);
  console.log('Delivery event response:', deliveryResult);

  await new Promise(resolve => setTimeout(resolve, 1000));

  // 3. Verify delivery recorded
  const { data: afterDelivery } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospect.id)
    .single();

  if (afterDelivery.email_status !== 'delivered') {
    console.error('❌ Delivery not recorded');
    console.log('Expected email_status=delivered, got:', afterDelivery.email_status);
    await supabase.from('prospects').delete().eq('id', prospect.id);
    return false;
  }

  console.log('✅ Delivery recorded correctly');
  console.log('   - email_status:', afterDelivery.email_status);
  console.log('   - email_delivered_at:', afterDelivery.email_delivered_at);

  // 4. Test bounce event
  console.log('📤 Testing bounce event...');
  const bounceEvent = [{
    email: 'webhook-test@example.com',
    event: 'bounce',
    sg_event_id: 'bounce_test_456',
    timestamp: Math.floor(Date.now() / 1000),
    reason: '550 5.4.5 Recipient address rejected: Invalid mailbox'
  }];

  const bounceResult = await sendWebhookEvent(bounceEvent);
  console.log('Bounce event response:', bounceResult);

  await new Promise(resolve => setTimeout(resolve, 1000));

  // 5. Verify bounce recorded
  const { data: afterBounce } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospect.id)
    .single();

  if (afterBounce.email_status !== 'bounced') {
    console.error('❌ Bounce not recorded');
    console.log('Expected email_status=bounced, got:', afterBounce.email_status);
    await supabase.from('prospects').delete().eq('id', prospect.id);
    return false;
  }

  console.log('✅ Bounce recorded correctly');
  console.log('   - email_status:', afterBounce.email_status);
  console.log('   - email_bounced_at:', afterBounce.email_bounced_at);
  console.log('   - email_bounce_reason:', afterBounce.email_bounce_reason);

  // 6. Cleanup
  await supabase.from('prospects').delete().eq('id', prospect.id);
  console.log('🧹 Cleanup complete');

  console.log('\n🎉 TEST 2 PASSED: Webhook processes events correctly');
  return true;
}

async function sendWebhookEvent(events) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(events);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhooks/sendgrid',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

testWebhook().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
```

### Success Criteria

- [ ] Webhook accepts POST request (HTTP 200)
- [ ] Delivery event updates `email_status` to `delivered`
- [ ] Delivery timestamp recorded
- [ ] Bounce event updates `email_status` to `bounced`
- [ ] Bounce reason recorded
- [ ] Response includes `processed: 1` and `results: ['ok']`

### Expected Output

```
🧪 TEST 2: SendGrid Webhook Handler

✅ Test prospect created: uuid-abcd-1234
📤 Testing delivery event...
Delivery event response: { success: true, processed: 1, results: ['ok'] }
✅ Delivery recorded correctly
   - email_status: delivered
   - email_delivered_at: 2025-06-03T10:31:15.000Z
📤 Testing bounce event...
Bounce event response: { success: true, processed: 1, results: ['ok'] }
✅ Bounce recorded correctly
   - email_status: bounced
   - email_bounced_at: 2025-06-03T10:31:17.000Z
   - email_bounce_reason: 550 5.4.5 Recipient address rejected
🧹 Cleanup complete

🎉 TEST 2 PASSED: Webhook processes events correctly
```

### Rollback Procedure

If webhook fails:

1. **Check webhook is running:**
   ```bash
   # Local dev
   cd /home/tolgabrk/projects/Auto-Company/automation/dashboard
   npm run dev
   
   # Or deployed
   curl https://your-deployment.vercel.app/api/webhooks/sendgrid
   ```

2. **Check webhook logs:** Vercel logs or local console

3. **Verify Supabase permissions:** Service key must have UPDATE on `prospects` table

4. **Manual cleanup:**
   ```bash
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=eq.Webhook%20Test%20Company" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   ```

---

## Test 3: Test Twilio makeCall() → Verify Call Logs

**Objective:** Verify Twilio call initiation and logging  
**Risk Level:** Medium (makes real phone call)  
**Duration:** ~1 minute

### Test Command

```bash
# Requires Twilio credentials
export TWILIO_ACCOUNT_SID="your-sid"
export TWILIO_AUTH_TOKEN="your-token"
export TWILIO_PHONE_NUMBER="+1XXX"
export TEST_PHONE_NUMBER="+905551234567" # Your test number

node /home/tolgabrk/projects/Auto-Company/automation/tests/test-3-twilio-call.js
```

### Test Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-3-twilio-call.js
const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testTwilioCall() {
  console.log('🧪 TEST 3: Twilio Call Initiation\n');

  // 1. Create test prospect with phone
  const testProspect = {
    company_name: 'Twilio Test Company',
    contact_phone: process.env.TEST_PHONE_NUMBER,
    contact_name: 'QA Test',
    status: 'contacted',
    email_sent: true
  };

  const { data: prospect } = await supabase
    .from('prospects')
    .insert([testProspect])
    .select()
    .single();

  console.log(`✅ Test prospect created: ${prospect.id}`);

  // 2. Initiate call via Twilio
  console.log('📞 Initiating test call...');
  const call = await client.calls.create({
    to: process.env.TEST_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
    url: 'https://your-deployment.vercel.app/api/webhooks/twilio/twiml?scenario=pitch',
    statusCallback: 'https://your-deployment.vercel.app/api/webhooks/twilio/status',
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
  });

  console.log('✅ Call initiated');
  console.log('   - Call SID:', call.sid);
  console.log('   - Status:', call.status);

  // 3. Wait for call to complete
  console.log('⏳ Waiting for call to complete...');
  await new Promise(resolve => setTimeout(resolve, 30000));

  // 4. Check call status in Twilio
  const updatedCall = await client.calls(call.sid).fetch();
  console.log('📊 Call status:', updatedCall.status);
  console.log('   - Duration:', updatedCall.duration, 'seconds');

  // 5. Verify call logged in Supabase
  console.log('🔍 Checking call logs in Supabase...');
  const { data: callLogs } = await supabase
    .from('calls')
    .select('*')
    .eq('twilio_call_sid', call.sid)
    .single();

  if (!callLogs) {
    console.error('❌ Call not logged in Supabase');
    console.log('   Expected call record with twilio_call_sid:', call.sid);
    await supabase.from('prospects').delete().eq('id', prospect.id);
    return false;
  }

  console.log('✅ Call logged correctly');
  console.log('   - Call ID:', callLogs.id);
  console.log('   - Status:', callLogs.call_status);
  console.log('   - Duration:', callLogs.call_duration, 'seconds');
  console.log('   - Recording URL:', callLogs.recording_url || 'N/A');

  // 6. Cleanup
  await supabase.from('prospects').delete().eq('id', prospect.id);
  await supabase.from('calls').delete().eq('twilio_call_sid', call.sid);
  console.log('🧹 Cleanup complete');

  console.log('\n🎉 TEST 3 PASSED: Twilio call verified end-to-end');
  return true;
}

testTwilioCall().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
```

### Success Criteria

- [ ] Call initiated successfully (Twilio SID created)
- [ ] Call status progresses through lifecycle (ringing → completed)
- [ ] Call recorded in Supabase `calls` table
- [ ] `twilio_call_sid` matches
- [ ] Call duration recorded
- [ ] Status callback updates `call_status` field

### Expected Output

```
🧪 TEST 3: Twilio Call Initiation

✅ Test prospect created: uuid-call-1234
📞 Initiating test call...
✅ Call initiated
   - Call SID: CAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   - Status: queued
⏳ Waiting for call to complete...
📊 Call status: completed
   - Duration: 8 seconds
🔍 Checking call logs in Supabase...
✅ Call logged correctly
   - Call ID: uuid-logs-5678
   - Status: completed
   - Duration: 8 seconds
   - Recording URL: https://api.twilio.com/...
🧹 Cleanup complete

🎉 TEST 3 PASSED: Twilio call verified end-to-end
```

### Rollback Procedure

If call fails:

1. **Check Twilio credentials:** Verify ACCOUNT_SID and AUTH_TOKEN
2. **Check phone numbers:** Ensure FROM number is Twilio-owned, TO number is verified
3. **Check webhook URLs:** Must be publicly accessible (ngrok for local)
4. **Manual cleanup:**
   ```bash
   # Delete test call logs
   curl -X DELETE "$SUPABASE_URL/rest/v1/calls?twilio_call_sid=eq.CAXXXX" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   
   # Delete test prospect
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=eq.Twilio%20Test%20Company" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   ```

---

## Test 4: End-to-End Cron Trigger → 10 Emails Sent

**Objective:** Verify batch processing with rate limiting  
**Risk Level:** High (production cron, hits rate limit)  
**Duration:** ~5 minutes

### Test Command

```bash
# 1. Seed test data (10 prospects)
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-4-seed-prospects.js

# 2. Trigger cron manually
curl -X POST https://nextvision-outreach-worker.workers.dev/trigger \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"

# 3. Monitor execution
wrangler tail nextvision-outreach-worker

# 4. Verify results
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-4-verify-results.js
```

### Seed Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-4-seed-prospects.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedProspects() {
  console.log('🧪 TEST 4: Seeding 10 Test Prospects\n');

  const prospects = [];
  for (let i = 1; i <= 10; i++) {
    prospects.push({
      company_name: `Batch Test Company ${i}`,
      tier: i <= 3 ? 'tier-1' : 'tier-2',
      contact_email: `test${i}@example.com`,
      contact_name: `Test Contact ${i}`,
      contact_phone: `+9055512345${i}`,
      status: 'cold',
      phase: 'Phase 1',
      email_bounced: false,
      email_suppressed: false
    });
  }

  const { data, error } = await supabase
    .from('prospects')
    .insert(prospects)
    .select();

  if (error) {
    console.error('❌ Failed to seed prospects:', error);
    return false;
  }

  console.log(`✅ Seeded ${data.length} prospects`);
  data.forEach(p => {
    console.log(`   - ${p.company_name} (${p.contact_email})`);
  });

  console.log('\n⚡ Ready to trigger cron. Run:');
  console.log('   curl -X POST https://nextvision-outreach-worker.workers.dev/trigger \\');
  console.log('     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"');

  return true;
}

seedProspects().then(success => process.exit(success ? 0 : 1));
```

### Verify Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-4-verify-results.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifyResults() {
  console.log('🧪 TEST 4: Verifying Batch Results\n');

  // 1. Check prospect statuses
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('*')
    .like('company_name', 'Batch Test Company%')
    .order('company_name');

  if (error) {
    console.error('❌ Failed to fetch prospects:', error);
    return false;
  }

  console.log(`📊 Found ${prospects.length} prospects`);

  const emailed = prospects.filter(p => p.email_sent && p.status === 'contacted');
  const failed = prospects.filter(p => !p.email_sent);

  console.log(`✅ Email sent: ${emailed.length}/10`);
  console.log(`❌ Failed: ${failed.length}/10`);

  if (failed.length > 0) {
    console.log('\nFailed prospects:');
    failed.forEach(p => {
      console.log(`   - ${p.company_name}: ${p.contact_email}`);
    });
  }

  // 2. Check activity logs
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('event_type', 'email_sent')
    .like('event_metadata->>company_name', 'Batch Test Company%');

  console.log(`\n📋 Activity logs: ${logs.length} entries`);

  // 3. Check daily metrics
  const today = new Date().toISOString().split('T')[0];
  const { data: metrics } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('date', today)
    .single();

  if (metrics) {
    console.log(`📈 Daily metrics updated:`);
    console.log(`   - emails_sent: ${metrics.emails_sent}`);
  }

  // 4. Check rate limit
  const { count } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'email_sent')
    .gte('created_at', today);

  console.log(`\n⚠️  Rate limit status: ${count}/10 emails today`);

  if (emailed.length === 10) {
    console.log('\n🎉 TEST 4 PASSED: All 10 emails sent successfully');
    
    // Cleanup prompt
    console.log('\n🧹 Cleanup command:');
    console.log('   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=like.Batch%20Test%20Company%" \\');
    console.log('     -H "apikey: $SUPABASE_SERVICE_KEY"');
    
    return true;
  } else {
    console.log('\n❌ TEST 4 FAILED: Not all emails sent');
    return false;
  }
}

verifyResults().then(success => process.exit(success ? 0 : 1));
```

### Success Criteria

- [ ] All 10 prospects fetched from database
- [ ] All 10 emails sent (HTTP 202 from SendGrid)
- [ ] All 10 prospects updated to `email_sent: true, status: contacted`
- [ ] 10 activity log entries created
- [ ] Daily metrics updated with `emails_sent: 10`
- [ ] Rate limit enforced after 10 emails

### Expected Output

```
🧪 TEST 4: Verifying Batch Results

📊 Found 10 prospects
✅ Email sent: 10/10
❌ Failed: 0/10

📋 Activity logs: 10 entries

📈 Daily metrics updated:
   - emails_sent: 10

⚠️  Rate limit status: 10/10 emails today

🎉 TEST 4 PASSED: All 10 emails sent successfully

🧹 Cleanup command:
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=like.Batch%20Test%20Company%" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
```

### Rollback Procedure

If batch fails:

1. **Check worker logs:** `wrangler tail nextvision-outreach-worker`
2. **Check SendGrid rate limit:** Verify daily quota not exceeded
3. **Check individual email errors:** Query `activity_logs` for `automation_error` events
4. **Partial retry:** Update only failed prospects to cold status and re-trigger
5. **Full cleanup:**
   ```bash
   # Delete all test prospects
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=like.Batch%20Test%20Company%" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   
   # Delete test logs
   curl -X DELETE "$SUPABASE_URL/rest/v1/activity_logs?event_metadata->>company_name=like.Batch%20Test%20Company%" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   
   # Reset daily metrics
   curl -X PATCH "$SUPABASE_URL/rest/v1/daily_metrics?date=eq.$(date +%Y-%m-%d)" \
     -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"emails_sent": 0}'
   ```

---

## Test 5: Rollback Test → Disable Cron, Verify Stops

**Objective:** Verify graceful shutdown and no partial state  
**Risk Level:** Low (disables automation)  
**Duration:** ~2 minutes

### Test Command

```bash
# 1. Disable cron
wrangler put nextvision-outreach-worker --disable-cron

# 2. Attempt manual trigger (should fail)
curl -X POST https://nextvision-outreach-worker.workers.dev/trigger \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"

# 3. Seed test prospects
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-5-seed.js

# 4. Wait for scheduled time (if applicable) or attempt trigger
# 5. Verify no emails sent
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-5-verify.js

# 6. Re-enable cron
wrangler put nextvision-outreach-worker --enable-cron
```

### Seed Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-5-seed.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seed() {
  console.log('🧪 TEST 5: Seeding Prospects for Rollback Test\n');

  const prospects = [];
  for (let i = 1; i <= 5; i++) {
    prospects.push({
      company_name: `Rollback Test ${i}`,
      contact_email: `rollback${i}@example.com`,
      status: 'cold',
      phase: 'Phase 1',
      email_bounced: false,
      email_suppressed: false
    });
  }

  const { data, error } = await supabase
    .from('prospects')
    .insert(prospects)
    .select();

  if (error) {
    console.error('❌ Failed to seed:', error);
    return false;
  }

  console.log(`✅ Seeded ${data.length} prospects`);
  console.log('   These should NOT be contacted (cron disabled)');

  return true;
}

seed().then(success => process.exit(success ? 0 : 1));
```

### Verify Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-5-verify.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifyRollback() {
  console.log('🧪 TEST 5: Verifying Rollback State\n');

  // 1. Check prospects remain untouched
  const { data: prospects } = await supabase
    .from('prospects')
    .select('*')
    .like('company_name', 'Rollback Test%');

  console.log(`📊 Found ${prospects.length} prospects`);

  const contacted = prospects.filter(p => p.email_sent || p.status === 'contacted');
  
  if (contacted.length > 0) {
    console.error('❌ ROLLBACK FAILED: Some prospects were contacted');
    contacted.forEach(p => {
      console.log(`   - ${p.company_name}: email_sent=${p.email_sent}, status=${p.status}`);
    });
    return false;
  }

  console.log('✅ All prospects remain in cold state');

  // 2. Verify no activity logs
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('event_type', 'email_sent')
    .like('event_metadata->>company_name', 'Rollback Test%');

  if (logs.length > 0) {
    console.error('❌ Activity logs found (should be zero):', logs.length);
    return false;
  }

  console.log('✅ No activity logs created');

  // 3. Verify worker health endpoint still works
  const healthResponse = await fetch('https://nextvision-outreach-worker.workers.dev/health');
  const health = await healthResponse.json();

  if (health.status !== 'ok') {
    console.error('❌ Worker health check failed');
    return false;
  }

  console.log('✅ Worker health endpoint responds');

  // 4. Cleanup
  await supabase.from('prospects')
    .delete()
    .like('company_name', 'Rollback Test%');

  console.log('🧹 Cleanup complete');

  console.log('\n🎉 TEST 5 PASSED: Rollback verified - automation stopped cleanly');
  return true;
}

verifyRollback().then(success => process.exit(success ? 0 : 1));
```

### Success Criteria

- [ ] Worker returns HTTP 401/403 when cron disabled
- [ ] No emails sent to test prospects
- [ ] All prospects remain in `status: cold`
- [ ] No activity logs created
- [ ] Health endpoint still responds
- [ ] Re-enabling cron restores functionality

### Expected Output

```
🧪 TEST 5: Verifying Rollback State

📊 Found 5 prospects
✅ All prospects remain in cold state
✅ No activity logs created
✅ Worker health endpoint responds
🧹 Cleanup complete

🎉 TEST 5 PASSED: Rollback verified - automation stopped cleanly
```

### Rollback Procedure

If rollback test fails (emails were sent despite disabled cron):

1. **Emergency stop:**
   ```bash
   # Delete all prospects immediately
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=like.Rollback%20Test%" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   ```

2. **Investigate cron disable:** Verify wrangler command succeeded
3. **Check worker logs:** Identify why cron still triggered
4. **Review rate limiting:** Ensure daily quota wasn't exceeded by mistake

---

## Test 6: Full E2E → Complete Outreach Simulation

**Objective:** Simulate complete customer journey: prospect → email → click → demo booking  
**Risk Level:** Medium (multi-step, uses real services)  
**Duration:** ~10 minutes

### Test Command

```bash
# Run full E2E suite
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-6-full-e2e.js
```

### Test Script

```javascript
// /home/tolgabrk/projects/Auto-Company/automation/tests/test-6-full-e2e.js
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function runFullE2E() {
  console.log('🧪 TEST 6: Full E2E Outreach Simulation\n');
  console.log('This test simulates: Prospect → Email → Click → Demo Booking\n');

  let prospectId = null;
  let companyId = null;

  try {
    // === STEP 1: Create prospect ===
    console.log('📝 STEP 1: Creating prospect...');
    const { data: prospect, error: createError } = await supabase
      .from('prospects')
      .insert([{
        company_name: 'E2E Test Company',
        tier: 'tier-1',
        contact_email: 'e2e-test@example.com',
        contact_name: 'E2E Decision Maker',
        contact_phone: '+905559998877',
        status: 'cold',
        phase: 'Phase 1',
        email_bounced: false,
        email_suppressed: false
      }])
      .select()
      .single();

    if (createError) throw createError;
    prospectId = prospect.id;
    console.log(`✅ Prospect created: ${prospect.id}`);

    // === STEP 2: Send email ===
    console.log('\n📧 STEP 2: Sending initial email...');
    const workerResponse = await fetch(
      'https://nextvision-outreach-worker.workers.dev/trigger',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
        }
      }
    );

    if (!workerResponse.ok) {
      throw new Error(`Worker failed: ${workerResponse.status}`);
    }

    const workerResult = await workerResponse.json();
    console.log('✅ Email sent via worker');
    console.log(`   - Processed: ${workerResult.summary.companiesProcessed}`);
    console.log(`   - Sent: ${workerResult.summary.emailsSent}`);

    // Wait for DB update
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify prospect updated
    const { data: updatedProspect } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (!updatedProspect.email_sent || updatedProspect.status !== 'contacted') {
      throw new Error('Email not recorded in prospect');
    }

    console.log('✅ Prospect status updated to "contacted"');

    // === STEP 3: Simulate email open ===
    console.log('\n👀 STEP 3: Simulating email open event...');
    const openEvent = [{
      email: 'e2e-test@example.com',
      event: 'open',
      sg_event_id: 'e2e_open_123',
      timestamp: Math.floor(Date.now() / 1000)
    }];

    await sendWebhookEvent(openEvent);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: afterOpen } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (afterOpen.email_status !== 'opened') {
      throw new Error('Open event not recorded');
    }

    console.log('✅ Email open recorded');
    console.log(`   - Opens: ${afterOpen.email_open_count || 1}`);

    // === STEP 4: Simulate link click ===
    console.log('\n🖱️  STEP 4: Simulating link click...');
    const clickEvent = [{
      email: 'e2e-test@example.com',
      event: 'click',
      sg_event_id: 'e2e_click_456',
      timestamp: Math.floor(Date.now() / 1000),
      url: 'https://nextvision.ai/demo?utm_source=outreach&utm_medium=email'
    }];

    await sendWebhookEvent(clickEvent);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: afterClick } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();

    if (afterClick.email_status !== 'clicked') {
      throw new Error('Click event not recorded');
    }

    console.log('✅ Link click recorded');
    console.log(`   - Clicks: ${afterClick.email_click_count || 1}`);
    console.log(`   - URL: ${afterClick.email_clicked_url}`);

    // === STEP 5: Simulate demo booking ===
    console.log('\n📅 STEP 5: Recording demo booking...');
    const { data: demo, error: demoError } = await supabase
      .from('demo_bookings')
      .insert([{
        prospect_id: prospectId,
        scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: 'scheduled',
        created_by: 'e2e-test-automation'
      }])
      .select()
      .single();

    if (demoError) throw demoError;
    console.log('✅ Demo booked');
    console.log(`   - Demo ID: ${demo.id}`);
    console.log(`   - Scheduled: ${demo.scheduled_at}`);

    // === STEP 6: Update prospect to warm ===
    console.log('\n🔥 STEP 6: Updating prospect to "warm"...');
    const { data: warmProspect } = await supabase
      .from('prospects')
      .update({
        status: 'warm',
        phase: 'Phase 2',
        demo_booked: true,
        demo_scheduled_at: demo.scheduled_at
      })
      .eq('id', prospectId)
      .select()
      .single();

    console.log('✅ Prospect advanced to warm lead');
    console.log(`   - Status: ${warmProspect.status}`);
    console.log(`   - Phase: ${warmProspect.phase}`);

    // === STEP 7: Verify daily metrics ===
    console.log('\n📊 STEP 7: Verifying daily metrics...');
    const today = new Date().toISOString().split('T')[0];
    const { data: metrics } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('date', today)
      .single();

    if (!metrics) {
      console.warn('⚠️  No daily metrics found (may need manual trigger)');
    } else {
      console.log('✅ Daily metrics tracked');
      console.log(`   - Emails sent: ${metrics.emails_sent}`);
      console.log(`   - Demos booked: ${metrics.demos_booked || 0}`);
    }

    // === TEST COMPLETE ===
    console.log('\n🎉 TEST 6 PASSED: Full E2E journey completed successfully');
    console.log('\n📋 Journey Summary:');
    console.log('   1. ✅ Prospect created (cold → contacted)');
    console.log('   2. ✅ Email sent and logged');
    console.log('   3. ✅ Email opened');
    console.log('   4. ✅ Link clicked');
    console.log('   5. ✅ Demo booked');
    console.log('   6. ✅ Prospect warmed (Phase 1 → Phase 2)');

    console.log('\n🧹 Cleanup command:');
    console.log(`   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?id=eq.${prospectId}" \\`);
    console.log('     -H "apikey: $SUPABASE_SERVICE_KEY"');

    return true;

  } catch (error) {
    console.error('\n❌ TEST 6 FAILED:', error.message);
    
    // Emergency cleanup
    if (prospectId) {
      console.log('🧹 Emergency cleanup...');
      await supabase.from('prospects').delete().eq('id', prospectId);
    }
    
    return false;
  }
}

async function sendWebhookEvent(events) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(events);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhooks/sendgrid',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

runFullE2E().then(success => {
  process.exit(success ? 0 : 1);
});
```

### Success Criteria

- [ ] Prospect created and progresses through lifecycle
- [ ] Email sent successfully
- [ ] Email open event recorded
- [ ] Link click event captured
- [ ] Demo booking created
- [ ] Prospect status advances: cold → contacted → warm
- [ ] Daily metrics updated
- [ ] All database updates atomic (no partial state)

### Expected Output

```
🧪 TEST 6: Full E2E Outreach Simulation

This test simulates: Prospect → Email → Click → Demo Booking

📝 STEP 1: Creating prospect...
✅ Prospect created: uuid-e2e-1234

📧 STEP 2: Sending initial email...
✅ Email sent via worker
   - Processed: 1
   - Sent: 1
✅ Prospect status updated to "contacted"

👀 STEP 3: Simulating email open event...
✅ Email open recorded
   - Opens: 1

🖱️  STEP 4: Simulating link click...
✅ Link click recorded
   - Clicks: 1
   - URL: https://nextvision.ai/demo?utm_source=outreach&utm_medium=email

📅 STEP 5: Recording demo booking...
✅ Demo booked
   - Demo ID: uuid-demo-5678
   - Scheduled: 2025-06-04T10:30:00.000Z

🔥 STEP 6: Updating prospect to "warm"...
✅ Prospect advanced to warm lead
   - Status: warm
   - Phase: Phase 2

📊 STEP 7: Verifying daily metrics...
✅ Daily metrics tracked
   - Emails sent: 1
   - Demos booked: 1

🎉 TEST 6 PASSED: Full E2E journey completed successfully

📋 Journey Summary:
   1. ✅ Prospect created (cold → contacted)
   2. ✅ Email sent and logged
   3. ✅ Email opened
   4. ✅ Link clicked
   5. ✅ Demo booked
   6. ✅ Prospect warmed (Phase 1 → Phase 2)

🧹 Cleanup command:
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?id=eq.uuid-e2e-1234" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
```

### Rollback Procedure

If E2E fails mid-journey:

1. **Identify failure point:** Check last successful step
2. **Rollback prospect to previous state:**
   ```bash
   # Reset to contacted (if demo booking failed)
   curl -X PATCH "$SUPABASE_URL/rest/v1/prospects?id=eq.$PROSPECT_ID" \
     -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Content-Type: application/json" \
     -d '{"status": "contacted", "phase": "Phase 1", "demo_booked": false}'
   ```

3. **Delete orphaned records:**
   ```bash
   # Delete demo booking if prospect rolled back
   curl -X DELETE "$SUPABASE_URL/rest/v1/demo_bookings?prospect_id=eq.$PROSPECT_ID" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   ```

4. **Full cleanup if test unrecoverable:**
   ```bash
   curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?id=eq.$PROSPECT_ID" \
     -H "apikey: $SUPABASE_SERVICE_KEY"
   ```

---

## Quick Reference: Test Commands

```bash
# Test 1: Single email
export SUPABASE_URL="..."
export SUPABASE_SERVICE_KEY="..."
export SENDGRID_API_KEY="..."
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-1-send-email.js

# Test 2: Webhook
cd /home/tolgabrk/projects/Auto-Company/automation/dashboard && npm run dev
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-2-webhook.js

# Test 3: Twilio call
export TWILIO_ACCOUNT_SID="..."
export TWILIO_AUTH_TOKEN="..."
export TEST_PHONE_NUMBER="+905551234567"
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-3-twilio-call.js

# Test 4: Batch processing
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-4-seed-prospects.js
curl -X POST https://nextvision-outreach-worker.workers.dev/trigger \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
wrangler tail nextvision-outreach-worker
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-4-verify-results.js

# Test 5: Rollback
wrangler put nextvision-outreach-worker --disable-cron
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-5-seed.js
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-5-verify.js
wrangler put nextvision-outreach-worker --enable-cron

# Test 6: Full E2E
node /home/tolgabrk/projects/Auto-Company/automation/tests/test-6-full-e2e.js
```

---

## Summary: Test Matrix

| Test | Risk | Duration | Components | Dependencies |
|------|------|----------|------------|--------------|
| 1. Single Email | Low | 2min | Worker, SendGrid, Supabase | All credentials |
| 2. Webhook | Low | 30s | Webhook handler, Supabase | Local webhook server |
| 3. Twilio Call | Medium | 1min | Twilio API, Supabase | Twilio credentials, test phone |
| 4. Batch | High | 5min | Worker cron, rate limiting | 10 test prospects |
| 5. Rollback | Low | 2min | Worker control plane | Wrangler CLI |
| 6. Full E2E | Medium | 10min | Complete pipeline | All services |

**Total suite runtime:** ~20 minutes (sequential) or ~8 minutes (parallel where possible)

**Recommendation:** Run tests 1-3 in parallel, then 4-6 sequentially.

---

## Post-Test Verification

After any test, verify dashboard reflects changes:

```bash
# Check dashboard
cd /home/tolgabrk/projects/Auto-Company/automation/dashboard
npm run dev
# Open http://localhost:3000

# Verify metrics in Supabase
curl "$SUPABASE_URL/rest/v1/daily_metrics?order=date.desc&limit=5" \
  -H "apikey: $SUPABASE_SERVICE_KEY"
```

---

## Troubleshooting Common Issues

### Issue: "Worker returns 401 Unauthorized"

**Cause:** Invalid or missing SUPABASE_SERVICE_KEY  
**Fix:** Verify environment variable and key validity

### Issue: "No prospects fetched"

**Cause:** No prospects match query criteria  
**Fix:** Ensure test prospects have `status=cold`, `phase=Phase 1`

### Issue: "Rate limit reached immediately"

**Cause:** Previous test runs didn't clean up  
**Fix:** Delete activity logs from today or wait for UTC midnight

### Issue: "Webhook returns 404"

**Cause:** Webhook server not running or path incorrect  
**Fix:** Start dashboard dev server or adjust URL in test script

### Issue: "Twilio call fails"

**Cause:** Unverified phone number or insufficient credits  
**Fix:** Verify test phone number in Twilio console, check account balance

---

**QA-Bach Sign-off:** Tests designed for production confidence. Execute in order, verify each success criterion before proceeding. Rollback immediately on failure.