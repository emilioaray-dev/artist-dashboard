# Research: Dashboard UI/UX Redesign

**Branch**: `feature/004-dashboard-ui-ux` | **Date**: 2026-02-06

## R1: Color System Migration (Pure Black → Blue-Grey)

**Decision**: Migrate from oklch(0.145 0 0) pure black to HSL(220, 15%, 8%) blue-grey base.

**Rationale**: The prototype uses a blue-grey dark palette that feels warmer and more premium than pure black. The subtle blue undertone reduces eye strain and creates visual depth between surfaces.

**Mapping** (prototype → our system):

| Surface          | Prototype (HSL)    | Current (oklch/hex)        | New Value          |
| ---------------- | ------------------ | -------------------------- | ------------------ |
| Background       | hsl(220, 15%, 8%)  | oklch(0.145 0 0) / #09090B | hsl(220, 15%, 8%)  |
| Card             | hsl(220, 15%, 10%) | #0a0a0a                    | hsl(220, 15%, 10%) |
| Surface elevated | hsl(220, 15%, 12%) | #111111                    | hsl(220, 15%, 12%) |
| Muted/Grid       | hsl(220, 15%, 18%) | #27272a                    | hsl(220, 15%, 18%) |
| Muted foreground | hsl(220, 10%, 55%) | #ebebeb                    | hsl(220, 10%, 55%) |
| Sidebar          | hsl(220, 15%, 6%)  | oklch(0.205 0 0)           | hsl(220, 15%, 6%)  |
| Sidebar accent   | hsl(220, 15%, 12%) | oklch(0.269 0 0)           | hsl(220, 15%, 12%) |

**Alternatives considered**:

- Keep oklch pure black — rejected, doesn't match prototype aesthetic
- Use oklch with blue hue — possible but HSL matches prototype exactly

## R2: Card Hover Glow Effect

**Decision**: CSS-only golden glow with transition on hover.

**Implementation pattern** (from prototype):

```css
.card-hover {
  transition:
    border-color 200ms,
    box-shadow 200ms;
}
.card-hover:hover {
  border-color: hsl(42, 100%, 50%, 0.3);
  box-shadow: 0 0 20px hsl(42, 100%, 50%, 0.15);
}
```

**Rationale**: Pure CSS approach is performant, no JS animation library needed. The golden glow reinforces the amber/gold accent throughout the UI.

**Alternatives considered**:

- Framer Motion / Motion glow — rejected, over-engineered for a CSS transition
- No glow, just border — rejected, doesn't match prototype premium feel

## R3: Chart Type Migration (Area + Gradients)

**Decision**: Keep Recharts, switch from simple AreaChart to AreaChart with SVG linear gradient fills.

**Rationale**: Recharts already supports `<defs>` with `<linearGradient>` inside `<AreaChart>`. No library change needed. The gradient fills add visual depth.

**Pattern** (from prototype):

```jsx
<defs>
  <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="hsl(42, 100%, 50%)" stopOpacity={0.3} />
    <stop offset="95%" stopColor="hsl(42, 100%, 50%)" stopOpacity={0} />
  </linearGradient>
</defs>
<Area fill="url(#grossGradient)" stroke="hsl(42, 100%, 50%)" />
```

**Key changes**:

- Add `<defs>` with gradient definitions
- Set `fill="url(#gradientId)"` on each Area
- Use `strokeWidth={2}` for cleaner lines
- CartesianGrid: `strokeDasharray="3 3"` with muted color
- Custom tooltip with styled container

**Alternatives considered**:

- Switch to Victory / Nivo — rejected, Recharts handles this natively
- Keep bar charts — rejected, area charts match prototype

## R4: Top Header Bar Architecture

**Decision**: Add a `DashboardHeader` component above the main content area, inside the dashboard layout.

**Prototype structure**:

- Sticky top, full width of content area (not overlapping sidebar)
- Left: brand logo (same as sidebar)
- Right: notification bell (Bell icon) + user avatar with dropdown
- Height: ~64px (h-16)
- Background: same as card with border-bottom and backdrop-blur

**Dropdown menu** (avatar click):

- Artist name + email
- Separator
- Profile link
- Settings link
- Separator
- Sign Out (navigates to landing)

