# Research: Landing Page with Try Demo

**Feature**: 003-landing-page
**Date**: 2026-02-06

## R1: Landing Page Route Architecture

**Decision**: Create the landing page as a new route group `(landing)` inside `[locale]` with its own layout that excludes the dashboard shell (Sidebar, MobileBottomNav, AudioPlayer).

**Rationale**:
- The landing page needs full i18n support (4 locales) — must be inside `[locale]`
- It must NOT show the dashboard Sidebar/MobileBottomNav — needs a separate layout
- Next.js route groups `(groupName)` allow different layouts under the same URL segment without affecting the URL path
- The current dashboard pages move into a `(dashboard)` route group, keeping the same URLs

**Architecture**:
```
src/app/[locale]/
├── (landing)/
│   ├── layout.tsx          # Minimal: MotionProvider + no sidebar
│   └── page.tsx            # Landing page (replaces current root /)
├── (dashboard)/
│   ├── layout.tsx          # Current client-layout with sidebar
│   ├── page.tsx            # Dashboard home (moved from current page.tsx)
│   ├── _components/        # HomePageStreaming etc.
│   ├── fans/
│   ├── releases/
│   └── settings/
├── error.tsx               # Shared error boundary
├── not-found.tsx           # Shared 404
└── template.tsx            # Shared page transitions
```

**URL mapping**:
- `/` → Landing page (en)
- `/es/` → Landing page (es)
- `/releases` → Dashboard releases (en)
- `/es/releases` → Dashboard releases (es)

**Alternatives considered**:
1. **Separate `/landing` route**: Rejected — landing should be at root `/`, and this would require moving all dashboard routes
2. **Conditional rendering at root page.tsx**: Rejected — no auth system exists, adds unnecessary complexity
3. **Route outside `[locale]`**: Rejected — loses i18n support which is required by the spec

## R2: Hero Background Image

**Decision**: Include a dark, atmospheric musician/artist photo as a static asset in `public/images/hero-bg.jpg`. Use Next.js `<Image>` component with `priority` for LCP optimization.

**Rationale**: The prototype uses a full-bleed hero background image with two gradient overlays. A static asset avoids external dependency and ensures fast loading. The `priority` flag ensures it's preloaded for LCP.

**Alternatives considered**:
1. **CSS gradient only**: Rejected — the prototype specifically has a photo background that adds visual depth
2. **External URL**: Rejected — adds external dependency and potential loading delay

## R3: Scroll-Triggered Animations for Feature Cards

**Decision**: Use the `motion/react` `useInView` hook or `whileInView` prop on feature card containers to trigger fade-in + slide-up animations when scrolling into the viewport.

**Rationale**: The prototype shows feature cards starting at `opacity: 0; transform: translateY(20px)` and animating in on scroll. The existing `FadeIn` and `StaggerContainer` components use `initial="hidden" animate="visible"` which plays on mount, not on scroll. For the landing page, we need viewport-triggered animations.

**Alternatives considered**:
1. **Reuse existing StaggerContainer + FadeIn**: Rejected — they animate on mount, not on scroll intersection
2. **Intersection Observer API directly**: Rejected — motion/react provides built-in `whileInView` which is cleaner

## R4: "Try Demo" Link Target

**Decision**: The "Try Demo" button links to an internal route within the same app. With the route group architecture, the dashboard will live at routes like `/releases`, `/fans`, etc. The "Try Demo" button will link to the dashboard overview page. The URL can be configured via an environment variable or constant, but defaults to the locale-aware dashboard path (e.g., `/` → dashboard overview within `(dashboard)` group needs its own explicit path like `/dashboard`).

**Update**: Since route groups don't affect URLs, we need the landing page at `/` and dashboard at a sub-path. The cleanest approach:
- Landing page: `/` (root)
- Dashboard: Remains at its current paths (`/releases`, `/fans`, `/settings`)
- Dashboard overview: Moves to `/overview` (new explicit path)
- "Try Demo" links to `/overview`

**Rationale**: This avoids URL collision (both landing and dashboard trying to claim `/`) and requires minimal change — only the dashboard home page changes from `/` to `/overview`.

**Alternatives considered**:
1. **External deployed URL**: Rejected — prototype links to `/dashboard` internally
2. **Keep dashboard at `/`**: Rejected — would conflict with landing page at `/`

## R5: i18n Translation Keys

**Decision**: Add a new `Landing` namespace in all 4 message files with keys for all visible text in the landing page.

**Structure**:
```json
{
  "Landing": {
    "tryDemo": "Try Demo",
    "noLoginRequired": "No login required. Explore the dashboard.",
    "socialProof": "Join {count} artists getting EVEN",
    "heroTitle1": "SELL MUSIC",
    "heroTitle2": "TO YOUR FANS",
    "heroSubtitle": "Make money from every sale, release early before streaming and get paid instantly.",
    "featureReleaseTitle": "Release Early",
    "featureReleaseDesc": "Give early access before your music hits streaming.",
    "featurePaidTitle": "Get Paid Daily",
    "featurePaidDesc": "Automatic payouts every day you earn.",
    "featureChartsTitle": "Get on the Charts",
    "featureChartsDesc": "Report all eligible sales to Luminate automatically.",
    "featureCommunityTitle": "More Than Music",
    "featureCommunityDesc": "Build a home for all of your creative projects.",
    "footerText": "EVEN Backstage Demo · Take-home Assignment"
  }
}
```

**Rationale**: Follows the existing namespaced pattern used by Overview, Releases, Fans, Settings sections.

## R6: SEO & Meta Tags

**Decision**: Use Next.js `generateMetadata` in the landing page to set title, description, and Open Graph tags. The landing page gets distinct metadata from the dashboard.

**Rationale**: Landing pages need strong SEO. Next.js metadata API is the standard approach and already used in the project's root layout.
