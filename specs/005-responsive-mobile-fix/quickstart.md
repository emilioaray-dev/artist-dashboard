# Quickstart: Responsive Mobile Fix

## Prerequisites

- Node.js 18+ with npm
- Project cloned and on branch `005-responsive-mobile-fix`

## Setup

```bash
npm install
npx shadcn@latest add sheet  # adds Sheet component to ui/core/
npm run dev
```

## Development Workflow

1. Open Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
2. Test at these viewport widths: 320px, 375px, 414px, 768px, 1024px, 1440px
3. Key pages to verify: `/overview`, `/releases`, `/releases/rel_001`, `/fans`, `/settings`, `/` (landing)

## Files to Modify (in order)

### Phase 1: Mobile Navigation (P1)
1. `src/components/ui/core/sheet.tsx` — New: shadcn/ui Sheet primitive
2. `src/hooks/useSidebar.tsx` — Add `mobileOpen` + `toggleMobile`
3. `src/components/layout/DashboardHeader.tsx` — Add hamburger menu button
4. `src/components/layout/Sidebar.tsx` — Wrap in Sheet for mobile, keep desktop sidebar as-is
5. `src/components/layout/MainLayout.tsx` — Fix bottom nav overlap padding

### Phase 2: Layout Fixes (P1-P2)
6. `src/components/layout/PageHeader.tsx` — Wrap actions on mobile
7. `src/app/[locale]/(dashboard)/releases/[id]/_components/ReleaseDetailContent.tsx` — Mobile layout adjustments
8. `src/app/[locale]/(landing)/_components/LandingHero.tsx` — Fix hero text scaling

### Phase 3: Polish (P3)
9. Touch target audit across interactive elements
10. Test all pages at 320px minimum width

## Verification

```bash
npm run lint      # no new warnings
npm test          # all tests pass
npm run build     # successful build
```

Visual verification at 375px viewport:
- [ ] Hamburger menu toggles sidebar drawer
- [ ] Sidebar drawer closes on nav selection and backdrop tap
- [ ] Metric cards stack in single column
- [ ] Charts fit screen width
- [ ] Release detail shows centered cover art + stacked layout
- [ ] Landing hero text doesn't overflow
- [ ] No content hidden behind bottom nav
- [ ] Page header actions wrap below title
