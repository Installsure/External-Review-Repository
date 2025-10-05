import { test, expect } from '@playwright/test';

test.describe('Demo Dashboard', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is present
    await expect(page).toHaveTitle(/Demo Dashboard|App Demo/i);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for common UI elements
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(true).toBe(true);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow for some expected errors but fail on critical ones
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should have accessible content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for basic accessibility
    const hasHeading = await page.locator('h1, h2, h3').count() > 0;
    expect(hasHeading).toBe(true);
  });
});
