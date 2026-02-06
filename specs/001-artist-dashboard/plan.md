# Implementation Plan: EVEN Backstage Dashboard

**Branch**: `feature/001-artist-dashboard` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Updated feature specification with clarifications from 2026-02-05

## Summary

Build a premium Music Artist Dashboard for EVEN Backstage adapted from the reference UI (example/even-artist-hub). Five pages: Overview (metrics + revenue chart + fan growth + recent releases + top fans), Releases grid (with audio waveform differentiator), Release Detail (/releases/[id] with stats + revenue chart), Fans (engagement metrics + fan growth chart + top fans), and Settings (profile + notifications). Motion animations integrated from the start. Premium/Luxury SaaS visual identity with dark-first HSL color system.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3
**Primary Dependencies**: Next.js 16.1.6, shadcn/ui (including charts), Lucide React, Motion (animation), Recharts (via shadcn/ui charts)
**New Dependencies (from clarifications)**: `motion` (formerly framer-motion, React 19 compatible)
**Storage**: N/A (mock data only, no persistence)
**Testing**: Jest + React Testing Library (unit), Playwright (E2E)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend with API Routes)
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals "Good")
**Constraints**: Mobile-first responsive (320px - 2560px), keyboard accessible, `prefers-reduced-motion` support
**Scale/Scope**: Multi-page dashboard, 5 pages (Overview, Releases, Release Detail, Fans, Settings), ~20 components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

> Note: Constitution is in template state. Applying reasonable defaults based on modern frontend best practices.

| Principle         | Status | Notes                                                            |
| ----------------- | ------ | ---------------------------------------------------------------- |
| Component-First   | PASS   | All UI built as reusable React components in `src/components/`   |
| Type Safety       | PASS   | TypeScript strict mode, explicit interfaces for all data         |
| Accessibility     | PASS   | FR-032 keyboard a11y, FR-036 prefers-reduced-motion, WCAG 2.1 AA |
| Performance       | PASS   | Core Web Vitals targets, LazyMotion for bundle optimization      |
| Responsive Design | PASS   | Mobile-first approach, FR-029 mandates full responsiveness       |
| Animation-First   | PASS   | Motion integrated from Phase 2, not an afterthought              |

## Project Structure

### Documentation (this feature)

```text
specs/001-artist-dashboard/
├── plan.md              # This file (updated 2026-02-05)
├── spec.md              # Feature spec (updated with clarifications)
├── research.md          # Phase 0 output (updated with Motion + waveform)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

**Design Reference**: example/even-artist-hub (Vite + React 18 reference) — UI/UX patterns adapted to Next.js 16 + React 19

```text
src/
├── app/
│   ├── layout.tsx           # Root layout with Sidebar + MotionConfig
│   ├── template.tsx         # Page transition wrapper (AnimatePresence)
│   ├── page.tsx             # Overview page (dashboard summary)
│   ├── globals.css          # Global styles + Tailwind + HSL design tokens
│   ├── releases/
│   │   ├── page.tsx         # Releases grid page
│   │   └── [id]/
│   │       └── page.tsx     # Release detail page (dynamic route)
│   ├── fans/
│   │   └── page.tsx         # Fans page
│   ├── settings/
│   │   └── page.tsx         # Settings page (profile + notifications)
│   └── api/
│       ├── releases/
│       │   └── route.ts     # GET /api/releases
│       ├── sales/
│       │   └── route.ts     # GET /api/sales
│       └── engagement/
│           └── route.ts     # GET /api/engagement
├── components/
│   ├── ui/                  # shadcn/ui components (Card, Skeleton, Badge, Avatar, Switch, Input, Label, Tabs, Toast/Sonner)
│   ├── motion/
│   │   ├── MotionProvider.tsx     # LazyMotion + MotionConfig wrapper
│   │   ├── PageTransition.tsx     # AnimatePresence page wrapper
│   │   ├── StaggerContainer.tsx   # Reusable stagger parent
│   │   └── FadeIn.tsx             # Reusable fade-in child
│   ├── layout/
│   │   ├── Sidebar.tsx            # Sidebar navigation (persistent, 4 items incl Settings)
│   │   └── client/
│   │       └── MainLayout.tsx     # Main content area with dynamic sidebar offset
│   ├── dashboard/
│   │   ├── StatCard.tsx           # Stat card matching reference: icon + badge top, label, value
│   │   ├── RevenueChart.tsx       # Revenue area chart with SVG gradients + custom tooltip
│   │   ├── FanGrowthChart.tsx     # Fan growth area chart (Total vs Active, overlapping)
│   │   ├── RecentReleases.tsx     # Recent releases for overview (thumbnail + badge + stats)
│   │   └── TopFans.tsx            # Top fans with Avatar + ranking badges
│   ├── releases/
│   │   ├── ReleaseCard.tsx        # Release card with cover art + gradient overlay + waveform
│   │   └── AudioWaveform.tsx      # SVG waveform visualizer
│   └── shared/
│       ├── EmptyState.tsx
│       └── SectionSkeleton.tsx
├── lib/
│   ├── api.ts               # API client functions
│   ├── data-service.ts      # Data service layer (mock implementations)
│   ├── utils.ts             # cn() helper, formatters
│   ├── constants.ts         # Channel colors, nav items, design tokens
│   └── waveform.ts          # Waveform data generation (seeded random)
├── __mocks__/
│   ├── releases.ts          # Releases with Unsplash cover art URLs
│   ├── sales.ts             # 30-day sales with gross + net (gross * 0.85)
│   ├── fans.ts              # Top fans with Unsplash avatar URLs
│   └── engagement.ts        # Fan metrics + 30-day fan history
└── types/
    └── index.ts             # All TypeScript interfaces
