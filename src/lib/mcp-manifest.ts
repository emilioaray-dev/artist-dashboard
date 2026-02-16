export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown> | null;
  readOnly: boolean;
  serverAccessible: boolean;
}

export interface McpManifest {
  name: string;
  description: string;
  version: string;
  tools: {
    dashboard: McpToolDefinition[];
    landing: McpToolDefinition[];
  };
  endpoint: string;
  transport: string;
}

const DASHBOARD_TOOLS: McpToolDefinition[] = [
  {
    name: "get_user_locale",
    description:
      "Get the user's current locale/language. Returns locale code and display name.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: false,
  },
  {
    name: "get_releases",
    description:
      "Get all music releases from the artist dashboard. Returns title, type, status, release date, total sales, and revenue data by channel.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_release_by_id",
    description:
      "Get a specific music release by its ID. Returns full details including sales breakdown by channel.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Release ID (e.g., rel_001)" },
      },
      required: ["id"],
    },
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_sales",
    description:
      "Get sales analytics for a time range. Returns total revenue, units sold, daily breakdown, and revenue by channel.",
    inputSchema: {
      type: "object",
      properties: {
        range: {
          type: "string",
          enum: ["7d", "30d", "90d"],
          description: "Time range: 7d (week), 30d (month), or 90d (quarter)",
        },
      },
      required: ["range"],
    },
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_revenue_summary",
    description:
      "Get a formatted revenue summary comparing 7-day, 30-day, and 90-day periods.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_engagement",
    description:
      "Get fan engagement metrics. Returns total fans, active fans, buyers, growth, engagement rate, and 90 days of history.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_top_fans",
    description:
      "Get top fans ranked by total spending. Returns display name, amount spent, purchase count, and avatar.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          minimum: 1,
          maximum: 20,
          description: "Number of fans to return (default 5, max 20)",
        },
      },
    },
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_player_state",
    description:
      "Get current state of the audio player. Returns current track, playback status, volume, position, and duration.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: false,
  },
  {
    name: "play_track",
    description:
      "Play a music track from the dashboard audio player.",
    inputSchema: {
      type: "object",
      properties: {
        releaseId: { type: "string", description: "Release ID (e.g., rel_001)" },
      },
      required: ["releaseId"],
    },
    readOnly: false,
    serverAccessible: false,
  },
  {
    name: "control_player",
    description:
      "Control the audio player. Available actions: play, pause, next, previous, stop, toggle_shuffle. Optionally set volume (0-1).",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: [
            "play",
            "pause",
            "next",
            "previous",
            "stop",
            "toggle_shuffle",
          ],
          description: "Player action to execute",
        },
        volume: {
          type: "number",
          minimum: 0,
          maximum: 1,
          description: "Volume level 0-1 (optional)",
        },
      },
      required: ["action"],
    },
    readOnly: false,
    serverAccessible: false,
  },
];

const LANDING_TOOLS: McpToolDefinition[] = [
  {
    name: "search_release",
    description: "Search for a music release by title. Returns release details if found.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the release to search for" },
      },
      required: ["title"],
    },
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "navigate_and_play",
    description:
      "Navigate to the dashboard and play a music track.",
    inputSchema: {
      type: "object",
      properties: {
        releaseId: { type: "string", description: "Release ID (e.g., rel_001)" },
      },
      required: ["releaseId"],
    },
    readOnly: false,
    serverAccessible: false,
  },
  {
    name: "get_available_locales",
    description:
      "Get the list of available locales/languages for the application.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: true,
  },
  {
    name: "get_locale_change_info",
    description:
      "Get information about how to change the application language/locale.",
    inputSchema: null,
    readOnly: true,
    serverAccessible: true,
  },
];

export const MCP_MANIFEST: McpManifest = {
  name: "MUSIC Backstage",
  description:
    "Artist dashboard with AI-accessible tools for music releases, sales analytics, fan engagement, and audio playback control.",
  version: "1.0.0",
  tools: {
    dashboard: DASHBOARD_TOOLS,
    landing: LANDING_TOOLS,
  },
  endpoint: "/api/mcp",
  transport: "json-rpc",
};

export function getServerAccessibleTools(): McpToolDefinition[] {
  return [
    ...DASHBOARD_TOOLS.filter((t) => t.serverAccessible),
    ...LANDING_TOOLS.filter((t) => t.serverAccessible),
  ];
}

export function isClientOnly(toolName: string): boolean {
  const allTools = [...DASHBOARD_TOOLS, ...LANDING_TOOLS];
  const tool = allTools.find((t) => t.name === toolName);
  return tool ? !tool.serverAccessible : false;
}

export function findTool(toolName: string): McpToolDefinition | undefined {
  const allTools = [...DASHBOARD_TOOLS, ...LANDING_TOOLS];
  return allTools.find((t) => t.name === toolName);
}
