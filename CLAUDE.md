# artist-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-05

## Active Technologies

- TypeScript 5.x with React 19.2.3 + Next.js 16.1.6, shadcn/ui, Recharts, Lucide React, Motion (animation) (001-artist-dashboard)

## Project Structure

```text
src/
├── app/           # Next.js App Router (pages + API routes)
├── components/    # UI components (ui/, motion/, layout/, dashboard/, releases/, shared/)
├── lib/           # Utils, API client, data service, constants
├── __mocks__/     # Mock data
└── types/         # TypeScript interfaces
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x with React 19.2.3: Follow standard conventions. Motion animations use `motion` package (not framer-motion). Import from `motion/react`.

## Recent Changes

- 001-artist-dashboard: Updated plan with Motion animations, audio waveform, premium design tokens, chart interactivity (2026-02-05)
- 001-artist-dashboard: Added TypeScript 5.x with React 19.2.3 + Next.js 16.1.6, shadcn/ui, Recharts, Lucide React

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
