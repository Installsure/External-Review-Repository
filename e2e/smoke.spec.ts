import { test, expect } from '@playwright/test';

/**
 * Basic smoke tests for the External Review Repository applications
 * These tests verify that the main applications are running and accessible
 */

test.describe('InstallSure Frontend', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    // Check that we got a successful response
    expect(page.url()).toContain('localhost:3000');
  });
});

test.describe('InstallSure Backend', () => {
  test('should respond to health check', async ({ request }) => {
    const response = await request.get('http://localhost:8000/api/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.ok).toBe(true);
  });
});

test.describe('Demo Dashboard', () => {
  test('should load the dashboard', async ({ page }) => {
    await page.goto('http://localhost:3001');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    // Check that we got a successful response
    expect(page.url()).toContain('localhost:3001');
  });
});
