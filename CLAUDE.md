# artist-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-05

## Active Technologies
- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + next-intl v4.x (i18n library with App Router + Server Component support) (feature/002-i18n-multi-language)
- localStorage (language preference persistence via next-intl cookie) (feature/002-i18n-multi-language)
- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + next-intl v4.x, motion (animation), Lucide React (icons), Tailwind v4 (feature/003-landing-page)
- N/A (static page, no data persistence) (feature/003-landing-page)

- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6, shadcn/ui, Recharts, Lucide React, Motion (animation) (001-artist-dashboard)

## Project Structure

```text
src/
├── app/
│   ├── [locale]/           # All pages under locale dynamic segment
│   │   ├── _components/    # Private route components (HomePageStreaming)
│   │   ├── fans/           # /fans (en), /es/fans, /fr/fans, /pt/fans
│   │   ├── releases/       # /releases (en), /es/releases, etc.
│   │   ├── settings/       # /settings (en), /es/settings, etc.
│   │   ├── layout.tsx      # Locale layout with NextIntlClientProvider
│   │   └── client-layout.tsx
│   ├── api/                # API routes (no locale prefix)
│   └── layout.tsx          # Root layout (fonts, globals.css only)
├── i18n/                   # next-intl configuration
│   ├── routing.ts          # Locale routing config (en, es, fr, pt)
│   ├── request.ts          # Per-request config, message loading, formats
│   └── navigation.ts       # Locale-aware Link, usePathname, useRouter
├── components/
│   ├── ui/core/            # shadcn/ui primitives (don't modify)
│   ├── ui/customs/cards/   # Card widgets (MetricCard, ReleaseCard)
│   ├── ui/customs/charts/  # Data visualization (FanGrowthChart, RevenueChart)
│   ├── ui/customs/feedback/# Loading states, skeletons, empty states
│   ├── ui/customs/lists/   # List/grid compositions (TopFans, ReleasesGrid)
│   ├── layout/             # Shell (Sidebar, MobileBottomNav, LanguageSelector)
│   ├── motion/             # Animation utilities
│   └── audio/              # Audio system
├── hooks/                  # Custom hooks (useApiData, useSidebar)
├── lib/                    # Utils, API, data service, constants, SWR provider
├── store/                  # Zustand stores
├── __mocks__/              # Mock data
└── types/                  # TypeScript interfaces
messages/                   # Translation files (en.json, es.json, fr.json, pt.json)
```

## i18n Architecture
- **Locales**: en (default), es, fr, pt
- **Prefix**: `as-needed` — English at `/`, others at `/es/`, `/fr/`, `/pt/`
- **Proxy**: `src/proxy.ts` handles locale detection (Accept-Language header)
- **Server components**: Use `getTranslations()` from `next-intl/server`
- **Client components**: Use `useTranslations()` from `next-intl`
- **Navigation**: Import `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`
- **Formatting**: All `formatCurrency()`, `formatDate()`, `formatNumber()` accept `locale` param

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x with React 19.2.3: Follow standard conventions. Motion animations use `motion` package (not framer-motion). Import from `motion/react`.

## Recent Changes
- feature/003-landing-page: Added TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + next-intl v4.x, motion (animation), Lucide React (icons), Tailwind v4
- feature/002-i18n-multi-language: Added TypeScript 5.x with React 19.2.3 + Next.js 16.1.6 + next-intl v4.x (i18n library with App Router + Server Component support)

- 001-artist-dashboard: Updated plan with Motion animations, audio waveform, premium design tokens, chart interactivity (2026-02-05)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
