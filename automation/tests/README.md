# QA-Bach Verification Suite — Quick Start

**Complete test suite for Auto Company outreach automation infrastructure**

## Setup

```bash
# Install dependencies
cd /home/tolgabrk/projects/Auto-Company/automation
npm install @supabase/supabase-js twilio

# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-key"
export SENDGRID_API_KEY="your-sendgrid-key"
export TWILIO_ACCOUNT_SID="your-sid"
export TWILIO_AUTH_TOKEN="your-token"
export TWILIO_PHONE_NUMBER="+1XXX"
```

## Run All Tests

```bash
# Quick test (Tests 1-3, skips rate limit)
./run-quick-tests.sh

# Full suite (including rate limit test)
./run-all-tests.sh

# Individual tests
node tests/test-1-send-email.js
node tests/test-2-webhook.js  # Requires dashboard running on localhost:3000
node tests/test-3-twilio-call.js
```

## Test Summary

| Test | Purpose | Duration | Risk |
|------|---------|----------|------|
| 1 | Single email delivery | 2min | Low |
| 2 | Webhook event processing | 30s | Low |
| 3 | Twilio call initiation | 1min | Medium |
| 4 | Batch processing (10 emails) | 5min | High |
| 5 | Rollback/graceful shutdown | 2min | Low |
| 6 | Full E2E journey | 10min | Medium |

## Cleanup

```bash
# Delete test data
curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=like.Test%20Company%" \
  -H "apikey: $SUPABASE_SERVICE_KEY"

curl -X DELETE "$SUPABASE_URL/rest/v1/prospects?company_name=like.E2E%20Test%" \
  -H "apikey: $SUPABASE_SERVICE_KEY"
```

**Full documentation:** See `qa-suite.md`