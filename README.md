# Music Artist Dashboard

A modern dashboard for music artists to track releases, sales analytics, and fan engagement. Built for EVEN's Senior Frontend Engineer take-home assignment.

## Live Demo

> [Deployed URL will be added here]

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

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

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

| Library          | Purpose            | Why This Choice                                                               |
| ---------------- | ------------------ | ----------------------------------------------------------------------------- |
| **shadcn/ui**    | UI Components      | Recommended by EVEN, accessible, customizable, Tailwind-native                |
| **Recharts**     | Data Visualization | Declarative, composable, great React integration                              |
| **Lucide React** | Icons              | Consistent, lightweight, tree-shakeable                                       |
| **Motion**       | Animations         | Lightweight animation library, smooth page transitions and micro-interactions |
| **Zustand**      | State Management   | Lightweight, simple API; used for global audio player state                   |
| **SWR**          | Data Fetching      | Client-side caching, revalidation, and deduplication for API calls            |

### Architecture Decisions

1. **App Router over Pages Router**: Leverages React Server Components for better performance and the latest Next.js patterns.

2. **Server Components + Suspense Streaming**: Pages use async server components with Suspense boundaries for progressive loading — data streams in as it resolves.

3. **shadcn/ui over full component libraries**: Provides ownership of component code, easier customization, no black-box dependencies.

4. **Recharts over Chart.js**: More React-idiomatic API, easier to customize with Tailwind, better TypeScript support.

5. **Zustand for state management**: Minimal boilerplate compared to Redux, no providers required, TypeScript-first design. Used for the global audio player.

## Features Implemented

### Core Requirements

- [x] **Recent Releases** - Grid view of music releases with cover art, title, type, status badges, and audio waveform player
- [x] **Sales Analytics** - Interactive Revenue chart with time range tabs (7d/30d/90d), gross vs net revenue with channel breakdown
- [x] **Fan Engagement** - Fan Growth chart (total fans vs active buyers), Top Fans section with ranked avatars, metric cards for engagement rate

### Technical Features

- [x] Responsive design with sidebar (desktop) and bottom navigation (mobile)
- [x] Loading states with skeleton components for every section
- [x] Error boundaries and Suspense fallbacks
- [x] Accessible components with jsx-a11y enforcement
- [x] TypeScript strict mode throughout
- [x] Clean, organized code with clear separation of concerns

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
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (Inter font, dark theme)
│   ├── client-layout.tsx             # Client layout (sidebar, bottom nav, audio player)
│   ├── template.tsx                  # Page transition wrapper
│   ├── page.tsx                      # Overview page (/)
│   ├── globals.css                   # Tailwind v4 theme + oklch tokens
│   ├── _components/                  # Private route components (home page)
│   ├── releases/_components/         # Private route components (/releases)
│   ├── fans/_components/             # Private route components (/fans)
│   ├── settings/_components/         # Private route components (/settings)
│   └── api/                          # API routes (releases, sales, engagement)
├── components/                       # Shared components (single global folder)
│   ├── ui/core/                      # shadcn/ui primitives (generated, don't modify)
│   ├── ui/customs/cards/             # Card widgets (MetricCard, ClientMetricCard, ReleaseCard)
│   ├── ui/customs/charts/            # Data visualization (FanGrowthChart, RevenueChart)
│   ├── ui/customs/feedback/          # Loading states, skeletons, empty states
│   ├── ui/customs/lists/             # List/grid compositions (TopFans, ReleasesGrid, RecentReleasesList)
│   ├── layout/                       # Sidebar, MobileBottomNav, MainLayout
│   ├── motion/                       # FadeIn, SlideIn, PageTransition, MotionProvider
│   └── audio/                        # AudioPlayer, AudioWaveform, DynamicAudioPlayer
├── hooks/                            # Custom hooks (useApiData, useSidebar)
├── lib/                              # Utils, API client, data-service, constants, SWR provider
├── store/                            # Zustand player store
├── __mocks__/                        # Mock data (releases, sales, engagement, fans)
└── types/                            # TypeScript interfaces
```

## Assumptions Made

1. **Single Artist View**: Dashboard shows data for one artist (the logged-in user). Multi-artist management would be a future feature.

2. **Mock Data**: All data is mocked via API routes. In production, this would connect to EVEN's real backend API.

3. **Time Period**: Default analytics view shows last 30 days. Users can switch between 7d, 30d, and 90d.

4. **Currency**: All monetary values in USD. Internationalization would be future work.

5. **Dark Theme**: Dashboard uses a dark theme as default, matching the EVEN Backstage aesthetic.

## What I'd Do With More Time

### Immediate Priorities

1. **Deploy to Vercel**: Set up CI/CD pipeline with automatic deployments
2. **More E2E Coverage**: Add tests for chart interactions, audio player, error states
3. **Performance Optimization**: Implement image optimization with next/image for cover art, lazy loading for off-screen charts

### Future Enhancements

1. **Authentication**: NextAuth.js integration with role-based access
2. **Real-time Data**: WebSocket or SSE for live sales/engagement updates
3. **Data Persistence**: Database integration for user preferences and saved views
4. **Export Features**: PDF reports, CSV data export for analytics
5. **Internationalization**: Multi-language support with next-intl
6. **Performance Monitoring**: Vercel Analytics and Web Vitals tracking

## AI Usage Documentation

See [AI_USAGE.md](./docs/AI_USAGE.md) for detailed documentation of AI tool usage throughout this project, including:

- AI Tools Usage Log
- Reflection Questions & Answers
- Detailed Example Deep Dive

## Development Workflow

This project uses a structured specification workflow powered by Spec Kit:

```
specs/
└── 001-artist-dashboard/
    ├── spec.md          # Feature specification
    ├── plan.md          # Implementation plan
    ├── tasks.md         # Task breakdown
    ├── research.md      # Technical research
    ├── data-model.md    # Data model
    └── quickstart.md    # Quick start guide
```

### Branch Strategy

- `main` - Production-ready code
- `feature/001-artist-dashboard` - Main feature development branch

## License

This project was created as part of a job application and is not licensed for public use.

---

Built with care for EVEN by Celsius Aray
