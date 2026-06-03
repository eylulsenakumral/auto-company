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