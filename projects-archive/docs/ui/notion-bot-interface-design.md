# Telegram Notion Template Bot - UI Design Specification

**Designer:** UI-Duarte (Matías Duarte)  
**Date:** 2026-06-03  
**Version:** 1.0 - Week 1 MVP  
**Platform:** Telegram Bot API (Native Interface)

---

## Design Philosophy

### Material Principles Applied to Telegram

1. **Physical Intuition in Chat**
   - Buttons should feel pressable (visual hierarchy)
   - Message order creates narrative flow (top→bottom = time)
   - Transitions explain location changes (back/edit/delete)

2. **Bold, Graphic, Intentional**
   - Typography first: emoji as icons, bold for emphasis
   - Every button text explains its action
   - Whitespace separates concerns (sections, flows)

3. **Motion Provides Meaning**
   - Bot responses = system feedback (typing state matters)
   - Edit/delete messages = state changes
   - Button presses = immediate acknowledgment

4. **Adaptive Design**
   - Mobile-first (95% use case)
   - Desktop compatibility (inline keyboard limits)
   - Touch targets: 44px minimum (Telegram enforces)

---

## Telegram Bot API Constraints (Week 1 MVP)

| Constraint | Limit | Design Implication |
|-----------|-------|-------------------|
| Button text | 64 characters | Verbs + object, no sentences |
| Callback data | 64 bytes | Use codes, not full URLs |
| Inline buttons per row | 2-5 optimal | Cognitive load + layout |
| Total buttons per message | ~10 max | Split complex menus |
| Photo size | 10MB upload | Compress previews |
| Caption length | 1024 characters | Truncate descriptions |

---

## 1. Conversation Flow Diagrams

### 1.1 Initial Flow (/start)

```
USER                   BOT
│                      │
├── /start ────────────>│
│                      │
│                      ├──┐
│                      │├│ "Welcome! 🎯"
│                      ││ "Browse 5 Notion templates"
│                      │├│
│                      │└──> [Main Menu]
│                      │    • Browse Templates 📚
│                      │    • My Templates ⭐
│                      │    • Help & Support 💬
│                      │
│<─────────────────────┤
│  [Inline Keyboard]    │
│  [Browse] [My][Help]  │
```

**Button Texts:**
- `📚 Browse Templates`
- `⭐ My Templates`
- `💬 Help & Support`

**Message Template:**
```
Welcome to Auto Template Bot! 🎯

Browse premium Notion templates to boost your productivity.

All templates are delivered instantly via Telegram Stars payment.

Choose an option below to get started.
```

### 1.2 Browse Flow

```
USER                   BOT
│                      │
├── [Browse] ──────────>│
│                      │
│                      ├──┐
│                      │├│ "Select a category"
│                      │├│
│                      │└──> [Category Menu]
│                      │    • 🏠 Personal Productivity
│                      │    • 💼 Business & Work
│                      │    • 📊 Project Management
│                      │    • 🎓 Student & Academic
│                      │    • 🎨 Creative & Design
│                      │    ◀ Back to Menu
│                      │
│<─────────────────────┤
```

**Button Texts:**
- `🏠 Personal Productivity`
- `💼 Business & Work`
- `📊 Project Management`
- `🎓 Student & Academic`
- `🎨 Creative & Design`
- `◀️ Back to Menu`

### 1.3 Template Selection Flow

```
USER                   BOT
│                      │
├── [Category] ────────>│
│                      │
│                      ├──┐
│                      │├│ "Templates in [Category]"
│                      │├│ [Template Card 1]
│                      │├│ [Template Card 2]
│                      │├│ ... (max 5 per message)
│                      │├│
│                      │└──> [Template List]
│                      │    • View Details
│                      │    • Next Page →
│                      │    ◀ Back to Categories
│                      │
│<─────────────────────┤
```

**Template Card Format:**
```
📦 Ultimate Life Planner
⭐⭐⭐⭐⭐ (24 reviews)
💫 150 Stars

[View Details]
```

**Button Texts:**
- `🔍 View Details`
- `➡️ Next Page`
- `◀️ Back to Categories`

### 1.4 Template Detail Flow

```
USER                   BOT
│                      │
├── [View Details] ───>│
│                      │
│                      ├──┐
│                      │├│ "Template Name"
│                      │├│ [Description]
│                      │├│ [Features List]
│                      │├│ [Preview Image]
│                      │├│ Price: 150 Stars ⭐
│                      │├│
│                      │└──> [Action Buttons]
│                      │    • ⭐ Buy for 150 Stars
│                      │    • 📸 View Preview
│                      │    • ◀ Back to List
│                      │
│<─────────────────────┤
```

