'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const sync = require('../data-management/sync');

// All data-management routes require a valid JWT
router.use(requireAuth);

/**
 * GET /api/data/sync
 * List all sync jobs.
 */
router.get('/sync', (_req, res) => {
  return res.json({ jobs: sync.listSyncJobs() });
});

/**
 * POST /api/data/sync
 * Schedule a new data sync job.
 * Body: { source: string, target: string, options?: object }
 */
router.post('/sync', (req, res, next) => {
  try {
    const { source, target, options } = req.body || {};
    if (!source || !target) {
      return res.status(400).json({ error: 'source and target connectors are required' });
    }
    const job = sync.scheduleSync(source, target, options);
    return res.status(202).json(job);
  } catch (err) {
    if (err.message && err.message.startsWith('Unknown')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

/**
 * GET /api/data/sync/:jobId
 * Get the status of a specific sync job.
 */
router.get('/sync/:jobId', (req, res, next) => {
  try {
    const job = sync.getSyncJob(req.params.jobId);
    return res.json(job);
  } catch (err) {
    if (err.message && err.message.startsWith('Sync job not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
});

/**
 * GET /api/data/connectors
 * List supported connector names.
 */
router.get('/connectors', (_req, res) => {
  return res.json({ connectors: sync.CONNECTORS });
});

module.exports = router;
