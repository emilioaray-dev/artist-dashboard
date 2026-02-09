# Tasks: Responsive Mobile Fix

**Input**: Design documents from `/specs/005-responsive-mobile-fix/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. Note: The spec's US1 (hamburger menu) was removed from the plan — mobile navigation is already handled by MobileBottomNav. Tasks are aligned with the final plan.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (CSS Variables & Shared Infrastructure)

**Purpose**: Define CSS custom properties that all subsequent phases depend on

- [x] T001 Add `--mobile-nav-height` and `--audio-player-height` CSS variables to `:root` in `src/app/globals.css`

**Checkpoint**: CSS variables available for consumption by all components

---

## Phase 2: Foundational (Bottom Nav + Audio Player Architecture)

**Purpose**: Fix the core bottom nav overlap and audio player positioning — MUST complete before layout fixes

**⚠️ CRITICAL**: All mobile padding and positioning depends on this phase

- [x] T002 [P] Remove `LanguageSelector` import and usage from `src/components/layout/MobileBottomNav.tsx`, apply `h-[var(--mobile-nav-height)]` to the nav container
- [x] T003 [P] Update `AudioPlayer` positioning in `src/components/audio/AudioPlayer.tsx`: use `bottom-[var(--mobile-nav-height)]` on mobile, `bottom-0` on desktop; hide visual bar when `isPlaying === false` via `translate-y-[calc(100%+var(--mobile-nav-height))] md:translate-y-full` transition while keeping `<audio>` element mounted
- [x] T004 Move `DynamicAudioPlayer` outside of `MainLayout` in `src/app/[locale]/(dashboard)/layout.tsx` — place it as a sibling between `MainLayout` and `MobileBottomNav`
- [x] T005 Update `MainLayout` in `src/components/layout/MainLayout.tsx` to read `isPlaying` from `usePlayerStore` and apply dynamic bottom padding: `pb-[var(--mobile-nav-height)]` when not playing, `pb-[calc(var(--mobile-nav-height)+var(--audio-player-height))]` when playing, `md:pb-12` on desktop

**Checkpoint**: Content no longer hidden behind bottom nav; audio player docks above nav when playing and disappears when paused; padding adjusts dynamically

---

## Phase 3: User Story 2 - Dashboard Metrics on Mobile (Priority: P1)

**Goal**: Metric cards stack in single column, charts fit screen width, text is readable on mobile

**Independent Test**: Load Overview page at 375px — metric cards single-column, charts don't overflow, values legible

### Implementation

- [x] T006 [US2] Verify metric card grids use `grid-cols-1` at base in `src/app/[locale]/(dashboard)/_components/HomePageStreaming.tsx` — adjusted if needed
- [x] T007 [US2] Verify fan page metric grids in `src/app/[locale]/(dashboard)/fans/_components/FansPageContent.tsx` — adjusted if needed

**Checkpoint**: Dashboard overview and fan pages render correctly at 375px

---

## Phase 4: User Story 3 - Release Detail Page on Mobile (Priority: P2)

**Goal**: Cover art centered, metadata stacked vertically, stats single-column, chart full-width on mobile

**Independent Test**: Navigate to `/releases/rel_001` at 375px — cover centered, stats stacked, chart visible

### Implementation

- [x] T008 [US3] Verify and adjust mobile layout in `src/app/[locale]/(dashboard)/releases/[id]/_components/ReleaseDetailContent.tsx` — ensure cover art centers on mobile, stats grid uses `grid-cols-1` at base, chart spans full width

**Checkpoint**: Release detail page renders correctly at 375px

---

## Phase 5: User Story 4 - Landing Page on Mobile (Priority: P2)

**Goal**: Hero text scales for mobile, video focuses right on narrow viewports, features stack single-column

**Independent Test**: Open landing page at 375px — hero text fits, CTA visible, features single-column

### Implementation

- [x] T009 [US4] ~~Fix LandingHeader responsive issues in `src/app/[locale]/(landing)/_components/LandingHeader.tsx`~~ — DONE: `min-w-8` on logo + `leading-none` on brand text
- [x] T010 [US4] Update hero headline scaling in `src/app/[locale]/(landing)/_components/LandingHero.tsx` — change from `text-5xl sm:text-7xl` to `text-4xl sm:text-5xl lg:text-7xl`
- [x] T011 [US4] Add responsive `object-position` to background video in `src/app/[locale]/(landing)/_components/LandingHero.tsx` — `object-[70%_center] md:object-center` to shift focus right on mobile

**Checkpoint**: Landing page renders correctly at 375px with readable hero text and right-focused video

---

## Phase 6: User Story 5 - Dashboard Header on Mobile (Priority: P2)

**Goal**: Compact header with brand logo, notifications, and avatar in a single row on mobile

**Independent Test**: Load any dashboard page at 375px — header is compact, all elements visible in one row

### Implementation

- [x] T012 [US5] Verify header compactness in `src/components/layout/DashboardHeader.tsx` — ensure height stays at h-16 (64px) max, all elements fit single row on 320px

**Checkpoint**: Dashboard header renders compactly at 375px

---

## Phase 7: User Story 6 - Tables and Lists on Mobile (Priority: P3)

**Goal**: Lists adapt to narrow screens, release cards stack, fan rows show essential info

**Independent Test**: Load Releases and Fans pages at 375px — cards stack, no horizontal overflow

### Implementation

- [x] T013 [P] [US6] Verify releases grid stacks in single column at base in `src/components/ui/customs/lists/ReleasesGrid.tsx`
- [x] T014 [P] [US6] Verify fan list rows display without overflow in `src/app/[locale]/(dashboard)/fans/_components/FansPageContent.tsx`

**Checkpoint**: Lists and grids render correctly at 375px

---

## Phase 8: Layout Fixes (Cross-cutting)

**Purpose**: PageHeader responsive actions — affects multiple pages

- [x] T015 Update `PageHeader` flex layout in `src/components/layout/PageHeader.tsx` — change from `flex items-start justify-between` to `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between` for mobile action wrapping

**Checkpoint**: Page headers with actions wrap correctly on mobile across all pages

---

## Phase 9: Audio Player & Waveform Improvements

**Purpose**: Fix audio player UX issues discovered during responsive testing — brand colors, buffering behavior, track metadata

- [x] T016 Add `--primaryDark: hsla(42, 100%, 50%, 0.6)` CSS variable to `:root` and `.dark` in `src/app/globals.css` for progress differentiation
- [x] T017 Add `.audio-range` CSS styles to `src/app/globals.css` — custom range input styling with `--range-track` CSS variable for dynamic gradient (primaryDark for played, muted for unplayed), brand-colored thumb
- [x] T018 Update `src/components/audio/AudioPlayer.tsx` — use inline `style` with `--range-track` gradient for progress/volume differentiation, sidebar-aware margins via `useSidebar`, vertical centering with `h-14` + `items-center`, hide volume on mobile (`hidden sm:flex`)
- [x] T019 Fix double-play bug — remove `onPlayPause` prop from `src/components/audio/AudioWaveform.tsx`, remove related `togglePlayback` from `src/components/ui/customs/cards/ReleaseCard.tsx` and `src/app/[locale]/(dashboard)/releases/[id]/_components/ReleaseDetailContent.tsx`; AudioWaveform handles all playback through the Zustand store directly
- [x] T020 Update waveform bar colors in `src/components/audio/AudioWaveform.tsx` — use inline `fill` with `var(--primaryDark)` for played bars and `var(--muted)` for unplayed bars (matching AudioPlayer progress style)
- [x] T021 Reduce waveform height in `src/components/audio/AudioWaveform.tsx` — SVG viewBox to 28, max bar height to 18
- [x] T022 Add `isBuffering` state to `src/store/player-store.ts` — new `isBuffering: boolean` field, `setBuffering()` action; `play()` sets `isBuffering: true` for new tracks; progress timer skips advancing `currentTime` while `isBuffering` is true
- [x] T023 Clear buffering on audio play event in `src/components/audio/AudioPlayer.tsx` — listen for HTML audio `playing` event, call `setBuffering(false)`
- [x] T024 Gate waveform animation on buffering in `src/components/audio/AudioWaveform.tsx` — `isActive = isCurrentTrack && isPlaying && !isBuffering`; bars stay collapsed and static until audio actually starts
- [x] T025 Add loading spinner to waveform play button in `src/components/audio/AudioWaveform.tsx` — show `Loader2` (animate-spin) during `isBuffering`, `Pause` when playing, `Play` when stopped; update `aria-label` accordingly
- [x] T026 Add `duration` field to `Release` type in `src/types/index.ts` — `duration: number` (seconds, from audio metadata)
- [x] T027 Update mock releases with real CDN audio durations in `src/__mocks__/releases.ts` — obtained via `loadedmetadata` from actual audio files (rel_001: 339s, rel_002: 356s, rel_003: 298s, rel_004: 303s, rel_005: 306s, rel_006: 323s)
- [x] T028 Use `release.duration` as source of truth in `src/components/audio/AudioWaveform.tsx` — replace hash-based `getTrackDurationForRelease()` with `release.duration`; remove unused function from `src/lib/waveform.ts`
- [x] T029 Add `currentTrackTitle` to player store in `src/store/player-store.ts` — new `currentTrackTitle: string | null` field; `play()` accepts optional `title` parameter; reset clears title
- [x] T030 Pass track title on play in `src/components/audio/AudioWaveform.tsx` — call `play(audioUrl, release.title)` instead of `play(audioUrl)`
- [x] T031 Display track title in AudioPlayer in `src/components/audio/AudioPlayer.tsx` — show `currentTrackTitle` instead of parsing URL segment

**Checkpoint**: Audio player shows brand colors with progress differentiation. Waveform matches. No animation during buffering (spinner shown instead). Track durations are real metadata. AudioPlayer shows track title.

---

## Phase 10: Polish & Verification

**Purpose**: Final validation across all viewports

- [x] T032 Run `npm run lint` — no new warnings
- [x] T033 Run `npm test` — all 56 unit tests pass (updated AudioWaveform test for buffering state, added `duration` field to test mocks)
- [x] T034 Run `npm run build` — successful production build
- [x] T035 Visual verification at 320px, 375px, 414px, 768px, 1280px for all pages: Overview, Releases, Release Detail, Fans, Settings, Landing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phases 3-7 (User Stories)**: All depend on Phase 2 completion, can proceed in parallel
- **Phase 8 (Layout Fixes)**: Independent, can run in parallel with user stories
- **Phase 9 (Audio Improvements)**: Depends on Phase 2 (AudioPlayer architecture)
- **Phase 10 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US2 (Dashboard Metrics)**: Depends on Phase 2 — no cross-story dependencies
- **US3 (Release Detail)**: Depends on Phase 2 — no cross-story dependencies
- **US4 (Landing Page)**: Independent of Phase 2 (landing page doesn't use bottom nav) — can start after Phase 1
- **US5 (Dashboard Header)**: Depends on Phase 2 — no cross-story dependencies
- **US6 (Tables/Lists)**: Depends on Phase 2 — no cross-story dependencies

### Parallel Opportunities

- T002 + T003 can run in parallel (different files)
- T010 + T011 can run in parallel (same file but different sections)
- T013 + T014 can run in parallel (different files)
- All user story phases (3-7) can run in parallel after Phase 2

---

## Implementation Strategy

### MVP First (Phase 1 + Phase 2)

1. Complete Phase 1: CSS variables
2. Complete Phase 2: Bottom nav + audio player architecture
3. **STOP and VALIDATE**: Content not hidden behind nav, player docks correctly, padding adjusts
4. This alone fixes the most critical mobile issues

### Incremental Delivery

1. Phase 1 + 2 → Foundation (bottom nav + player fixed) → Validate
2. Add Phase 3 (US2 metrics) → Validate at 375px
3. Add Phase 5 (US4 landing) → Validate at 375px
4. Add Phase 4 + 6 + 7 (US3, US5, US6) → Validate at 375px
5. Phase 8 (PageHeader) → Validate
6. Phase 9 (Audio improvements) → Validate playback UX
7. Phase 10 (Polish) → Final validation → Deploy

---

## Notes

- T009 was already completed (LandingHeader fixes) before task generation
- No new npm dependencies needed
- `isPlaying` (not `currentTrack`) controls audio player visibility on mobile
- CSS variables `--mobile-nav-height` and `--audio-player-height` are the single source of truth for layout coordination
- `--primaryDark` provides visual differentiation between played/unplayed progress
- `isBuffering` state prevents false progress: timer and animations wait for actual audio playback
- `Release.duration` is the industry-standard approach — duration as metadata, not computed from hash
- `currentTrackTitle` passed via `play(url, title)` — AudioPlayer displays real track name
- Double-play bug was caused by `onPlayPause` callback re-toggling after store already toggled — fixed by removing the prop entirely
- `translate-y-[calc(100%+var(--mobile-nav-height))]` needed to fully hide AudioPlayer off-screen on mobile (simple `translate-y-full` only moves by element height)

## Summary

| Metric | Count |
|--------|-------|
| Total tasks | 35 |
| Completed | 35 |
| Phase 1 (Setup) | 1 |
| Phase 2 (Foundational) | 4 |
| Phase 3-8 (User Stories + Layout) | 10 |
| Phase 9 (Audio Improvements) | 16 |
| Phase 10 (Polish) | 4 |

### Files Modified

- `src/app/globals.css` — CSS variables, --primaryDark, .audio-range styles
- `src/components/layout/MobileBottomNav.tsx` — removed LanguageSelector, CSS var height
- `src/components/audio/AudioPlayer.tsx` — positioning, visibility, brand colors, buffering, track title
- `src/components/audio/AudioWaveform.tsx` — colors, height, buffering, spinner, duration, title, removed onPlayPause
- `src/app/[locale]/(dashboard)/layout.tsx` — moved DynamicAudioPlayer outside MainLayout
- `src/components/layout/MainLayout.tsx` — dynamic padding based on isPlaying
- `src/components/layout/PageHeader.tsx` — responsive flex-col wrapping
- `src/app/[locale]/(landing)/_components/LandingHero.tsx` — text scaling, video object-position
- `src/components/ui/customs/cards/ReleaseCard.tsx` — removed onPlayPause
- `src/app/[locale]/(dashboard)/releases/[id]/_components/ReleaseDetailContent.tsx` — removed onPlayPause
- `src/store/player-store.ts` — isBuffering, currentTrackTitle, buffering-aware timer
- `src/types/index.ts` — added Release.duration
- `src/__mocks__/releases.ts` — real CDN audio durations
- `src/lib/waveform.ts` — removed unused getTrackDurationForRelease
- `__tests__/components/AudioWaveform.test.tsx` — updated for buffering + duration
- `__tests__/components/ReleaseCard.test.tsx` — added duration to mock
