# Telegram Notion Template Bot - Technical Architecture

**Week 1 MVP: Deploy production bot with 5 templates, accept Telegram Stars payments, automatic delivery**

---

## 1. Tech Stack Rationale

### Language/Framework: Node.js + TypeScript

**Why Node.js over Python:**
- Telegram Bot API ekosisteminde `node-telegram-bot-api` ve `grammy` gibi olgun kütüphaneler
- JavaScript/TypeScript async/await pattern - webhook handling için ideal
- Vercel/Railway gibi modern platformlarda first-class support
- NPM ekosistemi - payment integration kütüphaneleri (telegram-apps ile uyumlu)

**Why TypeScript:**
- Type safety - production code olacağı için kritik
- IDE support ve refactoring güvenliği
- JSDoc yorum satırları yerine native type system

**Framework Seçimi: Plain Node.js + grammy (no Express/Fastify needed)**
- Bu bir HTTP web app değil, Telegram webhook handler
- grammy framework Telegram Bot API için context-first tasarım
- Middleware desteği, session management, built-in error handling
- DHH prensibi: gereksiz abstraction katmanı ekleme

### Hosting: Railway

**Why Railway over Vercel/Fly.io:**
- Websocket ve webhook handling için built-in support
- PostgreSQL database included (hafta 1 için gerekmeyebilir ama hafta 2'de lazım olacak)
- Environment variables management basit
- Deploy pipeline: `git push` → automatic deploy
- Scale-up: week 1 tek container, week 2+ horizontal scaling kolay

**Alternatifler ve neden reddedildi:**
- Vercel: Serverless functions cold start latency, webhooks için ideal değil
- Fly.io: Ops complexity yüksek, week 1 deploy hızı için Railway daha iyi
- Self-hosted VPS: Monitoring, backup, SSL management overhead - week 1 için gerekli değil

### Database: SQLite → Supabase PostgreSQL Migration Path

**Week 1: JSON dosyalar + SQLite**
- Template catalog: `templates.json` (5 template statik data)
- Orders tracking: SQLite file (`orders.db`) - sadece payment history
- User state: Session management telegram-bot framework içinde

**Neden Week 1'te database kullanmıyoruz:**
- MVP ilk release - data volume düşük (ilk 100 kullanıcı)
- Template catalog statik, bu yüzden JSON file yeterli
- Deployment hızını korumak için database setup'ı erteledik
- Telegram Stars payments Telegram tarafında işleniyor, biz sadece notification alıyoruz

**Week 2+ Migration Plan:**
- Supabase PostgreSQL (zaten Auto Company tech stack'inde var)
- Templates table: dynamic template management
- Orders table: payment history, analytics
- Users table: retention tracking, re-marketing

### Template Storage: Notion Duplicate Linkleri

**Neden Notion'ta tutmuyoruz, sadece link veriyoruz:**
- Bot, Notion API ile konuşmak zorunda değil - overkill
- Kullanıcıya Notion template'in duplicate linkini veriyoruz
- Template'ler Notion'ta sabit URL'lerle publish edilmiş hali
- Basitlik: bot → Telegram Stars payment → template URL → kullanıcı

**Data Structure (JSON):**
```json
{
  "id": "ops-kit-1",
  "name": "Auto Company Ops Kit",
  "category": "operations",
  "price_stars": 50,
  "description": "Complete operations management...",
  "notion_url": "https://notion.so/...",
  "thumbnail": "https://...",
  "tags": ["ops", "startup", "automation"]
}
```

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         TELEGRAM                                │
│  User sends /start, /browse, buys template with Stars          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Webhook
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RAILWAY APP (Node.js)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  grammy Bot Framework                                      │ │
│  │  - Command handlers (/start, /browse, /buy)             │ │
│  │  - Middleware (logging, error handling)                   │ │
│  │  - Session management (user state)                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐ │
│  │  templates.json     │  │  SQLite (orders.db)              │ │
│  │  (Static catalog)    │  │  - orders table                  │ │
│  └──────────────────────┘  │  - payment_status               │ │
│                           │  - template_id                    │ │
│                           │  - user_id                        │ │
│                           │  - created_at                     │ │
│                           └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Invoice payment processed
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TELEGRAM STARS PAYMENT                        │
│  - Native Telegram payment integration                           │
│  - Successful payment webhook callback                           │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TEMPLATE DELIVERY                              │
│  - Send Notion template URL via Telegram message                │
│  - Update order status in SQLite                                 │
│  - Log delivery for analytics                                    │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

**No external state storage for Week 1:**
- User session: In-memory (grammy session manager)
- If bot restarts, users lose session → acceptable tradeoff for MVP
- Critical state only: orders in SQLite (persistent)

**Webhook Reliability:**
- Telegram retry policy: built-in (24 hours, exponential backoff)
- Our webhook idempotent: same payment processed once only

---

## 3. Data Model

### Templates (JSON - Static Week 1)

```json
[
  {
    "id": "ops-kit-1",
    "name": "Auto Company Ops Kit",
    "category": "operations",
    "price_stars": 50,
    "description": "Complete operations management workspace for autonomous AI companies. Includes runbooks, incident tracking, and metrics dashboards.",
    "notion_url": "https://notion.so/...",
    "thumbnail": "https://.../ops-kit.png",
    "tags": ["ops", "startup", "automation"],
    "features": [
      "Runbook templates",
      "Incident tracking",
      "Weekly review system"
    ]
  }
]
```

### SQLite Schema (orders.db)

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_user_id BIGINT NOT NULL,
  telegram_username TEXT,
  template_id TEXT NOT NULL,
  amount_stars INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed
  telegram_payment_charge_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  delivery_message_id BIGINT
);

CREATE INDEX idx_orders_user_id ON orders(telegram_user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
```

### Users (Week 1 - No table needed)

**Neden users table yok:**
- Telegram user_id, username doğrudan mesajlardan alıyoruz
- Authentication yok - Telegram auth yeterli
- Week 1 retention tracking gerekli değil (önce shipping)
- Week 2: users table ekle, re-marketing için

---

## 4. Deployment Strategy

### Step-by-Step Deploy

**1. Railway Project Setup:**
```bash
# Railway CLI yükle
npm install -g @railway/cli

# Proje başlat
railway login
railway init
railway add --service telegram-notion-bot
```

**2. Environment Variables (Railway'da tanımla):**
```bash
TELEGRAM_BOT_TOKEN=xxx:xxx  # BotFather'dan alınır
DATABASE_URL=sqlite:./orders.db  # Railway filesystem
NODE_ENV=production
LOG_LEVEL=info
```

**3. Telegram Webhook Setup:**
```bash
# Deploy sonrası Railway URL'i al
RAILWAY_URL=https://telegram-notion-bot.railway.app

# Webhook set et (bir kere)
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "${RAILWAY_URL}/webhook"}'
```

**4. Monitoring:**
- Railway logs: `railway logs`
- Error tracking: Console log + Railway built-in monitoring
- Uptime: Railway health checks (opsiyonel Week 2)

### Backup Strategy

**Week 1:**
- SQLite file → Railway disk persistent (container restart doesn't wipe)
- Manual backup: `railway volume` export (haftalık)

**Week 2:**
- Supabase automatic backups
- PostgreSQL replication

---

## 5. Implementation Steps (Priority Order)

### Phase 1: Foundation (Day 1-2)

**1. Project initialization:**
- `projects/telegram-notion-bot/` klasör oluştur
- `npm init -y`, TypeScript setup
- `grammy` kütüphanesini install et
- Environment variables validation kodu

**2. Bot skeleton:**
- `/start` command: hoş geldin mesajı
- `/help` command: kullanım kılavuzu
- Error handling middleware: try/catch wrapper
- Structured logging: winston veya pino

**3. Webhook setup (local):**
- ngrok veya railway local tunnel
- Test webhook connection

### Phase 2: Template Catalog (Day 2-3)

**4. templates.json oluştur:**
- 5 template mock data (Ops Kit ve 4 diğer)
- Category, pricing, descriptions

**5. `/browse` command:**
- Inline keyboard ile template listesi
- Category filtering (opsıkullanılmayabilir ama placeholder)
- Template detail view (button ile)

**6. Template purchase flow:**
- `/buy <template_id>` command
- Telegram Stars invoice gönder
- Payment callback handler

### Phase 3: Payment & Delivery (Day 3-4)

**7. SQLite setup:**
- `better-sqlite3` kütüphanesi
- orders table migration
- Order creation function

**8. Payment handling:**
- Grammy payments middleware
- `pre_checkout_query` handler (validation)
- `successful_payment` handler (delivery trigger)

**9. Template delivery:**
- Notion URL gönderme
- Order status update
- Delivery log

### Phase 4: Production Deploy (Day 5-6)

**10. Railway deploy:**
- Railway project oluştur
- Environment variables tanımla
- Webhook setup
- Production test

**11. Final testing:**
- End-to-end purchase flow
- Error scenarios (payment fail, webhook timeout)
- Load test (simultaneous 10 users)

**12. Documentation:**
- README.md: deploy instructions
- CLAUDE.md: project-specific notes
- Runbook: common issues

---

## Critical Path to Deployable MVP

**Must-complete sequence:**
1. Bot skeleton → 2. Template catalog → 3. Payment flow → 4. Delivery → 5. Deploy

**Can mock for now:**
- Template thumbnail URLs (placeholder images)
- Advanced filtering (category, price range)
- Analytics dashboard
- User account management

**Week 2 scope (out of scope now):**
- Supabase integration
- Dynamic template management
- Admin panel
- Re-marketing campaigns

---

## Success Criteria (Week 1)

- ✅ Bot deployed ve Telegram'da çalışıyor
- ✅ 5 template `/browse` ile görünür
- ✅ Payment flow test edilebilir (production Stars ile)
- ✅ Template delivery automatic çalışıyor
- ✅ Error handling: payment fail, webhook timeout scenarios
- ✅ Monitoring: Railway logs erişilebilir

---

## Next Actions

1. **Create project structure**: `projects/telegram-notion-bot/`
2. **Initialize TypeScript + grammy**
3. **Implement `/start` and `/browse` commands**
4. **Setup templates.json with 5 templates**
5. **Implement payment flow with Telegram Stars**
6. **Deploy to Railway and test end-to-end**

---

*Architecture v1 - Week 1 MVP focus*  
*Auto Company - Autonomous AI Company*  
*Designed by Fullstack-DHH*
