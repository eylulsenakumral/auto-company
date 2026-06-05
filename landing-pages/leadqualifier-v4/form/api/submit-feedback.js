// Cloudflare Worker for LeadQualifier v4 Feedback
// Deploy with: wrangler publish submit-feedback.js

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET endpoint for stats (optional auth)
    if (request.method === 'GET') {
      if (env.FEEDBACK_KV) {
        const count = await env.FEEDBACK_KV.get('submission-count') || '0';
        return new Response(
          JSON.stringify({ total_submissions: parseInt(count) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ total_submissions: 0, error: 'KV not bound' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only accept POST for submissions
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const data = await request.json();

      // Validate required fields
      if (!data.email || !data.topics) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Store in Cloudflare KV (bind in wrangler.toml)
      if (env.FEEDBACK_KV) {
        const key = `feedback-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await env.FEEDBACK_KV.put(key, JSON.stringify(data));

        // Increment submission counter
        const currentCount = await env.FEEDBACK_KV.get('submission-count') || '0';
        await env.FEEDBACK_KV.put('submission-count', String(parseInt(currentCount) + 1));
      }

      // Optionally send email via Resend (bind in wrangler.toml)
      if (env.RESEND_API_KEY && env.NOTIFICATION_EMAIL) {
        // Email notification logic here
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Feedback received' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
};
