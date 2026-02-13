"use client";

import { useWebMCP } from "@mcp-b/react-webmcp";
import { z } from "zod";

const READ_ONLY = { readOnlyHint: true } as const;

const releaseByIdInput = {
  id: z.string().describe("Release ID (e.g., rel_001, rel_002, rel_003, rel_004, rel_005, rel_006)"),
};

export function ReleasesTool() {
  useWebMCP({
    name: "get_releases",
    description:
      "Get all music releases from the artist dashboard. Returns title, type (single/ep/album/drop/bundle), status (draft/scheduled/live/archived), release date, total sales, and revenue data by channel.",
    annotations: READ_ONLY,
    handler: async () => {
      const res = await fetch("/api/releases");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      return json.data;
    },
  });

  useWebMCP({
    name: "get_release_by_id",
    description:
      "Get a specific music release by its ID. Returns full details including sales breakdown by channel (direct_to_fan, digital, physical, bundles).",
    inputSchema: releaseByIdInput,
    annotations: READ_ONLY,
    handler: async ({ id }) => {
      const res = await fetch("/api/releases");
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      const release = json.data?.find(
        (r: { id: string }) => r.id === id,
      );
      if (!release) throw new Error(`Release not found: ${id}`);
      return release;
    },
  });

  return null;
}
