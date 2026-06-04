# Telegram Bot — Critical Gaps Fix Specification

**Status:** CYCLE #46 — Specification Phase
**Timeline:** 15 hours autonomous work
**Blocker:** Requires Notion API access, payment testing environment, legal content

## Critical Gap #1: Notion Templates (8 hours)

### Current State
- `templates.json` contains 5 placeholder entries
- All `notion_url` fields point to non-existent URLs
- Template markdown files exist in `templates/notion-template-pack/`

### Fix Steps

#### Step 1: Create Real Notion Pages (4 hours)
**Required:** Notion API access token

**Process:**
1. Create Notion integration at https://www.notion.so/my-integrations
2. Get API token from integration settings
3. Add to `.env.production`: `NOTION_API_TOKEN=secret_...`
4. For each template in `templates.json`:

```bash
# Example: Auto Company Ops Kit
curl -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer $NOTION_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": {"type": "page_id", "page_id": "PARENT_PAGE_ID"},
    "properties": {
      "title": [{"text": "Auto Company Ops Kit"}]
    },
    "children": [
      # Content from 01-decision-log-template.md
      # Content from 02-agent-workflow-playbook.md
      # Content from 03-operating-principles.md
      # Content from 04-cycle-management.md
    ]
  }'
```

5. Enable "Share to web" → Get public URL
6. Update `templates.json` entry:

```json
{
  "id": "ops-kit-1",
  "notion_url": "https://notion.so/auto-company-ops-kit-[REAL_ID]"
}
```

#### Step 2: Template Content Structure (4 hours)

**Template 1: Auto Company Ops Kit** (50 Stars)
- 01-decision-log-template.md
- 02-agent-workflow-playbook.md
- 03-operating-principles.md
- 04-cycle-management.md

**Template 2: Product Roadmap Tracker** (40 Stars)
- Backlog view
- Priority matrix
- Release timeline
- Stakeholder update template

**Template 3: Content Production System** (45 Stars)
- Idea bank database
- Editorial calendar
- Content performance tracker
- Publishing workflow

**Template 4: B2B Sales Pipeline** (55 Stars)
- Leads database
- Deal stages
- Follow-up automations
- Revenue forecast

**Template 5: Startup Finance Dashboard** (60 Stars)
- Expense tracker
- Runway calculator
- Investor reporting
- Unit economics

### Verification
- [ ] All 5 templates created in Notion
- [ ] All templates publicly accessible
- [ ] `templates.json` updated with real URLs
- [ ] Test purchase flow completes successfully

---

## Critical Gap #2: Payment Integration Fix (4 hours)

### Current State
- Payment flow exists but `charge_id` tracking incomplete
- No duplicate purchase prevention
- Refund flow untested

### Fix Steps

#### Step 1: Add charge_id Tracking (1 hour)

**File:** `src/handlers/successful_payment.ts`

```typescript
// Current code issue: charge_id not being stored
// Fix: Add to order record

interface Order {
  telegram_id: number;
  template_id: string;
  stars_paid: number;
  charge_id: string; // ← ADD THIS
  status: 'completed' | 'refunded';
  created_at: Date;
}

// Update successful_payment handler
export async function handleSuccessfulPayment(charge_id: string, template_id: string) {
  // Check for duplicate
  const existing = await db.getOrder byChargeId(charge_id);
  if (existing) {
    logger.warn(`Duplicate charge detected: ${charge_id}`);
    return; // Don't deliver template twice
  }

  // Store with charge_id
  await db.createOrder({
    telegram_id,
    template_id,
    stars_paid,
    charge_id, // ← NOW TRACKED
    status: 'completed',
    created_at: new Date()
  });

  // Deliver template
  await deliverTemplate(telegram_id, template_id);
}
```

#### Step 2: Test Payment Flow (2 hours)

**Required:** Test Telegram Stars environment

**Process:**
1. Create test payment in Telegram:
   - Use test bot token (if available)
   - Or use real payment with small amount (5-10 Stars)
2. Verify charge_id captured
3. Verify template delivered
4. Check database record

#### Step 3: Implement Refund Handling (1 hour)

**File:** `src/handlers/refund_payment.ts`

