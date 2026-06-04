# Landing Page Visual Improvements - Design Document

**Designer:** Matias Duarte
**Date:** 2025-01-03
**Products:** Product Launch Tool + Bot Analytics Dashboard
**Goal:** Increase visual appeal and conversion rate before outreach resumes

---

## Problem Analysis

### Current State Issues

**Product Launch Tool:**
- Hero section blends into background — weak visual hierarchy
- Value proposition buried in 4-line paragraph
- CTA button functional but not compelling ("Download Launch-Ready Markdown")
- No visual proof of value beyond feature list
- Color scheme safe (orange/zinc) but lacks energy

**Bot Analytics Dashboard:**
- Hero uses dashboard itself (good) but value prop is generic description
- "Live" badge is only visual element showing freshness
- CTA is missing entirely — no clear next action
- Blue/gray palette professional but forgettable
- Trust elements absent (no user count, no testimonials)

### Shared Problems
1. **Hero sections don't stop the scroll** — no visual hook, no energy
2. **Value propositions are explanations, not promises** — descriptive vs aspirational
3. **CTAs are functional labels, not benefit-driven actions** — what it does vs what you get
4. **No social proof** — no user counts, testimonials, or trust badges
5. **Visual hierarchy flat** — everything same importance, no focal point

---

## Design Principles Applied

1. **Bold, Graphic, Intentional** — typography becomes hero, color has purpose
2. **Motion Provides Meaning** — visual elements explain value, not just decorate
3. **Adaptive Design** — mobile-first approach, clear hierarchy at all sizes
4. **Material Metaphor** — elevation and shadows create depth, cards float above surface

---

## Product Launch Tool - Visual Improvements

### Hero Section Redesign

#### Current Layout
```
[Title: Product Launch Tool]
[Subtitle: 4-line paragraph]
[3 feature checkmarks]
[How it works → link]
```

#### Proposed Layout
```
[Badge: "No Signup Required" ← NEW]
[Headline: "Launch on Product Hunt in 5 Minutes" ← STRONGER]
[Subheadline: "Draft, preview, and export your perfect Product Hunt launch. No signup, no BS." ← SHORTER]
[Primary CTA: "Start My Free Launch" ← BENEFIT-FOCUSED]
[Secondary CTA: "See Example →" ← NEW]
[Social Proof: "500+ makers launched" ← NEW]
```

#### Color System

**Primary Palette (Action):**
- Primary Button: `bg-orange-600 hover:bg-orange-700` (darker, more premium)
- Gradient: `from-orange-500 to-rose-500` (modern gradient)
- Accent: `text-orange-600` (links, highlights)

**Secondary Palette (Trust):**
- Background: `from-zinc-50 via-white to-zinc-50` (subtle gradient, depth)
- Cards: `bg-white shadow-xl border-zinc-100` (elevate cards)
- Text: `text-zinc-900` (near black, better contrast)

**New Accent (Energy):**
- Highlight: `text-rose-600` (for key benefits, stats)
- Badge: `bg-rose-100 text-rose-700` (for "New" or "No Signup")

#### Typography Scale

```css
/* Headline */
text-5xl → text-6xl (bigger, bolder)
font-bold → font-extrabold
tracking-tight

/* Subheadline */
text-lg → text-xl
font-medium
leading-relaxed

/* CTA Button */
text-base → text-lg
font-semibold → font-bold
```

#### Visual Elements to Add

**1. Hero Badge (New)**
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold mb-6">
  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
  No Signup Required
</div>
```

**2. Social Proof Bar (New)**
```tsx
<div className="flex items-center justify-center gap-8 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
  <div className="flex items-center gap-2">
    <span className="text-orange-500 text-lg">🚀</span>
    <span className="font-semibold">500+ launches</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-orange-500 text-lg">⭐</span>
    <span className="font-semibold">4.8/5 rating</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-orange-500 text-lg">⚡</span>
    <span className="font-semibold">5 min avg</span>
  </div>
