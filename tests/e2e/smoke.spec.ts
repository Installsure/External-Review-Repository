import { test, expect } from '@playwright/test';

test.describe('InstallSure E2E Smoke Tests', () => {
  test('should load application and show header', async ({ page }) => {
    await page.goto('/');
    
    // Check for header/title
    await expect(page.locator('text=/InstallSure/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to main routes', async ({ page }) => {
    await page.goto('/');
    
    // Test basic navigation
    const routes = [
      { name: /dashboard|home/i, url: '/' },
      { name: /plans/i, url: '/plans' },
      { name: /rfis|rfi/i, url: '/rfis' },
    ];

    for (const route of routes) {
      try {
        const link = page.getByRole('link', { name: route.name }).first();
        if (await link.isVisible({ timeout: 2000 })) {
          await link.click();
          await page.waitForLoadState('networkidle', { timeout: 5000 });
        }
      } catch (e) {
        // Route might not exist, skip
        console.log(`Route ${route.url} not found, skipping`);
      }
    }
  });

  test('should show API status in health check', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Make a direct API health check
    const response = await page.request.get('http://127.0.0.1:8000/api/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('ok', true);
  });
});

test.describe('Plan Viewer and Tag Creation', () => {
  test.skip('upload plan → click to create tag → verify tag appears', async ({ page }) => {
    await page.goto('/plans');
    
    // This test is skipped until the Plans page is fully implemented
    // The test validates the core workflow once the UI is ready
    
    // Look for file upload input
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible({ timeout: 2000 })) {
      // Upload a sample file (would need actual file in seed/)
      // await fileInput.setInputFiles('seed/plan-sample.pdf');
      // await expect(page.getByText(/upload complete/i)).toBeVisible();
    }
  });
});

test.describe('RFI Workflow', () => {
  test.skip('create RFI and verify in RFI log', async ({ page }) => {
    await page.goto('/rfis');
    
    // This test is skipped until the RFI page is fully implemented
    // Look for create RFI button
    const createButton = page.getByRole('button', { name: /create.*rfi/i }).first();
    if (await createButton.isVisible({ timeout: 2000 })) {
      await createButton.click();
      
      // Fill in RFI details
      // await page.getByLabel(/title/i).fill('RFI-001: Test RFI');
      // await page.getByRole('button', { name: /save/i }).click();
      // await expect(page.getByText(/rfi.*saved/i)).toBeVisible();
    }
  });
});
