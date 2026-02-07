# Feature Specification: Dashboard UI/UX Redesign

**Feature Branch**: `feature/004-dashboard-ui-ux`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Improve dashboard UI/UX to match the prototype at even-artist-hub. Key changes: sticky top header bar, redesigned stat cards, area charts with gradient fills, card hover glow effects, refined color tokens, semantic badge styling, improved sidebar active states. Keep existing audio waveform player and i18n support."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Refined Visual Identity and Color System (Priority: P1)

An artist visits the dashboard and immediately perceives a premium, cohesive dark interface. The background has a subtle blue-grey undertone instead of pure black, cards have subtle borders and a warm golden glow on hover, and all color tokens follow a consistent system. The overall aesthetic communicates professionalism and value.

**Why this priority**: The color system is the foundation of all other visual changes. Without updating the design tokens first, no other UI improvement will look right. This is the base layer that everything else builds on.

**Independent Test**: Can be tested by visually inspecting the dashboard — background should have a blue-grey tint, cards should glow on hover, and all elements should use the updated color palette consistently.

**Acceptance Scenarios**:

1. **Given** the dashboard loads, **When** the artist views any page, **Then** the background appears as a dark blue-grey (not pure black) with consistent card borders.
2. **Given** the artist hovers over any card, **When** the cursor enters the card area, **Then** the card border transitions to a warm golden tone and a soft golden glow shadow appears around the card.
3. **Given** the dashboard uses status badges (live, scheduled, draft, archived), **When** they render, **Then** each status uses semantic color styling — green for live, amber/gold for scheduled, grey for draft, muted for archived.

---

### User Story 2 - Dashboard Top Header Bar (Priority: P2)

An artist sees a sticky header bar at the top of every dashboard page. The header shows the brand logo on the left, and on the right displays a notification bell icon and a user avatar with a dropdown menu. This provides persistent access to account actions and notifications without using sidebar space.

**Why this priority**: The header bar is a major structural addition that changes the overall dashboard layout. It adds a persistent global navigation element that makes the dashboard feel more complete and professional.

**Independent Test**: Can be tested by navigating any dashboard page and verifying the header remains fixed at the top with the logo, notification icon, and user avatar visible.

**Acceptance Scenarios**:

1. **Given** the artist is on any dashboard page, **When** the page loads, **Then** a sticky header bar appears at the top with the brand logo on the left.
2. **Given** the header is rendered, **When** the artist looks at the right side, **Then** a notification bell icon and a circular user avatar are visible.
3. **Given** the artist clicks the user avatar, **When** the dropdown opens, **Then** it shows the artist's name, email, and options (Profile, Settings, Sign Out).
4. **Given** the artist scrolls down the page, **When** content scrolls behind the header, **Then** the header stays fixed and visible at all times.

---

### User Story 3 - Redesigned Metric/Stat Cards (Priority: P2)

An artist views the overview page and sees 4 key performance cards (Total Revenue, Total Fans, Active Buyers, Avg Order Value). Each card features a colored icon in a muted background circle, the metric value prominently displayed, and a percentage change indicator with an up/down arrow showing the trend direction. Cards animate in with a staggered entrance effect.

**Why this priority**: Stat cards are the first data the artist sees on the dashboard. Improving their visual design directly impacts the perceived quality and usefulness of the analytics data presented.

**Independent Test**: Can be tested by loading the overview page and verifying each card shows an icon, a metric value, and a percentage change with the correct trend arrow direction.

**Acceptance Scenarios**:

1. **Given** the overview page loads, **When** the stat cards render, **Then** 4 cards appear in a responsive grid (1 column mobile, 2 columns tablet, 4 columns desktop).
2. **Given** a stat card is displayed, **When** examining its content, **Then** it shows an icon in a muted background circle, the metric title, the metric value, and a percentage change with trend arrow.
3. **Given** a metric has a positive trend, **When** it renders, **Then** the change indicator shows a green up arrow with the percentage.
4. **Given** the page loads for the first time, **When** the cards appear, **Then** they animate in sequentially with a staggered delay between each card.

---

### User Story 4 - Area Charts with Gradient Fills (Priority: P3)

An artist views the revenue and fan growth charts and sees smooth area charts with gradient fills instead of basic bar/line charts. The revenue chart shows gross vs net revenue as two overlapping areas with golden gradient fills. The fan growth chart shows total fans vs active buyers with similar gradient styling. Both charts have a clean dark grid, formatted axes, and custom tooltips.

**Why this priority**: Charts are the core data visualization. Area charts with gradients look significantly more polished than basic charts and match the premium aesthetic of the prototype.

