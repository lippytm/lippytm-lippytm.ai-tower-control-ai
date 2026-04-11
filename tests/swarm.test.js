'use strict';

const request = require('supertest');
const app = require('../src/server');
const { generateToken } = require('../src/security/auth');
const agentModule = require('../src/swarm/agent');
const orchestrator = require('../src/swarm/orchestrator');

process.env.JWT_SECRET = 'test-secret-1234';

const auth = () => `Bearer ${generateToken({ clientId: 'test', role: 'api-consumer' })}`;

beforeEach(() => {
  agentModule._resetForTests();
  orchestrator._resetForTests();
});

// ── AgentBot CRUD ──────────────────────────────────────────────────────────────

describe('POST /api/swarm/agents', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/swarm/agents').send({ name: 'bot1' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name is required/i);
  });

  it('returns 400 for unknown channel types', async () => {
    const res = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'bot1', channels: ['unknown-channel'] });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Unknown channel type/i);
  });

  it('creates an agent and returns 201', async () => {
    const res = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'bot1', role: 'worker', channels: ['openai'] });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('agentId');
    expect(res.body.name).toBe('bot1');
    expect(res.body.state).toBe('idle');
    expect(res.body.channels).toEqual(['openai']);
  });
});

describe('GET /api/swarm/agents', () => {
  it('returns empty list when no agents exist', async () => {
    const res = await request(app)
      .get('/api/swarm/agents')
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.agents).toEqual([]);
  });

  it('lists all agents', async () => {
    await request(app).post('/api/swarm/agents').set('Authorization', auth()).send({ name: 'a1' });
    await request(app).post('/api/swarm/agents').set('Authorization', auth()).send({ name: 'a2' });
    const res = await request(app).get('/api/swarm/agents').set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.agents).toHaveLength(2);
  });
});

describe('GET /api/swarm/agents/:agentId', () => {
  it('returns 404 for unknown agentId', async () => {
    const res = await request(app)
      .get('/api/swarm/agents/does-not-exist')
      .set('Authorization', auth());
    expect(res.status).toBe(404);
  });

  it('returns agent details', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'bot-x' });
    const { agentId } = createRes.body;

    const res = await request(app)
      .get(`/api/swarm/agents/${agentId}`)
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.agentId).toBe(agentId);
  });
});

describe('PATCH /api/swarm/agents/:agentId', () => {
  it('returns 404 for unknown agentId', async () => {
    const res = await request(app)
      .patch('/api/swarm/agents/does-not-exist')
      .set('Authorization', auth())
      .send({ name: 'updated' });
    expect(res.status).toBe(404);
  });

  it('updates agent config', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'original' });
    const { agentId } = createRes.body;

    const patchRes = await request(app)
      .patch(`/api/swarm/agents/${agentId}`)
      .set('Authorization', auth())
      .send({ name: 'updated', role: 'coordinator' });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.name).toBe('updated');
    expect(patchRes.body.role).toBe('coordinator');
  });
});

describe('DELETE /api/swarm/agents/:agentId', () => {
  it('returns 404 for unknown agentId', async () => {
    const res = await request(app)
      .delete('/api/swarm/agents/does-not-exist')
      .set('Authorization', auth());
    expect(res.status).toBe(404);
  });

  it('deletes an agent and returns 204', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'bye-bot' });
    const { agentId } = createRes.body;

    const delRes = await request(app)
      .delete(`/api/swarm/agents/${agentId}`)
      .set('Authorization', auth());
    expect(delRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/swarm/agents/${agentId}`)
      .set('Authorization', auth());
    expect(getRes.status).toBe(404);
  });
});

describe('POST /api/swarm/agents/:agentId/state', () => {
  it('transitions agent state', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'state-bot' });
    const { agentId } = createRes.body;

    const res = await request(app)
      .post(`/api/swarm/agents/${agentId}/state`)
      .set('Authorization', auth())
      .send({ state: 'running' });
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('running');
  });

  it('returns 400 for invalid state', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'state-bot2' });
    const { agentId } = createRes.body;

    const res = await request(app)
      .post(`/api/swarm/agents/${agentId}/state`)
      .set('Authorization', auth())
      .send({ state: 'exploding' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid state/i);
  });

  it('returns 400 when state field is missing', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'state-bot3' });
    const { agentId } = createRes.body;

    const res = await request(app)
      .post(`/api/swarm/agents/${agentId}/state`)
      .set('Authorization', auth())
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/swarm/agents/:agentId/maintenance-log', () => {
  it('returns maintenance log entries', async () => {
    const createRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'log-bot' });
    const { agentId } = createRes.body;

    const res = await request(app)
      .get(`/api/swarm/agents/${agentId}/maintenance-log`)
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.log.length).toBeGreaterThan(0);
    expect(res.body.log[0].event).toBe('created');
  });
});

// ── Swarm CRUD ─────────────────────────────────────────────────────────────────

describe('POST /api/swarm/swarms', () => {
  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({});
    expect(res.status).toBe(400);
  });

  it('creates a swarm and returns 201', async () => {
    const res = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'swarm-alpha', description: 'test swarm' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('swarmId');
    expect(res.body.name).toBe('swarm-alpha');
    expect(res.body.agentIds).toEqual([]);
  });
});

describe('GET /api/swarm/swarms', () => {
  it('lists all swarms', async () => {
    await request(app).post('/api/swarm/swarms').set('Authorization', auth()).send({ name: 's1' });
    const res = await request(app).get('/api/swarm/swarms').set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.swarms).toHaveLength(1);
  });
});

describe('GET /api/swarm/swarms/:swarmId', () => {
  it('returns 404 for unknown swarmId', async () => {
    const res = await request(app)
      .get('/api/swarm/swarms/no-such-swarm')
      .set('Authorization', auth());
    expect(res.status).toBe(404);
  });

  it('returns swarm details', async () => {
    const createRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'detail-swarm' });
    const { swarmId } = createRes.body;

    const res = await request(app)
      .get(`/api/swarm/swarms/${swarmId}`)
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.swarmId).toBe(swarmId);
  });
});

describe('PATCH /api/swarm/swarms/:swarmId', () => {
  it('updates swarm fields', async () => {
    const createRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'patch-swarm' });
    const { swarmId } = createRes.body;

    const res = await request(app)
      .patch(`/api/swarm/swarms/${swarmId}`)
      .set('Authorization', auth())
      .send({ description: 'updated desc' });
    expect(res.status).toBe(200);
    expect(res.body.description).toBe('updated desc');
  });
});

describe('DELETE /api/swarm/swarms/:swarmId', () => {
  it('deletes a swarm and returns 204', async () => {
    const createRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'del-swarm' });
    const { swarmId } = createRes.body;

    const delRes = await request(app)
      .delete(`/api/swarm/swarms/${swarmId}`)
      .set('Authorization', auth());
    expect(delRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/swarm/swarms/${swarmId}`)
      .set('Authorization', auth());
    expect(getRes.status).toBe(404);
  });
});

