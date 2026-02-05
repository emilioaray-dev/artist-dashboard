# Tasks: EVEN Backstage Dashboard

**Input**: Design documents from `/specs/001-artist-dashboard/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: Unit tests (Jest + React Testing Library) and E2E tests (Playwright) included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js App Router (frontend only)
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

- [ ] T001 Initialize shadcn/ui with `npx shadcn@latest init` (base color: slate, CSS variables: yes)
- [ ] T002 Add shadcn/ui components: `npx shadcn@latest add card skeleton button chart`
- [ ] T003 Install additional dependencies: `npm install lucide-react zustand`

### Testing Setup

- [ ] T004 Setup Jest and React Testing Library: `npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-node`
- [ ] T005 Create Jest config in jest.config.ts and jest.setup.ts
- [ ] T006 Setup Playwright: `npm init playwright@latest` (TypeScript, e2e folder, GitHub Actions: no)
- [ ] T007 Add test scripts to package.json: `"test": "jest"`, `"test:e2e": "playwright test"`

### Base Code Structure

- [ ] T008 [P] Create TypeScript interfaces in src/types/index.ts (Channel, Release, SalesData, EngagementMetrics, ApiResponse)
- [ ] T009 [P] Create utility functions in src/lib/utils.ts (cn helper, formatNumber, formatCurrency, formatDate)
- [ ] T010 [P] Create channel constants in src/lib/constants.ts (channel colors, names, icons for Direct to Fan, Digital, Physical, Bundles)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API Routes, Service Layer, and shared components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Data Service Layer

- [ ] T011 Create data service interface in src/lib/data-service.ts (abstract data source with TSDoc)
- [ ] T012 [P] Create mock releases data in src/__mocks__/releases.ts (8-10 sample releases with channel breakdown)
- [ ] T013 [P] Create mock sales data in src/__mocks__/sales.ts (30 days of daily revenue by channel)
- [ ] T014 [P] Create mock engagement data in src/__mocks__/engagement.ts (fan metrics + purchase rate + history)
- [ ] T015 Implement data service with mock data in src/lib/data-service.ts

### API Routes (Reverse Proxy Pattern)

- [ ] T016 Create API route for releases in src/app/api/releases/route.ts (GET with error handling, simulated delay)
- [ ] T017 [P] Create API route for sales in src/app/api/sales/route.ts (GET with error handling, simulated delay)
- [ ] T018 [P] Create API route for engagement in src/app/api/engagement/route.ts (GET with error handling, simulated delay)
- [ ] T019 Create API client functions in src/lib/api.ts (fetchReleases, fetchSales, fetchEngagement with typed responses)

### Shared Components

- [ ] T020 Create EmptyState component in src/components/shared/EmptyState.tsx (with TSDoc)
- [ ] T021 [P] Create SectionSkeleton component in src/components/shared/SectionSkeleton.tsx (with TSDoc)
- [ ] T022 [P] Create ErrorState component in src/components/shared/ErrorState.tsx (with retry button, TSDoc)
- [ ] T023 Create DashboardHeader component in src/components/dashboard/Header.tsx (with TSDoc)
- [ ] T024 Update root layout in src/app/layout.tsx (metadata, fonts, providers)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Recent Releases (Priority: P1) 🎯 MVP

**Goal**: Display a responsive grid of exclusive releases with cover art, title, date, sales count, and revenue

**Independent Test**: Load dashboard → verify release cards display in responsive grid with all required info from API

### Implementation for User Story 1

- [ ] T025 [P] [US1] Create ReleaseCard component in src/components/dashboard/RecentReleases/ReleaseCard.tsx (Server Component with TSDoc)
- [ ] T026 [P] [US1] Create ReleaseCardSkeleton component in src/components/dashboard/RecentReleases/ReleaseCardSkeleton.tsx
- [ ] T027 [US1] Create ReleasesGrid component in src/components/dashboard/RecentReleases/ReleasesGrid.tsx (Server Component, fetches from API)
- [ ] T028 [US1] Create barrel export in src/components/dashboard/RecentReleases/index.tsx
- [ ] T029 [US1] Add RecentReleases section to dashboard page in src/app/page.tsx (with Suspense boundary)

### Unit Tests for User Story 1

- [ ] T030 [P] [US1] Write unit test for ReleaseCard in __tests__/components/ReleaseCard.test.tsx
- [ ] T031 [P] [US1] Write unit test for ReleasesGrid in __tests__/components/ReleasesGrid.test.tsx
- [ ] T032 [US1] Write unit test for formatNumber and formatCurrency utilities in __tests__/lib/utils.test.ts

**Checkpoint**: User Story 1 complete - dashboard shows releases grid with tests passing

---

## Phase 4: User Story 2 - Sales Analytics (Priority: P1)

**Goal**: Display interactive charts showing revenue trends and channel breakdown (Direct to Fan focus)

**Independent Test**: Load dashboard → verify revenue chart displays with tooltips and channel breakdown chart

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create RevenueChart component in src/components/dashboard/SalesAnalytics/RevenueChart.client.tsx (Client Component, AreaChart)
- [ ] T034 [P] [US2] Create ChannelBreakdown component in src/components/dashboard/SalesAnalytics/ChannelBreakdown.client.tsx (Client Component, BarChart)
- [ ] T035 [P] [US2] Create SalesSummaryCard component in src/components/dashboard/SalesAnalytics/SalesSummaryCard.tsx (gross vs net revenue)
- [ ] T036 [US2] Create SalesAnalytics section component in src/components/dashboard/SalesAnalytics/index.tsx (Server Component container)
- [ ] T037 [US2] Add SalesAnalytics section to dashboard page in src/app/page.tsx (with Suspense boundary)

### Unit Tests for User Story 2

- [ ] T038 [P] [US2] Write unit test for SalesSummaryCard in __tests__/components/SalesSummaryCard.test.tsx
- [ ] T039 [P] [US2] Write unit test for API route sales endpoint in __tests__/api/sales.test.ts
- [ ] T040 [US2] Write unit test for RevenueChart renders without errors in __tests__/components/RevenueChart.test.tsx

**Checkpoint**: User Stories 1 AND 2 complete with tests passing

---

## Phase 5: User Story 3 - Fan Engagement (Priority: P2)

**Goal**: Display fan metrics (total fans, buyers, engagement rate, purchase rate) with trend indicators and growth chart

**Independent Test**: Load dashboard → verify metric cards display with trends and fan growth chart renders

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create MetricCard component in src/components/dashboard/FanEngagement/MetricCard.tsx (with trend indicator)
- [ ] T042 [P] [US3] Create FanChart component in src/components/dashboard/FanEngagement/FanChart.client.tsx (Client Component, LineChart)
- [ ] T043 [US3] Create FanEngagement section component in src/components/dashboard/FanEngagement/index.tsx (Server Component container)
- [ ] T044 [US3] Add FanEngagement section to dashboard page in src/app/page.tsx (with Suspense boundary)

### Unit Tests for User Story 3

- [ ] T045 [P] [US3] Write unit test for MetricCard in __tests__/components/MetricCard.test.tsx
- [ ] T046 [P] [US3] Write unit test for trend indicator logic in __tests__/components/MetricCard.test.tsx
- [ ] T047 [US3] Write unit test for FanChart renders without errors in __tests__/components/FanChart.test.tsx

**Checkpoint**: All user stories complete with unit tests passing

---

## Phase 6: E2E Tests (Playwright)

**Purpose**: End-to-end tests verifying complete user journeys

- [ ] T048 [P] Write E2E test: Dashboard loads with all sections in e2e/dashboard.spec.ts
- [ ] T049 [P] Write E2E test: Recent Releases grid displays correctly in e2e/releases.spec.ts
- [ ] T050 [P] Write E2E test: Sales Analytics charts are interactive in e2e/sales.spec.ts
- [ ] T051 [P] Write E2E test: Fan Engagement metrics display with trends in e2e/engagement.spec.ts
- [ ] T052 Write E2E test: Responsive design works on mobile viewport in e2e/responsive.spec.ts
- [ ] T053 Run all E2E tests and verify passing: `npm run test:e2e`

**Checkpoint**: All E2E tests passing - full user journeys verified

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, animations, accessibility, and deployment preparation

### Animations & Micro-interactions

- [ ] T054 [P] Add fade-in animation to dashboard sections on load in src/app/globals.css
- [ ] T055 [P] Add hover scale effect to ReleaseCard in src/components/dashboard/RecentReleases/ReleaseCard.tsx
- [ ] T056 [P] Add smooth chart tooltip transitions in chart components
- [ ] T057 [P] Add skeleton pulse animation enhancement in src/components/shared/SectionSkeleton.tsx
- [ ] T058 [P] Add trend indicator animation (subtle bounce) to MetricCard

### Accessibility

- [ ] T059 [P] Add keyboard navigation and focus states to all interactive elements
- [ ] T060 [P] Verify color contrast meets WCAG 2.1 AA (4.5:1 ratio)
- [ ] T061 [P] Add aria-labels to charts and interactive elements

### Documentation & Code Quality

- [ ] T062 [P] Verify all public functions have TSDoc/JSDoc documentation
- [ ] T063 [P] Run TypeScript strict mode validation: `npx tsc --noEmit`
- [ ] T064 [P] Update README.md with final feature list and screenshots
- [ ] T065 [P] Complete docs/AI_USAGE.md with all AI interaction logs and reflection answers

### Final Validation & Deployment

- [ ] T066 Test full responsive design across breakpoints (320px, 768px, 1024px, 1280px)
- [ ] T067 Run all tests: `npm test && npm run test:e2e`
- [ ] T068 Run production build and verify no errors: `npm run build`
- [ ] T069 Deploy to Vercel and verify live demo

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────────►
                    │
                    ▼
Phase 2 (Foundational) ───────────────────────────────────────►
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
Phase 3 (US1)   Phase 4 (US2)   Phase 5 (US3)  ← Can run in parallel
        │           │           │
        └───────────┼───────────┘
                    ▼
Phase 6 (E2E Tests) ──────────────────────────────────────────►
                    │
                    ▼
Phase 7 (Polish) ─────────────────────────────────────────────►
```

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Phase 2. No dependencies on other stories.
- **User Story 2 (P1)**: Depends only on Phase 2. Independent of US1 and US3.
- **User Story 3 (P2)**: Depends only on Phase 2. Independent of US1 and US2.

