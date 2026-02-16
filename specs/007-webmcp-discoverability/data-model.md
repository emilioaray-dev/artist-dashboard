# Data Model: WebMCP Discoverability & UX Improvements

**Feature**: 007-webmcp-discoverability
**Date**: 2026-02-16

## Entities

### MCP Manifest

The central discovery document served at `/.well-known/mcp.json`.

| Field         | Type     | Description                                         |
| ------------- | -------- | --------------------------------------------------- |
| name          | string   | Application name ("MUSIC Backstage")                |
| description   | string   | Human-readable description of the MCP server        |
| version       | string   | Manifest version (semver)                           |
| tools         | object   | Tool definitions grouped by context                 |
| tools.dashboard | array  | Tools available on dashboard pages                  |
| tools.landing | array    | Tools available on the landing page                 |
| endpoint      | string   | Server-side MCP endpoint path ("/api/mcp")          |
| transport     | string   | Transport protocol ("json-rpc")                     |

### MCP Tool Definition (within manifest)

| Field          | Type     | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| name           | string   | Tool identifier (e.g., "get_releases")               |
| description    | string   | What the tool does                                   |
| inputSchema    | object?  | JSON Schema for input parameters (null if no input)  |
| readOnly       | boolean  | Whether the tool only reads data                     |
| serverAccessible | boolean | Whether the tool can be invoked via server endpoint |

### MCP Server Request

Request body for the `/api/mcp` endpoint.

| Field   | Type    | Description                                    |
| ------- | ------- | ---------------------------------------------- |
| tool    | string  | Tool name to invoke (e.g., "get_releases")     |
| input   | object? | Input parameters matching the tool's schema    |

### MCP Server Response (success)

| Field   | Type    | Description                        |
| ------- | ------- | ---------------------------------- |
| success | boolean | Always `true` for successful calls |
| data    | unknown | Tool execution result              |

### MCP Server Response (error)

| Field   | Type    | Description                            |
| ------- | ------- | -------------------------------------- |
| success | boolean | Always `false` for errors              |
| error   | string  | Human-readable error message           |
| code    | string  | Error code (e.g., "TOOL_NOT_FOUND", "CLIENT_ONLY", "INVALID_INPUT") |

## Relationships

```
MCP Manifest
  └── tools (dashboard[])
  │     ├── get_user_locale
  │     ├── get_releases
  │     ├── get_release_by_id
  │     ├── get_sales
  │     ├── get_revenue_summary
  │     ├── get_engagement
  │     ├── get_top_fans
  │     ├── get_player_state      [client-only]
  │     ├── play_track             [client-only]
  │     └── control_player         [client-only]
  └── tools (landing[])
        ├── search_release
        ├── navigate_and_play      [client-only]
        ├── get_available_locales
        └── get_locale_change_info

Server Endpoint (/api/mcp)
  └── Can invoke: get_releases, get_release_by_id, get_sales,
      get_revenue_summary, get_engagement, get_top_fans,
      get_available_locales, get_locale_change_info, search_release
  └── Rejects: play_track, control_player, navigate_and_play,
      get_player_state, get_user_locale
```

## State Transitions

No state machines apply. All tools are stateless request/response operations.
