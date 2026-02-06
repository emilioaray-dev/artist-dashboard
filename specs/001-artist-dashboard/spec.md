# Feature Specification: EVEN Backstage Dashboard

**Feature Branch**: `001-artist-dashboard`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "EVEN Backstage Dashboard para artistas - Dashboard con 3 secciones principales: 1) Recent Releases (lanzamientos exclusivos para fans), 2) Sales Analytics (gráficas interactivas de ventas directas), 3) Fan Engagement (métricas de interacción con fans). Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Recharts. Responsive design mobile-first. Mock data."

## Clarifications

### Session 2026-02-05

- Q: What level of animation/motion should be integrated? → A: Motion (motion/react) integrated from the start — page transitions, staggered card/chart entrances, micro-interactions on key metrics. Animations are a design decision, not a Phase 8 extra. Goal: elevate perceived quality and demonstrate UX criteria without unnecessary complexity.
- Q: What creative feature as signature differentiator? → A: Audio waveform preview on release cards — mini waveform visualizer per release that animates on hover/click with mock audio. Communicates EVEN is a music platform, not a generic dashboard. Integrated into card design without disrupting sales/performance focus.
- Q: What visual identity should the dashboard convey? → A: Premium / Luxury SaaS — deep dark backgrounds (HSL 220 15% 8%), amber/gold accents (HSL 42 100% 50%), generous spacing, large type hierarchy, subtle gradients on cards. Reinforces EVEN's positioning as a platform that maximizes artist value. Clean layouts that signal control, value, and professionalism.
- Q: What level of chart interactivity for sales analytics? → A: Time range tabs (7d/30d/90d) + clickable channel legend toggles. Demonstrates real interactivity and React state management. Makes reviewer actively engage with the UI without over-engineering into a BI tool.
- Q: When and how should AI usage be documented? → A: Incremental per phase — append log entries to AI_USAGE.md after each major phase/component with goal, tool, prompt, result, adjustments, and learning while context is fresh. Reflection questions answered at project close.

### Session 2026-02-05 (Reference UI Adaptation)

- Q: Reference UI adaptation from even-artist-hub? → A: Adapt the complete UI/UX from the Vite reference project (example/even-artist-hub) to our Next.js 16 project. Key patterns to match: StatCard layout (icon + change badge top row, label middle, value bottom), SVG gradient chart fills, Unsplash CDN images for cover art and avatars, Release Detail page (/releases/[id]), Settings page, Top Fans with avatar ranking badges, card hover glow effects, HSL-based color tokens. Keep our audio waveform differentiator (not in reference). Adapt framer-motion patterns to motion/react API.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Recent Releases (Priority: P1)

As a music artist, I want to see a grid of my recent exclusive releases and drops so I can quickly review my catalog and track sales performance at a glance.

**Why this priority**: This is the core content of an artist dashboard for EVEN - artists need to see their exclusive releases first. Without releases displayed, there's nothing to sell or engage with.

**Independent Test**: Can be fully tested by loading the dashboard and verifying that release cards display with cover art, title, release date, and basic sales numbers. Delivers immediate value by showing the artist their exclusive catalog.

**Acceptance Scenarios**:

1. **Given** the artist has released exclusive content, **When** they open the dashboard, **Then** they see a grid of their releases sorted by most recent first
2. **Given** the artist views the releases grid, **When** they look at a release card, **Then** they see the cover art, title, release date, and total sales/revenue
3. **Given** the artist is on a mobile device, **When** they view the releases, **Then** the grid adapts to show fewer columns while maintaining readability
4. **Given** releases are loading, **When** the artist waits, **Then** they see skeleton placeholders indicating content is loading

---

### User Story 2 - Analyze Sales Performance (Priority: P1)

As a music artist, I want to see visual charts of my direct-to-fan sales so I can understand my income trends and identify which sales channels perform best.

**Why this priority**: Sales analytics are the primary focus for artists on EVEN - understanding direct revenue from fans drives business decisions and validates the direct-to-fan model.

**Independent Test**: Can be fully tested by displaying a revenue chart with time-series data and a channel breakdown. Delivers value by showing income trends and channel distribution.

**Acceptance Scenarios**:

