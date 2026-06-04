# Product Launch Tool - Demo Mode Implementation Spec

**Author:** Alan Cooper, Interaction Design Director
**Status:** Ready for Implementation
**Priority:** Week 1 (Critical)

---

## Current State
- File: `/projects/product-launch-tool/app/page.tsx`
- Landing directly in form
- No context entry
- No success visualization

## Target State
- Hero context layer → Example modal → Guided form → Success visualization

---

## Implementation Tasks

### Task 1: Hero Context Layer (NEW section above existing form)

**Location:** Insert before line 92 (current `<div className="container mx-auto px-4 py-8">`)

**Component:**
```tsx
{/* Hero Context Layer - DEMO MODE */}
<div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white">
  <div className="container mx-auto px-4 py-16">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-4">
        Launch on Product Hunt Without the Stress
      </h1>
      <p className="text-xl mb-8 text-orange-50">
        Draft, preview, and export your perfect Product Hunt post in 3 minutes
      </p>

      {/* Visual Demo - Auto-playing animation */}
      <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 border border-white/20">
        <div className="flex items-center justify-center gap-8">
          {/* Demo animation container */}
          <div className="flex-1 bg-white rounded-lg p-4 shadow-xl">
            <div className="space-y-2">
              <div className="h-4 bg-orange-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse delay-75"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse delay-150"></div>
            </div>
          </div>
          <div className="text-4xl">→</div>
          <div className="flex-1 bg-white rounded-lg p-4 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold">
                P
              </div>
              <div>
                <div className="h-4 bg-orange-600 rounded w-32"></div>
                <div className="h-3 bg-gray-400 rounded w-24 mt-1"></div>
              </div>
            </div>
            <div className="h-8 bg-green-500 rounded text-white text-sm flex items-center justify-center">
              ✓ Launch Ready
            </div>
          </div>
        </div>
        <p className="text-sm text-orange-100 mt-4">
          Watch: Form → Preview → Export (8 seconds)
        </p>
      </div>

      {/* CTAs */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => document.getElementById('launch-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
        >
          Try It Now
        </button>
        <button
          onClick={() => setShowExampleModal(true)}
          className="bg-orange-400/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-400/50 transition-colors border border-white/30"
        >
          See Example Launch →
        </button>
      </div>
    </div>
  </div>
</div>
```

**Changes needed:**
1. Add `showExampleModal` state variable (boolean)
2. Add `id="launch-form"` to main container (for scroll anchor)
3. Add demo animation CSS classes (`animate-pulse`, `delay-75`, `delay-150`)

---

### Task 2: Example Modal (NEW component)

**Location:** Add before closing `</div>` of main component

**Component:**
```tsx
{/* Example Launch Modal */}
{showExampleModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowExampleModal(false)}>
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Example Launch</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              This is what your Product Hunt post will look like
            </p>
          </div>
          <button
            onClick={() => {
              setShowExampleModal(false)
              // Pre-fill form with example data
              setData({
                name: 'TaskFlow',
                tagline: 'Ship features faster without the chaos',
                description: 'TaskFlow is the project management tool that actually adapts to how you work. No more forced workflows or endless status meetings.\n\n**Key Features:**\n\n• Smart task prioritization\n• Automatic progress updates\n• Slack & GitHub integration\n• Built-in retrospectives',
                makerComment: "Hey PH! 👋 I built TaskFlow after years of frustration with tools that forced me into their workflows. This one adapts to YOU.\n\nWould love your feedback on what workflow features would make this even better!",
                url: 'https://taskflow.dev',
                tags: 'productivity, project-management, developer-tools, slack'
              })
              window.scrollTo({ top: 400, behavior: 'smooth' })
            }}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
      </div>

      {/* Side-by-split view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left: Markdown output */}
        <div className="p-6 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
          <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
            Your Output (Markdown)
          </h4>
          <pre className="text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 p-4 rounded-lg overflow-x-auto border border-zinc-200 dark:border-zinc-700">
{`# TaskFlow

**Ship features faster without the chaos**

**URL:** https://taskflow.dev

## Description

TaskFlow is the project management tool that actually adapts to how you work. No more forced workflows or endless status meetings.

**Key Features:**

• Smart task prioritization
• Automatic progress updates
• Slack & GitHub integration
• Built-in retrospectives

## Maker Comment

Hey PH! 👋 I built TaskFlow after years of frustration with tools that forced me into their workflows. This one adapts to YOU.

Would love your feedback on what workflow features would make this even better!

**Tags:** productivity, project-management, developer-tools, slack

---
*Drafted with Product Launch Tool*`}
          </pre>
        </div>

        {/* Right: Product Hunt preview */}
        <div className="p-6 bg-white dark:bg-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wide">
            On Product Hunt
          </h4>
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center text-white text-xl font-bold shrink-0">
                T
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-zinc-900 dark:text-zinc-50">TaskFlow</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Ship features faster without the chaos</p>
              </div>
            </div>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              TaskFlow is the project management tool that actually adapts to how you work. No more forced workflows or endless status meetings.
            </div>
            <div className="bg-orange-50 dark:bg-zinc-900 rounded p-3 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              Hey PH! 👋 I built TaskFlow after years of frustration with tools that forced me into their workflows. This one adapts to YOU.
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs rounded">productivity</span>
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs rounded">project-management</span>
              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs rounded">developer-tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-700">
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          ✅ Copy-paste ready • Takes 3 minutes • No signup required
        </p>
      </div>
    </div>
  </div>
)}
```

