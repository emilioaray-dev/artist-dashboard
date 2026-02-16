import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { toolRegistry } from "../../vitest.setup";
import { renderWithIntl } from "../test-utils";
import { ReleasesTool } from "@/components/webmcp/tools/ReleasesTool";
import { SalesTool } from "@/components/webmcp/tools/SalesTool";
import { EngagementTool } from "@/components/webmcp/tools/EngagementTool";
import { PlayerTool } from "@/components/webmcp/tools/PlayerTool";

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock player store
const mockStore = {
  currentTrack: "/api/audio/rel_001",
  currentTrackTitle: "Test Track",
  isPlaying: true,
  isBuffering: false,
  currentTime: 42.5,
  duration: 180,
  volume: 0.8,
  playbackRate: 1,
  playlist: ["/api/audio/rel_001"],
  currentTrackIndex: 0,
  repeatMode: "off",
  shuffle: false,
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  next: vi.fn(),
  previous: vi.fn(),
  toggleShuffle: vi.fn(),
  setVolume: vi.fn(),
};

vi.mock("@/store/player-store", () => ({
  usePlayerStore: {
    getState: () => mockStore,
  },
}));

beforeEach(() => {
  toolRegistry.clear();
  mockFetch.mockReset();
  vi.restoreAllMocks();
});

afterEach(() => {
  cleanup();
  toolRegistry.clear();
});

/**
 * Execute a registered tool and parse the MCP CallToolResult response.
 * useWebMCP wraps handler results as: { content: [{ type: 'text', text: JSON.stringify(result) }] }
 */
async function executeTool(name: string, args: Record<string, unknown> = {}) {
  const tool = toolRegistry.get(name);
  if (!tool) throw new Error(`Tool not registered: ${name}`);
  const response = (await tool.execute(args)) as {
    content?: Array<{ type: string; text: string }>;
    isError?: boolean;
  };
  if (response?.isError) {
    throw new Error(response.content?.[0]?.text?.replace("Error: ", "") ?? "Unknown error");
  }
  const text = response?.content?.[0]?.text;
  if (text) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return response;
}

