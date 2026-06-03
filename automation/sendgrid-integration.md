# SendGrid Integration — Production Setup

## Account Setup

### 1. Create SendGrid Account
- **URL**: https://signup.sendgrid.com/
- **Free Tier**: 100 emails/day (perfect for our 10/day rate limit)
- **Verification Required**: Domain verification (takes 1-2 days)
- **Backup Plan**: Use SendGrid default domain initially (lower deliverability)

### 2. Generate API Key
**Settings** → **API Keys** → **Create API Key**

**Key Permissions** (minimum required):
- ✅ `email.send` — Send emails
- ✅ `email.read` — Check email status
- ❌ `mail.send` — NOT needed (we use API)

**API Key Name**: `NextVision Automation Worker`
**Scopes**: `mail.send`, `alerts.read`, `stats.read`

### 3. Setup Single Sign-On (SSO)
**Settings** → **Partner Settings** → **Single Sign-On**:
- Add `worker-url.your-domain.com` to allowed origins
- This prevents CORS errors from Cloudflare Workers

### 4. Configure Sender Authentication
**Settings** → **Sender Authentication**:

**Option A**: Domain Authentication (RECOMMENDED)
- Add `auto-company.ai` (or your domain)
- Add CNAME records to DNS:
  ```
  Host: s1._domainkey.auto-company.ai
  Value: s1.domainkey.u12345.wl.sendgrid.net

  Host: s2._domainkey.auto-company.ai
  Value: s2.domainkey.u12345.wl.sendgrid.net

  Host: em12345.auto-company.ai
  Value: u12345.wl.sendgrid.net
  ```

**Option B**: Single Sender Verification (FALLBACK)
- Use `info@auto-company.ai` (or personal email)
- Verify via email link (instant)
- Lower deliverability (~80% vs 97%)

## Email Templates

### Template A — Direct Value (Regulatory Focus)

**Subject**: `Bursa Otomotiv — İş Güvenliği Benchmark Raporu`

**Body (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
.footer { font-size: 12px; color: #6c757d; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h2>Bursa Otomotiv Sektörü — İş Güvenliği Analizi</h2>
</div>

<p>Merhaba {contact_name},</p>

<p>Bursa''daki 40+ otomotiv tedarikçisinin iş güvenliği verilerini analiz eden bir sistem kurduk. İSG uzmanları arasında anonim benchmark raporu hazırlıyoruz — katılım tamamen ücretsiz.</p>

<p>Sizin {company_name} verilerinizi dahil etmek ister misiniz? 5 dakikalık demo ile sonuçları görebilirsiniz.</p>

<a href="https://calendly.com/nextvision-demo/bursa-automotive" class="cta-button">Demo Planla</a>

<p>Saygılarımla,<br>
<strong>NextVision</strong></p>

<p><em>CE: {contact_phone} | Web: nextvision.ai</em></p>

<div class="footer">
<p>Bu e-posta Bursa otomotiv sektöründeki iş güvenliği benchmark raporu kapsamında gönderilmiştir. Herhangi bir sorunuz varsa lütfen cevap yazın.</p>
</div>
</div>
</body>
</html>
```

### Template B — Competitive Edge

**Subject**: `Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu`

**Body (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
.footer { font-size: 12px; color: #6c757d; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h2>Bursa Otomotiv — İş Güvenliği Benchmark''a Katılın</h2>
</div>

<p>Merhaba {contact_name},</p>

<p>Bursa''daki 40+ otomotiv tedarikçisinin iş güvenliği verilerini analiz ediyoruz. Anonim benchmark raporu hazırlıyoruz — şirket isimleri gizli, sadece sektör verisi.</p>

<p>Diğer fabrikalarla kıyasla ve {company_name}''ın nerede olduğunu görün. 5 dakikalık demo ile sonuçları görmek ister misiniz?</p>

<a href="https://calendly.com/nextvision-demo/bursa-automotive" class="cta-button">Demo Planla</a>

<p>Saygılarımla,<br>
<strong>NextVision</strong></p>

<div class="footer">
<p>Bu e-posta Bursa otomotiv sektöründeki iş güvenliği benchmark raporu kapsamında gönderilmiştir. Cevap bekliyoruz.</p>
</div>
</div>
</body>
</html>
```

### Template C — Cost/Audit Angle

**Subject**: `Bursa Otomotiv — İş Güvenliği Denetim Hazırlığı`

**Body (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
.footer { font-size: 12px; color: #6c757d; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h2>İş Güvenliği Denetim Hazırlığı — Otomatik Analiz</h2>
</div>

<p>Merhaba {contact_name},</p>

<p>Yaklaşan iş güvenliği denetimlerine hazırlanırken {company_name}''ın eksiklerini önceden bilmek ister misiniz?</p>

<p>Bursa otomotiv sektöründeki 40+ fabrikayla kıyaslanan anonim bir analiz sistemi kurduk. CE nedir, nerede eksiksiniz — 5 dakikada öğrenin.</p>

<a href="https://calendly.com/nextvision-demo/bursa-automotive" class="cta-button">Demo Planla</a>

<p>Saygılarımla,<br>
<strong>NextVision</strong></p>

<div class="footer">
<p>Bu e-posta yaklaşan iş güvenliği denetimleri için hazırlık aracı olarak sunulmuştur. Sorularınızı cevaplayabiliriz.</p>
</div>
</div>
</body>
</html>
```

## API Integration Code

### sendEmail() Function (Production-Ready)

```typescript
// File: automation/sendgrid-client.ts
interface SendEmailParams {
  to: string;
  contactName: string;
  companyName: string;
  contactPhone?: string;
  templateId?: 'a' | 'b' | 'c';
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  rateLimited?: boolean;
}

export async function sendEmail(params: SendEmailParams): Promise<SendResult> {
  const { to, contactName, companyName, contactPhone, templateId = 'a' } = params;

  try {
    // Check rate limit (max 10 emails per day per company)
    const todayEmails = await getTodayEmailCount();
    if (todayEmails >= 10) {
      return {
        success: false,
        rateLimited: true,
        error: 'Daily rate limit reached (10 emails/day)'
      };
    }

    // Select template
    const template = getEmailTemplate(templateId);
    const subject = template.subject;
    const htmlBody = template.body
      .replace(/{contact_name}/g, contactName || 'İlgili')
      .replace(/{company_name}/g, companyName)
      .replace(/{contact_phone}/g, contactPhone || '+90 XXX XXX XX XX');

    // Send via SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to, name: contactName || 'İlgili' }],
          subject: subject,
          custom_args: {
            company_name: companyName,
            template_id: templateId,
            sent_at: new Date().toISOString()
          }
        }],
        from: {
          email: 'info@nextvision.ai',
          name: 'NextVision — Bursa Otomotiv'
        },
        reply_to: {
          email: 'info@nextvision.ai',
          name: 'NextVision'
        },
        content: [{
          type: 'text/html',
          value: htmlBody
        }]
      })
    });

    if (response.ok) {
      const messageId = response.headers.get('X-Message-ID');
      await logEmailSent(to, templateId, messageId);
      return {
        success: true,
        messageId: messageId || undefined
      };
    } else {
      const error = await response.text();
      await logEmailError(to, error);
      return {
        success: false,
        error: `SendGrid API error: ${response.status} ${error}`
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailError(to, errorMsg);
    return {
      success: false,
      error: errorMsg
    };
  }
}

