'use strict';

jest.mock('axios');
const axios = require('axios');
const generation = require('../src/connectors/text-generation');

const originalEnv = { ...process.env };
beforeEach(() => {
  jest.clearAllMocks();
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.GEMINI_API_KEY = 'test-gemini-key';
  process.env.GEMINI_MODEL = 'test-gemini-model';
  process.env.ANTHROPIC_API_KEY = 'test-claude-key';
  process.env.CLAUDE_MODEL = 'test-claude-model';
});
afterEach(() => { process.env = { ...originalEnv }; });

it('uses the Gemini API header and normalizes text without thought parts', async () => {
  axios.post.mockResolvedValue({ data: {
    candidates: [{ finishReason: 'STOP', content: { parts: [
      { text: 'private reasoning', thought: true }, { text: 'Draft' },
    ] } }],
    usageMetadata: { totalTokenCount: 10 },
  } });
  const result = await generation.generate('gemini', 'Build a proposal');
  expect(result.content).toBe('Draft');
  expect(axios.post).toHaveBeenCalledWith(
    'https://generativelanguage.googleapis.com/v1beta/models/test-gemini-model:generateContent',
    expect.objectContaining({ contents: [{ role: 'user', parts: [{ text: 'Build a proposal' }] }] }),
    expect.objectContaining({ headers: { 'x-goog-api-key': 'test-gemini-key' }, timeout: 30000 })
  );
});

it('uses Claude Messages with an explicit output budget', async () => {
  axios.post.mockResolvedValue({ data: {
    id: 'msg-test', model: 'test-claude-model', stop_reason: 'end_turn',
    content: [{ type: 'text', text: 'Review' }], usage: { output_tokens: 10 },
  } });
  const result = await generation.generate('claude', 'Review the draft');
  expect(result).toMatchObject({ id: 'msg-test', content: 'Review' });
  expect(axios.post).toHaveBeenCalledWith(
    'https://api.anthropic.com/v1/messages',
    { model: 'test-claude-model', max_tokens: 2048, messages: [{ role: 'user', content: 'Review the draft' }] },
    expect.objectContaining({
      headers: expect.objectContaining({ 'x-api-key': 'test-claude-key', 'anthropic-version': '2023-06-01' }),
    })
  );
});

it('reuses OpenAI chat with a bounded completion budget', async () => {
  axios.post.mockResolvedValue({ data: {
    id: 'chat-test', model: 'gpt-4o',
    choices: [{ finish_reason: 'stop', message: { content: 'OpenAI draft' } }],
  } });
  const result = await generation.generate('openai', 'Build a proposal', 'gpt-4o');
  expect(result.content).toBe('OpenAI draft');
  expect(axios.post.mock.calls[0][1].max_completion_tokens).toBe(2048);
});

it.each(['unknown', 'constructor', '__proto__'])('rejects unknown provider %s', (provider) => {
  expect(() => generation.validateRequest(provider, 'Draft')).toThrow(/provider must/);
});

it.each(['', ' ', null, 'x'.repeat(32001)])('rejects invalid prompt %#', (prompt) => {
  expect(() => generation.validateRequest('gemini', prompt)).toThrow(/prompt must/);
});

it.each(['', 42, 'models/not-a-model-id'])('rejects invalid model %s', (model) => {
  expect(() => generation.validateRequest('gemini', 'Draft', model)).toThrow(/model/);
});

it('requires credentials and a configured model before calling a provider', async () => {
  delete process.env.GEMINI_MODEL;
  await expect(generation.generate('gemini', 'Draft')).rejects.toMatchObject({ status: 503 });
  delete process.env.GEMINI_API_KEY;
  await expect(generation.generate('gemini', 'Draft', 'test-model')).rejects.toMatchObject({ status: 503 });
  expect(axios.post).not.toHaveBeenCalled();
});

it.each([
  ['openai', { choices: [{ finish_reason: 'length', message: { content: 'Incomplete' } }] }],
  ['gemini', { candidates: [{ finishReason: 'SAFETY' }] }],
  ['gemini', { candidates: [{ finishReason: 'MAX_TOKENS' }] }],
  ['gemini', { candidates: [{ finishReason: 'STOP', content: { parts: [] } }] }],
  ['claude', { stop_reason: 'max_tokens', content: [{ type: 'text', text: 'Incomplete' }] }],
  ['claude', { stop_reason: 'end_turn', content: [] }],
])('does not report blocked, truncated, or empty %s output as success', async (provider, data) => {
  axios.post.mockResolvedValue({ data });
  await expect(generation.generate(provider, 'Draft')).rejects.toMatchObject({ status: 502 });
});

it('does not expose provider errors or credential material to clients', async () => {
  axios.post.mockRejectedValue(new Error('sensitive provider response'));
  await expect(generation.generate('claude', 'Draft')).rejects.toMatchObject({
    status: 502, message: expect.not.stringContaining('sensitive'),
  });
});
