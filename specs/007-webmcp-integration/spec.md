# Feature Specification: WebMCP Integration

**Feature ID**: 007
**Branch**: `feature/006-webmcp-integration`
**Date**: 2026-02-12
**Status**: Draft

## Problem Statement

AI agents currently interact with web applications by scraping DOM, simulating clicks, and parsing unstructured HTML. This is brittle, slow, and error-prone. The artist dashboard has a rich, well-typed API surface (releases, sales, engagement, audio) that could be directly exposed to AI agents via the new WebMCP browser standard.

## Goal

Integrate WebMCP (Web Model Context Protocol) into the artist dashboard so AI agents running in Chrome 146+ can discover and invoke structured tools to query releases, sales analytics, fan engagement metrics, and control audio playback — without DOM scraping.

## Functional Requirements

### FR-1: Tool Registration
- Register 9 WebMCP tools when the dashboard loads in a supported browser
- Tools must be available on all dashboard pages (not just overview)
- Feature-detect `navigator.modelContext` before registration; gracefully skip if unsupported

### FR-2: Read-Only Data Tools
- `get_releases` — returns all releases with sales/revenue data
- `get_release_by_id` — returns a single release by ID
- `get_sales` — returns sales analytics for a time range (7d, 30d, 90d)
- `get_engagement` — returns fan engagement metrics
- `get_top_fans` — returns top fans ranked by spending
- `get_revenue_summary` — returns revenue comparison across all time ranges
- `get_player_state` — returns current audio player state
- All read-only tools must have `readOnlyHint: true` annotation

### FR-3: Side-Effect Tools
- `play_track` — plays a music track by release ID; must use `requestUserInteraction()` for user confirmation
- `control_player` — controls audio playback (play/pause/next/previous/stop/shuffle/volume)

### FR-4: TypeScript Type Safety
- Add WebMCP type declarations for non-standard HTML form attributes (`toolname`, `tooldescription`, etc.)
- All tool handlers must be properly typed with Zod schemas

### FR-5: Polyfill Support
- Include `@mcp-b/global` polyfill so the feature works even in browsers without native WebMCP support
- Polyfill must be loaded client-side only

## Non-Functional Requirements

### NFR-1: Performance
- Tool registration must not block page rendering (async, client-side only)
- No increase in server-side bundle; all WebMCP code is client-only
- Tool execution should not exceed existing API response times

### NFR-2: Testing
- Unit tests for tool registration and execution using Vitest with navigator.modelContext mock
- E2E tests verifying tools are registered on dashboard pages
- Polyfill mock in vitest.setup.ts

### NFR-3: Architecture
- WebMCP components in `src/components/webmcp/`
- One tool component per domain: ReleasesTool, SalesTool, EngagementTool, PlayerTool
- Single WebMCPProvider component that mounts all tool components
- Provider mounted in dashboard layout (not landing page)

## Out of Scope

- MCP server-side (Anthropic MCP) integration
- `.well-known/mcp.json` server card (spec not finalized for WebMCP)
- Declarative form annotations (can be added later)
- McpClientProvider for consuming external MCP servers

## Dependencies

- `@mcp-b/react-webmcp` — React hooks for WebMCP
- `@mcp-b/global` — polyfill for navigator.modelContext
- `zod` — already in project via shadcn/ui (verify)

## Success Criteria

1. AI agent in Chrome 146+ can navigate to the dashboard and discover 9 registered tools
2. All read-only tools return correct data matching existing API responses
3. play_track requests user confirmation before starting playback
4. No regressions: existing tests pass, build succeeds, no SSR errors
5. Tools are not registered on the landing page (only dashboard)
