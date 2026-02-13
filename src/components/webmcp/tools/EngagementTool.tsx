"use client";

import { useWebMCP } from "@mcp-b/react-webmcp";
import { z } from "zod";

const READ_ONLY = { readOnlyHint: true } as const;

const topFansInput = {
  limit: z
    .number()
    .min(1)
    .max(20)
    .optional()
    .describe("Number of fans to return (default 5, max 20)"),
};

export function EngagementTool() {
  useWebMCP({
    name: "get_engagement",
    description:
      "Get fan engagement metrics. Returns total fans, active fans, total buyers, fan growth (absolute + percentage + trend), engagement rate, purchase rate, and 90 days of fan count history.",
    annotations: READ_ONLY,
    handler: async () => {
      const res = await fetch("/api/engagement");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      return json.data;
    },
  });

  useWebMCP({
    name: "get_top_fans",
    description:
      "Get top fans ranked by total spending. Returns display name, total amount spent (in cents), purchase count, and avatar URL.",
    inputSchema: topFansInput,
    annotations: READ_ONLY,
    handler: async ({ limit }) => {
      const res = await fetch("/api/engagement");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      const topFans = json.data?.topFans ?? [];
      return topFans.slice(0, limit ?? 5);
    },
  });

  return null;
}
