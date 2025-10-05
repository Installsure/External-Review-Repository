import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/simple-server.js';

describe('API Health and Basic Endpoints', () => {
  it('should return health status with ok', async () => {
    const response = await request(app).get('/health').expect(200);
    expect(response.body).toMatchObject({
      status: 'ok',
    });
  });

  it('should return health status on /api/health', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body).toMatchObject({
      status: 'ok',
    });
  });

  it('should list projects', async () => {
    const response = await request(app).get('/api/projects').expect(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should create a project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        name: 'Test Project',
        description: 'A test project',
      })
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name', 'Test Project');
  });

  it('should list tags', async () => {
    const response = await request(app).get('/api/tags').expect(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should create a tag', async () => {
    const response = await request(app)
      .post('/api/tags')
      .send({
        x: 0.5,
        y: 0.3,
        type: 'rfi',
        label: 'Test Tag',
      })
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('x', 0.5);
    expect(response.body.data).toHaveProperty('y', 0.3);
  });

  it('should reject tag with invalid coordinates', async () => {
    const response = await request(app)
      .post('/api/tags')
      .send({
        x: 1.5, // Invalid: > 1
        y: 0.3,
      })
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
  });

  it('should list RFIs', async () => {
    const response = await request(app).get('/api/rfis').expect(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should create an RFI', async () => {
    const response = await request(app)
      .post('/api/rfis')
      .send({
        title: 'Test RFI',
        description: 'A test RFI',
        status: 'open',
      })
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title', 'Test RFI');
    expect(response.body.data).toHaveProperty('status', 'open');
  });

  it('should load demo seed data', async () => {
    const response = await request(app).get('/debug/seed').expect(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Demo data loaded');
    expect(response.body.data.projects).toBeGreaterThan(0);
  });
});
