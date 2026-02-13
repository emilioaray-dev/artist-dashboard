import { test, expect } from "@playwright/test";

const EXPECTED_TOOLS = [
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
    await page.goto("/overview");
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

    for (const name of EXPECTED_TOOLS) {
      expect(toolNames).toContain(name);
    }
  });

  test("get_releases tool returns data", async ({ page }) => {
    await page.goto("/overview");
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.waitForTimeout(2000);

    const hasModelContext = await page.evaluate(
      () => "modelContext" in navigator,
    );
    test.skip(!hasModelContext, "navigator.modelContext not available");

    const result = await page.evaluate(async () => {
      const mc = (navigator as unknown as { modelContext: { callTool: (p: { name: string }) => Promise<{ content?: Array<{ text: string }> }> } }).modelContext;
      const response = await mc.callTool({ name: "get_releases" });
      const text = response?.content?.[0]?.text;
      return text ? JSON.parse(text) : null;
    });

    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("title");
  });

  test("tools are NOT registered on landing page", async ({ page }) => {
    await page.goto("/");
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
    for (const name of EXPECTED_TOOLS) {
      expect(toolNames).not.toContain(name);
    }
  });
});
