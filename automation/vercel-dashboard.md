# Vercel Dashboard - Implementation Guide

## Overview
Real-time outreach dashboard for tracking email campaigns and VoIP calls to 48 Bursa automotive companies.

## Tech Stack
- **Next.js 16** - React framework with serverless functions
- **Supabase** - Real-time database subscriptions
- **Tailwind CSS v4** - Styling (mobile-responsive)
- **Recharts** - Funnel visualization
- **Vercel** - Hosting (free tier)

## Features

### Real-time Metrics
- **Email Metrics:** Sent, Opened, Clicked, Response Rate
- **Call Metrics:** Made, Connected, Gatekeepers, Bookings
- **Response Rate Tracker:** Target 10-15%
- **Auto-refresh:** Supabase real-time subscriptions

### Companies List
- 48 rows (all Bursa automotive prospects)
- Status badges: Not contacted → Email sent → Called → Reply → Booking
- Click tracking: Opens/clicks per company
- Call count: Number of outreach attempts

### Funnel Chart
```
Emails Sent (100%)
  ↓
Opened (40-50%)
  ↓
Clicked (10-15%)
  ↓
Calls Made (30-40%)
  ↓
Connected (20-30%)
  ↓
Bookings (10-15%)
```

## Deployment

### 1. Create Vercel Project
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from dashboard directory
cd automation/dashboard
vercel

# Follow prompts:
# - Set project name: auto-company-dashboard
# - Link to existing Vercel team (optional)
# - Configure environment variables (see below)
```

### 2. Environment Variables
Add these in Vercel dashboard (Settings → Environment Variables):

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Notes:**
- Use SERVICE_KEY (not anon key) for admin access
- Never commit keys to git
- Vercel encrypts at rest

### 3. Deploy
```bash
# Production deployment
vercel --prod

# Output: https://auto-company-dashboard.vercel.app
```

## Local Development

```bash
# Install dependencies
cd automation/dashboard
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your keys

# Run dev server
npm run dev
# Open: http://localhost:3000
```

## Database Schema Requirements

### Prospects Table
```sql
CREATE TABLE prospects (
  id TEXT PRIMARY KEY,
  company TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'not_contacted',
  email_status TEXT,
  email_sent_at TIMESTAMP,
  email_opened_at TIMESTAMP,
  email_open_count INTEGER DEFAULT 0,
  email_clicked_at TIMESTAMP,
  email_click_count INTEGER DEFAULT 0,
  email_clicked_url TEXT,
  call_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Calls Table
```sql
CREATE TABLE calls (
  id TEXT PRIMARY KEY,
  prospect_id TEXT REFERENCES prospects(id),
  phone_number TEXT,
  twilio_call_sid TEXT,
  call_status TEXT,
  call_duration INTEGER DEFAULT 0,
  recording_url TEXT,
  transcript TEXT,
  gatekeeper_detected BOOLEAN DEFAULT FALSE,
  voicemail_detected BOOLEAN DEFAULT FALSE,
  scenario TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Enable Real-time
```sql
-- Enable real-time for prospects
ALTER publication supabase_realtime ADD TABLE prospects;

-- Enable real-time for calls
ALTER publication supabase_realtime ADD TABLE calls;
```

## Testing Checklist

- [ ] Dashboard deployed to Vercel
- [ ] Environment variables configured
- [ ] Real-time subscriptions working
- [ ] Prospects list loads (48 rows)
- [ ] Metrics calculate correctly
- [ ] Funnel chart renders
- [ ] Mobile-responsive (test at 375px width)
- [ ] Auto-refresh on database changes

## Performance

### Expected Load
- **Initial load:** 48 prospects + metrics (< 500ms)
- **Real-time updates:** < 100ms per event
- **Concurrent users:** 1-3 (small team)

### Optimization
- **Pagination:** Add if prospects > 100
- **Caching:** Vercel edge caching for static assets
- **Rate limiting:** Vercel has built-in DDoS protection

## Monitoring

### Vercel Analytics
```bash
# Enable analytics in Vercel dashboard
# Deployments → Analytics → Enable
```

### Key Metrics to Track
- Page load time
- Real-time subscription health
- Error rate (target: < 1%)
- API response time

## Troubleshooting

### Dashboard shows "Loading..." forever
**Cause:** Supabase connection failed
**Fix:** Check SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel env vars

### Real-time updates not working
**Cause:** Real-time not enabled on Supabase
**Fix:** Run ALTER publication commands (see above)

### Metrics show 0
**Cause:** No data in prospects/calls tables
**Fix:** Import CSV data from Day 1

### Build fails with "supabaseUrl is required"
**Cause:** Missing env vars in build
**Fix:** Add env vars in Vercel dashboard, redeploy

## Rollback Plan (5-second rollback)

```bash
# If dashboard breaks, revert to previous deployment
vercel rollback

# Or rollback to specific deployment
vercel rollback [deployment-url]
```

## Costs

### Vercel Free Tier
- **Hosting:** Free
- **Serverless functions:** 100K invocations/month
- **Bandwidth:** 100GB/month
- **Build minutes:** 6000 minutes/month

### Overages (if exceeded)
- **Serverless:** $0.60/1M invocations
- **Bandwidth:** $40/100GB
- **Build minutes:** $0.50/minute

**Expected usage:** Well within free tier

## Next Steps

1. Deploy dashboard to Vercel
2. Test with sample data
3. Share URL with team
4. Monitor for 24 hours
5. Add alerts for metrics drops

---

**Status:** Implementation complete, awaiting deployment
**Created by:** DevOps-Hightower
**Date:** 2026-06-03
**Cycle:** #37 Day 2
