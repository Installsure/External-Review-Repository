import { test, expect } from '@playwright/test';

test.describe('InstallSure API Endpoints', () => {
  test('health check should return ok', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('models translate endpoint should accept blueprint', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/models/translate', {
      data: {
        blueprint: 'Sample House A',
        urn: 'urn:sample:demo',
        sheets: ['planA.pdf'],
        meta: { sqft: 1200, floors: 2 },
      },
    });
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.blueprint).toBe('Sample House A');
  });

  test('takeoff sync endpoint should return success', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/takeoff/sync');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('takeoff items endpoint should return items', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/takeoff/items');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.items).toBeDefined();
    expect(Array.isArray(data.items)).toBe(true);
  });

  test('estimate lines endpoint should return cost data', async ({ request }) => {
    const response = await request.get('http://localhost:8080/api/estimate/lines');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.lines).toBeDefined();
    expect(data.totalCost).toBeDefined();
    expect(data.totalLaborHours).toBeDefined();
  });
});
