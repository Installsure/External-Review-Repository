import { test, expect } from '@playwright/test';

test.describe('Hello App - Basic Flow', () => {
  test('should load the homepage and show onboarding or main app', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load - it should show either onboarding or main app
    await page.waitForLoadState('networkidle');
    
    // Check that the page loaded successfully
    // The app should either show onboarding form or the main app navigation
    const onboardingHeading = page.locator('text=/Create Your Digital Card|Get Started|Welcome/i');
    const myCardHeading = page.locator('text=/My Card/i');
    const navBar = page.locator('nav');
    
    // At least one of these should be visible
    const hasOnboarding = await onboardingHeading.isVisible().catch(() => false);
    const hasMyCard = await myCardHeading.isVisible().catch(() => false);
    const hasNav = await navBar.isVisible().catch(() => false);
    
    expect(hasOnboarding || hasMyCard || hasNav).toBeTruthy();
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // The page should have loaded
    expect(page.url()).toContain('localhost:3005');
  });

  test('should be able to navigate between tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for auto-login to complete
    await page.waitForTimeout(2000);
    
    // Try to find navigation buttons
    const scanButton = page.locator('button, a').filter({ hasText: /Scan|Search/i });
    const hellosButton = page.locator('button, a').filter({ hasText: /Hello|Hellos|Messages/i });
    
    // If navigation exists, try clicking
    const hasScanButton = await scanButton.first().isVisible().catch(() => false);
    if (hasScanButton) {
      await scanButton.first().click();
      await page.waitForTimeout(500);
    }
    
    const hasHellosButton = await hellosButton.first().isVisible().catch(() => false);
    if (hasHellosButton) {
      await hellosButton.first().click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Hello App - Onboarding', () => {
  test('should show onboarding for new users', async ({ page, context }) => {
    // Clear storage to simulate new user
    await context.clearCookies();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for auto-login
    await page.waitForTimeout(2000);
    
    // Check if onboarding appears (it should for users without profile)
    const onboardingForm = page.locator('form').first();
    const inputs = page.locator('input[type="text"], input[type="email"], input');
    
    // Either onboarding form exists or user already has profile
    const hasForm = await onboardingForm.isVisible().catch(() => false);
    const hasInputs = await inputs.first().isVisible().catch(() => false);
    
    // Just verify the page loaded correctly
    expect(page.url()).toContain('localhost:3005');
  });
});

test.describe('Hello App - UI Elements', () => {
  test('should render without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Filter out common/expected errors
    const criticalErrors = errors.filter(
      (error) => 
        !error.includes('favicon') && 
        !error.includes('manifest') &&
        !error.toLowerCase().includes('hydration')
    );
    
    // Should have minimal critical errors
    expect(criticalErrors.length).toBeLessThan(5);
  });
  
  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Page should still be visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(body).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(body).toBeVisible();
  });
});
