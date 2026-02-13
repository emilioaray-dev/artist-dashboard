# Data Model: WebMCP Integration

**Feature**: 007-webmcp-integration | **Date**: 2026-02-12

---

## Entities

### WebMCPTool (registration unit)

Each tool registered via `navigator.modelContext.registerTool()`:

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | Unique identifier (e.g., "get_releases") |
| description | string | Yes | Natural language description for AI agents |
| inputSchema | ZodSchema | No | Zod schema defining accepted parameters |
| handler | async function | Yes | Executes tool logic, returns data |
| annotations | ToolAnnotations | No | Hints for agent behavior |

### ToolAnnotations

| Field | Type | Default | Description |
|---|---|---|---|
| readOnlyHint | boolean | false | No side effects — safe to call anytime |
| idempotentHint | boolean | false | Same input always produces same output |
| destructiveHint | boolean | false | May delete or permanently modify data |

### ToolState (per tool, managed by useWebMCP)

| Field | Type | Description |
|---|---|---|
| isExecuting | boolean | True while handler is running |
| lastResult | T \| null | Last successful return value |
| error | Error \| null | Last execution error |

---

## Tool Registry (9 tools)

### Read-Only Tools (7)

| Tool Name | Domain | Input Schema | Output Type | Source |
|---|---|---|---|---|
| get_releases | Releases | none | ApiResponse\<Release[]\> | GET /api/releases |
| get_release_by_id | Releases | { id: string } | Release \| { error } | GET /api/releases + filter |
| get_sales | Sales | { range: "7d"\|"30d"\|"90d" } | ApiResponse\<SalesSummary\> | GET /api/sales?range= |
| get_engagement | Fans | none | ApiResponse\<EngagementMetrics\> | GET /api/engagement |
| get_top_fans | Fans | { limit?: number } | Fan[] | GET /api/engagement + slice |
| get_revenue_summary | Sales | none | { 7d, 30d, 90d } | GET /api/sales x3 |
| get_player_state | Audio | none | PlayerSnapshot | Zustand store |

### Side-Effect Tools (2)

| Tool Name | Domain | Input Schema | Output Type | Source | Confirmation |
|---|---|---|---|---|---|
| play_track | Audio | { releaseId: string } | { success, playing } | Zustand store | requestUserInteraction |
| control_player | Audio | { action: enum, volume?: number } | { success, action, isPlaying } | Zustand store | none |

---

## Data Flow

```
AI Agent (Chrome 146+)
    │
    ▼
navigator.modelContext
    │
    ▼
useWebMCP hook (React)
    │
    ├── Read-only tools ──► fetch('/api/...') ──► API Routes ──► DataService ──► Mock Data
    │
    └── Player tools ──► usePlayerStore.getState() ──► Zustand Store ──► HTMLAudioElement
```

---

## Type Declarations (new file)

```typescript
// src/types/webmcp.d.ts
// Extends React's JSX types for declarative WebMCP form attributes

declare module 'react' {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string;
  }
  interface InputHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
  interface SelectHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
  interface TextareaHTMLAttributes<T> {
    toolparamtitle?: string;
    toolparamdescription?: string;
  }
}
```

---

## Relationships to Existing Types

All tool outputs reuse existing types from `src/types/index.ts`:

- `Release` — used by get_releases, get_release_by_id
- `SalesSummary`, `DailySales` — used by get_sales, get_revenue_summary
- `EngagementMetrics`, `FanData` — used by get_engagement
- `Fan` — used by get_top_fans
- `ApiResponse<T>` — wraps all API responses
- `Channel` ("direct_to_fan" | "digital" | "physical" | "bundles") — in sales data
- `Trend` ("up" | "down" | "stable") — in engagement data

No new domain types needed. Only `ToolAnnotations` and `ToolState` are new (provided by `@mcp-b/react-webmcp`).