1. **Given** the artist has sales data, **When** they view the Sales Analytics section, **Then** they see an interactive line chart showing revenue over time (last 30 days default)
2. **Given** the artist views the analytics, **When** they see the channel breakdown, **Then** they see a clickable channel legend on the revenue chart allowing show/hide of individual channels (Direct to Fan, Digital, Physical, Bundles)
3. **Given** the artist hovers over a data point on the chart, **When** they interact, **Then** they see a tooltip with the exact value and date
4. **Given** the artist is on mobile, **When** they view charts, **Then** the charts resize appropriately and remain interactive via touch

---

### User Story 3 - Monitor Fan Engagement (Priority: P2)

As a music artist, I want to see metrics about my fan interactions so I can understand my audience growth and purchasing behavior.

**Why this priority**: Fan engagement is important for understanding the health of the fanbase and identifying purchasing patterns, but secondary to actual sales data.

**Independent Test**: Can be fully tested by displaying key engagement metrics (fans, growth rate, engagement rate, purchase rate) with visual indicators. Delivers value by showing audience health and purchasing behavior.

**Acceptance Scenarios**:

1. **Given** the artist has fan data, **When** they view the Fan Engagement section, **Then** they see key metrics: total fans, fan growth (last 30 days), engagement rate, and purchase rate
2. **Given** the artist views engagement metrics, **When** they look at each metric card, **Then** they see the current value and a trend indicator (up/down arrow with percentage change)
3. **Given** the artist wants more detail, **When** they view the engagement section, **Then** they see a fan growth chart over time
4. **Given** the artist is on mobile, **When** they view engagement metrics, **Then** the metric cards stack vertically and remain readable

---

### User Story 4 - View Release Details (Priority: P2)

As a music artist, I want to click on a release card to see detailed analytics for that specific release so I can understand its individual performance.

**Why this priority**: Adds depth to the releases section. Demonstrates dynamic routing and data-driven detail pages — impressive for a take-home.

**Independent Test**: Click a release card → navigates to /releases/[id] with cover art, status/type badges, 3 stat cards, and a "Revenue Over Time" chart.

**Acceptance Scenarios**:

1. **Given** the artist is on the Releases page, **When** they click a release card, **Then** they navigate to /releases/[id] with that release's details
2. **Given** the artist views a release detail page, **When** they see the header, **Then** they see the cover art (large), status badge, type badge, title, release date, and action buttons (Share, View Live)
3. **Given** the artist views a release detail page, **When** they see the stats section, **Then** they see 3 stat cards: Total Revenue, Units Sold, Conversion Rate
4. **Given** the artist views a release detail page, **When** they scroll down, **Then** they see a "Revenue Over Time" area chart with daily revenue for that release
5. **Given** the artist wants to go back, **When** they click "Back to Overview", **Then** they navigate back to the releases grid

---

### User Story 5 - Manage Account Settings (Priority: P3)

As a music artist, I want to manage my profile information and notification preferences.

**Why this priority**: Completes the application feel. Simple to implement but shows full SaaS product thinking.

**Independent Test**: Navigate to /settings → see profile fields and notification toggles.

**Acceptance Scenarios**:

1. **Given** the artist navigates to Settings, **When** they view the page, **Then** they see a Profile section with Artist Name and Email fields
2. **Given** the artist views Settings, **When** they see the Notifications section, **Then** they see toggles for Sales Alerts, New Fans, and Weekly Reports
3. **Given** the artist makes changes, **When** they click Save Changes, **Then** they see a success toast notification

---

### Edge Cases

- What happens when the artist has no releases yet? Display an empty state with helpful messaging encouraging them to create their first exclusive release.
- What happens when sales data is unavailable for a period? Show the chart with gaps or a message indicating "No sales data available for this period."
- What happens when the dashboard takes too long to load? Show skeleton loaders for each section; if loading exceeds 10 seconds, display an error message with retry option.
- What happens on very slow connections? Progressive loading - show each section as its data becomes available rather than waiting for all data.
- What happens if a release has no cover art? Display a placeholder image with a music note icon.
- What happens when a waveform preview is triggered on mobile? Use tap-to-play (not hover); only one waveform plays at a time across all visible cards.
- What happens when a release ID in the URL doesn't match any release? Display a "Release not found" message with a link back to the releases grid.
- What happens when the artist saves settings? Show a toast notification confirming success (no actual persistence — mock only).

