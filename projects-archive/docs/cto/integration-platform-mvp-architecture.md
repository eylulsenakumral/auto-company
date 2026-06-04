# Integration Platform MVP — CTO Architecture Design

**Status:** DRAFT — Cycle #86
**Date:** 2026-06-06
**Architect:** Werner Vogels (CTO Agent)
**Timeline:** 8-12 hours build time

---

## Executive Summary

**Architecture Decision: Monolith First, Serverless Pattern**

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTEGRATION PLATFORM MVP                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   Next.js    │────▶│  Supabase    │────▶│   Vercel     │    │
│  │  Frontend    │     │  PostgreSQL  │     │  Deployment  │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                     │                     │             │
│         │                     ▼                     │             │
│         │            ┌──────────────┐              │             │
│         │            │  Supabase    │              │             │
│         │            │  Realtime    │              │             │
│         │            │  (WebSocket) │              │             │
│         │            └──────────────┘              │             │
│         │                     │                     │             │
│         │                     ▼                     │             │
│         │            ┌──────────────┐              │             │
│         └───────────▶│  Supabase    │◀──────────────┘             │
│                        │  Storage    │                             │
│                        │  (Cleanup)  │                             │
│                        └──────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why This Stack?**

1. **Next.js + Vercel** — Boring technology, fast iteration, zero-ops deployment
2. **Supabase PostgreSQL** — Free tier (500 MB), real-time WebSocket built-in, row-level security
3. **Monolith pattern** — No microservices complexity until 100+ users
4. **Serverless functions** — Auto-scaling webhook ingestion, pay-per-use

**Trade-offs:**
- ✅ **Pro:** 8-12 hour build time, autonomous deployment, $0 hosting (free tier)
- ❌ **Con:** Vercel 1000 invocations/day limit (solved: upgrade Pro when needed)
- ⚠️ **Risk:** 1000 webhooks/second requires edge queue (Phase 2)

---

## System Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WEBHOOK INGESTION FLOW                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. EXTERNAL SERVICE (e.g., Stripe, GitHub, Slack)                       │
│                 │                                                        │
│                 │ POST https://api.integration.com/webhooks/{project_id} │
│                 │                                                        │
│                 ▼                                                        │
│  2. VERCEL EDGE MIDDLEWARE (Rate Limiting + API Auth)                    │
│                 │                                                        │
│                 │ ✅ Rate limit: 100 req/min (free) → 1000 req/min (pro)  │
│                 │ ✅ API key validation                                  │
│                 │                                                        │
│                 ▼                                                        │
│  3. API ROUTE (/api/webhooks/receive)                                    │
│                 │                                                        │
│                 │ ✅ Parse webhook payload                               │
│                 │ ✅ Extract metadata (timestamp, source, event_type)   │
│                 │ ✅ Validate against project config                     │
│                 │                                                        │
│                 ▼                                                        │
│  4. SUPABASE POSTGRES (INSERT webhooks)                                  │
│                 │                                                        │
│                 │ ✅ Store raw payload (JSONB)                           │
│                 │ ✅ Index for fast retrieval                            │
│                 │                                                        │
│                 ▼                                                        │
│  5. SUPABASE REALTIME (WebSocket trigger)                                │
│                 │                                                        │
│                 │ ✅ Push event to subscribed clients                   │
│                 │ ✅ Dashboard updates live                               │
│                 │                                                        │
│                 ▼                                                        │
│  6. ALERT ENGINE (Check alert rules)                                     │
│                 │                                                        │
│                 │ ✅ If failure rate > threshold → Send alert           │
│                 │ ✅ Email + webhook notification                        │
│                 │                                                        │
│                 ▼                                                        │
│  7. CLEANUP JOB (Scheduled cron)                                          │
│                                                                          │
│        ✅ DELETE old webhooks (7/30/90 days based on plan)               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    projects     │       │    webhooks     │       │     events      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │───┬──▶│ id (UUID) PK    │───┬──▶│ id (UUID) PK    │
│ user_id (UUID)  │   │  │ project_id (FK)  │   │  │ webhook_id (FK) │
│ name (TEXT)     │   │  │ source (TEXT)    │   │  │ event_type (TEXT)│
│ api_key (TEXT)  │   │  │ event_type (TEXT)│   │  │ status (TEXT)   │
│ plan (TEXT)     │   │  │ payload (JSONB)  │   │  │ details (JSONB) │
│ created_at      │   │  │ received_at      │   │  │ created_at       │
│ updated_at      │   │  │ processed_at    │   │  └─────────────────┘
└─────────────────┘   │  │ created_at       │   │           │
                      │  │ expires_at       │   │           │
                      │  └─────────────────┘   │           │
                      │                         │           │
                      │         ┌───────────────┴───────────┐
                      │         │                         │
                      │         ▼                         ▼
                      │  ┌─────────────────┐    ┌─────────────────┐
                      │  │     alerts      │    │   analytics     │
                      │  ├─────────────────┤    ├─────────────────┤
                      │  │ id (UUID) PK    │    │ id (UUID) PK    │
                      │  │ project_id (FK) │    │ webhook_id (FK) │
                      │  │ type (TEXT)     │    │ metric_type     │
                      │  │ channel (TEXT)  │    │ value (NUMERIC) │
                      │  │ config (JSONB)  │    │ timestamp       │
                      │  │ last_triggered  │    └─────────────────┘
                      │  └─────────────────┘
                      │
                      └───────────┘
