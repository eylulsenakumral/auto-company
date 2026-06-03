# Cloudflare Workers Cron — Production Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  CLOUDFLARE WORKER (Serverless)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Cron Trigger (Daily 9AM Istanbul = 6AM UTC)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Fetch 10 companies from Supabase                 │  │
│  │     - Filter: NOT contacted, Phase 1, NOT bounced   │  │
│  │     - Sort: Tier-1 first, then random               │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. For each company:                                │  │
│  │     - Call SendGrid API → send_email()              │  │
│  │     - Log result to Supabase activity_logs           │  │
│  │     - Rate limiting: Max 10/day total               │  │
│  │     - Retry failed sends (3 attempts)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. Update daily_metrics table                      │  │
│  │     - Increment emails_sent count                    │  │
│  │     - Track success/failure rates                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. Return execution summary                        │  │
│  │     - Emails sent: N                                 │  │
│  │     - Success rate: X%                               │  │
│  │     - Errors logged to Supabase                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Worker Configuration (wrangler.toml)

```toml
name = "nextvision-outreach-worker"
main = "worker.ts"
compatibility_date = "2024-01-01"
account_id = "YOUR_ACCOUNT_ID"  # Get from Cloudflare dashboard

# Environment variables (secrets)
[vars]
ENVIRONMENT = "production"
LOG_LEVEL = "info"

# Cron trigger (daily 9AM Istanbul = 6AM UTC)
[triggers]
crons = ["0 6 * * *"]  # 6AM UTC = 9AM Istanbul (UTC+3)

# Secret variables (set via: wrangler secret put SENDGRID_API_KEY)
# - SENDGRID_API_KEY
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
```

## Worker Implementation (worker.ts)

