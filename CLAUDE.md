# artist-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-05

## Active Technologies
- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + Tailwind v4, shadcn/ui, Recharts, Motion, next-intl v4.x (005-responsive-mobile-fix)
- N/A (presentation-layer changes only) (005-responsive-mobile-fix)

- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + next-intl v4.x (i18n library with App Router + Server Component support) (feature/002-i18n-multi-language)
- localStorage (language preference persistence via next-intl cookie) (feature/002-i18n-multi-language)
- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + next-intl v4.x, motion (animation), Lucide React (icons), Tailwind v4 (feature/003-landing-page)
- N/A (static page, no data persistence) (feature/003-landing-page)
- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + shadcn/ui, Recharts, Lucide React, Motion (animation), next-intl v4.x, Tailwind v4 (feature/004-dashboard-ui-ux)
- N/A (presentation-layer changes only, mock data for header) (feature/004-dashboard-ui-ux)

- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6, shadcn/ui, Recharts, Lucide React, Motion (animation) (001-artist-dashboard)

## Project Structure

```text
src/
├── app/
│   ├── [locale]/              # All pages under locale dynamic segment
│   │   ├── (landing)/         # Landing page route group (no sidebar)
│   │   │   ├── _components/   # LandingHeader, LandingHero, LandingFeatures, LandingFooter
│   │   │   ├── layout.tsx     # Minimal layout (MotionProvider only)
│   │   │   └── page.tsx       # Landing page (/)
│   │   ├── (dashboard)/       # Dashboard route group (sidebar + nav)
│   │   │   ├── _components/   # HomePageStreaming
│   │   │   ├── overview/      # /overview
│   │   │   ├── fans/          # /fans
│   │   │   ├── releases/      # /releases
│   │   │   ├── settings/      # /settings
│   │   │   └── layout.tsx     # Dashboard layout (Sidebar, MobileBottomNav, AudioPlayer)
│   │   └── layout.tsx         # Locale layout with NextIntlClientProvider
│   ├── api/                   # API routes (no locale prefix)
│   └── layout.tsx             # Root layout (fonts, globals.css only)
├── i18n/                      # next-intl configuration
│   ├── routing.ts             # Locale routing config (en, es, fr, pt)
│   ├── request.ts             # Per-request config, message loading, formats
│   └── navigation.ts          # Locale-aware Link, usePathname, useRouter
├── components/
│   ├── ui/core/               # shadcn/ui primitives (don't modify)
│   ├── ui/customs/cards/      # Card widgets (MetricCard, ReleaseCard)
│   ├── ui/customs/charts/     # Data visualization (FanGrowthChart, RevenueChart)
│   ├── ui/customs/feedback/   # Loading states, skeletons, empty states
│   ├── ui/customs/lists/      # List/grid compositions (TopFans, ReleasesGrid)
│   ├── layout/                # Shell (Sidebar, MobileBottomNav, LanguageSelector)
│   ├── motion/                # Animation utilities
│   └── audio/                 # Audio system
├── hooks/                     # Custom hooks (useApiData, useSidebar)
├── lib/
│   ├── constants/             # Centralized constants (see Constants section below)
│   │   ├── index.ts           # Re-exports all constants
│   │   ├── branding.ts        # BRAND_NAME
│   │   ├── routes.ts          # ROUTES
│   │   ├── navigation.ts      # NAV_ITEMS
│   │   ├── theme.ts           # DESIGN_TOKENS, STATUS_COLORS
│   │   └── charts.ts          # CHANNEL_INFO, CHART_COLORS, TREND_ICONS, TIME_RANGES
│   ├── actions.ts             # Server actions
│   ├── api.ts                 # API client
│   ├── data-service.ts        # Data fetching service
│   ├── swr-provider.tsx       # SWR global config
│   ├── utils.ts               # Utility functions
│   └── waveform.ts            # Audio waveform utilities
├── store/                     # Zustand stores
├── __mocks__/                 # Mock data
└── types/                     # TypeScript interfaces
messages/                      # Translation files (en.json, es.json, fr.json, pt.json)
```

## i18n Architecture

- **Locales**: en (default), es, fr, pt
- **Prefix**: `as-needed` — English at `/`, others at `/es/`, `/fr/`, `/pt/`
- **Proxy**: `src/proxy.ts` handles locale detection (Accept-Language header)
- **Server components**: Use `getTranslations()` from `next-intl/server`
- **Client components**: Use `useTranslations()` from `next-intl`
- **Navigation**: Import `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`
- **Formatting**: All `formatCurrency()`, `formatDate()`, `formatNumber()` accept `locale` param

## Constants Architecture

- **Import**: Always use `from "@/lib/constants"` — the barrel `index.ts` re-exports everything
- **`branding.ts`**: `BRAND_NAME` — single source of truth for the app brand name
- **`routes.ts`**: `ROUTES` — all application route paths as `const` object
- **`navigation.ts`**: `NAV_ITEMS` — sidebar/nav items (uses `ROUTES`)
- **`theme.ts`**: `DESIGN_TOKENS`, `STATUS_COLORS` — visual design tokens
- **`charts.ts`**: `CHANNEL_INFO`, `CHART_COLORS`, `TREND_ICONS`, `TIME_RANGES` — chart/data config
- When adding new constants, place them in the appropriate category file and re-export from `index.ts`

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x with React 19.2.3: Follow standard conventions. Motion animations use `motion` package (not framer-motion). Import from `motion/react`.

## Recent Changes
- 005-responsive-mobile-fix: Added TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + Tailwind v4, shadcn/ui, Recharts, Motion, next-intl v4.x
- 005-responsive-mobile-fix: Added TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + Tailwind v4, shadcn/ui, Recharts, Motion, next-intl v4.x

- feature/004-dashboard-ui-ux: Added TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + shadcn/ui, Recharts, Lucide React, Motion (animation), next-intl v4.x, Tailwind v4

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
