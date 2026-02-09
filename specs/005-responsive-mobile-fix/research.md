# Research: Responsive Mobile Fix

## Current Responsive State

### What Already Works
- **Grid layouts** are responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` pattern on metric cards, releases grid, features grid
- **Charts** use `w-full h-[250px]` — fill available width on any screen
- **Chart headers** stack on mobile via `sm:flex-row`
- **MobileBottomNav** exists and handles mobile navigation (`md:hidden`) — no hamburger menu needed
- **Sidebar** is hidden on mobile (`hidden md:flex`) — desktop only
- **DashboardHeader** shows brand on mobile, hides on desktop
- **Settings page** forms stack vertically on mobile

### Critical Issues Found

#### 1. Bottom Nav + Audio Player Overlap
- **Decision**: Use CSS custom properties (`--mobile-nav-height`, `--audio-player-height`) for coordinated positioning between MobileBottomNav, AudioPlayer, and MainLayout padding
- **Rationale**: MobileBottomNav is `fixed bottom-0` but MainLayout only has `pb-8 md:pb-12` — mobile content gets cut off. Additionally, AudioPlayer currently uses hardcoded `bottom-17` which doesn't account for variable nav height. When a song plays, the main content needs extra padding for both the nav and player; when stopped, only the nav.
- **Alternatives considered**:
  - Hardcoded `pb-20` — doesn't adapt when audio player is visible
  - Making bottom nav relative — worse UX, content shifts
  - JavaScript-measured heights — fragile, causes layout shifts
- **Chosen approach**: CSS variables defined in `:root` consumed by all three components. MainLayout reads `currentTrack` from player store to toggle between single-var and summed-var padding.

#### 2. Redundant LanguageSelector in MobileBottomNav
- **Decision**: Remove `LanguageSelector` from `MobileBottomNav` since it already exists in `DashboardHeader` (visible on mobile)
- **Rationale**: Having it in both places wastes horizontal space in the bottom nav (currently takes 1/5 of the bar). The 4 nav items should have more room.
- **Alternatives considered**:
  - Keep both — redundant, confusing UX
  - Remove from header instead — header is more conventional location for settings

#### 3. PageHeader Actions Overflow on Mobile
- **Decision**: Make PageHeader actions wrap below the title on mobile using `flex-col sm:flex-row`
- **Rationale**: Current `flex items-start justify-between` can cause horizontal overflow when title + actions exceed viewport width
- **Alternatives considered**:
  - Hiding actions on mobile — loses functionality
  - Truncating title — loses context

#### 4. Landing Hero Text Sizing
- **Decision**: Use `text-4xl sm:text-5xl lg:text-7xl` progression instead of `text-5xl sm:text-7xl`
- **Rationale**: 5xl (3rem = 48px) can be too large on 320px screens. 4xl (2.25rem = 36px) is more appropriate
- **Alternatives considered**:
  - Using `clamp()` — less consistent across browsers
  - Fixed `text-3xl` on mobile — too small for hero impact

#### 5. Landing Video Background Focus
- **Decision**: Shift video `object-position` to `70% center` on mobile, `center` on desktop
- **Rationale**: The interesting content in the video may be off-center; on narrow viewports the default center crop may cut off the subject
- **Chosen approach**: Responsive Tailwind class `object-[70%_center] md:object-center`

#### 6. AudioPlayer Mobile Positioning & Visibility
- **Decision**: AudioPlayer positions at `bottom: var(--mobile-nav-height)` on mobile and `bottom: 0` on desktop. The visual bar hides when `isPlaying === false` and shows when `isPlaying === true`.
- **Rationale**: Current `bottom-17` is a magic number. More importantly, `pause()` keeps `currentTrack` set — the player never unmounts after first play. Users expect the floating bar to disappear when music stops. Using `isPlaying` as the visibility condition solves this.
- **Implementation**: The `<audio>` element stays mounted (preserves track state/position). Only the visual bar hides via CSS (e.g., `translate-y-full` transition). MainLayout reads `isPlaying` to adjust bottom padding dynamically.
- **Alternatives considered**:
  - Clear `currentTrack` on pause — breaks resume functionality
  - Keep bar visible on pause with close button — more complex, unnecessary for now

## Technology Decisions

- **CSS variables**: Define `--mobile-nav-height` and `--audio-player-height` in `globals.css` `:root` for coordinated layout
- **Breakpoints**: Stick with Tailwind defaults — `sm` (640px), `md` (768px), `lg` (1024px). Mobile = below `md`.
- **No new dependencies**: All changes are CSS/Tailwind class adjustments to existing components
