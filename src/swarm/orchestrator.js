'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');
const agentModule = require('./agent');

/**
 * Interval (ms) between orchestrator health-check cycles.
 * Override via SWARM_HEALTH_CHECK_INTERVAL_MS environment variable.
 */
const HEALTH_CHECK_INTERVAL_MS = parseInt(
  process.env.SWARM_HEALTH_CHECK_INTERVAL_MS || '30000',
  10
);

/**
 * How many consecutive missed heartbeats mark an agent as failed.
 * An agent is considered stale when (now - lastHeartbeat) > STALE_THRESHOLD_MS.
 */
const STALE_THRESHOLD_MS = parseInt(
  process.env.SWARM_STALE_THRESHOLD_MS || '60000',
  10
);

/**
 * Maximum automatic restart attempts before an agent is left in FAILED state.
 */
const MAX_AUTO_RESTARTS = parseInt(process.env.SWARM_MAX_AUTO_RESTARTS || '3', 10);

/**
 * In-memory swarm registry.
 * In production, replace with a persistent store.
 */
const swarms = new Map();

/** Health-check timer reference (used for cleanup). */
let _healthCheckTimer = null;

// ── Swarm lifecycle ────────────────────────────────────────────────────────────

/**
 * Create a new swarm.
 * @param {object} config
 * @param {string} config.name  Human-readable swarm name.
 * @param {string} [config.description='']  Optional description.
 * @param {object} [config.scalingPolicy={}]  Dynamic scaling rules.
 * @returns {object}  Swarm descriptor.
 */
function createSwarm(config) {
  const { name, description = '', scalingPolicy = {} } = config || {};
  if (!name) throw new Error('Swarm name is required');

  const swarmId = uuidv4();
  const now = new Date().toISOString();

  const swarm = {
    swarmId,
    name,
    description,
    scalingPolicy: { ...scalingPolicy },
    agentIds: [],
    state: 'active',
    createdAt: now,
    updatedAt: now,
  };

  swarms.set(swarmId, swarm);
  logger.info('Swarm created', { swarmId, name });
  return { ...swarm };
}

/**
 * Retrieve a swarm by ID.
 * @param {string} swarmId
 * @returns {object}
 */
function getSwarm(swarmId) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);
  return { ...swarm };
}

/**
 * List all swarms.
 * @returns {Array<object>}
 */
function listSwarms() {
  return Array.from(swarms.values()).map((s) => ({ ...s }));
}

/**
 * Update mutable swarm fields (name, description, scalingPolicy).
 * @param {string} swarmId
 * @param {object} patch
 * @returns {object}
 */
function updateSwarm(swarmId, patch) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  const allowedFields = ['name', 'description', 'scalingPolicy'];
  const safePatched = {};
  for (const key of allowedFields) {
    if (patch[key] !== undefined) safePatched[key] = patch[key];
  }

  const updated = { ...swarm, ...safePatched, updatedAt: new Date().toISOString() };
  swarms.set(swarmId, updated);
  logger.info('Swarm updated', { swarmId });
  return { ...updated };
}

/**
 * Dissolve a swarm: terminates all member agents and removes the swarm record.
 * @param {string} swarmId
 */
function deleteSwarm(swarmId) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  for (const agentId of swarm.agentIds) {
    try {
      agentModule.updateAgentState(agentId, agentModule.AGENT_STATES.TERMINATED);
    } catch {
      // Agent may have already been removed; continue cleanup.
    }
  }

  swarms.delete(swarmId);
  logger.info('Swarm deleted', { swarmId });
}

// ── Agent membership ───────────────────────────────────────────────────────────

/**
 * Add an existing AgentBot to a swarm.
 * @param {string} swarmId
 * @param {string} agentId
 * @returns {object}  Updated swarm descriptor.
 */
function addAgentToSwarm(swarmId, agentId) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  const agent = agentModule.getAgent(agentId); // throws if not found

  if (swarm.agentIds.includes(agentId)) {
    throw new Error(`Agent ${agentId} is already a member of swarm ${swarmId}`);
  }
  if (agent.swarmId && agent.swarmId !== swarmId) {
    throw new Error(`Agent ${agentId} already belongs to swarm ${agent.swarmId}`);
  }

  swarm.agentIds.push(agentId);
  swarm.updatedAt = new Date().toISOString();
  swarms.set(swarmId, swarm);

  agentModule._setAgentSwarmId(agentId, swarmId);

  logger.info('Agent added to swarm', { swarmId, agentId });
  return { ...swarm };
}

/**
 * Remove an AgentBot from a swarm (without deleting the agent itself).
 * @param {string} swarmId
 * @param {string} agentId
 * @returns {object}  Updated swarm descriptor.
 */
function removeAgentFromSwarm(swarmId, agentId) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  const idx = swarm.agentIds.indexOf(agentId);
  if (idx === -1) throw new Error(`Agent ${agentId} is not a member of swarm ${swarmId}`);

  swarm.agentIds.splice(idx, 1);
  swarm.updatedAt = new Date().toISOString();
  swarms.set(swarmId, swarm);

  // Disassociate the agent from this swarm
  try {
    agentModule._setAgentSwarmId(agentId, null);
  } catch {
    // Agent may have been deleted separately.
  }

  logger.info('Agent removed from swarm', { swarmId, agentId });
  return { ...swarm };
}

// ── Swarm-level operations ─────────────────────────────────────────────────────

/**
 * Broadcast a message/event to all running agents in a swarm.
 * Each agent's `lastHeartbeat` is updated to simulate acknowledgement.
 *
 * @param {string} swarmId
 * @param {object} message  Payload to broadcast.
 * @returns {{ swarmId: string, delivered: string[], skipped: string[] }}
 */
