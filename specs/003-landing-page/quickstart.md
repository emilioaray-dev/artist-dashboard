# Quickstart: Landing Page with Try Demo

**Feature**: 003-landing-page
**Date**: 2026-02-06

## Prerequisites

- Node.js 18+
- Repository cloned and dependencies installed (`npm install`)
- On branch `feature/003-landing-page`

## Architecture Overview

The landing page uses Next.js route groups to separate the landing layout (no sidebar) from the dashboard layout (with sidebar) under the same `[locale]` segment.

```
src/app/[locale]/
├── (landing)/           # Landing page group — no sidebar
│   ├── layout.tsx       # Minimal layout: MotionProvider, no sidebar
│   └── page.tsx         # Landing page at /
├── (dashboard)/         # Dashboard group — with sidebar
│   ├── layout.tsx       # Full dashboard layout (sidebar, nav, audio)
│   ├── page.tsx         # Dashboard overview at /overview
│   ├── _components/
│   ├── fans/
│   ├── releases/
│   └── settings/
```

## Key Files to Create

| File | Purpose |
| ---- | ------- |
| `src/app/[locale]/(landing)/layout.tsx` | Landing layout (MotionProvider, no shell) |
| `src/app/[locale]/(landing)/page.tsx` | Landing page server component |
| `src/app/[locale]/(landing)/_components/LandingHero.tsx` | Hero section with background image |
| `src/app/[locale]/(landing)/_components/LandingFeatures.tsx` | Feature cards grid with scroll animations |
| `src/app/[locale]/(landing)/_components/LandingHeader.tsx` | Fixed header with logo + Try Demo |
| `src/app/[locale]/(landing)/_components/LandingFooter.tsx` | Minimal footer |
| `src/app/[locale]/(dashboard)/layout.tsx` | Existing client-layout.tsx (moved) |
| `public/images/hero-bg.jpg` | Hero background image asset |
| `messages/{en,es,fr,pt}.json` | Add `Landing` namespace translations |

## Key Files to Move

| From | To | Reason |
| ---- | -- | ------ |
| `src/app/[locale]/page.tsx` | `src/app/[locale]/(dashboard)/page.tsx` | Dashboard overview moves to route group |
| `src/app/[locale]/_components/` | `src/app/[locale]/(dashboard)/_components/` | Dashboard-specific components |
| `src/app/[locale]/client-layout.tsx` | `src/app/[locale]/(dashboard)/layout.tsx` | Dashboard shell becomes group layout |
| `src/app/[locale]/fans/` | `src/app/[locale]/(dashboard)/fans/` | Dashboard route |
| `src/app/[locale]/releases/` | `src/app/[locale]/(dashboard)/releases/` | Dashboard route |
| `src/app/[locale]/settings/` | `src/app/[locale]/(dashboard)/settings/` | Dashboard route |

## Development Commands

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run lint
npm run lint

# Build
npm run build
```

## Design Tokens Reference

The landing page reuses the existing design system:

- **Background**: `bg-background` (#09090B)
- **Primary/Accent**: `text-primary` / `bg-primary` (amber oklch(0.769 0.174 70.7))
- **Muted text**: `text-muted-foreground`
- **Card background**: `bg-card/60` with `backdrop-blur-sm`
- **Borders**: `border-border/40` or `border-border/60`
- **Font**: Inter (sans), Geist Sans (variable)
- **Max width**: `max-w-7xl` for content containers

## Animation Pattern

Use `motion/react` (NOT framer-motion):
- `whileInView` for scroll-triggered feature card animations
- `initial={{ opacity: 0, y: 20 }}` → `whileInView={{ opacity: 1, y: 0 }}`
- Wrap in `LazyMotion` + `MotionConfig` (provided by landing layout)