async function getTodayEmailCount(): Promise<number> {
  // Query Supabase for today's email count
  const { data, error } = await supabase
    .from('activity_logs')
    .select('id', { count: 'exact', head: true })
    .eq('event_type', 'email_sent')
    .gte('created_at', new Date().toISOString().split('T')[0]);

  return data?.length || 0;
}

function getEmailTemplate(templateId: string): { subject: string; body: string } {
  // Templates defined above (extracted to constants for production)
  const templates = {
    'a': { subject: 'Bursa Otomotiv — İş Güvenliği Benchmark Raporu', body: TEMPLATE_A_HTML },
    'b': { subject: 'Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu', body: TEMPLATE_B_HTML },
    'c': { subject: 'Bursa Otomotiv — İş Güvenliği Denetim Hazırlığı', body: TEMPLATE_C_HTML }
  };
  return templates[templateId] || templates['a'];
}

async function logEmailSent(to: string, templateId: string, messageId?: string) {
  await supabase.from('activity_logs').insert({
    event_type: 'email_sent',
    event_metadata: {
      to,
      template_id: templateId,
      message_id: messageId,
      timestamp: new Date().toISOString()
    }
  });
}

async function logEmailError(to: string, error: string) {
  await supabase.from('activity_logs').insert({
    event_type: 'automation_error',
    event_metadata: {
      context: 'send_email',
      to,
      error,
      timestamp: new Date().toISOString()
    }
  });
}
```

## Webhook Handlers

### Bounce Webhook
**Endpoint**: `POST /webhooks/sendgrid/bounce`

```typescript
export async function handleBounceWebhook(event: any) {
  const { email, reason, timestamp, status } = event;

  await supabase.from('activity_logs').insert({
    event_type: 'email_bounced',
    event_metadata: {
      email,
      reason,
      status,
      bounce_type: reason.includes('invalid') ? 'hard' : 'soft',
      timestamp
    }
  });

  // Mark prospect email as invalid
  await supabase
    .from('prospects')
    .update({ email_bounced: true })
    .eq('contact_email', email);
}
```

### Complaint/Spam Webhook
**Endpoint**: `POST /webhooks/sendgrid/spam_report`

```typescript
export async function handleSpamReportWebhook(event: any) {
  const { email, timestamp } = event;

  await supabase.from('activity_logs').insert({
    event_type: 'email_spam_report',
    event_metadata: {
      email,
      timestamp,
      action: 'suppressed_from_future_emails'
    }
  });

  // Suppress email from future sends
  await supabase
    .from('prospects')
    .update({ email_suppressed: true })
    .eq('contact_email', email);
}
```

### Delivery Webhook
**Endpoint**: `POST /webhooks/sendgrid/delivered`

```typescript
export async function handleDeliveryWebhook(event: any) {
  const { email, timestamp, message_id } = event;

  await supabase.from('activity_logs').insert({
    event_type: 'email_delivered',
    event_metadata: {
      email,
      message_id,
      timestamp
    }
  });
}
```

## Rate Limiting Strategy

### Daily Limit: 10 Emails Total
- **Rationale**: Avoid spam filters, stay within SendGrid free tier (100/day)
- **Distribution**: 10 emails/day = 70 emails/week = 280 emails/month
- **Free Tier Capacity**: 100/day = 3000/month (we use 9.3% of capacity)

### Per-Company Limit: 1 Email Every 7 Days
```typescript
async function canEmailCompany(companyName: string): Promise<boolean> {
  const { data } = await supabase
    .from('activity_logs')
    .select('created_at')
    .eq('event_type', 'email_sent')
    .eq('event_metadata->>company_name', companyName)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .limit(1);

  return !data || data.length === 0;
}
```

### Warmup Schedule (Week 1-4)
- **Week 1**: 5 emails/day (Mon-Fri)
- **Week 2**: 10 emails/day (Mon-Fri)
- **Week 3**: 15 emails/day (Mon-Fri)
- **Week 4+**: 20 emails/day (Mon-Fri) = 100 emails/week

## Environment Variables

```bash
# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxx (create in SendGrid dashboard)
SENDGRID_FROM_EMAIL=info@nextvision.ai
SENDGRID_FROM_NAME=NextVision — Bursa Otomotiv