### Within Each User Story

1. Parallel component creation (cards, charts) - marked [P]
2. Section container component (Server Component)
3. Integration into main page (with Suspense)
4. Unit tests for components

---

## Parallel Execution Examples

### Phase 1 Parallel Tasks

```bash
# Can run simultaneously after T001-T007:
T008: "Create TypeScript interfaces in src/types/index.ts"
T009: "Create utility functions in src/lib/utils.ts"
T010: "Create channel constants in src/lib/constants.ts"
```

### Phase 2 Parallel Tasks

```bash
# Can run simultaneously after T011:
T012: "Create mock releases data in src/__mocks__/releases.ts"
T013: "Create mock sales data in src/__mocks__/sales.ts"
T014: "Create mock engagement data in src/__mocks__/engagement.ts"

# API Routes can run in parallel after T015:
T016: "Create API route for releases"
T017: "Create API route for sales"
T018: "Create API route for engagement"
```

### User Story + Tests Parallel Tasks

```bash
# US1 parallel components:
T025: "Create ReleaseCard component"
T026: "Create ReleaseCardSkeleton component"

# US1 parallel tests (after implementation):
T030: "Write unit test for ReleaseCard"
T031: "Write unit test for ReleasesGrid"

# E2E tests (all parallel):
T048-T051: All E2E test files can be written in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only) - Recommended for Time Constraint

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T024)
3. Complete Phase 3: User Story 1 + Tests (T025-T032)
4. **STOP and VALIDATE**: Run unit tests
5. Add key E2E test (T048-T049)
6. Add animations (T054-T055) and accessibility (T059-T061)
7. Complete documentation (T064-T065)
8. Complete deployment tasks (T066-T069)

**Result**: Working dashboard with releases section + tests + animations + a11y

### Full Implementation

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 + Tests → **Checkpoint: MVP ready**
4. Complete Phase 4: User Story 2 + Tests → **Checkpoint: +Analytics**
5. Complete Phase 5: User Story 3 + Tests → **Checkpoint: Full feature**
6. Complete Phase 6: E2E Tests → **Checkpoint: All tests passing**
7. Complete Phase 7: Polish → **Checkpoint: Production ready**

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [US#] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- All chart components require `"use client"` directive
- Server Components used by default, Client Components only for interactivity
- All code must include TSDoc/JSDoc documentation
- **Run tests frequently**: `npm test` after each phase

### Architecture Reminders

- **API Routes** serve as reverse proxy to data service layer (FR-016 to FR-020)
- **SOLID Principles** must be followed in all components (FR-021)
- **Server Components** by default, Client Components only when needed (FR-024)
- **TSDoc/JSDoc** on all public functions (FR-026)
- **TypeScript strict mode** - no implicit any (FR-027)

### AI Documentation Reminder (REQUIRED)

**After each major feature, update `docs/AI_USAGE.md`:**
1. Add new entry under "AI Tools Usage Log" using the template
2. Document: Goal, Tool Used, Prompt/Approach, Result, Learning
3. Be specific about what you modified from AI suggestions
4. Complete reflection questions before final submission

---

## Task Summary

| Phase | Tasks | Parallel | Description |
|-------|-------|----------|-------------|
| Setup | 10 | 3 | Dependencies + test frameworks |
| Foundational | 14 | 8 | API Routes + Service Layer + shared components |
| US1 - Releases | 8 | 4 | Implementation + unit tests |
| US2 - Sales | 8 | 4 | Implementation + unit tests |
| US3 - Engagement | 7 | 4 | Implementation + unit tests |
| E2E Tests | 6 | 4 | Playwright tests |
| Polish | 16 | 11 | Animations + a11y + docs + deploy |
| **Total** | **69** | **38** |

## Requirements Coverage

| Requirement | Status | Tasks |
|-------------|--------|-------|
| Next.js 16+ App Router | ✅ | Built-in |
| TypeScript strict | ✅ | T008, T063 |
| Tailwind CSS | ✅ | Built-in |
| shadcn/ui | ✅ | T001-T002 |
| API Routes (reverse proxy) | ✅ | T016-T019 |
| Service Layer | ✅ | T011, T015 |
| SOLID Principles | ✅ | All components |
| Server/Client Components | ✅ | T025-T044 |
| TSDoc/JSDoc | ✅ | T062 |
| State management (Zustand) | ✅ | T003 (installed if needed) |
| **Testing (unit)** | ✅ | T030-T032, T038-T040, T045-T047 |
| **Testing (E2E)** | ✅ | T048-T053 |
| Animations/micro-interactions | ✅ | T054-T058 |
| Error handling & loading states | ✅ | T020-T022, T026 |
| Accessibility | ✅ | T059-T061 |
| AI Usage Documentation | ✅ | T065 (docs/AI_USAGE.md) |
