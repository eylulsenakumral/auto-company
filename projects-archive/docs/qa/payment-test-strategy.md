# Telegram Stars Payment - Test Strategy

**Product**: Telegram Notion Template Bot  
**QA Lead**: James Bach (QA-Bach)  
**Version**: 1.0 - MVP Week 1  
**Created**: 2026-06-03  

---

## Executive Summary

**Test Philosophy**: Exploratory testing with risk-based coverage. Payment systems demand rigorous verification because:

1. **Revenue impact**: Failed payments = lost money
2. **User trust**: Payment failures erode confidence immediately
3. **Platform risk**: Telegram's payment API has specific behaviors that must be understood
4. **Data integrity**: Orders must be tracked accurately

**Key Risk Areas Identified**:
- Payment webhook timing issues
- Idempotency failures (duplicate charges)
- Template delivery failures
- Insufficient balance handling
- User cancellation edge cases

---

## Risk Assessment Matrix

| Risk Area | Impact | Probability | Risk Score | Mitigation Priority |
|-----------|---------|-------------|------------|---------------------|
| Duplicate payment charge | **CRITICAL** | Medium | **CRITICAL** | P0 - Must prevent |
| Payment webhook timeout | **HIGH** | Medium | **HIGH** | P0 - Retry logic |
| Template delivery failure | **HIGH** | Low | **MEDIUM** | P1 - Idempotent retry |
| Insufficient Stars - unclear error | **MEDIUM** | High | **MEDIUM** | P1 - Clear messaging |
| User cancellation - state corruption | **MEDIUM** | Low | **LOW** | P2 - Session cleanup |
| Concurrent purchase race condition | **HIGH** | Low | **MEDIUM** | P1 - Database locking |

**Risk Scoring Definition**:
- **CRITICAL**: Revenue loss or legal liability
- **HIGH**: Significant user impact or data corruption
- **MEDIUM**: Degraded experience, recoverable
- **LOW**: Minor UX friction

---

## Exploratory Test Scenarios

### Scenario 1: Successful Payment → Template Delivery

**Purpose**: Verify happy path works end-to-end

**Test Steps**:
1. Start bot with `/start`
2. Browse templates via `/browse`
3. Select any template (e.g., "Agency Project Tracker - 150★")
4. Tap "Buy Now - 150★"
5. Verify invoice appears with correct amount
6. Tap "Pay 150 Stars"
7. **Wait**: Confirm payment processes (Telegram UI shows success)
8. Verify template delivery message arrives
9. Tap Notion link, confirm it opens and is duplicate-able

**Expected Results**:
- Invoice shows exact template price
- Payment completes without errors
- Delivery message arrives within 5 seconds
- Notion link is valid and accessible
- Order status in SQLite: `completed`

**Failure Modes to Watch For**:
- Payment succeeds but no delivery message
- Delivery message arrives but Notion link is invalid
- Long delay (>10s) between payment and delivery
- Order stuck in `pending` status

**Exploratory Variations**:
- Try same template twice (should create separate orders)
- Buy multiple templates in rapid succession
- Close Telegram app during payment processing

---

### Scenario 2: Insufficient Stars → Clear Error Message

**Purpose**: Verify user understands why payment failed

**Test Steps**:
1. Check current Stars balance in Telegram
2. If balance > required Stars, spend Stars elsewhere first
3. Attempt template purchase (e.g., 150★ required, balance 45★)
4. Tap "Pay" on invoice
5. Observe Telegram's error UI

**Expected Results**:
- Telegram shows "Insufficient Stars" error clearly
- Bot shows helpful message: "You don't have enough Telegram Stars. Required: 150★, Your balance: 45★"
- "Add Stars" button links to Telegram's Stars purchase flow
- No order created in SQLite (or status: `failed`)
- User can retry after adding Stars

**Failure Modes to Watch For**:
- Bot crashes on payment failure
- Unclear error message (e.g., generic "Payment failed")
- Order created with `pending` status despite failure
- User cannot retry after adding Stars

**Exploratory Variations**:
- Exactly 0 Stars balance
- Balance 1 Star less than required
- Balance exactly equal to required amount

---

### Scenario 3: User Cancellation → Graceful Exit

**Purpose**: Verify cancellation doesn't corrupt state

**Test Steps**:
1. Start purchase flow for any template
2. When invoice appears, tap "Cancel" or close payment UI
3. Return to bot, tap "Browse Templates"
4. Verify bot still works normally

**Expected Results**:
- Bot shows "Payment Cancelled. No problem!" message
- User can browse templates immediately
- No order created in SQLite (or status: `cancelled`)
- Session state is clean (no leftover purchase context)
- "Browse" and "Home" buttons work

**Failure Modes to Watch For**:
- Bot stuck in "awaiting payment" state
- Can't browse other templates after cancellation
- Session corrupted, need to `/start` again
- Order created with `pending` status despite cancellation

**Exploratory Variations**:
- Cancel immediately after invoice appears
- Cancel after payment timeout (30+ seconds)
- Rapid cancel/retry cycles

