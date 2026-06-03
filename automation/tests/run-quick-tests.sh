#!/bin/bash
# Quick test suite — Tests 1-3 (low risk, fast feedback)

echo "🧪 QA-Bach Quick Test Suite"
echo "============================"
echo ""

# Check environment
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ] || [ -z "$SENDGRID_API_KEY" ]; then
  echo "❌ Missing required environment variables:"
  echo "   SUPABASE_URL"
  echo "   SUPABASE_SERVICE_KEY"
  echo "   SENDGRID_API_KEY"
  exit 1
fi

echo "✅ Environment configured"
echo ""

# Test 1: Single Email
echo "▶️  Test 1: Single Email Delivery"
node tests/test-1-send-email.js
TEST1=$?

if [ $TEST1 -eq 0 ]; then
  echo "✅ Test 1 PASSED"
else
  echo "❌ Test 1 FAILED"
  exit 1
fi

echo ""
echo "============================"
echo ""

# Test 2: Webhook
echo "▶️  Test 2: Webhook Handler"
echo "⚠️  Requires dashboard running on localhost:3000"
echo "   Start with: cd automation/dashboard && npm run dev"
read -p "Press Enter to continue..."
node tests/test-2-webhook.js
TEST2=$?

if [ $TEST2 -eq 0 ]; then
  echo "✅ Test 2 PASSED"
else
  echo "❌ Test 2 FAILED"
  exit 1
fi

echo ""
echo "============================"
echo ""

# Test 3: Twilio Call
if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TEST_PHONE_NUMBER" ]; then
  echo "⚠️  Skipping Test 3 (Missing Twilio credentials)"
  echo "   Set: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TEST_PHONE_NUMBER"
else
  echo "▶️  Test 3: Twilio Call Initiation"
  node tests/test-3-twilio-call.js
  TEST3=$?

  if [ $TEST3 -eq 0 ]; then
    echo "✅ Test 3 PASSED"
  else
    echo "❌ Test 3 FAILED"
    exit 1
  fi
fi

echo ""
echo "============================"
echo "🎉 Quick Suite Complete!"
echo ""
echo "Next steps:"
echo "  - Run full suite: ./run-all-tests.sh"
echo "  - Review logs: wrangler tail nextvision-outreach-worker"
echo "  - Check dashboard: http://localhost:3000"