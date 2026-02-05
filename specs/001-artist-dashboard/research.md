# Research: EVEN Backstage Dashboard

**Feature**: 001-artist-dashboard
**Date**: 2026-02-04

## Technology Decisions

### 1. UI Component Library: shadcn/ui

**Decision**: Use shadcn/ui for base components

**Rationale**:
- Explicitly recommended by EVEN in the assignment
- Copy-paste approach gives full ownership of component code
- Built on Radix UI primitives (accessibility out of the box)
- Native Tailwind CSS integration
- No external runtime dependency

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Material UI | Heavy bundle, opinionated design, harder to customize |
| Chakra UI | Additional runtime, different styling paradigm |
| Headless UI | Less complete, would need more custom styling |
| Pure Tailwind | More development time, reinventing accessible patterns |

**Installation**:
```bash
npx shadcn@latest init
npx shadcn@latest add card skeleton button chart
```

---

### 2. Charting Library: shadcn/ui Charts

**Decision**: Use shadcn/ui chart components for all data visualizations

**Rationale**:
- Consistent with shadcn/ui design system
- Built on Recharts with better theming integration
- Automatic dark mode support via CSS variables
- Pre-styled tooltips and legends matching UI
- Same installation pattern as other shadcn components

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Raw Recharts | Would need custom styling to match shadcn theme |
| Chart.js | Different styling paradigm, harder to integrate |
| Tremor | Separate design system, inconsistent look |
| Nivo | Good but doesn't match shadcn aesthetic |

**Required Charts**:
1. `AreaChart` - Revenue over time (30 days)
2. `BarChart` - Channel breakdown (horizontal)
3. `LineChart` - Fan growth over time

**Installation**:
```bash
npx shadcn@latest add chart
```

---

### 3. Theme Strategy: Dark Mode Only

**Decision**: Use dark theme exclusively with no light mode support

**Rationale**:
- Aligns with EVEN Backstage premium SaaS aesthetic
- Dark-first design is industry standard for music/entertainment platforms
- Reduces complexity (no theme switching logic)
- Better for data visualization (charts pop on dark backgrounds)
- Matches user expectation for artist-facing admin tools

**Implementation**:
- CSS variables in `:root` use dark theme values
- `<html>` element has `className="dark"` permanently
- `.dark` class retained for shadcn/ui component compatibility
- No theme toggle or system preference detection

**Design Guidelines**:
- Strong visual hierarchy with muted backgrounds
- High contrast text for readability
- Vibrant accent colors for charts and CTAs
- Subtle borders and shadows

---

### 4. State Management: Zustand (if needed)

**Decision**: Use Zustand if cross-component state is required

**Rationale**:
- Minimal boilerplate compared to Redux
- No providers required (works outside React)
- TypeScript-first design
- Tiny bundle size (~1KB)
- Simple API: create store, use hook

**When to Use**:
- Sharing state between unrelated components
- Persisting UI state (filters, preferences)
- Caching fetched data across navigation

**When NOT to Use** (prefer local state):
- Component-specific UI state
- Form state
- Loading/error states

**Installation**:
```bash
npm install zustand
```

**Example Store**:
```typescript
import { create } from 'zustand'

interface DashboardStore {
  dateRange: '7d' | '30d' | '90d'
  setDateRange: (range: '7d' | '30d' | '90d') => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dateRange: '30d',
  setDateRange: (range) => set({ dateRange: range }),
}))
```

---

### 5. Data Architecture: API Routes + Service Layer

**Decision**: Use Next.js API Routes as reverse proxy to a data service layer

**Rationale**:
- Clean separation between UI, API layer, and data sources
- Facilitates future migration from mock to real APIs
- Enables realistic loading states and error handling
- Follows SOLID principles (Single Responsibility, Dependency Inversion)
- API Routes can add authentication/authorization later

