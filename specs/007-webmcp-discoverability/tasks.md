# Tasks: WebMCP Discoverability & UX Improvements

**Input**: Design documents from `/specs/007-webmcp-discoverability/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/mcp-api.md, quickstart.md

**Tests**: Not explicitly requested in spec. Test tasks omitted.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the shared MCP manifest module that US2 and US3 depend on.

- [ ] T001 Create MCP tool definitions module at src/lib/mcp-manifest.ts — export typed tool definitions for all 14 tools with name, description, inputSchema (JSON Schema), readOnly, serverAccessible, and context (dashboard/landing) fields per contracts/mcp-api.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No blocking prerequisites needed. Existing project structure, API routes, and WebMCP integration are already in place.

**⚠️ CRITICAL**: T001 must be complete before US2 and US3 phases can begin. US1 has no dependency on T001.

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 — Frictionless Audio Playback (Priority: P1) 🎯 MVP

**Goal**: Remove confirmation dialogs from `play_track` and `navigate_and_play` so AI agents can trigger playback immediately.

**Independent Test**: Invoke `play_track` via Chrome extension or browser console — playback starts without any `confirm()` dialog.

### Implementation for User Story 1

- [ ] T002 [P] [US1] Remove `globalThis.confirm()` call and cancelled-response branch from `play_track` handler in src/components/webmcp/tools/PlayerTool.tsx — execute `usePlayerStore.getState().play()` directly. Update tool description to remove "Requires user confirmation" text.
- [ ] T003 [P] [US1] Remove `globalThis.confirm()` call and cancelled-response branch from `navigate_and_play` handler in src/components/webmcp/LandingWebMCP.tsx — execute navigation directly. Update tool description to remove "Requires user confirmation before navigating" text.
- [ ] T004 [P] [US1] Remove unused confirmation translation keys from messages/en.json — delete `playConfirmation`, `playDeclined`, `navigateAndPlayConfirmation`, `userDeclined` from the `WebMCP` namespace.
- [ ] T005 [P] [US1] Remove unused confirmation translation keys from messages/es.json — same keys as T004.
- [ ] T006 [P] [US1] Remove unused confirmation translation keys from messages/fr.json — same keys as T004.
- [ ] T007 [P] [US1] Remove unused confirmation translation keys from messages/pt.json — same keys as T004.
- [ ] T008 [US1] Remove `useTranslations` import from src/components/webmcp/tools/PlayerTool.tsx if no remaining translation usage after T002. Clean up unused `t` variable.
- [ ] T009 [US1] Verify build passes and existing WebMCP E2E/unit tests still pass after confirmation removal — run `npm run build && npm test`.

**Checkpoint**: Audio playback via AI agent works without confirmation dialogs. US1 is independently testable.

---

## Phase 4: User Story 2 — AI Agent Discovery (Priority: P2)

**Goal**: Add `/.well-known/mcp.json` manifest and `<meta name="mcp-server">` tag so AI agents can detect MCP support automatically.

**Independent Test**: `curl http://localhost:3000/.well-known/mcp.json` returns valid JSON with all 14 tools. Page source contains `<meta name="mcp-server">`.

### Implementation for User Story 2

- [ ] T010 [US2] Create API route handler at src/app/.well-known/mcp.json/route.ts — import tool definitions from src/lib/mcp-manifest.ts, return JSON response with `Content-Type: application/json` and CORS headers. Structure per contracts/mcp-api.md manifest schema.
- [ ] T011 [US2] Add `<meta name="mcp-server" content="/.well-known/mcp.json">` to src/app/layout.tsx — add to the `metadata` export using the `other` property: `other: { "mcp-server": "/.well-known/mcp.json" }`.
- [ ] T012 [US2] Verify manifest endpoint works — run `npm run build` and confirm `/.well-known/mcp.json` route is generated. Verify meta tag appears in rendered HTML.

**Checkpoint**: AI agents can discover MCP tools via `.well-known/mcp.json` and `<meta>` tag. US2 is independently testable.

---

## Phase 5: User Story 3 — Server-Side MCP Endpoint (Priority: P3)

