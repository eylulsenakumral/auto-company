# Auto Company Ops Kit — Landing Page Visual Design Specification

**Product**: Auto Company Ops Kit - Notion Template Pack for Autonomous AI Companies
**Designer**: ui-duarte (Matías Duarte Design Philosophy)
**Version**: 1.0
**Created**: 2026-06-03

---

## Design Philosophy

This specification follows **Material Design principles** adapted for a modern, Notion-like premium aesthetic:

1. **Material Metaphor** — Subtle depth through layered surfaces, elevation through shadows, not skeuomorphic
2. **Bold, Graphic, Intentional** — Typography-first design, intentional color use, every element earns its place
3. **Motion Provides Meaning** — Transitions explain relationships, scroll animations guide attention
4. **Adaptive Design** — Mobile-first approach that scales gracefully to desktop

---

## Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--blue-50` | #EFF6FF | Subtle backgrounds, hero gradient base |
| `--blue-100` | #DBEAFE | Secondary backgrounds, hover states |
| `--blue-500` | #3B82F6 | Primary links, accents |
| `--blue-600` | #2563EB | Primary CTA background |
| `--blue-700` | #1D4ED8 | CTA hover, active states |
| `--blue-900` | #1E3A8A | Dark mode primary, footer links |

### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--gray-50` | #F9FAFB | Page background, subtle sections |
| `--gray-100` | #F3F4F6 | Card backgrounds, borders |
| `--gray-200` | #E5E7EB | Subtle borders, dividers |
| `--gray-400` | #9CA3AF | Muted text, secondary labels |
| `--gray-600` | #4B5563 | Body text, descriptions |
| `--gray-800` | #1F2937 | Headings, primary text |
| `--gray-900` | #111827 | Dark backgrounds, dark mode |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--emerald-500` | #10B981 | Success indicators, pricing checkmarks |
| `--emerald-600` | #059669 | Pricing hover states |
| `--amber-500` | #F59E0B | Warning notices, featured badges |

### Semantic Colors

- `--text-primary`: `--gray-900` (light), `--gray-50` (dark)
- `--text-secondary`: `--gray-600` (light), `--gray-400` (dark)
- `--bg-surface`: `--white` (light), `--gray-900` (dark)
- `--bg-surface-elevated`: `--gray-50` (light), `--gray-800` (dark)

---

## Typography System

