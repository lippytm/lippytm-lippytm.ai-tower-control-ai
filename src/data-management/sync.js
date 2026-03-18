'use strict';

const { v4: uuidv4 } = require('uuid');
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
const CONNECTORS = ['openai', 'allbots', 'factory-ai', 'replit', 'github-copilot'];

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

  const jobId = uuidv4();
  const job = {
    jobId,
    status: 'pending',
    source,
    target,
    options,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    result: null,
    error: null,
  };

  syncJobs.set(jobId, job);
  logger.info('Data sync job scheduled', { jobId, source, target });

  // Simulate async processing (replace with real logic per connector pair)
  setImmediate(() => _processSync(jobId));

  return { jobId, status: job.status, source, target, createdAt: job.createdAt };
}

/**
 * Get the current status of a sync job.
 * @param {string} jobId
 * @returns {object}
 */
function getSyncJob(jobId) {
  const job = syncJobs.get(jobId);
  if (!job) {throw new Error(`Sync job not found: ${jobId}`);}
  return job;
}

/**
 * List all sync jobs.
 * @returns {Array<object>}
 */
function listSyncJobs() {
  return Array.from(syncJobs.values());
}

/**
 * Internal: process a scheduled sync job.
 * This stub simulates work and marks the job complete.
 * Real implementations would pull data from `source` and push to `target`.
 * @param {string} jobId
 */
async function _processSync(jobId) {
  const job = syncJobs.get(jobId);
  if (!job) {return;}

  _updateJob(jobId, { status: 'running', updatedAt: new Date().toISOString() });
  logger.info('Data sync job running', { jobId, source: job.source, target: job.target });

  try {
    // Placeholder for real connector-specific data transfer logic
    await _simulateWork(SIMULATED_SYNC_DELAY_MS);

    _updateJob(jobId, {
      status: 'completed',
      updatedAt: new Date().toISOString(),
      result: { recordsSynced: 0, message: 'Sync completed successfully' },
    });
    logger.info('Data sync job completed', { jobId });
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
  if (job) {syncJobs.set(jobId, { ...job, ...fields });}
}

function _simulateWork(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { scheduleSync, getSyncJob, listSyncJobs, CONNECTORS, _resetJobsForTests: () => syncJobs.clear() };
