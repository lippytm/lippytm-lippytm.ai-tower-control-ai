'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput } = require('../security/rateLimiter');
const swarm = require('../connectors/swarm');

// All swarm routes require a valid JWT
router.use(requireAuth);

/**
 * POST /api/swarm/run
 * Run a sequential agent swarm pipeline.
 * Body: { agents: [{name, systemPrompt}], input: string, model? }
 */
router.post('/run', async (req, res, next) => {
  try {
    const { agents, input, model } = req.body || {};

    if (!Array.isArray(agents) || agents.length === 0) {
      return res.status(400).json({ error: 'agents array is required' });
    }
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'input string is required' });
    }

    // Sanitize agent prompts and input
    const sanitizedAgents = agents.map((a) => ({
      name: sanitizeInput(String(a.name || '')),
      systemPrompt: sanitizeInput(String(a.systemPrompt || '')),
    }));
    const sanitizedInput = sanitizeInput(input);

    const result = await swarm.runSwarm(sanitizedAgents, sanitizedInput, model ? { model } : {});
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/swarm/optimize
 * Self-optimisation feedback loop powered by ChatGPT.
 * Body: { content: string, rounds?: number, model? }
 */
router.post('/optimize', async (req, res, next) => {
  try {
    const { content, rounds, model } = req.body || {};

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'content string is required' });
    }

    const parsedRounds =
      rounds !== undefined ? parseInt(String(rounds), 10) : 2;
    if (!Number.isFinite(parsedRounds) || parsedRounds < 1) {
      return res.status(400).json({ error: 'rounds must be a positive integer' });
    }

    const result = await swarm.selfOptimize(
      sanitizeInput(content),
      parsedRounds,
      model ? { model } : {}
    );
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
