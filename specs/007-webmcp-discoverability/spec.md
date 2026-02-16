# Feature Specification: WebMCP Discoverability & UX Improvements

**Feature Branch**: `007-webmcp-discoverability`
**Created**: 2026-02-16
**Status**: Draft
**Input**: Improve WebMCP discoverability for AI agents and remove unnecessary confirmation prompts for audio playback actions.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Frictionless Audio Playback via AI Agent (Priority: P1)

An artist using an AI agent (e.g., Claude via Chrome extension) asks to play a track. The agent invokes the `play_track` or `control_player` tool and the track begins playing immediately without requiring the user to click a confirmation dialog. The same applies to the `navigate_and_play` tool on the landing page — the agent navigates to the dashboard and starts playback in one seamless action.

**Why this priority**: Confirmation dialogs on playback actions create friction that defeats the purpose of AI-assisted interaction. Users who explicitly ask an AI to "play this song" have already expressed intent — a second confirmation adds no value and breaks the conversational flow.

**Independent Test**: Can be fully tested by asking an AI agent to play a track and verifying playback starts immediately without any browser confirmation dialog.

**Acceptance Scenarios**:

1. **Given** the dashboard is open with tracks loaded, **When** an AI agent invokes `play_track` with a valid release ID, **Then** the track begins playing immediately without any confirmation dialog.
2. **Given** the landing page is open, **When** an AI agent invokes `navigate_and_play` with a valid release ID, **Then** the browser navigates to the dashboard and playback starts without any confirmation dialog.
3. **Given** the dashboard is open with a track playing, **When** an AI agent invokes `control_player` with action "pause", **Then** playback pauses immediately.

---

### User Story 2 - AI Agent Discovers MCP Support Automatically (Priority: P2)

An AI agent or automated tool visits the site and needs to determine whether MCP tools are available. The agent fetches `/.well-known/mcp.json` and receives a structured manifest listing all available tools, their descriptions, and how to access them. Alternatively, the agent reads the page HTML and finds a `<meta>` tag indicating MCP support.

**Why this priority**: Without discoverability, AI agents can only find WebMCP tools by injecting JavaScript into the page — a method limited to browser extensions. A standardized discovery mechanism opens the door to broader AI integration.

**Independent Test**: Can be tested by fetching `/.well-known/mcp.json` and verifying it returns valid JSON describing available tools, or by checking the page source for an MCP meta tag.

**Acceptance Scenarios**:

1. **Given** any page on the site is loaded, **When** an agent fetches `/.well-known/mcp.json`, **Then** it receives a valid JSON response listing available tool categories and their descriptions.
2. **Given** any page on the site is loaded, **When** an agent inspects the HTML `<head>`, **Then** it finds a `<meta>` tag indicating MCP support is available.
3. **Given** the manifest is fetched, **When** the agent reads the tools section, **Then** each tool has a name, description, and input schema reference.

---

### User Story 3 - Server-Side MCP Endpoint for Non-Browser Clients (Priority: P3)

A developer or AI platform wants to interact with the artist dashboard's MCP tools programmatically, without a browser. They connect to a server-side MCP endpoint that exposes read-only data tools (releases, sales, engagement) over a standard protocol, enabling integrations beyond the Chrome extension.

**Why this priority**: While client-side WebMCP serves browser-based AI agents well, a server-side endpoint opens the platform to CLI tools, backend services, and AI platforms that operate without a browser context. This is a forward-looking investment.

**Independent Test**: Can be tested by sending a request to the server-side MCP endpoint and receiving a valid response with tool listings or tool execution results.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** a client sends a discovery request to the MCP endpoint, **Then** it receives a list of available read-only tools.
2. **Given** the MCP endpoint is available, **When** a client invokes `get_releases`, **Then** it receives the same release data as the client-side tool.
3. **Given** a client attempts to invoke a write action (e.g., `play_track`) via the server endpoint, **Then** the request is rejected since playback is a client-side-only capability.

---

### Edge Cases

- What happens when `/.well-known/mcp.json` is requested with an unsupported Accept header? The server returns JSON regardless with the correct `Content-Type`.
- What happens when an AI agent invokes `play_track` with an invalid release ID after confirmation removal? The tool returns an error message indicating the track was not found, same as before.
- What happens when the server-side MCP endpoint receives a request for a client-only tool? It returns a clear error indicating the tool is only available in the browser context.
- What happens when the site is deployed to a new domain? The `.well-known/mcp.json` and meta tags remain functional since they use relative paths.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Audio playback tools (`play_track`, `navigate_and_play`) MUST execute immediately when invoked by an AI agent without displaying a confirmation dialog to the user.
- **FR-002**: The `control_player` tool MUST continue to execute immediately (no change from current behavior).
- **FR-003**: The site MUST serve a `/.well-known/mcp.json` manifest file that describes all available MCP tools, grouped by context (dashboard vs. landing).
- **FR-004**: Every page MUST include a `<meta>` tag in the HTML `<head>` that signals MCP tool availability to agents.
- **FR-005**: The `/.well-known/mcp.json` manifest MUST include for each tool: name, description, input schema summary, and whether it requires browser context.
- **FR-006**: The site MUST expose a server-side MCP endpoint that allows non-browser clients to invoke read-only data tools (releases, sales, engagement, fans).
- **FR-007**: The server-side MCP endpoint MUST reject requests to invoke client-only tools (playback, navigation) with a clear error message.
- **FR-008**: Confirmation prompt translation keys in all locale files MUST be removed or repurposed to avoid dead code.

### Key Entities

- **MCP Manifest**: A JSON document describing available tools, their categories (dashboard/landing), input schemas, and client requirements (browser-only vs. server-accessible).
- **MCP Tool**: An individual capability exposed to AI agents, characterized by name, description, parameters, read-only status, and execution context.
- **MCP Server Endpoint**: A server-side route that accepts tool invocation requests and returns results for read-only tools.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Audio playback via AI agent completes in a single interaction — zero confirmation dialogs shown to the user.
- **SC-002**: AI agents can discover MCP support by fetching a single well-known URL, with 100% of tools described in the manifest.
- **SC-003**: The MCP meta tag is present on every page of the site across all supported locales.
- **SC-004**: Non-browser clients can successfully invoke all read-only tools via the server-side endpoint and receive correct data.
- **SC-005**: Client-only tools are clearly marked in the manifest and properly rejected when invoked server-side.

## Assumptions

- The WebMCP Chrome extension (or equivalent) will continue to be the primary consumer of client-side tools.
- The `/.well-known/mcp.json` manifest follows emerging community conventions for MCP discovery (no formal standard exists yet).
- Server-side MCP endpoint only exposes read-only tools — write actions (playback, navigation) remain browser-exclusive.
- Removing confirmation dialogs is safe because AI agent invocations represent explicit user intent (the user asked the agent to perform the action).
