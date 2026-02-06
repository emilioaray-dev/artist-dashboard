import { test, expect } from '@playwright/test';

test.describe('Releases Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/releases');
  });

  test('displays release cards with waveform', async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/EVEN Backstage/);

    // Check if the main heading is present
    await expect(page.locator('h1')).toContainText('Releases');

    // Check if release cards are present
    const releaseCards = page.locator('[data-testid="release-card"]');
    await expect(releaseCards).toHaveCountGreaterThan(0);

    // Check if at least one release card has a waveform
    const waveformContainers = page.locator('[role="button"][aria-label*="Play"]');
    await expect(waveformContainers).toHaveCountGreaterThan(0);

    // Verify that a release card contains cover art
    const coverArts = page.locator('img').first();
    await expect(coverArts).toBeVisible();

    // Verify that a release card contains title
    const titles = page.locator('h3').first();
    await expect(titles).toBeVisible();

    // Verify that a release card contains status badge
    const statusBadges = page.locator('span').filter({ hasText: /LIVE|DRAFT|SCHEDULED|ARCHIVED/i });
    await expect(statusBadges).toHaveCountGreaterThan(0);

    // Verify that a release card contains revenue info
    const revenues = page.locator('text=$').first();
    await expect(revenues).toBeVisible();
  });

  test('waveform plays when clicked', async ({ page }) => {
    // Find the first play button
    const playButtons = page.locator('[role="button"][aria-label="Play"]');
    await expect(playButtons).toHaveCountGreaterThan(0);

    // Click the first play button
    await playButtons.first().click();

    // Check if the button now shows pause icon (indicating playing state)
    const pauseButtons = page.locator('[role="button"][aria-label="Pause"]');
    await expect(pauseButtons.first()).toBeVisible();
  });

  test('displays responsive grid', async ({ page }) => {
    // Check if the grid is present
    const grid = page.locator('.grid.grid-cols-1.gap-4');
    await expect(grid).toBeVisible();

    // On larger screens, it should have 3 columns
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(grid).toHaveClass(/lg:grid-cols-3/);
  });
});