**Font Family**: Inter (Google Fonts)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--display-lg` | 48px | 700 | 1.1 | Hero heading (desktop) |
| `--display-md` | 36px | 700 | 1.2 | Section headings |
| `--display-sm` | 30px | 600 | 1.3 | Card titles, large emphasis |
| `--h1` | 24px | 700 | 1.3 | Page headings |
| `--h2` | 20px | 600 | 1.4 | Subsection headings |
| `--h3` | 18px | 600 | 1.5 | Card titles |
| `--body-lg` | 18px | 400 | 1.6 | Lead paragraphs |
| `--body` | 16px | 400 | 1.6 | Body text |
| `--body-sm` | 14px | 400 | 1.5 | Secondary text, captions |
| `--caption` | 12px | 500 | 1.4 | Labels, small UI text |
| `--overline` | 11px | 600 | 1.4 | Category labels, badges |

**Mobile Adjustments**:
- `--display-lg`: 36px (28px < 425px)
- `--display-md`: 28px (24px < 425px)
- `--display-sm`: 24px

---

## Spacing System

**Base Unit**: 4px (consistent 8px grid)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

**Section Padding**: `--space-20` (mobile: `--space-12`)

---

## Elevation System

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Flat elements, headers |
| 1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards on hover |
| 2 | `0 4px 12px rgba(0,0,0,0.1)` | Cards, pricing tables |
| 3 | `0 8px 24px rgba(0,0,0,0.12)` | Modals, dropdowns |
| 4 | `0 16px 48px rgba(0,0,0,0.15)` | Sticky headers, prominent CTAs |

---

## Component Specifications

### Buttons

**Primary CTA**
```css
.btn-primary {
  background: var(--blue-600);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  background: var(--blue-700);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-800);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid var(--gray-200);
}
```

**Touch Target**: Minimum 44×44px (mobile)

### Cards

```css
.card {
  background: var(--white);
  border-radius: 12px;
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border: 1px solid var(--gray-100);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
```

### Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: var(--caption);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-featured {
  background: var(--amber-500);
  color: white;
}
```

---

## Layout Structure

### Global Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.container-narrow {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}
```

### Header (Sticky)

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-4) 0;
}
```

**Header Content**:
- Left: Logo "Auto Company Ops Kit" (Inter, 600, 18px, `--gray-900`)
- Right: CTA Button "Get Templates"

---

## Section Specifications

### 1. Hero Section

**Height**: 80vh (min: 500px)
**Background**: Subtle gradient from `--blue-50` to white

**Layout**:
```css
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-20) var(--space-6);
}
```

**Content**:
- **Badge**: "Battle-Tested AI System" (amber badge)
- **Heading**: "Run Your Company Like an AI" (display-lg, `--gray-900`)
- **Subheading**: "4 Notion templates from a fully autonomous AI company. 14 agents. Zero human involvement." (body-lg, `--gray-600`, max-width: 600px)
- **CTAs**:
  - Primary: "Get the Templates" (links to pricing)
  - Secondary: "How It Works" (anchor link)

**Motion**:
- Fade-in up animation (0.6s ease, staggered)
- Subtle floating badge animation

---

### 2. Problem/Solution Section

**Background**: `--gray-50`

**Layout**: Two-column grid (stacks on mobile)

```css
.problem-solution {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  padding: var(--space-20) 0;
}
```

**Problem Column**:
- Heading: "Chaos Without System" (h2)
- Bullet points (red checkmarks or X icons):
  - Decisions lost in Slack
  - No clear decision framework
  - Agent roles undefined
  - Workflows inconsistent

**Solution Column**:
- Heading: "Clarity With Auto Company" (h2)
- Bullet points (green checkmarks):
  - Every decision logged
  - Clear decision principles
  - 14 expert AI agents defined
  - 6 standard workflows

---

### 3. 4 Templates Showcase

**Background**: White

**Layout**: 2×2 grid (mobile: 1×4 stacked)

```css
.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
}
```

**Template Card Structure**:
```css
.template-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

**Each Card**:
1. **Icon**: 48×48px, `--blue-100` bg, `--blue-600` icon
2. **Title**: Template name (h3, `--gray-900`)
3. **Description**: 2-line description (body-sm, `--gray-600`)
4. **Features**: 3-4 bullet points (caption, `--gray-600`, checkmarks)

**Template Content**:

| Card | Title | Description |
|------|-------|-------------|
| 1 | Decision Log | Track every company decision. Context preserved across cycles. |
| 2 | Agent Workflow Playbook | 14 AI agents defined. When to use each. 6 standard workflows. |
| 3 | Operating Principles | Safety guardrails. Decision framework. Communication norms. |
| 4 | Cycle Management | 5-phase cycles. Consensus protocol. Convergence rules. |

---

### 4. Pricing Section

**Background**: `--gray-50`

**Layout**: 3-column pricing table (mobile: stacked)

```css
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}
```

**Pricing Card Structure**:
```css
.pricing-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-8);
  background: var(--white);
  border-radius: 12px;
  border: 1px solid var(--gray-200);
}

.pricing-card.featured {
  border: 2px solid var(--blue-600);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
  position: relative;
}
```

**Tier Content**:

| Element | Core | Pro | Enterprise |
|---------|------|-----|------------|
| Badge | - | - | "Featured" |
| Price | $49 | $99 | $199 |
| Features | 4 templates, basic support | + Notion dashboard, + automation examples | + Custom agent configs, + consultation |
| CTA | "Get Core" | "Get Pro" | "Get Enterprise" |
| CTA Style | Secondary | Primary | Secondary |

**Featured Badge** (Pro tier):
- Positioned: top-right, overlapping border
- Style: amber badge, "Most Popular"

---

### 5. FAQ Section

**Background**: White

**Layout**: Accordion (expand/collapse)

```css
.faq-item {
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-6) 0;
}
```

**FAQ Items**:
1. Can I use this for my company?
2. Do I need 14 agents?
3. Can I customize the agents?
4. How do I implement this?
5. Is there a demo?
6. What format are the templates?

**Interaction**:
- Click to expand/collapse
- Chevron icon rotates 180deg
- Smooth height transition (0.3s ease)

---

### 6. Final CTA Section

**Background**: Gradient from `--blue-600` to `--blue-700`

**Layout**: Centered, narrow container

```css
.final-cta {
  text-align: center;
  padding: var(--space-20) var(--space-6);
  color: white;
}
```

**Content**:
- Heading: "Ready to Run Your Company Like an AI?" (display-md, white)
- Subheading: "Get the complete Ops Kit. Start your first autonomous cycle today." (body, blue-100)
- Primary CTA: "Telegram @tolgabrk" (large, white bg, `--blue-600` text)
- Note: "Templates delivered via Notion link" (caption, blue-200)

---

### 7. Footer

**Background**: `--gray-900`

**Layout**: 3-column (mobile: stacked)

```css
.footer {
  padding: var(--space-12) var(--space-6);
  color: var(--gray-400);
}
```

**Columns**:
1. **Brand**: "Auto Company Ops Kit", copyright
2. **Links**: Documentation, GitHub Issues
3. **Contact**: Telegram @tolgabrk

---

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1200px;
```

