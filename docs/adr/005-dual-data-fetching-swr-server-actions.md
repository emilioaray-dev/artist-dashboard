# ADR-005: Dual Data Fetching — SWR for Client, Server Actions for SSR

**Status:** Accepted
**Date:** 2026-02-05
**Authors:** Celsius Aray

## Context

The dashboard has two rendering contexts with different data fetching needs:

1. **Server Components** (initial page load, SSG) — Need data at render time without client-side JavaScript.
2. **Client Components** (interactive charts, real-time updates) — Need data fetching with caching, revalidation, and optimistic UI.

Next.js 16 with App Router provides Server Actions and `unstable_cache` for server-side data fetching, but these cannot be called from Client Components for read operations (they're designed for mutations). Client Components need a separate fetching mechanism.

### Options Considered

1. **SWR only** — Simple but forces all components to be Client Components (no SSR benefit).
2. **Server Actions only** — Good for SSR but no client-side revalidation, deduplication, or optimistic updates.
3. **React Server Components `fetch()` + SWR for client** — Uses RSC cache for server, SWR for client. But requires duplicating fetching logic.
4. **Shared data service + dual fetching layer** — Single data access layer (`dataService`) consumed by both Server Actions (for SSR) and API Routes (for SWR client calls).

## Decision

Use **Option 4**: A shared `dataService` layer consumed by two fetching interfaces:

### Server-Side: `unstable_cache` + Server Actions

```
Server Component → getCachedReleases() → dataService.getReleases() → mock data
```

- `src/lib/actions.ts` exports cached server actions (`getCachedReleases`, `getCachedSales`, etc.)
- Each action wraps `dataService` calls with `unstable_cache` for ISR-style caching
- Cache tags (`releases`, `sales`, `fans`) enable targeted revalidation
- Server Components call these directly — no network round-trip

### Client-Side: SWR + API Routes

```
Client Component → useReleases() → SWR → fetch("/api/releases") → dataService.getReleases()
```

- `src/hooks/useApiData.ts` exports typed SWR hooks (`useReleases`, `useSales`, `useEngagement`)
- API Routes in `src/app/api/` serve as the HTTP interface for SWR
- `src/lib/swr-provider.tsx` configures global SWR behavior:
  - `revalidateOnFocus: false` (dashboard data doesn't change on tab switch)
  - `errorRetryCount: 3` with 5-second intervals
  - `dedupingInterval: 2000` (prevents duplicate requests within 2 seconds)

### Shared Layer: `dataService`

- `src/lib/data-service.ts` is the single source of truth for all data access
- Returns typed `ApiResponse<T>` objects with consistent error handling
- Currently backed by mock data; swapping to a real API only requires changing this layer

### When to Use Which

| Context                        | Method                | Example                   |
| ------------------------------ | --------------------- | ------------------------- |
| Server Component (SSG/SSR)     | `getCachedReleases()` | `HomePageStreaming.tsx`   |
| Client Component (interactive) | `useReleases()`       | `ReleasesPageContent.tsx` |
| API consumer (external)        | `GET /api/releases`   | Future mobile app         |

## Consequences

- **Positive:** Server Components get zero-JS data loading; Client Components get automatic revalidation and error recovery; the `dataService` layer makes the data source swappable without touching UI code; API Routes serve double duty as both SWR endpoints and a future public API.
- **Negative:** Three layers (actions, hooks, data service) add complexity; developers must choose the correct fetching method based on component type; `unstable_cache` API may change in future Next.js versions.
- **Trade-off:** The duplication between Server Actions and API Routes (both calling `dataService`) is intentional — it keeps the server and client rendering paths independent, which simplifies debugging and testing.

### Key Files

- `src/lib/data-service.ts` — Shared data access layer
- `src/lib/actions.ts` — Server Actions with `unstable_cache`
- `src/hooks/useApiData.ts` — Typed SWR hooks for Client Components
- `src/lib/swr-provider.tsx` — Global SWR configuration
- `src/app/api/{releases,sales,engagement}/route.ts` — API Route handlers
