// SendGrid Email Client — Production-Ready Implementation
// Auto Company Cycle #37 — Day 1 Build

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

// Email templates (HTML)
const TEMPLATE_A_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
.footer { font-size: 12px; color: #6c757d; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; }
</style>
</head>
<body>
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
</body>
</html>`;

const TEMPLATE_B_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
.footer { font-size: 12px; color: #6c757d; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; }
</style>
</head>
<body>
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
</body>
</html>`;

const TEMPLATE_C_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.cta-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
.footer { font-size: 12px; color: #6c757d; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; }
</style>
</head>
<body>
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
</body>
</html>`;

// Environment variables (set in Cloudflare Workers)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

export async function sendEmail(params: SendEmailParams): Promise<SendResult> {
  const { to, contactName, companyName, contactPhone, templateId = 'a' } = params;

  try {
    // Validate inputs
    if (!to || !companyName) {
      return {
        success: false,
        error: 'Missing required parameters: to and companyName'
      };
    }

    // Check rate limit (max 10 emails per day total)
    const todayEmails = await getTodayEmailCount();
    if (todayEmails >= 10) {
      console.log(`Rate limit reached: ${todayEmails}/10 emails sent today`);
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
    console.log(`Sending email to ${to} using template ${templateId}`);
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
      await logEmailSent(to, templateId, messageId, companyName);
      console.log(`Email sent successfully to ${to}, Message ID: ${messageId}`);
      return {
        success: true,
        messageId: messageId || undefined
      };
    } else {
      const error = await response.text();
      await logEmailError(to, error, companyName);
      console.error(`SendGrid API error for ${to}: ${response.status} - ${error}`);
      return {
        success: false,
        error: `SendGrid API error: ${response.status} ${error}`
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailError(to, errorMsg, companyName);
    console.error(`Exception sending email to ${to}:`, errorMsg);
    return {
      success: false,
      error: errorMsg
    };
  }
}

async function getTodayEmailCount(): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${SUPABASE_URL}/rest/v1/activity_logs?select=id&event_type=eq.email_sent&created_at=gte.${today}`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.length || 0;
    }
  } catch (error) {
    console.error('Error checking email count:', error);
  }
  return 0;
}

function getEmailTemplate(templateId: string): { subject: string; body: string } {
  const templates: Record<string, { subject: string; body: string }> = {
    'a': {
      subject: 'Bursa Otomotiv — İş Güvenliği Benchmark Raporu',
      body: TEMPLATE_A_HTML
    },
    'b': {
      subject: 'Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu',
      body: TEMPLATE_B_HTML
    },
    'c': {
      subject: 'Bursa Otomotiv — İş Güvenliği Denetim Hazırlığı',
      body: TEMPLATE_C_HTML
    }
  };
  return templates[templateId] || templates['a'];
}

async function logEmailSent(to: string, templateId: string, messageId: string | undefined, companyName: string) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'email_sent',
        event_metadata: {
          to,
          template_id: templateId,
          message_id: messageId,
          company_name: companyName,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Error logging email sent:', error);
  }
}

async function logEmailError(to: string, error: string, companyName: string) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'automation_error',
        event_metadata: {
          context: 'send_email',
          to,
          company_name: companyName,
          error,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Error logging email error:', error);
  }
}

// Webhook handlers for Cloudflare Worker
export async function handleBounceWebhook(event: any) {
  const { email, reason, timestamp, status } = event;

  console.log(`Bounce detected for ${email}: ${reason}`);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'email_bounced',
        event_metadata: {
          email,
          reason,
          status,
          bounce_type: reason?.includes('invalid') ? 'hard' : 'soft',
          timestamp
        }
      })
    });

    // Mark prospect email as invalid
    await fetch(`${SUPABASE_URL}/rest/v1/prospects?contact_email=eq.${email}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_bounced: true
      })
    });
  } catch (error) {
    console.error('Error handling bounce webhook:', error);
  }
}

export async function handleSpamReportWebhook(event: any) {
  const { email, timestamp } = event;

  console.log(`Spam report for ${email} — suppressing from future sends`);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'email_spam_report',
        event_metadata: {
          email,
          timestamp,
          action: 'suppressed_from_future_emails'
        }
      })
    });

    // Suppress email from future sends
    await fetch(`${SUPABASE_URL}/rest/v1/prospects?contact_email=eq.${email}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_suppressed: true
      })
    });
  } catch (error) {
    console.error('Error handling spam report webhook:', error);
  }
}

export async function handleDeliveryWebhook(event: any) {
  const { email, timestamp, message_id } = event;

  console.log(`Email delivered to ${email}, Message ID: ${message_id}`);

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'email_delivered',
        event_metadata: {
          email,
          message_id,
          timestamp
        }
      })
    });
  } catch (error) {
    console.error('Error handling delivery webhook:', error);
  }
}
