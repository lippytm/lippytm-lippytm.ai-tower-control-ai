'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput } = require('../security/rateLimiter');
const { listProviders, runTask, compareTask } = require('../orchestration/providers');
const { getProjects, validateHandoff } = require('../orchestration/handoff');
const { getMemory, validateMemoryEntry } = require('../orchestration/memory');

router.use(requireAuth);

function cleanMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    const error = new Error('messages array is required');
    error.status = 400;
    throw error;
  }
  return messages.map((message) => ({ role: message.role, content: sanitizeInput(message.content) }));
}

router.get('/providers', (_req, res) => res.json({ providers: listProviders() }));
router.get('/projects', (_req, res) => res.json({ projects: getProjects() }));
router.get('/memory', (_req, res) => res.json(getMemory()));

router.post('/memory/validate', (req, res) => {
  const result = validateMemoryEntry(req.body);
  res.status(result.valid ? 200 : 400).json(result);
});

router.post('/handoff/validate', (req, res) => {
  const result = validateHandoff(req.body);
  res.status(result.valid ? 200 : 400).json(result);
});

router.post('/run', async (req, res, next) => {
  try {
    const result = await runTask({
      messages: cleanMessages(req.body && req.body.messages),
      provider: (req.body && req.body.provider) || 'openai',
      model: req.body && req.body.model,
    });
    res.json(result);
  } catch (error) { next(error); }
});

router.post('/compare', async (req, res, next) => {
  try {
    const results = await compareTask({
      messages: cleanMessages(req.body && req.body.messages),
      providers: req.body && req.body.providers,
      models: (req.body && req.body.models) || {},
    });
    res.json({ results, humanApprovalRequired: true });
  } catch (error) { next(error); }
});

module.exports = router;