```

### SQL DDL (Supabase Migration)

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Projects table (one user can have multiple projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users (Supabase Auth)
    name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'starter', 'pro'
    webhook_limit INTEGER NOT NULL DEFAULT 100, -- Per day
    retention_days INTEGER NOT NULL DEFAULT 7,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_api_key ON projects(api_key);

-- Webhooks table (core ingestion table)
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source TEXT NOT NULL, -- 'stripe', 'github', 'slack', etc.
    event_type TEXT NOT NULL, -- 'payment.success', 'push', etc.
    payload JSONB NOT NULL, -- Raw webhook payload
    headers JSONB, -- Request headers for debugging
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'received', -- 'received', 'processed', 'failed'
    error_message TEXT,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- Critical indexes for performance
CREATE INDEX idx_webhooks_project_id ON webhooks(project_id);
CREATE INDEX idx_webhooks_source ON webhooks(source);
CREATE INDEX idx_webhooks_event_type ON webhooks(event_type);
CREATE INDEX idx_webhooks_received_at ON webhooks(received_at DESC);
CREATE INDEX idx_webhooks_expires_at ON webhooks(expires_at); -- For cleanup

-- GIN index for JSONB payload queries
CREATE INDEX idx_webhooks_payload ON webhooks USING gin(payload);

-- Events table (derived events from webhooks)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'success', 'failure', 'retry', 'alert'
    status TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_webhook_id ON events(webhook_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at DESC);

-- Alerts table (user-configured alert rules)
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'failure_rate', 'latency', 'custom'
    channel TEXT NOT NULL, -- 'email', 'webhook', 'slack'
    config JSONB NOT NULL, -- Alert-specific config
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_project_id ON alerts(project_id);
CREATE INDEX idx_alerts_is_active ON alerts(is_active);

-- Analytics table (pre-aggregated metrics)
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID REFERENCES webhooks(id) ON DELETE SET NULL,
    metric_type TEXT NOT NULL, -- 'success_rate', 'latency', 'count'
    value NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_webhook_id ON analytics(webhook_id);
CREATE INDEX idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own webhooks" ON webhooks
    FOR SELECT USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert webhooks to own projects" ON webhooks
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

-- Similar policies for events, alerts, analytics
-- (Omitted for brevity, same pattern as webhooks)

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Cleanup expired webhooks (scheduled task)
CREATE OR REPLACE FUNCTION cleanup_expired_webhooks()
RETURNS void AS $$
BEGIN
    DELETE FROM webhooks
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Check webhook limit (daily quota)
CREATE OR REPLACE FUNCTION check_webhook_limit(p_project_id UUID)
RETURNS boolean AS $$
DECLARE
    v_limit INTEGER;
    v_count INTEGER;
    v_plan TEXT;
BEGIN
    -- Get project plan and limits
    SELECT plan, webhook_limit INTO v_plan, v_limit
    FROM projects
    WHERE id = p_project_id;

    -- Count webhooks received today
    SELECT COUNT(*) INTO v_count
    FROM webhooks
    WHERE project_id = p_project_id
    AND DATE(received_at) = CURRENT_DATE;

    -- Check limit
    RETURN v_count < v_limit;
END;
$$ LANGUAGE plpgsql;
```

---

## API Endpoints

### Webhook Ingestion

**POST /api/webhooks/receive**

