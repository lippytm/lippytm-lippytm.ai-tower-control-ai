'use strict';

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');
const hermes = require('../src/connectors/hermes');

process.env.JWT_SECRET = 'test-secret-1234';

const validToken = () => generateToken({ clientId: 'test', role: 'api-consumer' });

// ── Hermes connector unit tests ───────────────────────────────────────────────

describe('Hermes connector – getClient', () => {
  it('throws when HERMES_API_KEY is not set', async () => {
    const original = process.env.HERMES_API_KEY;
    delete process.env.HERMES_API_KEY;
    await expect(() => hermes.runSkill('test-skill')).rejects.toThrow('HERMES_API_KEY is not configured');
    process.env.HERMES_API_KEY = original;
  });
});

// ── POST /api/connectors/hermes/run ──────────────────────────────────────────

describe('POST /api/connectors/hermes/run', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/connectors/hermes/run').send({ skill: 'nightly-summary' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when skill is missing', async () => {
    const res = await request(app)
      .post('/api/connectors/hermes/run')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/skill is required/);
  });

  it('runs a skill and returns the result', async () => {
    jest.spyOn(hermes, 'runSkill').mockResolvedValue({ status: 'completed', output: 'summary text' });

    const res = await request(app)
      .post('/api/connectors/hermes/run')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ skill: 'nightly-summary', input: 'run it' });

    expect(res.status).toBe(200);
    expect(res.body.output).toBe('summary text');
    expect(hermes.runSkill).toHaveBeenCalledWith('nightly-summary', 'run it', undefined);
  });

  it('runs a skill without input', async () => {
    jest.spyOn(hermes, 'runSkill').mockResolvedValue({ status: 'completed' });

    const res = await request(app)
      .post('/api/connectors/hermes/run')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ skill: 'memory-consolidate' });

    expect(res.status).toBe(200);
    expect(hermes.runSkill).toHaveBeenCalledWith('memory-consolidate', undefined, undefined);
  });
});

// ── GET /api/connectors/hermes/skills ────────────────────────────────────────

describe('GET /api/connectors/hermes/skills', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/connectors/hermes/skills');
    expect(res.status).toBe(401);
  });

  it('returns a list of skills', async () => {
    jest.spyOn(hermes, 'listSkills').mockResolvedValue([{ name: 'nightly-summary' }, { name: 'repo-audit' }]);

    const res = await request(app)
      .get('/api/connectors/hermes/skills')
      .set('Authorization', `Bearer ${validToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.skills).toHaveLength(2);
    expect(res.body.skills[0].name).toBe('nightly-summary');
  });
});

// ── POST /api/connectors/hermes/schedule ─────────────────────────────────────

describe('POST /api/connectors/hermes/schedule', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/connectors/hermes/schedule').send({});
    expect(res.status).toBe(401);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/connectors/hermes/schedule')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ name: 'test' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name, cron, and skill are required/);
  });

  it('creates a scheduled automation', async () => {
    jest.spyOn(hermes, 'scheduleAutomation').mockResolvedValue({ id: 'sched-1', status: 'scheduled' });

    const res = await request(app)
      .post('/api/connectors/hermes/schedule')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ name: 'Nightly Audit', cron: '0 2 * * *', skill: 'repo-audit' });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('scheduled');
  });
});

// ── GET /api/connectors/hermes/memory/search ─────────────────────────────────

describe('GET /api/connectors/hermes/memory/search', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/connectors/hermes/memory/search?q=test');
    expect(res.status).toBe(401);
  });

  it('returns 400 when q is missing', async () => {
    const res = await request(app)
      .get('/api/connectors/hermes/memory/search')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/q \(query\) is required/);
  });

  it('returns memory search results', async () => {
    jest.spyOn(hermes, 'searchMemory').mockResolvedValue([{ session: '2026-01-01', excerpt: 'audit result' }]);

    const res = await request(app)
      .get('/api/connectors/hermes/memory/search?q=audit')
      .set('Authorization', `Bearer ${validToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].excerpt).toBe('audit result');
  });
});

// ── ChatGPT broadcast with hermes target ──────────────────────────────────────

describe('POST /api/connectors/chatgpt/broadcast – hermes target', () => {
  const openai = require('../src/connectors/openai');

  beforeEach(() => jest.clearAllMocks());

  it('broadcasts ChatGPT output to Hermes skill and returns sent status', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'Here is your summary.',
      model: 'gpt-4o',
      usage: { total_tokens: 10 },
    });
    jest.spyOn(hermes, 'runSkill').mockResolvedValue({ status: 'completed' });

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({
        messages: [{ role: 'user', content: 'Summarize today.' }],
        targets: {
          hermes: { skill: 'nightly-summary' },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.broadcast.hermes.status).toBe('sent');
    expect(hermes.runSkill).toHaveBeenCalledWith('nightly-summary', 'Here is your summary.', undefined);
  });

  it('reports hermes as skipped when target is not configured', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'response',
      model: 'gpt-4o',
      usage: {},
    });

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ messages: [{ role: 'user', content: 'hello' }] });

    expect(res.status).toBe(200);
    expect(res.body.broadcast.hermes.status).toBe('skipped');
  });

  it('reports hermes error status without aborting other targets', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'response',
      model: 'gpt-4o',
      usage: {},
    });
    jest.spyOn(hermes, 'runSkill').mockRejectedValue(new Error('Hermes gateway unreachable'));

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({
        messages: [{ role: 'user', content: 'hello' }],
        targets: { hermes: { skill: 'nightly-summary' } },
      });

    expect(res.status).toBe(200);
    expect(res.body.broadcast.hermes.status).toBe('error');
    expect(res.body.broadcast.hermes.error).toMatch(/Hermes gateway unreachable/);
  });
});

// ── Swarm: hermes as valid channel type ───────────────────────────────────────

describe('Swarm: hermes channel type', () => {
  it('accepts hermes as a valid channel when creating an agent', async () => {
    const res = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ name: 'hermes-worker', channels: ['hermes', 'openai'] });

    expect(res.status).toBe(201);
    expect(res.body.channels).toContain('hermes');
  });
});

// ── Data sync: hermes as a valid connector ────────────────────────────────────

describe('POST /api/data/sync – hermes connector', () => {
  it('schedules a sync job with hermes as source', async () => {
    const res = await request(app)
      .post('/api/data/sync')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ source: 'hermes', target: 'openai' });

    expect(res.status).toBe(202);
    expect(res.body.source).toBe('hermes');
  });

  it('schedules a sync job with hermes as target', async () => {
    const res = await request(app)
      .post('/api/data/sync')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ source: 'openai', target: 'hermes' });

    expect(res.status).toBe(202);
    expect(res.body.target).toBe('hermes');
  });
});
