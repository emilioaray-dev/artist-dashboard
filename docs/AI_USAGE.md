# AI Usage Documentation

This document details the AI tools usage throughout the development of the Music Artist Dashboard project for EVEN's Senior Frontend Engineer assignment.

## AI Tools Used

| Tool                  | Usage                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| **Qwen** (CLI)        | Initial project scaffolding, spec generation, early component structure   |
| **Claude Code** (CLI) | Component development, debugging, testing, design refinement, build fixes |

---

## AI Tools Usage Log

### 1. Project Initialization and Spec Workflow

**Goal:** Bootstrap the project with structured specifications before writing code.

**AI Tool Used:** Qwen (via Spec Kit CLI)

**Prompt/Approach:**

- Used `specify init` to scaffold the project with spec files (spec.md, plan.md, tasks.md, data-model.md)
- Asked the AI to analyze the assignment requirements and generate a comprehensive specification

**Result:**

- Generated a full feature spec covering all three core requirements (releases, sales, fan engagement)
- Created a data model with TypeScript interfaces for `Release`, `SalesSummary`, `EngagementMetrics`, `Fan`
- Produced an implementation plan with task breakdown and dependency graph

**Learning:**

- Having specs before code significantly reduced rework — the data model was right from the start
- The AI correctly identified that the assignment prioritizes code quality over feature quantity

---

### 2. Dashboard Component Architecture

**Goal:** Build the Overview page with metric cards, charts, and data sections using shadcn/ui.

**AI Tool Used:** Claude Code

**Prompt/Approach:**

- "Build the Overview page with 4 metric cards (Total Revenue, Total Fans, Active Buyers, Avg Order Value), a Revenue chart with time range tabs, a Fan Growth chart, Recent Releases list, and Top Fans section"
- Iterated on the component structure to separate server and client concerns

**Result:**

- AI generated three page variants: `HomePageClient` (pure client), `HomePageWithSuspense` (SWR + Suspense), and `HomePageStreaming` (server component with streaming)
- The streaming variant became the production version — async server component with `Suspense` boundaries around each section
- I modified the chart components to use shadcn/ui's `ChartContainer` instead of bare Recharts

**Learning:**

- AI initially put all logic in a single client component. Through iteration, we arrived at a much better architecture with server-side data fetching and client component hydration
- The separation into `HomePageStreaming > HomePageContent > ClientMetricCard` was the right pattern for Next.js App Router

---

### 3. Tailwind v4 Theme Configuration (AI Gave Wrong Approach)

**Goal:** Set up custom brand colors (amber/gold accent) using Tailwind CSS v4's new `@theme` system.

**AI Tool Used:** Claude Code

**Prompt/Approach:**

- "The sidebar active state isn't showing any visual change when navigating. Fix it."
- Investigation revealed the CSS variables `--primary` and `--primary-foreground` were empty at runtime

**Result:**

- AI initially suggested adding `--primary: #f59e0b` to the `:root` block in `globals.css` — this did NOT work
- After deep investigation using Chrome DevTools (inspecting computed styles), we discovered the root cause: **Tailwind v4's `@theme inline` strips user-defined `:root` variables that collide with theme-referenced names**
- The pattern `--color-primary: var(--primary)` in `@theme inline` creates a circular reference that Tailwind silently drops

**The fix:**

```css
/* WRONG - Tailwind v4 strips --primary from :root */
@theme inline {
  --color-primary: var(--primary);
}
:root {
  --primary: #f59e0b;
}

/* CORRECT - Define colors directly with oklch values */
@theme inline {
  --color-primary: oklch(0.769 0.174 70.7);
  --color-primary-foreground: oklch(0.145 0 0);
}
```

**Learning:**

- This was the most valuable debugging session. The AI's initial suggestion was wrong because Tailwind v4 behaves differently from v3 regarding CSS variable resolution in `@theme inline`
- Always verify AI suggestions with browser DevTools — computed styles don't lie
- Documented this as a critical learning in the project memory for future reference

---

### 4. Revenue Chart with Interactive Time Ranges

**Goal:** Build an interactive Revenue chart that switches between 7d, 30d, and 90d views by fetching new data from the server.

**AI Tool Used:** Claude Code

**Prompt/Approach:**

- "Create a Revenue chart using shadcn/ui ChartContainer with Recharts AreaChart. Add tabs for 7 Days, 30 Days, 90 Days that fetch new data via server actions."

**Result:**

- AI generated the `ClientRevenueChart` component with `Tabs` for range selection and a loading state while fetching
- The initial version had a TypeScript error: the `handleRangeChange` function was typed as `(value: "7d" | "30d" | "90d") => Promise<void>` but `Tabs.onValueChange` expects `(value: string) => void`
- Fixed by widening the parameter type and casting inside the handler