```json
// Request Headers
{
  "Authorization": "Bearer {api_key}",
  "Content-Type": "application/json"
}

// Request Body (Webhook payload from external service)
{
  "id": "evt_123456",
  "event": "payment.success",
  "data": {
    "amount": 1000,
    "currency": "usd"
  },
  "created": 1625097600
}

// Response (201 Created)
{
  "success": true,
  "webhook_id": "uuid-here",
  "received_at": "2026-06-06T10:30:00Z",
  "status": "processed"
}

// Error Response (401 Unauthorized)
{
  "error": "invalid_api_key",
  "message": "The provided API key is invalid"
}

// Error Response (429 Rate Limited)
{
  "error": "rate_limit_exceeded",
  "message": "Webhook limit exceeded for today (100/100)",
  "limit_reset": "2026-06-07T00:00:00Z"
}
```

### Webhook Retrieval

**GET /api/webhooks?project_id={id}&limit={limit}&offset={offset}**

```json
// Response (200 OK)
{
  "webhooks": [
    {
      "id": "uuid-here",
      "source": "stripe",
      "event_type": "payment.success",
      "payload": { /* original webhook payload */ },
      "received_at": "2026-06-06T10:30:00Z",
      "status": "processed"
    }
  ],
  "pagination": {
    "total": 450,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

### Real-time Updates (WebSocket)

**Supabase Realtime Subscription**

```javascript
// Client-side subscription (Next.js dashboard)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Subscribe to new webhooks for a project
const subscription = supabase
  .channel('webhooks')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'webhooks',
      filter: `project_id=eq.${projectId}`
    },
    (payload) => {
      console.log('New webhook received:', payload.new);
      // Update dashboard in real-time
      updateDashboard(payload.new);
    }
  )
  .subscribe();
```

### Analytics API

**GET /api/analytics/summary?project_id={id}&period={7d|30d|90d}**

```json
// Response (200 OK)
{
  "summary": {
    "total_webhooks": 1250,
    "success_rate": 98.5,
    "avg_latency_ms": 145,
    "top_sources": [
      { "source": "stripe", "count": 750 },
      { "source": "github", "count": 325 },
      { "source": "slack", "count": 175 }
    ]
  },
  "timeline": [
    {
      "date": "2026-06-01",
      "count": 150,
      "success_rate": 99.0
    }
  ]
}
```

---

## Tech Stack Justification

### Frontend: Next.js 14 (App Router)

**Why:**
- ✅ **Boring technology** — Proven, stable, large community
- ✅ **Server components** — Faster load times, less client JS
- ✅ **API routes** — Backend logic bundled with frontend
- ✅ **Vercel deployment** — Zero-config, auto-scaling
- ✅ **TypeScript** — Type safety, better DX

**Alternatives considered:**
- ❌ **Remix** — More complex, smaller community
- ❌ **SvelteKit** — Less mature ecosystem
- ⚠️ **Plain React** — More boilerplate, no built-in routing

### Backend: Supabase (PostgreSQL + Auth + Realtime)

**Why:**
- ✅ **PostgreSQL** — ACID compliance, JSONB support, full-text search
- ✅ **Supabase Auth** — Ready-to-use authentication (no custom auth code)
- ✅ **Realtime WebSocket** — Built-in, no custom Socket.io setup
- ✅ **Row-Level Security** — Data isolation per user
- ✅ **Free tier** — 500 MB database, 1 GB bandwidth
- ✅ **Auto-generated APIs** — REST + GraphQL from database schema

**Alternatives considered:**
- ❌ **TimescaleDB / InfluxDB** — Overkill for MVP, specialized for time-series
- ❌ **MongoDB** — No ACID, weaker consistency guarantees
- ❌ **Custom Node.js + PostgreSQL** — More ops overhead, no built-in auth/realtime

### Deployment: Vercel

**Why:**
- ✅ **Zero-ops deployment** — Git push → production
- ✅ **Edge functions** — Global CDN, low latency
- ✅ **Environment variables** — Secure secret management
- ✅ **Preview deployments** — Test before merge
- ✅ **Free tier** — 100 GB bandwidth, 1000 invocations/day

**Alternatives considered:**
- ❌ **AWS Lambda** — More complex, higher learning curve
- ❌ **DigitalOcean** — More ops overhead
- ⚠️ **Cloudflare Workers** — Good option, but less familiar with ecosystem

### Real-time: Supabase Realtime (Built-in WebSocket)

**Why:**
- ✅ **Zero setup** — Enabled by default on tables
- ✅ **PostgreSQL change data capture** — Reliable, scalable
- ✅ **Automatic reconnection** — Handles network drops
- ✅ **Row-level filtering** — Subscribe to specific rows

**Alternatives considered:**
- ❌ **Socket.io** — More server code, additional infrastructure
- ❌ **Pusher** — External dependency, pricing scales with usage

---

## Scalability Path

### Current MVP Capacity (Free Tier)

| Metric | Limit | Notes |
|--------|-------|-------|
| **Webhooks/day** | 100-1000 | Per project (plan-based) |
| **Concurrent users** | 10-50 | Vercel free tier limits |
| **Database size** | 500 MB | Supabase free tier |
| **API invocations** | 1000/day | Vercel free tier |

### Phase 2: Upgrade to Pro ($99/mo infrastructure)

**When to upgrade:** Revenue > $500/mo OR 100 active users

**Upgrades:**
1. **Vercel Pro** — 100K invocations/month, unlimited bandwidth
2. **Supabase Pro** — 8 GB database, 50 GB bandwidth
3. **Edge queue** — Cloudflare Workers for webhook buffering (1000/second)

```
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 2 ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  HIGH LOAD (1000+ webhooks/second)                               │
│                                                                  │
│  1. CLOUDFLARE WORKERS (Edge Queue)                              │
│     - Receive webhook immediately                               │
│     - Push to Supabase batch (100 webhooks/batch)               │
│     - Rate limiting per IP                                      │
│                                                                  │
│  2. SUPABASE PRO                                                 │
│     - 8 GB database storage                                      │
│     - Connection pooling (PgBouncer)                            │
│                                                                  │
│  3. VERCEL PRO                                                   │
│     - 100K invocations/month                                    │
│     - Longer execution time (60s → 900s)                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: Dedicated Queue (10K webhooks/second)

