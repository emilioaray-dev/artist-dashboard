# Tasks: EVEN Backstage Dashboard

**Input**: Design documents from `/specs/001-artist-dashboard/`
**Design Reference**: [Lovable Boceto](https://even-artist-hub.lovable.app)
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: Unit tests (Jest + React Testing Library) and E2E tests (Playwright) included.

**Organization**: Tasks follow the multi-page architecture from the Lovable boceto: Overview (`/`), Releases (`/releases`), Fans (`/fans`), Settings (`/settings`) with persistent sidebar navigation.

## Format: `[ID] [P?] [Page] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Page]**: Which page this task belongs to (Overview, Releases, Fans, Shared)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js App Router (frontend only, multi-page with sidebar)
- **Source**: `src/` at repository root
- **Components**: `src/components/`
- **Types**: `src/types/`
- **Mock data**: `src/__mocks__/`
- **Services**: `src/lib/`
- **API Routes**: `src/app/api/`
- **Unit tests**: `__tests__/` (colocated or root)
- **E2E tests**: `e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, testing frameworks, and base configuration

### Core Dependencies

- [x] T001 Initialize shadcn/ui with `npx shadcn@latest init` (base color: neutral, CSS variables: yes)
- [x] T002 Add shadcn/ui components: `npx shadcn@latest add card skeleton button chart`
- [x] T003 Install additional dependencies: lucide-react, zustand (already in package.json)

### Testing Setup

- [x] T004 Setup Jest and React Testing Library: `npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-node`
- [ ] T005 Create Jest config in jest.config.ts and jest.setup.ts
- [x] T006 Setup Playwright: `npm init playwright@latest` (TypeScript, e2e folder)
- [ ] T007 Add test scripts to package.json: `"test": "jest"`, `"test:e2e": "playwright test"`

### Base Code Structure

- [ ] T008 [P] Create TypeScript interfaces in src/types/index.ts (Channel, Release, SalesData, EngagementMetrics, Fan, ApiResponse)
- [ ] T009 [P] Create utility functions in src/lib/utils.ts (cn helper, formatNumber, formatCurrency, formatDate)
- [ ] T010 [P] Create channel constants in src/lib/constants.ts (channel colors, names, icons, navigation items)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Sidebar, API Routes, Service Layer, and shared components that ALL pages depend on

**CRITICAL**: No page implementation can begin until this phase is complete

### Sidebar & Layout

- [ ] T011 [Shared] Create Sidebar component in src/components/layout/Sidebar.tsx (collapsible, nav links: Overview, Releases, Fans, Settings with Lucide icons, active state, "E Backstage" logo)
- [ ] T012 [Shared] Update root layout in src/app/layout.tsx (integrate Sidebar, flex layout with sidebar + main content area)

### Data Service Layer

- [ ] T013 Create data service interface in src/lib/data-service.ts (abstract data source with TSDoc)
- [ ] T014 [P] Create mock releases data in src/__mocks__/releases.ts (4 releases: Midnight Sessions Vol. 3, Electric Dreams, Acoustic Sessions, Summer Vibes Bundle with status LIVE/UPCOMING/ENDED)
- [ ] T015 [P] Create mock sales data in src/__mocks__/sales.ts (30 days of daily Gross vs Net revenue)
- [ ] T016 [P] Create mock engagement data in src/__mocks__/engagement.ts (fan metrics + fan history)
- [ ] T017 [P] Create mock fans data in src/__mocks__/fans.ts (top fans: Alex Rivera, Jordan Kim, Sam Chen, Morgan Taylor, Riley Quinn)
- [ ] T018 Implement data service with mock data in src/lib/data-service.ts

### API Routes (Reverse Proxy Pattern)

- [ ] T019 Create API route for releases in src/app/api/releases/route.ts (GET with error handling, simulated delay)
- [ ] T020 [P] Create API route for sales in src/app/api/sales/route.ts (GET with error handling, simulated delay)
- [ ] T021 [P] Create API route for engagement in src/app/api/engagement/route.ts (GET with error handling, simulated delay)
- [ ] T022 Create API client functions in src/lib/api.ts (fetchReleases, fetchSales, fetchEngagement with typed responses)

### Shared Components

- [ ] T023 [P] Create EmptyState component in src/components/shared/EmptyState.tsx (with TSDoc)
- [ ] T024 [P] Create SectionSkeleton component in src/components/shared/SectionSkeleton.tsx (with TSDoc)
- [ ] T025 [P] Create ErrorState component in src/components/shared/ErrorState.tsx (with retry button, TSDoc)

**Checkpoint**: Foundation ready - page implementation can now begin

---

## Phase 3: Overview Page (`/`) - Dashboard Summary

**Goal**: Display overview with 4 metric cards, Revenue chart (Gross vs Net), Fan Growth chart, Recent Releases list, and Top Fans ranking

**Matches Lovable boceto**: Overview page layout exactly

### Implementation for Overview Page

- [ ] T026 [P] [Overview] Create MetricCard component in src/components/dashboard/MetricCard.tsx (icon, trend badge with %, value, label - amber/gold accent)
- [ ] T027 [P] [Overview] Create RevenueChart component in src/components/dashboard/RevenueChart.client.tsx (Client Component, AreaChart with Gross vs Net lines, amber gradient)
- [ ] T028 [P] [Overview] Create FanGrowthChart component in src/components/dashboard/FanGrowthChart.client.tsx (Client Component, AreaChart with Total vs Active lines)
- [ ] T029 [P] [Overview] Create RecentReleasesList component in src/components/dashboard/RecentReleasesList.tsx (list layout with thumbnail, title, status badge, type, date, revenue, trend)
- [ ] T030 [P] [Overview] Create TopFans component in src/components/dashboard/TopFans.tsx (ranked list with avatar, name, purchases, total spent)
- [ ] T031 [Overview] Build Overview page in src/app/page.tsx (4 metric cards row + Revenue chart + Fan Growth chart + Recent Releases & Top Fans side by side, with Suspense boundaries)

### Unit Tests for Overview

- [ ] T032 [P] [Overview] Write unit test for MetricCard in __tests__/components/MetricCard.test.tsx
- [ ] T033 [P] [Overview] Write unit test for RecentReleasesList in __tests__/components/RecentReleasesList.test.tsx
- [ ] T034 [Overview] Write unit test for formatNumber and formatCurrency utilities in __tests__/lib/utils.test.ts

**Checkpoint**: Overview page complete - dashboard shows all summary data

---

## Phase 4: Releases Page (`/releases`) - Release Grid

**Goal**: Display responsive grid of release cards with cover art, status badge, title, type, date, revenue, and trend

**Matches Lovable boceto**: Releases page with 3-column grid

### Implementation for Releases Page

- [ ] T035 [P] [Releases] Create ReleaseCard component in src/components/releases/ReleaseCard.tsx (large cover art, status badge overlay LIVE/UPCOMING/ENDED, title, type + date, revenue + trend)
- [ ] T036 [P] [Releases] Create ReleaseCardSkeleton component in src/components/releases/ReleaseCardSkeleton.tsx
- [ ] T037 [Releases] Create ReleasesGrid component in src/components/releases/ReleasesGrid.tsx (responsive grid: 3 cols desktop, 2 tablet, 1 mobile)
- [ ] T038 [Releases] Build Releases page in src/app/releases/page.tsx (header "Releases" + subtitle + grid, with Suspense boundary)

### Unit Tests for Releases

- [ ] T039 [P] [Releases] Write unit test for ReleaseCard in __tests__/components/ReleaseCard.test.tsx
- [ ] T040 [P] [Releases] Write unit test for ReleasesGrid in __tests__/components/ReleasesGrid.test.tsx

**Checkpoint**: Releases page complete - shows grid of releases with cover art

---

## Phase 5: Fans Page (`/fans`) - Fan Engagement

**Goal**: Display 3 fan metric cards (Total Fans, Active Buyers, Engagement Rate), Fan Growth chart, and Top Fans ranking

**Matches Lovable boceto**: Fans page layout exactly

### Implementation for Fans Page

- [ ] T041 [P] [Fans] Create FanMetricCard component (reuse MetricCard with fan-specific icons: Users, UserCheck, Heart)
- [ ] T042 [Fans] Build Fans page in src/app/fans/page.tsx (3 metric cards + Fan Growth Chart & Top Fans side by side, with Suspense boundaries)

### Unit Tests for Fans

- [ ] T043 [P] [Fans] Write unit test for Fans page metrics in __tests__/pages/fans.test.tsx
- [ ] T044 [Fans] Write unit test for TopFans component in __tests__/components/TopFans.test.tsx

**Checkpoint**: Fans page complete - shows fan metrics and engagement data

---

## Phase 6: Settings Page (`/settings`) - Placeholder

- [ ] T045 [Settings] Create Settings placeholder page in src/app/settings/page.tsx (header + "Settings coming soon" message)

---

## Phase 7: E2E Tests (Playwright)

**Purpose**: End-to-end tests verifying complete user journeys across pages

- [ ] T046 [P] Write E2E test: Overview page loads with all sections in e2e/overview.spec.ts
- [ ] T047 [P] Write E2E test: Releases page grid displays correctly in e2e/releases.spec.ts
- [ ] T048 [P] Write E2E test: Fans page metrics display with trends in e2e/fans.spec.ts
- [ ] T049 [P] Write E2E test: Sidebar navigation works across pages in e2e/navigation.spec.ts
- [ ] T050 Write E2E test: Responsive design works on mobile viewport in e2e/responsive.spec.ts
- [ ] T051 Run all E2E tests and verify passing: `npm run test:e2e`

**Checkpoint**: All E2E tests passing - full user journeys verified

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, animations, accessibility, and deployment preparation

### Animations & Micro-interactions

- [ ] T052 [P] Add fade-in animation to page sections on load in src/app/globals.css
- [ ] T053 [P] Add hover scale effect to ReleaseCard in src/components/releases/ReleaseCard.tsx
- [ ] T054 [P] Add smooth chart tooltip transitions in chart components
- [ ] T055 [P] Add skeleton pulse animation enhancement in src/components/shared/SectionSkeleton.tsx
- [ ] T056 [P] Add trend indicator animation (subtle bounce) to MetricCard

### Accessibility

- [ ] T057 [P] Add keyboard navigation and focus states to Sidebar and all interactive elements
- [ ] T058 [P] Verify color contrast meets WCAG 2.1 AA (4.5:1 ratio)
- [ ] T059 [P] Add aria-labels to charts and interactive elements

### Documentation & Code Quality

- [ ] T060 [P] Verify all public functions have TSDoc/JSDoc documentation
- [ ] T061 [P] Run TypeScript strict mode validation: `npx tsc --noEmit`
- [ ] T062 [P] Update README.md with final feature list and screenshots
- [ ] T063 [P] Complete docs/AI_USAGE.md with all AI interaction logs and reflection answers

### Final Validation & Deployment

- [ ] T064 Test full responsive design across breakpoints (320px, 768px, 1024px, 1280px)
- [ ] T065 Run all tests: `npm test && npm run test:e2e`
- [ ] T066 Run production build and verify no errors: `npm run build`
- [ ] T067 Deploy to Vercel and verify live demo

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────────►
                    │
                    ▼
Phase 2 (Foundational: Sidebar + API + Shared) ──────────────►
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
Phase 3 (Overview)  Phase 4     Phase 5 (Fans)  ← Can run in parallel
                    (Releases)
        │           │           │
        └───────────┼───────────┘
                    ▼
Phase 6 (Settings placeholder) ──────────────────────────────►
                    ▼
Phase 7 (E2E Tests) ─────────────────────────────────────────►
                    ▼
Phase 8 (Polish) ─────────────────────────────────────────────►
```

### Page Dependencies

- **Overview** (`/`): Depends on Phase 2. Uses MetricCard, RevenueChart, FanGrowthChart, RecentReleasesList, TopFans.
- **Releases** (`/releases`): Depends on Phase 2. Independent of Overview and Fans.
- **Fans** (`/fans`): Depends on Phase 2. Reuses MetricCard, FanGrowthChart, TopFans from Overview.
- **Settings** (`/settings`): Placeholder, no dependencies.

---

## Task Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| Setup | 10 | 3 | Dependencies + test frameworks |
| Foundational | 15 | 8 | Sidebar + API Routes + Service Layer + shared |
| Overview | 9 | 6 | Overview page + unit tests |
| Releases | 6 | 3 | Releases grid page + unit tests |
| Fans | 4 | 2 | Fans page + unit tests |
| Settings | 1 | 0 | Placeholder page |
| E2E Tests | 6 | 4 | Playwright tests |
| Polish | 16 | 11 | Animations + a11y + docs + deploy |
| **Total** | **67** | **37** |

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Page] label maps task to specific page for traceability
- Each page is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- All chart components require `"use client"` directive
- Server Components used by default, Client Components only for interactivity
- All code must include TSDoc/JSDoc documentation
- **Run tests frequently**: `npm test` after each phase
- **Design reference**: Match the Lovable boceto at https://even-artist-hub.lovable.app
- **Color palette**: Dark theme with amber/gold accents for icons and data, green for positive trends
