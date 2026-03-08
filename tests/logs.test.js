'use strict';

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');
const logger = require('../src/logger');

process.env.JWT_SECRET = 'test-secret-1234';
const validToken = () => generateToken({ clientId: 'test', role: 'api-consumer' });

// Mock openai for the /analyze endpoint
jest.mock('../src/connectors/openai', () => ({
  chat: jest.fn(),
}));
const openai = require('../src/connectors/openai');

beforeEach(() => {
  logger.memoryTransport.clear();
  jest.clearAllMocks();
});

// ── MemoryTransport unit tests ────────────────────────────────────────────────

describe('MemoryTransport', () => {
  it('buffers log entries emitted by the logger', () => {
    logger.info('test message one');
    logger.warn('test warning');

    const entries = logger.memoryTransport.getEntries();
    const messages = entries.map((e) => e.message);
    expect(messages).toContain('test message one');
    expect(messages).toContain('test warning');
  });

  it('filters entries by level', () => {
    logger.info('info entry');
    logger.warn('warn entry');

    const warnOnly = logger.memoryTransport.getEntries({ level: 'warn' });
    expect(warnOnly.every((e) => e.level === 'warn')).toBe(true);
  });

  it('respects the limit option', () => {
    for (let i = 0; i < 10; i++) logger.info(`entry ${i}`);
    const limited = logger.memoryTransport.getEntries({ limit: 3 });
    expect(limited.length).toBeLessThanOrEqual(3);
  });

  it('clear() empties the buffer', () => {
    logger.info('before clear');
    logger.memoryTransport.clear();
    expect(logger.memoryTransport.getEntries()).toHaveLength(0);
  });
});

// ── GET /api/logs/recent ──────────────────────────────────────────────────────

describe('GET /api/logs/recent', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/logs/recent');
    expect(res.status).toBe(401);
  });

  it('returns buffered log entries', async () => {
    logger.info('hello from test');

    const res = await request(app)
      .get('/api/logs/recent')
      .set('Authorization', `Bearer ${validToken()}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.entries)).toBe(true);
    expect(typeof res.body.count).toBe('number');
  });

  it('filters by level via query param', async () => {
    logger.warn('a warning');
    logger.info('an info');

    const res = await request(app)
      .get('/api/logs/recent?level=warn')
      .set('Authorization', `Bearer ${validToken()}`);

    expect(res.status).toBe(200);
    expect(res.body.entries.every((e) => e.level === 'warn')).toBe(true);
  });
});

// ── POST /api/logs/analyze ────────────────────────────────────────────────────

describe('POST /api/logs/analyze', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/logs/analyze').send({});
    expect(res.status).toBe(401);
  });

  it('returns a message when no log entries are available', async () => {
    // buffer is already cleared in beforeEach
    const res = await request(app)
      .post('/api/logs/analyze')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.analysis).toMatch(/No log entries/);
  });

  it('calls OpenAI and returns the analysis', async () => {
    logger.info('some informational entry');
    logger.error('an error occurred');

    openai.chat.mockResolvedValueOnce({
      id: 'r1',
      content: 'Everything looks fine.',
      model: 'gpt-4o',
      usage: {},
    });

    const res = await request(app)
      .post('/api/logs/analyze')
      .set('Authorization', `Bearer ${validToken()}`)
      .send({ question: 'Are there any errors?' });

    expect(res.status).toBe(200);
    expect(res.body.analysis).toBe('Everything looks fine.');
    expect(typeof res.body.entriesAnalyzed).toBe('number');
    expect(res.body.entriesAnalyzed).toBeGreaterThan(0);
  });
});
