import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../auth/guest/route.js';

describe('Auth API - Guest', () => {
  it('should create a new guest user and return token', async () => {
    const request = new Request('http://localhost/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('userId');
    expect(data.userId).toMatch(/^guest_/);
    expect(typeof data.token).toBe('string');
    expect(data.token.length).toBeGreaterThan(0);
  });

  it('should reuse existing userId if provided', async () => {
    const existingUserId = 'guest_test123';
    
    const request = new Request('http://localhost/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: existingUserId }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.userId).toBe(existingUserId);
  });

  it('should return valid base64 encoded token', async () => {
    const request = new Request('http://localhost/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    // Token should be valid base64
    expect(() => {
      const decoded = Buffer.from(data.token, 'base64').toString();
      JSON.parse(decoded);
    }).not.toThrow();
  });

  it('should handle malformed request body gracefully', async () => {
    const request = new Request('http://localhost/api/auth/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still create a user even with invalid JSON
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('userId');
    expect(data).toHaveProperty('token');
  });
});
