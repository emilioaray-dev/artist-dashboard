# API Contract: MCP Endpoints

**Feature**: 007-webmcp-discoverability
**Date**: 2026-02-16

## 1. Discovery Manifest

### `GET /.well-known/mcp.json`

Returns the MCP tool manifest for AI agent discovery.

**Response**: `200 OK` — `application/json`

```json
{
  "name": "MUSIC Backstage",
  "description": "Artist dashboard with AI-accessible tools for music releases, sales analytics, fan engagement, and audio playback control.",
  "version": "1.0.0",
  "tools": {
    "dashboard": [
      {
        "name": "get_user_locale",
        "description": "Get the user's current locale/language.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": false
      },
      {
        "name": "get_releases",
        "description": "Get all music releases from the artist dashboard.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_release_by_id",
        "description": "Get a specific music release by its ID.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "description": "Release ID (e.g., rel_001)" }
          },
          "required": ["id"]
        },
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_sales",
        "description": "Get sales analytics for a time range.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "range": { "type": "string", "enum": ["7d", "30d", "90d"], "description": "Time range" }
          },
          "required": ["range"]
        },
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_revenue_summary",
        "description": "Get a formatted revenue summary comparing different time periods.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_engagement",
        "description": "Get fan engagement metrics.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_top_fans",
        "description": "Get top fans ranked by total spending.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "limit": { "type": "number", "minimum": 1, "maximum": 20, "description": "Number of fans (default 5)" }
          }
        },
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_player_state",
        "description": "Get current state of the audio player.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": false
      },
      {
        "name": "play_track",
        "description": "Play a music track from the dashboard audio player.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "releaseId": { "type": "string", "description": "Release ID" }
          },
          "required": ["releaseId"]
        },
        "readOnly": false,
        "serverAccessible": false
      },
      {
        "name": "control_player",
        "description": "Control the audio player (play, pause, next, previous, stop, toggle_shuffle).",
        "inputSchema": {
          "type": "object",
          "properties": {
            "action": { "type": "string", "enum": ["play", "pause", "next", "previous", "stop", "toggle_shuffle"] },
            "volume": { "type": "number", "minimum": 0, "maximum": 1 }
          },
          "required": ["action"]
        },
        "readOnly": false,
        "serverAccessible": false
      }
    ],
    "landing": [
      {
        "name": "search_release",
        "description": "Search for a music release by title.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "title": { "type": "string", "description": "Title to search for" }
          },
          "required": ["title"]
        },
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "navigate_and_play",
        "description": "Navigate to the dashboard and play a music track.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "releaseId": { "type": "string", "description": "Release ID" }
          },
          "required": ["releaseId"]
        },
        "readOnly": false,
        "serverAccessible": false
      },
      {
        "name": "get_available_locales",
        "description": "Get available locales/languages.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": true
      },
      {
        "name": "get_locale_change_info",
        "description": "Get information about how to change the application language.",
        "inputSchema": null,
        "readOnly": true,
        "serverAccessible": true
      }
    ]
  },
  "endpoint": "/api/mcp",
  "transport": "json-rpc"
}
```

## 2. Server-Side MCP Endpoint

### `POST /api/mcp`

Invoke a read-only MCP tool server-side.

**Request**: `application/json`

```json
{
  "tool": "get_releases",
  "input": {}
}
```

**Success Response**: `200 OK`

```json
{
  "success": true,
  "data": [...]
}
```

**Error Responses**:

`400 Bad Request` — Missing or invalid tool name:
```json
{
  "success": false,
  "error": "Missing required field: tool",
  "code": "INVALID_INPUT"
}
```

`404 Not Found` — Tool does not exist:
```json
{
  "success": false,
  "error": "Tool not found: unknown_tool",
  "code": "TOOL_NOT_FOUND"
}
```

`403 Forbidden` — Client-only tool invoked server-side:
```json
{
  "success": false,
  "error": "Tool 'play_track' is only available in the browser context",
  "code": "CLIENT_ONLY"
}
```

`500 Internal Server Error` — Tool execution failed:
```json
{
  "success": false,
  "error": "Failed to fetch releases",
  "code": "EXECUTION_ERROR"
}
```
