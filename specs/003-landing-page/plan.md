# Implementation Plan: Landing Page with Try Demo

**Branch**: `feature/003-landing-page` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-landing-page/spec.md`

## Summary

Add a marketing landing page replicating the prototype at even-artist-hub.vercel.app. The page lives at `/` with a full-bleed hero, social proof, 4 feature cards, and a "Try Demo" CTA linking to the dashboard. Uses Next.js route groups to separate the landing layout (no sidebar) from the dashboard layout (with sidebar) while sharing the `[locale]` i18n segment. All text is translatable across 4 locales.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3 + Next.js 16.1.6
**Primary Dependencies**: next-intl v4.x, motion (animation), Lucide React (icons), Tailwind v4
**Storage**: N/A (static page, no data persistence)
**Testing**: Vitest (unit), Playwright (e2e)
**Target Platform**: Web (responsive: 320px – 1920px+)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: LCP < 2s, 90+ Lighthouse scores, 60fps animations
**Constraints**: Must match prototype visually, must support 4 locales, must reuse existing design system
**Scale/Scope**: 1 new page, ~8 new files, ~6 moved files, 4 translation file updates

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is not configured (template only). No gates to enforce. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/003-landing-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/app/[locale]/
├── (landing)/                          # NEW: Landing page route group
│   ├── layout.tsx                      # Minimal layout (MotionProvider, no sidebar)
│   ├── page.tsx                        # Landing page (server component)
│   └── _components/
│       ├── LandingHeader.tsx           # Fixed header with logo + CTA
│       ├── LandingHero.tsx             # Hero section (bg image, headline, CTA)
│       ├── LandingFeatures.tsx         # 4-card feature grid with scroll animations
│       └── LandingFooter.tsx           # Minimal footer
├── (dashboard)/                        # MOVED: Dashboard route group
│   ├── layout.tsx                      # Current client-layout.tsx (sidebar, nav, audio)
│   ├── _components/
│   │   └── HomePageStreaming.tsx        # Moved from [locale]/_components/
│   ├── overview/
│   │   └── page.tsx                    # Dashboard home (moved, new path /overview)
│   ├── fans/                           # Moved from [locale]/fans/
│   ├── releases/                       # Moved from [locale]/releases/
│   └── settings/                       # Moved from [locale]/settings/
├── layout.tsx                          # Locale layout (NextIntlClientProvider) — unchanged
├── error.tsx                           # Shared error boundary — unchanged
├── not-found.tsx                       # Shared 404 — unchanged
└── template.tsx                        # Shared page transitions — unchanged

public/images/
└── hero-bg.jpg                         # NEW: Hero background image

messages/
├── en.json                             # UPDATED: Add Landing namespace
├── es.json                             # UPDATED: Add Landing namespace
├── fr.json                             # UPDATED: Add Landing namespace
└── pt.json                             # UPDATED: Add Landing namespace

src/lib/constants.ts                    # UPDATED: NAV_ITEMS hrefs (/overview instead of /)
```

**Structure Decision**: Route groups `(landing)` and `(dashboard)` under `[locale]` provide different layouts without affecting URL paths. The landing page claims `/` while the dashboard overview moves to `/overview`. All other dashboard routes remain unchanged (`/releases`, `/fans`, `/settings`).

## Key Architectural Decisions

### 1. Route Groups for Layout Separation

The landing page needs a different layout (no sidebar) than the dashboard (with sidebar). Next.js route groups `(groupName)` allow both to exist under `[locale]` with separate layouts while sharing the locale provider.

### 2. Dashboard Overview Path Change

The current dashboard overview at `/` must move to `/overview` since the landing page takes over `/`. This requires:
- Updating `NAV_ITEMS` in `constants.ts` (Overview href: `/` → `/overview`)
- Moving `page.tsx` to `(dashboard)/overview/page.tsx`
- All other dashboard paths (`/releases`, `/fans`, `/settings`) remain the same

### 3. Landing Page as Server Component

The landing page body (`page.tsx`) is a server component using `getTranslations()`. Interactive parts (animations, hover effects) are client components in `_components/`. This ensures fast SSR and SEO.

### 4. Scroll-Triggered Animations

Feature cards use `motion/react`'s `whileInView` instead of `animate` to trigger entrance animations on scroll, matching the prototype behavior.
