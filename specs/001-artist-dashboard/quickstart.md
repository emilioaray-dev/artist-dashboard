# Quickstart: Music Artist Dashboard

**Feature**: 001-artist-dashboard
**Date**: 2026-02-04

## Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)
- Git

## Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/[your-username]/artist-dashboard.git
cd artist-dashboard

# Install dependencies
npm install
```

### 2. Install Additional Dependencies

```bash
# shadcn/ui (interactive prompts)
npx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add required components (including charts)
npx shadcn@latest add card skeleton button chart

# Icons + State Management
npm install lucide-react zustand
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
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── dashboard/          # Feature components
├── data/mock/              # Mock data files
├── lib/                    # Utilities
└── types/                  # TypeScript interfaces
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

## Development Workflow

### 1. Start with Types

Define your data structures in `src/types/index.ts` before building components.

### 2. Create Mock Data

Add realistic mock data in `src/data/mock/` that matches your type definitions.

### 3. Build Components Bottom-Up

1. Create small, reusable components first (cards, skeletons)
2. Compose them into section components (ReleasesGrid, RevenueChart)
3. Assemble sections on the main page

### 4. Test Responsive Design

Use browser dev tools to test breakpoints:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px

## Verification Checklist

After implementation, verify:

- [ ] Dashboard loads in under 3 seconds
- [ ] All three sections display correctly
- [ ] Grid is responsive (1-4 columns based on viewport)
- [ ] Charts are interactive (tooltips work)
- [ ] Metric cards show trend indicators
- [ ] Loading skeletons appear briefly
- [ ] No horizontal scroll on any viewport size
- [ ] Keyboard navigation works on interactive elements

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel

# Follow prompts to link/create project
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Troubleshooting

### shadcn/ui components not found

Make sure you ran `npx shadcn@latest init` and components.json exists in the root.

### Chart SSR issues

shadcn/ui chart components need client-side rendering. Wrap with `"use client"` directive at the top of the file.

### Tailwind styles not applying

Check that `globals.css` imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### TypeScript errors with mock data

Ensure mock data files export typed arrays matching the interfaces in `types/index.ts`.
