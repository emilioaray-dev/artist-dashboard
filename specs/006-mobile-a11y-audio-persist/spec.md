# Feature Specification: Mobile A11y & Audio Persist

**Feature Branch**: `006-mobile-a11y-audio-persist`
**Created**: 2026-02-09
**Status**: Complete
**Input**: User description: "Mobile UI fixes, WCAG accessibility audit fixes, audio playback persistence across locale changes, and UI enhancements (avatar, clickable sidebar logo)."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Accessible Dashboard Experience (Priority: P1)

A user with assistive technology (screen reader, keyboard-only navigation) browses all pages of the dashboard and landing site. Every interactive element is reachable via keyboard, all color contrasts meet WCAG 2.1 AA, heading hierarchy is logical, landmark regions are present, and ARIA attributes reference existing elements.

**Why this priority**: Accessibility failures are legal compliance risks and block an entire class of users from using the product. Five distinct WCAG violations were found across five pages by an axe-core audit.

**Independent Test**: Inject axe-core on each of the 5 routes (Overview, Releases, Fans, Settings, Landing) at both mobile (375x812) and desktop (1440x900) viewports. All 10 audits must return 0 violations.

**Acceptance Scenarios**:

1. **Given** the dark theme is active, **When** muted-foreground text is rendered on the background, **Then** the contrast ratio is at least 4.5:1 (WCAG AA for normal text).
2. **Given** the main content area is scrollable, **When** a keyboard-only user navigates the page, **Then** the scrollable region is focusable via Tab key.
3. **Given** the Releases page is loaded, **When** a screen reader parses heading hierarchy, **Then** no heading level is skipped (e.g., no jump from h1 to h3).
4. **Given** the Landing page is loaded, **When** a screen reader identifies landmark regions, **Then** a `<main>` landmark contains the hero and features sections.
5. **Given** the Revenue chart tabs component is rendered, **When** a screen reader reads tab triggers, **Then** every `aria-controls` attribute references an existing element in the DOM.
6. **Given** a mobile viewport (375px), **When** the Revenue chart legend has 6 items, **Then** the legend wraps to multiple lines without horizontal overflow.

---

### User Story 2 - Uninterrupted Music Playback During Language Change (Priority: P1)

An artist is listening to a track preview while reviewing their dashboard. They decide to switch the interface language from English to Spanish. The music continues playing without interruption — no pause, no restart, no loss of playback position.

**Why this priority**: Stopping audio on language change is a jarring UX regression. The locale switch is a non-destructive preference change; users do not expect it to affect media playback.

**Independent Test**: Play a track, note the current playback time, switch locale via the language selector, and verify that audio continues from the same position without any audible gap.

**Acceptance Scenarios**:

1. **Given** a track is playing, **When** the user changes the interface language, **Then** audio playback continues without interruption or restart.
2. **Given** a track is playing at position 1:23, **When** the locale changes, **Then** after the page transition completes the playback position is within 1 second of 1:23.
3. **Given** a track is playing, **When** the locale changes, **Then** the play/pause button, progress bar, and waveform visualization remain in sync with the audio.
4. **Given** no track is playing, **When** the user changes locale, **Then** no audio starts and the player UI remains hidden.

---

### User Story 3 - Polished Mobile Layout for Releases and Fans (Priority: P2)

A mobile user (375px viewport) browses the Recent Releases list and Top Fans section. Release cards show cover art, title, badge, revenue, and trend indicator aligned cleanly with the waveform play button below. Top fans display rank badges in distinctive gold/silver/bronze colors and earnings in a color appropriate for currency (not the brand primary yellow).

**Why this priority**: Visual polish on the two most content-dense mobile sections improves scannability and trust. Misaligned elements and inappropriate colors create a feeling of an unfinished product.

**Independent Test**: Load the Overview page at 375px width. Verify release cards align trend indicators with waveform play buttons, top fans show gold/silver/bronze badges, and currency values display with correct decimal formatting.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (375px), **When** the Recent Releases list renders, **Then** the trend percentage indicator right-aligns with the waveform play button below it.
2. **Given** the Top Fans section is visible, **When** viewing rank badges, **Then** 1st place is gold, 2nd is silver, and 3rd is bronze.
3. **Given** the Top Fans section is visible, **When** viewing earnings amounts, **Then** the text color is green (emerald), not the brand primary yellow.
4. **Given** a currency value with cents (e.g., 38750 cents), **When** formatted, **Then** it displays as "$387.50" with two decimal places.
5. **Given** a currency value without cents (e.g., 42500 cents), **When** formatted, **Then** it displays as "$425" without trailing ".00".
6. **Given** the landing page on mobile, **When** the header renders, **Then** padding adjusts for comfortable fit on narrow screens.