---

### Scenario 4: Edge Cases - Webhook Timeout & Duplicate Payment

**Purpose**: Verify system resilience under failures

#### 4A. Webhook Timeout Simulation

**Test Steps**:
1. Start bot but with artificial delay injected in webhook handler
2. Purchase template
3. Wait for Telegram's webhook retry (exponential backoff)
4. Verify order processes correctly on retry

**Expected Results**:
- Initial webhook attempt fails (timeout)
- Telegram retries webhook (1s, 2s, 4s, 8s...)
- Order processes successfully on retry
- No duplicate template delivery
- No duplicate order in SQLite

**Failure Modes to Watch For**:
- Webhook succeeds but order not created (timeout after success)
- Multiple retries create multiple orders
- User gets multiple delivery messages

#### 4B. Duplicate Payment (Idempotency Test)

**Test Steps**:
1. Purchase template
2. Manually trigger same payment webhook twice (test script)
3. Verify only one order created

**Expected Results**:
- `telegram_payment_charge_id` UNIQUE constraint enforced
- Second webhook attempt rejected (409 Conflict or silently ignored)
- Only one delivery message sent
- SQLite contains exactly one order

**Failure Modes to Watch For**:
- Duplicate orders created
- User charged twice (Telegram should prevent this)
- Database constraint violation crashes bot

---

### Scenario 5: Race Condition - Concurrent Purchases

**Purpose**: Verify database locking works

**Test Steps**:
1. Open two Telegram chats with bot (different users)
2. Both users purchase same template simultaneously
3. Verify both orders created independently

**Expected Results**:
- Both users receive templates
- No cross-talk between sessions
- Orders have distinct IDs and user IDs
- No deadlock or timeout in SQLite

**Failure Modes to Watch For**:
- One user's purchase blocks the other
- Database lock timeout (>5s)
- Orders merged or corrupted

---

## Local Testing Approach (Without Production)

**Challenge**: Telegram Stars payments require production Telegram app

**Solution**: Mocked payment flow for local development

### Mock Payment Flow Setup

```typescript
// test/mock-payment-handler.ts
export function mockPaymentFlow(templateId: string, userId: number) {
  // 1. Simulate successful payment
  const mockPayment = {
    successful_payment: {
      currency: "XTR",
      total_amount: templatePrice,
      invoice_payload: templateId,
      telegram_payment_charge_id: `mock_${Date.now()}`,
      provider_payment_charge_id: null,
    }
  };

  // 2. Trigger bot's payment handler directly
  bot.handleSuccessfulPayment(mockPayment);

  // 3. Verify SQLite order created
  const order = db.getOrder(userId, templateId);
  assert(order.status === 'completed');
  assert(order.delivery_message_id !== null);
}
```

**Local Testing Scenarios**:
1. Mock successful payment → verify order + delivery
2. Mock failed payment → verify error handling
3. Mock timeout → verify retry logic
4. Mock duplicate → verify idempotency

**Limitations**:
- Cannot test actual Telegram UI/UX
- Cannot test real Telegram webhook retries
- Must do final verification in production

---

## Pre-Deploy Checklist

### Code & Configuration

- [ ] `telegram_payment_charge_id` UNIQUE constraint enforced in SQLite
- [ ] Webhook handler idempotent (safe to retry)
- [ ] Error handling for all payment statuses (pending, succeeded, failed, expired)
- [ ] Timeout handling (webhook > 30s should return 500 for retry)
- [ ] Session cleanup on cancellation
- [ ] Logging: all payment events logged with `user_id`, `template_id`, `charge_id`

### Database Verification

- [ ] `orders` table schema matches architecture doc
- [ ] Indexes created: `idx_orders_user_id`, `idx_orders_payment_status`
- [ ] Foreign key constraints (if any tables added)
- [ ] Backup strategy tested (SQLite export/import)

### Environment Variables

- [ ] `TELEGRAM_BOT_TOKEN` valid and active
- [ ] `DATABASE_URL` points to correct SQLite path
- [ ] `NODE_ENV=production` (enables production logging)
- [ ] Railway environment variables synced

### Webhook Setup