function broadcastToSwarm(swarmId, message) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  const delivered = [];
  const skipped = [];

  for (const agentId of swarm.agentIds) {
    try {
      const agent = agentModule.getAgent(agentId);
      if (agent.state === agentModule.AGENT_STATES.RUNNING) {
        agentModule.heartbeat(agentId);
        delivered.push(agentId);
      } else {
        skipped.push(agentId);
      }
    } catch {
      skipped.push(agentId);
    }
  }

  logger.info('Swarm broadcast', { swarmId, delivered: delivered.length, skipped: skipped.length, message });
  return { swarmId, delivered, skipped };
}

/**
 * Start all idle/paused agents in a swarm.
 * @param {string} swarmId
 * @returns {{ swarmId: string, started: string[] }}
 */
function startSwarm(swarmId) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  const started = [];
  const startableStates = [agentModule.AGENT_STATES.IDLE, agentModule.AGENT_STATES.PAUSED];

  for (const agentId of swarm.agentIds) {
    try {
      const agent = agentModule.getAgent(agentId);
      if (startableStates.includes(agent.state)) {
        agentModule.updateAgentState(agentId, agentModule.AGENT_STATES.RUNNING);
        started.push(agentId);
      }
    } catch {
      // Skip agents that have been deleted.
    }
  }

  logger.info('Swarm started', { swarmId, started: started.length });
  return { swarmId, started };
}

/**
 * Pause all running agents in a swarm.
 * @param {string} swarmId
 * @returns {{ swarmId: string, paused: string[] }}
 */
function pauseSwarm(swarmId) {
  const swarm = swarms.get(swarmId);
  if (!swarm) throw new Error(`Swarm not found: ${swarmId}`);

  const paused = [];

  for (const agentId of swarm.agentIds) {
    try {
      const agent = agentModule.getAgent(agentId);
      if (agent.state === agentModule.AGENT_STATES.RUNNING) {
        agentModule.updateAgentState(agentId, agentModule.AGENT_STATES.PAUSED);
        paused.push(agentId);
      }
    } catch {
      // Skip agents that have been deleted.
    }
  }

  logger.info('Swarm paused', { swarmId, paused: paused.length });
  return { swarmId, paused };
}

// ── Self-healing / health checks ───────────────────────────────────────────────

/**
 * Run a single health-check cycle across all agents in all swarms.
 * Agents that have not sent a heartbeat within STALE_THRESHOLD_MS are:
 *   - restarted (set back to RUNNING) if errorCount < MAX_AUTO_RESTARTS
 *   - left as FAILED if errorCount >= MAX_AUTO_RESTARTS
 *
 * @returns {{ checked: number, restarted: number, failed: number }}
 */
function runHealthCheck() {
  const now = Date.now();
  let checked = 0;
  let restarted = 0;
  let failed = 0;

  for (const swarm of swarms.values()) {
    for (const agentId of swarm.agentIds) {
      try {
        const agent = agentModule.getAgent(agentId);
        if (agent.state !== agentModule.AGENT_STATES.RUNNING) continue;

        checked++;
        const lastBeat = new Date(agent.lastHeartbeat).getTime();
        const staleness = now - lastBeat;

        if (staleness > STALE_THRESHOLD_MS) {
          logger.warn('Stale agent detected', { agentId, staleMs: staleness });

          if (agent.errorCount < MAX_AUTO_RESTARTS) {
            agentModule.updateAgentState(agentId, agentModule.AGENT_STATES.RUNNING, {
              errorCount: agent.errorCount + 1,
              lastHeartbeat: new Date().toISOString(),
            });
            restarted++;
            logger.info('Agent auto-restarted', { agentId, attempt: agent.errorCount + 1 });
          } else {
            agentModule.updateAgentState(agentId, agentModule.AGENT_STATES.FAILED);
            failed++;
            logger.error('Agent exceeded max restarts; marked FAILED', { agentId });
          }
        }
      } catch {
        // Agent may have been removed; skip.
      }
    }
  }

  return { checked, restarted, failed };
}

/**
 * Start the periodic health-check loop.
 * Safe to call multiple times – subsequent calls are ignored if already running.
 */
function startHealthCheckLoop() {
  if (_healthCheckTimer) return;
  _healthCheckTimer = setInterval(() => {
    try {
      const result = runHealthCheck();
      if (result.checked > 0) {
        logger.debug('Health-check cycle complete', result);
      }
    } catch (err) {
      logger.error('Health-check cycle error', { error: err.message });
    }
  }, HEALTH_CHECK_INTERVAL_MS);

  // Allow the process to exit even if the timer is active.
  if (_healthCheckTimer.unref) _healthCheckTimer.unref();
  logger.info('Swarm health-check loop started', { intervalMs: HEALTH_CHECK_INTERVAL_MS });
}

/**
 * Stop the periodic health-check loop.
 */
function stopHealthCheckLoop() {
  if (_healthCheckTimer) {
    clearInterval(_healthCheckTimer);
    _healthCheckTimer = null;
    logger.info('Swarm health-check loop stopped');
  }
}

/** Reset all state – used only in tests. */
function _resetForTests() {
  stopHealthCheckLoop();
  swarms.clear();
}

module.exports = {
  HEALTH_CHECK_INTERVAL_MS,
  STALE_THRESHOLD_MS,
  MAX_AUTO_RESTARTS,
  createSwarm,
  getSwarm,
  listSwarms,
  updateSwarm,
  deleteSwarm,
  addAgentToSwarm,
  removeAgentFromSwarm,
  broadcastToSwarm,
  startSwarm,
  pauseSwarm,
  runHealthCheck,
  startHealthCheckLoop,
  stopHealthCheckLoop,
  _resetForTests,
};
