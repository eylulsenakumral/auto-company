#!/usr/bin/env npx tsx
// Supabase Prospects Import Script — EXECUTABLE
// Auto Company Cycle #37 — Day 1 Build
// Usage: npx tsx import-script.ts

import prospects from './import-prospects';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set');
  console.error('Create a .env file or export them before running this script');
  process.exit(1);
}

interface ImportResult {
  success: boolean;
  company: string;
  error?: string;
}

async function importProspects(): Promise<void> {
  console.log(`🚀 Starting import of ${prospects.length} prospects to Supabase...\n`);

  let imported = 0;
  let failed = 0;
  const results: ImportResult[] = [];

  for (const prospect of prospects) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/prospects`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prospect)
      });

      if (response.ok) {
        imported++;
        results.push({ success: true, company: prospect.company_name });
        console.log(`✅ ${prospect.company_name}`);
      } else {
        const error = await response.text();
        failed++;
        results.push({ success: false, company: prospect.company_name, error });
        console.error(`❌ ${prospect.company_name}: ${error}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      failed++;
      results.push({ success: false, company: prospect.company_name, error: errorMsg });
      console.error(`❌ ${prospect.company_name}: ${errorMsg}`);
    }

    // Small delay to avoid rate limiting (100ms)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`✅ Success: ${imported}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${prospects.length}`);

  if (failed > 0) {
    console.log(`\n❌ Failed Companies:`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.company}: ${r.error}`);
    });
  }

  // Verify import count
  console.log(`\n🔍 Verifying import...`);
  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/prospects?select=id&count=exact&head=true`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });

    if (verifyResponse.ok) {
      const count = verifyResponse.headers.get('content-range')?.split('/')[1];
      console.log(`✅ Database contains ${count} prospects (expected: ${imported})`);
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }

  console.log(`\n✅ Import complete!`);
}

// Run import
importProspects().catch(console.error);