**Rationale**: The header adds persistent global context without cluttering the sidebar. Notification bell and avatar are standard dashboard patterns.

**Alternatives considered**:

- Put avatar/notifications in sidebar — rejected, sidebar is for navigation
- No header, keep minimal — rejected, prototype explicitly has it

## R5: Stat Card Redesign

**Decision**: Redesign MetricCard to match prototype pattern with icon circle, value, and change badge.

**Prototype layout**:

```
┌──────────────────────────────────┐
│ [Title]           [Icon in circle]│
│                                   │
│ [Value]         [↑ +12.4%]       │
└──────────────────────────────────┘
```

**Key differences from current**:

- Icon: In a muted background circle (bg-muted, rounded), not amber
- Change badge: Separate pill with bg-success/10 text-success for positive
- Layout: Title top-left, icon top-right, value bottom-left, change bottom-right
- Staggered entrance: 0s, 0.05s, 0.1s, 0.15s delays

**Alternatives considered**:

- Keep current layout — rejected, prototype is cleaner

## R6: Semantic Badge Styling

**Decision**: Replace solid bg-color badges with tinted semantic styling.

**New pattern**:

| Status    | Current                 | New                                          |
| --------- | ----------------------- | -------------------------------------------- |
| Live      | bg-green-700 text-white | bg-success/10 text-success border-success/20 |
| Scheduled | bg-blue-600 text-white  | bg-primary/10 text-primary border-primary/20 |
| Draft     | bg-gray-600 text-white  | bg-muted text-muted-foreground               |
| Archived  | bg-gray-800 text-white  | bg-muted/50 text-muted-foreground            |

**Rationale**: Tinted backgrounds with matching text are more subtle and premium. Solid color badges look dated.

## R7: Sidebar Active State

**Decision**: Update active nav item styling to use accent background + primary icon color.

**Current**: `bg-primary/10 text-primary font-semibold`
**New**: `bg-sidebar-accent text-sidebar-accent-foreground` with icon `text-primary`
**Hover (inactive)**: `bg-sidebar-accent/50`

**Rationale**: Matches prototype exactly and provides clearer wayfinding.

## R8: New Translations Needed

**Decision**: Add new translation keys to all 4 locale files for header elements.

**New keys needed** (in `Common` or new `Header` namespace):

- `notifications`: "Notifications"
- `profile`: "Profile"
- `signOut`: "Sign Out"
- `artistName`: "Music Artist" (mock)
- `artistEmail`: "artist@example.com" (mock)

**Rationale**: All user-facing text must be i18n-aware per our architecture.

## R9: Release Upload Form Architecture

**Decision**: Use a shadcn Dialog modal on the Releases page with a multi-section form.

**Form structure**:

- **Section 1 — Release Type**: Toggle between Single and Album/EP (Tabs or radio)
- **Section 2 — Basic Info**: Title (required), Genre (select from predefined list), Explicit Content (switch), Cover Art (placeholder upload area), Release Date (date input), Price USD (number input, required)
- **Section 3 — Credits**: Featuring Artists (text input), Writers (text input), Producers (text input)
- **Section 4 — Direct-to-Fan Options**: Exclusive toggle (fans-only), Pre-sale toggle, Bundle toggle
- **Section 5 — Artist Notes**: Textarea for personal message to fans
- **Section 6 — Track List** (Album/EP only): Dynamic list with add/remove. Each track: order (auto), name (required), duration MM:SS, individual price USD

**On submit**: Validate → show congratulations dialog → reset form. No persistence.

**Rationale**: A Dialog modal keeps the user on the Releases page context. Tabs for release type allow clean switching without page navigation. All fields follow industry standard metadata patterns.

**Alternatives considered**:

- Separate /releases/new page — rejected, modal is simpler and stays in context
- Sheet (slide-over panel) — rejected, form has too many fields for a narrow panel
- Multi-step wizard — rejected, over-engineered for a demo form

## R10: Genre List and Music Industry Metadata

**Decision**: Use a predefined static genre list with essential-level metadata only.

**Genre list**: Pop, Rock, Hip-Hop, R&B, Electronic, Latin, Jazz, Classical, Country, Reggaeton, Indie, Alternative, Other

**Essential metadata fields**:

