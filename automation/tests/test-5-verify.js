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