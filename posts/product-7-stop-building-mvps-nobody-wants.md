---
title: "Stop Building MVPs Nobody Wants: A Smoke Test Template"
description: "The sunk cost fallacy kills developer startups. Learn how to smoke test your SaaS idea before building the full MVP. Template included."
tags: ['smoketest', 'mvp', 'productvalidation', 'nextjs', 'saas', 'startup']
cover_image: "https://dev.to/uploads/articles/cover_image_placeholder.png"
published: false
---

## I Built a Full MVP. Zero Users. Here's What I Learned.

Two years ago, I spent 4 months building a developer tool. Full stack, polished UI, authentication, billing—everything.

Launched it on Product Hunt. Got 12 upvotes. **Zero paying customers.**

The problem wasn't the execution. The problem was: **nobody actually wanted this.**

I had fallen for the oldest trap in product development: building first, validating later.

## The Sunk Cost Fallacy of MVP Development

We developers are optimists. We think:
- "If I build it, they will come"
- "The execution will make people want it"
- "I just need to add more features"

This is the sunk cost fallacy in action. The more time we invest, the harder it is to admit the idea was bad.

**Reality check: Building the perfect MVP for a bad idea is still a bad idea.**

## Smoke Testing: The Antidote to Sunk Cost

A smoke test is a minimal experiment that validates demand before you invest months building.

Think of it as: **"Would people pay for this if it existed?"**

The answer comes from:
- A landing page describing your product
- A call-to-action (email waitlist, pre-order, demo request)
- Real traffic from your target audience

If nobody clicks "Get Started" on a free landing page, they won't pay for your full product either.

## Introducing the Smoke Test Template

I built a Next.js template specifically for smoke testing SaaS ideas. It's designed to:
- Deploy in 60 seconds
- Look professional without customization
- Capture early interest
- Test different value propositions

**Repository:** [eylulsenakumral/smoke-test-landing-pages](https://github.com/eylulsenakumral/smoke-test-landing-pages)

## Tutorial: Clone → Deploy → Validate

### Step 1: Clone the Template (10 seconds)

```bash
git clone https://github.com/eylulsenakumral/smoke-test-landing-pages.git my-saas-idea
cd my-saas-idea
```

### Step 2: Deploy to Vercel (30 seconds)

```bash
npm install
vercel
```

Follow the prompts. Your landing page is now live.

### Step 3: Customize Your Value Proposition (5 minutes)

Edit `app/page.tsx`:

```tsx
const hero = {
  title: "Your Product Name",
  tagline: "One sentence that explains the value",
  description: "Two sentences on what problem you solve",
  cta: "Join Waitlist"
};

const features = [
  { icon: "zap", title: "Feature 1", description: "What it does" },
  { icon: "shield", title: "Feature 2", description: "What it does" },
  { icon: "users", title: "Feature 3", description: "What it does" }
];
```

### Step 4: Connect Email Capture (5 minutes)

The template includes a form. Connect it to your email service:

```tsx
// app/actions.ts
import { waitlist } from '@/lib/waitlist';

export async function subscribe(formData: FormData) {
  const email = formData.get('email');

  // Store in your database
  await waitlist.create({ email });

  // Or connect to Resend/ConvertKit/Mailchimp
  // await resend.contacts.create({ email, listId: 'xxx' });

  return { success: true };
}
```

### Step 5: Deploy and Share (instant)

```bash
vercel --prod
```

Your smoke test is live. Share the URL and start collecting data.

## The Validation Framework

After 1-2 weeks of sharing your smoke test, you'll have data. Here's how to interpret it:

### The Decision Matrix

| Waitlist Signups | Decision | Next Steps |
|-----------------|----------|------------|
| 50+ | **BUILD** | Email waitlist, ask what features they want, build MVP |
| 20-49 | **PIVOT** | Interview signups, find the real pain point, adjust positioning |
| 10-19 | **NICHE** | Narrow your target audience, test again |
| <10 | **KILL** | Move to the next idea |

**These thresholds aren't arbitrary.** They come from experience:
- 50+ emails = enough for a successful beta launch
- 20-49 emails = potential exists but positioning needs work
- <10 emails = demand doesn't exist (or you're not reaching the right audience)

## Case Study: How Smoke Testing Saved Me 3 Months

Last year, I had an idea: "AI-powered code review service."

**Old me would have:**
- Built the full service
- Integrated with GitHub
- Implemented AI analysis
- Launched to crickets

**New me (with smoke testing):**
1. Deployed the template (60 seconds)
2. Wrote copy about AI code review (5 minutes)
3. Shared on Twitter/X and Reddit (1 week)
4. Got 4 emails

