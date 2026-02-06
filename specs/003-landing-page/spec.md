# Feature Specification: Landing Page with Try Demo

**Feature Branch**: `feature/003-landing-page`
**Created**: 2026-02-06
**Status**: Draft
**Input**: User description: "Landing page replicating the prototype at even-artist-hub.vercel.app — dark theme, hero with background image, feature cards, and Try Demo CTA linking to the dashboard."

## Prototype Reference

The landing page must replicate the visual design and flow of the prototype at `even-artist-hub.vercel.app`. The structure captured from the prototype is:

### 1. Fixed Header (Navbar)
- Fixed top, full width, with blurred background (`bg-background/80 backdrop-blur-xl`)
- Border bottom: subtle `border-border/40`
- Left: Logo mark (amber square with "E") + "EVEN" (bold) "BACKSTAGE" (muted/normal weight)
- Right: "Try Demo" button (amber/primary bg) with arrow-right icon → links to dashboard
- Max width container: `max-w-7xl`, height `h-16`, horizontal padding `px-6`

### 2. Hero Section (Full viewport height)
- Full `min-h-screen`, vertically centered content
- **Background**: Full-bleed hero image (`hero-bg.jpg` — artist/musician photo) with two gradient overlays:
  - `bg-gradient-to-r from-background via-background/85 to-background/40` (left-to-right dark fade)
  - `bg-gradient-to-t from-background via-transparent to-transparent` (bottom-to-top dark fade)
- **Social proof pill**: Rounded badge with pulsing amber dot + "Join **500K+** artists getting EVEN"
- **Headline**: `h1`, large bold text: "SELL MUSIC" (white) + line break + "TO YOUR FANS" (amber/primary color). Font: display, `text-5xl sm:text-7xl font-black`
- **Subheadline**: "Make money from every sale, release early before streaming and get paid instantly." — muted foreground, `text-lg max-w-lg`
- **CTA area**:
  - Primary "Try Demo" button (amber bg, dark text, arrow-right icon, `h-11 px-8 text-base`) → links to dashboard
  - Helper text: "No login required. Explore the dashboard." — small muted text
- Content constrained to `max-w-2xl` within `max-w-7xl` container, left-aligned

### 3. Features Section (4-column grid)
- Positioned below hero, same max-width container (`max-w-7xl`)
- 4 feature cards in responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, gap-4
- Each card:
  - Rounded border card: `rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm`
  - Hover: `hover:border-primary/40 hover:bg-card` with transition
  - Lucide icon (amber/primary color, `h-6 w-6 mb-4`)
  - Title: `h3`, display font, `text-lg font-semibold`
  - Description: `text-sm text-muted-foreground mt-2`
  - Entrance animation: fade-in from below (opacity 0 → 1, translateY 20px → 0)
- **Feature cards content**:
  1. **Release Early** (Music icon) — "Give early access before your music hits streaming."
  2. **Get Paid Daily** (DollarSign icon) — "Automatic payouts every day you earn."
  3. **Get on the Charts** (ChartColumn icon) — "Report all eligible sales to Luminate automatically."
  4. **More Than Music** (Users icon) — "Build a home for all of your creative projects."

### 4. Footer
- Top border: `border-t border-border/40`
- Centered text: "EVEN Backstage Demo · Take-home Assignment"
- Padding `py-8`, muted foreground, small text
- Same max-width container

## User Scenarios & Testing _(mandatory)_

### User Story 1 - First Impression & Demo Access (Priority: P1)

A visitor arrives at the landing page and sees a bold hero section with background imagery, the "SELL MUSIC TO YOUR FANS" headline, a social proof indicator, and a prominent "Try Demo" button. Clicking the button navigates them to the live dashboard demo.

**Why this priority**: The hero + CTA is the core conversion mechanism of the landing page. Everything else supports this.

**Independent Test**: Load the landing page, verify the hero renders with headline, social proof pill, and "Try Demo" button. Click the button and confirm navigation to the dashboard.

**Acceptance Scenarios**:

1. **Given** a visitor loads the landing page, **When** the page renders, **Then** a fixed header with logo and "Try Demo" button is visible at the top.
2. **Given** a visitor views the hero, **When** it renders, **Then** the background image is displayed with gradient overlays, the social proof pill, headline "SELL MUSIC / TO YOUR FANS", subheadline, "Try Demo" button, and helper text are all visible.
3. **Given** a visitor clicks any "Try Demo" button (header or hero), **When** the navigation occurs, **Then** they are taken to the dashboard application.
4. **Given** a visitor loads the page on mobile (320px+), **When** the hero renders, **Then** all content is readable, the headline scales down appropriately, and the CTA is tappable.

---

### User Story 2 - Feature Discovery (Priority: P2)

