# Research: WebMCP Integration

**Feature**: 007-webmcp-integration | **Date**: 2026-02-12

---

## R1: @mcp-b/react-webmcp Compatibility

**Decision**: Use `@mcp-b/react-webmcp@1.1.1`

**Rationale**:
- Peer dependency: `react ^17.0.0 || ^18.0.0 || ^19.0.0` — compatible with our React 19.2.3
- Peer dependency: `zod ^3.25.0` — needs to be added (not currently in project)
- ESM module with TypeScript declarations
- MIT license
- Provides `useWebMCP()` and `useWebMCPContext()` hooks

**Alternatives considered**:
- Vanilla `navigator.modelContext.registerTool()` — more boilerplate, no auto-cleanup on unmount, no Zod integration
- `@mcp-b/global` alone — no React lifecycle management

---

## R2: @mcp-b/global Polyfill

**Decision**: Use `@mcp-b/global@1.5.0`

**Rationale**:
- Polyfills `navigator.modelContext` for browsers without native support
- Peer dependency: `zod >=3.25.76 <4 || >=4.1 <5`
- Node >= 18 required (project already on Node 18+)
- Has IIFE browser build for CDN usage
- Includes Vitest test utilities
- Transitive dependency of `@mcp-b/react-webmcp` (workspace reference)

**Alternatives considered**:
- No polyfill (native only) — limits to Chrome 146 Canary users only; too restrictive
- CDN script tag — harder to manage in Next.js, no tree-shaking

---

## R3: Zod Dependency

**Decision**: Add `zod@^3.25.0` as a dependency

**Rationale**:
- Required as peer dep by both `@mcp-b/react-webmcp` and `@mcp-b/global`
- NOT currently in project (shadcn/ui does not depend on zod directly)
- Zod is used for input schema validation in `useWebMCP()` hook
- Lightweight (~13KB gzipped), tree-shakeable

**Alternatives considered**:
- JSON Schema objects directly — loses type inference, no runtime validation
- Not using schemas — `useWebMCP` requires Zod schemas for inputSchema parameter

---

## R4: Client-Side Only Architecture

**Decision**: All WebMCP code in Client Components, mounted via dashboard layout

**Rationale**:
- `navigator` does not exist in Node.js / server-side rendering
- `useWebMCP()` uses React hooks (useEffect for registration/cleanup)
- Dashboard layout already wraps all dashboard pages
- Landing page excluded (no tool registration needed there)

**Alternatives considered**:
- Declarative form attributes on Server Components — works for forms but can't cover API queries or Zustand store access
- Script tag in `<head>` — no React lifecycle, no cleanup, harder to test

---

## R5: Tool Cleanup on Unmount

**Decision**: Rely on `useWebMCP` hook's built-in cleanup (useEffect return)

**Rationale**:
- `@mcp-b/react-webmcp` calls `navigator.modelContext.unregisterTool()` on component unmount
- Since WebMCPProvider is in the dashboard layout (persists across dashboard navigation), tools stay registered
- If user navigates to landing page, layout unmounts → tools are cleaned up automatically

**Alternatives considered**:
- Manual cleanup in layout effect — redundant with hook behavior
- Never cleanup — could leak tools if layout changes

---

## R6: Testing Strategy

**Decision**: Mock `navigator.modelContext` in vitest.setup.ts; polyfill flag in Playwright config

**Rationale**:
- Vitest runs in jsdom which has no `navigator.modelContext`
- A simple mock Map-based implementation covers registerTool/unregisterTool/clearContext
- Playwright can enable Chrome experimental features via launch args
- `@mcp-b/global` has a testing module that could be used but a custom mock is simpler for unit tests

**Alternatives considered**:
- Import `@mcp-b/global/testing` in vitest setup — adds dependency in test path, may conflict with jsdom
- Skip testing — unacceptable given project's testing standards

---

## R7: Bundle Impact

**Decision**: Acceptable — all client-side, code-split by layout

**Rationale**:
- `@mcp-b/react-webmcp` is lightweight (hooks + Zod schemas)
- `@mcp-b/global` polyfill only loaded client-side
- Next.js automatically code-splits by route/layout — WebMCPProvider only loads on dashboard pages
- No SSR bundle impact

**Alternatives considered**:
- Dynamic import WebMCPProvider — possible but unnecessary since it's already scoped to dashboard layout
- Lazy load individual tools — over-engineering for 9 small components
