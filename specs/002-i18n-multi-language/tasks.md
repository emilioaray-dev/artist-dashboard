# Tasks: Internationalization (i18n)

**Input**: Design documents from `/specs/002-i18n-multi-language/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install next-intl and create the i18n configuration backbone

- [ ] T001 Install next-intl v4.x dependency via `npm install next-intl`
- [ ] T002 Create locale routing config with supported locales (en, es, fr, pt), defaultLocale (en), and localePrefix 'as-needed' in `src/i18n/routing.ts`
- [ ] T003 [P] Create per-request i18n config with message loading and format definitions (short date, chartDate, currency, compact, percent) in `src/i18n/request.ts`
- [ ] T004 [P] Create locale-aware navigation exports (Link, redirect, usePathname, useRouter) in `src/i18n/navigation.ts`
- [ ] T005 Wrap Next.js config with createNextIntlPlugin in `next.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Migrate all pages under `[locale]/` dynamic segment and restructure layouts — MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create proxy.ts for locale detection and redirect (Accept-Language → cookie → default) in `src/proxy.ts`
- [ ] T007 Refactor root layout to minimal shell (fonts, globals.css only, no sidebar/providers) in `src/app/layout.tsx`
- [ ] T008 Create locale layout with NextIntlClientProvider, html lang attribute, and generateStaticParams for 4 locales in `src/app/[locale]/layout.tsx`
- [ ] T009 Move client-layout.tsx under locale segment in `src/app/[locale]/client-layout.tsx` and update navigation imports to use locale-aware versions from `src/i18n/navigation.ts`
- [ ] T010 Move home page and streaming components: `src/app/page.tsx` → `src/app/[locale]/page.tsx` and `src/app/_components/` → `src/app/[locale]/_components/`
- [ ] T011 [P] Move fans route: `src/app/fans/` → `src/app/[locale]/fans/` (page.tsx, loading.tsx, _components/)
- [ ] T012 [P] Move releases route: `src/app/releases/` → `src/app/[locale]/releases/` (page.tsx, loading.tsx, _components/)
- [ ] T013 [P] Move settings route: `src/app/settings/` → `src/app/[locale]/settings/` (page.tsx, loading.tsx, _components/)
- [ ] T014 Move error/loading files under locale segment: `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/loading.tsx`, `src/app/template.tsx` → `src/app/[locale]/`
- [ ] T015 Create English translation file with all namespaces (Common, Navigation, Overview, Releases, Fans, Settings, Errors, Formats) using ICU plural syntax for countable items (fan counts, stream counts) in `messages/en.json`
- [ ] T016 Verify build completes and all existing routes render correctly at root path (English) after migration

**Checkpoint**: Foundation ready — all pages render under `[locale]/`, next-intl configured, English translations loaded. User story implementation can now begin.

---

## Phase 3: User Story 1 — Browse Dashboard in Preferred Language (Priority: P1)

**Goal**: All visible UI text across all 4 pages is translated in all 4 supported languages. Browser language detection redirects to the correct locale.

**Independent Test**: Set browser language to `es`, load any page → all visible UI text appears in Spanish. Repeat for `fr` and `pt`.

### Implementation for User Story 1

- [ ] T017 [US1] Create Spanish translation file with all namespaces (~120-140 keys), using ICU plural syntax for countable items, in `messages/es.json`
- [ ] T018 [P] [US1] Create French translation file with all namespaces (~120-140 keys), using ICU plural syntax for countable items, in `messages/fr.json`
- [ ] T019 [P] [US1] Create Portuguese translation file with all namespaces (~120-140 keys), using ICU plural syntax for countable items, in `messages/pt.json`
- [ ] T020 [US1] Translate Sidebar navigation labels (Overview, Releases, Fans, Settings) using useTranslations('Navigation') in `src/components/layout/Sidebar.tsx`
- [ ] T021 [P] [US1] Translate MobileBottomNav labels using useTranslations('Navigation') in `src/components/layout/MobileBottomNav.tsx`
- [ ] T022 [US1] Translate Overview page headings and subheadings — pass translated strings from Server Component to `src/app/[locale]/_components/HomePageStreaming.tsx`
- [ ] T023 [US1] Translate MetricCard labels (Total Revenue, Total Fans, Active Buyers, Engagement Rate) — accept translated label props in `src/components/ui/customs/cards/MetricCard.tsx` and `src/components/ui/customs/cards/ClientMetricCard.tsx`
- [ ] T024 [US1] Translate RevenueChart title and legend labels in `src/components/ui/customs/charts/RevenueChart.tsx`
- [ ] T025 [P] [US1] Translate FanGrowthChart title and legend labels in `src/components/ui/customs/charts/FanGrowthChart.tsx`
- [ ] T026 [US1] Translate TopFans heading and column headers in `src/components/ui/customs/lists/TopFans.tsx`
- [ ] T027 [P] [US1] Translate RecentReleasesList heading and status labels in `src/components/ui/customs/lists/RecentReleasesList.tsx`
- [ ] T028 [US1] Translate Releases page headings, ReleaseCard status badges, and empty states in `src/app/[locale]/releases/_components/ReleasesPageContent.tsx` and `src/components/ui/customs/cards/ReleaseCard.tsx`
- [ ] T029 [P] [US1] Translate ReleasesGrid filter/sort labels in `src/components/ui/customs/lists/ReleasesGrid.tsx`
- [ ] T030 [US1] Translate Fans page headings, metric labels, and fan list headers in `src/app/[locale]/fans/_components/FansPageContent.tsx`
- [ ] T031 [US1] Translate Settings page form labels (Account Information, Preferences, Email, Display Name, Theme) in `src/app/[locale]/settings/_components/SettingsPageClient.tsx`
- [ ] T032 [US1] Translate error page messages and boundary fallbacks in `src/app/[locale]/error.tsx` and `src/app/[locale]/not-found.tsx`
- [ ] T033 [US1] Translate loading states and skeleton placeholder text in `src/components/ui/customs/feedback/EmptyState.tsx`
- [ ] T034 [US1] Verify proxy.ts detects Accept-Language header and redirects to correct locale prefix for es/fr/pt; unsupported languages default to English at root

