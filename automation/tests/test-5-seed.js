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