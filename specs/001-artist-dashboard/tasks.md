# Tasks: EVEN Backstage Dashboard

**Input**: Design documents from `/specs/001-artist-dashboard/`
**Design Reference**: example/even-artist-hub (Vite + React 18 reference) — UI/UX adapted to Next.js 16 + React 19
**Prerequisites**: plan.md (updated 2026-02-05), spec.md (with reference UI adaptation clarifications), data-model.md, research.md, quickstart.md

**Tests**: Unit tests (Vitest + React Testing Library) included per spec requirements.

**Organization**: Tasks are grouped by user story. Each story delivers an independently testable increment. Motion animations are integrated per-component. Reference UI patterns (StatCard layout, SVG gradient charts, Unsplash images, HSL tokens) applied from the start.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js App Router (frontend with API Routes)
- **Source**: `src/` at repository root
- **Components**: `src/components/`
- **Types**: `src/types/`
- **Mock data**: `src/__mocks__/`
- **Services**: `src/lib/`
- **API Routes**: `src/app/api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies, define types, HSL design tokens, and base configuration. Existing setup (shadcn/ui, lucide-react, motion, vitest) is already in place — focus on what needs to change.

### Dependencies

- [ ] T001 Add shadcn/ui components needed for reference UI: `npx shadcn@latest add avatar badge switch input label separator sonner` in project root
- [ ] T002 Remove zustand from package.json: `npm uninstall zustand` (SidebarContext used instead)

### Base Code Structure

- [ ] T003 [P] Update TypeScript interfaces in src/types/index.ts: Update ReleaseStatus to "live" | "upcoming" | "ended", add ReleaseType "exclusive", add conversionRate to Release, add TopFan interface with avatarUrl (Unsplash URL) and joinedDate, add DashboardStats interface for Overview page
- [ ] T004 [P] Update utility functions in src/lib/utils.ts: Ensure formatCurrency converts cents to dollars correctly, add formatConversionRate helper
- [ ] T005 [P] Update constants in src/lib/constants.ts: Add Settings nav item (Lucide Settings icon, /settings href), update CHANNEL_INFO colors to HSL values matching reference, add HSL chart gradient color constants
- [ ] T006 [P] Keep waveform generator in src/lib/waveform.ts (already correct — no changes needed)

### Design Tokens (HSL System)

- [ ] T007 Rewrite src/app/globals.css with HSL-based design tokens matching reference: --background: 220 15% 8%, --primary: 42 100% 50%, --muted: 220 15% 18%, --success: 142 70% 45%, --destructive: 0 84.2% 60.2%, sidebar tokens, chart-1 through chart-5. Add custom utilities: .text-gradient, .glow-primary, .card-hover. Add .text-success, .text-positive, .text-negative utility classes. Remove duplicate :root/.dark blocks — single :root only.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Motion primitives, Sidebar (with Settings link), API Routes, Data Service Layer, Unsplash mock data — ALL pages depend on these

**CRITICAL**: No user story work can begin until this phase is complete

### Motion Primitives

- [ ] T008 [P] Update MotionProvider in src/components/motion/MotionProvider.tsx (LazyMotion with domAnimation + MotionConfig reducedMotion="user" — already correct, verify `m` component export)
- [ ] T009 [P] Update PageTransition in src/components/motion/PageTransition.tsx (AnimatePresence mode="wait", children must receive key prop from template.tsx for actual page transitions to work)
- [ ] T010 [P] Update StaggerContainer in src/components/motion/StaggerContainer.tsx (parent m.div with initial="hidden" animate="visible" exit="hidden", staggerChildren: 0.1 — already correct pattern)
- [ ] T011 [P] Update FadeIn in src/components/motion/FadeIn.tsx (child m.div with variants hidden/visible — verify it works with StaggerContainer parent context)

### Layout

- [ ] T012 Update Sidebar in src/components/layout/Sidebar.tsx: Add Settings nav item (4 items: Overview with LayoutDashboard, Releases with Disc3, Fans with Users, Settings with Settings icon). Keep collapsible behavior. Active state with primary/amber highlight matching reference.
- [ ] T013 Update root layout in src/app/layout.tsx (verify MotionProvider + SidebarProvider + Sidebar + MainLayout structure — should be correct already)
- [ ] T014 Update template.tsx in src/app/template.tsx (pass unique key to PageTransition children for AnimatePresence to detect page changes)

### Data Service Layer

- [ ] T015 Update data service in src/lib/data-service.ts: Ensure getReleases returns releases with Unsplash coverArtUrl, getSales returns daily data with both gross and net (net = gross * 0.85), getEngagement returns topFans with Unsplash avatarUrl
- [ ] T016 [P] Rewrite mock releases in src/__mocks__/releases.ts: 4 releases matching reference titles (Midnight Sessions Vol. 3, Electric Dreams, Acoustic Sessions, Summer Vibes Bundle), status values "live"/"upcoming"/"ended", Unsplash CDN cover art URLs (?w=400&h=400&fit=crop), conversionRate field, realistic revenue
- [ ] T017 [P] Rewrite mock sales in src/__mocks__/sales.ts: 30 days of daily data with gross (800+random*1200 base, +400 spike last 7d) and net (gross*0.85). Support 7d/30d/90d slicing.
- [ ] T018 [P] Rewrite mock engagement in src/__mocks__/engagement.ts: Starting from 12400 base fans, daily growth 20-80, active rate 15-25% of total. 30-day history for chart.
- [ ] T019 [P] Rewrite mock fans in src/__mocks__/fans.ts: 5 top fans matching reference names (Alex Rivera, Jordan Kim, Sam Chen, Morgan Taylor, Riley Quinn), Unsplash portrait avatar URLs, totalSpent $389-$847, purchaseCount 9-23, joinedDate

### API Routes

- [ ] T020 Update API route for releases in src/app/api/releases/route.ts (GET returns Release[] with Unsplash URLs, add GET by ID: /api/releases?id=rel_001)
- [ ] T021 [P] Update API route for sales in src/app/api/sales/route.ts (GET with ?range=7d|30d|90d, returns SalesSummary with gross+net daily data)
- [ ] T022 [P] Update API route for engagement in src/app/api/engagement/route.ts (GET returns EngagementMetrics with topFans including avatarUrl)
- [ ] T023 Update API client in src/lib/api.ts: Add fetchRelease(id) for single release, ensure fetchSales returns gross+net data

### Shared Components

- [ ] T024 [P] Create EmptyState in src/components/shared/EmptyState.tsx (centered icon + message + optional CTA, with FadeIn animation)
- [ ] T025 [P] Create SectionSkeleton in src/components/shared/SectionSkeleton.tsx (configurable skeleton using shadcn/ui Skeleton matching card/chart/metric shapes)

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 2 — Analyze Sales Performance (Priority: P1) MVP

**Goal**: Artist sees Overview page with 4 stat cards (matching reference layout), interactive revenue chart with SVG gradients + time range tabs, fan growth chart, recent releases list, and top fans — all with staggered entrance animations

**Independent Test**: Load / (overview) → 4 stat cards animate in with stagger, revenue chart displays with Gross vs Net overlapping areas and gradient fills, time range tabs switch data, tooltips show formatted values, recent releases show thumbnails with status badges, top fans show avatars with ranking badges

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create StatCard in src/components/dashboard/StatCard.tsx (Client Component matching reference layout: top row has icon h-10 w-10 rounded-lg bg-muted on LEFT + change badge bg-success/10 or bg-destructive/10 with TrendingUp/Down icon and % on RIGHT. Label text below. Large value text-2xl font-semibold at bottom with optional $ prefix. Motion m.div with stagger delay prop)
- [ ] T027 [P] [US2] Create RevenueChart in src/components/dashboard/RevenueChart.tsx (Client Component: Recharts AreaChart with SVG defs linearGradient fills (5% opacity top → 0% bottom), Gross vs Net as OVERLAPPING areas (NO stackId), net = gross*0.85 showing meaningful difference, time range tab bar 7d/30d/90d using shadcn Tabs, custom-styled dark tooltip component, clickable legend with colored dots, responsive)
- [ ] T028 [P] [US2] Create FanGrowthChart in src/components/dashboard/FanGrowthChart.tsx (Client Component: Recharts AreaChart with Total vs Active fans OVERLAPPING (NO stackId), SVG gradient fills, amber for Total + green for Active, custom tooltip, legend with colored dots, responsive)
- [ ] T029 [P] [US2] Create RecentReleases in src/components/dashboard/RecentReleases.tsx (cover thumbnail h-16 w-16 rounded-lg with hover scale-105, title truncated, status Badge with color coding live=green/upcoming=amber/ended=gray, type + date, revenue + trend with TrendingUp icon. Each item links to /releases/[id]. StaggerContainer + FadeIn animation. "View all" link to /releases)
- [ ] T030 [P] [US2] Create TopFans in src/components/dashboard/TopFans.tsx (shadcn/ui Avatar + AvatarImage (Unsplash URL) + AvatarFallback (first letter). Top 3 fans show numbered ranking badge h-5 w-5 rounded-full bg-primary positioned absolute -bottom-1 -right-1. Display name, purchase count, total spent text-primary right-aligned. StaggerContainer + FadeIn with delay 0.5+index*0.1)
- [ ] T031 [US2] Build Overview page in src/app/page.tsx + src/app/components/HomePageClient.tsx: Header "Overview" + subtitle. 4 StatCards in StaggerContainer (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4): Total Revenue ($, DollarSign), Total Fans (Users), Active Buyers (ShoppingCart), Avg Order Value ($, TrendingUp). RevenueChart + FanGrowthChart in 2-col grid. RecentReleases (2/3) + TopFans (1/3) bottom section. Fetch from /api/sales + /api/engagement in parallel.

### Unit Tests for User Story 2

- [ ] T032 [P] [US2] Write unit test for StatCard in __tests__/components/StatCard.test.tsx (renders icon, value, change badge, correct colors for positive/negative)
- [ ] T033 [P] [US2] Write unit test for RevenueChart in __tests__/components/RevenueChart.test.tsx (renders chart, time range tabs switch, legend visible)

**Checkpoint**: Overview page complete — interactive charts with stat cards matching reference

---

## Phase 4: User Story 1 — View Recent Releases (Priority: P1)

**Goal**: Artist sees responsive grid of exclusive releases with cover art (Unsplash), gradient overlay, status badges, waveform visualizer, and staggered entrance animations. Cards link to detail page.

**Independent Test**: Load /releases → grid displays release cards with Unsplash images, gradient overlay, status badges, waveform animates on click, cards stagger in, grid adapts across breakpoints, clicking card navigates to /releases/[id]

### Implementation for User Story 1

- [ ] T034 [P] [US1] Update AudioWaveform in src/components/releases/AudioWaveform.tsx (verify: SVG bars with m.rect, play/pause toggle with aria-label, focus ring on button, uses seeded waveform data. Only one waveform active at a time — add onPlay callback prop)
- [ ] T035 [P] [US1] Rewrite ReleaseCard in src/components/releases/ReleaseCard.tsx (cover art with next/image from Unsplash URL, aspect-square, gradient overlay from-black/50 to-transparent, image zoom scale-105 on hover 300ms, status badge overlay positioned bottom-left with backdrop-blur, title h3 font-semibold, type + date, revenue + conversion trend, AudioWaveform below. Card hover: .card-hover + .glow-primary amber glow border. Entire card is Link to /releases/[id])
- [ ] T036 [US1] Build Releases page in src/app/releases/page.tsx + client component: Header "Releases" + subtitle, fetch from /api/releases, responsive grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3), StaggerContainer wrapping FadeIn cards with delay 0.3+index*0.1, SectionSkeleton loading state, EmptyState fallback
- [ ] T037 [US1] Configure next.config.ts to allow Unsplash images: Add images.remotePatterns for images.unsplash.com domain

### Unit Tests for User Story 1

- [ ] T038 [P] [US1] Write unit test for AudioWaveform in __tests__/components/AudioWaveform.test.tsx (renders SVG bars, toggles play/pause, has aria-label)
- [ ] T039 [P] [US1] Write unit test for ReleaseCard in __tests__/components/ReleaseCard.test.tsx (renders cover art, status badge, title, waveform, links to detail)

**Checkpoint**: Releases page complete — grid with animated waveform cards and Unsplash images

---

## Phase 5: User Story 3 — Monitor Fan Engagement (Priority: P2)

**Goal**: Artist sees fan metrics with trend indicators, fan growth chart (overlapping areas), and top fans ranking with avatar badges — all with staggered entrance animations

**Independent Test**: Load /fans → 3 stat cards with trends, fan growth chart renders with overlapping amber/green areas, top fans list displays with avatar images and ranking badges

### Implementation for User Story 3

- [ ] T040 [US3] Build Fans page in src/app/fans/page.tsx + src/app/fans/components/FansPageClient.tsx: Header "Fans" + subtitle. 3 StatCards in StaggerContainer (grid-cols-1 sm:grid-cols-3): Total Fans (Users icon), Active Buyers (UserCheck icon), Engagement Rate (Heart icon, value as %). FanGrowthChart (2/3) + TopFans (1/3) side by side. Fetch from /api/engagement. Reuse StatCard, FanGrowthChart, TopFans from Phase 3.

### Unit Tests for User Story 3

- [ ] T041 [P] [US3] Write unit test for TopFans in __tests__/components/TopFans.test.tsx (renders avatars, ranking badges for top 3, purchase count, total spent)

**Checkpoint**: Fans page complete — reuses components from Overview

---

## Phase 6: User Story 4 — View Release Details (Priority: P2)

**Goal**: Artist clicks a release card and sees detailed analytics with large cover art, status/type badges, 3 stat cards, and a "Revenue Over Time" chart

**Independent Test**: Navigate to /releases/[id] → see back link, large cover art, badges, 3 stat cards (Total Revenue, Units Sold, Conversion Rate), revenue chart

### Implementation for User Story 4

- [ ] T042 [P] [US4] Create ReleaseDetailClient in src/app/releases/[id]/components/ReleaseDetailClient.tsx (Client Component: back link "← Back to Overview" using Link to /releases, cover art h-48 w-48 rounded-xl with shadow, status Badge + type Badge, title h1 text-3xl bold, release date, Share + View Live buttons. 3 StatCards: Total Revenue, Units Sold, Conversion Rate. "Revenue Over Time" AreaChart with amber gradient fill showing generated daily revenue data for this release. Motion entrance animations. Handle release not found with message + link back.)
- [ ] T043 [US4] Create Release Detail page in src/app/releases/[id]/page.tsx (Server Component: extract id from params, fetch release from /api/releases?id=X, pass to ReleaseDetailClient)

### Unit Tests for User Story 4

- [ ] T044 [P] [US4] Write unit test for ReleaseDetailClient in __tests__/components/ReleaseDetailClient.test.tsx (renders cover art, badges, stat cards, chart, back link)

**Checkpoint**: Release detail page complete — demonstrates Next.js dynamic routes

---

## Phase 7: User Story 5 — Manage Account Settings (Priority: P3)

**Goal**: Artist manages profile and notification preferences

**Independent Test**: Navigate to /settings → see profile fields and notification toggles, save shows toast

### Implementation for User Story 5

- [ ] T045 [US5] Create SettingsPageClient in src/app/settings/components/SettingsPageClient.tsx (Client Component: Profile section with Card containing Artist Name + Email using shadcn Input + Label. Notifications section with Card containing 3 Switch toggles: Sales Alerts ("Get notified when you make a sale"), New Fans ("Get notified when someone joins your community"), Weekly Reports ("Receive weekly performance summaries"). Save Changes + Cancel buttons. Save triggers Sonner toast success notification. Motion staggered entrance on sections.)
- [ ] T046 [US5] Create Settings page in src/app/settings/page.tsx (Server Component wrapper rendering SettingsPageClient)

**Checkpoint**: Settings page complete — full SaaS product feel

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final visual polish, accessibility, documentation, deployment

### Accessibility

- [ ] T047 [P] Add keyboard navigation and visible focus states to Sidebar, chart tabs, waveform play/pause, and all interactive elements
- [ ] T048 [P] Verify color contrast meets WCAG 2.1 AA (4.5:1 ratio) across all HSL design tokens
- [ ] T049 [P] Add aria-labels to charts (aria-label on SVG/container), waveform controls, stat cards, and navigation

### Documentation & AI Usage

- [ ] T050 [P] Finalize AI_USAGE.md with all interaction logs from Phases 2-7 and reflection question answers (docs/AI_USAGE.md)
- [ ] T051 [P] Update README.md with feature list, tech choices, setup instructions, screenshots, "what I'd do with more time" (README.md)

### Final Validation & Deployment

- [ ] T052 Test responsive design across breakpoints (320px, 375px, 768px, 1024px, 1280px)
- [ ] T053 Run production build and verify no errors: `npm run build`
- [ ] T054 Deploy to Vercel and verify live demo
- [ ] T055 Run quickstart.md verification checklist

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────────────►
                    │
                    ▼
Phase 2 (Foundation: Motion + Sidebar + API + Unsplash Data) ────►
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
Phase 3 (US2)   Phase 4 (US1)  Phase 5 (US3)  Phase 6 (US4)  Phase 7 (US5)
Overview        Releases       Fans           Rel.Detail     Settings
        │           │           │           │           │
        └───────────┼───────────┴───────────┴───────────┘
                    ▼
Phase 8 (Polish + AI Docs + Deploy) ────────────────────────────►
```

