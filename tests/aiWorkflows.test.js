'use strict';

jest.mock('axios');
const axios = require('axios');
const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');
const { runWorkflow } = require('../scripts/ai-build-review');

const originalEnv = { ...process.env };
const task = {
  prompt: 'Design a Jarvis assistant',
  builder: { provider: 'gemini' },
  reviewer: { provider: 'claude' },
};
const submit = (body) => request(app).post('/api/workflows/build-review')
  .set('Authorization', `Bearer ${generateToken({ clientId: 'pilot' })}`).send(body);

beforeEach(() => {
  jest.clearAllMocks();
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.GEMINI_MODEL = 'test-gemini';
  process.env.ANTHROPIC_API_KEY = 'test-key';
  process.env.CLAUDE_MODEL = 'test-claude';
});
afterEach(() => { process.env = { ...originalEnv }; });

it('requires authentication for workflows and both provider endpoints', async () => {
  for (const path of ['/api/workflows/build-review', '/api/connectors/gemini/generate', '/api/connectors/claude/generate']) {
    expect((await request(app).post(path).send(task)).status).toBe(401);
  }
  expect(axios.post).not.toHaveBeenCalled();
});

it('builds then reviews with the chosen providers without external execution', async () => {
  axios.post.mockResolvedValueOnce({ data: {
    candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Proposed build' }] } }],
  } }).mockResolvedValueOnce({ data: {
    stop_reason: 'end_turn', model: 'test-claude', content: [{ type: 'text', text: 'Approval checklist' }],
  } });
  const res = await submit(task);
  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({
    status: 'awaiting_human_review', externalActionsExecuted: false,
    draft: { provider: 'gemini', content: 'Proposed build' },
    review: { provider: 'claude', content: 'Approval checklist' },
  });
  expect(res.body.workflowId).toEqual(expect.any(String));
  expect(axios.post).toHaveBeenCalledTimes(2);
  expect(axios.post.mock.calls[1][1].messages[0].content).toContain('Proposed build');
});

it('completes the dispatch client, token endpoint, builder, and reviewer round trip offline', async () => {
  process.env.TOWER_CLIENT_ID = 'offline-pilot';
  process.env.TOWER_CLIENT_SECRET = 'offline-test-only-client-secret-123456789';
  axios.post.mockResolvedValueOnce({ data: {
    candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Offline draft' }] } }],
  } }).mockResolvedValueOnce({ data: {
    stop_reason: 'end_turn', model: 'test-claude', content: [{ type: 'text', text: 'Offline review' }],
  } });
  const localTransport = async (url, options) => {
    const response = await request(app).post(new URL(url).pathname)
      .set(options.headers).send(JSON.parse(options.body));
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.body,
    };
  };
  const result = await runWorkflow({
    ...process.env, TOWER_API_URL: 'https://tower.example.com',
    BUILDER_PROVIDER: 'gemini', REVIEWER_PROVIDER: 'claude', AI_PROMPT: 'Draft a disposable pilot',
  }, localTransport);
  expect(result).toMatchObject({
    status: 'awaiting_human_review', externalActionsExecuted: false,
    draft: { content: 'Offline draft' }, review: { content: 'Offline review' },
  });
  expect(axios.post).toHaveBeenCalledTimes(2);
});

it('preflights the reviewer before spending on the builder', async () => {
  delete process.env.ANTHROPIC_API_KEY;
  const res = await submit(task);
  expect(res.status).toBe(503);
  expect(axios.post).not.toHaveBeenCalled();
});

it.each([
  { ...task, reviewer: { provider: 'unknown' } },
  { ...task, builder: null },
  { ...task, prompt: 'x'.repeat(12001) },
])('rejects malformed configuration %# before provider calls', async (body) => {
  expect((await submit(body)).status).toBe(400);
  expect(axios.post).not.toHaveBeenCalled();
});

it('stops after builder failure instead of claiming review success', async () => {
  axios.post.mockRejectedValue(new Error('upstream failure'));
  expect((await submit(task)).status).toBe(502);
  expect(axios.post).toHaveBeenCalledTimes(1);
});

it('reports review failure instead of returning a successful workflow', async () => {
  axios.post.mockResolvedValueOnce({ data: {
    candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Draft' }] } }],
  } }).mockRejectedValueOnce(new Error('review unavailable'));
  const res = await submit(task);
  expect(res.status).toBe(502);
  expect(res.body).not.toHaveProperty('workflowId');
});

it.each([
  ['gemini', { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'Single draft' }] } }] }],
  ['claude', { stop_reason: 'end_turn', model: 'test-claude', content: [{ type: 'text', text: 'Single draft' }] }],
])('exposes an authenticated %s single-prompt endpoint', async (provider, data) => {
  axios.post.mockResolvedValue({ data });
  const res = await request(app).post(`/api/connectors/${provider}/generate`)
    .set('Authorization', `Bearer ${generateToken({ clientId: 'pilot' })}`)
    .send({ prompt: 'Draft a safe proposal' });
  expect(res.status).toBe(200);
  expect(res.body.content).toBe('Single draft');
});

it('accepts Gemini and Claude as descriptive agent communication channels', async () => {
  const res = await request(app).post('/api/swarm/agents')
    .set('Authorization', `Bearer ${generateToken({ clientId: 'pilot' })}`)
    .send({ name: 'Jarvis Pilot', channels: ['gemini', 'claude', 'internal'] });
  expect(res.status).toBe(201);
  expect(res.body.channels).toEqual(['gemini', 'claude', 'internal']);
});
