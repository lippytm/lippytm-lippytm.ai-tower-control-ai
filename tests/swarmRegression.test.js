'use strict';

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');
const agents = require('../src/swarm/agent');
const swarms = require('../src/swarm/orchestrator');
const auth = () => `Bearer ${generateToken({ clientId: 'regression' })}`;
const post = (path, body) => request(app).post(path).set('Authorization', auth()).send(body);

beforeEach(() => {
  swarms._resetForTests();
  agents._resetForTests();
});

it.each([
  { name: ' ' }, { name: 42 }, { name: 'Agent', channels: null },
  { name: 'Agent', channels: 'gemini' }, { name: 'Agent', channels: [{}] },
  { name: 'Agent', role: {} }, { name: 'Agent', metadata: [] },
])('rejects malformed agent config %# with HTTP 400', async (config) => {
  expect((await post('/api/swarm/agents', config)).status).toBe(400);
  expect(agents.listAgents()).toEqual([]);
});

it.each([{ name: ' ' }, { name: 'Swarm', scalingPolicy: [] }, { name: 'Swarm', description: 42 }])(
  'rejects malformed swarm config %# with HTTP 400', async (config) => {
    expect((await post('/api/swarm/swarms', config)).status).toBe(400);
    expect(swarms.listSwarms()).toEqual([]);
  }
);

it('rejects malformed patches without changing an agent', async () => {
  const agent = agents.createAgent({ name: 'original' });
  const res = await request(app).patch(`/api/swarm/agents/${agent.agentId}`)
    .set('Authorization', auth()).send({ channels: null });
  expect(res.status).toBe(400);
  expect(agents.getAgent(agent.agentId).channels).toEqual([]);
});

it('clears the agent association when its swarm is deleted', () => {
  const agent = agents.createAgent({ name: 'Agent' });
  const old = swarms.createSwarm({ name: 'Old' });
  swarms.addAgentToSwarm(old.swarmId, agent.agentId);
  swarms.deleteSwarm(old.swarmId);
  expect(agents.getAgent(agent.agentId)).toMatchObject({ swarmId: null, state: 'terminated' });
  const next = swarms.createSwarm({ name: 'Next' });
  expect(swarms.addAgentToSwarm(next.swarmId, agent.agentId).agentIds).toEqual([agent.agentId]);
});

it('cleans membership before deleting an agent via the API', async () => {
  const agent = agents.createAgent({ name: 'Agent' });
  const swarm = swarms.createSwarm({ name: 'Swarm' });
  swarms.addAgentToSwarm(swarm.swarmId, agent.agentId);
  const res = await request(app).delete(`/api/swarm/agents/${agent.agentId}`)
    .set('Authorization', auth());
  expect(res.status).toBe(204);
  expect(swarms.getSwarm(swarm.swarmId).agentIds).toEqual([]);
  expect(() => agents.getAgent(agent.agentId)).toThrow(/not found/);
});

it('requires membership cleanup for direct agent deletion', () => {
  const agent = agents.createAgent({ name: 'Agent' });
  const swarm = swarms.createSwarm({ name: 'Swarm' });
  swarms.addAgentToSwarm(swarm.swarmId, agent.agentId);
  expect(() => agents.deleteAgent(agent.agentId)).toThrow(/Remove the agent/);
});

it('does not expose mutable agent, swarm, or log state', () => {
  const metadata = { tags: ['original'] };
  const agent = agents.createAgent({ name: 'Agent', metadata });
  metadata.tags.push('argument mutation');
  agent.metadata.tags.push('result mutation');
  agents.getAgent(agent.agentId).metadata.tags.push('getter mutation');
  const patch = { metadata: { tags: ['patched'] } };
  agents.updateAgentConfig(agent.agentId, patch);
  patch.metadata.tags.push('patch mutation');
  expect(agents.getAgent(agent.agentId).metadata.tags).toEqual(['patched']);
  const logs = agents.getMaintenanceLog(agent.agentId);
  logs[0].details.name = 'log mutation';
  expect(agents.getMaintenanceLog(agent.agentId)[0].details.name).toBe('Agent');
  const swarm = swarms.createSwarm({ name: 'Swarm' });
  swarms.addAgentToSwarm(swarm.swarmId, agent.agentId).agentIds.length = 0;
  swarms.getSwarm(swarm.swarmId).agentIds.length = 0;
  expect(swarms.getSwarm(swarm.swarmId).agentIds).toEqual([agent.agentId]);
});

it('labels internal broadcasts as simulated communications', async () => {
  const swarm = swarms.createSwarm({ name: 'Swarm' });
  const res = await post(`/api/swarm/swarms/${swarm.swarmId}/broadcast`, { message: { text: 'Pilot' } });
  expect(res.status).toBe(200);
  expect(res.body.mode).toBe('simulation');
});

it('rejects a malformed broadcast message instead of simulating success', async () => {
  const swarm = swarms.createSwarm({ name: 'Swarm' });
  const res = await post(`/api/swarm/swarms/${swarm.swarmId}/broadcast`, { message: 'not an object' });
  expect(res.status).toBe(400);
});
