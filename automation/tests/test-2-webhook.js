// /home/tolgabrk/projects/Auto-Company/automation/tests/test-2-webhook.js
const http = require('http');

const webhookUrl = 'http://localhost:3000/api/webhooks/sendgrid'; // Adjust for deployment

async function testWebhook() {
  console.log('🧪 TEST 2: SendGrid Webhook Handler\n');

  // 1. Create test prospect first
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const testProspect = {
    company_name: 'Webhook Test Company',
    contact_email: 'webhook-test@example.com',
    status: 'contacted',
    email_sent: true
  };

  const { data: prospect } = await supabase
    .from('prospects')
    .insert([testProspect])
    .select()
    .single();

  console.log(`✅ Test prospect created: ${prospect.id}`);

  // 2. Test delivery event
  console.log('📤 Testing delivery event...');
  const deliveryEvent = [{
    email: 'webhook-test@example.com',
    event: 'delivered',
    sg_event_id: 'delivered_test_123',
    timestamp: Math.floor(Date.now() / 1000),
    'X-Message-ID': 'msg-test-123'
  }];

  const deliveryResult = await sendWebhookEvent(deliveryEvent);
  console.log('Delivery event response:', deliveryResult);

  await new Promise(resolve => setTimeout(resolve, 1000));

  // 3. Verify delivery recorded
  const { data: afterDelivery } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospect.id)
    .single();

  if (afterDelivery.email_status !== 'delivered') {
    console.error('❌ Delivery not recorded');
    console.log('Expected email_status=delivered, got:', afterDelivery.email_status);
    await supabase.from('prospects').delete().eq('id', prospect.id);
    return false;
  }

  console.log('✅ Delivery recorded correctly');
  console.log('   - email_status:', afterDelivery.email_status);
  console.log('   - email_delivered_at:', afterDelivery.email_delivered_at);

  // 4. Test bounce event
  console.log('📤 Testing bounce event...');
  const bounceEvent = [{
    email: 'webhook-test@example.com',
    event: 'bounce',
    sg_event_id: 'bounce_test_456',
    timestamp: Math.floor(Date.now() / 1000),
    reason: '550 5.4.5 Recipient address rejected: Invalid mailbox'
  }];

  const bounceResult = await sendWebhookEvent(bounceEvent);
  console.log('Bounce event response:', bounceResult);

  await new Promise(resolve => setTimeout(resolve, 1000));

  // 5. Verify bounce recorded
  const { data: afterBounce } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospect.id)
    .single();

  if (afterBounce.email_status !== 'bounced') {
    console.error('❌ Bounce not recorded');
    console.log('Expected email_status=bounced, got:', afterBounce.email_status);
    await supabase.from('prospects').delete().eq('id', prospect.id);
    return false;
  }

  console.log('✅ Bounce recorded correctly');
  console.log('   - email_status:', afterBounce.email_status);
  console.log('   - email_bounced_at:', afterBounce.email_bounced_at);
  console.log('   - email_bounce_reason:', afterBounce.email_bounce_reason);

  // 6. Cleanup
  await supabase.from('prospects').delete().eq('id', prospect.id);
  console.log('🧹 Cleanup complete');

  console.log('\n🎉 TEST 2 PASSED: Webhook processes events correctly');
  return true;
}

async function sendWebhookEvent(events) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(events);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/webhooks/sendgrid',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

testWebhook().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});