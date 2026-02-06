import { test, expect } from '@playwright/test';

test.describe('Fans Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fans');
  });

  test('displays metrics and chart', async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/EVEN Backstage/);

    // Check if the main heading is present
    await expect(page.locator('h1')).toContainText('Fans');

    // Check if metric cards are present
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards).toHaveCount(3);

    // Check if Total Fans card is present
    const totalFansCard = page.locator('text=Total Fans');
    await expect(totalFansCard).toBeVisible();

    // Check if Active Buyers card is present
    const activeBuyersCard = page.locator('text=Active Buyers');
    await expect(activeBuyersCard).toBeVisible();

    // Check if Engagement Rate card is present
    const engagementRateCard = page.locator('text=Engagement Rate');
    await expect(engagementRateCard).toBeVisible();

    // Check if Fan Growth chart is present
    const fanGrowthChart = page.locator('text=Fan Growth');
    await expect(fanGrowthChart).toBeVisible();

    // Check if Top Fans section is present
    const topFansSection = page.locator('text=Top Fans');
    await expect(topFansSection).toBeVisible();

    // Verify that chart elements are rendered
    await expect(page.locator('svg')).toBeVisible();
  });

  test('displays fan metrics with values', async ({ page }) => {
    // Check if metric values are displayed
    const metricValues = page.locator('.data-value');
    await expect(metricValues).toHaveCountGreaterThan(0);

    // Check if at least one metric has a percentage value
    const percentageValues = page.locator('text=%');
    await expect(percentageValues).toHaveCountGreaterThan(0);
  });

  test('displays top fans list', async ({ page }) => {
    // Check if top fans are displayed
    const topFans = page.locator('[data-testid="top-fan-item"]');
    await expect(topFans).toHaveCountGreaterThan(0);

    // Check if fan names are visible
    const fanNames = page.locator('p.font-medium');
    await expect(fanNames).toHaveCountGreaterThan(0);

    // Check if purchase counts are visible
    const purchaseCounts = page.locator('text=purchases');
    await expect(purchaseCounts).toHaveCountGreaterThan(0);
  });
});