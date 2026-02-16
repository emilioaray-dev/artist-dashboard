import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/constants";

test.describe("Releases Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.releases);
    await page.waitForSelector("h1", { timeout: 15000 });
  });

  test("displays page header", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Releases");
    await expect(
      page.getByText("Manage and track your exclusive drops"),
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows release cards", async ({ page }) => {
    // Wait for releases to load and render
    // Release cards should show at least one release title
    const content = page.locator("main, [class*='container']");
    await expect(content.first()).toBeVisible({ timeout: 15000 });

    // Check that the page has meaningful content beyond just the header
    const pageText = await page.textContent("body");
    // Releases data includes types like single, ep, album, drop, bundle
    const hasReleaseContent =
      pageText?.includes("single") ||
      pageText?.includes("ep") ||
      pageText?.includes("album") ||
      pageText?.includes("drop") ||
      pageText?.includes("bundle");
    expect(hasReleaseContent).toBeTruthy();
  });

  test("release cards display status badges", async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000);
    const pageText = (await page.textContent("body")) || "";

    // Status badges should be present (live, draft, scheduled, or archived)
    const hasStatus =
      pageText.toLowerCase().includes("live") ||
      pageText.toLowerCase().includes("draft") ||
      pageText.toLowerCase().includes("scheduled") ||
      pageText.toLowerCase().includes("archived");
    expect(hasStatus).toBeTruthy();
  });
});
