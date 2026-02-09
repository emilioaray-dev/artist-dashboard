# Implementation Plan: Mobile A11y & Audio Persist

**Branch**: `006-mobile-a11y-audio-persist` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)

## Summary

Fix WCAG accessibility violations found by axe-core audit, persist audio playback across locale changes by moving the HTML audio element to a module-level singleton, polish mobile UI for releases list and top fans, and add user avatar / clickable sidebar navigation. This is a presentation-layer and state-management change — no new APIs, data models, or dependencies.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3 + Next.js 16.1.6
**Primary Dependencies**: Tailwind v4, shadcn/ui, Recharts, Motion, next-intl v4.x, Zustand
**Storage**: N/A (presentation-layer and client-side state changes only)
**Testing**: Vitest (unit), axe-core via Chrome DevTools MCP (accessibility)
**Constraints**: No new npm dependencies, no shadcn/ui core modifications

## Architecture Decisions

### AD-001: Singleton Audio Element

**Problem**: When the user changes locale, `router.replace()` changes the `[locale]` dynamic segment. Next.js remounts the entire dashboard layout tree, destroying the `<audio>` HTML element inside AudioPlayer and stopping playback.

**Decision**: Move the `HTMLAudioElement` from the React component tree to a module-level singleton in `player-store.ts`. Store actions (`play`, `pause`, `seekTo`, `setVolume`, etc.) control the audio element directly. `AudioPlayer.tsx` becomes a pure UI component.

**Why**: The module-scope singleton survives any React remount because it lives outside the component tree. The Zustand store (also module-scope) already persists — now the audio element matches.

**Alternatives considered**:
- *Save/restore playback state on remount*: Would cause an audible gap during re-buffering. Rejected.
- *Move audio player above `[locale]` layout boundary*: Root layout is a Server Component, cannot host client-side audio state. Rejected.

### AD-002: CSS Grid with `display: contents` for RecentReleasesList

**Problem**: On mobile (375px), the flex layout caused misalignment between trend indicators and the waveform play button.

**Decision**: Use CSS Grid (`grid-cols-[auto_1fr_auto]`) on the card wrapper, with `display: contents` on the Link element so its children become direct grid items on mobile. Desktop retains flex layout via `md:flex`.

**Why**: CSS Grid gives precise column alignment control across rows, while `display: contents` allows the Link wrapper to remain for accessibility without breaking grid item placement.

## Phases

### Phase 1: Mobile UI Fixes

- Restructure RecentReleasesList with CSS Grid for mobile alignment
- Update TopFans badge colors (gold/silver/bronze) and earnings color (emerald)
- Fix `formatCurrency` to conditionally show 2 decimals only when cents exist
- Update test assertions for new currency formatting
- Shorten demo button translations for mobile viewport fit
- Fix landing header padding on narrow screens

### Phase 2: WCAG Accessibility Fixes

- Bump `--muted-foreground` lightness from 55% to 64% (5.34:1 contrast ratio)
- Add `tabIndex={0}` to scrollable `<main>` region
- Change ReleaseCard `<h3>` to `<p>` to fix heading order skip
- Wrap landing page hero + features in `<main>` landmark
- Add hidden `TabsContent` with `forceMount` for Radix tabs `aria-controls`
- Add `flex-wrap` to RevenueChart `ChartLegendContent`

### Phase 3: Audio Playback Persistence

- Add singleton `HTMLAudioElement` factory (`getAudioElement()`) in `player-store.ts`
- Wire audio event listeners (timeupdate, loadedmetadata, playing, waiting, ended) to update store
- Modify store actions (play, pause, stop, seekTo, setVolume, toggleMute, setPlaybackRate, reset) to control audio element directly
- Simplify `AudioPlayer.tsx` — remove audioRef, all useEffects, and `<audio>` JSX element

### Phase 4: UI Enhancements

- Add user avatar image to DashboardHeader and SettingsPageClient
- Wrap sidebar logo + "Backstage" text in Link to /overview (expanded and collapsed states)
- Make mobile header brand clickable to /overview

### Phase 5: Code Quality

- Apply Prettier formatting across entire codebase
- Fix SonarQube diagnostics (`globalThis.window`, canonical Tailwind classes)
- Verify: lint, tests (126/126), build, SonarQube (0 issues)

## Files Modified

| File | Change |
| ---- | ------ |
| `src/components/ui/customs/lists/RecentReleasesList.tsx` | CSS Grid restructure for mobile |
| `src/components/ui/customs/lists/TopFans.tsx` | Badge colors, earnings color |
| `src/lib/utils.ts` | Conditional currency decimals |
| `__tests__/lib/utils.test.ts` | Updated formatCurrency assertions |
| `__tests__/utils.test.ts` | Updated formatCurrency assertions |
| `messages/es.json`, `fr.json`, `pt.json` | Shortened tryDemo text |
| `src/app/[locale]/(landing)/_components/LandingHeader.tsx` | Mobile padding fix |
| `src/app/globals.css` | Muted-foreground contrast bump |
| `src/components/layout/MainLayout.tsx` | tabIndex for scrollable region |
| `src/components/ui/customs/cards/ReleaseCard.tsx` | h3 → p heading fix |
| `src/app/[locale]/(landing)/page.tsx` | main landmark |
| `src/components/ui/customs/charts/RevenueChart.tsx` | TabsContent + flex-wrap |
| `src/store/player-store.ts` | Singleton audio element + action wiring |
| `src/components/audio/AudioPlayer.tsx` | Pure UI (removed audio element) |
| `src/components/layout/DashboardHeader.tsx` | Avatar image + brand link |
| `src/components/layout/Sidebar.tsx` | Clickable logo → /overview |
| `src/app/[locale]/(dashboard)/settings/_components/SettingsPageClient.tsx` | Avatar image |
| `public/avatars/user.jpg` | User avatar asset |
| 21 additional files | Prettier formatting only |
