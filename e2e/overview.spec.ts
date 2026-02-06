import { test, expect } from '@playwright/test';

test.describe('Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with metrics and charts', async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/EVEN Backstage/);

    // Check if the main heading is present
    await expect(page.locator('h1')).toContainText('Dashboard');

    // Check if metric cards are present
    await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(4);

    // Check if Total Revenue card is present
    const totalRevenueCard = page.locator('text=Total Revenue');
    await expect(totalRevenueCard).toBeVisible();

    // Check if Net Revenue card is present
    const netRevenueCard = page.locator('text=Net Revenue');
    await expect(netRevenueCard).toBeVisible();

    // Check if Total Sales card is present
    const totalSalesCard = page.locator('text=Total Sales');
    await expect(totalSalesCard).toBeVisible();

    // Check if Active Buyers card is present
    const activeBuyersCard = page.locator('text=Active Buyers');
    await expect(activeBuyersCard).toBeVisible();

    // Check if Revenue Chart is present
    const revenueChart = page.locator('text=Revenue');
    await expect(revenueChart).toBeVisible();

    // Check if Recent Releases section is present
    const recentReleases = page.locator('text=Recent Releases');
    await expect(recentReleases).toBeVisible();

    // Verify that chart elements are rendered
    await expect(page.locator('svg')).toBeVisible();
  });

  test('displays metric values correctly', async ({ page }) => {
    // Check if metric values are displayed
    const metricValues = page.locator('.data-value');
    await expect(metricValues.first()).toBeVisible();

    // At least one metric should have a value
    await expect(metricValues).toHaveCountGreaterThan(0);
  });
});