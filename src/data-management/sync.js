'use strict';

const { randomUUID: uuidv4 } = require('crypto');
const logger = require('../logger');

/** Simulated processing delay (ms) used by the stub sync worker. */
const SIMULATED_SYNC_DELAY_MS = 500;


/**
 * In-memory store for sync job state.
 * In production, replace with a persistent database or cache (e.g. Redis / Postgres).
 */
const syncJobs = new Map();

/**
 * Supported connector names (used for validation).
 */
const CONNECTORS = ['openai', 'allbots', 'factory-ai', 'replit', 'github-copilot', 'swarm'];

/**
 * Schedule a new data sync job between a source and target connector.
 * @param {string} source  Source connector name.
 * @param {string} target  Target connector name.
 * @param {object} [options]  Additional options (e.g. filters, transformations).
 * @returns {{ jobId: string, status: string, source: string, target: string, createdAt: string }}
 */
function scheduleSync(source, target, options = {}) {
  if (!CONNECTORS.includes(source)) {
    throw new Error(`Unknown source connector: ${source}. Valid options: ${CONNECTORS.join(', ')}`);
  }
  if (!CONNECTORS.includes(target)) {
    throw new Error(`Unknown target connector: ${target}. Valid options: ${CONNECTORS.join(', ')}`);
  }
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw Object.assign(new Error('options must be an object'), { status: 400 });
  }
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SYNC_SIMULATION !== 'true') {
    logger.error('Sync dispatch rejected: real data transfer is not implemented');
    throw Object.assign(new Error('Real data sync is not implemented; simulation is disabled'), { status: 501 });
  }

  const jobId = uuidv4();
  const job = {
    jobId,
    status: 'pending',
    mode: 'simulation',
    source,
    target,
    options: structuredClone(options),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    result: null,
    error: null,
  };

  syncJobs.set(jobId, job);
  logger.info('Data sync job scheduled', { jobId, source, target });

  // Simulate async processing (replace with real logic per connector pair)
  setImmediate(() => _processSync(jobId));

  return { jobId, status: job.status, mode: job.mode, source, target, createdAt: job.createdAt };
}

/**
 * Get the current status of a sync job.
 * @param {string} jobId
 * @returns {object}
 */
function getSyncJob(jobId) {
  const job = syncJobs.get(jobId);
  if (!job) throw new Error(`Sync job not found: ${jobId}`);
  return structuredClone(job);
}

/**
 * List all sync jobs.
 * @returns {Array<object>}
 */
function listSyncJobs() {
  return Array.from(syncJobs.values(), (job) => structuredClone(job));
}

/**
 * Internal: process a scheduled sync job.
 * This stub simulates work and marks the job complete.
 * Real implementations would pull data from `source` and push to `target`.
 * @param {string} jobId
 */
async function _processSync(jobId) {
  const job = syncJobs.get(jobId);
  if (!job) return;

  _updateJob(jobId, { status: 'running', updatedAt: new Date().toISOString() });
  logger.info('Data sync job running', { jobId, source: job.source, target: job.target });

  try {
    // Placeholder for real connector-specific data transfer logic
    await _simulateWork(SIMULATED_SYNC_DELAY_MS);

    _updateJob(jobId, {
      status: 'simulated',
      updatedAt: new Date().toISOString(),
      result: { recordsSynced: 0, message: 'Simulation only; no records were transferred' },
    });
    logger.info('Data sync simulation finished', { jobId });
  } catch (err) {
    _updateJob(jobId, {
      status: 'failed',
      updatedAt: new Date().toISOString(),
      error: err.message,
    });
    logger.error('Data sync job failed', { jobId, error: err.message });
  }
}

function _updateJob(jobId, fields) {
  const job = syncJobs.get(jobId);
  if (job) syncJobs.set(jobId, { ...job, ...fields });
}

function _simulateWork(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { scheduleSync, getSyncJob, listSyncJobs, CONNECTORS, _resetJobsForTests: () => syncJobs.clear() };
