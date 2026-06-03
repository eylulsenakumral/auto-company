# Cycle Management / Döngü Yönetimi

> Auto Company Ops Kit — Konsensüs Protokolü ve Çalışma Döngüleri

---

## What is a Cycle? / Döngü Nedir?

A **Cycle** is one complete work unit in Auto Company:

```
Start → Execute → Record → Consensus → End
```

**Typical cycle duration**: 2-6 hours
**Goal**: Ship something or make a significant decision

---

## Cycle Phases / Döngü Aşamaları

### Phase 1: Initialization / Başlatma

**Duration**: 5-10 minutes

**Actions**:
1. Read `memories/consensus.md` — Understand current state
2. Identify Next Action from previous cycle
3. Assemble required agents based on task type
4. Define success criteria

**Checklist**:
- [ ] Current phase understood?
- [ ] Next Action clear?
- [ ] Required agents identified?
- [ ] Success criteria defined?

---

### Phase 2: Execution / Yürütme

**Duration**: Variable (main work phase)

**Actions**:
1. Execute the task according to workflow
2. Agent collaboration as needed
3. Continuous progress tracking
4. Document outputs in `docs/<role>/`

**Agent Collaboration Rules**:
- **Parallel work**: Independent tasks run simultaneously
- **Sequential work**: Dependent tasks run in order
- **Consultation**: Any agent can consult any other agent
- **Disagreement**: CEO makes final call

**Example Workflow**:

```
Task: "Build a landing page for new product"

1. Product-Norman → Define features (15 min)
2. Interaction-Cooper → Design user flow (15 min)
3. UI-Duarte → Create visual design (30 min)
4. Fullstack-DHH → Implement code (60 min)
5. QA-Bach → Quality check (15 min)
6. DevOps-Hightower → Deploy (10 min)

Total: ~2.5 hours
```

---

### Phase 3: Verification / Doğrulama

**Duration**: 10-15 minutes

**Actions**:
1. Test what was built
2. Verify decision outcomes
3. Check quality gates
4. Validate against success criteria

**Quality Gates**:
- ✅ Code runs without errors
- ✅ Tests pass (if applicable)
- ✅ Deploy succeeded (if applicable)
- ✅ Decision documented (if decision)
- ✅ No regressions introduced

**Failure Modes**:
- 🐛 Bug found → Fix and re-verify
- 🚫 Deploy failed → Investigate, retry
- ❌ Decision invalid → Re-evaluate
- ⚠️ Quality gate not met → Address issue

---

### Phase 4: Consensus / Konsensüs

**Duration**: 5-10 minutes

**Actions**:
1. Update `memories/consensus.md` with:
   - What was done this cycle
   - Key decisions made
   - Updated project status
   - Next Action for next cycle
2. Store agent outputs in `docs/<role>/`
3. Document any new decisions or learnings

**Required Updates**:
```markdown
## Last Updated
2026-06-03 — Cycle #XX: [Summary]

## What We Did This Cycle
### Cycle #XX
- [What happened]
- [What changed]
- [What shipped]

## Key Decisions Made
1. [Decision 1]
2. [Decision 2]

## Active Projects
[Updated table]

## Next Action
[Clear next steps]
```

---

### Phase 5: Handoff / Devir

**Duration**: 2-3 minutes

**Actions**:
1. Confirm consensus.md is complete
2. Verify all outputs documented
3. Check no loose ends
4. Ready for next cycle

**Exit Checklist**:
- [ ] consensus.md updated?
- [ ] All outputs in `docs/<role>/`?
- [ ] Next Action clear?
- [ ] No orphaned work?
- [ ] No pending decisions?

---

## Convergence Rules / Yakınsama Kuralları

### Goal: Zero Pending Tasks / Amaç: Sıfır Bekleyen Görev

At cycle end, the system should be in a clean state:

✅ **No work in progress** — Everything done or documented
✅ **No pending decisions** — All decided or marked for next cycle
✅ **No orphaned outputs** — Everything in proper directories
✅ **No unclear state** — consensus.md reflects reality

### What to Do If... / Eğer... Ne Yapmalı?

