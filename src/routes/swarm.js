'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput } = require('../security/rateLimiter');
const agentModule = require('../swarm/agent');
const orchestrator = require('../swarm/orchestrator');

// All swarm routes require a valid JWT
router.use(requireAuth);

// ═══════════════════════════════════════════════════════════════════════════════
// AgentBot CRUD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/swarm/agents
 * Body: { name, role?, channels?, metadata? }
 */
router.post('/agents', (req, res, next) => {
  try {
    const { name, role, channels, metadata } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const agent = agentModule.createAgent({
      name: sanitizeInput(name),
      role,
      channels,
      metadata,
    });
    return res.status(201).json(agent);
  } catch (err) {
    if (err.message.includes('Unknown channel type')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

/**
 * GET /api/swarm/agents
 * Query: swarmId?, state?
 */
router.get('/agents', (req, res) => {
  const { swarmId, state } = req.query;
  const agents = agentModule.listAgents({ swarmId, state });
  return res.json({ agents });
});

/**
 * GET /api/swarm/agents/:agentId
 */
router.get('/agents/:agentId', (req, res, next) => {
  try {
    const agent = agentModule.getAgent(req.params.agentId);
    return res.json(agent);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * PATCH /api/swarm/agents/:agentId
 * Body: { name?, role?, channels?, metadata? }
 */
router.patch('/agents/:agentId', (req, res, next) => {
  try {
    const { name, role, channels, metadata } = req.body || {};
    const patch = {};
    if (name !== undefined) patch.name = sanitizeInput(name);
    if (role !== undefined) patch.role = role;
    if (channels !== undefined) patch.channels = channels;
    if (metadata !== undefined) patch.metadata = metadata;

    const agent = agentModule.updateAgentConfig(req.params.agentId, patch);
    return res.json(agent);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    if (err.message.includes('Unknown channel type')) return res.status(400).json({ error: err.message });
    next(err);
  }
});

/**
 * DELETE /api/swarm/agents/:agentId
 */
router.delete('/agents/:agentId', (req, res, next) => {
  try {
    agentModule.deleteAgent(req.params.agentId);
    return res.status(204).end();
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * POST /api/swarm/agents/:agentId/state
 * Body: { state }  – one of idle|running|paused|failed|terminated
 */
router.post('/agents/:agentId/state', (req, res, next) => {
  try {
    const { state } = req.body || {};
    if (!state) return res.status(400).json({ error: 'state is required' });
    const agent = agentModule.updateAgentState(req.params.agentId, state);
    return res.json(agent);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    if (err.message.includes('Invalid state')) return res.status(400).json({ error: err.message });
    next(err);
  }
});

/**
 * GET /api/swarm/agents/:agentId/maintenance-log
 */
router.get('/agents/:agentId/maintenance-log', (req, res, next) => {
  try {
    const log = agentModule.getMaintenanceLog(req.params.agentId);
    return res.json({ agentId: req.params.agentId, log });
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Swarm CRUD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/swarm/swarms
 * Body: { name, description?, scalingPolicy? }
 */
router.post('/swarms', (req, res, next) => {
  try {
    const { name, description, scalingPolicy } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const swarm = orchestrator.createSwarm({
      name: sanitizeInput(name),
      description,
      scalingPolicy,
    });
    return res.status(201).json(swarm);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/swarm/swarms
 */
router.get('/swarms', (_req, res) => {
  const swarms = orchestrator.listSwarms();
  return res.json({ swarms });
});

/**
 * GET /api/swarm/swarms/:swarmId
 */
router.get('/swarms/:swarmId', (req, res, next) => {
  try {
    const swarm = orchestrator.getSwarm(req.params.swarmId);
    return res.json(swarm);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * PATCH /api/swarm/swarms/:swarmId
 * Body: { name?, description?, scalingPolicy? }
 */
router.patch('/swarms/:swarmId', (req, res, next) => {
  try {
    const { name, description, scalingPolicy } = req.body || {};
    const patch = {};
    if (name !== undefined) patch.name = sanitizeInput(name);
    if (description !== undefined) patch.description = sanitizeInput(description);
    if (scalingPolicy !== undefined) patch.scalingPolicy = scalingPolicy;

    const swarm = orchestrator.updateSwarm(req.params.swarmId, patch);
    return res.json(swarm);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * DELETE /api/swarm/swarms/:swarmId
 */
router.delete('/swarms/:swarmId', (req, res, next) => {
  try {
    orchestrator.deleteSwarm(req.params.swarmId);
    return res.status(204).end();
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Swarm membership management
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/swarm/swarms/:swarmId/agents
 * Body: { agentId }
 */
router.post('/swarms/:swarmId/agents', (req, res, next) => {
  try {
    const { agentId } = req.body || {};
    if (!agentId) return res.status(400).json({ error: 'agentId is required' });
    const swarm = orchestrator.addAgentToSwarm(req.params.swarmId, agentId);
    return res.json(swarm);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    if (err.message.includes('already')) return res.status(409).json({ error: err.message });
    next(err);
  }
});

/**
 * DELETE /api/swarm/swarms/:swarmId/agents/:agentId
 */
router.delete('/swarms/:swarmId/agents/:agentId', (req, res, next) => {
  try {
    orchestrator.removeAgentFromSwarm(req.params.swarmId, req.params.agentId);
    return res.status(204).end();
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    if (err.message.includes('not a member')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Swarm operations
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/swarm/swarms/:swarmId/start
 */
router.post('/swarms/:swarmId/start', (req, res, next) => {
  try {
    const result = orchestrator.startSwarm(req.params.swarmId);
    return res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * POST /api/swarm/swarms/:swarmId/pause
 */
router.post('/swarms/:swarmId/pause', (req, res, next) => {
  try {
    const result = orchestrator.pauseSwarm(req.params.swarmId);
    return res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * POST /api/swarm/swarms/:swarmId/broadcast
 * Body: { message: object }
 */
router.post('/swarms/:swarmId/broadcast', (req, res, next) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });
    const result = orchestrator.broadcastToSwarm(req.params.swarmId, message);
    return res.json(result);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
});

/**
 * POST /api/swarm/health-check
 * Trigger a manual health-check cycle across all swarms.
 */
router.post('/health-check', (_req, res, next) => {
  try {
    const result = orchestrator.runHealthCheck();
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
