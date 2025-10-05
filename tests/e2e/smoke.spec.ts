import { test, expect } from '@playwright/test';

test.describe('InstallSure Smoke Tests', () => {
  test('homepage loads and shows application header', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/InstallSure/i);
    
    // Look for InstallSure branding or header
    const heading = page.locator('h1, h2, [class*="header"], [class*="title"]').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:8099/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('can navigate to main pages', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
    
    // Check that navigation links exist
    const nav = page.locator('nav, [role="navigation"], [class*="sidebar"], [class*="menu"]').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });
});
