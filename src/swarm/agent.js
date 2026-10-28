'use strict';

const { v4: uuidv4 } = require('uuid');
const logger = require('../logger');
const { requireObject, requireText, invalid } = require('../validation');

function validateConfig(config) {
  requireObject(config, 'agent config');
  for (const field of ['name', 'role']) {
    if (config[field] !== undefined) requireText(config[field], field);
  }
  if (config.metadata !== undefined) requireObject(config.metadata, 'metadata');
  if (config.channels !== undefined) {
    if (!Array.isArray(config.channels)) throw invalid('channels must be an array');
    const invalidChannels = config.channels.filter((channel) => !CHANNEL_TYPES.includes(channel));
    if (invalidChannels.length) throw invalid(`Unknown channel type(s): ${invalidChannels.join(', ')}`);
  }
}

/**
 * Valid lifecycle states for an AgentBot.
 */
const AGENT_STATES = Object.freeze({
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  FAILED: 'failed',
  TERMINATED: 'terminated',
});

/**
 * Supported communication channel types for AgentBots.
 */
const CHANNEL_TYPES = Object.freeze(['openai', 'gemini', 'claude', 'allbots', 'factory-ai', 'replit', 'github-copilot', 'internal']);

/**
 * In-memory store for all registered AgentBots.
 * In production, replace with a persistent store (e.g. Redis / Postgres).
 */
const agents = new Map();

/**
 * Maintenance log store keyed by agentId.
 */
const maintenanceLogs = new Map();

/**
 * Create and register a new AgentBot.
 *
 * @param {object} config  Bot configuration.
 * @param {string} config.name  Human-readable name for the agent.
 * @param {string} [config.role='worker']  Role within the swarm (e.g. 'coordinator', 'worker', 'monitor').
 * @param {string[]} [config.channels=[]]  Communication channels the agent participates in.
 * @param {object} [config.metadata={}]  Arbitrary metadata (tags, description, etc.).
 * @returns {object}  Newly created agent descriptor.
 */
function createAgent(config) {
  validateConfig(config);
  const { name, role = 'worker', channels = [], metadata = {} } = config || {};
  requireText(name, 'Agent name');

  const invalidChannels = channels.filter((c) => !CHANNEL_TYPES.includes(c));
  if (invalidChannels.length > 0) {
    throw new Error(`Unknown channel type(s): ${invalidChannels.join(', ')}. Valid options: ${CHANNEL_TYPES.join(', ')}`);
  }

  const agentId = uuidv4();
  const now = new Date().toISOString();

  const agent = {
    agentId,
    name,
    role,
    channels: [...channels],
    state: AGENT_STATES.IDLE,
    metadata: structuredClone(metadata),
    createdAt: now,
    updatedAt: now,
    lastHeartbeat: now,
    errorCount: 0,
    swarmId: null,
  };

  agents.set(agentId, agent);
  _appendMaintenanceLog(agentId, 'created', { name, role, channels });

  logger.info('AgentBot created', { agentId, name, role });
  return structuredClone(agent);
}

/**
 * Retrieve a single AgentBot by ID.
 * @param {string} agentId
 * @returns {object}
 */
function getAgent(agentId) {
  const agent = agents.get(agentId);
  if (!agent) throw new Error(`AgentBot not found: ${agentId}`);
  return structuredClone(agent);
}

/**
 * List all registered AgentBots, optionally filtered by swarmId or state.
 * @param {object} [filters={}]
 * @param {string} [filters.swarmId]  Restrict to agents belonging to a specific swarm.
 * @param {string} [filters.state]   Restrict to agents in a specific state.
 * @returns {Array<object>}
 */
function listAgents(filters = {}) {
  let result = Array.from(agents.values());
  if (filters.swarmId !== undefined) {
    result = result.filter((a) => a.swarmId === filters.swarmId);
  }
  if (filters.state) {
    result = result.filter((a) => a.state === filters.state);
  }
  return result.map((a) => structuredClone(a));
}

/**
 * Transition an AgentBot to a new lifecycle state.
 * @param {string} agentId
 * @param {string} newState  One of AGENT_STATES values.
 * @param {object} [extra={}]  Extra fields to merge into the agent record.
 * @returns {object}  Updated agent descriptor.
 */