---

### User Story 4 - User Avatar and Clickable Sidebar Navigation (Priority: P3)

A logged-in artist sees their profile picture (avatar) in the dashboard header and on the Settings page. On desktop, clicking the sidebar logo or "Backstage" text navigates to the Overview page. On mobile, tapping the brand name in the header also navigates to Overview.

**Why this priority**: These are quality-of-life UX improvements that make the product feel more polished and professional, but do not block any core workflow.

**Independent Test**: Verify the avatar image loads in the header and settings. Click the sidebar logo on desktop and verify navigation to /overview. On mobile, tap the header brand and verify navigation.

**Acceptance Scenarios**:

1. **Given** the dashboard header is rendered, **When** the avatar area loads, **Then** the user's profile image is displayed.
2. **Given** the Settings page is loaded, **When** no custom avatar has been uploaded, **Then** the default avatar image is shown.
3. **Given** the desktop sidebar is expanded, **When** the user clicks the logo icon or "Backstage" text, **Then** the app navigates to the Overview page.
4. **Given** the desktop sidebar is collapsed, **When** the user clicks the logo icon, **Then** the app navigates to the Overview page.
5. **Given** a mobile viewport, **When** the user taps the brand name in the header, **Then** the app navigates to the Overview page.

---

### Edge Cases

- What happens if the audio source URL becomes unavailable during a locale change? The singleton audio element retains its state; if the source was already loaded, playback continues. If the source fails to load, the existing error handling (buffering state) applies.
- What happens if the user changes locale rapidly multiple times while music plays? The audio element is unaffected by component remounts, so rapid locale changes do not compound or stack playback issues.
- What happens to the audio element during server-side rendering? The factory function returns null on the server, preventing any server-side errors.
- What if the avatar image fails to load? The fallback component shows the initials "MA" as graceful degradation.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The muted-foreground color MUST achieve a contrast ratio of at least 4.5:1 against the background in both light and dark themes.
- **FR-002**: The main scrollable content area MUST be focusable via keyboard navigation.
- **FR-003**: Heading hierarchy MUST not skip levels across all pages.
- **FR-004**: The landing page MUST include a `<main>` landmark containing the primary content sections.
- **FR-005**: All `aria-controls` attributes on tab triggers MUST reference existing elements in the DOM.
- **FR-006**: The Revenue chart legend MUST wrap to multiple lines when items exceed container width on mobile.
- **FR-007**: Audio playback MUST continue uninterrupted when the user changes the interface language.
- **FR-008**: The audio element MUST persist across component remounts caused by locale changes.
- **FR-009**: The Recent Releases list MUST use a grid layout on mobile that aligns trend indicators with waveform play buttons.
- **FR-010**: Top Fans rank badges MUST use gold (1st), silver (2nd), and bronze (3rd) color scheme.
- **FR-011**: Top Fans earnings MUST be displayed in a green color, not the brand primary.
- **FR-012**: Currency formatting MUST show exactly 2 decimal places when cents are non-zero and 0 decimal places when cents are zero.
- **FR-013**: The user avatar image MUST be displayed in the dashboard header and Settings page.
- **FR-014**: The sidebar logo and "Backstage" text MUST be clickable and navigate to the Overview page.
- **FR-015**: The mobile header brand MUST be tappable and navigate to the Overview page.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 5 application pages pass WCAG 2.1 AA accessibility audit with 0 violations on both mobile (375px) and desktop (1440px) viewports — 10 total audits, all clean.
- **SC-002**: Audio playback position drift during a locale change is less than 1 second.
- **SC-003**: No visual horizontal overflow occurs on any page at 375px viewport width.
- **SC-004**: All unit tests pass after changes.
- **SC-005**: Production build completes successfully with no errors.
- **SC-006**: Linter reports 0 errors.
- **SC-007**: All source files pass code formatting checks.

## Assumptions

- The accessibility audit targets AA conformance level (not AAA).
- The singleton audio element pattern is appropriate because only one track plays at a time (no concurrent playback).
- The avatar image is a placeholder; in a production system it would come from user uploads or a profile service.
- The gold/silver/bronze badge colors are design decisions that do not require color-blind accessibility treatment beyond sufficient contrast (they are decorative indicators with numeric rank labels).
- Currency formatting follows USD locale — the conditional decimal logic applies globally to all currency formatting calls.
