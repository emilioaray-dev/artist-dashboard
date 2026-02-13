# Quickstart: WebMCP Integration

**Feature**: 007-webmcp-integration | **Date**: 2026-02-12

---

## Prerequisites

- Node.js >= 18
- Chrome 146+ (Canary) with flag `Experimental Web Platform Features` enabled
- Or: any modern browser (polyfill provides fallback)

## Setup

### 1. Install dependencies

```bash
npm install @mcp-b/react-webmcp @mcp-b/global zod
```

### 2. Create type declarations

Create `src/types/webmcp.d.ts` for declarative form attribute types (TypeScript only).

### 3. Create tool components

Create one component per domain in `src/components/webmcp/tools/`:

- `ReleasesTool.tsx` — get_releases, get_release_by_id
- `SalesTool.tsx` — get_sales, get_revenue_summary
- `EngagementTool.tsx` — get_engagement, get_top_fans
- `PlayerTool.tsx` — play_track, control_player, get_player_state

Each component is `"use client"`, calls `useWebMCP()`, and returns `null`.

### 4. Create provider

Create `src/components/webmcp/WebMCPProvider.tsx` that mounts all tool components:

```tsx
'use client';
import { ReleasesTool } from './tools/ReleasesTool';
import { SalesTool } from './tools/SalesTool';
import { EngagementTool } from './tools/EngagementTool';
import { PlayerTool } from './tools/PlayerTool';

export function WebMCPProvider() {
  return (
    <>
      <ReleasesTool />
      <SalesTool />
      <EngagementTool />
      <PlayerTool />
    </>
  );
}
```

### 5. Mount in dashboard layout

Add `<WebMCPProvider />` to `src/app/[locale]/(dashboard)/layout.tsx`.

### 6. Add test mock

Add `navigator.modelContext` mock to `vitest.setup.ts`.

## Verification

### In browser (Chrome 146+)

1. Start dev server: `npm run dev`
2. Open Chrome Canary → `chrome://flags` → enable "Experimental Web Platform Features"
3. Navigate to `http://localhost:3000/overview`
4. Open DevTools → Console:

```javascript
// Check if tools are registered
navigator.modelContext.tools // Map of registered tools

// Execute a tool manually
const tool = navigator.modelContext.tools.get('get_releases');
const result = await tool.execute({}, { requestUserInteraction: (cb) => cb() });
console.log(result);
```

### Unit tests

```bash
npm test -- --grep webmcp
```

### E2E tests

```bash
npx playwright test webmcp
```

## Tool Summary

| Tool | Type | What it does |
|---|---|---|
| `get_releases` | Read | All releases with sales data |
| `get_release_by_id` | Read | Single release by ID |
| `get_sales` | Read | Sales for 7d/30d/90d |
| `get_engagement` | Read | Fan engagement metrics |
| `get_top_fans` | Read | Top fans by spending |
| `get_revenue_summary` | Read | Revenue across all periods |
| `get_player_state` | Read | Audio player state |
| `play_track` | Write | Play track (user confirms) |
| `control_player` | Write | Play/pause/next/prev/stop |