**Detail Message Template:**
```
📦 Ultimate Life Planner

DESCRIPTION:
Master your days with this all-in-life planner template. 
Perfect for busy professionals who want to stay organized.

✨ FEATURES:
• Daily, weekly, monthly views
• Habit tracking with streaks
• Goal setting & progress
• Project management sections
• Finance tracking
• Notes & journal integration

⭐⭐⭐⭐⭐ 24 reviews
💫 150 Stars

Choose an action below:
```

**Button Texts:**
- `⭐ Buy for 150 Stars`
- `📸 View Preview`
- `◀️ Back to List`

---

## 2. Button Layout Specifications

### 2.1 Button Text Patterns

**Pattern: `[Icon] [Verb] [Object] [Context]`**

| Component | Rules | Examples |
|-----------|-------|----------|
| Icon | Optional, 1 emoji max | 📦, ⭐, 🏠, ◀️ |
| Verb | Mandatory, imperative | Buy, View, Browse, Go |
| Object | Mandatory | Templates, Details, Menu |
| Context | Optional (only if needed) | for 150 Stars, to Categories |

**Valid Examples:**
- `⭐ Buy for 150 Stars`
- `📚 Browse Templates`
- `🔍 View Details`
- `◀️ Back to Menu`

**Invalid Examples:**
- `Click here to purchase this template` ❌ (too long, no emoji)
- `BUY NOW!!!` ❌ (all caps, unclear action)
- `Template` ❌ (missing verb)

### 2.2 Button Count per Screen

| Screen Type | Buttons | Layout (rows) | Rationale |
|------------|---------|---------------|-----------|
| Main Menu | 3 | [1], [1], [1] | Simple start, no cognitive load |
| Categories | 6 | [2], [2], [2] | All categories visible, no scroll |
| Template List | 3 | [1], [2] | Actions + navigation |
| Template Detail | 3 | [1], [2] | Primary action + secondary |
| Payment | 2 | [1], [1] | Binary choice, clear action |
| Success | 2 | [1], [1] | Next step + home |

### 2.3 Navigation Menu Structure

**Rule: Always provide "Back" button except root level**

```
[Root Level: Main Menu]
├─ No back button (use "Back to Menu" only when deep)

[Category Level]
├─ ◀️ Back to Menu

[Template List Level]  
├─ ◀️ Back to Categories
├─ ➡️ Next Page (if more than 5 templates)

[Template Detail Level]
├─ ◀️ Back to List
├─ 📸 View Preview (opens media group)
├─ ⭐ Buy for XX Stars
```

### 2.4 Action Button Placement

**Hierarchy: Primary > Secondary > Navigation**

```
Row 1: [Primary Action - Full Width]
Row 2: [Secondary Action 1] [Secondary Action 2]
Row 3: [Navigation - Back/Next]
```

**Example (Template Detail):**
```
┌─────────────────────────────────┐
│  ⭐ Buy for 150 Stars            │  ← Primary (full width)
├─────────────────┬───────────────┤
│  📸 View Preview│ ◀️ Back to List│  ← Secondary actions
└─────────────────┴───────────────┘
```

---

## 3. Template Listing Design

### 3.1 Information Hierarchy

**Priority Order (Top → Bottom):**

1. **Title** (Bold, emoji indicator) - Most important
2. **Rating** (Stars + count) - Social proof
3. **Price** (Stars icon + number) - Conversion driver
4. **Short Description** (1 line, <60 chars) - Context
5. **Action Button** - Entry point

**Template Card (Compact):**
```
📦 Ultimate Life Planner
⭐⭐⭐⭐⭐ (24) • 💫 150 Stars
```

**Button:** `🔍 View Details`

### 3.2 Templates per Message

**Week 1 MVP: 3 templates per message**

**Rationale:**
- Mobile screens fit 3-4 items comfortably
- Cognitive load: 7±2 items, 3 is safe
- Telegram callback limits: 64 bytes × 3 = manageable
- Pagination prevents endless scrolling

**Pagination Strategy:**
- 3 items per page
- "Next/Previous" buttons
- "Page X of Y" indicator in message text

### 3.3 Description Length

**Levels:**

| Context | Length | Usage |
|---------|--------|-------|
| Card (list) | 0 characters | Title only |
| Detail intro | 100 characters | Hook only |
| Detail full | 500 characters | Full description |

**Detail Intro Example (100 chars):**
```
Master your days with this all-in-life planner. 
Perfect for busy professionals.
```

