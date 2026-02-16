import { test, expect } from "@playwright/test";
import { PLATFORM_NAME, ROUTES } from "../src/lib/constants";

test.describe("Sidebar Navigation", () => {
  test("navigates to Releases page", async ({ page }) => {
    await page.goto(ROUTES.overview);
    await page.waitForSelector("h1", { timeout: 15000 });

    await page.getByRole("link", { name: "Releases" }).click();
    await expect(page).toHaveURL(/\/(en|es|fr|pt\/?)?releases$/);
    await expect(page.locator("h1")).toContainText("Releases", {
      timeout: 15000,
    });
  });

  test("navigates to Fans page", async ({ page }) => {
    await page.goto(ROUTES.overview);
    await page.waitForSelector("h1", { timeout: 15000 });

    await page.getByRole("link", { name: "Fans" }).click();
    await expect(page).toHaveURL(/\/(en|es|fr|pt\/?)?fans$/);
    await expect(page.locator("h1")).toContainText("Fans", { timeout: 15000 });
  });

  test("navigates to Settings page", async ({ page }) => {
    await page.goto(ROUTES.overview);
    await page.waitForSelector("h1", { timeout: 15000 });

    await page.getByRole("link", { name: "Settings" }).click();
    // Settings page may need on-demand compilation on first visit
    await expect(page).toHaveURL(/\/(en|es|fr|pt\/?)?settings$/, {
      timeout: 15000,
    });
    await expect(page.locator("h1")).toContainText("Settings", {
      timeout: 15000,
    });
  });

  test("navigates back to Overview from another page", async ({ page }) => {
    await page.goto(ROUTES.releases);
    await page.waitForSelector("h1", { timeout: 15000 });

    await page.getByRole("link", { name: "Overview" }).click();
    await expect(page).toHaveURL(/\/(en|es|fr|pt\/?)?overview$/);
    await expect(page.locator("h1")).toContainText("Overview", {
      timeout: 15000,
    });
  });

  test("highlights active navigation item", async ({ page }) => {
    await page.goto(ROUTES.releases);
    await page.waitForSelector("h1", { timeout: 15000 });

    // The active link should have font-semibold styling
    const releasesLink = page
      .locator("aside")
      .getByRole("link", { name: "Releases" });
    await expect(releasesLink).toBeVisible({ timeout: 10000 });
    // Check via computed style or class - Tailwind v4 may transform class names
    await expect(releasesLink).toHaveCSS("font-weight", "600");
  });

  test("sidebar shows brand logo", async ({ page }) => {
    await page.goto(ROUTES.overview);
    await page.waitForSelector("h1", { timeout: 15000 });

    await expect(
      page.locator("aside").getByText(PLATFORM_NAME),
    ).toBeVisible();
  });
});
