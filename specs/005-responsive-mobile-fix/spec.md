# Feature Specification: Responsive Mobile Fix

**Feature Branch**: `005-responsive-mobile-fix`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Responsive mobile fix: adjust the dashboard and landing page layouts for mobile viewports."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Dashboard Navigation on Mobile (Priority: P1)

A mobile user opens the dashboard and needs to navigate between sections (Overview, Releases, Fans, Settings). The sidebar is hidden by default on small screens. A hamburger menu button is visible in the header that toggles the sidebar as an overlay. Tapping a navigation item closes the sidebar and navigates to the selected page.

**Why this priority**: Navigation is the most fundamental interaction — without it, mobile users cannot access any part of the application.

**Independent Test**: Can be fully tested by opening the app on a 375px-wide viewport and verifying the sidebar toggle works, navigation items are tappable, and the overlay dismisses after selection.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (under 768px), **When** the dashboard loads, **Then** the sidebar is hidden and a hamburger menu icon is visible in the header.
2. **Given** the sidebar is hidden, **When** the user taps the hamburger icon, **Then** the sidebar slides in as an overlay with a semi-transparent backdrop.
3. **Given** the sidebar is open, **When** the user taps a navigation item, **Then** the app navigates to that page and the sidebar closes automatically.
4. **Given** the sidebar is open, **When** the user taps the backdrop area, **Then** the sidebar closes without navigation.

---

### User Story 2 - Viewing Dashboard Metrics on Mobile (Priority: P1)

A mobile user visits the Overview page and sees metric cards stacked vertically in a single column, with text and values sized for comfortable reading. Charts below the metrics resize to fit the screen width or become horizontally scrollable.

**Why this priority**: The Overview page is the primary landing page for dashboard users — metrics and charts must be readable on mobile to deliver core value.

**Independent Test**: Can be tested by loading the Overview page on a 375px viewport and verifying all metric cards are visible in a single column, values are legible, and charts do not overflow the screen.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the Overview page loads, **Then** metric cards display in a single-column stack (one card per row).
2. **Given** a mobile viewport, **When** the user views a chart, **Then** the chart resizes to fit the screen width or is horizontally scrollable within its container.
3. **Given** a mobile viewport, **When** the user reads metric values and labels, **Then** font sizes are large enough for comfortable reading (minimum 14px equivalent for body text).

---

### User Story 3 - Release Detail Page on Mobile (Priority: P2)

A mobile user taps a release card and navigates to the detail page. The cover art is centered at the top, followed by the release metadata (title, status badge, date), action buttons, and audio player — all in a vertical stack. The stats grid shows one card per row, and the revenue chart fills the full width.

**Why this priority**: The release detail page contains rich content that requires careful layout adaptation for narrow screens.

**Independent Test**: Can be tested by navigating to any release detail page on a 375px viewport and verifying the vertical layout, cover art centering, and chart visibility.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the release detail page loads, **Then** the cover art is centered horizontally above the metadata section.
2. **Given** a mobile viewport, **When** viewing the stats section, **Then** metric cards stack in a single column.
3. **Given** a mobile viewport, **When** viewing the revenue chart, **Then** it spans the full screen width and is readable.

---

### User Story 4 - Landing Page on Mobile (Priority: P2)

A mobile visitor opens the landing page and sees the hero section with appropriately sized headline text, a clearly visible CTA button, and the background video playing. The features grid and footer adapt to single-column layouts.

**Why this priority**: The landing page is the first impression for new visitors — mobile responsiveness directly impacts conversion.

**Independent Test**: Can be tested by opening the landing page on a 375px viewport and verifying hero text readability, CTA button visibility, and features section layout.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** the landing page loads, **Then** the hero headline scales down to fit without horizontal overflow.
2. **Given** a mobile viewport, **When** viewing the CTA button, **Then** it is full-width or prominently visible and tappable.
3. **Given** a mobile viewport, **When** scrolling to the features section, **Then** feature cards display in a single-column layout.

---

### User Story 5 - Dashboard Header on Mobile (Priority: P2)