**Checkpoint**: All 4 pages display correctly translated text in en, es, fr, pt. Browser language detection works.

---

## Phase 4: User Story 2 — Switch Language Manually (Priority: P1)

**Goal**: Users can switch languages via a compact dropdown in the sidebar (desktop) and mobile nav. Preference persists across sessions via cookie.

**Independent Test**: Click language selector → choose Portuguese → all text updates to Portuguese. Refresh page → Portuguese persists.

### Implementation for User Story 2

- [ ] T035 [US2] Create LanguageSelector dropdown component showing current locale code (e.g., "EN ▾") expanding to 4 options with native names (English, Espanol, Francais, Portugues) in `src/components/layout/LanguageSelector.tsx`
- [ ] T036 [US2] Integrate LanguageSelector into desktop Sidebar in `src/components/layout/Sidebar.tsx`
- [ ] T037 [US2] Integrate LanguageSelector into MobileBottomNav (accessible from navigation area) in `src/components/layout/MobileBottomNav.tsx`
- [ ] T038 [US2] Implement locale switching using next-intl's useRouter with `router.replace(pathname, { locale })` — URL updates to new locale prefix without full page reload
- [ ] T039 [US2] Verify NEXT_LOCALE cookie is set on language switch and persists preference across browser sessions
- [ ] T040 [US2] Verify `/en/` prefix redirects to `/` (removes superfluous prefix for default locale)

**Checkpoint**: Language selector functional on desktop and mobile. Switching updates URL, all text, and persists across sessions.

---

## Phase 5: User Story 3 — Localized Dates, Numbers, and Currency (Priority: P2)

**Goal**: All dates, numbers, and currency values format according to the selected locale's conventions.

**Independent Test**: Switch to French → verify chart X-axis uses French month abbreviations ("fevr."), metric cards show French thousand separator (12 400), currency shows "12 400,50 $US".

### Implementation for User Story 3

- [ ] T041 [US3] Update formatCurrency, formatNumber, formatDate, formatPercentage helpers to accept locale parameter and use Intl formatters in `src/lib/utils.ts`
- [ ] T042 [US3] Apply locale-aware date formatting to RevenueChart X-axis labels and tooltips using useFormatter() in `src/components/ui/customs/charts/RevenueChart.tsx`
- [ ] T043 [P] [US3] Apply locale-aware date formatting to FanGrowthChart X-axis labels and tooltips in `src/components/ui/customs/charts/FanGrowthChart.tsx`
- [ ] T044 [US3] Apply locale-aware number formatting (thousand separators) to MetricCard values in `src/components/ui/customs/cards/MetricCard.tsx` and `src/components/ui/customs/cards/ClientMetricCard.tsx`
- [ ] T045 [US3] Apply locale-aware currency formatting to TopFans revenue values in `src/components/ui/customs/lists/TopFans.tsx`
- [ ] T046 [P] [US3] Apply locale-aware formatting to RecentReleasesList date and stream count values in `src/components/ui/customs/lists/RecentReleasesList.tsx`
- [ ] T047 [US3] Verify chart tooltip content updates format when language changes (dates, numbers, currency)

**Checkpoint**: All data formatting (dates, numbers, currency) adapts correctly per locale across all charts, metric cards, and lists.

---

## Phase 6: User Story 4 — Settings Page Language Preference (Priority: P3)

**Goal**: Settings page includes a Language dropdown that mirrors the sidebar selector and serves as a discoverable location for language configuration.

**Independent Test**: Navigate to Settings → change Language dropdown → UI updates and preference persists.

