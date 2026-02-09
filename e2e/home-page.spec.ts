import { test, expect } from "@playwright/test";

test.describe("Overview Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/overview");
    // Wait for the main content to render (streaming SSR may take a moment)
    await page.waitForSelector("h1", { timeout: 15000 });
  });

  test("displays page header with title and subtitle", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Overview");
    await expect(
      page.getByText("Your dashboard for direct-to-fan performance"),
    ).toBeVisible({ timeout: 10000 });
  });

  test("renders four metric cards", async ({ page }) => {
    await expect(page.getByText("Total Revenue")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Total Fans", { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Active Buyers", { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Avg. Order Value")).toBeVisible({
      timeout: 10000,
    });
  });

  test("displays Revenue chart section", async ({ page }) => {
    await expect(page.getByText("Revenue").first()).toBeVisible({
      timeout: 15000,
    });
    // Check for time range tabs
    await expect(page.getByRole("tab", { name: "7 Days" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("tab", { name: "30 Days" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("tab", { name: "90 Days" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("displays Fan Growth chart", async ({ page }) => {
    await expect(page.getByText("Fan Growth")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Total fans vs active buyers")).toBeVisible({
      timeout: 10000,
    });
  });

  test("displays Top Fans section", async ({ page }) => {
    await expect(page.getByText("Top Fans")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Your most valuable supporters")).toBeVisible({
      timeout: 10000,
    });
  });

  test("displays Recent Releases section", async ({ page }) => {
    await expect(page.getByText("Recent Releases")).toBeVisible({
      timeout: 15000,
    });
  });

  test("revenue chart time range tabs are interactive", async ({ page }) => {
    const tab7d = page.getByRole("tab", { name: "7 Days" });
    const tab30d = page.getByRole("tab", { name: "30 Days" });

    // Wait for tabs to render
    await expect(tab30d).toBeVisible({ timeout: 15000 });

    // 30 Days should be selected by default
    await expect(tab30d).toHaveAttribute("data-state", "active");

    // Click 7 Days tab
    await tab7d.click();
    await expect(tab7d).toHaveAttribute("data-state", "active", {
      timeout: 10000,
    });
  });
});