**Mobile (< 768px)**:
- Stack all grids vertically
- Reduce spacing by 33%
- Hide decorative elements
- Larger touch targets (min 44px)

**Tablet (768px - 1024px)**:
- 2-column grids
- Adjusted typography scale
- Preserved card layout

**Desktop (> 1024px)**:
- Full layout
- Hover effects enabled
- Maximum container width: 1200px

---

## Animation Specifications

### Scroll Animations

```css
.fade-in-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Trigger**: Intersection Observer, threshold 0.1

### Hover States

- Cards: lift 2px, shadow increase
- Buttons: slight lift, shadow increase
- Links: color change, underline animation

### Page Load

- Hero: staggered fade-in (0.1s delays)
- Sections: fade-in-up on scroll
- Images/videos: fade-in + scale 0.98→1

---

## Accessibility Requirements

**Color Contrast**:
- All text: minimum 4.5:1 (WCAG AA)
- Headings: 7:1 preferred
- Interactive elements: 3:1 minimum

**Keyboard Navigation**:
- All CTAs: accessible via Tab
- Focus indicators: 2px `--blue-600` outline
- Skip links: for main content

**Screen Reader**:
- Semantic HTML (header, nav, main, section, footer)
- ARIA labels for icon-only buttons
- Alt text for all images
- Descriptive link text (not "click here")

**Touch Targets**:
- Minimum 44×44px (mobile)
- Minimum 24×24px spacing between targets

---

## Performance Considerations

**Font Loading**:
- Inter via Google Fonts (display-swap)
- Preconnect to fonts.gstatic.com

**Image Optimization**:
- WebP format with JPEG fallback
- Lazy loading below fold
- srcset for responsive images

**CSS**:
- Critical CSS inline
- Non-critical CSS deferred
- PurgeCSS for production

---

## Implementation Notes

**Tailwind CSS Classes Reference**:

```css
/* Primary CTA */
class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"

/* Card */
class="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200"

/* Badge */
class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-amber-500 text-white"
```

**Custom CSS Needed**:
- Gradient backgrounds
- Smooth scroll behavior
- Custom animation keyframes
- Focus ring styles

---

## Brand Elements

**Logo**:
- Text: "Auto Company Ops Kit"
- Font: Inter, weight 600
- Color: `--gray-900`

**Tagline**:
- "Make Money Legally."
- Font: Inter, weight 400, italic
- Color: `--gray-600`

**Social Proof** (if added):
- "Battle-Tested" badge
- "14 AI Agents" count
- "Zero Human Involvement" highlight

---

## Dark Mode (Optional)

**Background**: `--gray-900`
**Surface**: `--gray-800`
**Text Primary**: `--gray-50`
**Text Secondary**: `--gray-400`
**Borders**: `--gray-700`

**Component Adjustments**:
- Cards: `--gray-800` bg, `--gray-700` border
- Buttons: Maintain contrast ratios
- Gradients: Adjust to dark palette

---

## File Structure Recommendation

```
landing-page/
├── index.html
├── styles/
│   ├── base.css (typography, colors, spacing)
│   ├── components.css (buttons, cards, badges)
│   └── sections.css (hero, pricing, etc.)
├── scripts/
│   ├── animations.js (scroll observers, fade-ins)
│   └── interactions.js (FAQ, mobile menu)
└── assets/
    ├── icons/ (SVG sprites)
    └── images/ (optimized WebP)
```

---

## Design Deliverables

When implementing this spec, ensure:

1. **Exact colors** from color system
2. **Inter font** loaded properly
3. **Responsive behavior** at all breakpoints
4. **Smooth animations** (60fps)
5. **Accessibility compliance** (WCAG AA minimum)
6. **Performance** (Lighthouse score 90+)

---

**Next Steps**: After design approval, proceed with:
1. Create HTML structure following semantic markup
2. Implement Tailwind CSS classes
3. Add custom CSS for special cases
4. Integrate animation scripts
5. Test across browsers and devices
6. Validate accessibility (axe DevTools)
7. Performance audit (Lighthouse)
