# Implementation Plan: WebMCP Discoverability & UX Improvements

**Branch**: `007-webmcp-discoverability` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-webmcp-discoverability/spec.md`

## Summary

Improve WebMCP discoverability by adding a `/.well-known/mcp.json` manifest and `<meta>` tag so AI agents can detect MCP support automatically. Remove confirmation dialogs from audio playback tools (`play_track`, `navigate_and_play`) to enable frictionless AI-driven interactions. Add a server-side MCP endpoint (`/api/mcp`) exposing read-only data tools for non-browser clients.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3 + Next.js 16.1.6
**Primary Dependencies**: `@mcp-b/react-webmcp` v1.1.1, `@mcp-b/global` v1.5.0, `next-intl` v4.x, `zod`, Zustand
**Storage**: N/A (uses existing API routes for data)
**Testing**: Vitest (unit tests), Playwright (E2E)
**Target Platform**: Web (browser + server-side via Next.js API routes)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Standard web app — manifest endpoint responds in <100ms
**Constraints**: Must work across all 4 locales (en, es, fr, pt); meta tag must be present on every page
**Scale/Scope**: 14 existing tools (10 dashboard + 4 landing); 3 API routes as data sources

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is a template with no project-specific gates defined. No violations to evaluate. **PASS**.

## Project Structure

### Documentation (this feature)

```text
specs/007-webmcp-discoverability/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── mcp-api.md       # Server-side MCP endpoint contract
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                          # ADD: <meta name="mcp-server"> tag
│   ├── .well-known/mcp.json/route.ts       # NEW: /.well-known/mcp.json API route
│   └── api/mcp/route.ts                    # NEW: Server-side MCP endpoint
├── components/webmcp/
│   ├── tools/PlayerTool.tsx                # MODIFY: Remove confirmation from play_track
│   └── LandingWebMCP.tsx                   # MODIFY: Remove confirmation from navigate_and_play
├── lib/
│   └── mcp-manifest.ts                    # NEW: Shared manifest data (tool definitions)
messages/
├── en.json                                 # MODIFY: Remove confirmation translation keys
├── es.json                                 # MODIFY: Remove confirmation translation keys
├── fr.json                                 # MODIFY: Remove confirmation translation keys
└── pt.json                                 # MODIFY: Remove confirmation translation keys

__tests__/
├── mcp-manifest.test.ts                    # NEW: Manifest structure tests
└── api/mcp.test.ts                         # NEW: Server-side endpoint tests
```

**Structure Decision**: All changes fit within the existing Next.js App Router structure. New files are minimal — a manifest data module, two API routes, and corresponding tests.
