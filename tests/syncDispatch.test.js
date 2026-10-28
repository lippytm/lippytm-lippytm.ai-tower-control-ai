'use strict';

const { dispatchSync } = require('../scripts/dispatch-sync');
const env = {
  TOWER_API_URL: 'https://tower.example.com',
  TOWER_CLIENT_ID: 'test-client',
  TOWER_CLIENT_SECRET: 'test-client-secret',
  SYNC_EVENT_TYPE: 'openai-sync',
  SYNC_PAYLOAD: JSON.stringify({
    source: 'openai', target: 'swarm', options: { note: 'quotes " and $(not-a-shell-command)' },
  }),
};
const response = (data) => ({ ok: true, json: async () => data });

it('preserves JSON payloads without shell interpretation and checks the dispatch result', async () => {
  const result = { jobId: 'test-job', status: 'pending', mode: 'simulation' };
  const request = jest.fn()
    .mockResolvedValueOnce(response({ token: 'test-token' }))
    .mockResolvedValueOnce(response(result));
  await expect(dispatchSync(env, request)).resolves.toEqual(result);
  expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({
    clientId: env.TOWER_CLIENT_ID, clientSecret: env.TOWER_CLIENT_SECRET,
  });
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual(JSON.parse(env.SYNC_PAYLOAD));
  expect(request.mock.calls[1][1].redirect).toBe('error');
});

it.each([
  { SYNC_PAYLOAD: '{' }, { SYNC_PAYLOAD: 'null' }, { SYNC_PAYLOAD: '[]' },
  { SYNC_PAYLOAD: '{}' }, { SYNC_PAYLOAD: '{"source":"unknown","target":"swarm"}' },
  { SYNC_EVENT_TYPE: 'replit-sync' }, { TOWER_API_URL: 'http://tower.example.com' },
])('rejects invalid payload, event type, or destination %# before authentication', async (override) => {
  const request = jest.fn();
  await expect(dispatchSync({ ...env, ...override }, request)).rejects.toThrow();
  expect(request).not.toHaveBeenCalled();
});

it('does not dispatch after failed login', async () => {
  const request = jest.fn().mockResolvedValue({ ok: false, status: 401 });
  await expect(dispatchSync(env, request)).rejects.toThrow(/HTTP 401/);
  expect(request).toHaveBeenCalledTimes(1);
});

it.each([null, {}, { token: ' ' }])('rejects malformed login result %#', async (login) => {
  const request = jest.fn().mockResolvedValue(response(login));
  await expect(dispatchSync(env, request)).rejects.toThrow(/no token/);
  expect(request).toHaveBeenCalledTimes(1);
});

it('reports production sync not implemented instead of success', async () => {
  const request = jest.fn()
    .mockResolvedValueOnce(response({ token: 'test-token' }))
    .mockResolvedValueOnce({ ok: false, status: 501 });
  await expect(dispatchSync(env, request)).rejects.toThrow(/HTTP 501/);
});

it('rejects success-shaped replies without the simulation boundary', async () => {
  const request = jest.fn()
    .mockResolvedValueOnce(response({ token: 'test-token' }))
    .mockResolvedValueOnce(response({ jobId: 'test-job', status: 'pending' }));
  await expect(dispatchSync(env, request)).rejects.toThrow(/invalid simulated/);
});