**Detail Full Example (500 chars):**
```
Master your days with this all-in-one life planner template. 
Designed for busy professionals who want to stay organized 
without the complexity.

WHAT'S INCLUDED:
• Daily, weekly, monthly planning views
• Built-in habit tracker with streaks
• SMART goal setting system
• Project management sections
• Personal finance tracking
• Quick capture notes system
• Weekly review prompts

PERFECT FOR:
- Entrepreneurs managing multiple projects
- Students balancing academics and life
- Anyone wanting to level up their productivity

BONUS: Includes video tutorial and setup guide!
```

### 3.4 Preview Strategy

**Week 1 MVP: Image Gallery via Media Group**

**Flow:**
1. User clicks "📸 View Preview"
2. Bot sends 2-4 photos as media group
3. Photos show: Dashboard, Template structure, Sample views
4. Caption: "Preview of [Template Name] - ◀️ Back to Details"
5. User can swipe through on mobile

**Image Specifications:**
- Format: JPG (compressed)
- Size: <1MB each (Telegram upload limit)
- Resolution: 1080×1920 (mobile portrait) or 1920×1080 (desktop)
- Order: Overview → Features → Examples

**Caption Template:**
```
📸 Preview: Ultimate Life Planner

Swipe to see all views →

[◀️ Back to Details]
```

**Button:** `◀️ Back to Details`

### 3.5 Category Navigation Structure

**Week 1 MVP: Single-Level Categories (5 categories)**

**Categories:**
1. 🏠 Personal Productivity
2. 💼 Business & Work
3. 📊 Project Management
4. 🎓 Student & Academic
5. 🎨 Creative & Design

**Decision: Flat list, no nested categories**

**Rationale:**
- 5 categories fit in one message (6 buttons with back)
- Cognitive load: Minimal
- MVP: Test demand before complex taxonomy
- Faster to browse (fewer taps)

**Future Expansion (Post-MVP):**
- Add subcategories if >15 templates per category
- Use "breadcrumb" navigation: `Business > Finance > Templates`

---

## 4. Payment Flow UI Design

### 4.1 Pre-Payment State

**Trigger:** User clicks `⭐ Buy for XX Stars`

**Message:**
```
⭐ Purchase Confirmation

Template: Ultimate Life Planner
Amount: 150 Stars

Your balance: XXX Stars

[⭐ Confirm Payment]
[❌ Cancel]
```

**Button Texts:**
- `⭐ Confirm Payment`
- `❌ Cancel`

**Design Notes:**
- Clear price confirmation (prevent surprises)
- Show balance (help user decide)
- Binary choice: Confirm or Cancel
- No ambiguity in button text

### 4.2 Payment Processing State

**Trigger:** User clicks `⭐ Confirm Payment`

**Bot Action:**
1. Edit previous message (or delete + resend)
2. Send new message with processing state
3. Use typing indicator (optional)

**Message:**
```
⏳ Processing Payment...

Please wait while we confirm your purchase.
```

**Buttons:** None (processing state)

**Design Notes:**
- Clear indicator something is happening
- No buttons (prevent double-payment)
- Timeout: 10 seconds max (Telegram payment is fast)

### 4.3 Success State

**Trigger:** Payment successful (Telegram API confirms)

**Message:**
```
✅ Payment Successful!

Thank you for your purchase!

📦 Ultimate Life Planner is now yours.

🔗 Your Template Link:
[Notion Template URL]

📝 Quick Start Guide:
1. Click the link above
2. Duplicate the template in your Notion
3. Start organizing!

Need help? Check /help

[⭐ Rate This Template]
[🏠 Back to Menu]
[📚 Browse More Templates]
```

**Button Texts:**
- `⭐ Rate This Template`
- `🏠 Back to Menu`
- `📚 Browse More Templates`

**Design Notes:**
- Immediate confirmation (no delay)
- Clear CTA: Link is prominent
- Quick start guide (reduce friction)
- Social proof prompt (rate template)
- Upsell opportunity (browse more)

### 4.4 Failure State

**Trigger:** Payment failed (insufficient stars, API error, etc.)

**Message:**
```
❌ Payment Failed

We couldn't process your payment.

Reason: [Insufficient Stars | Network Error | Timeout]

[🔄 Try Again]
[💳 Add Stars]
[💬 Get Help]
[◀️ Back to Template]
```

**Button Texts:**
- `🔄 Try Again`
- `💳 Add Stars` (opens Telegram Stars purchase)
- `💬 Get Help`
- `◀️ Back to Template`

