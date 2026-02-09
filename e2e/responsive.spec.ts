import { test, expect } from "@playwright/test";

test.describe("Responsive Design", () => {
  test("sidebar is visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/overview");
    await page.waitForSelector("h1", { timeout: 15000 });

    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
  });

  test("sidebar is hidden on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/overview");
    await page.waitForSelector("h1", { timeout: 15000 });

    const sidebar = page.locator("aside");
    await expect(sidebar).toBeHidden();
  });

  test("mobile bottom navigation is visible on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/overview");
    await page.waitForSelector("h1", { timeout: 15000 });

    // Bottom nav is a fixed div at the bottom with md:hidden
    // Use the text content to find it
    const overviewButton = page
      .locator("button")
      .filter({ hasText: "Overview" });
    await expect(overviewButton).toBeVisible({ timeout: 10000 });
  });

  test("mobile bottom navigation works for page switching", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/overview");
    await page.waitForSelector("h1", { timeout: 15000 });

    // Find the Releases button in the bottom nav (below the main content)
    // The sidebar is hidden, so the only "Releases" link is in the bottom nav
    await page
      .getByRole("link", { name: "Releases" })
      .evaluate((el) => (el as HTMLAnchorElement).click());

    await expect(page).toHaveURL("/releases");
    await expect(page.locator("h1")).toContainText("Releases", {
      timeout: 15000,
    });
  });

  test("metric cards are visible on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/overview");
    await page.waitForSelector("h1", { timeout: 15000 });

    await expect(page.getByText("Total Revenue")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Total Fans", { exact: true })).toBeVisible({
      timeout: 10000,
    });
  });
});