</div>
```

**3. Feature Icons (Replace checkmarks)**
```tsx
<div className="flex items-center justify-center gap-6 mb-8">
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
      💾
    </div>
    <span className="text-sm font-medium text-zinc-700">Auto-save</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
      👁
    </div>
    <span className="text-sm font-medium text-zinc-700">Live Preview</span>
  </div>
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
      📥
    </div>
    <span className="text-sm font-medium text-zinc-700">Instant Export</span>
  </div>
</div>
```

### CTA Improvements

#### Current CTA Issues
- Text: "Download Launch-Ready Markdown" (descriptive, not exciting)
- Color: `bg-orange-500` (flat, no gradient)
- Size: Adequate but could be bigger
- Secondary action: "Clear Form" (destructive, not helpful)

#### Proposed CTAs

**Primary CTA:**
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
  Start My Free Launch →
</button>
```

**Why This Works:**
- "Start My Free Launch" — personal, benefit-focused, action-oriented
- Gradient adds visual weight and modern feel
- Bigger size (py-4) + shadow = more prominent
- Arrow implies forward momentum
- Scale transform = micro-interaction feedback

**Secondary CTA (Replace "Clear Form"):**
```tsx
<button className="px-6 py-4 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-orange-500 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 font-semibold rounded-xl transition-all duration-300">
  See Example Launch →
</button>
```

**Why This Works:**
- Shows before/after example (proof of value)
- Non-destructive (doesn't lose data)
- Arrow indicates preview action
- Border stroke = outline button pattern (secondary action)

### Hero Layout Structure

```tsx
<div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
  {/* Hero Section */}
  <div className="container mx-auto px-4 pt-16 pb-24">
    <div className="max-w-4xl mx-auto text-center">
      {/* Badge */}
      <div className="mb-6">[Badge: No Signup Required]</div>

      {/* Headline */}
      <h1 className="text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-6 tracking-tight">
        Launch on Product Hunt<br />
        <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
          in 5 Minutes
        </span>
      </h1>

      {/* Subheadline */}
      <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
        Draft, preview, and export your perfect Product Hunt launch. No signup, no BS.
      </p>

      {/* Social Proof */}
      <div className="mb-8">[Social Proof Bar]</div>

      {/* Feature Icons */}
      <div className="mb-10">[Feature Icons]</div>

      {/* CTAs */}
      <div className="flex items-center justify-center gap-4">
        [Primary CTA]
        [Secondary CTA]
      </div>
    </div>
  </div>

  {/* Form Section (below hero) */}
  <div className="container mx-auto px-4 pb-16">
    [Grid with form + preview]
  </div>
</div>
```

### Section Order (Information Architecture)

1. **Hero** (above fold) — promise + CTAs
2. **How It Works** (immediate trust) — 3-step process
3. **Live Demo** (proof) — form + preview side-by-side
4. **Testimonials** (social proof) — maker quotes
5. **FAQ** (objection handling) — common questions
6. **Final CTA** (conversion) — one last push

---

## Bot Analytics Dashboard - Visual Improvements

### Hero Section Redesign

#### Current Layout
```
[Title: Bot Analytics Dashboard]
[Subtitle: Generic description]
[Live badge]
[3 feature checkmarks]
[Why use this → link]
[Dashboard preview below]
```

#### Proposed Layout
```
[Badge: "Free Forever Plan" ← NEW]
[Headline: "Stop Guessing. Start Measuring." ← EMOTIONAL HOOK]
[Subheadline: "Real-time metrics that tell you exactly how your bot is performing. No credit card required." ← CLEAR VALUE]
[Live Demo Preview (RIGHT) ← VISUAL PROOF]
[Value Props (LEFT) ← 3 KEY BENEFITS]
[Primary CTA: "View Live Demo" ← ACTION-ORIENTED]
[Secondary CTA: "Explore Features" ← LOW-FRICTION]
[Trust Signals: "100+ bots monitored" ← NEW]
```

#### Layout Strategy: Split Hero

Instead of centered text, use **two-column layout**:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Left Column: Copy */}
  <div>
    [Badge]
    [Headline]
    [Subheadline]
    [Value Props with Icons]
    [CTAs]
    [Trust Signals]
  </div>

  {/* Right Column: Live Preview */}
  <div>
    [Dashboard preview card]
    [Floating metric cards]
  </div>