**Error Messages:**
| Error Type | Message |
|-----------|---------|
| Insufficient Stars | "You don't have enough Stars. Balance: XX, Required: YY" |
| Network Error | "Connection issue. Please check your internet and try again." |
| Timeout | "Payment timed out. Please try again." |
| Unknown | "Something went wrong. Please contact support." |

**Design Notes:**
- Clear error explanation (not cryptic codes)
- Actionable next steps
- Never dead-end (always offer option)
- Support link for unresolved issues

### 4.5 Insufficient Stars Flow

**Special case of Failure State**

**Message:**
```
❌ Insufficient Stars

You need 150 Stars but only have XX Stars.

You can add Stars directly in Telegram.

[💳 Add Stars in Telegram]
[◀️ Back to Template]
```

**Button Texts:**
- `💳 Add Stars in Telegram` (opens TG Stars modal)
- `◀️ Back to Template`

**Design Notes:**
- Show deficit amount (150 - XX = YY needed)
- Direct link to Stars purchase (reduce friction)
- Don't block user from browsing (back button)

---

## 5. Post-Purchase Experience

### 5.1 File/Link Delivery UI

**Week 1 MVP: Direct Notion Link**

**Message (from Success State):**
```
✅ Payment Successful!

📦 Ultimate Life Planner is now yours.

🔗 YOUR TEMPLATE LINK:
https://notion.so/...

Tap the link to open in Notion, then:
1. Click "Duplicate" in top-right
2. Choose your workspace
3. Start organizing!

[⭐ Rate Template]
[📚 Browse More]
```

**Button Texts:**
- `⭐ Rate This Template`
- `📚 Browse More Templates`

**Design Notes:**
- Link is prominent (not buried)
- Instructions are minimal (3 steps)
- Visual separation: Link is on its own line
- Rate prompt (social proof collection)

### 5.2 Next Steps UI

**Immediate Next Actions:**
1. Rate template (social proof)
2. Browse more (upsell)
3. Return home (navigation)

**Follow-up (24h later, optional):**
```
👋 Hey! How's your new template working?

If you love it, consider leaving a rating!

[⭐ Rate Ultimate Life Planner]
[❓ Need Help?]
[🔇 Mute These Messages]
```

**Button Texts:**
- `⭐ Rate Ultimate Life Planner`
- `❓ Need Help?`
- `🔇 Mute These Messages`

### 5.3 Help Text

**Quick Start Guide (built into success message):**
```
📝 Quick Start:
1. Tap the link above
2. Click "Duplicate" in Notion
3. Save to your workspace
4. Start using it!

Need detailed help? Tap /help
```

**Built-in Help:**
- /help command
- Contextual help buttons
- FAQ (future feature)

### 5.4 Follow-up Prompts

**Timing & Triggers:**

| Trigger | Timing | Message |
|---------|--------|---------|
| Purchase | Immediate | Success message + link |
| 24h later | +24h | "How's it working?" + rate prompt |
| 7 days later | +7d | "Discover more templates!" |
| 30 days later | +30d | "New templates added!" |

**Follow-up Message Template:**
```
✨ New Templates Available!

Hi! We've added fresh templates to the store.

Check them out:

[📚 Browse New Templates]
[🔇 Stop These Messages]

[Settings]
```

**Button Texts:**
- `📚 Browse New Templates`
- `🔇 Stop These Messages`
- `⚙️ Settings`

**Design Notes:**
- Opt-out model (easy to mute)
- Value first (new templates, not spam)
- Frequency: Max 1/week (prevent annoyance)

---

## 6. Reusable Interaction Patterns

### 6.1 Menu Navigation Pattern

**Rule: Always show location + exit option**

```
[Current Location Title]
[Breadcrumb: Menu > Category > List]
[Content: Items/Options]
[Navigation Buttons]
```

**Example:**
```
📚 Browse Templates
━━━━━━━━━━━━━━━━━━
🏠 Personal Productivity
💼 Business & Work
📊 Project Management
🎓 Student & Academic
🎨 Creative & Design
━━━━━━━━━━━━━━━━━━
[◀️ Back to Menu]
```

**Pattern Elements:**
- Title at top (bold, emoji)
- Breadcrumb (if deep navigation)
- Content in middle
- Navigation at bottom (always back button)

### 6.2 Confirmation Dialog Pattern

**Rule: Binary choice with clear action**

```
⚠️ [Action] Confirmation

You are about to: [Action Description]
Target: [Item Name]
Cost: [Price/Impact]

[✅ Confirm Action]
[❌ Cancel]
```

