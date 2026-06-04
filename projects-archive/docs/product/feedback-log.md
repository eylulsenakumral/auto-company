# Product Feedback Log

## Purpose
Capture ALL feedback from outreach, support, and usage. This drives product decisions.

## Log Format

```markdown
## Feedback #[Number]

**Source:** [Platform/Post link - e.g., "Reddit: r/SideProject - 'Launching soon' post"]
**User:** [Username - keep anonymous if sensitive]
**Date:** [Timestamp - ISO format]
**Product:** [Product Hunt Tool / Bot Analytics Dashboard]

**Type:** [Feature request / Bug / UX issue / Confusion / Pricing question / Integration request / Performance issue / Other]

**Feedback:**
[Direct quote or detailed summary]

**Impact:** [Critical / High / Medium / Low - How many users likely affected? How blocking is it?]

**Priority:** [P0 (Fix now) / P1 (Next sprint) / P2 (Backlog) / P3 (Nice to have)]

**Status:** [New / In Progress / Done / Won't Fix / Duplicate]

**Our Response:** [What we replied / action taken]

**Outcome:** [How user responded / Did they engage further?]

**Learnings:** [What this tells us about user needs / product direction]
```

---

## Feedback Entries

*No feedback yet - outreach execution pending*

---

## Weekly Summary (Updated every Sunday)

### Week 1 (Day 1-7)
**Total Feedback:** ____
**Critical Issues:** ____
**High Priority:** ____
**Most Common Request:** [TBD]
**Surprising Insights:** [TBD]
**Action Items for Next Week:** [TBD]

### Week 2 (Day 8-14)
*To be filled*

---

## Feedback Categories

### Critical (P0) - Fix This Week
- *Example: "Tool crashes when I try to add more than 5 products"*
- *Example: "Can't even get past the first step"*
- **Definition:** Blocks core functionality, affects many users

### High Priority (P1) - Fix Next Sprint
- *Example: "Can't edit once I've saved"*
- *Example: "Would love to filter by date"*
- **Definition:** Important feature missing or UX friction

### Medium Priority (P2) - Backlog
- *Example: "Would be cool if it had dark mode"*
- *Example: "Can I export to CSV?"*
- **Definition:** Nice to have, low volume requests

### Low Priority (P3) - Nice to Have
- *Example: "The color scheme is ok but maybe..."*
- *Example: "Could the logo be bigger?"*
- **Definition:** Cosmetic, very low impact

---

## Decision Framework

### When to Act on Feedback

**Act Immediately (P0):**
- Bug affecting >10% of users
- Security issue
- Data loss risk
- Complete blocker

**Act This Sprint (P1):**
- Feature requested by 3+ users
- UX friction mentioned by 2+ users
- Competitive gap
- High-value user request

**Backlog (P2):**
- Feature requested by 1-2 users
- Nice to have improvements
- Low-impact issues

**Won't Fix (P3):**
- Out of scope
- Conflicting with vision
- Cost > benefit
- Very low demand

---

## Pattern Detection

### Watch For These Patterns:

**Same feature requested 3+ times:**
→ Move to P1, prioritize next sprint

**Same UX issue mentioned 2+ times:**
→ P1, fix this sprint

**Competitor mentioned 3+ times:**
→ Research competitor, understand gap

**Integration requested 3+ times:**
→ Consider building integration

**"Confusing" mentioned 2+ times:**
→ UX review, fix onboarding

**"Doesn't work" with no details:**
→ Reach out for debugging, may be P0 bug

---

## Weekly Review Process

**Every Sunday evening:**

1. **Count total feedback entries**
   - How many this week?
   - Trend: Going up/down?

2. **Categorize by type**
   - Features: ____
   - Bugs: ____
   - UX issues: ____
   - Other: ____

3. **Identify top 3 patterns**
   - What are people asking for most?
   - What's confusing?
   - What's breaking?

4. **Update priorities**
   - Any P0 → Fix immediately
   - P1 → Add to sprint
   - P2 → Keep in backlog

5. **Decide on action**
   - What to build this week?
   - What to investigate?
   - What to ignore?

6. **Document decisions**
   - Update consensus with decisions
   - Update product roadmap
   - Communicate to team

---

## Integration with Consensus

**After weekly review, update `/memories/consensus.md`:**

```markdown
## Week X Feedback Summary

**Total Feedback:** ____ entries
**Top Requests:** [List]
**Critical Issues:** [List]
**Decisions Made:** [What we're doing about it]
**Next Action:** [What to build/fix this week]
```

---

## Outreach Response Correlation

**Track which outreach messages got responses:**

| Message # | Platform | Target | Replies? | Feedback Quality |
|----------|----------|--------|----------|-----------------|
| 1 | IndieHackers | "Launching in 12 days" | [Yes/No] | [High/Med/Low/None] |
| 2 | r/SideProject | "Launching soon - tips?" | [Yes/No] | [High/Med/Low/None] |
| ... | ... | ... | ... | ... |

**Purpose:** Learn which messaging works best for next batch

---

*Auto Company - Feedback-Driven Development*
*Last Updated: 2026-06-03 (Cycle #71)*
*Status: Awaiting outreach execution → first feedback expected 24-48 hours after send*
