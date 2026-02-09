# Tasks: Mobile A11y & Audio Persist

**Input**: Design documents from `/specs/006-mobile-a11y-audio-persist/`
**Prerequisites**: plan.md, spec.md
**Status**: All tasks complete

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Mobile UI Fixes (US3)

- [x] T001 [P] [US3] Restructure `RecentReleasesList` with CSS Grid (`grid-cols-[auto_1fr_auto]` + `display: contents`) for mobile alignment in `src/components/ui/customs/lists/RecentReleasesList.tsx`
- [x] T002 [P] [US3] Update TopFans badge colors to gold/silver/bronze and earnings color to emerald in `src/components/ui/customs/lists/TopFans.tsx`
- [x] T003 [P] [US3] Fix `formatCurrency` to show 2 decimals only when cents exist in `src/lib/utils.ts`
- [x] T004 [P] [US3] Update formatCurrency test assertions in `__tests__/lib/utils.test.ts` and `__tests__/utils.test.ts`
- [x] T005 [P] [US3] Shorten `tryDemo` translation keys in `messages/es.json`, `messages/fr.json`, `messages/pt.json`
- [x] T006 [P] [US3] Fix landing header padding (`px-6` → `px-2 md:px-6`) in `src/app/[locale]/(landing)/_components/LandingHeader.tsx`

**Checkpoint**: Release cards align at 375px, TopFans colors polished, currency formatting correct

---

## Phase 2: WCAG Accessibility Fixes (US1)

- [x] T007 [P] [US1] Bump `--muted-foreground` lightness from 55% to 64% in `src/app/globals.css` (both `:root` and `.dark`)
- [x] T008 [P] [US1] Add `tabIndex={0}` to scrollable `<main>` in `src/components/layout/MainLayout.tsx`
- [x] T009 [P] [US1] Change `<h3>` to `<p>` for release title in `src/components/ui/customs/cards/ReleaseCard.tsx`
- [x] T010 [P] [US1] Wrap hero + features in `<main>` landmark in `src/app/[locale]/(landing)/page.tsx`
- [x] T011 [US1] Add hidden `TabsContent` with `forceMount` for `aria-controls` in `src/components/ui/customs/charts/RevenueChart.tsx`
- [x] T012 [US1] Add `className="flex-wrap"` to `ChartLegendContent` in `src/components/ui/customs/charts/RevenueChart.tsx`

**Checkpoint**: axe-core audit returns 0 violations across all 5 pages on mobile + desktop (10 audits)

---

## Phase 3: Audio Playback Persistence (US2)

- [x] T013 [US2] Add singleton `HTMLAudioElement` factory (`getAudioElement()`) at module scope in `src/store/player-store.ts`
- [x] T014 [US2] Wire audio event listeners (timeupdate, loadedmetadata, playing, waiting, ended) to update store state in `src/store/player-store.ts`
- [x] T015 [US2] Modify store actions (play, pause, stop, seekTo, setVolume, toggleMute, setPlaybackRate, reset) to control audio element directly in `src/store/player-store.ts`
- [x] T016 [US2] Simplify `AudioPlayer.tsx` to pure UI — remove audioRef, all useEffects, and `<audio>` JSX element in `src/components/audio/AudioPlayer.tsx`

**Checkpoint**: Audio continues playing when locale changes via language selector

---

## Phase 4: UI Enhancements (US4)

- [x] T017 [P] [US4] Add `AvatarImage` with `/avatars/user.jpg` to header avatar in `src/components/layout/DashboardHeader.tsx`
- [x] T018 [P] [US4] Add avatar image to settings page in `src/app/[locale]/(dashboard)/settings/_components/SettingsPageClient.tsx`
- [x] T019 [P] [US4] Wrap sidebar logo + "Backstage" in `Link` to `/overview` (expanded + collapsed) in `src/components/layout/Sidebar.tsx`
- [x] T020 [US4] Make mobile header brand clickable to `/overview` in `src/components/layout/DashboardHeader.tsx`

**Checkpoint**: Avatar shows in header/settings, sidebar logo navigates to /overview

---

## Phase 5: Code Quality

- [x] T021 Apply Prettier formatting across entire codebase (`npx prettier --write "src/**/*.{ts,tsx}"`)
- [x] T022 Fix SonarQube diagnostic: `window` → `globalThis.window` in `src/store/player-store.ts`
- [x] T023 Fix Tailwind canonical class: `bottom-[var(--mobile-nav-height)]` → `bottom-(--mobile-nav-height)` in `src/components/audio/AudioPlayer.tsx`
- [x] T024 Verify: `npm run lint` (0 errors), `npm test` (126/126), `npm run build` (clean), SonarQube (0 issues)

**Checkpoint**: All quality gates pass

---

## Dependencies & Execution Order

- **Phase 1 (Mobile UI)**: No dependencies — can start immediately
- **Phase 2 (A11y)**: No dependencies — can run in parallel with Phase 1
- **Phase 3 (Audio)**: No dependencies — can run in parallel with Phases 1-2
- **Phase 4 (UI Enhancements)**: No dependencies — can run in parallel
- **Phase 5 (Code Quality)**: Depends on all previous phases

## Summary

| Metric         | Count |
| -------------- | ----- |
| Total tasks    | 24    |
| Completed      | 24    |
| Phase 1 (UI)   | 6     |
| Phase 2 (A11y) | 6     |
| Phase 3 (Audio)| 4     |
| Phase 4 (UX)   | 4     |
| Phase 5 (QA)   | 4     |
