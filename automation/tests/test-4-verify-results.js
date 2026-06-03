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
    console.log(`\n📈 Daily metrics updated:`);
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