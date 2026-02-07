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

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Install new dependencies, define types, HSL design tokens, and base configuration. Existing setup (shadcn/ui, lucide-react, motion, vitest) is already in place — focus on what needs to change.

### Dependencies

- [x] T001 Add shadcn/ui components needed for reference UI: Added button, card, chart, input, label, select, skeleton, switch, tabs to `src/components/ui/core/`
- [x] T002 ~~Remove zustand~~ — Kept zustand for global audio player state (Zustand store at `src/store/player-store.ts`)

### Base Code Structure

- [x] T003 [P] Update TypeScript interfaces in src/types/index.ts: Updated ReleaseStatus, added TopFan, DashboardStats, component types in src/types/component-types.ts
- [x] T004 [P] Update utility functions in src/lib/utils.ts: formatCurrency, formatNumber, formatDate, cn helper
- [x] T005 [P] Update constants in src/lib/constants.ts: Settings nav item, CHART_COLORS, TIME_RANGES, channel info
- [x] T006 [P] Keep waveform generator in src/lib/waveform.ts (no changes needed)

### Design Tokens (oklch System)

- [x] T007 Rewrite src/app/globals.css with oklch-based design tokens (Tailwind v4 requirement — HSL replaced with oklch). Single :root block with --color-primary, --color-background, --color-muted, etc.

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Motion primitives, Sidebar (with Settings link), API Routes, Data Service Layer, mock data — ALL pages depend on these

### Motion Primitives

- [x] T008 [P] MotionProvider in src/components/motion/MotionProvider.tsx — LazyMotion + MotionConfig reducedMotion="user"
- [x] T009 [P] PageTransition in src/components/motion/PageTransition.tsx — AnimatePresence mode="wait"
- [x] T010 [P] StaggerContainer in src/components/motion/StaggerContainer.tsx — staggerChildren variants
- [x] T011 [P] FadeIn in src/components/motion/FadeIn.tsx + AnimationUtils.tsx (FadeInAnimation, SlideInAnimation)

### Layout

- [x] T012 Sidebar in src/components/layout/Sidebar.tsx — 4 nav items (Overview, Releases, Fans, Settings), collapsible
- [x] T013 Root layout in src/app/layout.tsx — MotionProvider + SidebarProvider + MainLayout via client-layout.tsx
- [x] T014 template.tsx in src/app/template.tsx — PageTransition wrapper

### Data Service Layer

- [x] T015 Data service in src/lib/data-service.ts — getReleases, getSales (gross+net), getEngagement, getTopFans
- [x] T016 [P] Mock releases in src/**mocks**/releases.ts — 6 releases with local cover art (public/covers/)
- [x] T017 [P] Mock sales in src/**mocks**/sales.ts — daily data with gross/net, 7d/30d/90d ranges
- [x] T018 [P] Mock engagement in src/**mocks**/engagement.ts — fan growth history, active rates
- [x] T019 [P] Mock fans in src/**mocks**/fans.ts — 5 top fans with local avatars (public/avatars/)

### API Routes

- [x] T020 API route for releases in src/app/api/releases/route.ts
- [x] T021 [P] API route for sales in src/app/api/sales/route.ts — GET with ?range=7d|30d|90d
- [x] T022 [P] API route for engagement in src/app/api/engagement/route.ts
- [x] T023 API client in src/lib/api.ts + server actions in src/lib/actions.ts (unstable_cache)

### Shared Components

- [x] T024 [P] EmptyState in src/components/ui/customs/feedback/EmptyState.tsx — FadeIn animation
- [x] T025 [P] GenericSkeleton in src/components/ui/customs/feedback/GenericSkeleton.tsx — configurable skeleton system (replaced SectionSkeleton)

**Checkpoint**: Foundation ready ✅

---

## Phase 3: User Story 2 — Analyze Sales Performance (Priority: P1) MVP ✅

**Goal**: Artist sees Overview page with metric cards, interactive revenue chart with time range tabs, fan growth chart, recent releases list, and top fans — all with staggered entrance animations

### Implementation for User Story 2

- [x] T026 [P] [US2] MetricCard in src/components/ui/customs/cards/MetricCard.tsx + ClientMetricCard.tsx — icon, value, change badge, trend indicator
- [x] T027 [P] [US2] RevenueChart in src/components/ui/customs/charts/RevenueChart.tsx — Recharts AreaChart, 7d/30d/90d tabs, gross vs net, channel breakdown, tooltips
- [x] T028 [P] [US2] FanGrowthChart in src/components/ui/customs/charts/FanGrowthChart.tsx — total vs active fans, tooltips, legend
- [x] T029 [P] [US2] RecentReleasesList in src/components/ui/customs/lists/RecentReleasesList.tsx — cover thumbnails, status badges, audio waveform
- [x] T030 [P] [US2] TopFans in src/components/ui/customs/lists/TopFans.tsx — avatars, ranking, purchase count, total spent
- [x] T031 [US2] Overview page in src/app/page.tsx + src/app/\_components/HomePageStreaming.tsx — Server Component with Suspense streaming, parallel data fetching via server actions

### Unit Tests for User Story 2

