'use strict';

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');

process.env.JWT_SECRET = 'test-secret-1234';

const validToken = () => generateToken({ clientId: 'test', role: 'api-consumer' });

// ── /api/auth/token ───────────────────────────────────────────────────────────

describe('POST /api/auth/token', () => {
  it('returns 400 when body is missing', async () => {
    const res = await request(app).post('/api/auth/token').send({});
    expect(res.status).toBe(400);
  });

  it('returns 401 for short clientSecret', async () => {
    const res = await request(app)
      .post('/api/auth/token')
      .send({ clientId: 'myapp', clientSecret: 'short' });
    expect(res.status).toBe(401);
  });

  it('returns a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/token')
      .send({ clientId: 'myapp', clientSecret: 'supersecretkey' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.tokenType).toBe('Bearer');
  });
});

// ── Connector routes (auth guard) ─────────────────────────────────────────────

describe('Connector route auth guard', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/connectors/openai/chat').send({ messages: [] });
    expect(res.status).toBe(401);
  });

  it('returns 400 with valid token but empty messages', async () => {
    const res = await request(app)
      .post('/api/connectors/openai/chat')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ messages: [] });
    expect(res.status).toBe(400);
  });
});

// ── Data-management routes ────────────────────────────────────────────────────

describe('GET /api/data/connectors', () => {
  it('lists supported connectors', async () => {
    const res = await request(app)
      .get('/api/data/connectors')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(200);
    expect(res.body.connectors).toContain('openai');
  });
});

describe('POST /api/data/sync', () => {
  it('returns 400 when source/target missing', async () => {
    const res = await request(app)
      .post('/api/data/sync')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 for unknown connector', async () => {
    const res = await request(app)
      .post('/api/data/sync')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ source: 'unknown', target: 'openai' });
    expect(res.status).toBe(400);
  });

  it('schedules a sync job and returns 202', async () => {
    const res = await request(app)
      .post('/api/data/sync')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ source: 'openai', target: 'allbots' });
    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('jobId');
    expect(res.body.status).toBe('pending');
  });
});

describe('GET /api/data/sync/:jobId', () => {
  it('returns 404 for non-existent job', async () => {
    const res = await request(app)
      .get('/api/data/sync/does-not-exist')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(404);
  });

  it('returns job details for a valid jobId', async () => {
    const createRes = await request(app)
      .post('/api/data/sync')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ source: 'replit', target: 'github-copilot' });
    const { jobId } = createRes.body;

    const getRes = await request(app)
      .get(`/api/data/sync/${jobId}`)
      .set('Authorization', `Bearer ${validToken()}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.jobId).toBe(jobId);
  });
});
