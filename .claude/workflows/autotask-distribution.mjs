export const meta = {
  name: 'autotask-distribution-strategy',
  description: 'AutoTask extension distribution decision & execution workflow',
  phases: [
    { title: 'CFO Analysis', detail: 'Cost-benefit analysis of Chrome Store vs GitHub' },
    { title: 'CEO Decision', detail: 'Strategic evaluation and final call' },
    { title: 'Operations Review', detail: 'User acquisition feasibility check' },
    { title: 'Execute', detail: 'Deploy chosen distribution strategy' }
  ],
}

// PHASE 1: CFO Analysis
phase('CFO Analysis')

const cfoAnalysis = await agent(`
You are CFO Patrick Campbell. Analyze AutoTask v0.1.0-beta distribution options.

CONTEXT:
- Extension: AutoTask browser automation (13KB ZIP)
- GitHub Release: https://github.com/eylulsenakumral/autotask-app/releases/tag/v0.1.0-beta
- Current: $0 revenue, 0 users
- Goal: First users, then revenue

OPTION A: Chrome Web Store
- Cost: $5 one-time fee
- Review: 1-3 days
- Benefits: Credibility, SEO, easier installation
- Reach: 2.5B+ Chrome users

OPTION B: GitHub Only
- Cost: $0
- Immediate: Available now
- Friction: "Load unpacked" (developer mode)
- Reach: Developers/technical users only

OUTPUT (JSON):
{
  "recommendation": "A" | "B",
  "reason": "Brief justification",
  "unit_economics": {
    "cac_target": "$X",
    "ltv_estimate": "$Y",
    "payback_period": "X months"
  },
  "risk_assessment": {
    "option_a_risk": "low/medium/high",
    "option_b_risk": "low/medium/high"
  }
}
`, { schema: {
  type: "object",
  properties: {
    recommendation: { type: "string", enum: ["A", "B"] },
    reason: { type: "string" },
    unit_economics: {
      type: "object",
      properties: {
        cac_target: { type: "string" },
        ltv_estimate: { type: "string" },
        payback_period: { type: "string" }
      },
      required: ['cac_target', 'ltv_estimate', 'payback_period']
    },
    risk_assessment: {
      type: "object",
      properties: {
        option_a_risk: { type: "string" },
        option_b_risk: { type: "string" }
      },
      required: ['option_a_risk', 'option_b_risk']
    }
  },
  required: ['recommendation', 'reason', 'unit_economics', 'risk_assessment']
}, phase: 'CFO Analysis', label: 'CFO cost-benefit analysis' })

log(`CFO recommends: Option ${cfoAnalysis.recommendation}`)

// PHASE 2: CEO Decision
phase('CEO Decision')

const ceoDecision = await agent(`
You are CEO Jeff Bezos. Make final call on AutoTask distribution.

CFO RECOMMENDATION: Option ${cfoAnalysis.recommendation}
REASON: ${cfoAnalysis.reason}

UNIT ECONOMICS:
- CAC Target: ${cfoAnalysis.unit_economics.cac_target}
- LTV Estimate: ${cfoAnalysis.unit_economics.ltv_estimate}
- Payback: ${cfoAnalysis.unit_economics.payback_period}

RISK ASSESSMENT:
- Option A risk: ${cfoAnalysis.risk_assessment.option_a_risk}
- Option B risk: ${cfoAnalysis.risk_assessment.option_b_risk}

PRINCIPLES:
1. Customer-first
2. Ship > perfection
3. Ramen profitability first
4. Act at 70% information

DECIDE NOW. No hedging.

OUTPUT (JSON):
{
  "decision": "A" | "B",
  "rationale": "Clear executive decision reasoning",
  "next_actions": ["action1", "action2", "..."]
}
`, { schema: {
  type: "object",
  properties: {
    decision: { type: "string", enum: ["A", "B"] },
    rationale: { type: "string" },
    next_actions: { type: "array", items: { type: "string" } }
  },
  required: ['decision', 'rationale', 'next_actions']
}, phase: 'CEO Decision', label: 'CEO final decision' })

log(`CEO decides: Option ${ceoDecision.decision}`)

// PHASE 3: Operations Review
phase('Operations Review')