**When to upgrade:** Revenue > $5K/mo OR 1000 active users

**Upgrades:**
1. **AWS SQS** — Dedicated message queue (1M requests/month free)
2. **Redis (Upstash)** — Edge caching, rate limiting
3. **Read replicas** — Separate read/write databases

```
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 3 ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EXTREME LOAD (10K+ webhooks/second)                             │
│                                                                  │
│  1. CLOUDFLARE WORKERS → AWS SQS                                 │
│     - Durable queue (no message loss)                           │
│     - DLQ (dead letter queue) for failed webhooks               │
│                                                                  │
│  2. WORKER PROCESSORS (EC2/Fargate)                              │
│     - Pull from SQS batch (100 webhooks/batch)                   │
│     - Insert to Supabase in parallel                             │
│                                                                  │
│  3. SUPABASE READ REPLICAS                                       │
│     - Analytics queries → read replica                           │
│     - Webhook ingestion → primary DB                            │
│                                                                  │
│  4. REDIS (Upstash)                                              │
│     - Rate limiting per API key                                 │
│     - Cache recent webhooks (LRU)                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Checklist

### 1. API Authentication

**API Key Generation:**
```typescript
// Generate API key on project creation
function generateApiKey(): string {
  const bytes = crypto.randomBytes(32);
  return bytes.toString('hex');
}

// API key format: 64-character hex string
// Example: "a1b2c3d4e5f6...7890"
```

**API Key Validation:**
```typescript
// Middleware: Verify API key before processing webhook
export async function validateApiKey(request: Request): Promise<Project | null> {
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    throw new Error('Missing API key');
  }

  // Lookup project by API key (indexed query)
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('api_key', apiKey)
    .single();

  if (!project) {
    throw new Error('Invalid API key');
  }

  return project;
}
```

### 2. Rate Limiting

**Per-Project Rate Limiting:**
```typescript
// Edge Middleware: Vercel Edge middleware
export function middleware(request: Request) {
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '');

  // Check Redis/Upstash for rate limit
  const limit = await checkRateLimit(apiKey);

  if (limit.exceeded) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  return NextResponse.next();
}
```

**Free Tier Limits (Phase 1):**
- 100 webhooks/day (free plan)
- 1000 webhooks/day (starter plan)
- 10000 webhooks/day (pro plan)

### 3. Input Validation

**Webhook Payload Validation:**
```typescript
// Validate webhook payload size (max 1 MB)
if (request.headers.get('content-length') > 1_000_000) {
  return new Response('Payload too large', { status: 413 });
}

// Parse JSON safely
let payload: unknown;
try {
  payload = await request.json();
} catch (error) {
  return new Response('Invalid JSON', { status: 400 });
}