</div>
```

**Why This Works:**
- Left: readable, scannable (benefits first)
- Right: visual proof (product does what it says)
- Above fold: both value proposition AND proof visible

#### Color System

**Primary Palette (Trust + Action):**
- Primary Button: `bg-blue-600 hover:bg-blue-700`
- Gradient: `from-blue-600 to-indigo-600` (professional gradient)
- Accent: `text-indigo-600` (highlights, links)

**Secondary Palette (Calm):**
- Background: `from-slate-50 via-white to-slate-50` (subtle depth)
- Cards: `bg-white shadow-xl border-slate-100`
- Text: `text-slate-900`

**New Accent (Data/Energy):**
- Highlight: `text-emerald-600` (for "Live", positive trends)
- Charts: `from-blue-500 to-indigo-500` gradients

#### Typography Scale

```css
/* Headline */
text-3xl → text-5xl (much bigger)
font-bold → font-extrabold
tracking-tight

/* Subheadline */
text-base → text-xl
font-medium → font-semibold
leading-relaxed
```

#### Visual Elements to Add

**1. Hero Badge (New)**
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
  Free Forever Plan
</div>
```

**2. Value Props with Icons (Replace checkmarks)**
```tsx
<div className="space-y-4 mb-8">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
      📊
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">Real-time Metrics</h3>
      <p className="text-sm text-slate-600">See active users, messages, and errors as they happen</p>
    </div>
  </div>
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
      ⚡
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">Error Tracking</h3>
      <p className="text-sm text-slate-600">Spot issues before users complain</p>
    </div>
  </div>
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
      📈
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">Trend Analysis</h3>
      <p className="text-sm text-slate-600">Understand usage patterns and optimize performance</p>
    </div>
  </div>
</div>
```

**3. Dashboard Preview Card (Right Column)**
```tsx
<div className="relative">
  {/* Main card */}
  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-slate-900">Live Dashboard</h3>
      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        Live
      </span>
    </div>

    {/* Mini metrics grid */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-50 rounded-lg p-3">
        <p class="text-xs text-slate-600">Active Users</p>
        <p class="text-xl font-bold text-slate-900">1,247</p>
        <p class="text-xs text-emerald-600">↑ 12%</p>
      </div>
      <div className="bg-slate-50 rounded-lg p-3">
        <p class="text-xs text-slate-600">Messages/Day</p>
        <p class="text-xl font-bold text-slate-900">8.4K</p>
        <p class="text-xs text-emerald-600">↑ 8%</p>
      </div>
    </div>
  </div>

  {/* Floating metric card (decorative) */}
  <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-xl p-4 text-white">
    <p class="text-xs opacity-80">Error Rate</p>
    <p class="text-2xl font-bold">0.2%</p>
    <p class="text-xs opacity-80">↓ 45%</p>
  </div>
</div>
```

### CTA Improvements

#### Current CTA Issues
- No CTA in hero (missing conversion opportunity)
- "Why use this" link is weak (informational, not action)

#### Proposed CTAs

**Primary CTA:**
```tsx
<button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
  View Live Demo →
</button>
```

**Why This Works:**
- "View Live Demo" — immediate value, no commitment
- Gradient = modern, professional
- Big, bold = primary action clear
- Arrow = forward momentum

**Secondary CTA:**
```tsx
<button className="px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300">
  Explore Features
</button>
```

**Why This Works:**
- Low-friction alternative (curious but not ready to commit)
- "Explore" vs "View Demo" — browsing vs experiencing
- Outline button pattern = secondary action