**Examples:**

**Purchase Confirmation:**
```
⭐ Purchase Confirmation

Template: Ultimate Life Planner
Amount: 150 Stars

[⭐ Confirm Payment]
[❌ Cancel]
```

**Delete Confirmation (future feature):**
```
🗑️ Delete Template?

This will remove the template from your library.
You can re-download anytime from purchase history.

[🗑️ Confirm Delete]
[❌ Keep It]
```

### 6.3 Error Message Format

**Rule: Explain + Resolve + Prevent**

```
❌ [Error Type]

[What happened: Clear explanation]

[Why it happened: Reason if known]

[What to do: Actionable steps]

[Action Buttons]
```

**Template:**
```
❌ Insufficient Stars

You need 150 Stars but only have 75 Stars.

Why: Stars are Telegram's digital currency.

What to do:
1. Tap "Add Stars" below
2. Purchase Stars in Telegram
3. Return here to complete purchase

[💳 Add Stars]
[◀️ Back]
```

### 6.4 Loading/Pending States

**Rule: Clear indicator + expected duration**

**States:**

| State | Message | Buttons |
|-------|---------|---------|
| Processing | `⏳ Processing... Please wait.` | None |
| Loading | `⏳ Loading templates...` | None |
| Sending | `📤 Sending link...` | None |
| Waiting (API) | `⏳ Confirming payment...` | None |

**Design Notes:**
- Use emoji indicators (⏳, 📤, 🔄)
- Always say what's happening (not "Loading...")
- Disable buttons (prevent double-actions)
- Timeout: Show help if >10 seconds

### 6.5 Success Acknowledgment

**Rule: Celebrate + Deliver + Next Step**

```
✅ [Success Title]

[Positive reinforcement]

[Delivery: Link/Item]

[Next Steps: What to do now]

[Follow-up Actions]
```

**Template:**
```
✅ Payment Successful!

Thank you for your purchase! 🎉

📦 Ultimate Life Planner is now yours.

🔗 YOUR TEMPLATE LINK:
https://notion.so/...

📝 What to do next:
1. Tap the link above
2. Duplicate in your Notion
3. Start organizing!

[⭐ Rate This Template]
[📚 Browse More Templates]
```

**Elements:**
- ✅ Success icon (visual confirmation)
- Thank you (gratitude)
- Delivery (link/item)
- Next steps (guidance)
- Follow-up actions (rate, browse)

---

## 7. Visual Language Guidelines

### 7.1 Emoji Usage

**Principles:**
- **1 emoji per button** (avoid clutter)
- **Semantic emojis only** (no decoration)
- **Consistent mapping** (same emoji = same meaning)

**Emoji Mapping:**

| Context | Emoji | Usage |
|---------|-------|-------|
| Templates | 📦 | All template references |
| Browse | 📚 | Browsing menus |
| Stars | ⭐ | Price, payment, rating |
| Home | 🏠 | Main menu, home |
| Back | ◀️ | Navigation back |
| Next/Forward | ➡️ | Pagination |
| Success | ✅ | Confirmation |
| Error | ❌ | Failure states |
| Loading | ⏳ | Pending states |
| Help | 💬 | Support, FAQ |
| Settings | ⚙️ | Settings, config |
| Preview | 📸 | Image previews |
| Buy/Purchase | 🛒 | Purchase actions |
| Cancel | ❌ | Cancel, close |
| Confirm | ✅ | Confirm, accept |
| Business | 💼 | Business category |
| Creative | 🎨 | Creative category |
| Student | 🎓 | Student category |
| Project | 📊 | Project management |
| Personal | 🏠 | Personal productivity |

**Do's:**
- ✅ Use `⭐` for all price/Stars references
- ✅ Use `📦` for all template names
- ✅ Use `◀️` for all back buttons

**Don'ts:**
- ❌ Use `💰💰💰` for price (clutter)
- ❌ Use random emojis (🎉🔥🚀) for decoration
- ❌ Mix emojis (⭐📦🛒) in one button

### 7.2 Text Formatting

**Telegram MarkdownV2 Support:**

| Style | Syntax | Usage |
|-------|--------|-------|
| Bold | `**text**` | Titles, emphasis |
| Italic | `__text__` | Subtitles, soft emphasis |
| Code | `` `text` `` | Commands, short values |
| Links | `[text](url)` | Inline links (rare) |
| Strikethrough | `~text~` | Avoid (confusing) |

**Hierarchy:**

```
**Main Title** (Bold, emoji)
Subtitle (Italic, no emoji)

Body text with **bold emphasis** on key terms.
`Code format` for commands/technical terms.

[Button]
```

