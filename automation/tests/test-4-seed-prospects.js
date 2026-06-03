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