**Independent Test**: Can be tested by loading the overview page and verifying both charts display as area charts with visible gradient fills, proper axis formatting, and functional tooltips.

**Acceptance Scenarios**:

1. **Given** the overview page loads, **When** the revenue chart renders, **Then** it displays as an area chart with two gradient-filled areas (gross and net revenue).
2. **Given** the fan growth section loads, **When** the chart renders, **Then** it displays as an area chart with gradient fills showing total fans vs active buyers.
3. **Given** the artist hovers over a data point, **When** the tooltip appears, **Then** it shows the date and formatted values for each data series in a styled tooltip container.
4. **Given** the chart is displayed, **When** examining the grid and axes, **Then** the grid appears as subtle dashed lines and axes show properly formatted labels (currency for revenue, numbers for fans, dates on X-axis).

---

### User Story 5 - Improved Sidebar Navigation (Priority: P3)

An artist uses the sidebar and sees improved active state styling. The currently active page is highlighted with an accent background and the icon turns to the primary (golden) color. Hover states show a subtle background transition. The sidebar collapses and expands smoothly.

**Why this priority**: Navigation is used constantly. Improved active states make wayfinding clearer and the sidebar more visually polished. This is a polish item that elevates the overall experience.

**Independent Test**: Can be tested by clicking through each navigation item and verifying the active state visually differentiates from inactive items with the correct accent color.

**Acceptance Scenarios**:

1. **Given** the artist is on the Overview page, **When** looking at the sidebar, **Then** the Overview item has an accent background and its icon is golden/primary colored.
2. **Given** the artist hovers over an inactive nav item, **When** the cursor enters, **Then** a subtle background highlight appears.
3. **Given** the sidebar is expanded, **When** the artist clicks collapse, **Then** it smoothly transitions to a narrow state showing only icons.

---

### User Story 6 - Release Upload Form (Priority: P2)

An artist wants to add a new release (single track or album/EP) to their catalog. From the Releases page, the artist clicks an "Add Release" button which opens a modal form. The artist selects the release type (Single or Album/EP), fills in metadata (title, genre, explicit flag, featuring artists, writers, producers), sets a price in USD, writes a personal note to fans, and can mark the release as exclusive (fans-only), available for pre-sale, or bundleable. For albums, the artist adds multiple tracks with name, duration, and individual pricing. On submit, a congratulations message is displayed (no real persistence — this is a demo).

**Why this priority**: This is the core direct-to-fan commerce feature. Artists need the ability to create and price their content. Without this, the backstage is just analytics — this adds the creative/commercial workflow.

**Independent Test**: Can be tested by navigating to the Releases page, clicking "Add Release", filling the form for both single and album types, and verifying the congratulations message appears on submit.

**Acceptance Scenarios**:

1. **Given** the artist is on the Releases page, **When** they click the "Add Release" button, **Then** a modal form opens with release type selection (Single / Album/EP).
2. **Given** the form is open with "Single" selected, **When** the artist fills in title, genre, price, and submits, **Then** a congratulations success message is displayed.
3. **Given** the form is open with "Album/EP" selected, **When** the artist views the form, **Then** a track list section appears where they can add multiple tracks with name, duration, and individual price.
4. **Given** the artist adds tracks to an album, **When** they click "Add Track", **Then** a new track row appears with auto-incremented order number and input fields for name, duration, and price.
5. **Given** the artist fills the form, **When** they toggle "Exclusive", **Then** the release is marked as fans-only content.
6. **Given** the artist fills the form, **When** they toggle "Pre-sale" and set a scheduled date, **Then** the release is marked for pre-sale at the set price.
7. **Given** the artist writes in the "Artist Notes" field, **When** they submit, **Then** the personal message to fans is included with the release.
8. **Given** any required field is empty, **When** the artist clicks submit, **Then** validation errors are shown on the empty fields and the form does not submit.

---

### User Story 7 - Redesigned Settings Page (Priority: P2)

An artist navigates to the Settings page and sees a redesigned layout with three sections: Artist Profile (with editable avatar, display name, email, and bio), Payout & Revenue (showing USD currency, payment method selection, bank info placeholder, and total earnings), and a Language selector. The old Preferences section (theme selector, email notifications) is removed. All changes are mock — the "Save" button shows a success toast but does not persist data.