**Example:**
```
📦 **Ultimate Life Planner**

*Master your days with ease.*

This template includes **habit tracking**, **goal setting**, 
and `project management` features.

Perfect for busy professionals.

[⭐ Buy for 150 Stars]
```

**Rules:**
- Titles: Always bold + emoji
- Subtitles: Italic, no emoji
- Body: Plain text with selective bold
- Code: Monospace for commands/tech terms
- Links: Only when necessary (prefer buttons)

### 7.3 Tone of Voice

**Brand Personality:**

| Attribute | Description |
|-----------|-------------|
| Friendly | Casual, approachable, not stiff |
| Professional | Competent, not slangy |
| Clear | Simple language, no jargon |
| Action-oriented | Verbs, not passive voice |

**Voice Examples:**

✅ **Good:**
- "Get your template now!" (active, clear)
- "We couldn't process your payment." (honest, clear)
- "Need help? Just ask!" (friendly, inviting)

❌ **Bad:**
- "One may acquire the template herein." (stiff, passive)
- "Payment processing failure occurred." (robotic)
- "If assistance is required, contact support." (cold)

**Tone by Context:**

| Context | Tone | Example |
|---------|------|---------|
| Welcome | Warm, inviting | "Welcome! Let's get you organized." |
| Error | Empathetic, helpful | "Oops! Something went wrong. Let's fix this." |
| Success | Celebratory, grateful | "You did it! Here's your template." |
| Help | Patient, clear | "Here's how to get started..." |
| Purchase | Confident, assuring | "You're one step away from organization!" |

### 7.4 Button Style Guidelines

**Visual Pattern:**

```
[Icon] [Verb] [Object] [Context]
```

**Examples:**
- `⭐ Buy for 150 Stars`
- `📚 Browse Templates`
- `◀️ Back to Menu`
- `✅ Confirm Payment`

**Length Guidelines:**
- Minimum: 10 characters (not too short)
- Maximum: 40 characters (fits all screens)
- Optimal: 20-30 characters (balanced)

**Verb Choices:**

| Action | Verb | Example |
|--------|------|---------|
| Purchase | Buy, Purchase | `⭐ Buy`, `🛒 Purchase` |
| View | View, See | `🔍 View`, `👁️ See` |
| Navigate | Go, Back | `➡️ Go to`, `◀️ Back` |
| Browse | Browse | `📚 Browse` |
| Get | Get | `📥 Get` |
| Confirm | Confirm | `✅ Confirm` |
| Cancel | Cancel | `❌ Cancel` |

**Avoid:**
- "Click here" (unnecessary verb)
- "Submit" (unclear action)
- "OK" (too vague)
- "Yes/No" (context-dependent, avoid)

---

## 8. Accessibility Considerations

### 8.1 Screen Reader Support

**Telegram screen reader behavior:**
- Reads messages top-to-bottom
- Announces button labels
- Emoji announced as "emoji [name]"

**Best practices:**
- Button text should work without emoji context
- Don't use emoji-only buttons (e.g., just `⭐`)
- Use descriptive text: `⭐ Buy for 150 Stars` (not just `⭐`)

### 8.2 Color Independence

**Telegram doesn't support custom colors.** Design relies on:
- Text hierarchy (bold/italic)
- Emoji indicators
- Button placement
- Icon consistency

**No color coding needed** - Telegram handles contrast automatically.

### 8.3 Touch Target Size

**Telegram enforces:** Minimum 44px height for buttons

**Design compliance:**
- All inline buttons meet this standard
- No custom sizing needed
- Row layout ensures adequate spacing

### 8.4 Text Readability

**Guidelines:**
- Maximum line length: 40 characters (mobile)
- Paragraph breaks: Every 2-3 lines
- Avoid walls of text (chunk content)
- Use bullets for lists (easier to scan)

**Example:**
```
❌ Bad (wall of text):
This template includes habit tracking and goal setting and project management and finance tracking and notes integration all in one place for maximum productivity.

✅ Good (chunked):
This template includes:
• Habit tracking with streaks
• Goal setting & progress
• Project management
• Finance tracking
• Notes integration
```

---

## 9. Mobile vs Desktop Considerations

### 9.1 Mobile (95% of users)

**Layout:**
- Portrait orientation assumed
- Single-column message flow
- Inline keyboard spans full width
- 1-2 buttons per row optimal

**Touch:**
- Large touch targets (Telegram enforces)
- Thumb zone: Place primary actions in bottom rows
- Swipe: No swipe gestures (Telegram limitation)