- Genre (from predefined list) — required
- Explicit Content flag (boolean switch)
- Credits: Featuring Artists, Writers, Producers (all optional text inputs)

**Not included** (future iteration):

- ISRC code, UPC/EAN
- Copyright holder, Label
- Subgenre
- Composer vs songwriter distinction

**Rationale**: Essential metadata is sufficient for a demo backstage. Advanced industry codes (ISRC, UPC) add complexity without demo value.

## R11: Direct-to-Fan Commerce Features

**Decision**: Three commerce toggles on the release form — Exclusive, Pre-sale, Bundle.

**Exclusive** (fans-only content):

- Toggle switch on the form
- When enabled, the release is marked as accessible only to active fans/buyers
- Display: badge on ReleaseCard when active ("EXCLUSIVE")

**Pre-sale**:

- Toggle switch on the form
- When enabled with a future release date, fans can pre-purchase
- Display: badge on ReleaseCard when active ("PRE-SALE")

**Bundle**:

- Toggle switch on the form
- When enabled, the release can be included in bundle deals at a discount
- No discount percentage configuration in this version

**Rationale**: These three options represent the core direct-to-fan value proposition — exclusive content drives fan loyalty, pre-sale generates early revenue, bundles increase average order value.

## R12: Release Upload Translations

**Decision**: Add new `ReleaseUpload` namespace to all 4 locale files.

**New keys needed**:

- Form labels: `addRelease`, `releaseType`, `single`, `albumEp`, `title`, `genre`, `explicitContent`, `coverArt`, `releaseDate`, `price`, `priceUsd`
- Credits: `credits`, `featuringArtists`, `writers`, `producers`
- Commerce: `exclusive`, `exclusiveDescription`, `preSale`, `preSaleDescription`, `bundle`, `bundleDescription`
- Tracks: `trackList`, `addTrack`, `removeTrack`, `trackName`, `duration`, `trackPrice`, `trackOrder`
- Notes: `artistNotes`, `artistNotesPlaceholder`
- Actions: `submit`, `cancel`
- Success: `congratulations`, `congratulationsMessage`
- Validation: `required`, `minOneTrack`, `invalidPrice`, `invalidDuration`

**Rationale**: All user-facing text must be i18n-aware per our architecture.

## R13: Settings Page Redesign Architecture

**Decision**: Redesign SettingsPageClient with 3 sections replacing the current 2-card layout.

**New layout**:

- **Card 1 — Artist Profile**: Avatar (clickeable → file picker, preview via `URL.createObjectURL()`), Display Name input, Email input, Bio textarea. Save button → success message.
- **Card 2 — Payout & Revenue**: Currency badge (USD, read-only), Payment Method select (PayPal, Stripe, Bank Transfer), Bank Info display (masked: \*\*\*\*1234), Total Earnings (computed from mock releases data). Save button → success message.
- **Card 3 — Language**: Language selector (existing functionality, extracted from removed Preferences card).

**Removed sections**:

- Theme selector (always dark, non-functional)
- Email Notifications toggle (no backend)

**Success feedback**: Use a simple inline success message state (no external toast library). Show "Changes saved" for 3 seconds then hide.

**Rationale**: Current Preferences card has non-functional elements. Replacing with artist-relevant sections makes Settings feel like a real backstage.

**Alternatives considered**:

- Add Sonner/react-hot-toast for toast — rejected, over-engineered for a mock
- Keep Preferences and add new cards — rejected, user explicitly wants to remove Preferences

## R14: Settings Translations Update

**Decision**: Restructure `Settings` i18n namespace — remove preference keys, add profile and payout keys.

**Keys to remove**: `preferences`, `emailNotifications`, `theme`, `themeLight`, `themeDark`, `themeSystem`, `selectTheme`

**New keys**:

- Profile: `artistProfile`, `avatar`, `changeAvatar`, `bio`, `bioPlaceholder`
- Payout: `payoutRevenue`, `currency`, `paymentMethod`, `paypal`, `stripe`, `bankTransfer`, `bankInfo`, `totalEarnings`, `maskedAccount`
- Feedback: `changesSaved`

**Rationale**: Translation keys must reflect the actual UI. Keeping unused keys is confusing.