**Changes needed:**
1. Add `showExampleModal` state variable
2. Add click handlers to close modal
3. Add pre-fill functionality (on close, populate form with example data)

---

### Task 3: Inline Guidance (EXISTING form - add tips)

**Location:** Update existing form fields (lines 128-204)

**Example for Product Name field:**
```tsx
<div>
  <div className="flex items-center justify-between mb-1">
    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
      Product Name *
    </label>
    <span className="text-xs text-zinc-500 dark:text-zinc-400">
      💡 Keep it short, memorable
    </span>
  </div>
  <input
    type="text"
    value={data.name}
    onChange={(e) => handleChange('name', e.target.value)}
    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-zinc-700 dark:text-zinc-50"
    placeholder="My Awesome Product"
  />
  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
    ✓ Example: "SuperTask" not "SuperTask Ultimate Pro Manager"
  </p>
</div>
```

**Apply pattern to all fields:**
- Tagline: "Focus on benefit, not feature"
- Description: "3-5 sentences, use bullet points for features"
- Maker Comment: "Personal tone, include call-to-action"
- Tags: "3-5 relevant tags, comma-separated"

---

### Task 4: Success Visualization (NEW modal)

**Location:** Update `exportMarkdown` function (lines 60-89)

**New function:**
```tsx
const exportMarkdown = () => {
  const markdown = `# ${data.name || 'Product Name'}

**${data.tagline || 'Your tagline here'}**

${data.url ? `**URL:** ${data.url}\n` : ''}

## Description

${data.description || 'Product description goes here...'}

## Maker Comment

${data.makerComment || 'First comment from the maker...'}

${data.tags ? `**Tags:** ${data.tags}\n` : ''}

---

*Drafted with Product Launch Tool*
`

  // Show success modal first
  setExportModal({ markdown, show: true })
}

// Add to state
const [exportModal, setExportModal] = useState({ markdown: '', show: false })

// Add modal component before closing tag
{exportModal.show && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-2xl max-w-2xl w-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
            ✓
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Your Launch is Ready!
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Copy-paste ready for Product Hunt
            </p>
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
          <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono">
            {exportModal.markdown}
          </pre>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="text-green-500">1</span>
            <span>Copy to clipboard</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="text-green-500">2</span>
            <span>Go to Product Hunt</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <span className="text-green-500">3</span>
            <span>Paste & launch</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-zinc-900 rounded p-3 mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ⏰ Best launch times: 12:01am PST (early birds) or 7-8am PST (working hours)
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(exportModal.markdown)
              alert('Copied to clipboard!')
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            📋 Copy to Clipboard
          </button>
          <button
            onClick={() => {
              const blob = new Blob([exportModal.markdown], { type: 'text/markdown' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${data.name || 'product'}-launch.md`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            📥 Download File
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

---

## Testing Checklist

### Demo Mode Layer
- [ ] Hero section loads above fold
- [ ] "Try It Now" scrolls to form smoothly
- [ ] "See Example Launch" opens modal
- [ ] Demo animation plays (8 seconds loop)

### Example Modal
- [ ] Modal opens on click
- [ ] Side-by-split view renders correctly
- [ ] Close button (×) works
- [ ] Click outside closes modal
- [ ] Pre-fill populates form with example data
- [ ] Form scrolls into view after close

### Inline Guidance
- [ ] Tips appear below each field label
- [ ] Examples display below placeholders
- [ ] Text contrast is readable

### Success Modal
- [ ] Export button triggers modal (not immediate download)
- [ ] Markdown renders correctly in preview
- [ ] "Copy to Clipboard" works
- [ ] "Download File" works
- [ ] Next steps are clear
- [ ] Timing tip displays

---

## Success Metrics

**Micro-conversions to track:**
1. Time to first keystroke (target: <10 seconds)
2. Form start rate (users who type at least one field)
3. Form completion rate (users who fill all required fields)
4. Export modal open rate (users who click export)
5. Copy/download rate (users who complete export)

**Target improvements:**
- Form start: 20% → 40%
- Form completion: 10% → 30%
- Export click: 80% of completions

---

## Next Steps

1. **Implement hero context** (ui-duarte + fullstack-dhh)
2. **Add example modal** (fullstack-dhh)
3. **Update form fields** (fullstack-dhh)
4. **Create success modal** (fullstack-dhh)
5. **Test on mobile** (qa-bach)
6. **Deploy to production** (devops-hightower)
7. **Track metrics for 7 days** (cfo-campbell)

**Owner:** `fullstack-dhh` for implementation, `ui-duarte` for visual design
**Reviewer:** `interaction-cooper` for UX validation