**Screen Real Estate:**
- Message + keyboard = 80% of screen
- Pagination needed for long lists
- Compact card format (1-2 lines per item)

### 9.2 Desktop (5% of users)

**Layout:**
- Wider messages (more horizontal space)
- Multi-column button layout possible (2-3 per row)
- More context visible (less scrolling)

**Interaction:**
- Mouse clicks (precise, can handle smaller buttons)
- Keyboard shortcuts (Telegram Desktop supports some)
- Copy-paste easier (links, codes)

**Adaptations:**
- Same button text (no platform-specific UI)
- Same message structure (consistent experience)
- Can show more items per page (5 instead of 3)

---

## 10. Implementation Checklist

### 10.1 Week 1 MVP - Must Have

- [ ] `/start` welcome message with main menu
- [ ] Category browser (5 categories)
- [ ] Template list (3 per page, pagination)
- [ ] Template detail view with preview
- [ ] Payment confirmation dialog
- [ ] Success/failure states
- [ ] Link delivery with instructions
- [ ] Back navigation at all levels
- [ ] Help command (`/help`)
- [ ] Error handling for all failure modes

### 10.2 Week 2+ - Nice to Have

- [ ] Template ratings system
- [ ] "My Templates" library
- [ ] Search functionality
- [ ] Template categories expansion
- [ ] Video preview support
- [ ] Wishlist/favorites
- [ ] Purchase history
- [ ] Follow-up messages (24h, 7d)
- [ ] Multi-language support
- [ ] Dark mode detection (Telegram native)

### 10.3 Metrics to Track

- **Conversion funnels:**
  - Browse → Detail view rate
  - Detail → Purchase initiation rate
  - Initiated → Completed payment rate

- **Engagement:**
  - Templates per session
  - Preview image views
  - Help command usage
  - Return visits

- **UX issues:**
  - Abandoned payments (analyze failure reasons)
  - Back button usage (navigation friction)
  - Help command clicks (confusion points)

---

## 11. Design System Summary

### 11.1 Color Palette (Conceptual)

*Note: Telegram controls actual colors. These are semantic mappings.*

| Semantic | Telegram Equivalent | Usage |
|----------|-------------------|-------|
| Primary | Brand color (varies) | Not applicable (bot has no brand color) |
| Success | Green (native) | ✅ Success states |
| Error | Red (native) | ❌ Error states |
| Warning | Yellow (native) | ⚠️ Confirmations |
| Info | Blue (native) | ℹ️ Information |

### 11.2 Typography Scale

**Native Telegram:**
- Title: Bold, larger size
- Body: Regular, medium size
- Code: Monospace, small size

**No custom fonts available** - Design relies on formatting (bold/italic/code).

### 11.3 Spacing System

**Message-level spacing:**
- Between sections: 1 blank line
- Between list items: No spacing (bullet points)
- Before buttons: 1 blank line

**Button-level spacing:**
- Between rows: Automatic (Telegram spacing)
- Between buttons in row: Automatic (Telegram spacing)

**No custom spacing** - Telegram controls layout.

### 11.4 Component Library (Week 1 MVP)

**Message Types:**
1. `WelcomeMessage` - `/start` greeting
2. `CategoryMenu` - Category selection
3. `TemplateList` - Paginated template cards
4. `TemplateDetail` - Full template info
5. `PaymentConfirmation` - Purchase confirmation
6. `ProcessingMessage` - Loading state
7. `SuccessMessage` - Payment success + delivery
8. `ErrorMessage` - Payment failure
9. `HelpMessage` - `/help` response
10. `PreviewGallery` - Media group with images

**Button Patterns:**
1. `PrimaryAction` - Full width, main action
2. `SecondaryAction` - Half width, secondary actions
3. `NavigationAction` - Back/next buttons
4. `ConfirmAction` - Confirmation dialogs
5. `CancelAction` - Cancel/dismiss

---

## 12. Appendices

### Appendix A: Button Text Reference

All button texts used in the bot (single source of truth):