## Requirements _(mandatory)_

### Functional Requirements

**Recent Releases**

- **FR-001**: System MUST display releases in a responsive grid layout (3 columns on lg desktop, 2 on sm tablet, 1 on mobile)
- **FR-002**: Each release card MUST show: cover art image (aspect-square with gradient overlay from-black/50 to-transparent), status badge overlaid on image, release title, type + release date, total revenue, and conversion/trend percentage
- **FR-003**: Releases MUST be sorted by release date (newest first)
- **FR-004**: System MUST show loading skeletons while release data loads
- **FR-005**: System MUST display an empty state when no releases exist
- **FR-038**: Each release card MUST include a mini audio waveform visualizer that animates on hover/click using mock audio data
- **FR-039**: Waveform MUST be rendered as lightweight SVG or canvas bars, not a heavy audio library
- **FR-040**: Waveform interaction MUST include a play/pause toggle with a subtle Motion animation on state change
- **FR-041**: Waveform MUST be secondary to the card's sales/performance data — visually integrated, not dominant
- **FR-050**: Release cards MUST link to /releases/[id] detail page
- **FR-051**: Release card cover art MUST use Unsplash CDN URLs (?w=400&h=400&fit=crop) for realistic mock images
- **FR-052**: Release card hover MUST apply image zoom (scale-105, 300ms transition) and amber glow border effect

**Sales Analytics**

- **FR-006**: System MUST display an area chart showing daily revenue with Gross vs Net overlapping areas (NOT stacked — Gross and Net are different views of the same data)
- **FR-007**: Revenue chart MUST display a clickable legend with color-coded dots (Gross: primary/amber, Net: chart-2/lighter amber) allowing show/hide of series
- **FR-008**: Charts MUST be interactive with custom-styled tooltips (dark theme, formatted currency, date) matching the premium aesthetic — NOT default Recharts tooltips
- **FR-009**: Charts MUST be responsive and remain usable on mobile devices
- **FR-010**: System MUST display total revenue and total sales as summary metrics
- **FR-042**: Revenue chart MUST include a time range tab bar (7d / 30d / 90d) that filters the displayed data
- **FR-043**: Revenue chart areas MUST use SVG linear gradients (defs + linearGradient, 5% opacity top to 0% bottom) for premium fill effect — not flat fillOpacity
- **FR-044**: Time range and channel toggle state MUST be managed in React client state (no URL params required)
- **FR-053**: Net revenue MUST be calculated as gross \* 0.85 (15% platform fee) to show meaningful difference between Gross and Net lines

**Fan Engagement**

- **FR-011**: System MUST display total fan count across channels
- **FR-012**: System MUST display fan growth percentage (30-day change)
- **FR-013**: System MUST display engagement rate and purchase rate metrics
- **FR-014**: Each metric MUST include a trend indicator (positive/negative change) using color-coded badges (green bg for positive, red bg for negative) with TrendingUp/TrendingDown icons
- **FR-015**: System MUST display a fan growth chart (Total fans vs Active buyers as overlapping areas — NOT stacked) with SVG gradient fills and custom tooltips

**Release Detail Page**

- **FR-054**: System MUST provide a release detail page at /releases/[id] with dynamic routing
- **FR-055**: Release detail MUST show: back navigation link ("Back to Overview"), large cover art (h-48 w-48 with shadow), status + type badges, title (h1 text-3xl), release date, and action buttons (Share, View Live)
- **FR-056**: Release detail MUST display 3 stat cards: Total Revenue, Units Sold, Conversion Rate
- **FR-057**: Release detail MUST display a "Revenue Over Time" area chart showing daily revenue data for that specific release with amber gradient fill
- **FR-058**: If release ID is not found, system MUST show a "Release not found" message with link back to releases

**Settings Page**

- **FR-059**: System MUST provide a Settings page at /settings with Profile and Notifications sections
- **FR-060**: Profile section MUST display editable fields for Artist Name and Email using shadcn/ui Input + Label
- **FR-061**: Notifications section MUST display toggle switches (shadcn/ui Switch) for: Sales Alerts, New Fans, Weekly Reports
- **FR-062**: Save Changes button MUST show a success toast notification (shadcn/ui Sonner/Toast)

