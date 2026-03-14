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

// ── ChatGPT Broadcast route ───────────────────────────────────────────────────

describe('POST /api/connectors/chatgpt/broadcast', () => {
  const openai = require('../src/connectors/openai');
  const allbots = require('../src/connectors/allbots');
  const factoryAi = require('../src/connectors/factory-ai');
  const replit = require('../src/connectors/replit');
  const githubCopilot = require('../src/connectors/github-copilot');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .send({ messages: [{ role: 'user', content: 'hello' }] });
    expect(res.status).toBe(401);
  });

  it('returns 400 when messages is missing', async () => {
    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/messages array is required/);
  });

  it('returns 400 when messages is empty', async () => {
    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ messages: [] });
    expect(res.status).toBe(400);
  });

  it('broadcasts ChatGPT response to all configured targets', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'Hello from ChatGPT',
      model: 'gpt-4o',
      usage: { total_tokens: 10 },
    });
    jest.spyOn(allbots, 'sendMessage').mockResolvedValue({ id: 'msg1' });
    jest.spyOn(factoryAi, 'runPipeline').mockResolvedValue({ runId: 'run1' });
    jest.spyOn(replit, 'runRepl').mockResolvedValue({ output: 'done' });
    jest.spyOn(githubCopilot, 'dispatchWorkflow').mockResolvedValue();

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({
        messages: [{ role: 'user', content: 'Do something' }],
        targets: {
          allbots: { botId: 'bot123' },
          'factory-ai': { pipelineId: 'pipe456' },
          replit: { replId: 'repl789' },
          'github-copilot': { workflowId: 'ci.yml', ref: 'main' },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.chatgpt.content).toBe('Hello from ChatGPT');
    expect(res.body.broadcast.allbots.status).toBe('sent');
    expect(res.body.broadcast['factory-ai'].status).toBe('sent');
    expect(res.body.broadcast.replit.status).toBe('sent');
    expect(res.body.broadcast['github-copilot'].status).toBe('sent');

    expect(allbots.sendMessage).toHaveBeenCalledWith('bot123', 'Hello from ChatGPT');
    expect(factoryAi.runPipeline).toHaveBeenCalledWith('pipe456', { prompt: 'Hello from ChatGPT' });
    expect(replit.runRepl).toHaveBeenCalledWith('repl789', 'Hello from ChatGPT');
    expect(githubCopilot.dispatchWorkflow).toHaveBeenCalledWith('ci.yml', 'main', { prompt: 'Hello from ChatGPT' });
  });

  it('skips targets that are not configured', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'response text',
      model: 'gpt-4o',
      usage: { total_tokens: 5 },
    });

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ messages: [{ role: 'user', content: 'hello' }] });

    expect(res.status).toBe(200);
    expect(res.body.broadcast.allbots.status).toBe('skipped');
    expect(res.body.broadcast['factory-ai'].status).toBe('skipped');
    expect(res.body.broadcast.replit.status).toBe('skipped');
    expect(res.body.broadcast['github-copilot'].status).toBe('skipped');
  });

  it('reports error status for a failing target without aborting others', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'response',
      model: 'gpt-4o',
      usage: {},
    });
    jest.spyOn(allbots, 'sendMessage').mockRejectedValue(new Error('AllBots API down'));
    jest.spyOn(factoryAi, 'runPipeline').mockResolvedValue({ runId: 'run2' });

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({
        messages: [{ role: 'user', content: 'hello' }],
        targets: {
          allbots: { botId: 'bot1' },
          'factory-ai': { pipelineId: 'pipe1' },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.broadcast.allbots.status).toBe('error');
    expect(res.body.broadcast.allbots.error).toMatch(/AllBots API down/);
    expect(res.body.broadcast['factory-ai'].status).toBe('sent');
  });

  it('forwards custom workflow inputs to github-copilot along with the ChatGPT prompt', async () => {
    jest.spyOn(openai, 'chat').mockResolvedValue({
      id: 'chatcmpl-test',
      content: 'gpt output',
      model: 'gpt-4o',
      usage: {},
    });
    jest.spyOn(githubCopilot, 'dispatchWorkflow').mockResolvedValue();

    const res = await request(app)
      .post('/api/connectors/chatgpt/broadcast')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({
        messages: [{ role: 'user', content: 'deploy' }],
        targets: {
          'github-copilot': { workflowId: 'deploy.yml', ref: 'main', inputs: { env: 'production' } },
        },
      });

    expect(res.status).toBe(200);
    expect(githubCopilot.dispatchWorkflow).toHaveBeenCalledWith('deploy.yml', 'main', {
      env: 'production',
      prompt: 'gpt output',
    });
    expect(res.body.broadcast['github-copilot'].status).toBe('sent');
  });
});
