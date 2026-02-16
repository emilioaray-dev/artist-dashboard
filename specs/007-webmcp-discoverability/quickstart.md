# Quickstart: WebMCP Discoverability & UX Improvements

**Feature**: 007-webmcp-discoverability
**Date**: 2026-02-16

## Prerequisites

- Node.js (LTS)
- Project dependencies installed (`npm install`)
- Dev server running (`npm run dev` on port 3000)

## What This Feature Changes

### 1. Confirmation Removal (P1)

**Files modified**:
- `src/components/webmcp/tools/PlayerTool.tsx` — Remove `globalThis.confirm()` from `play_track` handler
- `src/components/webmcp/LandingWebMCP.tsx` — Remove `globalThis.confirm()` from `navigate_and_play` handler
- `messages/{en,es,fr,pt}.json` — Remove unused confirmation translation keys

**How to verify**: Use the Chrome extension or browser console to invoke `play_track` — it should play immediately without a dialog.

### 2. Discovery Manifest (P2)

**Files added**:
- `src/lib/mcp-manifest.ts` — Shared tool definitions (single source of truth)
- `src/app/.well-known/mcp.json/route.ts` — API route serving the manifest

**Files modified**:
- `src/app/layout.tsx` — Add `<meta name="mcp-server">` tag

**How to verify**:
```bash
# Fetch the manifest
curl http://localhost:3000/.well-known/mcp.json | jq .

# Check meta tag in page source
curl -s http://localhost:3000 | grep "mcp-server"
```

### 3. Server-Side MCP Endpoint (P3)

**Files added**:
- `src/app/api/mcp/route.ts` — POST endpoint for server-side tool invocation

**How to verify**:
```bash
# Invoke a read-only tool
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"tool": "get_releases"}'

# Try a client-only tool (should return 403)
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"tool": "play_track", "input": {"releaseId": "rel_001"}}'
```

## Running Tests

```bash
# Unit tests
npm test

# Specific test files for this feature
npx vitest run __tests__/mcp-manifest.test.ts
npx vitest run __tests__/api/mcp.test.ts

# E2E tests
npx playwright test

# Lint
npm run lint

# Build
npm run build
```

## Key Design Decisions

1. **Manifest is dynamic** (route handler, not static file) — so tool definitions stay in sync with code
2. **Single source of truth** — `src/lib/mcp-manifest.ts` exports tool definitions used by both `.well-known` and `/api/mcp`
3. **Server endpoint is POST-only** — follows JSON-RPC convention, prevents caching of mutable operations
4. **Client-only tools clearly marked** — `serverAccessible: false` in manifest, 403 response from endpoint