### Hero Layout Structure

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
  {/* Header/Hero */}
  <div className="container mx-auto px-4 py-16">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Copy */}
      <div>
        {/* Badge */}
        <div className="mb-6">[Badge: Free Forever Plan]</div>

        {/* Headline */}
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 tracking-tight">
          Stop Guessing.<br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Start Measuring.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Real-time metrics that tell you exactly how your bot is performing. No credit card required.
        </p>

        {/* Value Props */}
        <div className="mb-8">[Value Props with Icons]</div>

        {/* CTAs */}
        <div className="flex items-center gap-4 mb-8">
          [Primary CTA]
          [Secondary CTA]
        </div>

        {/* Trust Signals */}
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-blue-500">🤖</span>
            <span>100+ bots monitored</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">⚡</span>
            <span>Real-time updates</span>
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div>
        [Dashboard Preview Card]
      </div>
    </div>
  </div>

  {/* Main Dashboard (below hero) */}
  <div className="container mx-auto px-4 pb-16">
    [Full metrics grid + charts]
  </div>
</div>
```

### Section Order (Information Architecture)

1. **Hero** (above fold, split layout) — promise + proof
2. **Live Dashboard** (immediate engagement) — interactive demo
3. **Why Use This** (trust) — 3 benefits + metrics list
4. **Features Deep Dive** (education) — detailed capability showcase
5. **Testimonials** (social proof) — user quotes
6. **Pricing** (conversion) — free forever plan highlighted
7. **FAQ** (objection handling) — common questions
8. **Final CTA** (conversion) — last chance to engage

---

## Visual Elements Summary

### Icons to Use

**Product Launch Tool:**
- Hero badge: 🔥 or ⚡ (energy, speed)
- Feature icons: 💾 (save), 👁 (preview), 📥 (export)
- Social proof: 🚀 (launches), ⭐ (rating), ⚡ (speed)

**Bot Analytics Dashboard:**
- Hero badge: 💎 or 🎁 (value, free)
- Value props: 📊 (metrics), ⚡ (errors), 📈 (trends)
- Trust signals: 🤖 (bots), ⚡ (real-time), 🔒 (secure)

### Trust Badges

**Add to both pages:**

```tsx
{/* Trust Badge Bar */}
<div className="flex items-center justify-center gap-8 py-8 border-y border-slate-200 dark:border-slate-800">
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-green-500">✓</span>
    <span>No Signup Required</span>
  </div>
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-green-500">✓</span>
    <span>Free Forever</span>
  </div>
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-green-500">✓</span>
    <span>No Credit Card</span>
  </div>
</div>
```

### Gradients

**Product Launch Tool:**
- Headline accent: `from-orange-600 to-rose-600`
- CTA button: `from-orange-600 to-rose-600`
- Feature icons: `from-orange-400 to-rose-500`

**Bot Analytics Dashboard:**
- Headline accent: `from-blue-600 to-indigo-600`
- CTA button: `from-blue-600 to-indigo-600`
- Charts: `from-blue-500 to-indigo-500`

### Shadows and Elevation

```css
/* Cards */
shadow-sm → shadow-lg (more depth)
border-zinc-200 → border-zinc-100 (lighter, modern)

/* CTA Buttons */
shadow-md → shadow-xl (more weight)
hover:shadow-lg → hover:shadow-2xl (feedback)