A visitor scrolls below the hero and encounters a 4-column grid of feature cards that highlight key platform capabilities. Each card has an icon, title, and description, with a hover effect and entrance animation.

**Why this priority**: Feature cards build product understanding and trust before the visitor commits to the demo.

**Independent Test**: Scroll below the hero, verify 4 feature cards appear with correct content, icons, and hover effects.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls below the hero, **When** the features section enters the viewport, **Then** 4 feature cards animate in (fade-in from below) in a responsive grid.
2. **Given** a visitor views the feature cards on desktop, **When** rendered, **Then** they display in a 4-column grid. On tablet: 2 columns. On mobile: 1 column.
3. **Given** a visitor hovers over a feature card, **When** hovering, **Then** the card border shifts to amber/primary tint and background becomes slightly more opaque.

---

### User Story 3 - Footer Information (Priority: P3)

A visitor scrolls to the bottom and sees a minimal footer with project attribution.

**Why this priority**: The footer provides closure to the page and basic attribution. Low effort, low risk.

**Independent Test**: Scroll to the bottom of the page and verify footer text is visible.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the bottom, **When** the footer renders, **Then** centered text "EVEN Backstage Demo · Take-home Assignment" is displayed with a top border.

---

### Edge Cases

- What happens on very small screens (320px)? All content stacks vertically, headline scales to smaller size, CTA remains tappable (44x44px minimum touch target).
- What happens if the hero background image fails to load? The gradient overlays should still render over the dark background, ensuring text remains readable.
- What happens when JavaScript is disabled? Core content (header, hero text, features, footer) is server-rendered and visible. Animations are progressive enhancements.
- What happens with the visitor's locale? The landing page must support all 4 locales (en, es, fr, pt) using the existing i18n system, with translated text for all sections.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The landing page MUST be served at the root URL (`/`) using a `(landing)` route group under `[locale]`, with a layout distinct from the dashboard (no sidebar, no bottom nav). The dashboard overview moves to `/overview`.
- **FR-002**: The page MUST display a fixed header with the EVEN BACKSTAGE logo and a "Try Demo" button with arrow icon that links to the dashboard.
- **FR-003**: The page MUST display a full-viewport hero section with a background image, two gradient overlays (left-to-right and bottom-to-top), a social proof pill ("Join 500K+ artists getting EVEN" with pulsing dot), a two-line headline ("SELL MUSIC" / "TO YOUR FANS" in primary color), a subheadline, and a primary "Try Demo" CTA button with helper text.
- **FR-004**: The page MUST display a 4-card feature grid below the hero with the exact content from the prototype: "Release Early", "Get Paid Daily", "Get on the Charts", "More Than Music" — each with a Lucide icon, title, and description.
- **FR-005**: Feature cards MUST have entrance animations (fade-in + slide-up) triggered when scrolling into view.
- **FR-006**: Feature cards MUST have a hover effect: border color shifts to amber/primary, background becomes more opaque.
- **FR-007**: The page MUST display a minimal footer with centered attribution text and a top border.
- **FR-008**: The page MUST follow the existing design system: dark background (#09090B / rgb(17,19,23)), amber primary accent, Inter/Geist Sans font, and existing spacing/radius tokens.
- **FR-009**: The page MUST be fully responsive: mobile (320px+), tablet (768px+), desktop (1024px+). Hero headline scales from `text-5xl` (mobile) to `text-7xl` (desktop). Feature grid scales from 1 to 2 to 4 columns.
- **FR-010**: The page MUST support all 4 locales (en, es, fr, pt) with all visible text translatable via the existing i18n infrastructure.
- **FR-011**: The page MUST render core content server-side for fast initial paint and SEO.
- **FR-012**: The page MUST include appropriate meta tags (title, description, Open Graph) for social sharing.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The landing page loads and displays the hero section with "Try Demo" button within 2 seconds on a standard connection.
- **SC-002**: The "Try Demo" button is visible above the fold on all supported screen sizes (320px to 1920px+).
- **SC-003**: All landing page text is translated and displays correctly in all 4 supported languages.
- **SC-004**: The page scores 90+ on Lighthouse performance, accessibility, best practices, and SEO audits.
- **SC-005**: The visual design matches the prototype at even-artist-hub.vercel.app in layout, colors, typography, and interaction patterns.
- **SC-006**: All entrance animations play smoothly without layout shift.

## Assumptions

- The "Try Demo" button links to the dashboard overview at `/overview` within the same Next.js application (locale-prefixed as needed).
- The hero background image will be a static asset stored in the project (captured or recreated from the prototype).
- The landing page uses a separate layout from the dashboard — no sidebar, no MobileBottomNav.
- The existing i18n, design tokens, and Motion animation system will be reused.
- The social proof number ("500K+") is static display text, not fetched from an API.
