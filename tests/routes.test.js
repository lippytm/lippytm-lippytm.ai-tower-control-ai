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

// ── New connector auth guard tests ────────────────────────────────────────────

describe('Perplexity connector auth guard', () => {
  it('returns 401 without token on /perplexity/chat', async () => {
    const res = await request(app).post('/api/connectors/perplexity/chat').send({ messages: [] });
    expect(res.status).toBe(401);
  });

  it('returns 400 with valid token but empty messages', async () => {
    const res = await request(app)
      .post('/api/connectors/perplexity/chat')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ messages: [] });
    expect(res.status).toBe(400);
  });

  it('returns 400 with valid token but missing query on /perplexity/search', async () => {
    const res = await request(app)
      .post('/api/connectors/perplexity/search')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('BotBuilders connector auth guard', () => {
  it('returns 401 without token on GET /botbuilders/bots', async () => {
    const res = await request(app).get('/api/connectors/botbuilders/bots');
    expect(res.status).toBe(401);
  });

  it('returns 400 with valid token but missing message', async () => {
    const res = await request(app)
      .post('/api/connectors/botbuilders/bots/bot1/messages')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('ManyChat connector auth guard', () => {
  it('returns 401 without token on GET /manychat/page', async () => {
    const res = await request(app).get('/api/connectors/manychat/page');
    expect(res.status).toBe(401);
  });

  it('returns 400 with valid token but missing name param', async () => {
    const res = await request(app)
      .get('/api/connectors/manychat/subscribers')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(400);
  });

  it('returns 400 with valid token but missing data body', async () => {
    const res = await request(app)
      .post('/api/connectors/manychat/subscribers/sub1/messages')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('Kartra connector auth guard', () => {
  it('returns 401 without token on GET /kartra/leads', async () => {
    const res = await request(app).get('/api/connectors/kartra/leads');
    expect(res.status).toBe(401);
  });

  it('returns 400 with valid token but missing email param', async () => {
    const res = await request(app)
      .get('/api/connectors/kartra/leads')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(400);
  });

  it('returns 400 with valid token but missing email in body', async () => {
    const res = await request(app)
      .post('/api/connectors/kartra/leads')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ first_name: 'Test' });
    expect(res.status).toBe(400);
  });
});

// ── New connectors listed in /api/data/connectors ─────────────────────────────

describe('GET /api/data/connectors includes new connectors', () => {
  it('lists perplexity, botbuilders, manychat, kartra', async () => {
    const res = await request(app)
      .get('/api/data/connectors')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(200);
    expect(res.body.connectors).toContain('perplexity');
    expect(res.body.connectors).toContain('botbuilders');
    expect(res.body.connectors).toContain('manychat');
    expect(res.body.connectors).toContain('kartra');
  });
});
// ── GET /api/data/sync/:jobId ─────────────────────────────────────────────────

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