```

**Key Architecture Decisions**:

- **Settings page added**: Matches reference UI, completes SaaS product feel with profile + notification toggles
- **Release detail page added**: /releases/[id] with dynamic routing, stats, and revenue chart — demonstrates Next.js dynamic routes
- **StatCard renamed from MetricCard**: Matches reference layout (icon + change badge top row, label, value)
- **Motion primitives as components**: `MotionProvider`, `StaggerContainer`, `FadeIn` — reusable, composable
- **`template.tsx` for transitions**: App Router compatible page transitions via AnimatePresence
- **AudioWaveform as standalone component**: Our differentiator (not in reference) — music platform identity
- **Unsplash CDN for images**: No local image files — consistent, realistic mock data
- **HSL color tokens**: Match reference for shadcn/ui compatibility
- **SVG gradient chart fills**: Premium area chart aesthetic with linearGradient defs
- **API Routes retained**: Reverse proxy pattern demonstrates architecture thinking per user decision

## Complexity Tracking

> Adapted from reference UI (even-artist-hub). Added Release Detail and Settings pages. Updated visual patterns (StatCard, chart gradients, Unsplash images, HSL tokens).

| Aspect             | Decision                                                        | Rationale                                                                                                  |
| ------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| State Management   | React useState + SidebarContext                                 | Chart toggles are local state. Sidebar collapse via React Context (simpler than Zustand for one use case). |
| Data Fetching      | API Routes + Service Layer                                      | Reverse proxy pattern with service abstraction (per user decision)                                         |
| Styling            | Tailwind + shadcn/ui + HSL tokens                               | Premium SaaS visual identity matching reference. HSL format for shadcn compatibility.                      |
| Charts             | Recharts + SVG gradients + custom tooltips                      | Interactive with time range tabs, overlapping areas (not stacked), premium gradient fills                  |
| Animation          | Motion (LazyMotion + m components ~5KB)                         | Page transitions, staggered entrances. Use `m` not `motion` inside LazyMotion.                             |
| Waveform           | Custom SVG + Motion                                             | <1KB, seeded random data, play/pause animation — our differentiator                                        |
| Images             | Unsplash CDN URLs                                               | No local files needed. ?w=400&h=400&fit=crop for consistency                                               |
| Component Strategy | Server Components default, Client for interactivity + animation | Motion requires "use client"                                                                               |
| AI Documentation   | Incremental per phase                                           | AI_USAGE.md updated after each major phase while context is fresh                                          |

## Design System Tokens

From spec clarification — Premium / Luxury SaaS identity:

```css
/* HSL-based tokens matching reference (shadcn/ui compatible) */
--background: 220 15% 8%;           /* Very dark blue */
--foreground: 0 0% 95%;             /* Off-white */
--card: 220 15% 10%;
--popover: 220 15% 12%;
--primary: 42 100% 50%;             /* Golden amber */
--primary-foreground: 220 15% 8%;
--secondary: 220 15% 15%;
--muted: 220 15% 18%;
--muted-foreground: 220 10% 55%;
--accent: 42 100% 50%;
--destructive: 0 84.2% 60.2%;       /* Red */
--success: 142 70% 45%;             /* Green */
--border: 220 15% 18%;
--input: 220 15% 15%;
--ring: 42 100% 50%;

/* Sidebar */
--sidebar-background: 220 15% 6%;
--sidebar-accent: 220 15% 12%;

/* Chart colors */
--chart-1: 42 100% 50%;             /* Primary amber */
--chart-2: 42 80% 60%;              /* Lighter amber */
--chart-3: 220 15% 35%;             /* Muted blue */
--chart-4: 142 70% 45%;             /* Success green */
--chart-5: 0 84% 60%;               /* Destructive red */

/* Custom utilities */
.text-gradient { bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent }
.glow-primary { box-shadow: 0 0 20px hsl(42 100% 50% / 0.15) }
.card-hover { transition-all hover:border-primary/30 hover:glow-primary }
```

## Phase Execution Order

```
Phase 1: Setup (dependencies + types + HSL tokens)
    │
    ▼
Phase 2: Foundation (motion primitives + sidebar + API + mock data with Unsplash URLs)
    │
    ├──────────────┬──────────────┬──────────────┐
    ▼              ▼              ▼              ▼
Phase 3:       Phase 4:       Phase 5:       Phase 6:
Overview       Releases +     Fans           Settings
(parallel)     Detail (par)   (parallel)     (parallel)
    │              │              │              │
    └──────────────┴──────────────┴──────────────┘
                   │
                   ▼
Phase 7: Testing (unit + E2E)
                   │
                   ▼
Phase 8: Final polish + AI docs + deploy
```

## Notes

- AI_USAGE.md updated incrementally after Phases 2, 3-6, 7, and 8
- Motion animations are part of component implementation, not a separate phase
- Use `m` components (not `motion`) inside LazyMotion for bundle optimization
- Each page is independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
- Run `npm test && npm run lint` frequently
- Reference project at example/even-artist-hub for visual comparison
- Audio waveform is our differentiator — not in reference, unique to our implementation