```tsx
// Before - TypeScript error
const handleRangeChange = async (value: "7d" | "30d" | "90d") => { ... }

// After - Compatible with Tabs.onValueChange
const handleRangeChange = async (value: string) => {
  const range = value as "7d" | "30d" | "90d";
  // ...
}
```

**Learning:**

- AI sometimes generates types that are too narrow for the component API they integrate with
- Always run `npm run build` after AI generates code to catch these type mismatches early

---

### 5. E2E Testing with Playwright

**Goal:** Write comprehensive E2E tests covering navigation, page content, and responsive design.

**AI Tool Used:** Claude Code

**Prompt/Approach:**

- "Restore and fix E2E tests. The project needs tests for navigation, overview page, releases, fans, and responsive design."

**Result:**

- AI generated 25 tests across 5 spec files
- First run: 20 failures. Root cause: the playwright config used port 3001 but server actions fetch from `http://localhost:3000`
- After fixing the port, strict mode violations emerged — `getByText('Total Fans')` matched both the metric card title and the chart description "Total fans vs active buyers"
- Fixed with `{ exact: true }` option and correct `font-weight` assertion (600 not 700 in Tailwind v4)

**Learning:**

- E2E tests are excellent at catching integration issues that unit tests miss (port mismatches, text collisions, CSS computed values)
- Tailwind v4's `font-semibold` maps to `font-weight: 600`, not 700 — this is different from some older versions
- Always use `{ exact: true }` with `getByText()` when text might match partial substrings

---

### 6. Top Fans Section Redesign

