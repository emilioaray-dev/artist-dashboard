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
git clone https://github.com/[your-username]/artist-dashboard.git
cd artist-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Technology Choices

### Core Stack

| Technology | Version | Why |
|------------|---------|-----|
| **Next.js** | 16.1.6 | App Router for modern React patterns, Server Components, built-in optimizations |
| **React** | 19.2.3 | Latest features including React Compiler for automatic memoization |
| **TypeScript** | 5.x | Type safety, better DX, self-documenting code |
| **Tailwind CSS** | 4.x | Utility-first CSS, rapid prototyping, excellent responsive design support |

### Additional Libraries

| Library | Purpose | Why This Choice |
|---------|---------|-----------------|
| **shadcn/ui** | UI Components | Recommended by EVEN, accessible, customizable, Tailwind-native |
| **Recharts** | Data Visualization | Declarative, composable, great React integration |
| **Lucide React** | Icons | Consistent, lightweight, tree-shakeable |
| **Zustand** | State Management | Lightweight, simple API; used if cross-component state required |

### Architecture Decisions

1. **App Router over Pages Router**: Leverages React Server Components for better performance and the latest Next.js patterns.

2. **shadcn/ui over full component libraries**: Provides ownership of component code, easier customization, no black-box dependencies.

3. **Recharts over Chart.js**: More React-idiomatic API, easier to customize with Tailwind, better TypeScript support.

4. **Zustand for state management**: Minimal boilerplate compared to Redux, no providers required, TypeScript-first design.

## Features Implemented

### Core Requirements

- [x] **Recent Releases** - Grid/list view of music releases with cover art, title, release date, and streaming stats
- [x] **Sales Analytics** - Interactive charts showing revenue trends and platform breakdown
- [x] **Fan Engagement** - Metrics dashboard showing follower growth, engagement rates, and platform breakdown
- [x] **Responsive Design** - Mobile-first approach with responsive layouts
- [x] **Interactive Data Visualization** - Charts with tooltips and interactive elements
- [x] **Mock Data** - Comprehensive mock data for all dashboard sections

### Technical Features

- [x] Responsive design (mobile-first)
- [x] Loading states and skeletons
- [x] Error boundaries
- [x] Accessible components (WCAG 2.1 AA)
- [x] TypeScript strict mode
- [x] Clean, organized code structure

### Nice-to-Haves (Implemented)

- [x] Tailwind CSS
- [x] shadcn/ui component library
- [x] State management (Zustand)
- [x] Loading states and skeletons
- [x] Accessibility considerations
- [ ] Testing (unit, integration, or E2E) - Planned
- [ ] Animations or micro-interactions - Planned

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard home
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── RecentReleases/
│   │   ├── SalesAnalytics/
│   │   └── FanEngagement/
│   └── shared/             # Shared components (Header, etc.)
├── lib/
│   ├── utils.ts            # Utility functions
│   └── constants.ts        # Platform colors, names, and icons
├── data/
│   └── mock/               # Mock data for development
└── types/
    └── index.ts            # TypeScript interfaces
```

## Assumptions Made

1. **Single Artist View**: Dashboard shows data for one artist (the logged-in user). Multi-artist management would be a future feature.

2. **Mock Data**: All data is mocked. In production, this would connect to EVEN's API.

3. **Time Period**: Default analytics view shows last 30 days. Assumed this is the most common use case.

4. **Currency**: All monetary values in USD. Internationalization would be future work.

5. **Platform Focus**: Prioritized Spotify, Apple Music, YouTube Music, and Amazon Music as primary platforms based on market share.

## What I'd Do With More Time

### Immediate Priorities (Next 4-6 hours)

1. **Unit Tests**: Add tests for key components using React Testing Library
2. **E2E Tests**: Playwright tests for critical user journeys
3. **Animations**: Add micro-interactions and loading animations
4. **Additional Features**: Date range filters, detailed drill-down views

### Future Enhancements

1. **Authentication**: NextAuth.js integration
2. **Data Persistence**: Database integration for user preferences
3. **Notifications**: Alert system for milestone achievements
4. **Export Features**: PDF reports, CSV data export
5. **Internationalization**: Multi-language support
6. **Performance Monitoring**: Vercel Analytics integration

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

### Development Best Practices

- **Testing**: Each feature will have corresponding unit tests before committing
- **Build Process**: `npm run build` will be executed before each commit to ensure zero errors and warnings
- **Code Quality**: All code will pass ESLint and TypeScript checks
- **Accessibility**: Components will follow accessibility best practices (WCAG 2.1 AA)
- **Performance**: Implementation will consider Core Web Vitals targets

### Branch Strategy

- `main` - Production-ready code
- `feat/001-artist-dashboard-initial-setup` - Initial setup branch
- `feature/[task-id]-description` - Feature branches

## License

This project was created as part of a job application and is not licensed for public use.

---

Built with care for EVEN by [Your Name]
