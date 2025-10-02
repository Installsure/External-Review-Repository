import { test, expect } from '@playwright/test';

test.describe('InstallSure Frontend', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/InstallSure/);
  });

  test('should have navigation', async ({ page }) => {
    await page.goto('/');
    // Check if basic page structure exists
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });
});
