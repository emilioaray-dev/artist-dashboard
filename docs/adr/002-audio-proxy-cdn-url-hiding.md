# ADR-002: Audio Proxy Pattern for CDN URL Hiding

**Status:** Accepted
**Date:** 2026-02-06
**Authors:** Celsius Aray

## Context

The dashboard streams CC BY-NC-SA licensed audio tracks from a Cloudflare R2 CDN. While the license permits personal use, we want to discourage casual downloading by preventing users from discovering the direct CDN URLs through browser DevTools (Network tab, page source, or JavaScript bundle inspection).

**Important limitation:** No client-side solution can prevent a determined user from capturing audio — the browser _must_ receive the raw audio data to play it. This is a mitigation, not a prevention.

### Options Considered

1. **Direct CDN URLs in client code** — Simplest, but URLs are trivially discoverable in page source, network tab, and JS bundles.
2. **Server-side proxy route** — CDN URLs exist only in server code; client sees `/api/audio/<id>`. Adds latency but hides origin.
3. **Signed/expiring URLs** — CDN generates time-limited tokens. Best protection but requires CDN-level configuration (R2 presigned URLs) and added complexity.
4. **DRM (Encrypted Media Extensions)** — Full protection but extremely complex, expensive, and hostile to CC-licensed content.

## Decision

Use **Option 2**: A Next.js API Route at `/api/audio/[id]` that:

1. Maps release IDs to CDN URLs via a server-only lookup (`src/lib/audio-urls.ts`)
2. Streams the audio response with anti-download headers:
   - `Content-Disposition: inline` (play, not save-as)
   - `Cache-Control: no-store, no-cache, must-revalidate`
   - `X-Content-Type-Options: nosniff`
3. Forwards `Range` headers for seeking support (HTTP 206 Partial Content)

The CDN base URL and per-track paths are **never** included in client bundles or mock data. All `audioUrl` fields in releases reference `/api/audio/rel_XXX`.

### Why Not Signed URLs?

Signed URLs (Option 3) would be the next escalation if needed. We opted against them now because:

- The content is CC-licensed, not commercially DRM-protected
- R2 presigned URL setup adds infrastructure complexity disproportionate to the threat model
- The proxy already eliminates the most common discovery vector (DevTools network tab showing CDN origin)

## Consequences

- **Positive:** CDN URLs are invisible to the client; switching CDN providers requires changing only `audio-urls.ts`; the proxy provides a natural point for future enhancements (rate limiting, auth checks, analytics).
- **Negative:** All audio traffic routes through the Next.js server, adding latency (~50-100ms) and consuming server bandwidth. For a production app with high traffic, a CDN-level solution (signed URLs or edge worker) would be more efficient.
- **Trade-off accepted:** We prioritize simplicity and URL hiding over optimal streaming performance, given this is a demo/portfolio application.

### Key Files

- `src/app/api/audio/[id]/route.ts` — Proxy route handler with Range support
- `src/lib/audio-urls.ts` — Server-only CDN URL mapping (never imported by client code)
- `src/__mocks__/releases.ts` — All `audioUrl` fields use `/api/audio/rel_XXX`
