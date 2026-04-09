'use strict';

const request = require('supertest');
const app = require('../src/server');

describe('Health check', () => {
  it('GET /health returns 200 ok with expected fields', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', service: 'ai-tower-control' });
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('environment');
    expect(typeof res.body.uptimeSeconds).toBe('number');
  });

  it('GET /health response includes X-Request-Id header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('x-request-id');
  });

  it('GET /health honours a caller-supplied X-Request-Id', async () => {
    const id = 'my-custom-id-123';
    const res = await request(app).get('/health').set('X-Request-Id', id);
    expect(res.headers['x-request-id']).toBe(id);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
  });
});