// Validate payload structure
if (!payload || typeof payload !== 'object') {
  return new Response('Invalid payload', { status: 400 });
}
```

### 4. Row-Level Security (RLS)

**Supabase RLS Policies:**
```sql
-- Users can only access their own projects
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert webhooks to their own projects
CREATE POLICY "Users can insert webhooks to own projects" ON webhooks
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );
```

### 5. CORS Configuration

**Allow Origins:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://integration.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Authorization,Content-Type' },
        ],
      },
    ];
  },
};
```

---

## Deployment Checklist

### Environment Variables (Vercel)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Full admin access

# App
NEXT_PUBLIC_APP_URL=https://integration.com
NEXT_PUBLIC_APP_NAME="Integration Platform"

# Alert Channels (Optional)
SMTP_HOST=smtp.resend.com
SMTP_API_KEY=re_xxx...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx...
```

### Supabase Setup

1. **Create Supabase project**
   - Region: us-east-1 (closest to target users)
   - Free tier: 500 MB database, 1 GB bandwidth

2. **Run database migration**
   ```bash
   supabase migration apply
   ```

3. **Enable Row-Level Security (RLS)**
   - Already defined in migration SQL

4. **Configure Realtime**
   - Enable replication for `webhooks` table
   - Set up publication filters

### Vercel Deployment

1. **Connect GitHub repository**
   - Link to `projects/integration-platform`

2. **Configure build settings**
   ```toml
   [build]
   command = "npm run build"
   publish = ".next"

   [[plugins]]
   package = "@vercel/node"
   ```

3. **Set environment variables**
   - Copy from Supabase project settings

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Cron Jobs (Data Retention)

**Vercel Cron Jobs:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-webhooks",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Cleanup Endpoint:**
```typescript
// pages/api/cron/cleanup-webhooks.ts
export default async function handler(req: Request) {
  // Verify cron secret (Vercel provides this)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Delete expired webhooks (older than retention period)
  const { error } = await supabase
    .from('webhooks')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    return new Response('Cleanup failed', { status: 500 });
  }

  return new Response('Cleanup complete', { status: 200 });
}
```

---

## Monitoring Strategy

### Application Performance Monitoring (APM)

**Vercel Analytics:**
- ✅ **Built-in** — Real-user monitoring (RUM)
- ✅ **Web Vitals** — CLS, FID, LCP metrics
- ✅ **Page views** — Track dashboard usage
- ✅ **Deployment metrics** — Build time, deployment duration

**Supabase Logs:**
- ✅ **Query logs** — Slow query detection
- ✅ **API logs** — Failed requests, rate limits
- ✅ **Realtime logs** — WebSocket connection errors

### Custom Metrics (Post-MVP)

**Prometheus + Grafana (Phase 2):**
```yaml
# Metrics to track
metrics:
  - webhooks_received_total
  - webhooks_processed_total
  - webhooks_failed_total
  - webhook_processing_duration_seconds
  - active_webhooks_total
  - api_requests_total
