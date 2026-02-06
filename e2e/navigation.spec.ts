import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sidebar navigation works across pages', async ({ page }) => {
    // Check if sidebar is present
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check if Overview link is active initially
    const overviewLink = page.locator('nav a[href="/"]:has-text("Overview")');
    await expect(overviewLink).toHaveAttribute('class', /bg-accent/);

    // Navigate to Releases page
    const releasesLink = page.locator('nav a[href="/releases"]');
    await releasesLink.click();

    // Check if Releases page loaded
    await expect(page.locator('h1')).toContainText('Releases');
    await expect(releasesLink).toHaveAttribute('class', /bg-accent/);

    // Navigate to Fans page
    const fansLink = page.locator('nav a[href="/fans"]');
    await fansLink.click();

    // Check if Fans page loaded
    await expect(page.locator('h1')).toContainText('Fans');
    await expect(fansLink).toHaveAttribute('class', /bg-accent/);

    // Navigate back to Overview
    await overviewLink.click();
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(overviewLink).toHaveAttribute('class', /bg-accent/);
  });

  test('page transitions work correctly', async ({ page }) => {
    // Measure initial page load time
    const startTime = Date.now();
    await page.goto('/');
    const initialLoadTime = Date.now() - startTime;

    // Navigate to another page
    const releasesLink = page.locator('nav a[href="/releases"]');
    const navigationStartTime = Date.now();
    await releasesLink.click();
    await expect(page.locator('h1')).toContainText('Releases');
    const navigationTime = Date.now() - navigationStartTime;

    // Basic check that navigation happened in reasonable time
    expect(navigationTime).toBeLessThan(5000); // Less than 5 seconds

    // Navigate to another page
    const fansLink = page.locator('nav a[href="/fans"]');
    const secondNavigationStartTime = Date.now();
    await fansLink.click();
    await expect(page.locator('h1')).toContainText('Fans');
    const secondNavigationTime = Date.now() - secondNavigationStartTime;

    // Basic check that navigation happened in reasonable time
    expect(secondNavigationTime).toBeLessThan(5000); // Less than 5 seconds
  });

  test('all navigation links are accessible', async ({ page }) => {
    // Check if all navigation items are present
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(3);

    // Check if each link has proper attributes
    const overviewLink = page.locator('nav a[href="/"]');
    await expect(overviewLink).toBeVisible();
    await expect(overviewLink).toHaveAccessibleName('Overview');

    const releasesLink = page.locator('nav a[href="/releases"]');
    await expect(releasesLink).toBeVisible();
    await expect(releasesLink).toHaveAccessibleName('Releases');

    const fansLink = page.locator('nav a[href="/fans"]');
    await expect(fansLink).toBeVisible();
    await expect(fansLink).toHaveAccessibleName('Fans');
  });
});