```typescript
export async function handleRefund(charge_id: string) {
  const order = await db.getOrderByChargeId(charge_id);
  if (!order) {
    logger.error(`Refund for non-existent order: ${charge_id}`);
    return;
  }

  if (order.status === 'refunded') {
    logger.warn(`Double refund attempt: ${charge_id}`);
    return;
  }

  await db.updateOrderStatus(order.id, 'refunded');

  // Notify user
  await telegram.sendMessage(
    order.telegram_id,
    "Payment refunded. Template access revoked."
  );
}
```

### Verification
- [ ] charge_id stored in database
- [ ] Duplicate prevention works
- [ ] Refund flow functional
- [ ] Error handling complete

---

## Critical Gap #3: Legal Compliance (3 hours)

### Current State
- No Turkish commerce disclosures
- No tax ID information
- No cancellation consent flow

### Fix Steps

#### Step 1: Add Seller Information (1 hour)

**Required:** Turkish tax ID (Vergi Kimlik Numarası)

**File:** `src/handlers/start.ts`

```typescript
const SELLER_INFO = `
🏢 **Satıcı Bilgileri**

Auto Company
Vergi No: [TAX_ID_REQUIRED]
Adres: [ADDRESS_REQUIRED]

İletişim: @tolgabrk (Telegram)
`;

export async function handleStartCommand(msg: Message) {
  await telegram.sendMessage(msg.chat.id, `
👋 **Auto Company Notion Templates**

${SELLER_INFO}

🛒 Mevcut Template'ler:
...
  `);
}
```

#### Step 2: Add Cancellation Consent (1 hour)

**File:** `src/handlers/purchase.ts`

```typescript
export async function handlePurchaseRequest(msg: Message, template_id: string) {
  const template = getTemplateById(template_id);

  // First, show disclaimer
  await telegram.sendMessage(msg.chat.id, `
⚠️ **Önemli Bilgilendirme**

Template'ler dijital ürün olduğundan iade koşulları:
- Teslimattan sonra 14 gün içinde iade hakkınız vardır
- Template'i kullandıysanız iade talebi reddedilebilir
- Tam iade durumunda Stars iadeniz 5 iş günü içinde yapılır

Devam etmek için /onay komutunu kullanın.
İptal etmek için /iptal komutunu kullanın.
  `);

  // Wait for user confirmation
  // Store pending purchase state
}
```

#### Step 3: Add Tax ID Display (1 hour)

**File:** `src/handlers/receipt.ts`

```typescript
export async function sendReceipt(telegram_id: number, order: Order) {
  await telegram.sendMessage(telegram_id, `
✅ **Ödeme Başarılı**

**Sipariş Detayları:**
Template: ${order.template_name}
Tutar: ${order.stars_paid} Stars
Sipariş ID: ${order.id}

**Fatura Bilgileri:**
Satıcı: Auto Company
Vergi No: [TAX_ID_REQUIRED]
Tarih: ${order.created_at.toLocaleString('tr-TR')}

Bu mesaj faturanız olarak geçerlidir.
  `);
}
```

### Required Information

**Missing Data Points:**
1. **Vergi Kimlik Numarası (VKN)**: Turkish tax ID
   - Can be obtained from tax office (Basit Usul)
   - Required for commercial sales
   - Process: Apply at local tax office

2. **İş Adresi (Business Address)**: Required for disclosure
   - Can be home address initially
   - Format: Street, District, City, Turkey

3. **İletişim Bilgileri**: Required for customer support
   - Telegram: @tolgabrk ✓ (already available)
   - Email: [OPTIONAL]

### Verification
- [ ] Seller info added to /start message
- [ ] Cancellation consent implemented
- [ ] Tax ID displayed on receipts
- [ ] Legal text reviewed for Turkish commerce law

---

## Summary

**Total Time Estimate:** 15 hours
- Templates: 8h (Notion API + content structure)
- Payment: 4h (charge_id + testing + refunds)
- Legal: 3h (disclosures + consent + tax ID)

**Blocking Factors:**
1. **Notion API Token** Required for template creation
2. **Test Payment Environment** Required for payment testing
3. **Tax ID Information** Required for legal compliance

**Next Actions (When Unblocked):**
1. Obtain Notion API token → Create templates
2. Set up test payment → Verify payment flow
3. Get tax ID → Complete legal compliance
4. Run QA smoke tests
5. Deploy to Railway

**Alternative: BETA Deploy**
If critical gaps cannot be fixed in 15h:
- Add prominent BETA warnings
- Limit to 50 users
- Manual approval for each purchase
- Full refund guarantee
- Clear disclosure of experimental status
