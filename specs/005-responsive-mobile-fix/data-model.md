# Data Model: Responsive Mobile Fix

## Overview

This feature is presentation-layer only — no new data entities, API endpoints, or storage changes. No new components added. No changes to `useSidebar` hook (mobile navigation is handled by the existing `MobileBottomNav`).

## CSS Custom Properties

New CSS variables in `globals.css` `:root` for coordinated mobile layout:

| Variable                 | Value    | Purpose                                          |
| ------------------------ | -------- | ------------------------------------------------ |
| `--mobile-nav-height`    | `4rem`   | Height of MobileBottomNav (64px)                 |
| `--audio-player-height`  | `3.5rem` | Height of AudioPlayer bar (56px)                 |

### Consumption

- **MobileBottomNav**: Sets its own height to `var(--mobile-nav-height)`
- **AudioPlayer (mobile)**: Positions at `bottom: var(--mobile-nav-height)` to dock above bottom nav
- **MainLayout (mobile, no track)**: Bottom padding = `var(--mobile-nav-height)`
- **MainLayout (mobile, track playing)**: Bottom padding = `calc(var(--mobile-nav-height) + var(--audio-player-height))`
- **Desktop**: None of these apply — `md:pb-12`, player at `bottom-0`

## PlayerStore Integration

`MainLayout` and `AudioPlayer` read `isPlaying` from `usePlayerStore` to determine the mobile player bar visibility:
- `isPlaying === true` → player bar visible on mobile → MainLayout uses combined padding (nav + player)
- `isPlaying === false` → player bar hidden on mobile → MainLayout uses nav-only padding

**Why `isPlaying` not `currentTrack`**: `pause()` sets `isPlaying: false` but keeps `currentTrack` set. The user expects the floating bar to disappear on pause. Using `currentTrack` would keep the bar visible indefinitely after first play.

The `<audio>` element inside `AudioPlayer` stays mounted regardless (to preserve playback position) — only the visual bar hides/shows.

No changes to `PlayerState` interface — only reading existing `isPlaying` field.

## Removed

### LanguageSelector from MobileBottomNav

Remove the `<LanguageSelector compact>` from `MobileBottomNav` — it's already accessible in `DashboardHeader` which is visible on mobile. This frees horizontal space for the 4 navigation items.