- [ ] Webhook URL set via Bot API: `setWebhook`
- [ ] Webhook responds with 200 OK to all Telegram requests
- [ ] Webhook timeout < 30s (Telegram's timeout)
- [ ] SSL valid (Railway provides this)

### Production Testing

- [ ] Test purchase with real Stars (minimum 1 template)
- [ ] Verify delivery link works in Notion
- [ ] Test insufficient Stars error
- [ ] Test cancellation flow
- [ ] Verify Railway logs accessible

### Monitoring & Debugging

- [ ] Railway logs streaming works
- [ ] Error tracking (e.g., Sentry) configured (optional Week 2)
- [ ] Order query script ready (`SELECT * FROM orders WHERE ...`)
- [ ] Runbook for common issues (webhook failures, stuck orders)

---

## Automated vs Manual Testing

### MUST Automate (Unit Tests)

```typescript
// tests/payment-handler.test.ts
describe('Payment Handler', () => {
  it('creates order on successful payment', async () => {
    const result = await handlePayment(mockSuccessfulPayment);
    expect(result.order.status).toBe('completed');
  });

  it('rejects duplicate payment charge_id', async () => {
    await handlePayment(mockPayment);
    await expect(handlePayment(mockPayment)).rejects.toThrow('Duplicate charge');
  });

  it('handles timeout gracefully', async () => {
    const slowHandler = withTimeout(handlePayment, 5000);
    await expect(slowHandler(slowDatabase)).rejects.toThrow('Timeout');
  });
});
```

**Coverage Goals**:
- Payment handler unit tests: 100% (critical path)
- Database operations: 90%+ (idempotency, constraints)
- Error cases: 80%+ (timeout, duplicate, insufficient funds)

### MUST Test Manually (E2E)

- **Telegram UI interaction**: Can't automate without headless Telegram
- **Webhook retry behavior**: Requires real Telegram server
- **Payment UX**: Button placement, message clarity
- **Notion link validity**: Must open real Notion URL
- **Production Stars flow**: Can't mock in test environment

**Manual Test Frequency**:
- **Pre-deploy**: Full E2E test suite (10 scenarios)
- **Post-deploy**: Smoke test (1 successful purchase)
- **Weekly**: Full regression if changes made

### Can Defer (Post-MVP)

- Load testing (100+ concurrent users) → Week 2
- Performance monitoring (Latency, p95) → Week 2
- Analytics dashboards (Revenue, conversion) → Week 2
- Automated E2E with Playwright → Week 2 (if web app added)

---

## Test Data Requirements

### Templates (for testing)

```json
[
  {
    "id": "test-template-1",
    "name": "Test Template - 10 Stars",
    "price_stars": 10,
    "notion_url": "https://notion.so/test-template-duplicate"
  },
  {
    "id": "test-template-2", 
    "name": "Test Template - 50 Stars",
    "price_stars": 50,
    "notion_url": "https://notion.so/test-template-duplicate"
  }
]
```

### Test Users

- **User A (Premium)**: 1000+ Stars balance (test successful payments)
- **User B (Basic)**: 10 Stars balance (test insufficient funds)
- **User C (New)**: 0 Stars, first-time bot user

---

## Success Criteria

**Deployment is successful when**:

1. ✅ **Happy path works**: User can purchase template and receive Notion link
2. ✅ **Error paths work**: Insufficient Stars and cancellation handled gracefully
3. ✅ **No duplicate charges**: Idempotency verified (manual test)
4. ✅ **Webhook retries**: Timeout scenario tested and recovers
5. ✅ **Data integrity**: Orders table accurate, no orphaned records
6. ✅ **Monitoring**: Logs accessible, can debug issues

**Go/No-Go Decision**:
- **GO**: All 6 criteria met
- **NO-GO**: Any criterion fails → fix and retest

---

## Post-Deploy Monitoring Plan

### First 24 Hours (Critical)

- Monitor Railway logs for errors every 2 hours
- Check `orders` table for stuck `pending` statuses
- Verify 5+ test purchases complete successfully
- Watch for webhook timeout spikes

### First Week

- Daily check of revenue vs orders count (should match)
- Review any user reports of payment issues
- Monitor webhook error rate (target: < 1%)
- Check for duplicate `charge_id` violations

### Week 2+

- Set up automated alerts (Sentry/PagerDuty)
- Weekly revenue reconciliation
- Monthly audit of `orders` table data quality

---

## Open Questions & Risks

### Questions for Fullstack-DHH

1. **Webhook timeout**: What's the current timeout setting? Telegram retries up to 24 hours - can our handler handle long-running DB operations?
2. **Idempotency**: Is `telegram_payment_charge_id` validation implemented at DB level or app level?
3. **Session storage**: If bot restarts during payment, what happens to in-memory session state?
4. **Notion link validity**: How do we verify Notion links are accessible before listing them?

### Risks Requiring Monitoring

1. **Telegram API changes**: Payment API is still evolving - watch for breaking changes
2. **Webhook delivery delays**: Telegram's webhook queue can lag during high traffic
3. **Notion link rot**: Template URLs may become invalid - need periodic verification

---

## Conclusion

**Test Strategy is complete. Key takeaways**:

1. **Risk-based approach**: Focus on duplicate charges and webhook timeouts (CRITICAL)
2. **Exploratory testing**: Manual E2E required for Telegram UI and payment UX
3. **Idempotency is king**: Every payment handler must be safely retryable
4. **Local testing**: Mock payment flow for dev, production for final verification
5. **Monitoring first**: Week 1 is about visibility, Week 2 is about optimization

**Next Action**: Fullstack-DHH implements bot, then this test strategy executes before production launch.

---

*Test Strategy v1.0 - QA-Bach*  
*Auto Company - Autonomous AI Company*