### Implementation for User Story 4

- [ ] T048 [US4] Add Language dropdown to Preferences card in Settings page (alongside Theme) showing all 4 languages by native name in `src/app/[locale]/settings/_components/SettingsPageClient.tsx`
- [ ] T049 [US4] Wire Settings language dropdown to same locale switching logic as sidebar selector (router.replace + cookie update)
- [ ] T050 [US4] Verify Settings page itself updates to selected language including the language option labels

**Checkpoint**: Settings page language preference works identically to sidebar selector, providing a discoverable configuration location.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verify overall quality, fix edge cases, update tests and documentation

- [ ] T051 Verify translation fallback: remove a key from es.json → confirm English string displays as fallback
- [ ] T052 Verify no text truncation or layout breakage across all 4 languages on all 4 pages (responsive layouts)
- [ ] T053 Update existing unit tests to work with i18n provider wrapping (add NextIntlClientProvider to test utilities) in `vitest.setup.ts`
- [ ] T054 Update existing E2E tests to account for locale-prefixed URLs in `e2e/*.spec.ts`
- [ ] T055 Verify build completes with all 4 locale variants generating correctly (`npm run build`)
- [ ] T056 Run full test suite: `npm test` — all existing tests pass
- [ ] T057 Run quickstart.md validation: execute all 6 integration scenarios from `specs/002-i18n-multi-language/quickstart.md`
- [ ] T058 Update CLAUDE.md with i18n file structure (messages/, src/i18n/, [locale]/ routing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — translate all UI text
- **User Story 2 (Phase 4)**: Depends on Foundational + at least T017 (es.json) for testing — language selector
- **User Story 3 (Phase 5)**: Depends on Foundational — locale-aware formatting
- **User Story 4 (Phase 6)**: Depends on User Story 2 (T035 LanguageSelector) — Settings dropdown uses same pattern
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — No dependencies on other stories
- **User Story 2 (P1)**: Can start after Phase 2 — Independently testable, but T035 (LanguageSelector) benefits from having translation files from US1
- **User Story 3 (P2)**: Can start after Phase 2 — No dependencies on other stories (formatting is independent of translations)
- **User Story 4 (P3)**: Depends on US2 (T035 LanguageSelector component pattern) — extends same locale switching logic to Settings page

### Within Each User Story

- Translation files before component translations (US1)
- Component creation before integration (US2)
- Utility helpers before component application (US3)
- Core implementation before verification tasks

### Parallel Opportunities

- T003 + T004 can run in parallel (different i18n config files)
- T011 + T012 + T013 can run in parallel (different route directories)
- T017 + T018 + T019 can run in parallel (different translation files)
- T020 + T021 can run in parallel (Sidebar vs MobileBottomNav)
- T024 + T025 can run in parallel (different chart components)
- T042 + T043 can run in parallel (different chart formatting)
- US1 and US3 can proceed in parallel after Phase 2 (translations and formatting are independent)

---

## Parallel Example: User Story 1 (Translation Files)

```bash
# Launch all translation files in parallel:
Task: "Create Spanish translation file in messages/es.json"
Task: "Create French translation file in messages/fr.json"
Task: "Create Portuguese translation file in messages/pt.json"

# Launch parallel component translations (after translation files exist):
Task: "Translate Sidebar navigation labels in src/components/layout/Sidebar.tsx"
Task: "Translate MobileBottomNav labels in src/components/layout/MobileBottomNav.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (next-intl config)
2. Complete Phase 2: Foundational (page migration under [locale]/)
3. Complete Phase 3: User Story 1 (all translations)
4. Complete Phase 4: User Story 2 (language selector)
5. **STOP and VALIDATE**: All text translated, switching works, preference persists
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → English works at root, locale routing configured
2. Add User Story 1 → All text translated in 4 languages → Deploy/Demo (MVP!)
3. Add User Story 2 → Language selector in sidebar + mobile → Deploy/Demo
4. Add User Story 3 → Locale-aware formatting (dates, numbers, currency) → Deploy/Demo
5. Add User Story 4 → Settings page language dropdown → Deploy/Demo
6. Each story adds value without breaking previous stories

---

## Summary

| Metric | Count |
| --- | --- |
| Total tasks | 58 |
| Phase 1 (Setup) | 5 |
| Phase 2 (Foundational) | 11 |
| Phase 3 (US1 - Translations) | 18 |
| Phase 4 (US2 - Language Selector) | 6 |
| Phase 5 (US3 - Formatting) | 7 |
| Phase 6 (US4 - Settings) | 3 |
| Phase 7 (Polish) | 8 |
| Parallelizable tasks | 18 |
| Independent test criteria | 4 (one per user story) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- Mock data content (artist names, release titles, fan names) remains in English — only UI chrome is translated
- Currency values stay USD across all locales — only formatting changes