/* Preview Cards */
shadow-lg → shadow-2xl (hero element)
```

---

## Responsive Design Considerations

### Mobile (< 768px)

**Product Launch Tool:**
- Headline: `text-4xl` (from `text-6xl`)
- Feature icons: Stack vertically, 3 per row → 1 per row
- CTAs: Stack vertically, full width

**Bot Analytics Dashboard:**
- Split hero → stacked (copy first, preview below)
- Value props: Stack vertically (already stacked)
- Dashboard preview: Full width, scale down

### Tablet (768px - 1024px)

**Product Launch Tool:**
- Feature icons: 2 per row
- Form + preview: Stack vertically (from side-by-side)

**Bot Analytics Dashboard:**
- Split hero: Keep 2-column, reduce gap
- Dashboard preview: Scale to fit width

### Desktop (> 1024px)

**Product Launch Tool:**
- Feature icons: 3 per row
- Form + preview: Side-by-side

**Bot Analytics Dashboard:**
- Split hero: Max width containers
- Dashboard preview: Full scale

---

## Implementation Priority

### Phase 1 (Quick Wins - Today)

1. **Product Launch Tool Hero**
   - Add badge ("No Signup Required")
   - Rewrite headline (bigger, bolder, gradient)
   - Improve CTAs (benefit-focused text, gradient, bigger)
   - Add social proof bar (500+ launches, etc.)

2. **Bot Analytics Dashboard Hero**
   - Add badge ("Free Forever Plan")
   - Rewrite headline (emotional hook)
   - Add CTAs (primary + secondary)
   - Add trust signals (100+ bots)

### Phase 2 (Visual Polish - This Week)

1. **Product Launch Tool**
   - Replace checkmarks with icon cards
   - Add testimonials section (use placeholder quotes for now)
   - Improve "How It Works" section (bigger step numbers, more spacing)

2. **Bot Analytics Dashboard**
   - Implement split hero layout
   - Add dashboard preview card (right column)
   - Improve "Why Use This" section (icon-based benefits)

### Phase 3 (Conversion Optimization - Next Week)

1. **Product Launch Tool**
   - Add example launch CTA (secondary action)
   - Add trust badge bar (no signup, free, no credit card)
   - Rewrite testimonials (more specific, credible)

2. **Bot Analytics Dashboard**
   - Add pricing section (highlight free forever plan)
   - Add feature deep dive section
   - Rewrite "Why Use This" to be benefit-focused

---

## Metrics to Track

### Before/After Comparison

**Metrics to Measure:**
1. **Time on page** (longer = more engaged)
2. **Bounce rate** (lower = more compelling hero)
3. **CTA click rate** (higher = better conversion)
4. **Scroll depth** (further = more convincing)

**Success Criteria:**
- Time on page: +30% increase
- Bounce rate: -20% decrease
- CTA clicks: +50% increase
- Scroll to bottom: +40% increase

---

## Accessibility Considerations

### Color Contrast

All text must meet WCAG AA standards:
- Body text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio against background

**Recommended Changes:**
- `text-zinc-700` → `text-zinc-800` (darker for better contrast)
- `text-zinc-600` → `text-zinc-700` (subtitles, body)
- Button text: Always white on dark backgrounds

### Touch Targets

All buttons and links must meet minimum size:
- Minimum: 44px × 44px (WCAG AAA)
- Recommended: 48px × 48px (easier to tap)

**Current CTAs:**
- Height: `py-3` (12px padding) ≈ 48px total ✓
- Improved: `py-4` (16px padding) ≈ 52px total ✓✓

### Screen Reader Support

- Use semantic HTML (`<h1>`, `<h2>`, `<button>`, `<a>`)
- Add `aria-label` to icon-only buttons
- Use proper heading hierarchy (h1 → h2 → h3)
- Don't rely on color alone to convey meaning

---

## Next Steps

1. **Review this document** with product-norman and ceo-bezos
2. **Get approval** on direction and priorities
3. **Delegate to fullstack-dhh** for implementation
4. **QA by qa-bach** before deployment
5. **Deploy by devops-hightower** to production

**Timeline:**
- Review + approval: 1 day
- Phase 1 implementation: 1 day
- Phase 2 implementation: 3 days
- Phase 3 implementation: 5 days
- Total: 10 days to full redesign

---

## Appendix: Copy Alternatives

### Product Launch Tool Headlines

**Option 1 (Chosen):**
"Launch on Product Hunt in 5 Minutes"

**Option 2:**
"Your Product Hunt Launch, Ready in Minutes"

**Option 3:**
"Stop Stressing. Start Launching."

### Bot Analytics Dashboard Headlines

**Option 1 (Chosen):**
"Stop Guessing. Start Measuring."

**Option 2:**
"See Exactly How Your Bot Performs"

**Option 3:**
"Bot Analytics That Actually Matters"

### CTA Button Copy

**Product Launch Tool:**
- Chosen: "Start My Free Launch →"
- Alt: "Draft My Launch →"
- Alt: "Launch Now →"

**Bot Analytics Dashboard:**
- Chosen: "View Live Demo →"
- Alt: "Try It Free →"
- Alt: "Explore Dashboard →"
