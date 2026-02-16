# Tasks: WebMCP Integration

**Input**: Design documents from `/specs/007-webmcp-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/tools.json, quickstart.md

**Tests**: Included — NFR-2 in spec.md explicitly requires unit and E2E tests.

**Organization**: Tasks grouped by functional requirement (FR) from spec.md. FRs map to user stories:
- **US1** (FR-1 + FR-5): Setup, polyfill, provider scaffold, type declarations
- **US2** (FR-2): Read-only data tools (7 tools)
- **US3** (FR-3): Side-effect audio tools (2 tools)
- **US4** (NFR-2): Testing infrastructure and test coverage

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create project structure, type declarations

- [x] T001 Install npm dependencies: `npm install @mcp-b/react-webmcp @mcp-b/global zod`
- [x] T002 [P] Create WebMCP TypeScript type declarations in `src/types/webmcp.d.ts` — extend React form/input/select/textarea attributes with toolname, tooldescription, toolautosubmit, toolparamtitle, toolparamdescription (per data-model.md)
- [x] T003 [P] Create directory structure: `src/components/webmcp/tools/` (empty files for ReleasesTool, SalesTool, EngagementTool, PlayerTool)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: WebMCPProvider scaffold and dashboard layout integration — MUST complete before tool implementation

- [x] T004 Create `src/components/webmcp/WebMCPProvider.tsx` — "use client" component that imports and renders all 4 tool components (ReleasesTool, SalesTool, EngagementTool, PlayerTool). Initially render empty fragments until tools are implemented.
- [x] T005 Edit `src/app/[locale]/(dashboard)/layout.tsx` — import and mount `<WebMCPProvider />` inside the dashboard layout, alongside existing providers. Must NOT appear in landing page layout.

**Checkpoint**: Dashboard layout renders WebMCPProvider without errors. Build passes. No SSR errors.

---

## Phase 3: User Story 1 — Read-Only Data Tools (Priority: P1) MVP

**Goal**: AI agents can query releases, sales, engagement, fans, and revenue data via 7 read-only WebMCP tools.

**Independent Test**: Open Chrome 146+ DevTools console on `/overview`, run `navigator.modelContext.tools.get('get_releases').execute({})` and verify it returns release data.

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement `get_releases` and `get_release_by_id` tools in `src/components/webmcp/tools/ReleasesTool.tsx` — "use client", two `useWebMCP()` calls, fetch from `/api/releases`, Zod schemas per contracts/tools.json, `readOnlyHint: true`
- [x] T007 [P] [US1] Implement `get_sales` and `get_revenue_summary` tools in `src/components/webmcp/tools/SalesTool.tsx` — "use client", two `useWebMCP()` calls, fetch from `/api/sales?range=`, Zod schemas with range enum, `readOnlyHint: true`. get_revenue_summary fetches all 3 ranges via Promise.all
- [x] T008 [P] [US1] Implement `get_engagement` and `get_top_fans` tools in `src/components/webmcp/tools/EngagementTool.tsx` — "use client", two `useWebMCP()` calls, fetch from `/api/engagement`, get_top_fans slices topFans array by limit param, Zod schemas, `readOnlyHint: true`
- [x] T009 [US1] Implement `get_player_state` tool in `src/components/webmcp/tools/PlayerTool.tsx` — "use client", one `useWebMCP()` call, reads from `usePlayerStore.getState()`, returns snapshot of currentTrack/isPlaying/volume/etc, `readOnlyHint: true`. Leave play_track and control_player for US2.

**Checkpoint**: All 7 read-only tools registered. Navigating to any dashboard page shows tools in `navigator.modelContext`. Each tool returns correct data matching existing API responses.

---

## Phase 4: User Story 2 — Side-Effect Audio Tools (Priority: P2)

**Goal**: AI agents can play tracks (with user confirmation) and control audio playback.

**Independent Test**: In DevTools console, execute `navigator.modelContext.tools.get('play_track').execute({ releaseId: 'rel_001' })` — should trigger user confirmation dialog, then start playback.

### Implementation for User Story 2

- [x] T010 [US2] Add `play_track` tool to `src/components/webmcp/tools/PlayerTool.tsx` — uses `useWebMCP()` with `requestUserInteraction()` in handler to get user confirmation before calling `usePlayerStore.getState().play()`. Zod schema: `{ releaseId: z.string() }`
- [x] T011 [US2] Add `control_player` tool to `src/components/webmcp/tools/PlayerTool.tsx` — uses `useWebMCP()`, reads action enum (play/pause/next/previous/stop/toggle_shuffle) and optional volume, maps to Zustand store actions via switch statement. Zod schema per contracts/tools.json

**Checkpoint**: All 9 tools registered. play_track requests user interaction. control_player executes actions immediately. Audio player responds to tool invocations.

---

## Phase 5: User Story 3 — Testing (Priority: P3)

**Goal**: Unit tests verify tool registration and execution. E2E tests verify tools are discoverable on dashboard pages.

**Independent Test**: `npm test -- --grep webmcp` passes. `npx playwright test webmcp` passes.

### Implementation for User Story 3

- [x] T012 Add `navigator.modelContext` mock to `vitest.setup.ts` — Map-based mock with registerTool, unregisterTool, clearContext, provideContext methods, and executeTool test helper
- [x] T013 [P] [US3] Create `__tests__/webmcp/tool-registration.test.tsx` — test that rendering each tool component (ReleasesTool, SalesTool, EngagementTool, PlayerTool) registers the expected tool names in navigator.modelContext, verify annotations (readOnlyHint), verify cleanup on unmount
- [x] T014 [P] [US3] Create `__tests__/webmcp/tool-execution.test.tsx` — test that executing get_releases, get_sales (with range param), get_engagement, get_top_fans (with limit), get_player_state returns expected data shapes. Mock fetch and usePlayerStore. Test play_track calls requestUserInteraction.
- [x] T015 [US3] Create `e2e/webmcp.spec.ts` — E2E test that navigates to `/overview`, checks if `navigator.modelContext` exists (feature detect), if available: verify tool names are registered, execute get_releases and assert data structure, verify tools NOT registered on landing page `/`

**Checkpoint**: All tests pass. `npm test` and `npx playwright test` green. No regressions in existing tests.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, build validation, cleanup

- [x] T016 Run full build validation: `npm run build` — verify no SSR errors from WebMCP client components
- [x] T017 Run full lint: `npm run lint` — verify no ESLint errors in new files
- [x] T018 Run existing test suite: `npm test` — verify no regressions in existing tests
- [x] T019 Run quickstart.md validation: follow quickstart steps manually to verify setup guide is accurate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (npm install)
- **US1 Read-Only Tools (Phase 3)**: Depends on Phase 2 completion (T004, T005)
- **US2 Audio Tools (Phase 4)**: Depends on T009 (PlayerTool.tsx must exist)
- **US3 Testing (Phase 5)**: Depends on T012 (mock setup), then Phase 3+4 completion
- **Polish (Phase 6)**: Depends on all previous phases

### User Story Dependencies

- **US1 (Read-Only Tools)**: Independent — can start after Phase 2. This is the MVP.
- **US2 (Audio Tools)**: Depends on T009 (get_player_state creates PlayerTool.tsx). Can otherwise run independently.
- **US3 (Testing)**: Depends on T012 (mock) then tests can run against any completed tools.

### Within Each User Story

- T006, T007, T008 are fully parallel (different files)
- T009 creates PlayerTool.tsx which T010 and T011 extend
- T013 and T014 are parallel (different test files)
- T015 (E2E) should run after unit tests pass

### Parallel Opportunities

```
Phase 1: T002 || T003 (after T001)
Phase 3: T006 || T007 || T008 (all parallel — different files)
Phase 5: T013 || T014 (different test files)
```

---

## Parallel Example: User Story 1 (Read-Only Tools)

```bash
# After Phase 2 completes, launch all tool components in parallel:
Task: "Implement ReleasesTool in src/components/webmcp/tools/ReleasesTool.tsx"
Task: "Implement SalesTool in src/components/webmcp/tools/SalesTool.tsx"
Task: "Implement EngagementTool in src/components/webmcp/tools/EngagementTool.tsx"

# Then sequentially (depends on PlayerTool.tsx existing):
Task: "Implement get_player_state in src/components/webmcp/tools/PlayerTool.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install deps, types, dirs)
2. Complete Phase 2: Foundational (provider + layout mount)
3. Complete Phase 3: US1 Read-Only Tools (7 tools)
4. **STOP and VALIDATE**: Test 7 read-only tools in Chrome DevTools
5. Deploy/demo if ready — agents can already query all dashboard data

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (7 read-only tools) → Test → Deploy (MVP!)
3. Add US2 (2 audio tools) → Test → Deploy (full tool set)
4. Add US3 (testing) → Verify CI → Deploy (production-ready)
5. Polish → Final validation

---

## Notes

- All WebMCP code MUST be "use client" — navigator does not exist on server
- Tool components return `null` — they render nothing, only register tools
- `@mcp-b/global` polyfill is pulled in transitively by `@mcp-b/react-webmcp`
- Zod `^3.25.0` needed as peer dep — not currently in project
- 9 total tools = well within the 50-tool-per-page WebMCP recommendation
- Existing API routes, Zustand store, and types are reused — no new data layer needed