describe("WebMCP Tool Execution", () => {
  describe("get_releases", () => {
    it("returns release data from API", async () => {
      const mockReleases = [
        { id: "rel_001", title: "Test Release", type: "single" },
      ];
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockReleases, status: 200 }),
      });

      render(<ReleasesTool />);
      const result = await executeTool("get_releases");
      expect(result).toEqual(mockReleases);
      expect(mockFetch).toHaveBeenCalledWith("/api/releases");
    });

    it("throws on API error", async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          error: { code: "ERROR", message: "Failed" },
          status: 500,
        }),
      });

      render(<ReleasesTool />);
      await expect(executeTool("get_releases")).rejects.toThrow("Failed");
    });
  });

  describe("get_release_by_id", () => {
    it("returns a specific release", async () => {
      const mockReleases = [
        { id: "rel_001", title: "First" },
        { id: "rel_002", title: "Second" },
      ];
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockReleases, status: 200 }),
      });

      render(<ReleasesTool />);
      const result = await executeTool("get_release_by_id", { id: "rel_002" });
      expect(result).toEqual({ id: "rel_002", title: "Second" });
    });

    it("throws if release not found", async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: [], status: 200 }),
      });

      render(<ReleasesTool />);
      await expect(
        executeTool("get_release_by_id", { id: "rel_999" }),
      ).rejects.toThrow("Release not found: rel_999");
    });
  });

  describe("get_sales", () => {
    it("returns sales data for a time range", async () => {
      const mockSales = { totalRevenue: 500000, totalSales: 250 };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockSales, status: 200 }),
      });

      render(<SalesTool />);
      const result = await executeTool("get_sales", { range: "7d" });
      expect(result).toEqual(mockSales);
      expect(mockFetch).toHaveBeenCalledWith("/api/sales?range=7d");
    });
  });

  describe("get_revenue_summary", () => {
    it("fetches all 3 time ranges via Promise.all", async () => {
      const make = (rev: number, pct: number) => ({
        json: async () => ({
          data: {
            totalRevenue: rev,
            revenueChange: { percentage: pct, trend: "up" },
          },
          status: 200,
        }),
      });

      mockFetch
        .mockResolvedValueOnce(make(100000, 5.2))
        .mockResolvedValueOnce(make(400000, 12.1))
        .mockResolvedValueOnce(make(1200000, 8.7));

      render(<SalesTool />);
      const result = await executeTool("get_revenue_summary");

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result["7d"]).toEqual({
        period: "7d",
        revenue: 100000,
        changePercent: 5.2,
        trend: "up",
      });
      expect(result["30d"]).toEqual({
        period: "30d",
        revenue: 400000,
        changePercent: 12.1,
        trend: "up",
      });
    });
  });

  describe("get_engagement", () => {
    it("returns engagement data from API", async () => {
      const mockData = { totalFans: 125000, activeFans: 45000 };
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockData, status: 200 }),
      });

      render(<EngagementTool />);
      const result = await executeTool("get_engagement");
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith("/api/engagement");
    });
  });

  describe("get_top_fans", () => {
    it("returns top fans sliced by limit", async () => {
      const mockFans = [
        { id: "f1", displayName: "Fan1", totalSpent: 50000 },
        { id: "f2", displayName: "Fan2", totalSpent: 40000 },
        { id: "f3", displayName: "Fan3", totalSpent: 30000 },
      ];
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: { topFans: mockFans },
          status: 200,
        }),
      });

      render(<EngagementTool />);
      const result = await executeTool("get_top_fans", { limit: 2 });
      expect(result).toHaveLength(2);
    });

    it("defaults to 5 fans when no limit provided", async () => {
      const mockFans = Array.from({ length: 10 }, (_, i) => ({
        id: `f${i}`,
        displayName: `Fan${i}`,
        totalSpent: (10 - i) * 10000,
      }));
      mockFetch.mockResolvedValueOnce({
        json: async () => ({
          data: { topFans: mockFans },
          status: 200,
        }),
      });

      render(<EngagementTool />);
      const result = await executeTool("get_top_fans", {});
      expect(result).toHaveLength(5);
    });
  });

  describe("get_player_state", () => {
    it("returns current player state from Zustand store", async () => {
      renderWithIntl(<PlayerTool />);
      const result = await executeTool("get_player_state");
      expect(result).toEqual(
        expect.objectContaining({
          currentTrack: "/api/audio/rel_001",
          currentTrackTitle: "Test Track",
          isPlaying: true,
          volume: 0.8,
          duration: 180,
        }),
      );
    });
  });

  describe("play_track", () => {
    it("plays track immediately without confirmation", async () => {
      const mockReleases = [
        {
          id: "rel_001",
          title: "Test Track",
          audioUrl: "/api/audio/rel_001",
        },
      ];
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ data: mockReleases, status: 200 }),
      });

      renderWithIntl(<PlayerTool />);
      const result = await executeTool("play_track", {
        releaseId: "rel_001",
      });

      expect(result.played).toBe(true);
      expect(result.title).toBe("Test Track");
      expect(mockStore.play).toHaveBeenCalledWith("/api/audio/rel_001", "Test Track");
    });
  });

  describe("control_player", () => {
    it("executes pause action on Zustand store", async () => {
      renderWithIntl(<PlayerTool />);
      await executeTool("control_player", { action: "pause" });
      expect(mockStore.pause).toHaveBeenCalled();
    });

    it("sets volume when provided", async () => {
      renderWithIntl(<PlayerTool />);
      await executeTool("control_player", { action: "play", volume: 0.5 });
      expect(mockStore.play).toHaveBeenCalled();
      expect(mockStore.setVolume).toHaveBeenCalledWith(0.5);
    });
  });
});
