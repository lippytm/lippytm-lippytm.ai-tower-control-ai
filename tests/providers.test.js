'use strict';

describe('multi-AI provider registry', () => {
  beforeEach(() => jest.resetModules());

  test('lists OpenAI, Gemini, and Claude without exposing secrets', () => {
    const { listProviders } = require('../src/orchestration/providers');
    const providers = listProviders();
    expect(providers.map((item) => item.name)).toEqual(['openai', 'gemini', 'claude']);
    expect(JSON.stringify(providers)).not.toContain('API_KEY');
  });

  test('rejects an unknown provider', async () => {
    const { runTask } = require('../src/orchestration/providers');
    await expect(runTask({ messages: [], provider: 'unknown' })).rejects.toThrow('Unknown provider');
  });
});
