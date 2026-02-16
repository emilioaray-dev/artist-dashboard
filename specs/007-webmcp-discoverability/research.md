# Research: WebMCP Discoverability & UX Improvements

**Feature**: 007-webmcp-discoverability
**Date**: 2026-02-16

## R1: MCP Discovery Standard (`.well-known/mcp.json`)

**Decision**: Serve a `/.well-known/mcp.json` via a Next.js API route at `src/app/.well-known/mcp.json/route.ts`.

**Rationale**: There is no formal RFC for MCP discovery yet, but the `.well-known` pattern (RFC 8615) is the established convention for service discovery on the web (used by `apple-app-site-association`, `openid-configuration`, etc.). The WebMCP community is converging on `.well-known/mcp.json` as the standard path. Using a Next.js route handler (instead of a static file in `public/`) allows dynamic generation if tool definitions change.

**Alternatives considered**:
- Static file in `public/.well-known/mcp.json` — simpler but requires manual sync when tools change. Rejected because tool definitions should be single-source-of-truth.
- Custom endpoint `/api/mcp/discover` — works but doesn't follow the `.well-known` convention that agents will look for first.

## R2: MCP Meta Tag Format

**Decision**: Add `<meta name="mcp-server" content="/.well-known/mcp.json">` to the root layout metadata.

**Rationale**: A meta tag in `<head>` allows agents that parse HTML (without fetching additional endpoints) to detect MCP support. Pointing to the manifest URL lets agents know where to find the full tool listing. Next.js `metadata` export in `src/app/layout.tsx` makes this a single-line addition via the `other` property.

**Alternatives considered**:
- `<link rel="mcp-server">` — semantically correct for linking to a resource, but `<meta>` is simpler and more widely supported by parsers.
- Multiple meta tags per tool — too verbose, defeats the purpose of a manifest.

## R3: Confirmation Removal Strategy

**Decision**: Remove `globalThis.confirm()` calls from `play_track` (PlayerTool.tsx) and `navigate_and_play` (LandingWebMCP.tsx). Execute actions immediately.

**Rationale**: When a user explicitly asks an AI agent to "play this track", the intent is already expressed. A second confirmation dialog breaks the conversational flow and adds no security value — these are non-destructive, easily reversible actions (user can pause/stop anytime). The `control_player` tool already executes without confirmation.

**Impact**:
- Remove `globalThis.confirm()` calls from both handlers
- Remove unused translation keys: `playConfirmation`, `playDeclined`, `navigateAndPlayConfirmation`, `userDeclined` from all 4 locale files
- Update tool descriptions to remove "Requires user confirmation" text

**Alternatives considered**:
- Make confirmation configurable per-agent — over-engineered for current use case. Can be added later if needed.
- Keep confirmation for `navigate_and_play` only (since it navigates) — rejected because navigation is also user-initiated intent.

## R4: Server-Side MCP Endpoint Design

**Decision**: Create a single API route at `src/app/api/mcp/route.ts` that accepts POST requests with a JSON body specifying the tool name and input, executes read-only tools server-side, and returns results.

**Rationale**: A server-side endpoint enables non-browser clients (CLI tools, backend services, AI platforms) to invoke read-only data tools without needing a browser context. Using a simple JSON-RPC-like interface keeps it lightweight while being compatible with MCP transport patterns.

**Scope**: Only read-only tools are exposed server-side:
- `get_releases`, `get_release_by_id`
- `get_sales`, `get_revenue_summary`
- `get_engagement`, `get_top_fans`

Client-only tools (`play_track`, `control_player`, `navigate_and_play`, `get_player_state`) are rejected with a clear error.

**Alternatives considered**:
- Full SSE/Streamable HTTP MCP transport — significantly more complex, requires session management. Overkill for read-only data tools. Can be added in a future iteration.
- GraphQL endpoint — adds a dependency and complexity not justified for 6 tools.

## R5: Manifest Data Structure

**Decision**: Create a shared manifest module at `src/lib/mcp-manifest.ts` that exports the tool definitions as a typed object. Both the `.well-known/mcp.json` route and the `/api/mcp` route import from this single source of truth.

**Rationale**: Avoids duplication between the discovery manifest and the server-side endpoint's tool registry. Changes to tool definitions propagate automatically.

**Manifest schema**:
```json
{
  "name": "MUSIC Backstage",
  "description": "Artist dashboard with AI-accessible tools",
  "version": "1.0.0",
  "tools": {
    "dashboard": [...],
    "landing": [...]
  },
  "endpoint": "/api/mcp",
  "transport": "json-rpc"
}
```