**Goal**: Expose read-only data tools via a POST `/api/mcp` endpoint for non-browser clients.

**Independent Test**: `curl -X POST http://localhost:3000/api/mcp -H "Content-Type: application/json" -d '{"tool":"get_releases"}'` returns release data. Client-only tools return 403.

### Implementation for User Story 3

- [ ] T013 [US3] Create server-side MCP route handler at src/app/api/mcp/route.ts — implement POST handler that: (1) parses `{tool, input}` from request body, (2) validates tool exists in manifest from src/lib/mcp-manifest.ts, (3) rejects client-only tools with 403 and `CLIENT_ONLY` error code, (4) executes read-only tools by calling the corresponding API routes internally (`/api/releases`, `/api/sales`, `/api/engagement`), (5) returns `{success, data}` or `{success, error, code}` per contracts/mcp-api.md.
- [ ] T014 [US3] Implement tool execution dispatch in src/app/api/mcp/route.ts — map each server-accessible tool name to its data-fetching logic: `get_releases` → fetch `/api/releases`, `get_release_by_id` → fetch `/api/releases` + filter, `get_sales` → fetch `/api/sales?range=`, `get_revenue_summary` → fetch all 3 ranges, `get_engagement` → fetch `/api/engagement`, `get_top_fans` → fetch `/api/engagement` + slice, `search_release` → fetch `/api/releases` + search, `get_available_locales` → return static locale list, `get_locale_change_info` → return static instructions.
- [ ] T015 [US3] Verify server-side endpoint works — run `npm run build` and test with curl commands from quickstart.md. Verify read-only tools return data and client-only tools return 403.

**Checkpoint**: Non-browser clients can invoke read-only tools via `/api/mcp`. US3 is independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup across all user stories.

- [ ] T016 Run full test suite (`npm test && npm run lint && npm run build`) to verify no regressions across all changes.
- [ ] T017 Run quickstart.md validation — execute all verification commands from specs/007-webmcp-discoverability/quickstart.md.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001)
- **US1 (Phase 3)**: No dependency on T001 — can start in parallel with Phase 1
- **US2 (Phase 4)**: Depends on T001 (manifest module)
- **US3 (Phase 5)**: Depends on T001 (manifest module)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately — no dependency on other stories or T001
- **User Story 2 (P2)**: Depends on T001 only — independent from US1 and US3
- **User Story 3 (P3)**: Depends on T001 only — independent from US1 and US2

### Within Each User Story

- Models/modules before route handlers
- Route handlers before verification
- Verification as final step per story

### Parallel Opportunities

- T002, T003, T004, T005, T006, T007 can ALL run in parallel (different files)
- US1 (Phase 3) can run in parallel with T001 (Phase 1)
- US2 and US3 can run in parallel after T001 completes
- T010, T011 can run in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tasks in parallel (all touch different files):
Task: "T002 — Remove confirm() from PlayerTool.tsx"
Task: "T003 — Remove confirm() from LandingWebMCP.tsx"
Task: "T004 — Clean en.json"
Task: "T005 — Clean es.json"
Task: "T006 — Clean fr.json"
Task: "T007 — Clean pt.json"

# Then sequentially:
Task: "T008 — Clean unused imports in PlayerTool.tsx"
Task: "T009 — Verify build and tests"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: US1 (T002–T009) — remove confirmations
2. **STOP and VALIDATE**: Test playback via AI agent — no dialogs
3. Deploy if ready — immediate UX improvement

### Incremental Delivery

1. US1 → Frictionless playback (immediate value, no new files)
2. T001 → Shared manifest module (enables US2 + US3)
3. US2 → Discovery manifest + meta tag (broadens reach)
4. US3 → Server-side endpoint (enables non-browser clients)
5. Polish → Final validation

### Optimal Execution (Single Developer)

1. Start US1 in parallel with T001 (no dependency between them)
2. After T001 completes → US2 and US3 sequentially
3. Polish after all stories complete

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each phase checkpoint
- T004–T007 (translation cleanup) are nearly identical — can be batched in one commit
- T013–T014 are logically one task split for clarity — implement together in a single file
