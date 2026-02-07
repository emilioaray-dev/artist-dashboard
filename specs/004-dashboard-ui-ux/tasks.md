# Tasks: Dashboard UI/UX Redesign

**Input**: Design documents from `/specs/004-dashboard-ui-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test updates are included only in the Polish phase to fix existing tests broken by component changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add missing shadcn/ui primitives required by later phases

- [x] T001 [P] Add shadcn DropdownMenu component via `npx shadcn@latest add dropdown-menu`
- [x] T002 [P] Add shadcn Avatar component via `npx shadcn@latest add avatar`
- [x] T003 [P] Add shadcn Dialog and Textarea components via `npx shadcn@latest add dialog textarea`

---

## Phase 2: Foundational — Color System & Design Tokens (Blocking Prerequisites)

**Purpose**: Migrate the color system from pure black to blue-grey HSL. This MUST be complete before any user story work, as all visual changes depend on the new color tokens.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Migrate CSS color tokens from oklch/hex to HSL blue-grey in `src/app/globals.css` — update `--background` to `hsl(220, 15%, 8%)`, `--card` to `hsl(220, 15%, 10%)`, `--muted` to `hsl(220, 15%, 18%)`, `--muted-foreground` to `hsl(220, 10%, 55%)`, `--sidebar-background` to `hsl(220, 15%, 6%)`, `--sidebar-accent` to `hsl(220, 15%, 12%)`, and related surface tokens per research.md R1 mapping table
- [x] T005 Add `--success` color token `hsl(142, 70%, 45%)` and `--card-hover-border`/`--card-hover-glow` tokens to `src/app/globals.css` per data-model.md new tokens table
- [x] T006 Add `.card-hover` utility class to `src/app/globals.css` with `transition: border-color 200ms, box-shadow 200ms` and `:hover` state using `--card-hover-border` and `--card-hover-glow` per research.md R2
- [x] T007 Update `DESIGN_TOKENS` in `src/lib/constants/theme.ts` to reference new HSL color values and add success color constant
- [x] T008 Update `STATUS_COLORS` in `src/lib/constants/theme.ts` to use semantic tinted styling — `live`: `bg-success/10 text-success border-success/20`, `scheduled`: `bg-primary/10 text-primary border-primary/20`, `draft`: `bg-muted text-muted-foreground`, `archived`: `bg-muted/50 text-muted-foreground` per research.md R6

**Checkpoint**: All pages should render with the new blue-grey color system. Cards should glow on hover. No visual regressions on existing layouts.

---

## Phase 3: User Story 1 — Refined Visual Identity and Color System (Priority: P1) — MVP

**Goal**: Cards display golden hover glow, status badges use semantic colors, and the overall dashboard uses the blue-grey palette consistently.

**Independent Test**: Visually inspect the dashboard — background should have a blue-grey tint, cards should glow on hover, badges should use semantic colors (green for live, gold for scheduled).

### Implementation for User Story 1

- [x] T009 [US1] Apply `card-hover` class to all interactive Card components in `src/components/ui/customs/cards/MetricCard.tsx` — add className to the Card wrapper
- [x] T010 [US1] Apply `card-hover` class and update badge styling in `src/components/ui/customs/cards/ReleaseCard.tsx` — add card-hover to Card wrapper, replace solid `bg-[STATUS_COLORS]` + `text-white` with semantic tinted classes per STATUS_COLORS mapping from T008 (e.g., live = `bg-success/10 text-success border border-success/20`)
- [x] T011 [P] [US1] Apply `card-hover` class to chart Card wrappers in `src/components/ui/customs/charts/RevenueChart.tsx` and `src/components/ui/customs/charts/FanGrowthChart.tsx`
- [x] T012 [US1] Verify all dashboard pages render with new color system — overview, releases, fans, settings — no residual pure-black backgrounds or unstyled components

**Checkpoint**: Dashboard has blue-grey aesthetic, cards glow on hover, badges use semantic colors. All pages are visually consistent.

---

## Phase 4: User Story 2 — Dashboard Top Header Bar (Priority: P2)

**Goal**: A sticky header bar appears on all dashboard pages with brand logo, notification bell, and user avatar dropdown.

**Independent Test**: Navigate any dashboard page and verify the header stays fixed at top with logo, bell icon, and avatar. Click avatar to see dropdown with name, email, Profile, Settings, Sign Out.

### Implementation for User Story 2

- [x] T013 [P] [US2] Add translation keys to `messages/en.json` — new `Header` namespace with keys: `notifications`, `profile`, `signOut`, `artistName` ("Music Artist"), `artistEmail` ("artist@example.com")
- [x] T014 [P] [US2] Add translation keys to `messages/es.json` — `Header` namespace with Spanish translations: `notifications` ("Notificaciones"), `profile` ("Perfil"), `signOut` ("Cerrar sesión"), `artistName` ("Music Artist"), `artistEmail` ("artist@example.com")
- [x] T015 [P] [US2] Add translation keys to `messages/fr.json` — `Header` namespace with French translations: `notifications` ("Notifications"), `profile` ("Profil"), `signOut` ("Se déconnecter"), `artistName` ("Music Artist"), `artistEmail` ("artist@example.com")
- [x] T016 [P] [US2] Add translation keys to `messages/pt.json` — `Header` namespace with Portuguese translations: `notifications` ("Notificações"), `profile` ("Perfil"), `signOut` ("Sair"), `artistName` ("Music Artist"), `artistEmail` ("artist@example.com")
- [x] T017 [US2] Create `src/components/layout/DashboardHeader.tsx` — sticky header (h-16) with: left side = brand logo using `BRAND_NAME` constant; right side = notification Bell icon (Lucide) + Avatar with initials fallback + DropdownMenu with artist name/email, separator, Profile link (ROUTES.settings), Settings link (ROUTES.settings), separator, Sign Out (navigates to ROUTES.home). Use `useTranslations("Header")` for all text. Background: card color + border-bottom + backdrop-blur. Responsive: hide brand text on mobile, show only icons.
- [x] T018 [US2] Integrate DashboardHeader into `src/app/[locale]/(dashboard)/layout.tsx` — render `<DashboardHeader />` above the main content area, inside the content wrapper (not overlapping sidebar). Adjust layout so header is sticky top and content scrolls beneath it.

**Checkpoint**: All dashboard pages show the sticky header. Avatar dropdown works with Profile, Settings, Sign Out. Header is responsive. All 4 locales display correct translations.

---

## Phase 5: User Story 3 — Redesigned Metric/Stat Cards (Priority: P2)

**Goal**: Overview page displays 4 stat cards with icon in muted circle, metric value, and percentage change badge with trend arrow. Cards animate in with staggered entrance.

**Independent Test**: Load overview page, verify each card shows icon in circle, value, and trend arrow (green up/red down). Cards should animate in sequentially.

### Implementation for User Story 3

- [x] T019 [US3] Redesign `src/components/ui/customs/cards/MetricCard.tsx` — new layout per research.md R5: title top-left, icon top-right in muted background circle (`bg-muted rounded-lg p-2`), value bottom-left, change badge bottom-right as pill (`bg-success/10 text-success` for positive, `bg-destructive/10 text-destructive` for negative) with TrendingUp/TrendingDown arrow inside the pill. Remove hardcoded amber `bg-[#D97706]` icon background.
- [x] T020 [US3] Update `src/components/ui/customs/cards/ClientMetricCard.tsx` — adjust staggered entrance animation delays to 0s, 0.05s, 0.1s, 0.15s (total < 600ms). Ensure the Motion wrapper applies the card-hover class.

**Checkpoint**: Overview page shows 4 redesigned stat cards with icons in muted circles, trend arrows in colored pills, and staggered entrance animation.

---

## Phase 6: User Story 4 — Area Charts with Gradient Fills (Priority: P3)

**Goal**: Revenue and fan growth charts display as area charts with SVG gradient fills, custom styled tooltips, dashed grid lines, and formatted axes.

**Independent Test**: Load overview page, verify both charts show area fills with visible gradients, hover tooltip shows formatted values, grid has dashed lines.

### Implementation for User Story 4

- [x] T021 [P] [US4] Refactor `src/components/ui/customs/charts/RevenueChart.tsx` — add `<defs>` with `<linearGradient>` for gross (golden: `hsl(42, 100%, 50%)`) and net (secondary color) per research.md R3 pattern. Set `fill="url(#gradientId)"` on each Area, `strokeWidth={2}`. Update CartesianGrid to `strokeDasharray="3 3"` with muted color `hsl(220, 15%, 18%)`. Style custom tooltip container with dark background, rounded, border. Format Y-axis with currency, X-axis with date labels.
- [x] T022 [P] [US4] Refactor `src/components/ui/customs/charts/FanGrowthChart.tsx` — add `<defs>` with `<linearGradient>` for total fans and active fans (using complementary colors). Set gradient fills on Area elements, `strokeWidth={2}`. Update CartesianGrid to `strokeDasharray="3 3"`. Style custom tooltip with dark background. Format Y-axis with K/M abbreviations.
- [x] T023 [US4] Update chart color constants in `src/lib/constants/charts.ts` if needed to reference new gradient-compatible HSL values

**Checkpoint**: Both charts render as area charts with visible gradient fills. Tooltips are styled. Grid is dashed. Axes are formatted. Charts are responsive.

---

## Phase 7: User Story 5 — Improved Sidebar Navigation (Priority: P3)

**Goal**: Sidebar active state shows accent background with primary-colored icon. Inactive items have subtle hover background.

**Independent Test**: Click through each nav item. Active item should have accent background + golden icon. Inactive items should show hover highlight.

### Implementation for User Story 5

- [x] T024 [US5] Update active state styling in `src/components/layout/Sidebar.tsx` — change active from `bg-primary/10 text-primary font-semibold` to `bg-sidebar-accent text-sidebar-accent-foreground` with icon specifically `text-primary`. Change inactive hover from `hover:bg-accent/50` to `hover:bg-sidebar-accent/50` per research.md R7.

**Checkpoint**: Sidebar active states clearly differentiate current page. Icons turn golden for active item. Hover states are subtle.

---

## Phase 8: User Story 6 — Release Upload Form (Priority: P2)

**Goal**: Artists can create new releases (Single or Album/EP) from the Releases page via a modal form with industry metadata, USD pricing, direct-to-fan commerce toggles, artist notes, and a congratulations message on submit.

**Independent Test**: Navigate to Releases page, click "Add Release", fill form for both Single and Album types, verify validation works, and see congratulations message on submit.

### Implementation for User Story 6

- [x] T025 [P] [US6] Add `ReleaseUpload` translation keys to `messages/en.json` — namespace with keys for: form labels (`addRelease`, `releaseType`, `single`, `albumEp`, `title`, `genre`, `explicitContent`, `coverArt`, `releaseDate`, `price`, `priceUsd`), credits (`credits`, `featuringArtists`, `writers`, `producers`), commerce toggles (`exclusive`, `exclusiveDescription`, `preSale`, `preSaleDescription`, `bundle`, `bundleDescription`), tracks (`trackList`, `addTrack`, `removeTrack`, `trackName`, `duration`, `trackPrice`), notes (`artistNotes`, `artistNotesPlaceholder`), actions (`submit`, `cancel`), success (`congratulations`, `congratulationsMessage`), validation (`required`, `minOneTrack`, `invalidPrice`)
- [x] T026 [P] [US6] Add `ReleaseUpload` translation keys to `messages/es.json` — Spanish translations for all keys defined in T025
- [x] T027 [P] [US6] Add `ReleaseUpload` translation keys to `messages/fr.json` — French translations for all keys defined in T025
- [x] T028 [P] [US6] Add `ReleaseUpload` translation keys to `messages/pt.json` — Portuguese translations for all keys defined in T025
- [x] T029 [US6] Create `src/components/ui/customs/forms/TrackListEditor.tsx` — client component for dynamic album track list. Features: add track button (appends row with auto-incremented order), remove track button per row, inputs for track name (required), duration (MM:SS format), individual price (USD, optional). Minimum 1 track validation. Uses `useTranslations("ReleaseUpload")`.
- [x] T030 [US6] Create `src/components/ui/customs/forms/ReleaseUploadDialog.tsx` — client component wrapping shadcn Dialog. Contains: release type tabs (Single / Album/EP), basic info section (title input, genre Select from predefined list, explicit content Switch, cover art placeholder area, release date input, price USD input), credits section (featuring artists, writers, producers text inputs), direct-to-fan section (exclusive Switch, pre-sale Switch, bundle Switch with descriptions), artist notes Textarea, track list section (renders TrackListEditor when Album/EP selected). Form validation: required fields (title, genre, price, min 1 track for album). On submit: show congratulations success state inside dialog, then reset form on close. Uses `useTranslations("ReleaseUpload")`. Apply card-hover and new color system styling.
- [x] T031 [US6] Add "Add Release" button to `src/app/[locale]/(dashboard)/releases/_components/ReleasesPageContent.tsx` — place button in page header area next to title. Button opens `ReleaseUploadDialog`. Also update the EmptyState action in `src/components/ui/customs/lists/ReleasesGrid.tsx` to trigger the same dialog.
- [x] T032 [US6] Add `MUSIC_GENRES` constant to `src/lib/constants/theme.ts` — predefined genre list: Pop, Rock, Hip-Hop, R&B, Electronic, Latin, Jazz, Classical, Country, Reggaeton, Indie, Alternative, Other

**Checkpoint**: "Add Release" button visible on Releases page. Modal form opens with Single/Album toggle. All fields render. Validation works. Congratulations message shows on submit. All 4 locales display correct translations.

---

## Phase 9: User Story 7 — Redesigned Settings Page (Priority: P2)

**Goal**: Settings page displays Artist Profile (avatar, name, email, bio), Payout & Revenue (USD, payment method, bank info, earnings), and Language section. Old Preferences section (theme, notifications) is removed.

**Independent Test**: Navigate to Settings, verify 3 sections render. Click avatar to see file picker and preview. Fill bio, click Save, see "Changes saved" message. Verify language selector still switches locale.

### Implementation for User Story 7

- [x] T033 [P] [US7] Update Settings translation keys in `messages/en.json` — remove old Preferences keys (`preferences`, `emailNotifications`, `theme`, `themeLight`, `themeDark`, `themeSystem`, `selectTheme`), add new keys: `artistProfile`, `avatar`, `changeAvatar`, `bio`, `bioPlaceholder` ("Tell your fans about yourself"), `payoutRevenue`, `currency`, `paymentMethod`, `paypal`, `stripe`, `bankTransfer`, `bankInfo`, `totalEarnings`, `maskedAccount`, `changesSaved`
- [x] T034 [P] [US7] Update Settings translation keys in `messages/es.json` — Spanish translations: `artistProfile` ("Perfil del Artista"), `avatar` ("Avatar"), `changeAvatar` ("Cambiar avatar"), `bio` ("Biografía"), `bioPlaceholder` ("Cuéntale a tus fans sobre ti"), `payoutRevenue` ("Pagos e Ingresos"), `currency` ("Moneda"), `paymentMethod` ("Método de pago"), `paypal` ("PayPal"), `stripe` ("Stripe"), `bankTransfer` ("Transferencia bancaria"), `bankInfo` ("Información bancaria"), `totalEarnings` ("Ganancias totales"), `maskedAccount` ("Cuenta"), `changesSaved` ("Cambios guardados")
- [x] T035 [P] [US7] Update Settings translation keys in `messages/fr.json` — French translations for all keys defined in T033
- [x] T036 [P] [US7] Update Settings translation keys in `messages/pt.json` — Portuguese translations for all keys defined in T033
- [x] T037 [US7] Redesign `src/app/[locale]/(dashboard)/settings/_components/SettingsPageClient.tsx` — replace current 2-card layout with 3 cards: (1) Artist Profile card with avatar upload area (hidden file input, clickeable avatar circle, preview via `URL.createObjectURL()`), display name Input, email Input, bio Textarea, Save button; (2) Payout & Revenue card with USD badge (read-only), payment method Select (PayPal/Stripe/Bank Transfer), masked bank info display (\*\*\*\*1234), total earnings computed from mock data, Save button; (3) Language card with existing locale Select (preserve current onLocaleChange functionality). Remove all Preferences-related JSX (theme select, notifications switch). Add inline success message state that shows "Changes saved" for 3 seconds on Save click. Use `useTranslations("Settings")` for all text. Apply card-hover class to all cards.

**Checkpoint**: Settings page shows 3 cards (Profile, Payout, Language). Avatar preview works. Save shows success message. Language switching works. No Preferences section visible. All 4 locales correct.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Fix broken tests, verify build, ensure no regressions across all stories.

- [x] T038 [P] Update `__tests__/components/RevenueChart.test.tsx` — fix any assertions broken by AreaChart gradient changes (mock SVG defs, update component queries)
- [x] T039 [P] Update `__tests__/components/ReleaseCard.test.tsx` — fix any assertions broken by semantic badge styling changes (update class name expectations)
- [x] T040 [P] Update `__tests__/components/TopFans.test.tsx` — verify no regressions from color system changes
- [x] T041 Run `npm run lint` — fix any lint errors introduced by new/modified components
- [x] T042 Run `npm test` — ensure all unit tests pass
- [x] T043 Run `npm run build` — ensure production build succeeds with no errors
- [x] T044 Visual verification across all pages (overview, releases, fans, settings) at mobile (375px), tablet (768px), and desktop (1280px+) viewports — including release upload form modal and redesigned settings page

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — install shadcn components immediately
- **Foundational (Phase 2)**: Depends on Setup — color tokens and design token constants must be in place before any visual work
- **US1 (Phase 3)**: Depends on Foundational — applies card-hover and badge styling using new tokens
- **US2 (Phase 4)**: Depends on Foundational — DashboardHeader uses new color system. Also needs Setup for DropdownMenu + Avatar
- **US3 (Phase 5)**: Depends on Foundational — MetricCard redesign uses new color tokens (success, muted)
- **US4 (Phase 6)**: Depends on Foundational — chart gradients use new HSL color values
- **US5 (Phase 7)**: Depends on Foundational — sidebar uses new sidebar-accent tokens
- **US6 (Phase 8)**: Depends on Foundational + Setup (needs Dialog, Textarea, new color system). Independent of US1-US5.
- **US7 (Phase 9)**: Depends on Foundational (needs new color system for card-hover). Independent of US1-US6.
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — can start after Foundational
- **US2 (P2)**: Independent — can start after Foundational (needs Setup for shadcn components)
- **US3 (P2)**: Independent — can start after Foundational
- **US4 (P3)**: Independent — can start after Foundational
- **US5 (P3)**: Independent — can start after Foundational
- **US6 (P2)**: Independent — can start after Foundational (needs Setup for Dialog + Textarea)
- **US7 (P2)**: Independent — can start after Foundational

All user stories are independent and can be developed in parallel after the Foundational phase.

### Within Each User Story

- Tasks marked [P] can run in parallel (different files)
- Sequential tasks depend on prior tasks within the same story
- Complete each story before moving to the next in priority order

### Parallel Opportunities

- **Phase 1**: T001, T002, T003 can all run in parallel (different shadcn components)
- **Phase 2**: T004 → T005 → T006 sequential (same file: globals.css), T007 and T008 sequential (same file: theme.ts)
- **Phase 3**: T009 and T011 can run in parallel (different files). T010 depends on T008 mapping.
- **Phase 4**: T013-T016 can all run in parallel (4 different locale files). T017 depends on T013-T016. T018 depends on T017.
- **Phase 5**: T019 and T020 are sequential (ClientMetricCard wraps MetricCard)
- **Phase 6**: T021 and T022 can run in parallel (different chart files). T023 depends on chart decisions.
- **Phase 8**: T025-T028 can all run in parallel (4 different locale files). T029 can start independently. T030 depends on T029. T031 depends on T030. T032 can run in parallel with T029.
- **Phase 9**: T033-T036 can all run in parallel (4 different locale files). T037 depends on translations.
- **Phase 10**: T038, T039, T040 can run in parallel (different test files). T041-T044 are sequential.

---

## Parallel Example: User Story 6 (Release Upload)

```bash
# Launch all locale translation tasks together:
Task T025: "Add ReleaseUpload translations to messages/en.json"
Task T026: "Add ReleaseUpload translations to messages/es.json"
Task T027: "Add ReleaseUpload translations to messages/fr.json"
Task T028: "Add ReleaseUpload translations to messages/pt.json"

# In parallel with translations, create constants:
Task T032: "Add MUSIC_GENRES constant to theme.ts"

# After translations complete:
Task T029: "Create TrackListEditor.tsx"

# After TrackListEditor:
Task T030: "Create ReleaseUploadDialog.tsx"

# After dialog:
Task T031: "Integrate into ReleasesPageContent.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (shadcn components)
2. Complete Phase 2: Foundational (color system migration)
3. Complete Phase 3: User Story 1 (card hover glow + semantic badges)
4. **STOP and VALIDATE**: Dashboard has new color system, cards glow, badges are semantic
5. This alone delivers a visually improved dashboard

### Incremental Delivery

1. Setup + Foundational → Blue-grey color system foundation ready
2. Add US1 → Card hover glow + semantic badges (MVP!)
3. Add US2 → Dashboard header with avatar dropdown
4. Add US3 → Redesigned metric/stat cards
5. Add US6 → Release upload form (direct-to-fan commerce)
6. Add US7 → Settings redesign (profile, payout, language)
7. Add US4 → Area charts with gradient fills
8. Add US5 → Sidebar navigation polish
9. Polish → Tests, lint, build verification

### Sequential Priority Order

Since this is a single-developer project, execute in priority order:

1. Phase 1 + Phase 2 (Setup + Foundation)
2. Phase 3 (US1 — P1 MVP)
3. Phase 4 (US2 — P2)
4. Phase 5 (US3 — P2)
5. Phase 8 (US6 — P2, release upload)
6. Phase 9 (US7 — P2, settings redesign)
7. Phase 6 (US4 — P3)
8. Phase 7 (US5 — P3)
9. Phase 10 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Charts already use AreaChart (not BarChart) — the change is adding gradient fills and styling, not switching chart type
- MetricCard already has ClientMetricCard wrapper with animation — update existing animation rather than creating new
- shadcn DropdownMenu, Avatar, Dialog, and Textarea must be installed (Phase 1) before dependent components
- All new UI text must have translations in all 4 locale files (en, es, fr, pt)
- Reference prototype code at `/tmp/even-artist-hub` for exact styling patterns
- Release upload form is mock-only — no persistence, submit shows congratulations message
- All prices are in USD (no currency selection in this version)
- Genre list is predefined as a constant in `src/lib/constants/theme.ts`
- Commit after each completed phase or logical group of tasks
