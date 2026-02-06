# Quickstart: EVEN Backstage Dashboard

**Feature**: 001-artist-dashboard
**Date**: 2026-02-05 (updated)

## Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)
- Git

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/[your-username]/artist-dashboard.git
cd artist-dashboard
npm install
```

### 2. Install Additional Dependencies

```bash
# Motion (animation library, React 19 compatible)
npm install motion

# shadcn/ui components (if not already initialized)
npx shadcn@latest add card skeleton button chart tabs
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + Sidebar + MotionConfig
│   ├── template.tsx        # Page transition wrapper
│   ├── page.tsx            # Overview page
│   ├── releases/page.tsx   # Releases grid page
│   ├── fans/page.tsx       # Fans page
│   ├── globals.css         # Design tokens + Tailwind
│   └── api/                # API Routes (reverse proxy)
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── motion/             # Animation primitives
│   ├── layout/             # Sidebar
│   ├── dashboard/          # Overview components
│   ├── releases/           # Release components + waveform
│   └── shared/             # Empty state, skeleton
├── lib/                    # Utils, API client, data service
├── __mocks__/              # Mock data files
└── types/                  # TypeScript interfaces
```

## Key Commands

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run dev`      | Start development server   |
| `npm run build`    | Build for production       |
| `npm run start`    | Run production build       |
| `npm run lint`     | Run ESLint                 |
| `npm test`         | Run unit tests (Jest)      |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Development Workflow

### 1. Start with Types → Mock Data → API Routes

Define interfaces, create mock data, wire API routes.

### 2. Build Motion Primitives

Create `MotionProvider`, `StaggerContainer`, `FadeIn` — used across all pages.

### 3. Build Components with Animation

Each component includes its animations from the start. Use `StaggerContainer` for lists, `FadeIn` for sections.

### 4. Test Responsive Design

- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px

### 5. Document AI Usage Incrementally

Update `docs/AI_USAGE.md` after each major phase.

## Verification Checklist

- [ ] Dashboard loads in under 3 seconds
- [ ] All three sections display correctly
- [ ] Page transitions animate smoothly
- [ ] Release cards show waveform visualizer
- [ ] Charts have time range tabs (7d/30d/90d)
- [ ] Charts have clickable channel legend
- [ ] Metric cards animate on entrance
- [ ] Grid is responsive (1-4 columns)
- [ ] `prefers-reduced-motion` disables animations
- [ ] No horizontal scroll on any viewport
- [ ] Keyboard navigation works

## Deployment

```bash
# Deploy to Vercel
npx vercel
```

Or connect GitHub repository to Vercel for automatic deployments.
