import { describe, it, expect } from 'vitest';
import { GET } from '../health/route.js';

describe('Health API', () => {
  it('should return health status with database connection', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      db: 'ok',
      timestamp: expect.any(String),
    });
  });

  it('should return timestamp in ISO format', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});