**Goal:** Replicate the Top Fans section from the EVEN demo (https://even-artist-hub.vercel.app/).

**AI Tool Used:** Claude Code + Chrome DevTools MCP

**Prompt/Approach:**

- "I want to replicate the Top Fans section from this demo"
- Used Chrome DevTools MCP to inspect the demo's layout, styles, and avatar images

**Result:**

- AI extracted the layout pattern from the demo: avatar with rank badge overlay (top 3), name + purchase count on left, dollar amount on right
- Downloaded real Unsplash profile photos from the demo using Chrome DevTools `evaluate_script`
- Designed rank badge colors: gold (#1), orange (#2), yellow (#3)

```tsx
const RANK_COLORS = [
  "bg-amber-500 text-black", // #1
  "bg-orange-500 text-white", // #2
  "bg-yellow-600 text-white", // #3
];
```

**Learning:**

- Using Chrome DevTools MCP to inspect a reference implementation is extremely efficient — no guesswork about colors, spacing, or layout
- The combination of AI + browser inspection tools is more effective than either alone

---

## Reflection Questions

### a) AI Strategy

**How did you decide when to use AI vs. code from scratch?**

I used AI for:

- **Scaffolding and boilerplate**: Project setup, TypeScript interfaces, mock data generation, component skeletons
- **Integration work**: Connecting shadcn/ui components with Recharts, configuring Playwright, setting up server actions
- **Debugging**: When the root cause wasn't obvious (like the Tailwind v4 theme issue), AI helped explore hypotheses systematically

I coded from scratch for:

- **Design decisions**: Color palette choices, layout proportions, animation timing
- **Critical business logic**: Data transformation for charts, metric calculations
- **Quick fixes**: When I knew exactly what to change (e.g., adding `{ exact: true }` to test assertions)

**Were there any tasks where AI wasn't helpful? Why?**

Yes — the Tailwind v4 `@theme inline` variable resolution issue. The AI's first two suggestions were wrong because Tailwind v4 has undocumented behavior around CSS variable stripping that the AI hadn't encountered before. I had to use Chrome DevTools to inspect the actual computed styles and work backwards to find the root cause. The AI was helpful in _generating hypotheses_, but the _verification_ had to be manual.

### b) Code Ownership

**How did you ensure you understood all AI-generated code?**

- Ran `npm run build` after every significant AI contribution to catch type errors immediately
- Used Chrome DevTools MCP to visually verify every UI change
- Read through AI-generated components and traced the data flow from server to client
- When something didn't work, I debugged it myself rather than asking AI to guess

**Describe one piece of AI-generated code you significantly modified and why.**

The `HomePageStreaming` component was initially generated as a single async server component that fetched all data in `Promise.all` and rendered everything at once. I restructured it to use separate `Suspense` boundaries for each section (Revenue, Fan Growth, Releases, Top Fans) so that each section streams independently. This means faster perceived load time — the metric cards appear first, then charts fill in, then lists render.

### c) Productivity Impact

**Estimate how much time AI saved you (or didn't).**

AI saved approximately 3-4 hours total:

- **2 hours** on scaffolding (project setup, interfaces, mock data, component stubs)
- **1 hour** on Playwright test generation (25 tests across 5 files)
- **30 min** on build error diagnosis (finding and fixing TypeScript type mismatches)

AI _cost_ approximately 30-45 minutes on the Tailwind v4 theme debugging — the initial wrong suggestions sent me down a rabbit hole before Chrome DevTools revealed the true issue.

**Net savings: ~2.5-3 hours.**

**What would you have done differently without AI tools?**

Without AI, I would have:

- Used a Tailwind v3 starter template instead of v4 (to avoid the theme variable issues)
- Written fewer, simpler E2E tests (maybe 5-10 instead of 25)
- Used a simpler chart library or pre-built chart component instead of custom Recharts + shadcn/ui integration
- Focused on fewer pages (Overview only) with deeper polish

### d) Quality Assurance

**How did you validate AI-generated code?**

1. **TypeScript compiler** (`npm run build`) — catches type mismatches immediately
2. **ESLint** (`npm run lint`) — enforces code style and accessibility rules
3. **Vitest** (`npm test`) — 56 unit tests validate component behavior
4. **Playwright** (`npm run test:e2e`) — 25 E2E tests verify real browser behavior
5. **Chrome DevTools MCP** — visual verification of every UI change at multiple viewport sizes

**Did you catch any issues or mistakes from AI suggestions?**

Yes, several:

1. **Tailwind v4 `var()` indirection** — AI suggested `--color-primary: var(--primary)` which doesn't work in `@theme inline`
2. **TypeScript type narrowing** — `handleRangeChange` was typed too narrowly for `Tabs.onValueChange`
3. **SWR mutate type mismatch** — Custom `ApiResponse` interface had an incompatible `mutate` signature
4. **ESLint config** — AI spread `plugin.rules` (rule definitions) into the config `rules` (configurations), crashing ESLint entirely
5. **Playwright port mismatch** — Tests used port 3001 while server actions default to port 3000

Each of these was caught by the validation pipeline (build, lint, or tests) and fixed before shipping.

---

## One Detailed Example

### Feature: Debugging the Invisible Active Navigation State

**Context:** After building the sidebar and mobile bottom navigation, clicking between pages didn't show any visual change on the active item. The CSS classes `bg-primary/10 text-primary font-semibold` were applied in the DOM but had no visible effect.

**Initial Prompt:**

> "The Sidebar and MobileBottomNav active state isn't applying visual changes when the path is active. Fix it and confirm with Chrome DevTools MCP."

**Investigation (5 iterations):**

**Iteration 1** — AI added `--primary` and `--primary-foreground` CSS variables to `:root` in globals.css:

```css
:root {
  --primary: #f59e0b;
  --primary-foreground: #09090b;
}
```

Result: No change. Chrome DevTools showed the variables were empty at runtime.

**Iteration 2** — AI added the same variables to the `.dark` block. Result: Still empty.

**Iteration 3** — Investigated with Chrome DevTools `evaluate_script`:

```js
getComputedStyle(document.documentElement).getPropertyValue("--primary");
// Returns: "" (empty string!)
```

The variable existed in the CSS source but was being stripped at build time.

**Iteration 4** — Deep investigation into the `@theme inline` block:

```css
@theme inline {
  --color-primary: var(--primary); /* This references --primary */
}
```

Discovery: Tailwind v4 sees that `--primary` is referenced by a theme variable, so it _strips_ the user-defined `--primary` from `:root` to prevent conflicts. This is undocumented behavior.

**Iteration 5** — Final fix:

```css
@theme inline {
  --color-primary: oklch(0.769 0.174 70.7);
  --color-primary-foreground: oklch(0.145 0 0);
}
```

Define colors directly with oklch values instead of using `var()` indirection. Verified with Chrome DevTools — both desktop sidebar and mobile bottom nav now show the amber accent on active items.

**Thought Process:**
The key insight was that the AI couldn't "see" the browser. It made reasonable suggestions based on how Tailwind v3 worked, but Tailwind v4's `@theme inline` has different variable resolution semantics. The breakthrough came from using Chrome DevTools MCP to inspect the actual computed styles — this revealed the variable was empty, which pointed to Tailwind stripping it.

**Reflection:**
This was the most educational debugging session in the project. It demonstrated that AI is excellent for generating hypotheses but cannot replace direct observation. The combination of AI-generated hypotheses + Chrome DevTools verification was the optimal workflow. I've documented this as a critical pattern for anyone working with Tailwind v4's `@theme` system.