// ── Swarm membership ───────────────────────────────────────────────────────────

describe('POST /api/swarm/swarms/:swarmId/agents', () => {
  it('adds an agent to a swarm', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'member-swarm' });
    const { swarmId } = swarmRes.body;

    const agentRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'member-bot' });
    const { agentId } = agentRes.body;

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });
    expect(res.status).toBe(200);
    expect(res.body.agentIds).toContain(agentId);
  });

  it('returns 400 when agentId is missing', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'missing-agent-swarm' });
    const { swarmId } = swarmRes.body;

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({});
    expect(res.status).toBe(400);
  });

  it('returns 409 when agent is already a member', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'dup-swarm' });
    const { swarmId } = swarmRes.body;

    const agentRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'dup-bot' });
    const { agentId } = agentRes.body;

    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });
    expect(res.status).toBe(409);
  });
});

describe('DELETE /api/swarm/swarms/:swarmId/agents/:agentId', () => {
  it('removes an agent from a swarm', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'remove-swarm' });
    const { swarmId } = swarmRes.body;

    const agentRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'remove-bot' });
    const { agentId } = agentRes.body;

    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });

    const res = await request(app)
      .delete(`/api/swarm/swarms/${swarmId}/agents/${agentId}`)
      .set('Authorization', auth());
    expect(res.status).toBe(204);
  });
});

// ── Swarm operations ───────────────────────────────────────────────────────────

describe('POST /api/swarm/swarms/:swarmId/start', () => {
  it('starts idle agents in the swarm', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'start-swarm' });
    const { swarmId } = swarmRes.body;

    const agentRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'idle-bot' });
    const { agentId } = agentRes.body;

    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/start`)
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.started).toContain(agentId);
  });
});

describe('POST /api/swarm/swarms/:swarmId/pause', () => {
  it('pauses running agents in the swarm', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'pause-swarm' });
    const { swarmId } = swarmRes.body;

    const agentRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'run-bot' });
    const { agentId } = agentRes.body;

    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });

    // Start the agent first
    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/start`)
      .set('Authorization', auth());

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/pause`)
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.paused).toContain(agentId);
  });
});

describe('POST /api/swarm/swarms/:swarmId/broadcast', () => {
  it('returns 400 when message is missing', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'bc-swarm' });
    const { swarmId } = swarmRes.body;

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/broadcast`)
      .set('Authorization', auth())
      .send({});
    expect(res.status).toBe(400);
  });

  it('broadcasts to running agents', async () => {
    const swarmRes = await request(app)
      .post('/api/swarm/swarms')
      .set('Authorization', auth())
      .send({ name: 'bc-swarm2' });
    const { swarmId } = swarmRes.body;

    const agentRes = await request(app)
      .post('/api/swarm/agents')
      .set('Authorization', auth())
      .send({ name: 'bc-bot' });
    const { agentId } = agentRes.body;

    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/agents`)
      .set('Authorization', auth())
      .send({ agentId });

    await request(app)
      .post(`/api/swarm/swarms/${swarmId}/start`)
      .set('Authorization', auth());

    const res = await request(app)
      .post(`/api/swarm/swarms/${swarmId}/broadcast`)
      .set('Authorization', auth())
      .send({ message: { type: 'ping' } });
    expect(res.status).toBe(200);
    expect(res.body.delivered).toContain(agentId);
    expect(res.body.skipped).toEqual([]);
  });
});

// ── Health-check ───────────────────────────────────────────────────────────────

describe('POST /api/swarm/health-check', () => {
  it('runs a health-check cycle and returns counts', async () => {
    const res = await request(app)
      .post('/api/swarm/health-check')
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('checked');
    expect(res.body).toHaveProperty('restarted');
    expect(res.body).toHaveProperty('failed');
  });
});

// ── Sync connector list includes 'swarm' ──────────────────────────────────────

describe('GET /api/data/connectors', () => {
  it('includes swarm in the connector list', async () => {
    const res = await request(app)
      .get('/api/data/connectors')
      .set('Authorization', auth());
    expect(res.status).toBe(200);
    expect(res.body.connectors).toContain('swarm');
  });
});
