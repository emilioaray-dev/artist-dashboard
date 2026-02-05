# Implementation Plan: Music Artist Dashboard

**Branch**: `001-artist-dashboard` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-artist-dashboard/spec.md`

## Summary

Build a responsive Music Artist Dashboard with three core sections: Recent Releases (grid display), Sales Analytics (interactive charts), and Fan Engagement (metrics cards). Uses Next.js 16 App Router with React 19, TypeScript, Tailwind CSS 4, shadcn/ui components, and Recharts for data visualization. All data is mocked.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3
**Primary Dependencies**: Next.js 16.1.6, shadcn/ui (including charts), Lucide React
**Storage**: N/A (mock data only, no persistence)
**Testing**: Jest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend only)
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals "Good")
**Constraints**: Mobile-first responsive (320px - 2560px), keyboard accessible
**Scale/Scope**: Single-page dashboard, 3 sections, ~10 components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

> Note: Constitution is in template state. Applying reasonable defaults based on modern frontend best practices.

| Principle | Status | Notes |
|-----------|--------|-------|
| Component-First | PASS | All UI built as reusable React components in `src/components/` |
| Type Safety | PASS | TypeScript strict mode, explicit interfaces for all data |
| Accessibility | PASS | FR-023 requires keyboard accessibility, WCAG 2.1 AA target |
| Performance | PASS | Core Web Vitals targets defined in SC-001, SC-002 |
| Responsive Design | PASS | Mobile-first approach, FR-020 mandates full responsiveness |

## Project Structure

### Documentation (this feature)

```text
specs/001-artist-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

**Design Reference**: [Lovable Boceto](https://even-artist-hub.lovable.app) - Multi-page dashboard with sidebar navigation

```text
src/
├── app/
│   ├── layout.tsx           # Root layout with Sidebar
│   ├── page.tsx             # Overview page (dashboard summary)
│   ├── globals.css          # Global styles + Tailwind
│   ├── releases/
│   │   └── page.tsx         # Releases grid page
│   ├── fans/
│   │   └── page.tsx         # Fans page
│   ├── settings/
│   │   └── page.tsx         # Settings page (placeholder)
│   └── api/
│       ├── releases/
│       │   └── route.ts     # GET /api/releases
│       ├── sales/
│       │   └── route.ts     # GET /api/sales
│       └── engagement/
│           └── route.ts     # GET /api/engagement
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/
│   │   └── Sidebar.tsx      # Sidebar navigation (persistent)
│   ├── dashboard/
│   │   ├── MetricCard.tsx          # Reusable metric card with trend
│   │   ├── RevenueChart.client.tsx # Revenue area chart (Gross vs Net)
│   │   ├── FanGrowthChart.client.tsx # Fan growth area chart
│   │   ├── RecentReleasesList.tsx  # Recent releases list for overview
│   │   └── TopFans.tsx             # Top fans ranking
│   ├── releases/
│   │   ├── ReleaseCard.tsx         # Release card with cover art
│   │   └── ReleasesGrid.tsx        # Responsive grid of releases
│   └── shared/
│       ├── EmptyState.tsx
│       ├── SectionSkeleton.tsx
│       └── ErrorState.tsx
├── lib/
│   ├── api.ts               # API service functions
│   ├── data-service.ts      # Data service layer (mock implementations)
│   ├── utils.ts             # cn() helper, formatters
│   └── constants.ts         # Channel colors, etc.
├── __mocks__/
│   ├── releases.ts
│   ├── sales.ts
│   ├── fans.ts
│   └── engagement.ts
└── types/
    └── index.ts             # All TypeScript interfaces
```

**Structure Decision**: Multi-page Next.js application with sidebar navigation matching the [Lovable boceto](https://even-artist-hub.lovable.app). App Router with pages: Overview (`/`), Releases (`/releases`), Fans (`/fans`), Settings (`/settings`). Sidebar persistent via root layout. API Routes as reverse proxy to data service layer. Components organized by page/feature domain. Server Components by default, Client Components only for chart interactivity. TypeScript strict mode with TSDoc.

## Complexity Tracking

> No violations - keeping implementation simple and focused.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| State Management | Zustand (if needed) | Lightweight, simple API; use only if cross-component state required |
| Data Fetching | API Routes + Service Layer | Reverse proxy pattern with service layer abstraction for future scalability |
| Styling | Tailwind + shadcn/ui | Rapid development, consistent design system |
| Charts | shadcn/ui charts | Consistent with UI library, built on Recharts, better theming |
| Architecture | SOLID Principles | Following SOLID principles for maintainable, scalable code |
| Component Strategy | Server Components by default | Following Next.js best practices: Server Components unless interactivity required |
| Type Safety | TypeScript Strict Mode | Ensuring type safety throughout the application |
| Documentation | TSDoc/JSDoc | Comprehensive documentation for maintainability and team collaboration |
