# Tasks: Landing Page with Try Demo

**Input**: Design documents from `/specs/003-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Route group restructuring and i18n setup — move existing dashboard pages into `(dashboard)` route group and create `(landing)` route group scaffold.

- [ ] T001 Create `(dashboard)` route group directory and move existing dashboard pages: `src/app/[locale]/fans/` → `src/app/[locale]/(dashboard)/fans/`, `src/app/[locale]/releases/` → `src/app/[locale]/(dashboard)/releases/`, `src/app/[locale]/settings/` → `src/app/[locale]/(dashboard)/settings/`
- [ ] T002 Move dashboard home page and components: `src/app/[locale]/page.tsx` → `src/app/[locale]/(dashboard)/overview/page.tsx`, `src/app/[locale]/_components/` → `src/app/[locale]/(dashboard)/_components/`
- [ ] T003 Move dashboard layout: convert `src/app/[locale]/client-layout.tsx` into `src/app/[locale]/(dashboard)/layout.tsx` (wrapping with existing SWRProvider, MotionProvider, SidebarProvider, Sidebar, MobileBottomNav, AudioPlayer, AccessibilityChecker)
- [ ] T004 Update `NAV_ITEMS` Overview href from `/` to `/overview` in `src/lib/constants.ts`
- [ ] T005 Create `(landing)` route group scaffold: `src/app/[locale]/(landing)/layout.tsx` (minimal layout with MotionProvider, no sidebar/nav) and empty `src/app/[locale]/(landing)/page.tsx`
- [ ] T006 Add hero background image asset to `public/images/hero-bg.jpg`
- [ ] T007 [P] Add `Landing` namespace with all translation keys to `messages/en.json`
- [ ] T008 [P] Add `Landing` namespace with Spanish translations to `messages/es.json`
- [ ] T009 [P] Add `Landing` namespace with French translations to `messages/fr.json`
- [ ] T010 [P] Add `Landing` namespace with Portuguese translations to `messages/pt.json`
- [ ] T011 Verify build succeeds and existing dashboard routes work at new paths (`/overview`, `/releases`, `/fans`, `/settings`) by running `npm run build`

**Checkpoint**: Route groups established, dashboard functional at new paths, landing page scaffold ready, all translations added.

---

## Phase 2: User Story 1 - First Impression & Demo Access (Priority: P1) 🎯 MVP

**Goal**: Deliver the hero section with fixed header, background image, social proof pill, headline, subheadline, and "Try Demo" CTA that navigates to the dashboard. This is the full above-the-fold experience.

**Independent Test**: Load `/` (or `/es/`, `/fr/`, `/pt/`), verify header with logo + CTA, hero with background image + gradient overlays, social proof pill, "SELL MUSIC / TO YOUR FANS" headline, subheadline, "Try Demo" button. Click button → navigates to `/overview`.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create LandingHeader component (fixed top navbar with logo "E" + "EVEN BACKSTAGE" text, "Try Demo" button with ArrowRight icon linking to `/overview`) in `src/app/[locale]/(landing)/_components/LandingHeader.tsx`
- [ ] T013 [P] [US1] Create LandingHero component (full-viewport hero section with background image via Next.js Image, two gradient overlays, social proof pill with pulsing amber dot, h1 headline "SELL MUSIC" / "TO YOUR FANS" in primary, subheadline, "Try Demo" CTA button, helper text) in `src/app/[locale]/(landing)/_components/LandingHero.tsx`
- [ ] T014 [US1] Assemble landing page server component: import LandingHeader + LandingHero, add `generateMetadata` with title, description, Open Graph (og:title, og:description, og:image, og:type), and Twitter card meta tags, use `getTranslations("Landing")` in `src/app/[locale]/(landing)/page.tsx`
- [ ] T015 [US1] Verify responsive behavior: hero headline scales `text-5xl` → `text-7xl`, CTA has minimum 44x44px touch target, content readable at 320px width
- [ ] T016 [US1] Verify all 4 locales render correctly: load `/`, `/es/`, `/fr/`, `/pt/` and confirm translated hero text

**Checkpoint**: Landing page at `/` shows header + hero with full above-the-fold experience. "Try Demo" navigates to dashboard. All 4 locales work.

---

## Phase 3: User Story 2 - Feature Discovery (Priority: P2)

**Goal**: Add the 4-column feature card grid below the hero with scroll-triggered entrance animations and hover effects.

**Independent Test**: Scroll below the hero, verify 4 feature cards animate in with fade-up effect. Desktop: 4 columns. Tablet: 2 columns. Mobile: 1 column. Hover on a card: border shifts to amber, background becomes more opaque.

### Implementation for User Story 2

- [ ] T017 [US2] Create LandingFeatures component (responsive grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, 4 feature cards with Lucide icons — Music, DollarSign, ChartColumn, Users — each with `rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm`, hover effect `hover:border-primary/40 hover:bg-card`, scroll-triggered animation using `motion/react` `whileInView` with `initial={{ opacity: 0, y: 20 }}` → `whileInView={{ opacity: 1, y: 0 }}`) in `src/app/[locale]/(landing)/_components/LandingFeatures.tsx`
- [ ] T018 [US2] Integrate LandingFeatures into the landing page below the hero section in `src/app/[locale]/(landing)/page.tsx`
- [ ] T019 [US2] Verify feature card translations render in all 4 locales and animations trigger on scroll

**Checkpoint**: Full landing page with hero + feature cards. Scroll animations work. Responsive grid adapts across breakpoints.

---

## Phase 4: User Story 3 - Footer Information (Priority: P3)

**Goal**: Add a minimal footer with centered attribution text and top border.

**Independent Test**: Scroll to the bottom of the landing page and verify footer with centered text "EVEN Backstage Demo · Take-home Assignment" and top border.

### Implementation for User Story 3

- [ ] T020 [US3] Create LandingFooter component (full-width `border-t border-border/40 py-8`, centered `text-sm text-muted-foreground` text within `max-w-7xl` container, translated via `Landing.footerText`) in `src/app/[locale]/(landing)/_components/LandingFooter.tsx`
- [ ] T021 [US3] Integrate LandingFooter into the landing page below the features section in `src/app/[locale]/(landing)/page.tsx`

**Checkpoint**: Complete landing page with header, hero, features, and footer. All sections visible and translated.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, lint, tests, and build validation across all sections and locales.

- [ ] T022 Update existing unit tests if any import paths changed due to route group restructuring (check `__tests__/` for broken imports)
- [ ] T023 Run `npm run lint` and fix any linting issues in new and moved files
- [ ] T024 Run `npm test` and ensure all existing tests pass with route group changes
- [ ] T025 Run `npm run build` and verify production build succeeds with no errors
- [ ] T026 Visual verification: compare landing page against prototype at even-artist-hub.vercel.app using Chrome DevTools screenshots across all 4 locales

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 2)**: Depends on Phase 1 completion (route groups + translations + hero image)
- **US2 (Phase 3)**: Depends on Phase 2 (landing page exists to add features section to)
- **US3 (Phase 4)**: Depends on Phase 2 (landing page exists to add footer to)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Setup only — delivers MVP landing page
- **US2 (P2)**: Depends on US1 (needs page.tsx to integrate into) — but LandingFeatures component (T017) can be built in parallel with US1
- **US3 (P3)**: Depends on US1 (needs page.tsx to integrate into) — but LandingFooter component (T020) can be built in parallel with US1

### Within Each Phase

- T001 → T002 → T003 (sequential: must create group dirs before moving pages, then layout)
- T004 can run in parallel with T003
- T005 depends on T003 (dashboard layout moved out first)
- T007–T010 can all run in parallel (different translation files)
- T012 and T013 can run in parallel (different component files)
- T014 depends on T012 + T013 (assembles them)

### Parallel Opportunities

```
Phase 1: T007 || T008 || T009 || T010 (translation files)
Phase 2: T012 || T013 (header + hero components)
Phase 3: T017 can start in parallel with Phase 2's T012/T013 (different file)
Phase 4: T020 can start in parallel with Phase 3's T017 (different file)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (route restructure + translations + asset)
2. Complete Phase 2: US1 (header + hero + CTA)
3. **STOP and VALIDATE**: Load `/` across all locales, click "Try Demo", verify dashboard at `/overview`
4. Deploy/demo if ready — landing page is functional with hero CTA

### Incremental Delivery

1. Setup → Route groups established, dashboard works at new paths
2. US1 → Hero + header + CTA → **MVP deployed**
3. US2 → Feature cards with animations → Enhanced landing
4. US3 → Footer → Complete page
5. Polish → Final verification and visual match to prototype

---

## Summary

| Metric | Value |
| ------ | ----- |
| Total tasks | 26 |
| Phase 1 (Setup) | 11 tasks |
| Phase 2 (US1 - Hero + CTA) | 5 tasks |
| Phase 3 (US2 - Features) | 3 tasks |
| Phase 4 (US3 - Footer) | 2 tasks |
| Phase 5 (Polish) | 5 tasks |
| Parallel opportunities | 8 tasks across phases |
| MVP scope | Phase 1 + Phase 2 (16 tasks) |

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The hero background image (T006) should be sourced from the prototype or a similar dark-toned musician photo
