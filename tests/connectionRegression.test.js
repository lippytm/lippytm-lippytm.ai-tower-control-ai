'use strict';

jest.mock('axios');
const axios = require('axios');
const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');
const openai = require('../src/connectors/openai');
const github = require('../src/connectors/github-copilot');
const originalEnv = { ...process.env };
const auth = () => `Bearer ${generateToken({ clientId: 'regression' })}`;
const post = (path, body) => request(app).post(path).set('Authorization', auth()).send(body);

beforeEach(() => {
  jest.resetAllMocks();
  process.env.OPENAI_API_KEY = 'test-key';
});
afterEach(() => { process.env = { ...originalEnv }; });

it.each([null, 42, { role: 'user' }, { role: 'user', content: {} }, { role: 'tool', content: 'text' }])(
  'returns 400 for malformed OpenAI messages %# without calling a provider', async (message) => {
    const res = await post('/api/connectors/openai/chat', { messages: [message] });
    expect(res.status).toBe(400);
    expect(axios.post).not.toHaveBeenCalled();
  }
);

it.each([null, [], { unsupported: {} }, { allbots: {} }, { replit: { replId: 42 } }])(
  'rejects malformed broadcast targets %# before paid inference', async (targets) => {
    const res = await post('/api/connectors/chatgpt/broadcast', {
      messages: [{ role: 'user', content: 'Draft' }], targets,
    });
    expect(res.status).toBe(400);
    expect(axios.post).not.toHaveBeenCalled();
  }
);

it('reports missing OpenAI configuration as unavailable', async () => {
  delete process.env.OPENAI_API_KEY;
  expect((await post('/api/connectors/openai/chat', {
    messages: [{ role: 'user', content: 'Draft' }],
  })).status).toBe(503);
});

it.each([
  ['/api/connectors/allbots/bots/test/messages', { message: 42 }],
  ['/api/connectors/allbots/bots', { name: {} }],
  ['/api/connectors/factory-ai/pipelines/test/runs', { inputs: [] }],
  ['/api/connectors/replit/repls', { title: {}, language: 'node' }],
  ['/api/connectors/github-copilot/dispatch', { workflowId: {}, ref: 'main' }],
  ['/api/connectors/github-copilot/dispatch', { workflowId: 'ci.yml', ref: 'main', inputs: [] }],
])('rejects malformed %s payload before external calls', async (path, body) => {
  expect((await post(path, body)).status).toBe(400);
  expect(axios.create).not.toHaveBeenCalled();
});

it.each([{ choices: [] }, {}, { choices: [{ message: { content: null } }] }])(
  'rejects malformed or blocked OpenAI reply %#', async (data) => {
    axios.post.mockResolvedValue({ data });
    await expect(openai.chat([{ role: 'user', content: 'Draft' }])).rejects.toMatchObject({ status: 502 });
  }
);

it('does not broadcast a truncated completion to external targets', async () => {
  axios.post.mockResolvedValue({ data: {
    choices: [{ finish_reason: 'length', message: { content: 'Incomplete output' } }],
  } });
  const res = await post('/api/connectors/chatgpt/broadcast', {
    messages: [{ role: 'user', content: 'Draft' }], targets: { allbots: { botId: 'test-bot' } },
  });
  expect(res.status).toBe(502);
  expect(axios.create).not.toHaveBeenCalled();
});

it('maps upstream errors without leaking raw provider messages or headers', async () => {
  axios.post.mockRejectedValue({
    isAxiosError: true, status: 401, response: { status: 401 },
    message: 'sensitive body and key', code: 'ERR_BAD_REQUEST',
  });
  const res = await post('/api/connectors/openai/chat', {
    messages: [{ role: 'user', content: 'Draft' }],
  });
  expect(res.status).toBe(502);
  expect(res.body).toEqual({ error: 'Upstream provider request failed' });
});

it('reports malformed JSON without echoing its contents', async () => {
  const res = await request(app).post('/api/auth/token').set('Content-Type', 'application/json')
    .send('{"private":"not valid JSON"');
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: 'Invalid JSON body' });
});

it('encodes slash-bearing GitHub branch names as a single path parameter', async () => {
  process.env.GITHUB_OWNER = 'test-owner';
  process.env.GITHUB_REPO = 'test-repo';
  process.env.GITHUB_TOKEN = 'test-token';
  const get = jest.fn().mockResolvedValue({ data: { sha: 'test-sha' } });
  axios.create.mockReturnValue({ get });
  await github.getLatestCommit('feature/jarvis');
  expect(get).toHaveBeenCalledWith('/repos/test-owner/test-repo/commits/feature%2Fjarvis');
});

it('fails closed at the HTTP layer when production sync is not implemented', async () => {
  process.env.NODE_ENV = 'production';
  delete process.env.ENABLE_SYNC_SIMULATION;
  expect((await post('/api/data/sync', { source: 'openai', target: 'swarm' })).status).toBe(501);
});
