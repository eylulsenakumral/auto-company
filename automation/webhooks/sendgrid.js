/**
 * SendGrid Webhook Handler
 *
 * Events: delivered, open, click, bounce, spam_report
 * Updates: Supabase outreach_log table
 * Alerts: Bounce/spam investigations
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Verify SendGrid webhook signature
 */
const verifyWebhook = (signature, timestamp, payload) => {
  // TODO: Implement signature verification
  // For now, accept all events (add security in production)
  return true;
};

/**
 * Parse SendGrid event
 */
const parseEvent = (event) => {
  return {
    sg_event_id: event.sg_event_id,
    email: event.email,
    event_type: event.event,
    prospect_email: event.email,
    timestamp: new Date(event.timestamp * 1000).toISOString(),
    url: event.url || null, // For click events
    user_agent: event.user_agent || null,
    ip: event.ip || null,
    reason: event.reason || null, // For bounce/spam events
    status: event.status || null,
    response: event.response || null
  };
};

/**
 * Update outreach_log in Supabase
 */
const updateOutreachLog = async (parsedEvent) => {
  try {
    // Find prospect by email
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .select('id')
      .eq('email', parsedEvent.prospect_email)
      .single();

    if (prospectError || !prospect) {
      console.error('Prospect not found:', parsedEvent.prospect_email);
      return { success: false, error: 'Prospect not found' };
    }

    // Determine update field based on event type
    const updateFields = {};
    let alertType = null;

    switch (parsedEvent.event_type) {
      case 'delivered':
        updateFields.email_status = 'delivered';
        updateFields.email_delivered_at = parsedEvent.timestamp;
        break;

      case 'open':
        updateFields.email_status = 'opened';
        updateFields.email_opened_at = parsedEvent.timestamp;
        updateFields.email_open_count = (await getOpenCount(prospect.id)) + 1;
        break;

      case 'click':
        updateFields.email_status = 'clicked';
        updateFields.email_clicked_at = parsedEvent.timestamp;
        updateFields.email_click_count = (await getClickCount(prospect.id)) + 1;
        updateFields.email_clicked_url = parsedEvent.url;
        break;

      case 'bounce':
        updateFields.email_status = 'bounced';
        updateFields.email_bounced_at = parsedEvent.timestamp;
        updateFields.email_bounce_reason = parsedEvent.reason;
        alertType = 'bounce';
        break;

      case 'spam_report':
        updateFields.email_status = 'spam';
        updateFields.spam_reported_at = parsedEvent.timestamp;
        alertType = 'spam';
        break;

      case 'dropped':
        updateFields.email_status = 'dropped';
        updateFields.email_dropped_at = parsedEvent.timestamp;
        updateFields.email_drop_reason = parsedEvent.reason;
        break;

      default:
        console.log('Unhandled event type:', parsedEvent.event_type);
        return { success: false, error: 'Unhandled event type' };
    }

    // Update prospect record
    const { data, error } = await supabase
      .from('prospects')
      .update(updateFields)
      .eq('id', prospect.id)
      .select();

    if (error) throw error;

    console.log('Outreach log updated:', prospect.id, parsedEvent.event_type);

    // Trigger alert if needed
    if (alertType) {
      await triggerAlert(alertType, prospect, parsedEvent);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to update outreach log:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get open count for prospect
 */
const getOpenCount = async (prospectId) => {
  const { data } = await supabase
    .from('prospects')
    .select('email_open_count')
    .eq('id', prospectId)
    .single();

  return data?.email_open_count || 0;
};

/**
 * Get click count for prospect
 */
const getClickCount = async (prospectId) => {
  const { data } = await supabase
    .from('prospects')
    .select('email_click_count')
    .eq('id', prospectId)
    .single();

  return data?.email_click_count || 0;
};

/**
 * Trigger alert for critical events
 */
const triggerAlert = async (alertType, prospect, event) => {
  console.error(`ALERT: ${alertType.toUpperCase()} - ${prospect.email}`, event);

  // TODO: Implement alert mechanisms:
  // - Send Slack notification
  // - Create incident in tracking system
  // - Pause campaign if spam rate > 1%

  if (alertType === 'spam') {
    // Pause campaign immediately
    console.error('CRITICAL: Spam report detected - PAUSE CAMPAIGN');
    // await pauseCampaign();
  }
};

/**
 * Main webhook handler (Vercel serverless function)
 */
module.exports = async (req, res) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify signature (optional but recommended)
    const signature = req.headers['x-twilio-signature'] || req.headers['trello-signature'];
    const timestamp = req.headers['x-twilio-timestamp'] || req.headers['trello-timestamp'];

    if (!verifyWebhook(signature, timestamp, req.body)) {
      return res.status(403).json({ error: 'Invalid signature' });
    }

    // Parse events array from SendGrid
    const events = req.body;

    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'Invalid payload: expected events array' });
    }

    console.log(`Processing ${events.length} SendGrid events...`);

    // Process each event
    const results = [];
    for (const event of events) {
      const parsedEvent = parseEvent(event);
      const result = await updateOutreachLog(parsedEvent);
      results.push(result);
    }

    // Return success
    return res.status(200).json({
      success: true,
      processed: results.length,
      results: results.map(r => r.success ? 'ok' : r.error)
    });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
