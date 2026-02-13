import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { toolRegistry } from "../../vitest.setup";
import { renderWithIntl } from "../test-utils";
import { ReleasesTool } from "@/components/webmcp/tools/ReleasesTool";
import { SalesTool } from "@/components/webmcp/tools/SalesTool";
import { EngagementTool } from "@/components/webmcp/tools/EngagementTool";
import { PlayerTool } from "@/components/webmcp/tools/PlayerTool";
import { WebMCPProvider } from "@/components/webmcp/WebMCPProvider";

beforeEach(() => {
  toolRegistry.clear();
});

afterEach(() => {
  cleanup();
  toolRegistry.clear();
});

describe("WebMCP Tool Registration", () => {
  describe("ReleasesTool", () => {
    it("registers get_releases and get_release_by_id", () => {
      render(<ReleasesTool />);
      const names = [...toolRegistry.keys()];
      expect(names).toContain("get_releases");
      expect(names).toContain("get_release_by_id");
    });

    it("marks both tools as readOnlyHint", () => {
      render(<ReleasesTool />);
      const getReleases = toolRegistry.get("get_releases");
      const getById = toolRegistry.get("get_release_by_id");
      expect(getReleases?.annotations?.readOnlyHint).toBe(true);
      expect(getById?.annotations?.readOnlyHint).toBe(true);
    });
  });

  describe("SalesTool", () => {
    it("registers get_sales and get_revenue_summary", () => {
      render(<SalesTool />);
      const names = [...toolRegistry.keys()];
      expect(names).toContain("get_sales");
      expect(names).toContain("get_revenue_summary");
    });

    it("marks both tools as readOnlyHint", () => {
      render(<SalesTool />);
      const getSales = toolRegistry.get("get_sales");
      const getRevenue = toolRegistry.get("get_revenue_summary");
      expect(getSales?.annotations?.readOnlyHint).toBe(true);
      expect(getRevenue?.annotations?.readOnlyHint).toBe(true);
    });
  });

  describe("EngagementTool", () => {
    it("registers get_engagement and get_top_fans", () => {
      render(<EngagementTool />);
      const names = [...toolRegistry.keys()];
      expect(names).toContain("get_engagement");
      expect(names).toContain("get_top_fans");
    });

    it("marks both tools as readOnlyHint", () => {
      render(<EngagementTool />);
      const getEng = toolRegistry.get("get_engagement");
      const getTopFans = toolRegistry.get("get_top_fans");
      expect(getEng?.annotations?.readOnlyHint).toBe(true);
      expect(getTopFans?.annotations?.readOnlyHint).toBe(true);
    });
  });

  describe("PlayerTool", () => {
    it("registers get_player_state, play_track, and control_player", () => {
      renderWithIntl(<PlayerTool />);
      const names = [...toolRegistry.keys()];
      expect(names).toContain("get_player_state");
      expect(names).toContain("play_track");
      expect(names).toContain("control_player");
    });

    it("marks get_player_state as readOnlyHint", () => {
      renderWithIntl(<PlayerTool />);
      const tool = toolRegistry.get("get_player_state");
      expect(tool?.annotations?.readOnlyHint).toBe(true);
    });

    it("marks play_track and control_player as NOT readOnlyHint", () => {
      renderWithIntl(<PlayerTool />);
      const playTrack = toolRegistry.get("play_track");
      const controlPlayer = toolRegistry.get("control_player");
      expect(playTrack?.annotations?.readOnlyHint).toBe(false);
      expect(controlPlayer?.annotations?.readOnlyHint).toBe(false);
    });
  });

  describe("Cleanup on unmount", () => {
    it("unregisters tools when component unmounts", () => {
      const { unmount } = render(<ReleasesTool />);
      expect(toolRegistry.size).toBe(2);
      unmount();
      expect(toolRegistry.size).toBe(0);
    });
  });

  describe("WebMCPProvider", () => {
    it("registers all 10 tools including get_user_locale", () => {
      renderWithIntl(<WebMCPProvider />);

      const names = [...toolRegistry.keys()];
      expect(names).toHaveLength(10);
      expect(names).toEqual(
        expect.arrayContaining([
          "get_user_locale",
          "get_releases",
          "get_release_by_id",
          "get_sales",
          "get_revenue_summary",
          "get_engagement",
          "get_top_fans",
          "get_player_state",
          "play_track",
          "control_player",
        ]),
      );
    });

    it("get_user_locale is marked as readOnlyHint", () => {
      renderWithIntl(<WebMCPProvider />);
      const tool = toolRegistry.get("get_user_locale");
      expect(tool?.annotations?.readOnlyHint).toBe(true);
    });
  });
});