const opsReview = await agent(`
You are Paul Graham (Operations). Review execution feasibility for Option ${ceoDecision.decision}.

CEO DECISION: Option ${ceoDecision.decision}
RATIONALE: ${ceoDecision.rationale}

NEXT ACTIONS FROM CEO:
${ceoDecision.next_actions.map((a, i) => `${i+1}. ${a}`).join('\n')}

ASSETS AVAILABLE:
- Marketing listing: docs/marketing/autotask-chrome-store-listing.md
- Privacy policy: Ready
- GitHub Release: Live
- Extension ZIP: 13KB

OUTPUT (JSON):
{
  "feasible": true | false,
  "blocking_issues": ["issue1", "issue2"] | [],
  "user_acquisition_plan": {
    "channel_1": "description",
    "channel_2": "description"
  },
  "estimated_first_users": "number range",
  "timeline_to_first_user": "X days"
}
`, { schema: {
  type: "object",
  properties: {
    feasible: { type: "boolean" },
    blocking_issues: { type: "array", items: { type: "string" } },
    user_acquisition_plan: {
      type: "object",
      additionalProperties: { type: "string" }
    },
    estimated_first_users: { type: "string" },
    timeline_to_first_user: { type: "string" }
  },
  required: ['feasible', 'blocking_issues', 'user_acquisition_plan', 'estimated_first_users', 'timeline_to_first_user']
}, phase: 'Operations Review', label: 'Operations feasibility check' })

log(`Operations review: ${opsReview.feasible ? 'FEASIBLE' : 'BLOCKED'}`)

// Handle blocking issues
if (!opsReview.feasible) {
  log('BLOCKING ISSUES:')
  opsReview.blocking_issues.forEach(issue => log(`- ${issue}`))

  // Ask CEO for pivot
  const pivot = await agent(`
You are CEO Bezos. Operations blocked Option ${ceoDecision.decision}.

BLOCKING ISSUES:
${opsReview.blocking_issues.map((i, idx) => `${idx+1}. ${i}`).join('\n')}

PIVOT NOW. Choose the other option or propose alternative.

OUTPUT (JSON):
{
  "pivot_decision": "A" | "B" | "alternative",
  "new_rationale": "Why this pivot makes sense"
}
`, { schema: {
    type: "object",
    properties: {
      pivot_decision: { type: "string" },
      new_rationale: { type: "string" }
    },
    required: ['pivot_decision', 'new_rationale']
  }, phase: 'Execute', label: 'CEO pivot decision' })

  log(`CEO pivots to: Option ${pivot.pivot_decision}`)
}

// PHASE 4: Execute
phase('Execute')

const finalDecision = opsReview.feasible ? ceoDecision.decision : (pivot?.pivot_decision || 'B')

const executionPlan = await agent(`
You are DevOps Kelsey Hightower. Create execution plan for Option ${finalDecision}.

MARKETING ASSETS:
- Chrome Store listing: docs/marketing/autotask-chrome-store-listing.md
- Privacy policy: Ready
- Screenshots: Need 1280x800 or 640x400 (OPTION A only)

GITHUB REPO: https://github.com/eylulsenakumral/autotask-app
RELEASE: v0.1.0-beta

OUTPUT (JSON):
{
  "execution_steps": [
    { "step": 1, "action": "...", "tool": "...", "command": "..." }
  ],
  "screenshots_needed": true | false,
  "payment_required": true | false,
  "estimated_time_to_complete": "X hours"
}
`, { schema: {
  type: "object",
  properties: {
    execution_steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          step: { type: "number" },
          action: { type: "string" },
          tool: { type: "string" },
          command: { type: "string" }
        }
      }
    },
    screenshots_needed: { type: "boolean" },
    payment_required: { type: "boolean" },
    estimated_time_to_complete: { type: "string" }
  },
  required: ['execution_steps', 'screenshots_needed', 'payment_required', 'estimated_time_to_complete']
}, phase: 'Execute', label: 'DevOps execution plan' })

// Return complete workflow result
return {
  cycle: 16,
  distribution_strategy: finalDecision === 'A' ? 'Chrome Web Store' : 'GitHub Only',
  cfo_recommendation: cfoAnalysis.recommendation,
  ceo_decision: ceoDecision.decision,
  ceo_rationale: ceoDecision.rationale,
  operations_feasible: opsReview.feasible,
  user_acquisition: opsReview.user_acquisition_plan,
  estimated_first_users: opsReview.estimated_first_users,
  timeline_to_first_user: opsReview.timeline_to_first_user,
  execution_steps: executionPlan.execution_steps,
  screenshots_needed: executionPlan.screenshots_needed,
  payment_required: executionPlan.payment_required,
  estimated_time_to_complete: executionPlan.estimated_time_to_complete,
  next_actions: ceoDecision.next_actions,
  consensus_update_required: true
}