### User Story Dependencies

- **US2 (Overview)**: Depends on Phase 2. Creates StatCard, RevenueChart, FanGrowthChart, RecentReleases, TopFans. START HERE — creates shared components.
- **US1 (Releases)**: Depends on Phase 2. Creates ReleaseCard, AudioWaveform. Independent of US2.
- **US3 (Fans)**: Depends on Phase 2. Reuses StatCard, FanGrowthChart, TopFans from US2. Build after US2.
- **US4 (Release Detail)**: Depends on Phase 2 + US1 (for navigation from release cards). Reuses StatCard from US2.
- **US5 (Settings)**: Depends on Phase 2. Fully independent — can build any time after foundation.

### Within Each User Story

- Components (parallel where marked [P]) → Page assembly → Unit tests (parallel)

### AI Documentation Touchpoints

- After Phase 2: Log Motion primitives + data layer decisions
- After Phase 3/4: Log component implementation + chart patterns
- After Phase 5/6/7: Log remaining pages
- Phase 8: Finalize reflection questions

---

## Parallel Opportunities

### Phase 1 (4 parallel tracks):
```
Track A: T003 (types)
Track B: T004 (utils)
Track C: T005 (constants)
Track D: T006 (waveform — no changes)
```

### Phase 2 (3 parallel tracks after motion primitives):
```
Track A: T008-T011 (motion primitives, all parallel)
Track B: T016-T019 (mock data, all parallel) → T015 (data service) → T020-T022 (API routes)
Track C: T024-T025 (shared components, parallel)
Then sequential: T012 (Sidebar) → T013 (layout) → T014 (template)
```

