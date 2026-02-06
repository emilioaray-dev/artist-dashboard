import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('works on mobile viewport (375px)', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to the overview page
    await page.goto('/');

    // Check if the sidebar is hidden on mobile
    const sidebar = page.locator('aside');
    await expect(sidebar).not.toBeVisible();

    // Check if main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check if the header is visible
    const header = page.locator('h1');
    await expect(header).toBeVisible();

    // Check if metric cards stack vertically on mobile
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards.first()).toBeVisible();

    // Navigate to releases page
    await page.goto('/releases');

    // Check if releases grid is responsive (1 column on mobile)
    const releasesGrid = page.locator('.grid.grid-cols-1.gap-4');
    await expect(releasesGrid).toBeVisible();

    // Navigate to fans page
    await page.goto('/fans');

    // Check if fans page is responsive
    const fansMetricCards = page.locator('[data-testid="metric-card"]');
    await expect(fansMetricCards).toHaveCount(3);
  });

  test('works on tablet viewport (768px)', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigate to the overview page
    await page.goto('/');

    // Check if main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check if metric cards are arranged properly
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards).toHaveCount(4);

    // Navigate to releases page
    await page.goto('/releases');

    // Check if releases grid has 2 columns on tablet
    const releasesGrid = page.locator('.grid.grid-cols-1.gap-4.sm\\\\:grid-cols-2');
    await expect(releasesGrid).toBeVisible();
  });

  test('works on desktop viewport (1280px)', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });

    // Navigate to the overview page
    await page.goto('/');

    // Check if sidebar is visible on desktop
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check if main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Check if metric cards are arranged in 4 columns on desktop
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards).toHaveCount(4);

    // Navigate to releases page
    await page.goto('/releases');

    // Check if releases grid has 3 columns on desktop
    const releasesGrid = page.locator('.grid.grid-cols-1.gap-4.lg\\\\:grid-cols-3');
    await expect(releasesGrid).toBeVisible();

    // Navigate to fans page
    await page.goto('/fans');

    // Check if fans page has 2-column layout on desktop
    const fansLayout = page.locator('.grid.grid-cols-1.gap-6.lg\\\\:grid-cols-2');
    await expect(fansLayout).toBeVisible();
  });

  test('maintains layout integrity across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1280, height: 800 }   // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Test overview page
      await page.goto('/');
      await expect(page.locator('h1')).toContainText('Dashboard');
      await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(4);

      // Test releases page
      await page.goto('/releases');
      await expect(page.locator('h1')).toContainText('Releases');
      await expect(page.locator('[data-testid="release-card"]')).toHaveCountGreaterThan(0);

      // Test fans page
      await page.goto('/fans');
      await expect(page.locator('h1')).toContainText('Fans');
      await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(3);
    }
  });
});