**Data Layer**

- **FR-016**: System MUST use API Routes as reverse proxy to data service layer (even with mock data)
- **FR-017**: API Routes MUST return appropriate HTTP status codes (200, 404, 500)
- **FR-018**: API Routes MUST handle errors gracefully and return meaningful error messages
- **FR-020**: Data service layer MUST abstract data sources and allow easy migration from mock to real data

**Animation & Motion Design**

- **FR-033**: System MUST use Motion (motion/react) for all entrance animations and page transitions
- **FR-034**: Metric cards MUST animate with staggered fade+slide-up (delays: 0, 0.05, 0.1, 0.15s). Release cards MUST stagger at 0.3s + index*0.1s. Top fans at 0.5s + index*0.1s — matching reference timing
- **FR-035**: Key metric values (revenue, fan count, trends) MUST include subtle micro-interactions on first render
- **FR-036**: All motion MUST respect `prefers-reduced-motion` media query via MotionConfig reducedMotion="user"
- **FR-037**: Animations MUST serve UX clarity (guide attention, signal state changes) — not decorative complexity

**Architecture & Design Principles**

- **FR-021**: All components MUST follow SOLID principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- **FR-022**: Project structure MUST follow Next.js App Router conventions (organize routes without affecting URL path)
- **FR-023**: Components MUST be organized by feature domain (not by type) following Next.js recommended structure
- **FR-024**: Server Components SHOULD be used by default, Client Components ONLY when interactivity is required

**Code Quality**

- **FR-025**: All code MUST be written in TypeScript with strict mode enabled
- **FR-027**: Type definitions MUST be explicit and comprehensive (no implicit 'any' types)

**AI Usage Documentation (Required Deliverable)**

- **FR-045**: AI_USAGE.md MUST be updated incrementally after each major phase or component, not batch-written at the end
- **FR-046**: Each log entry MUST follow the assignment template: Goal, AI Tool Used, Prompt/Approach, Result (used as-is or modified + why), Learning
- **FR-047**: Document MUST include 3-5 significant interactions with thoughtful reflection (quality over quantity)
- **FR-048**: Document MUST include one detailed deep-dive example with initial prompt, iterations, code before/after, and quality reflection
- **FR-049**: Reflection questions (AI Strategy, Code Ownership, Productivity Impact, Quality Assurance) MUST be answered at project close

**UI Component Patterns (matching reference)**

- **FR-063**: MetricCard/StatCard layout MUST follow reference pattern: top row has icon (h-10 w-10 rounded-lg bg-muted) on left + change badge (bg-success/10 or bg-destructive/10 with TrendingUp/Down icon and %) on right. Label text below icons. Large value (text-2xl font-semibold) at bottom with optional $ prefix
- **FR-064**: TopFans component MUST display avatar images (from Unsplash CDN) with shadcn/ui Avatar + AvatarFallback. Top 3 fans MUST show a numbered ranking badge (h-5 w-5, rounded-full bg-primary) positioned absolute on avatar
- **FR-065**: Recent Releases list on Overview MUST show cover thumbnail (h-16 w-16 rounded-lg with hover scale-105), title, status badge, type + date, and revenue + trend. Each item links to /releases/[id]
- **FR-066**: Status badges MUST use shadcn/ui Badge or styled spans with color coding: live=green, upcoming=amber, ended=gray
- **FR-067**: Custom CSS utilities MUST be defined: .text-gradient (amber gradient text via bg-clip-text), .glow-primary (box-shadow 0 0 20px primary/15%), .card-hover (transition + border-primary/30 + glow on hover)

**General**

- **FR-029**: Dashboard MUST be fully responsive (mobile-first design)
- **FR-030**: Dashboard MUST show appropriate loading states for all sections using shadcn/ui Skeleton components
- **FR-031**: Dashboard MUST use mock data through API Routes (no direct imports in UI components)
- **FR-032**: All interactive elements MUST be keyboard accessible
- **FR-068**: Navigation sidebar MUST include 4 items: Overview, Releases, Fans, Settings (with Lucide icons: LayoutDashboard, Disc3, Users, Settings)
- **FR-069**: All mock images (cover art, avatars) MUST use Unsplash CDN URLs with ?w=400&h=400&fit=crop — no local image files

