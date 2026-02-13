"use client";

import { useWebMCP } from "@mcp-b/react-webmcp";
import { z } from "zod";

const READ_ONLY = { readOnlyHint: true } as const;

const salesInput = {
  range: z
    .enum(["7d", "30d", "90d"])
    .describe("Time range: 7d (week), 30d (month), or 90d (quarter)"),
};

export function SalesTool() {
  useWebMCP({
    name: "get_sales",
    description:
      "Get sales analytics for a time range. Returns total revenue, total units sold, gross/net revenue, daily breakdown, and revenue by channel (direct_to_fan, digital, physical, bundles). Revenue values are in cents.",
    inputSchema: salesInput,
    annotations: READ_ONLY,
    handler: async ({ range }) => {
      const res = await fetch(`/api/sales?range=${range}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      return json.data;
    },
  });

  useWebMCP({
    name: "get_revenue_summary",
    description:
      "Get a formatted revenue summary comparing different time periods. Returns revenue, change percentage, and trend for 7-day, 30-day, and 90-day windows.",
    annotations: READ_ONLY,
    handler: async () => {
      const [res7d, res30d, res90d] = await Promise.all([
        fetch("/api/sales?range=7d").then((r) => r.json()),
        fetch("/api/sales?range=30d").then((r) => r.json()),
        fetch("/api/sales?range=90d").then((r) => r.json()),
      ]);

      const summarize = (json: Record<string, unknown>, label: string) => {
        const data = json.data as {
          totalRevenue: number;
          revenueChange: { percentage: number; trend: string };
        } | undefined;
        if (!data) return { period: label, revenue: 0, changePercent: 0, trend: "stable" };
        return {
          period: label,
          revenue: data.totalRevenue,
          changePercent: data.revenueChange.percentage,
          trend: data.revenueChange.trend,
        };
      };

      return {
        "7d": summarize(res7d, "7d"),
        "30d": summarize(res30d, "30d"),
        "90d": summarize(res90d, "90d"),
      };
    },
  });

  return null;
}