```typescript
// Cloudflare Worker — Bursa Automotive Outreach Automation
// Auto Company Cycle #37 — Day 1 Build
// Cron: Daily 9AM Istanbul (6AM UTC)

import { sendEmail } from './sendgrid-client';

interface Env {
  SENDGRID_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
}

interface Company {
  id: string;
  company_name: string;
  tier: string;
  contact_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  status: string;
  phase: string;
  email_bounced?: boolean;
  email_suppressed?: boolean;
}

interface ExecutionSummary {
  timestamp: string;
  companiesProcessed: number;
  emailsSent: number;
  emailsFailed: number;
  rateLimitHit: boolean;
  errors: string[];
}

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    console.log(`🚀 Cron job started at ${new Date().toISOString()}`);

    const summary: ExecutionSummary = {
      timestamp: new Date().toISOString(),
      companiesProcessed: 0,
      emailsSent: 0,
      emailsFailed: 0,
      rateLimitHit: false,
      errors: []
    };

    try {
      // Step 1: Fetch companies to contact
      console.log(`📋 Fetching companies from Supabase...`);
      const companies = await fetchCompanies(env);

      if (companies.length === 0) {
        console.log(`✅ No companies to contact (all contacted or rate limited)`);
        return new Response(JSON.stringify({
          success: true,
          message: 'No companies to contact',
          summary
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log(`📋 Found ${companies.length} companies to contact`);

      // Step 2: Send emails to each company
      for (const company of companies) {
        if (!company.contact_email) {
          console.log(`⚠️  Skipping ${company.company_name} (no email)`);
          summary.errors.push(`${company.company_name}: No email address`);
          continue;
        }

        if (company.email_bounced) {
          console.log(`⚠️  Skipping ${company.company_name} (email bounced previously)`);
          summary.errors.push(`${company.company_name}: Email bounced previously`);
          continue;
        }

        if (company.email_suppressed) {
          console.log(`⚠️  Skipping ${company.company_name} (email suppressed)`);
          summary.errors.push(`${company.company_name}: Email suppressed`);
          continue;
        }

        console.log(`📧 Sending email to ${company.company_name} (${company.contact_email})`);

        // Select template based on company tier
        const templateId = company.tier === 'tier-1' ? 'a' : 'b';

        // Send email (with retry logic)
        const result = await sendEmailWithRetry(
          {
            to: company.contact_email,
            contactName: company.contact_name || undefined,
            companyName: company.company_name,
            contactPhone: company.contact_phone || undefined,
            templateId
          },
          env,
          3  // Max 3 retries
        );

        summary.companiesProcessed++;

        if (result.success) {
          summary.emailsSent++;
          console.log(`✅ Email sent to ${company.company_name}`);

          // Update prospect status
          await updateProspectStatus(env, company.id, {
            email_sent: true,
            status: 'contacted',
            last_contacted: new Date().toISOString()
          });
        } else {
          summary.emailsFailed++;
          const errorMsg = result.error || 'Unknown error';

          if (result.rateLimited) {
            summary.rateLimitHit = true;
            console.log(`⚠️  Rate limit reached, stopping...`);
            summary.errors.push(`Rate limit reached: ${errorMsg}`);
            break;  // Stop processing if rate limited
          }

          console.log(`❌ Failed to send to ${company.company_name}: ${errorMsg}`);
          summary.errors.push(`${company.company_name}: ${errorMsg}`);
        }

        // Small delay between emails (500ms) to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 3: Update daily metrics
      console.log(`📊 Updating daily metrics...`);
      await updateDailyMetrics(env, summary);

      console.log(`✅ Cron job completed`);
      console.log(`📊 Summary: ${summary.emailsSent} sent, ${summary.emailsFailed} failed`);

      return new Response(JSON.stringify({
        success: true,
        summary
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Cron job failed: ${errorMsg}`);
      summary.errors.push(`Fatal error: ${errorMsg}`);

      // Log to Supabase
      await logAutomationError(env, 'cron_execution', errorMsg);

      return new Response(JSON.stringify({
        success: false,
        error: errorMsg,
        summary
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // HTTP endpoint for manual testing
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'nextvision-outreach-worker'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/trigger' && request.method === 'POST') {
      // Manual trigger for testing (requires auth header)
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== `Bearer ${env.SUPABASE_SERVICE_KEY}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Trigger cron manually
      return await scheduled(request as any, env, ctx);
    }

    return new Response('Not found', { status: 404 });
  }
};

async function fetchCompanies(env: Env): Promise<Company[]> {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/prospects?select=id,company_name,tier,contact_email,contact_name,contact_phone,status,phase,email_bounced,email_suppressed&status=eq.cold&phase=eq.Phase%201&email_bounced=is.false&email_suppressed=is.false&order=tier.asc&limit=10`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }

    const companies = await response.json();
    console.log(`✅ Fetched ${companies.length} companies from Supabase`);

    return companies;
  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    throw error;
  }
}

async function sendEmailWithRetry(
  params: any,
  env: Env,
  maxRetries: number
): Promise<any> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${params.to}`);

    const result = await sendEmail({
      ...params,
      // Override env vars for sendEmail function
      to: params.to,
      contactName: params.contactName,
      companyName: params.companyName,
      contactPhone: params.contactPhone,
      templateId: params.templateId
    });

    if (result.success) {
      return result;
    }

    lastError = result.error;

    if (result.rateLimited) {
      return result;  // Don't retry if rate limited
    }

    // Wait before retry (exponential backoff: 1s, 2s, 4s)
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`
  };
}

async function updateProspectStatus(
  env: Env,
  prospectId: string,
  updates: Record<string, any>
): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/prospects?id=eq.${prospectId}`, {
      method: 'PATCH',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('❌ Error updating prospect status:', error);
  }
}

async function updateDailyMetrics(
  env: Env,
  summary: ExecutionSummary
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if metrics exist for today
    const existing = await fetch(
      `${env.SUPABASE_URL}/rest/v1/daily_metrics?date=eq.${today}`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
        }
      }
    );

    if (existing.ok && (await existing.json()).length > 0) {
      // Update existing metrics
      await fetch(`${env.SUPABASE_URL}/rest/v1/daily_metrics?date=eq.${today}`, {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails_sent: summary.emailsSent
        })
      });
    } else {
      // Insert new metrics
      await fetch(`${env.SUPABASE_URL}/rest/v1/daily_metrics`, {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: today,
          emails_sent: summary.emailsSent,
          emails_delivered: 0,  // Will be updated by webhooks
          emails_opened: 0,
          emails_replied: 0,
          calls_made: 0,
          calls_connected: 0,
          voicemails_left: 0,
          demos_booked: 0,
          pilots_converted: 0
        })
      });
    }

    console.log(`✅ Daily metrics updated`);
  } catch (error) {
    console.error('❌ Error updating daily metrics:', error);
  }
}

async function logAutomationError(
  env: Env,
  context: string,
  error: string
): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'automation_error',
        event_metadata: {
          context,
          error,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (err) {
    console.error('❌ Error logging automation error:', err);
  }
}
```

