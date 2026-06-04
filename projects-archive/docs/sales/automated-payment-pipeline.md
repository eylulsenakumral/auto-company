# Automated Payment Pipeline - Notion Template Pack

**Product**: Auto Company Ops Kit - Notion Template Pack
**Price**: $29 one-time payment
**Files**: 5 Notion templates (~50KB total)
**Status**: Ready to launch

---

## Executive Summary

**Recommended Platform**: Gumroad

**Rationale**:
- Fastest time-to-launch (15 minutes)
- Merchant of Record (handles EU VAT, US sales tax automatically)
- Built-in file delivery
- Strong brand recognition with indie buyers
- Zero monthly fees
- Switching platforms later is trivial

**Key Trade-off**: 10% flat fee vs 5% (Lemon Squeezy). At $29 price point and early stage, the $2.90/sale difference is negligible compared to launch speed and tax handling value.

---

## Platform Comparison

| Feature | Gumroad | Lemon Squeezy | Payhip |
|---------|---------|---------------|--------|
| **Fee** | 10% flat | 5% + $0.50 | 5% (free tier) / 2% ($29/mo) / 0% ($99/mo) |
| **Monthly Cost** | $0 | $0 | $0 / $29 / $99 |
| **Tax Handling** | Merchant of Record (MoR) | Merchant of Record (MoR) | MoR (EU only, US immature) |
| **File Delivery** | Built-in | Built-in | Built-in |
| **Setup Time** | 15 min | 30-45 min | 20-30 min |
| **Discovery** | Weak (5-15% for established) | None | Minimal |
| **Payout Speed** | Weekly/monthly | Daily/weekly/monthly | Daily |
| **Best For** | First product, speed | SaaS, >$5k/mo | $1k-$20k/mo volume |

### Cost Breakdown at $29 Price Point

| Platform | Fee per Sale | Net Revenue | Breakeven vs Gumroad |
|----------|-------------|--------------|---------------------|
| Gumroad | $2.90 | $26.10 | - |
| Lemon Squeezy | $1.95 | $27.05 | +$0.85/sale |
| Payhip (free tier) | $1.45 | $27.55 | +$1.45/sale |
| Payhip ($29/mo) | $0.58 | $28.42 | +$2.32/sale @ 100 sales/mo |

**Reality check**: Below $3,000 monthly revenue, fee differences are noise. Focus on shipping and learning.

---

## Implementation: Gumroad

### Step 1: Account Setup (5 min)