function updateAgentState(agentId, newState, extra = {}) {
  const agent = agents.get(agentId);
  if (!agent) throw new Error(`AgentBot not found: ${agentId}`);

  const validStates = Object.values(AGENT_STATES);
  if (!validStates.includes(newState)) {
    throw new Error(`Invalid state: ${newState}. Valid states: ${validStates.join(', ')}`);
  }

  const prevState = agent.state;
  const now = new Date().toISOString();

  const updated = {
    ...agent,
    ...extra,
    state: newState,
    updatedAt: now,
    lastHeartbeat: now,
  };
  agents.set(agentId, updated);

  _appendMaintenanceLog(agentId, 'state_change', { prevState, newState });
  logger.info('AgentBot state changed', { agentId, prevState, newState });

  return structuredClone(updated);
}

/**
 * Update mutable configuration fields of an AgentBot.
 * @param {string} agentId
 * @param {object} patch  Fields to update (name, role, channels, metadata).
 * @returns {object}  Updated agent descriptor.
 */
function updateAgentConfig(agentId, patch) {
  const agent = agents.get(agentId);
  if (!agent) throw new Error(`AgentBot not found: ${agentId}`);
  validateConfig(patch);

  if (patch.channels) {
    const invalidChannels = patch.channels.filter((c) => !CHANNEL_TYPES.includes(c));
    if (invalidChannels.length > 0) {
      throw new Error(`Unknown channel type(s): ${invalidChannels.join(', ')}`);
    }
  }

  const allowedFields = ['name', 'role', 'channels', 'metadata'];
  const safePatched = {};
  for (const key of allowedFields) {
    if (patch[key] !== undefined) safePatched[key] = patch[key];
  }

  const updated = {
    ...agent,
    ...structuredClone(safePatched),
    updatedAt: new Date().toISOString(),
  };
  agents.set(agentId, updated);

  _appendMaintenanceLog(agentId, 'config_updated', safePatched);
  logger.info('AgentBot config updated', { agentId });

  return structuredClone(updated);
}

/**
 * Record a heartbeat for an agent (used by the orchestrator health-checks).
 * @param {string} agentId
 */
function heartbeat(agentId) {
  const agent = agents.get(agentId);
  if (!agent) return;
  agent.lastHeartbeat = new Date().toISOString();
  agents.set(agentId, agent);
}

/**
 * Permanently remove an AgentBot from the registry.
 * @param {string} agentId
 */
function deleteAgent(agentId) {
  if (!agents.has(agentId)) throw new Error(`AgentBot not found: ${agentId}`);
  if (agents.get(agentId).swarmId) {
    throw Object.assign(new Error('Remove the agent from its swarm before deletion'), { status: 409 });
  }
  agents.delete(agentId);
  maintenanceLogs.delete(agentId);
  logger.info('AgentBot deleted', { agentId });
}

/**
 * Get the maintenance log for an AgentBot.
 * @param {string} agentId
 * @returns {Array<object>}
 */
function getMaintenanceLog(agentId) {
  if (!agents.has(agentId)) throw new Error(`AgentBot not found: ${agentId}`);
  return structuredClone(maintenanceLogs.get(agentId) || []);
}

// ── Internal helpers ───────────────────────────────────────────────────────────

function _appendMaintenanceLog(agentId, event, details = {}) {
  const log = maintenanceLogs.get(agentId) || [];
  log.push({ timestamp: new Date().toISOString(), event, details: structuredClone(details) });
  maintenanceLogs.set(agentId, log);
}

/** Reset all state – used only in tests. */
function _resetForTests() {
  agents.clear();
  maintenanceLogs.clear();
}

/**
 * Internal: directly set the swarmId association for an agent.
 * Not exposed as a public API to prevent accidental misuse.
 * @param {string} agentId
 * @param {string|null} swarmId
 */
function _setAgentSwarmId(agentId, swarmId) {
  const agent = agents.get(agentId);
  if (!agent) return;
  agents.set(agentId, { ...agent, swarmId, updatedAt: new Date().toISOString() });
}

module.exports = {
  AGENT_STATES,
  CHANNEL_TYPES,
  createAgent,
  getAgent,
  listAgents,
  updateAgentState,
  updateAgentConfig,
  heartbeat,
  deleteAgent,
  getMaintenanceLog,
  _resetForTests,
  _setAgentSwarmId,
};
