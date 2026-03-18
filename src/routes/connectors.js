'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput, isSafeParam } = require('../security/rateLimiter');
const openai = require('../connectors/openai');
const allbots = require('../connectors/allbots');
const factoryAi = require('../connectors/factory-ai');
const replit = require('../connectors/replit');
const githubCopilot = require('../connectors/github-copilot');

// All connector routes require a valid JWT
router.use(requireAuth);

// ── OpenAI / ChatGPT ──────────────────────────────────────────────────────────

/**
 * POST /api/connectors/openai/chat
 * Body: { messages: [{role, content}], model? }
 */
router.post('/openai/chat', async (req, res, next) => {
  try {
    const { messages, model } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: sanitizeInput(m.content),
    }));
    const result = await openai.chat(sanitizedMessages, model ? { model } : {});
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/connectors/openai/models
 */
router.get('/openai/models', async (_req, res, next) => {
  try {
    const models = await openai.listModels();
    return res.json({ models });
  } catch (err) {
    next(err);
  }
});

// ── AllBots.com.ai ────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/allbots/bots
 */
router.get('/allbots/bots', async (_req, res, next) => {
  try {
    const bots = await allbots.listBots();
    return res.json({ bots });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/allbots/bots/:botId/messages
 * Body: { message: string }
 */
router.post('/allbots/bots/:botId/messages', async (req, res, next) => {
  try {
    const { botId } = req.params;
    if (!isSafeParam(botId)) {
      return res.status(400).json({ error: 'Invalid botId' });
    }
    const { message } = req.body || {};
    if (!message) { return res.status(400).json({ error: 'message is required' }); }
    const result = await allbots.sendMessage(botId, sanitizeInput(message));
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/allbots/bots
 * Body: bot configuration object
 */
router.post('/allbots/bots', async (req, res, next) => {
  try {
    const config = req.body;
    if (!config || !config.name) { return res.status(400).json({ error: 'name is required' }); }
    const bot = await allbots.createBot(config);
    return res.status(201).json(bot);
  } catch (err) {
    next(err);
  }
});

// ── Factory.ai ────────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/factory-ai/pipelines
 */
router.get('/factory-ai/pipelines', async (_req, res, next) => {
  try {
    const pipelines = await factoryAi.listPipelines();
    return res.json({ pipelines });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/factory-ai/pipelines/:pipelineId/runs
 * Body: { inputs: object }
 */
router.post('/factory-ai/pipelines/:pipelineId/runs', async (req, res, next) => {
  try {
    const { pipelineId } = req.params;
    if (!isSafeParam(pipelineId)) {
      return res.status(400).json({ error: 'Invalid pipelineId' });
    }
    const { inputs = {} } = req.body || {};
    const run = await factoryAi.runPipeline(pipelineId, inputs);
    return res.status(202).json(run);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/connectors/factory-ai/pipelines/:pipelineId/runs/:runId
 */
router.get('/factory-ai/pipelines/:pipelineId/runs/:runId', async (req, res, next) => {
  try {
    const { pipelineId, runId } = req.params;
    if (!isSafeParam(pipelineId)) {
      return res.status(400).json({ error: 'Invalid pipelineId' });
    }
    if (!isSafeParam(runId)) {
      return res.status(400).json({ error: 'Invalid runId' });
    }
    const run = await factoryAi.getPipelineRun(pipelineId, runId);
    return res.json(run);
  } catch (err) {
    next(err);
  }
});

// ── Replit ────────────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/replit/repls
 */
router.get('/replit/repls', async (_req, res, next) => {
  try {
    const repls = await replit.listRepls();
    return res.json({ repls });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/replit/repls
 * Body: { title, language, description?, isPrivate? }
 */
router.post('/replit/repls', async (req, res, next) => {
  try {
    const { title, language } = req.body || {};
    if (!title || !language) {
      return res.status(400).json({ error: 'title and language are required' });
    }
    const createdRepl = await replit.createRepl(req.body);
    return res.status(201).json(createdRepl);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/replit/repls/:replId/run
 */
router.post('/replit/repls/:replId/run', async (req, res, next) => {
  try {
    const { replId } = req.params;
    if (!isSafeParam(replId)) {
      return res.status(400).json({ error: 'Invalid replId' });
    }
    const result = await replit.runRepl(replId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── GitHub Copilot ────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/github-copilot/runs
 * Query params forwarded to GitHub Actions API (branch, status, per_page, page)
 */
router.get('/github-copilot/runs', async (req, res, next) => {
  try {
    const runs = await githubCopilot.listWorkflowRuns(req.query);
    return res.json(runs);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/github-copilot/dispatch
 * Body: { workflowId: string, ref: string, inputs?: object }
 */
router.post('/github-copilot/dispatch', async (req, res, next) => {
  try {
    const { workflowId, ref, inputs } = req.body || {};
    if (!workflowId || !ref) {
      return res.status(400).json({ error: 'workflowId and ref are required' });
    }
    if (!isSafeParam(workflowId)) {
      return res.status(400).json({ error: 'Invalid workflowId' });
    }
    await githubCopilot.dispatchWorkflow(workflowId, ref, inputs);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/connectors/github-copilot/commit/:branch
 */
router.get('/github-copilot/commit/:branch', async (req, res, next) => {
  try {
    const { branch } = req.params;
    if (!isSafeParam(branch)) {
      return res.status(400).json({ error: 'Invalid branch name' });
    }
    const commit = await githubCopilot.getLatestCommit(branch);
    return res.json(commit);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