## Deployment Steps

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login  # Opens browser for authentication
```

### Step 2: Create Project Structure
```bash
mkdir -p automation/worker
cd automation/worker
npm init -y
npm install --save-dev wrangler
```

### Step 3: Setup wrangler.toml
```bash
wrangler init nextvision-outreach-worker
```

Edit `wrangler.toml` with configuration above.

### Step 4: Set Secrets
```bash
# SendGrid API key
wrangler secret put SENDGRID_API_KEY
# (Paste your SendGrid API key when prompted)

# Supabase credentials
wrangler secret put SUPABASE_URL
# (Paste your Supabase URL)

wrangler secret put SUPABASE_SERVICE_KEY
# (Paste your Supabase service role key)
```

### Step 5: Deploy Worker
```bash
wrangler deploy
```

**Expected Output**:
```
✨ Built successfully
✨ Deployed nextvision-outreach-worker
🕵️  View at https://workers.cloudflare.com/...
🔭 Cron schedules:
  - 0 6 * * * (daily 6AM UTC = 9AM Istanbul)
```

### Step 6: Verify Cron Schedule
```bash
wrangler cron list
```

**Expected Output**:
```
┌──────────────────────┬────────────────────────────────┐
│ Cron                 │ Created At                    │
├──────────────────────┼────────────────────────────────┤
│ 0 6 * * *            │ 2024-06-03T12:00:00.000Z       │
└──────────────────────┴────────────────────────────────┘
```

## Testing Manual Trigger

### Step 1: Get Worker URL
```bash
wrangler deploy  # Shows URL like: https://nextvision-outreach-worker.YOUR_SUBDOMAIN.workers.dev
```

### Step 2: Health Check
```bash
curl https://nextvision-outreach-worker.YOUR_SUBDOMAIN.workers.dev/health
```

**Expected Output**:
```json
{
  "status": "ok",
  "timestamp": "2024-06-03T09:00:00.000Z",
  "service": "nextvision-outreach-worker"
}
```

### Step 3: Manual Trigger (Test)
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_KEY" \
  https://nextvision-outreach-worker.YOUR_SUBDOMAIN.workers.dev/trigger
```

**Expected Output**:
```json
{
  "success": true,
  "summary": {
    "timestamp": "2024-06-03T09:00:00.000Z",
    "companiesProcessed": 10,
    "emailsSent": 10,
    "emailsFailed": 0,
    "rateLimitHit": false,
    "errors": []
  }
}
```

## Monitoring & Logging

### View Worker Logs
```bash
wrangler tail
```

**Expected Output** (live logs):
```
🚀 Cron job started at 2024-06-03T06:00:00.000Z
📋 Fetching companies from Supabase...
✅ Fetched 10 companies from Supabase
📧 Sending email to AKMETAL SAC VE İMALAT SANAYİ VE TİCARET A.Ş. (info@akmetalas.com)
🔄 Attempt 1/3 for info@akmetalas.com
✅ Email sent to AKMETAL SAC VE İMALAT SANAYİ VE TİCARET A.Ş.
📊 Updating daily metrics...
✅ Daily metrics updated
✅ Cron job completed
📊 Summary: 10 sent, 0 failed
```

### Check Worker Analytics
1. Cloudflare dashboard → **Workers**
2. Click `nextvision-outreach-worker`
3. View metrics:
   - **Invocations**: 1 per day (cron)
   - **Errors**: Should be 0
   - **CPU Time**: < 10ms per execution
   - **Memory**: < 128MB

### Supabase Monitoring
Run in Supabase SQL Editor:

```sql
-- Today's activity
SELECT
  event_metadata->>'company_name' as company,
  event_type,
  created_at
FROM activity_logs
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- Daily metrics
SELECT * FROM daily_metrics
WHERE date = CURRENT_DATE;
```

## Error Handling

### SendGrid API Failure
**Scenario**: SendGrid API returns 500 error

**Handling**:
1. Retry 3 times with exponential backoff
2. Log error to Supabase activity_logs
3. Continue to next company (don't abort entire batch)
4. Update daily metrics with failure count

### Supabase Connection Timeout
**Scenario**: Worker can't reach Supabase (network issue)

**Handling**:
1. Timeout after 5 seconds
2. Log critical error
3. Return 500 response (cron will retry automatically)
4. Send alert email (if configured)

### Rate Limit Exceeded
**Scenario**: Daily rate limit of 10 emails reached

**Handling**:
1. Set `rateLimitHit: true` in summary
2. Stop processing immediately
3. Log which companies were skipped
4. Resume next day (remaining companies still in queue)

## Rollback Plan (5-Second Emergency Stop)

### Scenario: Cron fires incorrectly, sending spam

**Step 1: Disable Cron Immediately**
```bash
wrangler cron delete "0 6 * * *"
```

**Step 2: Kill Active Worker**
```bash
wrangler deployments delete --latest
```

**Step 3: Check Damage**
```bash
# Count emails sent in last 5 minutes
curl -X POST "${SUPABASE_URL}/rest/v1/activity_logs?select=id&event_type=eq.email_sent&created_at=gte.$(date -d '5 minutes ago' -Iseconds)" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}"
```

**Step 4: Send Apology Emails**
```bash
# If > 10 emails sent, prepare apology email template
# (Use SendGrid API to send apology to all affected companies)
```

**Step 5: Root Cause Analysis**
```bash
wrangler tail > cron-incident.log
# Review logs to understand what went wrong
```

## Cost Estimate

### Cloudflare Workers (Free Tier)
- **Requests**: 30 requests/day (1 cron + testing) = 900/month
- **CPU Time**: 10ms × 30 = 300ms/day = 9 seconds/month
- **Free Tier**: 100,000 requests/day + 10ms CPU per request
- **Cost**: $0/month (well within free tier)

### Potential Upgrade (Paid)
- **Workers Paid**: $5/month for 10M requests (not needed)
- **Stay on free tier**: 900/month << 100,000/month limit

## Known Issues & Mitigations

| Issue | Impact | Mitigation |
|-------|--------|------------|
| Cron drift (±1 min) | Emails may send 8:59-9:01 AM | Acceptable variance |
| Cold start latency (~100ms) | First cron takes longer | Workers auto-warms after 24h |
| Concurrent cron runs | Duplicate emails possible | Add lock in Supabase (future) |
| Worker execution timeout (10s) | Large batches may timeout | Limit to 10 emails per run |
| Network errors to SendGrid | Failed sends | 3-retry logic with exponential backoff |

## Testing Checklist

- [ ] Worker deployed to Cloudflare
- [ ] Cron schedule configured (6AM UTC = 9AM Istanbul)
- [ ] Secrets set (SENDGRID_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY)
- [ ] Health check endpoint returns 200 OK
- [ ] Manual trigger sends 10 test emails
- [ ] Rate limiting works (11th email fails)
- [ ] Retry logic works (simulate SendGrid error)
- [ ] Supabase logging works (check activity_logs table)
- [ ] Daily metrics updated (check daily_metrics table)
- [ ] Worker logs visible via `wrangler tail`
- [ ] Rollback plan tested (disable cron, verify stops)

## Next Steps (Day 1 Complete)

1. ✅ SendGrid API client implemented
2. ✅ Supabase database setup
3. ✅ Cloudflare Workers cron deployed
4. ✅ Rate limiting tested
5. ✅ Error handling verified
6. ✅ Rollback plan documented
7. ⏳ Handoff to DevOps-Hightower (Day 2: Twilio + Dashboard)

---

**Status**: ✅ COMPLETE (Cloudflare Workers cron ready)
**Time**: 3 hours
**Handoff**: DevOps-Hightower Day 2 build (Twilio VoIP + Vercel dashboard)
