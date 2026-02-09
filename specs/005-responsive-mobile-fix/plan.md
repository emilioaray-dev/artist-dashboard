# Implementation Plan: Responsive Mobile Fix

**Branch**: `005-responsive-mobile-fix` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-responsive-mobile-fix/spec.md`

## Summary

Fix responsive mobile layouts across the dashboard and landing page. Primary changes: fix bottom nav content overlap with CSS variable-driven heights, make the audio player dock above the bottom nav and dynamically adjust main content padding, remove the redundant language selector from the bottom nav (already in header), adjust landing page video focus for mobile, and improve hero text scaling. Mobile navigation is already handled by the existing `MobileBottomNav` footer bar. This is a presentation-layer-only change — no new data, APIs, or business logic.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3 + Next.js 16.1.6
**Primary Dependencies**: Tailwind v4, shadcn/ui, Recharts, Motion, next-intl v4.x
**Storage**: N/A (presentation-layer changes only)
**Testing**: Vitest (unit), Playwright (E2E)
**Target Platform**: Web — mobile browsers (320px–767px), tablets (768px–1024px), desktop (1024px+)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: No layout shift on viewport resize
**Constraints**: No new npm dependencies
**Scale/Scope**: ~8 files modified, no new components

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is a blank template — no project-specific gates defined. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/005-responsive-mobile-fix/
├── plan.md              # This file
├── research.md          # Phase 0: responsive state audit + decisions
├── data-model.md        # Phase 1: CSS vars + state changes
├── quickstart.md        # Phase 1: dev workflow + verification checklist
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (files to modify)

```text
src/
├── app/
│   ├── globals.css                      # MODIFY: add CSS vars for mobile nav heights
│   └── [locale]/
│       ├── (dashboard)/
│       │   ├── layout.tsx               # MODIFY: move AudioPlayer outside MainLayout
│       │   └── releases/[id]/_components/
│       │       └── ReleaseDetailContent.tsx # MODIFY: mobile layout adjustments
│       └── (landing)/_components/
│           ├── LandingHeader.tsx         # DONE: min-w-8 + leading-none fixes
│           └── LandingHero.tsx           # MODIFY: text scaling + video object-position
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx              # MODIFY: dynamic padding via CSS vars
│   │   ├── MobileBottomNav.tsx         # MODIFY: remove LanguageSelector, use CSS var for height
│   │   └── PageHeader.tsx              # MODIFY: wrap actions on mobile
│   └── audio/
│       └── AudioPlayer.tsx             # MODIFY: position above bottom nav using CSS var
```

**Structure Decision**: Existing Next.js App Router structure. No new directories or components. All changes are modifications to existing files.

## Already Completed

The following changes have already been applied and should be marked as done in tasks:

### LandingHeader.tsx
- Added `min-w-8` to brand logo `<div>` to prevent shrinking on narrow viewports
- Added `leading-none` to brand text `<span>` for tighter line height on mobile

## Implementation Details

### Phase 1: CSS Variables & Bottom Nav Architecture (P1)

#### 1. CSS variables for mobile nav heights (`globals.css`)

Define CSS custom properties for consistent height references:

```css
:root {
  --mobile-nav-height: 4rem;    /* 64px — MobileBottomNav */
  --audio-player-height: 3.5rem; /* 56px — AudioPlayer bar */
}
```

These variables are consumed by `MainLayout`, `AudioPlayer`, and `MobileBottomNav` to coordinate positioning without magic numbers.

#### 2. Remove LanguageSelector from MobileBottomNav

The language selector is already in `DashboardHeader` (visible on mobile). Remove the `<LanguageSelector>` from `MobileBottomNav` to avoid redundancy and free up horizontal space for the 4 nav items.

#### 3. MobileBottomNav — use CSS var for height

Set the bottom nav height to `var(--mobile-nav-height)` for consistency. The nav is `fixed bottom-0` and `md:hidden`.

#### 4. AudioPlayer — dock above bottom nav on mobile

Current: `bottom-17 md:bottom-0` with hardcoded margin-left values.

Change to:
- Mobile: `bottom-[var(--mobile-nav-height)]` — sits directly above the bottom nav
- Desktop: `bottom-0` with sidebar-aware margins (keep existing)
- **Visibility**: On mobile, the player bar is visually hidden when `isPlaying === false` (e.g., `hidden` or `translate-y-full` with transition). The `<audio>` element stays mounted to preserve track state, but the visual bar disappears.
- When `isPlaying === true`, the bar slides in above the bottom nav.

**Important**: `currentTrack` stays set after pause — we use `isPlaying` (not `currentTrack`) as the visibility condition. This way pressing pause hides the bar, and pressing play on any waveform brings it back.

#### 5. MainLayout — dynamic padding with CSS vars

The main content needs bottom padding that accounts for:
- **Not playing, mobile**: `pb-[var(--mobile-nav-height)]` (just the bottom nav)
- **Playing, mobile**: `pb-[calc(var(--mobile-nav-height)+var(--audio-player-height))]` (bottom nav + player)
- **Desktop**: `md:pb-12` (no bottom nav, player docks at bottom independently)

Use `usePlayerStore` `isPlaying` state in `MainLayout` to toggle between the two mobile padding values. When the user pauses, padding shrinks back; when they play, padding expands.

#### 6. Dashboard layout — restructure AudioPlayer position

Currently `DynamicAudioPlayer` is inside `<MainLayout>`. It should be a sibling — placed between `MainLayout` and `MobileBottomNav` in the layout tree so it can position independently with `fixed` positioning.

### Phase 2: Layout Fixes (P2)

#### 7. PageHeader — responsive actions
Change the flex container from `flex items-start justify-between` to `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between` so actions wrap below the title on small screens.

#### 8. ReleaseDetailContent — mobile adjustments
The header section already uses `flex-col md:flex-row` which works. Verify cover art centers on mobile. Stats grid already has `grid-cols-1 sm:grid-cols-3`. Minor adjustments if needed.

#### 9. LandingHero — text scaling + video position
- Change hero headline from `text-5xl sm:text-7xl` to `text-4xl sm:text-5xl lg:text-7xl`
- Add responsive `object-position` on the background `<video>`: `object-[70%_center] md:object-center` — shifts video focus to the right on mobile, centered on desktop

### Phase 3: Polish (P3)

#### 10. Touch target audit
Verify all buttons and links meet 44x44px minimum on mobile. Key areas: bottom nav buttons (currently `h-12 w-16`), header icons.

#### 11. Full viewport testing
Test at 320px, 375px, 414px, 768px for all pages: Overview, Releases, Release Detail, Fans, Settings, Landing.

## Complexity Tracking

No constitution violations — no complexity justification needed.
