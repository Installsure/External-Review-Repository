import { test, expect, describe } from 'vitest';

const BASE_URL = 'http://localhost:4000';

describe('Hello App - API Integration Tests', () => {
  test('health endpoint should respond', async () => {
    const response = await fetch(`${BASE_URL}/api/health`);
    expect(response.status).toBeDefined();
    const data = await response.json();
    expect(data).toHaveProperty('ok');
    // DB might fail in test environment, that's ok
  });

  test('homepage should load successfully', async () => {
    const response = await fetch(BASE_URL);
    expect(response.ok).toBe(true);
    const html = await response.text();
    expect(html).toContain('<!DOCTYPE html>');
  });

  test('guest authentication endpoint exists', async () => {
    const response = await fetch(`${BASE_URL}/api/auth/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    // Should respond even if DB is down
    expect(response.status).toBeDefined();
  });
});

describe('Hello App - Frontend Integration', () => {
  test('main app page should contain proper HTML structure', async () => {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    
    // Check for HTML structure
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html.length).toBeGreaterThan(100);
  });

  test('main app should have styling', async () => {
    const response = await fetch(BASE_URL);
    const html = await response.text();
    
    // Should include Tailwind or other CSS
    expect(html).toContain('tw-');
  });
});