### Phase 3-7 (parallel user stories):
```
Track A: US2 — T026-T033 (Overview — build first, creates shared components)
Track B: US1 — T034-T039 (Releases — can start same time as US2)
Track C: US5 — T045-T046 (Settings — fully independent)
After US2: US3 — T040-T041 (Fans — reuses US2 components)
After US1: US4 — T042-T044 (Release Detail — needs release card navigation)
```

---

## Implementation Strategy

### MVP First (US2: Overview Page)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundation
3. Complete Phase 3: US2 (Overview with charts)
4. **STOP and VALIDATE**: Overview page works independently — stat cards, charts, recent releases, top fans all display correctly matching reference
5. This creates the shared components (StatCard, charts, TopFans) reused by other stories

### Recommended Order (reference UI fidelity)

1. Phase 1 → Phase 2 → Foundation ready
2. US2 (Overview) → Shared components + charts done
3. US1 (Releases + Waveform) → Signature differentiator visible
4. US3 (Fans) → Quick — reuses US2 components
5. US4 (Release Detail) → Demonstrates dynamic routing
6. US5 (Settings) → Completes SaaS feel
7. Phase 8 (Polish + Deploy) → Ship it

---

## Task Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| Setup | 7 | 4 | Dependencies + types + HSL tokens |
| Foundation | 18 | 10 | Motion + Sidebar + API + Unsplash Data + Shared |
| US2: Overview | 8 | 6 | StatCards + Charts + RecentReleases + TopFans |
| US1: Releases | 6 | 3 | Release grid + waveform + Unsplash images |
| US3: Fans | 2 | 1 | Fans page (reuses US2 components) |
| US4: Release Detail | 3 | 1 | Dynamic route + stats + chart |
| US5: Settings | 2 | 0 | Profile + notifications + toast |
| Polish | 9 | 4 | A11y + docs + deploy |
| **Total** | **55** | **29** | |

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Motion animations are built INTO each component using `m` (not `motion`) inside LazyMotion
- AI_USAGE.md updated incrementally after each major phase (FR-045)
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- Run `npm test && npm run lint` frequently
- **HSL tokens**: --background 220 15% 8%, --primary 42 100% 50%, --success 142 70% 45%
- **Unsplash CDN**: All cover art and avatars from images.unsplash.com with ?w=400&h=400&fit=crop
- **Chart gradients**: SVG defs linearGradient, 5% opacity top → 0% bottom, NO stackId on overlapping areas
- **Reference comparison**: Run reference at localhost:5173 (cd example/even-artist-hub && npm run dev) for visual comparison
- **Import Motion as**: `import { m, LazyMotion, AnimatePresence } from "motion/react"` — use `m` not `motion`