| Situation | Action |
|-----------|--------|
| Task incomplete | Move to next cycle's Next Action |
| Decision unclear | Mark as Open Question, move to next cycle |
| Bug found but not fixed | Document, move to Next Action |
| Deploy blocked | Document blocker, move to alternative task |
| Agent disagreement | CEO decides, record decision |

---

## Runtime Guardrails / Çalışma Zamanı Korumaları

### Checkpoint System / Kontrol Noktası Sistemi

**Every 60 minutes**, run checkpoint:

```
1. Where are we? (Progress check)
2. Are we on track? (Success criteria)
3. Should we pivot? (Blocker detection)
4. ETA to cycle completion? (Time estimate)
```

### Timeout Rules / Zaman Aşımı Kuralları

| Cycle Type | Max Duration | Action if Exceeded |
|------------|--------------|-------------------|
| Feature build | 4 hours | Re-evaluate scope |
| Decision | 1 hour | CEO decides with available info |
| Deploy | 2 hours | Pause, investigate blocker |
| Research | 3 hours | Stop, use available data |

### Blocker Detection / Blokaj Tespiti

**Signs of blocker**:
- ⏱️ No progress for 30+ minutes
- 🔄 Same issue retried 3+ times
- ❌ Resource unavailable (API, auth, access)
- 🚫 Safety guardrail triggered

**Blocker Response**:
1. Document blocker in consensus.md
2. Mark dependent projects as PAUSED
3. Pivot to alternative unblocked work
4. Update Next Action to address blocker

---

## Consensus Protocol / Konsensüs Protokolü

### The共识 Memory File / Konsensüs Hafıza Dosyası

**Location**: `memories/consensus.md`

**Purpose**: Cross-cycle baton that carries state between cycles

**Structure**:
```markdown
# Auto Company Consensus

## Last Updated
[Date] — Cycle #[Number]: [Summary]

## Current Phase
[Phase name]

## What We Did This Cycle
[Cycle summary]

## Key Decisions Made
[List of decisions]

## Active Projects
[Project status table]

## Next Action
[Next cycle's task]

## Company State
[Revenue, users, metrics]

## Open Questions
[Unresolved issues]
```

### Update Rules / Güncelleme Kuralları

**When to update**:
- ✅ Every cycle end (REQUIRED)
- ✅ After major decision
- ✅ When project status changes
- ✅ When blocker encountered

**Who updates**:
- Agent who finished the work
- Or CEO if multi-agent cycle

**What to include**:
- What changed (not what existed before)
- Decisions made (not discussions)
- Clear next actions (not vague intentions)

---

## Team Workflow Examples / Takım İş Akışı Örnekleri

### Example 1: New Feature Development / Yeni Feature Geliştirme

```
Cycle #1: Requirements Definition
──────────────────────────────────
Duration: 90 minutes

1. Research-Thompson → Market validation (20 min)
2. Product-Norman → Feature specification (20 min)
3. Interaction-Cooper → User flow design (20 min)
4. UI-Duarte → Visual design (20 min)
5. CEO-Bezos → Priority decision (10 min)

Output:
- Product spec in docs/product/
- User flow in docs/interaction/
- Visual design in docs/ui/
- Decision: "Build this feature next"

Next Action: Implement feature (Cycle #2)
──────────────────────────────────
```

```
Cycle #2: Implementation
──────────────────────────────────
Duration: 180 minutes

1. Fullstack-DHH → Implementation (90 min)
2. QA-Bach → Quality check (30 min)
3. DevOps-Hightower → Deploy (30 min)
4. Operations-PG → User communication (30 min)

Output:
- Code in projects/[project]/
- QA report in docs/qa/
- Deploy configs in docs/devops/
- Announcement in docs/operations/

Next Action: Monitor metrics (Cycle #3)
──────────────────────────────────
```

### Example 2: Strategic Decision / Stratejik Karar

```
Cycle #3: Pricing Decision
──────────────────────────────────
Duration: 60 minutes

1. Research-Thompson → Market pricing research (15 min)
2. CFO-Campbell → Unit economics analysis (15 min)
3. Sales-Ross → Pricing strategy (10 min)
4. Critic-Munger → Risk assessment (10 min)
5. CEO-Bezos → Final decision (10 min)

Output:
- Market analysis in docs/research/
- Financial model in docs/cfo/
- Pricing strategy in docs/sales/
- Risk assessment in docs/critic/
- CEO decision in docs/ceo/

Next Action: Implement new pricing (Cycle #4)
──────────────────────────────────
```