**Structure**:
```
src/
├── app/api/
│   ├── releases/route.ts    # GET /api/releases
│   ├── sales/route.ts       # GET /api/sales
│   └── engagement/route.ts  # GET /api/engagement
├── lib/
│   ├── data-service.ts      # Abstract data source interface
│   └── api.ts               # Client-side fetch functions
└── __mocks__/
    ├── releases.ts          # Mock release data
    ├── sales.ts             # Mock sales data
    └── engagement.ts        # Mock engagement data
```

**API Response Pattern**:
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: { code: string; message: string };
  status: number;
}
```

---

### 6. Mock Data Strategy

**Decision**: Static TypeScript files with realistic EVEN-style data structures

**Rationale**:
- No API overhead during development
- Type-safe mock data matches production interfaces
- Easy to generate via AI or scripts
- Can simulate loading states with setTimeout in API routes

**Data Structure Approach**:
```typescript
// Mock data follows EVEN direct-to-fan sales patterns
// - Revenue in cents (stored as integers, display as dollars)
// - Sales by channel (Direct to Fan, Digital, Physical, Bundles)
// - Dates as ISO strings for easy manipulation
```

**Channels to Mock** (EVEN-specific):
- Direct to Fan (primary revenue source)
- Digital (downloads, streaming)
- Physical (vinyl, CDs, merchandise)
- Bundles (package deals)

---

### 7. Responsive Design Strategy

**Decision**: Mobile-first with Tailwind breakpoints

**Rationale**:
- Tailwind's mobile-first approach aligns with requirements
- Standard breakpoints cover target devices
- CSS Grid for releases layout (auto-fit/fill)
- Flexbox for metric cards

**Breakpoints**:
| Breakpoint | Width | Grid Columns |
|------------|-------|--------------|
| Default (mobile) | < 640px | 1 |
| `sm` | ≥ 640px | 2 |
| `lg` | ≥ 1024px | 3 |
| `xl` | ≥ 1280px | 4 |

---

### 8. Loading States

**Decision**: Skeleton components matching content shape

**Rationale**:
- Better perceived performance than spinners
- shadcn/ui provides Skeleton primitive
- Match exact dimensions of real content
- Progressive loading per section

**Implementation**:
- `ReleaseCardSkeleton` - Card shape with image placeholder
- `ChartSkeleton` - Rectangle matching chart dimensions
- `MetricCardSkeleton` - Small card with text lines

---

## Best Practices Applied

### Next.js 16 App Router
- Use Server Components by default (static content, data fetching)
- Client Components only for interactive elements (`"use client"`)
- Suspense boundaries for loading states
- Metadata API for SEO
- Image component for cover art optimization

### TypeScript
- Strict mode enabled
- Explicit return types on functions
- Interface over type for object shapes
- Discriminated unions for entity types
- TSDoc/JSDoc on all public functions

### SOLID Principles
- **Single Responsibility**: Each component does one thing
- **Open/Closed**: Components extensible via props
- **Liskov Substitution**: Consistent interfaces
- **Interface Segregation**: Small, focused prop types
- **Dependency Inversion**: Data service abstraction

### Accessibility
- Semantic HTML (`<main>`, `<section>`, `<article>`)
- ARIA labels on interactive elements
- Focus visible states
- Color not sole indicator (use icons + text for trends)
- Chart data in accessible format (table fallback or aria-description)
- High contrast ratios for dark theme (WCAG 2.1 AA)

### Performance
- Server Components for static content
- Lazy load charts (dynamic import)
- Optimize images with next/image
- Minimize client-side JavaScript
- Use CSS for animations where possible

---

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Which chart for channel breakdown? | BarChart (horizontal) - easier to read labels than PieChart |
| How to show trend direction? | Arrow icons (TrendingUp/TrendingDown) + percentage + color |
| Date format for releases? | "MMM d, yyyy" (e.g., "Jan 15, 2026") |
| Number formatting? | Abbreviated for large numbers (1.2M sales, $45.2K revenue) |
| Empty state design? | Centered illustration + message + optional CTA |
| Light/Dark mode? | Dark mode only - premium SaaS aesthetic, no theme switching |
| Data fetching pattern? | API Routes + Service Layer for clean separation |