A mobile user sees a compact header that includes the hamburger menu toggle, brand logo, and essential actions (notifications, avatar). The header does not consume excessive vertical space.

**Why this priority**: The header is visible on every dashboard page — a poorly adapted header wastes screen real estate on mobile.

**Independent Test**: Can be tested by verifying header height and element arrangement on a 375px viewport.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** any dashboard page loads, **Then** the header shows the hamburger icon, brand logo, and user avatar in a compact single row.
2. **Given** a mobile viewport, **When** the header is displayed, **Then** its height does not exceed 56px.

---

### User Story 6 - Tables and Lists on Mobile (Priority: P3)

A mobile user views lists (fans, releases grid) that adapt to narrow screens — either by switching to a compact card layout or providing horizontal scroll for wider content.

**Why this priority**: Lists are secondary content views; users can still access data through other pages if lists are partially adapted.

**Independent Test**: Can be tested by navigating to the Fans page and Releases page on a 375px viewport and verifying list content is accessible.

**Acceptance Scenarios**:

1. **Given** a mobile viewport, **When** viewing the releases grid, **Then** release cards stack in a single column.
2. **Given** a mobile viewport, **When** viewing the fans list, **Then** fan rows display essential info (avatar, name, status) without horizontal overflow.
3. **Given** a mobile viewport with a wide data table, **When** the content exceeds screen width, **Then** the container is horizontally scrollable.

---

### Edge Cases

- What happens when the user rotates the device from portrait to landscape? The layout should adapt fluidly without requiring a page reload.
- How does the sidebar behave on tablets (768px-1024px)? It should use the same collapsible overlay pattern as mobile, not the desktop persistent sidebar.
- What happens when a chart has very few data points on mobile? It should still render at a reasonable minimum height.
- How does the audio player behave on mobile? The waveform and controls should remain tappable with adequate touch targets (minimum 44px).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The dashboard sidebar MUST be hidden by default on viewports under 768px wide and toggled via a hamburger menu button.
- **FR-002**: The sidebar overlay MUST include a backdrop that dismisses the sidebar when tapped.
- **FR-003**: Metric card grids MUST switch to a single-column layout on viewports under 640px.
- **FR-004**: All charts MUST either resize to fit the viewport width or be contained in a horizontally scrollable wrapper.
- **FR-005**: The release detail page MUST display cover art centered above metadata in a vertical stack on mobile.
- **FR-006**: The landing page hero text MUST scale down appropriately for mobile without horizontal overflow.
- **FR-007**: The dashboard header MUST display a compact layout on mobile with hamburger toggle, brand logo, and user avatar.
- **FR-008**: All interactive elements (buttons, links, toggles) MUST have a minimum touch target of 44x44 pixels on mobile.
- **FR-009**: Font sizes MUST maintain readability on mobile — body text at minimum 14px equivalent, headings scaled proportionally.
- **FR-010**: Lists and grids that exceed viewport width MUST provide horizontal scrolling rather than content overflow.
- **FR-011**: The layout MUST adapt fluidly on device rotation without requiring a page reload.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All dashboard pages render without horizontal overflow on viewports from 320px to 767px wide.
- **SC-002**: Users can navigate between all dashboard sections on mobile using the sidebar toggle within 2 taps (open menu + select item).
- **SC-003**: All interactive elements meet the 44px minimum touch target size on mobile viewports.
- **SC-004**: The landing page hero section displays without text truncation or overflow on a 320px viewport.
- **SC-005**: Charts and data visualizations are visible and readable on a 375px viewport (either full-width or scrollable).
- **SC-006**: Page layout adapts correctly when rotating between portrait and landscape orientations.

## Assumptions

- The mobile breakpoint is 768px (below = mobile, 768px and above = desktop). Tablet range (768px-1024px) uses the mobile sidebar pattern.
- The existing bottom navigation bar on mobile (MobileBottomNav) may coexist with or be replaced by the hamburger sidebar toggle — the current implementation already provides bottom nav, so the hamburger toggle provides an alternative access point.
- No new pages or features are being added — this is purely a layout and styling adjustment to existing content.
- The existing i18n support and audio waveform player functionality remain unchanged; only their visual layout adapts.