**Result:** KILL

Total time lost: **1 week** instead of 3 months.

## The Psychology Behind Smoke Testing

Smoke testing works because it leverages two cognitive biases:

### 1. The Commitment Bias

When someone gives you their email address, they've made a micro-commitment. They're saying "I'm interested enough to let you contact me."

**That's stronger than a Twitter like or a Product Hunt upvote.**

### 2. The Loss Aversion Bias

People are more motivated by avoiding loss than gaining benefit.

Your landing page should frame it as:
- ❌ "Don't miss out on early access"
- ✅ "Stop wasting time on [painful task]"

## Advanced: A/B Test Your Messaging

The template supports multiple variants. Test different value propositions:

```tsx
// Create variants
const variants = [
  {
    title: "AI Code Review",
    tagline: "Catch bugs before they reach production"
  },
  {
    title: "Ship Faster with AI",
    tagline: "Automated code review in your PRs"
  },
  {
    title: "The Code Review Tool Your Team Needs",
    tagline: "AI-powered feedback for every commit"
  }
];

// Randomly assign on visit
const variant = variants[Math.floor(Math.random() * variants.length)];
```

Track which variant gets more signups. That's your winner.

## Common Smoke Testing Mistakes

### Mistake 1: Building Too Much

Your smoke test should be:
- ✅ A landing page
- ✅ Email capture
- ✅ Clear value proposition

NOT:
- ❌ Authentication
- ❌ The actual product
- ❌ Multiple features
- ❌ Perfect design

**If your smoke test takes more than 1 hour, you're doing it wrong.**

### Mistake 2: Not Getting Enough Eyeballs

A smoke test with 10 visitors is meaningless. You need 100+ to make a decision.

**Share on:**
- Twitter/X (with relevant hashtags)
- Reddit (in relevant subreddits, carefully)
- Hacker News (if it's developer-focused)
- LinkedIn (if B2B)
- Relevant Discord/Slack communities

### Mistake 3: Ignoring Negative Results

4 emails after 1 week of sharing means something:
- Your idea doesn't have demand
- OR you're not reaching the right audience
- OR your messaging is wrong

**Don't just say "I'll build it anyway."** Find the problem before building.

## What If the Smoke Test Fails?

A failed smoke test is a success. It saved you months of work.

But before moving on, ask:
1. **Was I reaching the right audience?** (If not, try again with better targeting)
2. **Was my messaging clear?** (If not, rewrite the copy)
3. **Is the problem real?** (Talk to potential users, ask about their pain points)

If the answer is "yes, yes, yes" but signups are still low? **Kill the idea.**

## The Smoke Test Philosophy

This approach comes from a simple truth:

> "The only thing that matters is finding something people want." - Paul Graham

Smoke testing is how you find that "something" before investing months building.

**Build → Measure → Learn** in miniature form.

## When to Skip Smoke Testing

Smoke testing isn't for every project. Skip it if:
- You're building something for yourself (scratch your own itch)
- You already have paying customers lined up
- You're solving a problem you personally experience
- It's a client project (they're paying you to build it)

Smoke test if:
- You're exploring a new idea
- You don't have an existing audience
- The problem space is unfamiliar to you
- You want to validate before investing significant time

## From Smoke Test to MVP

Your smoke test hit 50+ emails. Now what?

1. **Email your waitlist** - Ask 2 questions:
   - "What's your biggest frustration with [problem]?"
   - "What would make this worth paying for?"

2. **Build the MVP** - Focus on the core feature:
   - Not authentication (use a simple password initially)
   - Not billing (use manual onboarding)
   - Not multiple features (just the main one)

3. **Invite waitlist to beta** - They're your first customers
   - Get feedback
   - Iterate
   - Launch when they're happy

4. **Launch publicly** - You already have advocates

## Get the Template

```
https://github.com/eylulsenakumral/smoke-test-landing-pages
```

1. Clone the repository
2. Deploy to Vercel
3. Customize the copy
4. Share the link
5. Make a data-driven decision

**Stop building MVPs that nobody wants. Smoke test first.**

---

**Repository:** [github.com/eylulsenakumral/smoke-test-landing-pages](https://github.com/eylulsenakumral/smoke-test-landing-pages)

**Template repo:** [github.com/eylulsenakumral/smoke-test-landing-pages](https://github.com/eylulsenakumral/smoke-test-landing-pages)

---

*Tags: #smoketest #mvp #productvalidation #nextjs #saas #startup #producthunt*
