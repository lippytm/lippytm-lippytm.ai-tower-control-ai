'use strict';

const { runWorkflow } = require('../scripts/ai-build-review');

const env = {
  TOWER_API_URL: 'https://tower.example.com',
  TOWER_CLIENT_ID: 'test-client',
  TOWER_CLIENT_SECRET: 'test-client-secret',
  BUILDER_PROVIDER: 'gemini',
  REVIEWER_PROVIDER: 'claude',
  AI_PROMPT: 'Draft a proposal with "quotes" and $(no-shell-execution)',
};
const draft = {
  status: 'awaiting_human_review', externalActionsExecuted: false,
  draft: { content: 'Proposal' }, review: { content: 'Review' },
};
const response = (body) => ({ ok: true, json: async () => body });

it('authenticates, passes input as JSON, and returns a draft for approval', async () => {
  const request = jest.fn()
    .mockResolvedValueOnce(response({ token: 'test-token' }))
    .mockResolvedValueOnce(response(draft));
  await expect(runWorkflow(env, request)).resolves.toEqual(draft);
  expect(request).toHaveBeenCalledTimes(2);
  expect(String(request.mock.calls[1][0])).toBe('https://tower.example.com/api/workflows/build-review');
  expect(request.mock.calls[1][1]).toMatchObject({
    redirect: 'error',
    headers: { Authorization: 'Bearer test-token' },
  });
  expect(JSON.parse(request.mock.calls[1][1].body).prompt).toBe(env.AI_PROMPT);
});

it.each([
  { TOWER_API_URL: 'http://tower.example.com' },
  { TOWER_API_URL: 'https://user:password@tower.example.com' },
  { TOWER_API_URL: 'https://tower.example.com/path' },
  { TOWER_API_URL: 'https://tower.example.com?token=private' },
  { TOWER_CLIENT_SECRET: '' },
  { BUILDER_PROVIDER: 'unknown' },
  { AI_PROMPT: '' },
])('rejects invalid dispatch configuration %# without network access', async (override) => {
  const request = jest.fn();
  await expect(runWorkflow({ ...env, ...override }, request)).rejects.toThrow();
  expect(request).not.toHaveBeenCalled();
});

it('stops after failed authentication', async () => {
  const request = jest.fn().mockResolvedValue({ ok: false, status: 401 });
  await expect(runWorkflow(env, request)).rejects.toThrow(/HTTP 401/);
  expect(request).toHaveBeenCalledTimes(1);
});

it('rejects missing tokens', async () => {
  const request = jest.fn().mockResolvedValue(response({}));
  await expect(runWorkflow(env, request)).rejects.toThrow(/no token/);
  expect(request).toHaveBeenCalledTimes(1);
});

it('fails on provider-workflow errors instead of saving success', async () => {
  const request = jest.fn()
    .mockResolvedValueOnce(response({ token: 'test-token' }))
    .mockResolvedValueOnce({ ok: false, status: 502 });
  await expect(runWorkflow(env, request)).rejects.toThrow(/HTTP 502/);
});

it('rejects success-shaped results that are not draft-only responses', async () => {
  const request = jest.fn()
    .mockResolvedValueOnce(response({ token: 'test-token' }))
    .mockResolvedValueOnce(response({ ...draft, externalActionsExecuted: true }));
  await expect(runWorkflow(env, request)).rejects.toThrow(/invalid draft/);
});
