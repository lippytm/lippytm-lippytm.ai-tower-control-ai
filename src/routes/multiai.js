'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput } = require('../security/rateLimiter');
const { listProviders, runTask, compareTask } = require('../orchestration/providers');

router.use(requireAuth);

function cleanMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    const error = new Error('messages array is required');
    error.status = 400;
    throw error;
  }
  return messages.map((message) => ({
    role: message.role,
    content: sanitizeInput(message.content),
  }));
}

router.get('/providers', (_req, res) => res.json({ providers: listProviders() }));

router.post('/run', async (req, res, next) => {
  try {
    const result = await runTask({
      messages: cleanMessages(req.body && req.body.messages),
      provider: (req.body && req.body.provider) || 'openai',
      model: req.body && req.body.model,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/compare', async (req, res, next) => {
  try {
    const results = await compareTask({
      messages: cleanMessages(req.body && req.body.messages),
      providers: req.body && req.body.providers,
      models: (req.body && req.body.models) || {},
    });
    res.json({ results, humanApprovalRequired: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
