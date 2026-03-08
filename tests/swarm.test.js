'use strict';

const { runSwarm, selfOptimize } = require('../src/connectors/swarm');

// Mock the openai connector so tests don't make real HTTP calls
jest.mock('../src/connectors/openai', () => ({
  chat: jest.fn(),
}));

const openai = require('../src/connectors/openai');

beforeEach(() => {
  jest.clearAllMocks();
});

// ── runSwarm ──────────────────────────────────────────────────────────────────

describe('runSwarm', () => {
  it('throws when agents is not a non-empty array', async () => {
    await expect(runSwarm([], 'input')).rejects.toThrow('agents must be a non-empty array');
    await expect(runSwarm(null, 'input')).rejects.toThrow('agents must be a non-empty array');
  });

  it('throws when initialInput is missing or not a string', async () => {
    const agents = [{ name: 'Agent1', systemPrompt: 'You are helpful.' }];
    await expect(runSwarm(agents, '')).rejects.toThrow('initialInput must be a non-empty string');
    await expect(runSwarm(agents, 123)).rejects.toThrow('initialInput must be a non-empty string');
  });

  it('throws when an agent is missing name or systemPrompt', async () => {
    const agents = [{ name: 'Agent1' }]; // missing systemPrompt
    await expect(runSwarm(agents, 'hello')).rejects.toThrow(
      'Each agent must have a name and systemPrompt'
    );
  });

  it('runs agents sequentially, chaining outputs as inputs', async () => {
    openai.chat
      .mockResolvedValueOnce({ id: 'r1', content: 'Step one output', model: 'gpt-4o', usage: {} })
      .mockResolvedValueOnce({ id: 'r2', content: 'Final output', model: 'gpt-4o', usage: {} });

    const agents = [
      { name: 'Planner', systemPrompt: 'Plan the work.' },
      { name: 'Executor', systemPrompt: 'Execute the plan.' },
    ];

    const result = await runSwarm(agents, 'Do something useful');

    expect(result.output).toBe('Final output');
    expect(result.trace).toHaveLength(2);
    expect(result.trace[0]).toMatchObject({ agent: 'Planner', input: 'Do something useful', output: 'Step one output' });
    expect(result.trace[1]).toMatchObject({ agent: 'Executor', input: 'Step one output', output: 'Final output' });

    // Verify the second call received the first agent's output as user content
    const secondCallMessages = openai.chat.mock.calls[1][0];
    expect(secondCallMessages[1].content).toBe('Step one output');
  });
});

// ── selfOptimize ──────────────────────────────────────────────────────────────

describe('selfOptimize', () => {
  it('throws when content is not a non-empty string', async () => {
    await expect(selfOptimize('')).rejects.toThrow('content must be a non-empty string');
    await expect(selfOptimize(null)).rejects.toThrow('content must be a non-empty string');
  });

  it('throws when rounds is not a positive integer', async () => {
    await expect(selfOptimize('some content', 0)).rejects.toThrow(
      'rounds must be a positive integer'
    );
    await expect(selfOptimize('some content', -1)).rejects.toThrow(
      'rounds must be a positive integer'
    );
  });

  it('runs the correct number of improvement rounds', async () => {
    openai.chat
      .mockResolvedValueOnce({ id: 'r1', content: 'Improved v1', model: 'gpt-4o', usage: {} })
      .mockResolvedValueOnce({ id: 'r2', content: 'Improved v2', model: 'gpt-4o', usage: {} });

    const result = await selfOptimize('Original content', 2);

    expect(result.output).toBe('Improved v2');
    expect(result.rounds).toHaveLength(2);
    expect(result.rounds[0]).toMatchObject({ round: 1, output: 'Improved v1' });
    expect(result.rounds[1]).toMatchObject({ round: 2, output: 'Improved v2' });
    expect(openai.chat).toHaveBeenCalledTimes(2);
  });
});

// ── Swarm HTTP routes ─────────────────────────────────────────────────────────

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');

process.env.JWT_SECRET = 'test-secret-1234';
const validToken = () => generateToken({ clientId: 'test', role: 'api-consumer' });

describe('POST /api/swarm/run', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/swarm/run').send({});
    expect(res.status).toBe(401);
  });

  it('returns 400 when agents is missing', async () => {
    const res = await request(app)
      .post('/api/swarm/run')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ input: 'hello' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/agents/);
  });

  it('returns 400 when input is missing', async () => {
    const res = await request(app)
      .post('/api/swarm/run')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ agents: [{ name: 'A', systemPrompt: 'Be helpful.' }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/input/);
  });

  it('returns swarm result when valid request', async () => {
    openai.chat.mockResolvedValueOnce({
      id: 'r1',
      content: 'Swarm done',
      model: 'gpt-4o',
      usage: {},
    });

    const res = await request(app)
      .post('/api/swarm/run')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({
        agents: [{ name: 'Agent1', systemPrompt: 'You are helpful.' }],
        input: 'Hello swarm',
      });

    expect(res.status).toBe(200);
    expect(res.body.output).toBe('Swarm done');
    expect(Array.isArray(res.body.trace)).toBe(true);
  });
});

describe('POST /api/swarm/optimize', () => {
  it('returns 400 when content is missing', async () => {
    const res = await request(app)
      .post('/api/swarm/optimize')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/content/);
  });

  it('returns 400 when rounds is invalid', async () => {
    const res = await request(app)
      .post('/api/swarm/optimize')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ content: 'some code', rounds: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/rounds/);
  });

  it('returns optimized result when valid', async () => {
    openai.chat.mockResolvedValueOnce({
      id: 'r1',
      content: 'Optimized content',
      model: 'gpt-4o',
      usage: {},
    });

    const res = await request(app)
      .post('/api/swarm/optimize')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ content: 'original code', rounds: 1 });

    expect(res.status).toBe(200);
    expect(res.body.output).toBe('Optimized content');
    expect(res.body.rounds).toHaveLength(1);
  });
});
