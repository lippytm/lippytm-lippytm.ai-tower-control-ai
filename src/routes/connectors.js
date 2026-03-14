'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput } = require('../security/rateLimiter');
const openai = require('../connectors/openai');
const perplexity = require('../connectors/perplexity');
const allbots = require('../connectors/allbots');
const factoryAi = require('../connectors/factory-ai');
const replit = require('../connectors/replit');
const githubCopilot = require('../connectors/github-copilot');
const botbuilders = require('../connectors/botbuilders');
const manychat = require('../connectors/manychat');
const kartra = require('../connectors/kartra');

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
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });
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
    if (!config || !config.name) return res.status(400).json({ error: 'name is required' });
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
    const repl = await replit.createRepl(req.body);
    return res.status(201).json(repl);
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
    const commit = await githubCopilot.getLatestCommit(req.params.branch);
    return res.json(commit);
  } catch (err) {
    next(err);
  }
});

// ── Perplexity ────────────────────────────────────────────────────────────────

/**
 * POST /api/connectors/perplexity/chat
 * Body: { messages: [{role, content}], model? }
 */
router.post('/perplexity/chat', async (req, res, next) => {
  try {
    const { messages, model } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: sanitizeInput(m.content),
    }));
    const result = await perplexity.chat(sanitizedMessages, model ? { model } : {});
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/perplexity/search
 * Body: { query: string, model? }
 */
router.post('/perplexity/search', async (req, res, next) => {
  try {
    const { query, model } = req.body || {};
    if (!query) return res.status(400).json({ error: 'query is required' });
    const result = await perplexity.search(sanitizeInput(query), model ? { model } : {});
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── BotBuilders ───────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/botbuilders/bots
 */
router.get('/botbuilders/bots', async (_req, res, next) => {
  try {
    const bots = await botbuilders.listBots();
    return res.json({ bots });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/connectors/botbuilders/bots/:botId
 */
router.get('/botbuilders/bots/:botId', async (req, res, next) => {
  try {
    const bot = await botbuilders.getBot(req.params.botId);
    return res.json(bot);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/botbuilders/bots/:botId/messages
 * Body: { message: string }
 */
router.post('/botbuilders/bots/:botId/messages', async (req, res, next) => {
  try {
    const { botId } = req.params;
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });
    const result = await botbuilders.sendMessage(botId, sanitizeInput(message));
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── ManyChat ──────────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/manychat/page
 */
router.get('/manychat/page', async (_req, res, next) => {
  try {
    const info = await manychat.getPageInfo();
    return res.json(info);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/connectors/manychat/subscribers
 * Query: { name: string }
 */
router.get('/manychat/subscribers', async (req, res, next) => {
  try {
    const { name } = req.query || {};
    if (!name) return res.status(400).json({ error: 'name query parameter is required' });
    const subscriber = await manychat.findSubscriber(sanitizeInput(name));
    return res.json(subscriber);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/manychat/subscribers/:subscriberId/messages
 * Body: { data: object }
 */
router.post('/manychat/subscribers/:subscriberId/messages', async (req, res, next) => {
  try {
    const { subscriberId } = req.params;
    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data is required' });
    // Sanitize any top-level string fields in the data payload
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, typeof v === 'string' ? sanitizeInput(v) : v])
    );
    const result = await manychat.sendMessage(subscriberId, sanitizedData);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// ── Kartra ────────────────────────────────────────────────────────────────────

/**
 * GET /api/connectors/kartra/leads
 * Query: { email: string }
 */
router.get('/kartra/leads', async (req, res, next) => {
  try {
    const { email } = req.query || {};
    if (!email) return res.status(400).json({ error: 'email query parameter is required' });
    const lead = await kartra.getLead(sanitizeInput(email));
    return res.json(lead);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/kartra/leads
 * Body: lead fields (first_name, last_name, email, etc.)
 */
router.post('/kartra/leads', async (req, res, next) => {
  try {
    const leadData = req.body;
    if (!leadData || !leadData.email) return res.status(400).json({ error: 'email is required' });
    // Sanitize all string fields in the lead data
    const sanitizedLead = Object.fromEntries(
      Object.entries(leadData).map(([k, v]) => [k, typeof v === 'string' ? sanitizeInput(v) : v])
    );
    const result = await kartra.addLead(sanitizedLead);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/connectors/kartra/leads/:email/sequences/:sequenceId
 */
router.post('/kartra/leads/:email/sequences/:sequenceId', async (req, res, next) => {
  try {
    const { email, sequenceId } = req.params;
    const result = await kartra.subscribeLeadToSequence(email, sequenceId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
