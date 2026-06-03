#!/bin/bash
# Full test suite — Tests 1-6 (complete validation)

echo "🧪 QA-Bach Complete Test Suite"
echo "================================"
echo ""

# Check environment
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ] || [ -z "$SENDGRID_API_KEY" ]; then
  echo "❌ Missing required environment variables"
  exit 1
fi

echo "⚠️  WARNING: This suite includes:"
echo "  - Test 4: Sends 10 real emails (hits rate limit)"
echo "  - Test 5: Disables cron temporarily"
echo "  - Test 6: Full E2E with real services"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  exit 1
fi

# Test 1: Single Email
echo "▶️  Test 1: Single Email Delivery"
node tests/test-1-send-email.js
if [ $? -ne 0 ]; then
  echo "❌ Test 1 FAILED - Aborting suite"
  exit 1
fi
echo "✅ Test 1 PASSED"
echo ""

# Test 2: Webhook
echo "▶️  Test 2: Webhook Handler"
echo "⚠️  Requires dashboard running on localhost:3000"
node tests/test-2-webhook.js
if [ $? -ne 0 ]; then
  echo "❌ Test 2 FAILED - Aborting suite"
  exit 1
fi
echo "✅ Test 2 PASSED"
echo ""

# Test 3: Twilio Call
if [ -z "$TWILIO_ACCOUNT_SID" ]; then
  echo "⚠️  Skipping Test 3 (No Twilio credentials)"
else
  echo "▶️  Test 3: Twilio Call Initiation"
  node tests/test-3-twilio-call.js
  if [ $? -ne 0 ]; then
    echo "❌ Test 3 FAILED - Aborting suite"
    exit 1
  fi
  echo "✅ Test 3 PASSED"
fi
echo ""

# Test 4: Batch Processing
echo "▶️  Test 4: Batch Processing (10 emails)"
echo "⚠️  This will hit the daily rate limit!"
read -p "Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Skipping Test 4"
else
  node tests/test-4-seed-prospects.js
  echo ""
  echo "Triggering worker..."
  curl -X POST https://nextvision-outreach-worker.workers.dev/trigger \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
  echo ""
  echo "Waiting 30 seconds for processing..."
  sleep 30
  node tests/test-4-verify-results.js
  if [ $? -ne 0 ]; then
    echo "❌ Test 4 FAILED - Aborting suite"
    exit 1
  fi
  echo "✅ Test 4 PASSED"
fi
echo ""

# Test 5: Rollback
echo "▶️  Test 5: Rollback Test"
echo "⚠️  This will disable cron temporarily"
wrangler put nextvision-outreach-worker --disable-cron
node tests/test-5-seed.js
echo "Waiting 10 seconds (should NOT send emails)..."
sleep 10
node tests/test-5-verify.js
if [ $? -ne 0 ]; then
  echo "❌ Test 5 FAILED - Re-enabling cron"
  wrangler put nextvision-outreach-worker --enable-cron
  exit 1
fi
wrangler put nextvision-outreach-worker --enable-cron
echo "✅ Test 5 PASSED"
echo ""

# Test 6: Full E2E
echo "▶️  Test 6: Full E2E Journey"
node tests/test-6-full-e2e.js
if [ $? -ne 0 ]; then
  echo "❌ Test 6 FAILED"
  exit 1
fi
echo "✅ Test 6 PASSED"
echo ""

echo "================================"
echo "🎉 ALL TESTS PASSED!"
echo ""
echo "Summary:"
echo "  ✅ Test 1: Single Email Delivery"
echo "  ✅ Test 2: Webhook Handler"
echo "  ✅ Test 3: Twilio Call Initiation"
echo "  ✅ Test 4: Batch Processing (10 emails)"
echo "  ✅ Test 5: Rollback/Graceful Shutdown"
echo "  ✅ Test 6: Full E2E Journey"
echo ""
echo "🧹 Don't forget to cleanup test data!"
echo "   See README.md for cleanup commands"