# Music Artist Dashboard

[![Quality Gate](https://sonarqube.celsiusaray.com/api/project_badges/quality_gate?project=artist-dashboard&token=sqb_9034758a2cb82b124a041a587bf4e69ae21e38c9)](https://sonarqube.celsiusaray.com/dashboard?id=artist-dashboard)

[![Coverage](https://sonarqube.celsiusaray.com/api/project_badges/measure?project=artist-dashboard&metric=coverage&token=sqb_9034758a2cb82b124a041a587bf4e69ae21e38c9)](https://sonarqube.celsiusaray.com/dashboard?id=artist-dashboard)
[![Bugs](https://sonarqube.celsiusaray.com/api/project_badges/measure?project=artist-dashboard&metric=bugs&token=sqb_9034758a2cb82b124a041a587bf4e69ae21e38c9)](https://sonarqube.celsiusaray.com/dashboard?id=artist-dashboard)
[![Code Smells](https://sonarqube.celsiusaray.com/api/project_badges/measure?project=artist-dashboard&metric=code_smells&token=sqb_9034758a2cb82b124a041a587bf4e69ae21e38c9)](https://sonarqube.celsiusaray.com/dashboard?id=artist-dashboard)

A modern dashboard for music artists to track releases, sales analytics, and fan engagement. Built as a Senior Frontend Engineer take-home assignment.

## Live Demo

[https://music.celsiusaray.com/](https://music.celsiusaray.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/emilioaray-dev/artist-dashboard.git
cd artist-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page and dashboard.

### Available Scripts

| Command            | Description                 |
| ------------------ | --------------------------- |
| `npm run dev`      | Start development server    |
| `npm run build`    | Build for production        |
| `npm run start`    | Start production server     |
| `npm run lint`     | Run ESLint                  |
| `npm test`         | Run unit tests (watch mode) |
| `npm run test:run` | Run unit tests (single run) |
| `npm run test:e2e` | Run Playwright E2E tests    |

## Technology Choices

### Core Stack

| Technology       | Version | Why                                                                         |
| ---------------- | ------- | --------------------------------------------------------------------------- |
| **Next.js**      | 16.1.6  | App Router for modern React patterns, Server Components, Suspense streaming |
| **React**        | 19.2.3  | Latest features including React Compiler for automatic memoization          |
| **TypeScript**   | 5.x     | Type safety, better DX, self-documenting code                               |
| **Tailwind CSS** | 4.x     | Utility-first CSS, rapid prototyping, excellent responsive design support   |

### Additional Libraries

| Library          | Purpose              | Why This Choice                                                               |
| ---------------- | -------------------- | ----------------------------------------------------------------------------- |
| **shadcn/ui**    | UI Components        | Accessible, customizable, Tailwind-native                                     |
| **Recharts**     | Data Visualization   | Declarative, composable, great React integration                              |
| **Lucide React** | Icons                | Consistent, lightweight, tree-shakeable                                       |
| **Motion**       | Animations           | Lightweight animation library, smooth page transitions and micro-interactions |
| **Zustand**      | State Management     | Lightweight, simple API; used for global audio player state                   |
| **SWR**          | Data Fetching        | Client-side caching, revalidation, and deduplication for API calls            |
| **next-intl**    | Internationalization | App Router + Server Component support, ICU message format, locale routing     |

### Architecture Decisions

1. **App Router over Pages Router**: Leverages React Server Components for better performance and the latest Next.js patterns.

2. **Server Components + Suspense Streaming**: Pages use async server components with Suspense boundaries for progressive loading — data streams in as it resolves.

3. **Route Groups for Layout Separation**: `(landing)` and `(dashboard)` route groups under `[locale]` provide different layouts (minimal vs full sidebar) while sharing i18n.

4. **shadcn/ui over full component libraries**: Provides ownership of component code, easier customization, no black-box dependencies.

5. **Recharts over Chart.js**: More React-idiomatic API, easier to customize with Tailwind, better TypeScript support.

6. **Zustand for state management**: Minimal boilerplate compared to Redux, no providers required, TypeScript-first design. Used for the global audio player.

7. **Centralized Constants**: All routes, brand name, design tokens, and chart configs live in `src/lib/constants/` — split by category for maintainability with a barrel `index.ts` for clean imports.

## Features Implemented

### Core Requirements

- [x] **Recent Releases** - Grid view of music releases with cover art, title, type, status badges, and audio waveform player
- [x] **Sales Analytics** - Interactive Revenue chart with time range tabs (7d/30d/90d), gross vs net revenue with channel breakdown
- [x] **Fan Engagement** - Fan Growth chart (total fans vs active buyers), Top Fans section with ranked avatars, metric cards for engagement rate

### Landing Page

- [x] **Hero Section** - Full-viewport hero with background image, gradient overlays, social proof pill, and CTA
- [x] **Feature Cards** - 4 animated cards showcasing platform features with scroll-triggered animations
- [x] **Fixed Header** - Logo, language selector, and "Try Demo" button linking to dashboard
- [x] **Footer** - Minimal footer with brand text

### Internationalization (i18n)

- [x] **4 Languages** - English (default), Spanish, French, Portuguese
- [x] **Locale Routing** - English at `/`, others at `/es/`, `/fr/`, `/pt/`
- [x] **Language Selector** - Available in sidebar, settings, and landing page header
- [x] **Full Coverage** - All UI text, navigation, errors, metadata, and chart labels translated

### Technical Features

- [x] Responsive design with sidebar (desktop) and bottom navigation (mobile)
- [x] Loading states with skeleton components for every section
- [x] Error boundaries and Suspense fallbacks
- [x] Accessible components with jsx-a11y enforcement
- [x] TypeScript strict mode throughout
- [x] Clean, organized code with clear separation of concerns
- [x] Custom dark scrollbar styling (primary accent at 50% opacity)

### Nice-to-Haves (All Implemented)

- [x] Tailwind CSS v4 with custom dark theme and oklch color tokens
- [x] shadcn/ui component library (Card, Tabs, Skeleton, Chart, Button, Input, Select, Switch, Label)
- [x] State management (Zustand for audio player)
- [x] Testing — 56 unit tests (Vitest + React Testing Library) + 25 E2E tests (Playwright)
- [x] Animations and micro-interactions (FadeIn, SlideIn, PageTransition via Motion)
- [x] Error handling and loading states (Suspense boundaries, skeleton loaders, error fallbacks)
- [x] Accessibility (jsx-a11y ESLint rules, semantic HTML, keyboard navigation, ARIA labels)

## Project Structure

```
src/
├── app/
│   ├── [locale]/                         # All pages under locale dynamic segment
│   │   ├── (landing)/                    # Landing page route group (no sidebar)
│   │   │   ├── _components/              # LandingHeader, LandingHero, LandingFeatures, LandingFooter
│   │   │   ├── layout.tsx                # Minimal layout (MotionProvider only)
│   │   │   └── page.tsx                  # Landing page (/)
│   │   ├── (dashboard)/                  # Dashboard route group (sidebar + nav)
│   │   │   ├── _components/              # HomePageStreaming
│   │   │   ├── overview/                 # /overview
│   │   │   ├── releases/                 # /releases
│   │   │   ├── fans/                     # /fans
│   │   │   ├── settings/                 # /settings
│   │   │   └── layout.tsx                # Dashboard layout (Sidebar, MobileBottomNav, AudioPlayer)
│   │   └── layout.tsx                    # Locale layout with NextIntlClientProvider
│   ├── api/                              # API routes (releases, sales, engagement)
│   └── layout.tsx                        # Root layout (Inter font, dark theme)
├── components/
│   ├── ui/core/                          # shadcn/ui primitives (generated, don't modify)
│   ├── ui/customs/cards/                 # Card widgets (MetricCard, ReleaseCard)
│   ├── ui/customs/charts/                # Data visualization (FanGrowthChart, RevenueChart)
│   ├── ui/customs/feedback/              # Loading states, skeletons, empty states
│   ├── ui/customs/lists/                 # List/grid compositions (TopFans, ReleasesGrid)
│   ├── layout/                           # Sidebar, MobileBottomNav, LanguageSelector
│   ├── motion/                           # FadeIn, SlideIn, PageTransition, MotionProvider
│   └── audio/                            # AudioPlayer, AudioWaveform, DynamicAudioPlayer
├── hooks/                                # Custom hooks (useApiData, useSidebar)
├── i18n/                                 # next-intl configuration
│   ├── routing.ts                        # Locale routing config (en, es, fr, pt)
│   ├── request.ts                        # Per-request config, message loading, formats
│   └── navigation.ts                     # Locale-aware Link, usePathname, useRouter
├── lib/
│   ├── constants/                        # Centralized constants by category
│   │   ├── index.ts                      # Barrel re-export (import from @/lib/constants)
│   │   ├── branding.ts                   # BRAND_NAME
│   │   ├── routes.ts                     # ROUTES (all app route paths)
│   │   ├── navigation.ts                 # NAV_ITEMS (sidebar items)
│   │   ├── theme.ts                      # DESIGN_TOKENS, STATUS_COLORS
│   │   └── charts.ts                     # CHANNEL_INFO, CHART_COLORS, TREND_ICONS, TIME_RANGES
│   ├── actions.ts                        # Server actions
│   ├── api.ts                            # API client
│   ├── data-service.ts                   # Data fetching service
│   ├── swr-provider.tsx                  # SWR global config
│   ├── utils.ts                          # Utility functions (formatCurrency, formatDate, etc.)
│   └── waveform.ts                       # Audio waveform utilities
├── store/                                # Zustand player store
├── __mocks__/                            # Mock data (releases, sales, engagement, fans)
└── types/                                # TypeScript interfaces
messages/                                 # Translation files (en.json, es.json, fr.json, pt.json)
```

## Assumptions Made

1. **Single Artist View**: Dashboard shows data for one artist (the logged-in user). Multi-artist management would be a future feature.

2. **Mock Data**: All data is mocked via API routes. In production, this would connect to a real backend API.

3. **Time Period**: Default analytics view shows last 30 days. Users can switch between 7d, 30d, and 90d.

4. **Currency**: All monetary values in USD with locale-aware formatting.

5. **Dark Theme**: Dashboard uses a dark theme as the only theme, with a premium SaaS aesthetic.

## What I'd Do With More Time

### Immediate Priorities

1. **Deploy to Vercel**: Set up CI/CD pipeline with automatic deployments
2. **More E2E Coverage**: Add tests for chart interactions, audio player, error states, i18n switching
3. **Performance Optimization**: Implement image optimization with next/image for cover art, lazy loading for off-screen charts

### Future Enhancements

1. **Authentication**: NextAuth.js integration with role-based access
2. **Real-time Data**: WebSocket or SSE for live sales/engagement updates
3. **Data Persistence**: Database integration for user preferences and saved views
4. **Export Features**: PDF reports, CSV data export for analytics
5. **Performance Monitoring**: Vercel Analytics and Web Vitals tracking

## AI Usage Documentation

See [AI_USAGE.md](./docs/AI_USAGE.md) for detailed documentation of AI tool usage throughout this project, including:

- AI Tools Usage Log
- Reflection Questions & Answers
- Detailed Example Deep Dive

## Development Workflow

This project uses a structured specification workflow powered by Spec Kit:

```
specs/
├── 001-artist-dashboard/     # Core dashboard feature
├── 002-i18n-multi-language/  # Internationalization
├── 003-landing-page/         # Landing page
├── 004-dashboard-ui-ux/      # Dashboard UI/UX redesign
└── 005-responsive-mobile-fix/ # Responsive mobile layout fixes
```

Each spec contains: `spec.md`, `plan.md`, `tasks.md`, `research.md`, `data-model.md`, and `quickstart.md`.

### Branch Strategy

- `main` - Production-ready code
- `feature/001-artist-dashboard` - Core dashboard
- `feature/002-i18n-multi-language` - Internationalization
- `feature/003-landing-page` - Landing page
- `feature/004-dashboard-ui-ux` - Dashboard UI/UX redesign
- `feature/005-responsive-mobile-fix` - Responsive mobile layout fixes

## License

This project was created as part of a job application and is not licensed for public use.

---

Built with care by Celsius Aray