- [x] T032 [P] [US2] MetricCard test in **tests**/components/MetricCard.test.tsx + **tests**/metric-card.test.tsx + snapshot test
- [x] T033 [P] [US2] RevenueChart test in **tests**/components/RevenueChart.test.tsx — renders chart, time range tabs, loading state

**Checkpoint**: Overview page complete ✅

---

## Phase 4: User Story 1 — View Recent Releases (Priority: P1) ✅

**Goal**: Artist sees responsive grid of releases with cover art, status badges, waveform visualizer, and staggered entrance animations

### Implementation for User Story 1

- [x] T034 [P] [US1] AudioWaveform in src/components/audio/AudioWaveform.tsx — SVG bars, play/pause toggle, aria-label, seeded waveform data
- [x] T035 [P] [US1] ReleaseCard in src/components/ui/customs/cards/ReleaseCard.tsx — cover art, status badge, title, type, revenue, AudioWaveform
- [x] T036 [US1] Releases page in src/app/releases/page.tsx + src/app/releases/\_components/ — Server Component with Suspense, responsive grid, loading/error states
- [x] T037 [US1] ~~Unsplash config~~ — Used local images (public/covers/) instead of Unsplash CDN

### Unit Tests for User Story 1

- [x] T038 [P] [US1] AudioWaveform test in **tests**/components/AudioWaveform.test.tsx
- [x] T039 [P] [US1] ReleaseCard test in **tests**/components/ReleaseCard.test.tsx

**Checkpoint**: Releases page complete ✅

---

## Phase 5: User Story 3 — Monitor Fan Engagement (Priority: P2) ✅

**Goal**: Artist sees fan metrics with trend indicators, fan growth chart, and top fans ranking with avatar badges

### Implementation for User Story 3

- [x] T040 [US3] Fans page in src/app/fans/page.tsx + src/app/fans/\_components/ — Server Component with Suspense, metric cards, FanGrowthChart, TopFans. Reuses components from Phase 3.

### Unit Tests for User Story 3

- [x] T041 [P] [US3] TopFans test in **tests**/components/TopFans.test.tsx — renders avatars, purchase count, total spent

**Checkpoint**: Fans page complete ✅

---

## Phase 6: User Story 4 — View Release Details (Priority: P2) ⏳

**Goal**: Artist clicks a release card and sees detailed analytics with large cover art, status/type badges, stat cards, and a revenue chart

**Status**: Not implemented — deferred as low priority

### Implementation for User Story 4

- [ ] T042 [P] [US4] Create ReleaseDetailClient in src/app/releases/[id]/\_components/ReleaseDetailClient.tsx
- [ ] T043 [US4] Create Release Detail page in src/app/releases/[id]/page.tsx

### Unit Tests for User Story 4

- [ ] T044 [P] [US4] Write unit test for ReleaseDetailClient

**Checkpoint**: Pending

---

## Phase 7: User Story 5 — Manage Account Settings (Priority: P3) ✅

**Goal**: Artist manages profile and notification preferences

### Implementation for User Story 5

- [x] T045 [US5] SettingsPageClient in src/app/settings/\_components/SettingsPageClient.tsx — Account info (email, name) + Preferences (notifications switch, theme select) using shadcn Input, Label, Switch, Select
- [x] T046 [US5] Settings page in src/app/settings/page.tsx — Server Component wrapper

**Checkpoint**: Settings page complete ✅

---

## Phase 8: Polish & Cross-Cutting Concerns ✅ (partial)

**Purpose**: Final visual polish, accessibility, documentation, deployment

### Accessibility

- [x] T047 [P] Keyboard navigation and focus states — shadcn components provide built-in focus rings, sidebar/tabs/waveform all keyboard accessible
- [x] T048 [P] Color contrast — oklch design tokens validated, accessibility tests pass
- [x] T049 [P] aria-labels — applied to charts, waveform controls, navigation

### Documentation & AI Usage

- [x] T050 [P] AI_USAGE.md finalized in docs/AI_USAGE.md
- [x] T051 [P] README.md updated with features, tech choices, project structure, setup instructions

### Final Validation & Deployment

- [x] T052 Responsive design tested — 25 Playwright E2E tests including responsive breakpoints
- [x] T053 Production build verified — `npm run build` passes with 0 errors
- [ ] T054 Deploy to Vercel — pending
- [x] T055 Quickstart verification — build, tests (56/56), lint all pass

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

| Phase               | Tasks  | Done      | Status |
| ------------------- | ------ | --------- | ------ |
| Setup               | 7      | 7/7       | ✅     |
| Foundation          | 18     | 18/18     | ✅     |
| US2: Overview       | 8      | 8/8       | ✅     |
| US1: Releases       | 6      | 6/6       | ✅     |
| US3: Fans           | 2      | 2/2       | ✅     |
| US4: Release Detail | 3      | 0/3       | ⏳     |
| US5: Settings       | 2      | 2/2       | ✅     |
| Polish              | 9      | 8/9       | ✅     |
| **Total**           | **55** | **51/55** |        |

**Remaining**: T042–T044 (Release Detail page — deferred), T054 (Vercel deployment — pending)

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
