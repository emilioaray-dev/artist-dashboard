import { findTool, isClientOnly } from "@/lib/mcp-manifest";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface McpRequest {
  tool: string;
  input?: Record<string, unknown>;
}

async function fetchInternal(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.data;
}

type ToolHandler = (input: Record<string, unknown>) => Promise<unknown>;

const toolHandlers: Record<string, ToolHandler> = {
  get_releases: async () => fetchInternal("/api/releases"),

  get_release_by_id: async (input) => {
    const data = await fetchInternal("/api/releases");
    const release = data?.find(
      (r: { id: string }) => r.id === input.id,
    );
    if (!release) throw new Error(`Release not found: ${input.id}`);
    return release;
  },

  get_sales: async (input) => {
    const range = input.range as string;
    return fetchInternal(`/api/sales?range=${range}`);
  },

  get_revenue_summary: async () => {
    const [res7d, res30d, res90d] = await Promise.all([
      fetchInternal("/api/sales?range=7d"),
      fetchInternal("/api/sales?range=30d"),
      fetchInternal("/api/sales?range=90d"),
    ]);

    const summarize = (data: { totalRevenue?: number; revenueChange?: { percentage: number; trend: string } } | undefined, label: string) => {
      if (!data) return { period: label, revenue: 0, changePercent: 0, trend: "stable" };
      return {
        period: label,
        revenue: data.totalRevenue ?? 0,
        changePercent: data.revenueChange?.percentage ?? 0,
        trend: data.revenueChange?.trend ?? "stable",
      };
    };

    return {
      "7d": summarize(res7d, "7d"),
      "30d": summarize(res30d, "30d"),
      "90d": summarize(res90d, "90d"),
    };
  },

  get_engagement: async () => fetchInternal("/api/engagement"),

  get_top_fans: async (input) => {
    const data = await fetchInternal("/api/engagement");
    const topFans = data?.topFans ?? [];
    const limit = (input.limit as number) ?? 5;
    return topFans.slice(0, limit);
  },

  search_release: async (input) => {
    const data = await fetchInternal("/api/releases");
    const title = (input.title as string).toLowerCase();
    const release = data?.find((r: { title: string }) =>
      r.title.toLowerCase().includes(title),
    );
    if (!release) throw new Error(`Release not found: ${input.title}`);
    return release;
  },

  get_available_locales: async () => ({
    locales: [
      { code: "en", name: "English" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
      { code: "pt", name: "Português" },
    ],
    default: "en",
  }),

  get_locale_change_info: async () => ({
    instruction:
      "To change the language, navigate to one of these URLs: /en/, /es/, /fr/, /pt/. Example: Navigate to /es/ to switch to Spanish.",
    availableUrls: ["/en/", "/es/", "/fr/", "/pt/"],
  }),
};

export async function POST(request: NextRequest) {
  let body: McpRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  if (!body.tool || typeof body.tool !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing required field: tool", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const tool = findTool(body.tool);
  if (!tool) {
    return NextResponse.json(
      { success: false, error: `Tool not found: ${body.tool}`, code: "TOOL_NOT_FOUND" },
      { status: 404 },
    );
  }

  if (isClientOnly(body.tool)) {
    return NextResponse.json(
      {
        success: false,
        error: `Tool '${body.tool}' is only available in the browser context`,
        code: "CLIENT_ONLY",
      },
      { status: 403 },
    );
  }

  const handler = toolHandlers[body.tool];
  if (!handler) {
    return NextResponse.json(
      { success: false, error: `No server handler for tool: ${body.tool}`, code: "TOOL_NOT_FOUND" },
      { status: 404 },
    );
  }

  try {
    const data = await handler(body.input ?? {});
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message, code: "EXECUTION_ERROR" },
      { status: 500 },
    );
  }
}