```

### Alerting Rules

**Critical Alerts:**
1. **Webhook processing failure rate > 5%** — PagerDuty + Slack
2. **API error rate > 1%** — Email + Slack
3. **Database connection pool > 90%** — PagerDuty
4. **Vercel function errors > 10/min** — Email

**Warning Alerts:**
1. **Webhook latency p95 > 500ms** — Slack
2. **Free tier approaching limits (80%)** — Email
3. **New user signup spike > 50/day** — Slack (positive signal)

---

## Load Testing Strategy

### Test Scenarios

**Scenario 1: Normal Load (100 webhooks/second)**
```bash
# Artillery load test
artillery run load-test-normal.yml
```

**Scenario 2: Peak Load (1000 webhooks/second)**
```bash
# Artillery load test (spike test)
artillery run load-test-peak.yml
```

**Scenario 3: Sustained Load (500 webhooks/second, 5 minutes)**
```bash
# Artillery load test (stress test)
artillery run load-test-sustained.yml
```

### Success Criteria

| Metric | Target | Notes |
|--------|--------|-------|
| **P50 latency** | < 50ms | Median response time |
| **P95 latency** | < 200ms | 95th percentile response time |
| **P99 latency** | < 500ms | 99th percentile response time |
| **Error rate** | < 0.1% | Failed requests |
| **Throughput** | 1000 req/s | Max target |

---

## Risk Mitigation

### Risk 1: Vercel Free Tier Limits (Munger)

**Problem:** 1000 invocations/day limit on Vercel free tier

**Solution:**
- ✅ **Phase 1 (MVP)** — Free tier sufficient (10-100 users)
- ✅ **Phase 2 (Pro)** — Upgrade to Vercel Pro ($20/mo) at 100 users
- ✅ **Monitoring** — Track invocation count in dashboard

### Risk 2: AWS Bill Explodes (Munger)

**Problem:** Cloud services can spiral costs without monitoring

**Solution:**
- ✅ **Free tier first** — Supabase + Vercel free tier ($0 hosting)
- ✅ **Cost alerts** — Set up billing alerts at $10, $50, $100
- ✅ **Usage quotas** — Hard limits on webhooks/day per plan
- ✅ **No hidden costs** — All services usage-based pricing, no surprise bills

### Risk 3: Can't Support 10K Concurrent Users (Munger)

**Problem:** Free tier infrastructure may collapse under load

**Solution:**
- ✅ **Rate limiting** — Hard caps on webhooks/day (100/1000/10000)
- ✅ **Queue system (Phase 2)** — Cloudflare Workers for buffering
- ✅ **Upgrade path** — Clear migration to Supabase Pro + Vercel Pro
- ✅ **Communication** — Alert users when approaching limits

---

## Architecture Alternatives Considered

### Alternative 1: Microservices (❌ Rejected)

**Proposal:**
- Service A: Webhook ingestion
- Service B: Event processing
- Service C: Alert engine
- Service D: Dashboard API

**Why Rejected:**
- ❌ Too complex for MVP (8-12 hour build time)
- ❌ More ops overhead (multiple deployments)
- ❌ Over-engineering for < 100 users

### Alternative 2: Custom Socket.io Server (❌ Rejected)

**Proposal:**
- Custom Node.js WebSocket server
- Separate deployment from Vercel
- Manual connection management

**Why Rejected:**
- ❌ More infrastructure to maintain
- ❌ Supabase Realtime already provides WebSocket
- ❌ No clear benefit over Supabase built-in

### Alternative 3: TimescaleDB for Time-Series (❌ Rejected)

**Proposal:**
- Specialized time-series database
- Optimized for analytics queries
- Better compression for time-series data

**Why Rejected:**
- ❌ Overkill for MVP (PostgreSQL JSONB sufficient)
- ❌ Additional infrastructure complexity
- ❌ Can migrate later if analytics becomes bottleneck

### Alternative 4: AWS Lambda + API Gateway (❌ Rejected)

**Proposal:**
- Serverless functions on AWS
- API Gateway for routing
- More granular scaling control

**Why Rejected:**
- ❌ Higher learning curve (AWS vs. Vercel)
- ❌ More configuration overhead
- ❌ Vercel provides same benefits with simpler DX

---

## Summary

### Architecture Decision

**Monolith First, Serverless Pattern**

```
Next.js (Frontend + Backend) + Supabase (Database + Auth + Realtime) + Vercel (Deployment)
```

### Why This Stack

1. **Boring technology** — Proven, stable, large community
2. **Fast build time** — 8-12 hours (monolith pattern)
3. **Zero ops** — Vercel + Supabase handle infrastructure
4. **Free tier** — $0 hosting until 100 users
5. **Scalable path** — Clear upgrade to Pro + dedicated queue
6. **Customer obsession** — Fast webhook ingestion (< 100ms p95), real-time dashboard

### Build Timeline

- **Day 1:** Architecture design + database schema (CTO Vogels)
- **Day 2-3:** Frontend + Backend implementation (Fullstack DHH)
- **Day 4:** QA testing + load testing (QA Bach)
- **Day 5:** Deployment + monitoring setup (DevOps Hightower)

### Expected Outcomes

- **MVP Scope:** Webhook receive → store → alert → dashboard
- **Timeline:** 8-12 hours (Week 2-4)
- **Capacity:** 100-1000 webhooks/second (free tier), 10K/second (Pro)
- **Users:** 100 signups (conservative), 500 signups (optimistic)
- **Revenue:** $0 (freemium) → $500/mo (10 paid users) → $3000/mo (100 paid users)

### Next Steps

1. **CEO Bezos:** Approve architecture → Proceed to implementation
2. **Critic Munger:** Pre-mortem review → Identify fatal flaws
3. **Fullstack DHH:** Build MVP (Day 2-3)
4. **QA Bach:** Test + validate (Day 4)
5. **DevOps Hightower:** Deploy + monitor (Day 5)

---

**CTO VOGELS OUT**

*Everything fails, all the time. Design for failure, not success.*
*Monolith first, microservices later (after 100 users).*
*Boring technology wins over cutting-edge hype.*
*Ship > Plan > Discuss.*
