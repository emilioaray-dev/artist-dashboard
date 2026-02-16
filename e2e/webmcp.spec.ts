import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/constants";

const EXPECTED_DASHBOARD_TOOLS = [
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
];

test.describe("WebMCP Tool Registration", () => {
  test("registers all 10 tools on dashboard pages", async ({ page }) => {
    await page.goto(ROUTES.overview);
    await page.waitForSelector("h1", { timeout: 15000 });

    // Wait for WebMCP polyfill + tool registration
    await page.waitForTimeout(2000);

    const hasModelContext = await page.evaluate(
      () => "modelContext" in navigator,
    );

    // Skip if browser doesn't support modelContext (polyfill may not load in all environments)
    test.skip(!hasModelContext, "navigator.modelContext not available");

    const toolNames = await page.evaluate(() => {
      const mc = (navigator as unknown as { modelContext: { listTools: () => Array<{ name: string }> } }).modelContext;
      return mc.listTools().map((t) => t.name);
    });

    for (const name of EXPECTED_DASHBOARD_TOOLS) {
      expect(toolNames).toContain(name);
    }
  });

  test("get_releases tool returns data", async ({ page }) => {
    await page.goto(ROUTES.overview);
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const hasModelContext = await page.evaluate(
      () => "modelContext" in navigator,
    );
    test.skip(!hasModelContext, "navigator.modelContext not available");

    await page.waitForFunction(() => {
      const mc = (navigator as unknown as { modelContext?: { listTools?: () => Array<{ name: string }> } }).modelContext;
      return !!mc?.listTools?.().some((tool) => tool.name === "get_releases");
    });

    const result = await page.evaluate(async () => {
      type ToolResponse = { content?: Array<{ type?: string; text?: string }> };
      const mc = (navigator as unknown as {
        modelContext?: {
          callTool?: (params: { name: string; arguments?: Record<string, unknown> }) => Promise<ToolResponse>;
          executeTool?: (name: string, args: Record<string, unknown>) => Promise<ToolResponse>;
        };
      }).modelContext;

      if (!mc) {
        throw new Error("modelContext missing");
      }

      // callTool (native Chromium API) and executeTool (polyfill) both return MCP format
      let response: ToolResponse;
      if (typeof mc.callTool === "function") {
        response = await mc.callTool({ name: "get_releases", arguments: {} });
      } else if (typeof mc.executeTool === "function") {
        response = await mc.executeTool("get_releases", {});
      } else {
        throw new TypeError("No tool execution API available on modelContext");
      }

      const text = response?.content?.[0]?.text;
      if (!text) throw new Error("No response text from tool execution");
      return JSON.parse(text);
    });

    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("title");
  });

  test("tools are NOT registered on landing page", async ({ page }) => {
    await page.goto(ROUTES.home);
    await page.waitForTimeout(2000);

    const hasModelContext = await page.evaluate(
      () => "modelContext" in navigator,
    );
    test.skip(!hasModelContext, "navigator.modelContext not available");

    const toolNames = await page.evaluate(() => {
      const mc = (navigator as unknown as { modelContext: { listTools: () => Array<{ name: string }> } }).modelContext;
      return mc.listTools().map((t) => t.name);
    });

    // Dashboard tools should not be registered on the landing page
    for (const name of EXPECTED_DASHBOARD_TOOLS) {
      expect(toolNames).not.toContain(name);
    }
  });
});
