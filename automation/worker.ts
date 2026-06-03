// Cloudflare Worker — Bursa Automotive Outreach Automation
// Auto Company Cycle #37 — Day 1 Build
// Cron: Daily 9AM Istanbul (6AM UTC)

interface Env {
  SENDGRID_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ENVIRONMENT?: string;
  LOG_LEVEL?: string;
}

interface Company {
  id: string;
  company_name: string;
  tier: string;
  contact_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  status: string;
  phase: string;
  email_bounced?: boolean;
  email_suppressed?: boolean;
}

interface ExecutionSummary {
  timestamp: string;
  companiesProcessed: number;
  emailsSent: number;
  emailsFailed: number;
  rateLimitHit: boolean;
  errors: string[];
}

interface SendEmailParams {
  to: string;
  contactName?: string;
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

export default {
  // Scheduled cron job
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    console.log(`🚀 Cron job started at ${new Date().toISOString()}`);

    const summary: ExecutionSummary = {
      timestamp: new Date().toISOString(),
      companiesProcessed: 0,
      emailsSent: 0,
      emailsFailed: 0,
      rateLimitHit: false,
      errors: []
    };

    try {
      // Step 1: Fetch companies to contact
      console.log(`📋 Fetching companies from Supabase...`);
      const companies = await fetchCompanies(env);

      if (companies.length === 0) {
        console.log(`✅ No companies to contact (all contacted or rate limited)`);
        return new Response(JSON.stringify({
          success: true,
          message: 'No companies to contact',
          summary
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log(`📋 Found ${companies.length} companies to contact`);

      // Step 2: Send emails to each company
      for (const company of companies) {
        if (!company.contact_email) {
          console.log(`⚠️  Skipping ${company.company_name} (no email)`);
          summary.errors.push(`${company.company_name}: No email address`);
          continue;
        }

        if (company.email_bounced) {
          console.log(`⚠️  Skipping ${company.company_name} (email bounced previously)`);
          summary.errors.push(`${company.company_name}: Email bounced previously`);
          continue;
        }

        if (company.email_suppressed) {
          console.log(`⚠️  Skipping ${company.company_name} (email suppressed)`);
          summary.errors.push(`${company.company_name}: Email suppressed`);
          continue;
        }

        console.log(`📧 Sending email to ${company.company_name} (${company.contact_email})`);

        // Select template based on company tier
        const templateId = company.tier === 'tier-1' ? 'a' : 'b';

        // Send email (with retry logic)
        const result = await sendEmailWithRetry(
          {
            to: company.contact_email,
            contactName: company.contact_name || undefined,
            companyName: company.company_name,
            contactPhone: company.contact_phone || undefined,
            templateId
          },
          env,
          3  // Max 3 retries
        );

        summary.companiesProcessed++;

        if (result.success) {
          summary.emailsSent++;
          console.log(`✅ Email sent to ${company.company_name}`);

          // Update prospect status
          await updateProspectStatus(env, company.id, {
            email_sent: true,
            status: 'contacted',
            last_contacted: new Date().toISOString()
          });
        } else {
          summary.emailsFailed++;
          const errorMsg = result.error || 'Unknown error';

          if (result.rateLimited) {
            summary.rateLimitHit = true;
            console.log(`⚠️  Rate limit reached, stopping...`);
            summary.errors.push(`Rate limit reached: ${errorMsg}`);
            break;  // Stop processing if rate limited
          }

          console.log(`❌ Failed to send to ${company.company_name}: ${errorMsg}`);
          summary.errors.push(`${company.company_name}: ${errorMsg}`);
        }

        // Small delay between emails (500ms) to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 3: Update daily metrics
      console.log(`📊 Updating daily metrics...`);
      await updateDailyMetrics(env, summary);

      console.log(`✅ Cron job completed`);
      console.log(`📊 Summary: ${summary.emailsSent} sent, ${summary.emailsFailed} failed`);

      return new Response(JSON.stringify({
        success: true,
        summary
      }), {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Cron job failed: ${errorMsg}`);
      summary.errors.push(`Fatal error: ${errorMsg}`);

      // Log to Supabase
      await logAutomationError(env, 'cron_execution', errorMsg);

      return new Response(JSON.stringify({
        success: false,
        error: errorMsg,
        summary
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  // HTTP endpoint for manual testing
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'nextvision-outreach-worker'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/trigger' && request.method === 'POST') {
      // Manual trigger for testing (requires auth header)
      const authHeader = request.headers.get('Authorization');
      if (authHeader !== `Bearer ${env.SUPABASE_SERVICE_KEY}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Trigger cron manually (cast request to ScheduledEvent for compatibility)
      const scheduledEvent = request as unknown as ScheduledEvent;
      return await scheduled(scheduledEvent, env, ctx);
    }

    return new Response('Not found', { status: 404 });
  }
};

async function fetchCompanies(env: Env): Promise<Company[]> {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/prospects?select=id,company_name,tier,contact_email,contact_name,contact_phone,status,phase,email_bounced,email_suppressed&status=eq.cold&phase=eq.Phase%201&email_bounced=is.false&email_suppressed=is.false&order=tier.asc&limit=10`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.status}`);
    }

    const companies = await response.json();
    console.log(`✅ Fetched ${companies.length} companies from Supabase`);

    return companies;
  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    throw error;
  }
}

async function sendEmailWithRetry(
  params: SendEmailParams,
  env: Env,
  maxRetries: number
): Promise<SendResult> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${params.to}`);

    const result = await sendEmailDirect(params, env);

    if (result.success) {
      return result;
    }

    lastError = result.error;

    if (result.rateLimited) {
      return result;  // Don't retry if rate limited
    }

    // Wait before retry (exponential backoff: 1s, 2s, 4s)
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`
  };
}

async function sendEmailDirect(params: SendEmailParams, env: Env): Promise<SendResult> {
  const { to, contactName, companyName, contactPhone, templateId = 'a' } = params;

  try {
    // Check rate limit (max 10 emails per day total)
    const todayEmails = await getTodayEmailCount(env);
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
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
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
      await logEmailSent(env, to, templateId, messageId, companyName);
      console.log(`Email sent successfully to ${to}, Message ID: ${messageId}`);
      return {
        success: true,
        messageId: messageId || undefined
      };
    } else {
      const error = await response.text();
      await logEmailError(env, to, error, companyName);
      console.error(`SendGrid API error for ${to}: ${response.status} - ${error}`);
      return {
        success: false,
        error: `SendGrid API error: ${response.status} ${error}`
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailError(env, to, errorMsg, companyName);
    console.error(`Exception sending email to ${to}:`, errorMsg);
    return {
      success: false,
      error: errorMsg
    };
  }
}

async function getTodayEmailCount(env: Env): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/activity_logs?select=id&event_type=eq.email_sent&created_at=gte.${today}`, {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
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
  // Simplified templates (production would use full HTML)
  const templates: Record<string, { subject: string; body: string }> = {
    'a': {
      subject: 'Bursa Otomotiv — İş Güvenliği Benchmark Raporu',
      body: '<p>Merhaba {contact_name},</p><p>Bursa''daki 40+ otomotiv tedarikçisinin iş güvenliği verilerini analiz ediyoruz. {company_name} için 5 dakikalık demo ister misiniz?</p>'
    },
    'b': {
      subject: 'Bursa Otomotiv — İSG Uzmanları Arasında Benchmark Raporu',
      body: '<p>Merhaba {contact_name},</p><p>Anonim benchmark raporuna katılmak ister misiniz? {company_name} için demo planlayın.</p>'
    },
    'c': {
      subject: 'Bursa Otomotiv — İş Güvenliği Denetim Hazırlığı',
      body: '<p>Merhaba {contact_name},</p><p>Yaklaşan denetimlere hazırlanın. {company_name} için analiz demo.</p>'
    }
  };
  return templates[templateId] || templates['a'];
}

async function logEmailSent(env: Env, to: string, templateId: string, messageId: string | undefined, companyName: string) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
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

async function logEmailError(env: Env, to: string, error: string, companyName: string) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
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

async function updateProspectStatus(
  env: Env,
  prospectId: string,
  updates: Record<string, any>
): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/prospects?id=eq.${prospectId}`, {
      method: 'PATCH',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('❌ Error updating prospect status:', error);
  }
}

async function updateDailyMetrics(
  env: Env,
  summary: ExecutionSummary
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if metrics exist for today
    const existing = await fetch(
      `${env.SUPABASE_URL}/rest/v1/daily_metrics?date=eq.${today}`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
        }
      }
    );

    if (existing.ok && (await existing.json()).length > 0) {
      // Update existing metrics
      await fetch(`${env.SUPABASE_URL}/rest/v1/daily_metrics?date=eq.${today}`, {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails_sent: summary.emailsSent
        })
      });
    } else {
      // Insert new metrics
      await fetch(`${env.SUPABASE_URL}/rest/v1/daily_metrics`, {
        method: 'POST',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: today,
          emails_sent: summary.emailsSent,
          emails_delivered: 0,
          emails_opened: 0,
          emails_replied: 0,
          calls_made: 0,
          calls_connected: 0,
          voicemails_left: 0,
          demos_booked: 0,
          pilots_converted: 0
        })
      });
    }

    console.log(`✅ Daily metrics updated`);
  } catch (error) {
    console.error('❌ Error updating daily metrics:', error);
  }
}

async function logAutomationError(
  env: Env,
  context: string,
  error: string
): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/activity_logs`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'automation_error',
        event_metadata: {
          context,
          error,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (err) {
    console.error('❌ Error logging automation error:', err);
  }
}
