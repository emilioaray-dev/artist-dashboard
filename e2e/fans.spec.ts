import { test, expect } from "@playwright/test";
import { ROUTES } from "../src/lib/constants";

test.describe("Fans Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.fans);
    await page.waitForSelector("h1", { timeout: 15000 });
  });

  test("displays page header", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Fans");
    await expect(
      page.getByText("Track your community growth and engagement"),
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows fan metric cards", async ({ page }) => {
    await expect(page.getByText("Total Fans", { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Active Buyers", { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Engagement Rate")).toBeVisible({
      timeout: 10000,
    });
  });

  test("displays Fan Growth chart", async ({ page }) => {
    await expect(page.getByText("Fan Growth", { exact: true })).toBeVisible({
      timeout: 15000,
    });
  });

  test("displays Top Fans section with fan entries", async ({ page }) => {
    await expect(page.getByText("Top Fans")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Your most valuable supporters")).toBeVisible({
      timeout: 10000,
    });

    // Check that at least one fan name from mock data is visible
    const fanNames = [
      "MusicLover42",
      "VinylCollector",
      "ConcertGoer99",
      "IndieFan23",
      "NewMusicFinder",
    ];
    let foundFan = false;

    for (const name of fanNames) {
      const fan = page.getByText(name);
      if (
        await fan
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        foundFan = true;
        break;
      }
    }

    expect(foundFan).toBe(true);
  });
});