| Context | Button Text | Callback Data |
|---------|-------------|---------------|
| Main Menu | `📚 Browse Templates` | `browse` |
| Main Menu | `⭐ My Templates` | `my_templates` |
| Main Menu | `💬 Help & Support` | `help` |
| Categories | `🏠 Personal Productivity` | `cat_personal` |
| Categories | `💼 Business & Work` | `cat_business` |
| Categories | `📊 Project Management` | `cat_project` |
| Categories | `🎓 Student & Academic` | `cat_student` |
| Categories | `🎨 Creative & Design` | `cat_creative` |
| Navigation | `◀️ Back to Menu` | `back_menu` |
| Navigation | `◀️ Back to Categories` | `back_categories` |
| Navigation | `◀️ Back to List` | `back_list` |
| Navigation | `➡️ Next Page` | `next_page` |
| Template Action | `🔍 View Details` | `detail_{id}` |
| Template Action | `⭐ Buy for {stars} Stars` | `buy_{id}` |
| Template Action | `📸 View Preview` | `preview_{id}` |
| Payment | `⭐ Confirm Payment` | `confirm_pay` |
| Payment | `❌ Cancel` | `cancel_pay` |
| Error Recovery | `🔄 Try Again` | `retry_pay` |
| Error Recovery | `💳 Add Stars` | `add_stars` |
| Error Recovery | `💬 Get Help` | `get_help` |
| Post-Purchase | `⭐ Rate This Template` | `rate_{id}` |
| Post-Purchase | `📚 Browse More Templates` | `browse_more` |
| Post-Purchase | `🏠 Back to Menu` | `home` |

### Appendix B: Message Templates

**All message templates with placeholders:**

```markdown
# Welcome Message
Welcome to Auto Template Bot! 🎯

Browse premium Notion templates to boost your productivity.

All templates are delivered instantly via Telegram Stars payment.

Choose an option below to get started.

# Category Menu
📚 Select a Category

Choose a category to browse templates:

# Template List Header
📚 {category_name} Templates

Page {current} of {total}

# Template Card
📦 {template_name}
⭐⭐⭐⭐⭐ ({review_count}) • 💫 {price} Stars

# Template Detail
📦 **{template_name}**

{description}

✨ **FEATURES:**
{feature_list}

⭐⭐⭐⭐⭐ {review_count} reviews
💫 {price} Stars

Choose an action below:

# Payment Confirmation
⭐ Purchase Confirmation

Template: {template_name}
Amount: {price} Stars

Your balance: {balance} Stars

# Processing Payment
⏳ Processing Payment...

Please wait while we confirm your purchase.

# Payment Success
✅ Payment Successful!

Thank you for your purchase! 🎉

📦 {template_name} is now yours.

🔗 **YOUR TEMPLATE LINK:**
{template_url}

📝 **Quick Start:**
1. Tap the link above
2. Click "Duplicate" in Notion
3. Save to your workspace
4. Start organizing!

Need help? Check /help

# Payment Error - Insufficient Stars
❌ Insufficient Stars

You need {required} Stars but only have {balance} Stars.

Why: Stars are Telegram's digital currency for payments.

What to do:
1. Tap "Add Stars" below
2. Purchase Stars in Telegram
3. Return here to complete purchase

# Payment Error - Generic
❌ Payment Failed

We couldn't process your payment.

Reason: {error_reason}

# Help Message
💬 Help & Support

**Commands:**
/start - Return to main menu
/help - Show this help message

**How to Buy:**
1. Browse templates
2. View details
3. Pay with Telegram Stars
4. Get instant link

**Need More Help?**
Join our support channel: {channel_link}

# Preview Caption
📸 Preview: {template_name}

Swipe to see all views →

# Follow-up Message (24h)
👋 Hey! How's your new template working?

If you love it, consider leaving a rating!

[⭐ Rate {template_name}]
[❓ Need Help?]
```

### Appendix C: Error Message Catalog

| Error Code | User Message | Recovery |
|-----------|--------------|----------|
| `INSUFFICIENT_STARS` | You need {required} Stars but only have {balance} Stars. | Add Stars link |
| `NETWORK_ERROR` | Connection issue. Please check your internet and try again. | Retry button |
| `TIMEOUT` | Payment timed out. Please try again. | Retry button |
| `API_ERROR` | Telegram API error. Please try again in a moment. | Retry button |
| `TEMPLATE_NOT_FOUND` | This template is no longer available. | Back to browse |
| `ALREADY_PURCHASED` | You already own this template! Check "My Templates". | My Templates link |
| `UNKNOWN` | Something went wrong. Please contact support. | Support link |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-03 | Initial Week 1 MVP design specification |

---

**End of Specification**

This document is the single source of truth for UI implementation. All design decisions, patterns, and templates are defined here. Developers should reference this document when building the Telegram bot interface.

**Next Steps:**
1. Review with team (CEO, Product, Engineering)
2. Validate constraints with Telegram Bot API documentation
3. Create wireframe mockups for visual confirmation
4. Begin implementation following specification
