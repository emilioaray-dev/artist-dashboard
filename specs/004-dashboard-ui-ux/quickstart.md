# Quickstart: Dashboard UI/UX Redesign

**Branch**: `feature/004-dashboard-ui-ux` | **Date**: 2026-02-06

## Prerequisites

- Node.js 18+
- npm
- Project cloned and dependencies installed

## Setup

```bash
git checkout feature/004-dashboard-ui-ux
npm install
npm run dev
```

## Implementation Order

### Phase 1: Color System Foundation

1. Update `src/app/globals.css` — migrate color tokens from pure black to blue-grey HSL
2. Update `src/lib/constants/theme.ts` — update DESIGN_TOKENS and STATUS_COLORS
3. Add card-hover utility class to globals.css
4. Verify all pages render with new color system

### Phase 2: Dashboard Header

1. Create `src/components/layout/DashboardHeader.tsx`
2. Add shadcn DropdownMenu component if not present
3. Integrate header into `src/app/[locale]/(dashboard)/layout.tsx`
4. Add translation keys to all 4 locale files

### Phase 3: Stat Cards

1. Redesign `src/components/ui/customs/cards/MetricCard.tsx`
2. Update icon placement, change indicator styling
3. Add staggered entrance animation
4. Verify on overview page

### Phase 4: Charts

1. Refactor `src/components/ui/customs/charts/RevenueChart.tsx` — add gradients
2. Refactor `src/components/ui/customs/charts/FanGrowthChart.tsx` — add gradients
3. Style tooltips, axes, and grid lines
4. Verify responsiveness

### Phase 5: Navigation & Badges

1. Update `src/components/layout/Sidebar.tsx` — active state styling
2. Update `src/components/ui/customs/cards/ReleaseCard.tsx` — semantic badges
3. Update `src/lib/constants/theme.ts` — STATUS_COLORS
4. Verify across all pages

### Phase 6: Release Upload Form

1. Add shadcn Dialog and Textarea components via `npx shadcn@latest add dialog textarea`
2. Create `src/components/ui/customs/forms/TrackListEditor.tsx` — dynamic track list
3. Create `src/components/ui/customs/forms/ReleaseUploadDialog.tsx` — modal form with validation
4. Integrate "Add Release" button into `ReleasesPageContent.tsx`
5. Add `ReleaseUpload` namespace translations to all 4 locale files

### Phase 7: Settings Page Redesign

1. Update Settings translation keys in all 4 locale files — remove Preferences, add Profile/Payout
2. Redesign `src/app/[locale]/(dashboard)/settings/_components/SettingsPageClient.tsx`
3. Add avatar upload preview, payout section, language section
4. Add inline success message feedback
5. Verify across all 4 locales

### Phase 8: Polish & Verification

1. Run `npm test` — ensure no regressions
2. Run `npm run lint` — ensure no lint errors
3. Run `npm run build` — ensure production build succeeds
4. Visual verification across all pages and viewports

## Verification Commands

```bash
npm test          # Unit tests pass
npm run lint      # No lint errors
npm run build     # Production build succeeds
```

## Key Files to Modify

| File                                                                        | Change                                                    |
| --------------------------------------------------------------------------- | --------------------------------------------------------- |
| `src/app/globals.css`                                                       | Color tokens, card-hover class                            |
| `src/lib/constants/theme.ts`                                                | DESIGN_TOKENS, STATUS_COLORS                              |
| `src/lib/constants/charts.ts`                                               | Chart color values                                        |
| `src/app/[locale]/(dashboard)/layout.tsx`                                   | Add DashboardHeader                                       |
| `src/components/layout/DashboardHeader.tsx`                                 | **NEW** — Top header bar                                  |
| `src/components/ui/customs/cards/MetricCard.tsx`                            | Redesigned stat card                                      |
| `src/components/ui/customs/cards/ClientMetricCard.tsx`                      | Updated icon wrapper                                      |
| `src/components/ui/customs/cards/ReleaseCard.tsx`                           | Semantic badge styling                                    |
| `src/components/ui/customs/charts/RevenueChart.tsx`                         | Area chart + gradients                                    |
| `src/components/ui/customs/charts/FanGrowthChart.tsx`                       | Area chart + gradients                                    |
| `src/components/layout/Sidebar.tsx`                                         | Active state styling                                      |
| `src/components/ui/customs/forms/ReleaseUploadDialog.tsx`                   | **NEW** — Release upload modal form                       |
| `src/components/ui/customs/forms/TrackListEditor.tsx`                       | **NEW** — Dynamic track list for albums                   |
| `src/app/[locale]/(dashboard)/releases/_components/ReleasesPageContent.tsx` | Add Release button                                        |
| `src/app/[locale]/(dashboard)/settings/_components/SettingsPageClient.tsx`  | Redesigned settings page                                  |
| `messages/{en,es,fr,pt}.json`                                               | New header, release upload, and settings translation keys |

## Reference

- Prototype code: `/tmp/even-artist-hub`
- Prototype components: `/tmp/even-artist-hub/src/components/`
- Prototype styles: `/tmp/even-artist-hub/src/index.css`