### Key Entities

- **Release**: Represents an exclusive music release (single, EP, album, exclusive) with cover art (Unsplash URL), title, release date, type, status (live/upcoming/ended), sales count, revenue, conversion rate, and sales by channel
- **SalesData**: Daily revenue records with date, gross amount, net amount (gross \* 0.85), per channel
- **EngagementMetrics**: Aggregated fan metrics including fan counts, growth rates, engagement rates, purchase rates
- **FanData**: Daily fan count records (total fans, active fans) for chart
- **TopFan**: Fan profile with name, avatar (Unsplash URL), totalSpent, purchaseCount, joinedDate
- **Channel**: Sales channel identifier (Direct to Fan, Digital, Physical, Bundles)
- **DashboardStats**: Summary metrics for Overview: totalRevenue, revenueChange, totalFans, fanChange, activeBuyers, buyerChange, avgOrderValue, orderValueChange

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Dashboard loads and displays all three sections within 3 seconds on standard connections
- **SC-002**: All interactive elements (chart tooltips, hover states) respond within 100ms of user interaction
- **SC-003**: Dashboard is fully usable on screens from 320px to 2560px width without horizontal scrolling
- **SC-004**: Users can identify their top-performing release within 5 seconds of viewing the dashboard
- **SC-005**: Users can determine their total monthly revenue within 10 seconds of viewing the dashboard
- **SC-006**: All text content maintains a minimum contrast ratio of 4.5:1 for accessibility
- **SC-007**: Dashboard functions correctly on latest versions of Chrome, Firefox, Safari, and Edge

## Assumptions

1. **Single Artist Context**: Dashboard displays data for one artist (the logged-in user). Multi-artist support is out of scope.
2. **30-Day Default Period**: All time-based metrics default to the last 30 days. Basic time range filtering (7d/30d/90d tabs) is in scope per clarification; custom date range pickers are a future enhancement.
3. **USD Currency**: All monetary values displayed in USD. Currency conversion is out of scope.
4. **Channel Focus**: Primary sales channels are Direct to Fan, Digital, Physical, and Bundles - reflecting the direct-to-fan model of EVEN.
5. **Mock Data**: All data is mocked. Structure matches typical direct-to-fan sales platform APIs.
6. **No Authentication**: Authentication is out of scope; dashboard loads directly with mock artist data.
7. **No Persistence**: User preferences are not persisted between sessions.
8. **English Only**: Interface is in English. Internationalization is a future enhancement.
9. **Visual Identity — Premium / Luxury SaaS**: Dark-first, no light mode. Design language reinforces EVEN's positioning as a high-value artist platform. All color tokens in HSL format for consistency with shadcn/ui.
   - **Backgrounds**: `--background: 220 15% 8%` (very dark blue), `--card: 220 15% 10%`, `--popover: 220 15% 12%`
   - **Primary/Accent**: `--primary: 42 100% 50%` (bright amber/gold), `--accent: 42 100% 50%`
   - **Muted**: `--muted: 220 15% 18%`, `--muted-foreground: 220 10% 55%`
   - **Status colors**: `--success: 142 70% 45%` (green), `--destructive: 0 84.2% 60.2%` (red)
   - **Sidebar**: `--sidebar-background: 220 15% 6%` (even darker), `--sidebar-accent: 220 15% 12%`
   - **Charts**: `--chart-1: 42 100% 50%` (amber), `--chart-2: 42 80% 60%` (lighter amber), `--chart-3: 220 15% 35%` (muted blue), `--chart-4: 142 70% 45%` (green)
   - **Typography**: Large type hierarchy — bold headings (24-32px), clear data values (text-2xl font-semibold), secondary text muted
   - **Spacing**: Generous padding (p-6 mobile, p-8 desktop), 16px card gaps
   - **Cards**: Subtle border with amber glow on hover (.glow-primary, .card-hover utilities)
   - **Chart gradients**: linearGradient from 5% opacity (top) to 0% (bottom) for premium area fills
   - **Overall feel**: Stripe Dashboard meets music industry — clean, confident, professional
