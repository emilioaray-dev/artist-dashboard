# Data Model: Dashboard UI/UX Redesign

**Branch**: `feature/004-dashboard-ui-ux` | **Date**: 2026-02-06

## Overview

This feature is primarily a visual/UX redesign. No new data entities are introduced. Existing data models remain unchanged. The changes affect presentation layer only.

## Affected Entities (Display Changes Only)

### MetricCard Display

Existing data shape (unchanged):

- `title`: string — Metric name
- `value`: string — Formatted metric value
- `prefix`: string — Currency symbol or prefix
- `change`: number — Percentage change
- `icon`: LucideIcon — Icon component

New display attributes (computed from existing data):

- `trendDirection`: "up" | "down" | "neutral" — derived from `change` value sign
- `trendColor`: "success" | "destructive" | "muted" — derived from direction

### Release Status Badges

Existing status enum (unchanged): `draft | scheduled | live | archived`

New display mapping:

- `live` → semantic green tint (bg-success/10 text-success)
- `scheduled` → semantic gold tint (bg-primary/10 text-primary)
- `draft` → muted grey
- `archived` → muted dim grey

### Chart Data

Existing chart data shapes (unchanged):

- Revenue: `{ date, gross, net, direct_to_fan, digital, physical, bundles }`
- Fan Growth: `{ date, total, active }`

New display attributes:

- Gradient definitions for each data series
- Area fill references via SVG gradient IDs

### User Profile (New — Mock Data)

Static mock data for header avatar dropdown:

- `name`: "Music Artist"
- `email`: "artist@example.com"
- `avatarUrl`: null (uses initials fallback)

No persistence — purely presentational.

### Release Upload Form (New — Form State Only)

Client-side form state for the release upload modal (no persistence):

**Common fields (both types)**:

- `releaseType`: "single" | "album_ep" — release format selector
- `title`: string — release title (required)
- `genre`: string — selected from predefined list (required)
- `explicitContent`: boolean — explicit content flag (default: false)
- `coverArt`: File | null — cover art file reference (mock, no actual upload)
- `releaseDate`: string — ISO date for release/pre-sale date
- `priceUsd`: number — price in USD (required, >= 0)
- `featuringArtists`: string — comma-separated featuring artist names
- `writers`: string — comma-separated writer names
- `producers`: string — comma-separated producer names
- `isExclusive`: boolean — fans-only content (default: false)
- `isPreSale`: boolean — available for pre-purchase (default: false)
- `isBundle`: boolean — can be included in bundles (default: false)
- `artistNotes`: string — personal message to fans (optional)

**Album/EP-specific fields**:

- `tracks`: Track[] — list of tracks (minimum 1 for album type)

**Track shape**:

- `order`: number — auto-incremented position (1-based)
- `name`: string — track name (required)
- `duration`: string — format "MM:SS" (optional)
- `priceUsd`: number — individual track price in USD (optional)

**Genre predefined list**:
Pop, Rock, Hip-Hop, R&B, Electronic, Latin, Jazz, Classical, Country, Reggaeton, Indie, Alternative, Other

No persistence — form state is managed in React component state. On submit, a success message is shown and the form resets.

### Settings Page (Redesigned — Form State Only)

Client-side form state for the redesigned settings page (no persistence):

**Artist Profile fields**:

- `avatarPreview`: string | null — blob URL from `URL.createObjectURL()` for selected image
- `displayName`: string — artist display name (default: "Music Artist")
- `email`: string — artist email (default: "artist@example.com")
- `bio`: string — artist biography/description (default: empty)

**Payout & Revenue fields**:

- `currency`: "USD" — read-only, always USD
- `paymentMethod`: "paypal" | "stripe" | "bank_transfer" — selected payment method (default: "paypal")
- `bankInfo`: string — masked bank info display only (mock: "\*\*\*\*1234")
- `totalEarnings`: number — computed from mock releases totalRevenue sum (read-only)

**Language**:

- Existing locale selector, no new state needed

No persistence — Save button triggers inline success message ("Changes saved").

## Design Token Changes

### Color Tokens (CSS Custom Properties)

| Token              | Old Value        | New Value          |
| ------------------ | ---------------- | ------------------ |
| --background       | oklch(0.145 0 0) | hsl(220, 15%, 8%)  |
| --surface          | #0a0a0a          | hsl(220, 15%, 10%) |
| --surface-elevated | #111111          | hsl(220, 15%, 12%) |
| --border           | #27272a          | hsl(220, 15%, 18%) |
| --muted-foreground | #ebebeb          | hsl(220, 10%, 55%) |
| --sidebar          | oklch(0.205 0 0) | hsl(220, 15%, 6%)  |

### New Tokens

| Token               | Value                             | Purpose                 |
| ------------------- | --------------------------------- | ----------------------- |
| --card-hover-border | hsl(42, 100%, 50%, 0.3)           | Card hover border color |
| --card-hover-glow   | 0 0 20px hsl(42, 100%, 50%, 0.15) | Card hover shadow       |
| --success           | hsl(142, 70%, 45%)                | Semantic success green  |