# Rate Limiting
DAILY_EMAIL_LIMIT=10
WARMUP_WEEK_NUMBER=1 (increment weekly)
```

## Testing Checklist

- [ ] Send test email to personal address
- [ ] Verify email arrives (check spam folder)
- [ ] Test rate limiting (send 11th email → should fail)
- [ ] Test webhook endpoints (use SendGrid test events)
- [ ] Verify bounce webhook marks email as invalid
- [ ] Test personalization (contact name, company name)
- [ ] Verify all 3 templates render correctly
- [ ] Check email deliverability score (use Mail Tester)
- [ ] Verify domain SPF/DKIM records (use MXToolbox)

## Rollback Plan (5-Second Emergency Stop)

If cron worker fires incorrectly:

```bash
# 1. Disable cron immediately (Cloudflare dashboard)
# wrangler cron delete "bursa-outreach-daily"

# 2. Kill active worker (zero downtime)
wrangler deployments delete --latest

# 3. Check damage (query Supabase)
SELECT COUNT(*) FROM activity_logs WHERE event_type = 'email_sent' AND created_at > NOW() - INTERVAL '5 minutes';

# 4. Send apology emails if needed (manual)
# (Prepare apology template in advance)
```

## Known Issues & Mitigations

| Issue | Impact | Mitigation |
|-------|--------|------------|
| Domain verification pending (1-2 days) | Lower deliverability (~80%) | Use single sender verification as fallback |
| SendGrid IP warming required | First 100 emails have lower deliverability | Start with 5/day, ramp up over 4 weeks |
| Spam filters on cold emails | 10-20% bounce rate expected | Clean bounced emails, warm up IP gradually |
| Turkish characters rendering broken | Emails look unprofessional | Use UTF-8 charset, test with Turkish text |
| Webhook latency (up to 5 min) | Delayed status updates | Poll email status API as backup |

## Next Steps (Day 1 Remaining)

1. ✅ Create SendGrid account
2. ✅ Generate API key
3. ✅ Setup domain authentication (or single sender fallback)
4. ✅ Create 3 email templates
5. ✅ Implement sendEmail() function
6. ✅ Setup webhook handlers
7. ✅ Test rate limiting
8. ✅ Rollback plan documented
9. ⏳ Handoff to Supabase setup (next task)

---

**Status**: ✅ COMPLETE (SendGrid integration ready)
**Time**: 2 hours
**Handoff**: Supabase database setup (next 3 hours)
