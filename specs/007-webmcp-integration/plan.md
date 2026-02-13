# Implementation Plan: WebMCP Integration

**Branch**: `feature/006-webmcp-integration` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-webmcp-integration/spec.md`

## Summary

Integrate WebMCP (Web Model Context Protocol) into the artist dashboard to expose 9 structured tools (6 read-only data queries + 3 audio player controls) to AI agents via the `navigator.modelContext` browser API. Uses `@mcp-b/react-webmcp` hooks in Client Components mounted in the dashboard layout. No server-side changes required.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.3 + Next.js 16.1.6
**Primary Dependencies**: `@mcp-b/react-webmcp`, `@mcp-b/global` (polyfill), `zod` (already present via shadcn/ui)
**Storage**: N/A (reads from existing API routes and Zustand store)
**Testing**: Vitest (unit) + Playwright (E2E) with navigator.modelContext mock/polyfill
**Target Platform**: Chrome 146+ (Canary available now, stable ~March 2026), fallback via polyfill
**Project Type**: Web (Next.js App Router)
**Performance Goals**: Zero impact on SSR bundle; tool registration < 50ms client-side
**Constraints**: All WebMCP code must be "use client"; no server-side navigator access; max 50 tools per page (we use 9)
**Scale/Scope**: 9 tools, 4 tool component files, 1 provider, 1 type declaration file, test updates

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is unpopulated (template placeholders). No gates to evaluate. Proceeding with project-level conventions from CLAUDE.md:

| Convention | Status | Notes |
|---|---|---|
| shadcn/ui in ui/core/ unmodified | PASS | No shadcn changes needed |
| Constants from @/lib/constants | PASS | No new constants needed; tools reference existing ROUTES |
| "use client" for interactive code | PASS | All WebMCP code is client-only by design |
| Motion from motion/react | PASS | No animation changes |
| Import paths via @/ alias | PASS | All imports use @/ |
| Component placement conventions | PASS | New `components/webmcp/` folder for shared WebMCP components |
| Tests: vitest + playwright | PASS | Both unit and E2E tests planned |

## Project Structure

### Documentation (this feature)

```text
specs/007-webmcp-integration/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (tool schemas)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (tool definitions)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── webmcp/
│       ├── WebMCPProvider.tsx       # Mounts all tool components
│       └── tools/
│           ├── ReleasesTool.tsx     # get_releases, get_release_by_id
│           ├── SalesTool.tsx        # get_sales, get_revenue_summary
│           ├── EngagementTool.tsx   # get_engagement, get_top_fans
│           └── PlayerTool.tsx       # play_track, control_player, get_player_state
├── types/
│   └── webmcp.d.ts                 # TypeScript declarations for form attributes
└── app/
    └── [locale]/
        └── (dashboard)/
            └── layout.tsx          # Mount WebMCPProvider here (edit existing)

__tests__/
├── webmcp/
│   ├── tool-registration.test.tsx  # Unit: tools register correctly
│   └── tool-execution.test.tsx     # Unit: tools return correct data

e2e/
└── webmcp.spec.ts                  # E2E: tools discoverable on dashboard

vitest.setup.ts                     # Add navigator.modelContext mock
```

**Structure Decision**: WebMCP components go in `src/components/webmcp/` (shared across all dashboard routes via layout). This follows the project convention of promoting to `components/` when used in 2+ routes (the provider is in the shared dashboard layout).

## Complexity Tracking

No constitution violations. Feature is additive (new components, no modifications to existing logic). Dependencies are minimal (2 npm packages + existing zod).