---

## Cycle Anti-Patterns / Döngü Anti-Pattern'leri

### ❌ Bad Patterns / Kötü Pattern'ler

**Pattern 1: Endless Cycle**
- Symptom: Cycle runs for 8+ hours
- Cause: Scope creep or blocker ignored
- Fix: Split into multiple cycles

**Pattern 2: Orphaned Work**
- Symptom: Work done but not documented
- Cause: Skipped consensus update
- Fix: Always update consensus.md

**Pattern 3: Unclear Next Action**
- Symptom: Next cycle doesn't know what to do
- Cause: Poor handoff
- Fix: Explicit Next Action in consensus

**Pattern 4: Decision Paralysis**
- Symptom: Cycle debates for hours without deciding
- Cause: Missing CEO intervention
- Fix: CEO decides with available info

### ✅ Good Patterns / İyi Pattern'ler

**Pattern 1: Atomic Cycle**
- One clear objective
- Measurable outcome
- Clean handoff

**Pattern 2: Parallel Execution**
- Independent tasks run simultaneously
- Coordination only when needed
- Significant time savings

**Pattern 3: Progressive Refinement**
- Start with 70% information
- Make initial decision
- Iterate in next cycle

---

## Metrics & Tracking / Metrikler ve Takip

### Cycle Metrics / Döngü Metrikleri

Track in consensus.md:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Cycle duration | 2-6 hours | Start/end timestamps |
| Cycle completion rate | 95%+ | Cycles completed / started |
- Blockers per cycle | <0.5 | Count Open Questions |
- Decision time | <60 min | Time to decision |
- Deploy success rate | 90%+ | Successful deploys / attempts |

### Company Metrics / Şirket Metrikleri

Track in consensus.md:

| Metric | Current | Goal | Update Frequency |
|--------|---------|------|------------------|
| MRR | $X | $Y | Weekly |
- Users | X | Y | Weekly |
- Active projects | N | <5 | Per cycle |
- Cycle number | #XX | — | Every cycle |

---

## Quick Reference / Hızlı Referans

### Cycle Checklist / Döngü Kontrol Listesi

**Start of Cycle**:
- [ ] Read consensus.md
- [ ] Identify Next Action
- [ ] Assemble agents
- [ ] Define success criteria

**During Cycle**:
- [ ] Work according to workflow
- [ ] Document outputs
- [ ] Run checkpoints every 60 min
- [ ] Watch for blockers

**End of Cycle**:
- [ ] Verify outcome
- [ ] Update consensus.md
- [ ] Document all outputs
- [ ] Define Next Action
- [ ] Clean handoff

### Common Workflows / Ortak İş Akışları

| Task Type | Primary Agents | Duration |
|------------|----------------|----------|
- Feature definition | Product, Interaction, UI | 90 min |
- Implementation | Fullstack, QA, DevOps | 180 min |
- Strategic decision | CEO, Critic, CFO | 60 min |
- Market research | Research, CEO | 90 min |
- Product launch | QA, DevOps, Marketing, Operations | 120 min |

---

## Troubleshooting / Sorun Giderme

### Issue: Cycle stuck / Döngü takıldı

**Symptoms**:
- No progress for 30+ min
- Same issue retried 3+ times
- Agents going in circles

**Actions**:
1. Stop current work
2. Document blocker
3. CEO makes decision with available info
4. Move to alternative task
5. Return to blocked task later

### Issue: Consensus unclear / Konsensüs belirsiz

**Symptoms**:
- Next Action vague
- Project status unclear
- Conflicting priorities

**Actions**:
1. CEO reviews consensus.md
2. Clarifies Next Action
3. Updates project status
4. Resolves conflicts

### Issue: Agent disagreement / Ajan anlaşmazlığı

**Symptoms**:
- Two agents with different views
- No convergence possible
- Cycle blocked

**Actions**:
1. Both agents present evidence
2. CEO evaluates options
3. CEO makes final call
4. Decision documented
5. Move forward

---

*Bu protokol Auto Company'nin çalışma döngülerini yönetir. Her cycle bu formatta.*
