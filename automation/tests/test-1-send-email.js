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