1. Go to [gumroad.com](https://gumroad.com) and sign up
2. Complete seller profile (name, bio, social links)
3. Connect payout method (Stripe Connect or bank account)
4. Verify email

### Step 2: Product Creation (10 min)

1. Click "Add a product"
2. **Title**: "Auto Company Ops Kit - Notion Template Pack"
3. **Description** (use landing page copy):
   ```markdown
   The complete operations toolkit for autonomous AI companies.

   5 battle-tested Notion templates that power Auto Company's daily operations:
   - Decision Log Template
   - Agent Workflow Playbook
   - Operating Principles
   - Cycle Management System
   - Complete README

   Built for teams running AI-driven companies without human involvement.
   ```
4. **Pricing**: $29 (fixed, no pay-what-you-want)
5. **Upload**: Select all 5 .md files as the download
6. **Cover Image**: Create or use the landing page hero
7. **Tags**: productivity, templates, not-ION, business, operations

### Step 3: File Fulfillment (Built-in)

Gumroad automatically:
- Encrypts and hosts files
- Generates unique download links per purchase
- Emails download link to buyer
- Shows download in purchase confirmation page

No manual intervention required.

### Step 4: Integration with Landing Page

**Current State**: Landing page at `/public/index.html` has free download link (`/notion-template-pack.zip`)

**Required Change**: Replace free download with Gumroad checkout.

**File to edit**: `/home/tolgabrk/projects/Auto-Company/public/index.html`

**Current button (line 87-89)**:
```html
<a href="/notion-template-pack.zip" class="download-btn">
    ⬇️ Download Template Pack (22KB)
</a>
```

**Replace with**:
```html
<a href="https://gumroad.com/l/notion-template-pack" class="download-btn gumroad-button">
    💳 Buy Now - $29
</a>
<script src="https://gumroad.com/js/gumroad.js"></script>
```

**Alternative - Overlay checkout (better UX)**:
```html
<a href="https://gumroad.com/l/notion-template-pack" class="download-btn gumroad-overlay">
    💳 Buy Now - $29
</a>
<script src="https://gumroad.com/js/gumroad.js"></script>
```

**Deployment**:
- Landing page is already deployed (appears to be static HTML in `/public/`)
- After editing, commit and push to trigger deployment

### Step 5: Post-Purchase Automation

Gumroad supports webhooks. Configure:

1. **Webhook URL**: Your endpoint (can use Cloudflare Worker)
2. **Events**: `sale` (triggered on successful purchase)

Optional: Add buyer to email list
```javascript
// Webhook handler (Cloudflare Worker)
export default {
  async fetch(request, env) {
    const body = await request.json();
    if (body.type === 'sale') {
      // Add to email list, send welcome sequence, etc.
      await addToEmailList(body.email);
    }
    return new Response('OK');
  }
};
```

---

## Alternative: Lemon Squeezy

If you prefer Lemon Squeezy (lower fees, better for scale):

### Setup Steps

1. Create account at [lemonsqueezy.com](https://www.lemonsqueezy.com)
2. Go to Settings → API Keys → Generate API key
3. Create a Product:
   - Type: "License key" or "Digital download"
   - Price: $29
   - Files: Upload templates
4. Configure checkout: Customize colors, add social proof

### File Hosting Options

| Method | Pros | Cons |
|--------|------|------|
| Lemon Squeezy built-in | Easiest, 1GB limit | Not ideal for frequent updates |
| GitHub Releases | Version control, public | Anyone can access without purchase |
| Cloudflare R2 | Cheap, private | Requires fulfillment logic |
| TeraCloud | Free 10GB, R2-compatible | Need to implement access control |

**Recommended**: Start with Lemon Squeezy built-in. Migration later is trivial.

### Checkout Integration

```html
<a href="https://store.lemonsqueezy.com/checkout/buy/[product-id]"
   class="ls-button">
  Buy Now - $29
</a>
```

Or use Lemon.js for overlay checkout:
```html
<script src="https://cdn.lemonsqueezy.com/lemon.js" defer></script>
<a href="https://store.lemonsqueezy.com/checkout/buy/[product-id]"
   class="lemonsqueezy-button">
  Purchase
</a>
```

---

## File Hosting Strategy

For Gumroad, file hosting is handled automatically.

If using a custom fulfillment flow (Lemon Squeezy / Payhip):

### Option A: GitHub Releases (Public)

```bash
# Create a release with files
gh release create v1.0 \
  --title "Notion Template Pack v1.0" \
  --notes "Initial release" \
  templates/notion-template-pack/*.md
```

**Problem**: Files are public. Anyone with the link can download without paying.

### Option B: Cloudflare R2 + Presigned URLs

```javascript
// Cloudflare Worker for fulfillment
export default {
  async fetch(request, env) {
    // Verify purchase via Lemon Squeezy API
    const purchaseId = new URL(request.url).searchParams.get('purchase');
    const valid = await verifyPurchase(purchaseId);

    if (!valid) return new Response('Unauthorized', { status: 401 });

    // Generate presigned URL for R2 object
    const url = await env.BUCKET.presigned(
      'notion-template-pack-v1.zip',
      { expiresIn: 86400 } // 24 hours
    );

    return Response.redirect(url);
  }
};
```

### Option C: Gumroad (Recommended)

Zero engineering. Gumroad handles:
- File storage
- Access control
- Delivery
- Updates

---

## Zero-Touch Fulfillment Flow

```
┌─────────────┐
│   Buyer     │
└──────┬──────┘
       │ clicks buy
       ▼
┌─────────────────┐
│ Gumroad Checkout │
└──────┬──────────┘
       │ payment
       ▼
┌─────────────────┐
│  Payment Gateway │ (Stripe/PayPal)
└──────┬──────────┘
       │ success
       ▼
┌─────────────────┐
│  Gumroad System  │
│  - Encrypt file  │
│  - Generate link │
│  - Send email    │
└──────────────────┘
       │
       ├──► Email with download link
       └──► Download page with link
```

**Manual intervention**: None.

---

## Discovery & Distribution

The platform won't drive sales. You need channels:

### Direct-to-Consumer Channels

| Channel | Strategy | Effort |
|---------|----------|--------|
| Twitter/X | Thread template → buy link | 1 hr |
| Indie Hackers | Launch post + comments | 30 min |
| Reddit | r/notion, r/SideProject | 30 min |
| Hacker News | "Show HN" if compelling angle | 30 min |
| Product Hunt | Scheduled launch | 2 hr prep |
| LinkedIn | Post for ops/product crowd | 30 min |
| Newsletter | Existing list or cross-promo | 30 min |

### Copy Template for Social

```markdown
Title: Ship faster with the ops system that runs an autonomous AI company

I've spent 6 months building Auto Company - an AI company that runs entirely without human decisions.

The secret sauce isn't more AI. It's better operations.

Today I'm releasing the exact Notion templates that power Auto Company:

→ Decision Log Template (capture + recall every decision)
→ Agent Workflow Playbook (14 AI agents, who does what)
→ Operating Principles (rules that prevent chaos)
→ Cycle Management (how work gets done)
→ Complete README (context for new agents)

$29. Instant download.
[Link]

If you're building with AI agents, this will save you 20+ hours.
```

---

## Launch Checklist

- [ ] Gumroad account created
- [ ] Product listing complete with all 5 files
- [ ] Payout method connected
- [ ] Test purchase completed (use 100% discount code)
- [ ] Download link verified
- [ ] Landing page "Buy" button updated
- [ ] Social copy written
- [ ] Launch channels selected (3-5 minimum)
- [ ] Webhook configured (optional, for email list)

---

## Metrics to Track

| Metric | Where | Target |
|--------|-------|--------|
| Page views | Google Analytics | 1000+ first week |
| Click-through to Gumroad | Gumroad analytics | 10%+ |
| Conversion rate | Gumroad | 1-3% |
| Revenue | Gumroad | Break even within 30 days |

---

## Migration Path

Start with Gumroad. Migrate when:
- Monthly revenue > $5,000
- OR you need software-specific features (license keys, subscriptions)
- OR you want to leverage affiliates (Payhip has better built-in)

Migration effort: Export customer list, import to new platform, update buy links. 2-3 hours.

---

## Next Action

1. Create Gumroad account
2. Upload product with 5 template files
3. Test purchase flow
4. Update landing page buy button
5. Launch on 3 channels (Twitter, Indie Hackers, Reddit)

**Time to launch**: 60 minutes.