**Why this priority**: Settings is a core page that artists interact with regularly. The current implementation has placeholder preferences (theme switcher that doesn't work, email notifications with no backend). Replacing it with relevant artist-centric sections (profile, payout) makes the backstage feel more like a real product.

**Independent Test**: Can be tested by navigating to Settings, verifying the three sections render correctly, uploading a mock avatar (preview shows), filling in bio, selecting a payment method, and clicking Save to see the success toast.

**Acceptance Scenarios**:

1. **Given** the artist navigates to Settings, **When** the page loads, **Then** they see three sections: Artist Profile, Payout & Revenue, and Language.
2. **Given** the Artist Profile section is displayed, **When** the artist clicks the avatar area, **Then** a file picker opens (mock — the selected image shows as a preview but is not persisted).
3. **Given** the Artist Profile section, **When** the artist edits display name, email, or bio and clicks Save, **Then** a success toast ("Changes saved") appears.
4. **Given** the Payout & Revenue section, **When** the artist views it, **Then** they see USD as the currency (read-only), a payment method selector (PayPal, Stripe, Bank Transfer), masked bank info (\*\*\*\*1234), and total earnings to date.
5. **Given** the Language section, **When** the artist changes the language, **Then** the locale switches immediately (existing functionality preserved).
6. **Given** the old Preferences section (theme, notifications), **When** the page loads, **Then** those sections are NOT present.

---

### Edge Cases

- What happens when the viewport is too narrow for 4 stat cards? They should stack responsively to 2 columns then 1 column.
- How does the top header behave on mobile? It should remain sticky and adapt its content (possibly hiding the brand text and showing only icons).
- What happens if chart data is empty? Charts should show an empty state message rather than rendering blank.
- What if the notification bell has no notifications? It should still be visible but without a badge/indicator.
- How does card hover glow behave on touch devices? The glow should not apply on touch-only devices to avoid stuck states.
- What happens when the artist adds 0 tracks to an album? Validation must require at least 1 track for album type.
- What if the artist enters a negative price? Price must be validated as >= 0 (free releases are allowed).
- How does the track list behave with many tracks (20+)? The modal should scroll internally.
- What happens if the artist closes the modal without submitting? Form data is lost (no draft saving in this version).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The dashboard MUST display a sticky top header bar on all dashboard pages with the brand logo on the left and notification/avatar actions on the right.
- **FR-002**: The dashboard color system MUST use a blue-grey dark base tone instead of pure black, with consistent application across all surfaces (background, cards, sidebar, popovers).
- **FR-003**: All interactive cards MUST show a golden glow effect on hover, with a border color transition and soft outer shadow.
- **FR-004**: The overview page MUST display 4 stat cards with icon, metric value, and percentage change indicator showing trend direction (up/down arrow with green/red coloring).
- **FR-005**: Stat cards MUST animate with a staggered entrance effect when the page first loads.
- **FR-006**: The revenue chart MUST display as an area chart with dual gradient fills representing gross and net revenue.
- **FR-007**: The fan growth chart MUST display as an area chart with gradient fills representing total fans vs active buyers.
- **FR-008**: Both charts MUST include custom styled tooltips, formatted axis labels, and subtle dashed grid lines.
- **FR-009**: Status badges MUST use semantic color styling — green-tinted for live, gold-tinted for scheduled, neutral grey for draft, muted for archived.
- **FR-010**: The sidebar active state MUST show an accent background color and primary-colored icon for the current page.
- **FR-011**: The user avatar dropdown MUST display the artist name, email, and menu options (Profile, Settings, Sign Out).
- **FR-012**: All existing functionality MUST be preserved — audio waveform player, i18n support, language selector, all page routes, and data displays.
- **FR-013**: All visual changes MUST be responsive, adapting appropriately from mobile to desktop viewports.
- **FR-014**: The Releases page MUST display an "Add Release" button that opens a modal form for creating new releases.
- **FR-015**: The release form MUST support two release types: Single (one track) and Album/EP (multiple tracks with individual pricing).
- **FR-016**: The release form MUST include fields for: title, genre (from predefined list), explicit content flag, price in USD, release date, and cover art placeholder.
- **FR-017**: The release form MUST include credits fields: featuring artists, writers, and producers.
- **FR-018**: The release form MUST include an "Artist Notes" textarea for a personal message to fans.
- **FR-019**: The release form MUST include toggles for: Exclusive (fans-only content), Pre-sale (available for early purchase), and Bundle (include in bundles).
- **FR-020**: For Album/EP type, the form MUST allow adding multiple tracks with name, duration (MM:SS), order number, and individual price in USD.
- **FR-021**: On form submission, the system MUST display a congratulations success message instead of persisting data (demo mode).
- **FR-022**: The form MUST validate required fields (title, genre, price, at least 1 track for albums) and show inline validation errors.
- **FR-023**: The Settings page MUST display an Artist Profile section with editable avatar (mock upload with preview), display name, email, and bio textarea.
- **FR-024**: The Settings page MUST display a Payout & Revenue section showing USD currency (read-only), payment method selector (PayPal, Stripe, Bank Transfer), masked bank info, and total earnings.
- **FR-025**: The Settings page MUST remove the old Preferences section (theme selector and email notifications toggle).
- **FR-026**: The Settings page MUST retain the Language selector with existing locale-switching functionality.
- **FR-027**: The Settings Save button MUST show a success toast message ("Changes saved") without persisting data.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All dashboard pages render the sticky top header bar with logo, notification icon, and user avatar visible on every page.
- **SC-002**: The dashboard visual identity achieves consistency — all cards, charts, badges, and surfaces use the updated color system with no instances of the old pure-black background or unstyled components.
- **SC-003**: Card hover interactions respond within 200ms with a visible golden glow transition on all interactive card elements.
- **SC-004**: Both charts (revenue and fan growth) render as area charts with visible gradient fills and functional tooltips on data hover.
- **SC-005**: Stat cards display staggered entrance animations completing within 600ms of page load.
- **SC-006**: All existing features remain functional — audio player plays audio, language selector switches locale, all 4 pages display correct data, all 4 locales render correctly.
- **SC-007**: The dashboard renders correctly at mobile (375px), tablet (768px), and desktop (1280px+) viewports with no layout breakage.
- **SC-008**: The release upload form opens from the Releases page, accepts both Single and Album/EP types, validates required fields, and displays a congratulations message on successful submission.
- **SC-009**: Album/EP form supports adding/removing tracks with individual pricing, and validates at least 1 track is present before submission.
- **SC-010**: Settings page displays Artist Profile (avatar, name, email, bio), Payout & Revenue (USD, payment method, bank info, earnings), and Language sections — with no Preferences section visible.
- **SC-011**: Avatar mock upload shows a preview of the selected image in the profile section.

## Assumptions

1. The user avatar, name, email, and notification data will use mock/static values since this is a demo application without authentication.
2. The "Sign Out" option in the avatar dropdown will navigate back to the landing page since there is no real authentication.
3. The notification bell is decorative for this version — it shows the icon but clicking it does not open a notifications panel (future feature).
4. The existing Recharts library will be used for the area charts since it already supports AreaChart with gradients.
5. The audio waveform player and all i18n translations are preserved as-is — no visual changes to the audio system.
6. The card hover glow effect will be CSS-only (no JavaScript animation library needed) for performance.
7. All new UI text (header elements, dropdown options, form labels) will be added to all 4 locale message files (en, es, fr, pt).
8. The release upload form does not persist data — submitting always shows a congratulations message and resets the form.
9. All prices are in USD with no currency selection (single currency for this version).
10. The genre list is a predefined static list of common music genres (Pop, Rock, Hip-Hop, R&B, Electronic, Latin, Jazz, Classical, Country, Reggaeton, Indie, Alternative, Other).
11. Cover art upload shows a placeholder/preview area but does not actually process files.
12. The track list for albums supports add/remove operations with a minimum of 1 track required.
13. The Settings avatar upload is mock — selecting a file shows a preview via `URL.createObjectURL()` but is not persisted.
14. Payout & Revenue section uses mock data: PayPal as default payment method, bank info "\*\*\*\*1234", total earnings from mock releases data.
15. A toast/notification component will be needed for the "Changes saved" feedback — using a simple state-based message if no toast library is available.

## Scope Boundaries

### In Scope

- Top header bar with logo, notification bell, user avatar dropdown
- Color token system refinement (blue-grey dark base)
- Card hover glow effects
- Stat card redesign with icons, change indicators, staggered animations
- Revenue chart conversion to area chart with gradient fills
- Fan growth chart conversion to area chart with gradient fills
- Custom chart tooltips and axis formatting
- Sidebar active state styling improvements
- Badge/pill semantic color updates
- Responsive adaptation of all changes
- Release upload form (Single + Album/EP) with mock submission
- Direct-to-fan pricing in USD
- Exclusive/fans-only content toggle
- Pre-sale toggle for scheduled releases
- Bundle toggle for discount grouping
- Artist notes (personal message to fans per release)
- Essential music industry metadata (genre, explicit flag, credits)
- Settings page redesign: Artist Profile with avatar, Payout & Revenue, Language
- Removal of non-functional Preferences section (theme, notifications)

### Out of Scope

- Real authentication or user management
- Functional notifications system
- New pages or routes (upload form is a modal on existing Releases page)
- Changes to the landing page
- Changes to the audio waveform player
- Actual file upload or audio processing
- Real data persistence (form submit shows congratulations only)
- Payment processing or transaction handling
- ISRC/UPC/copyright metadata (future feature)
- Dark/light theme toggle (remains dark-only)
