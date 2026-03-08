'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const logger = require('../logger');
const openai = require('../connectors/openai');

// All log routes require a valid JWT
router.use(requireAuth);

/**
 * GET /api/logs/recent
 * Return recently buffered log entries.
 * Query params:
 *   level  – filter by log level (info, warn, error, debug)
 *   limit  – max number of entries to return (default 100)
 */
router.get('/recent', (req, res) => {
  const { level, limit } = req.query;
  const parsedLimit = limit ? parseInt(String(limit), 10) : 100;
  const entries = logger.memoryTransport.getEntries({
    level: level || undefined,
    limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 100,
  });
  return res.json({ entries, count: entries.length });
});

/**
 * POST /api/logs/analyze
 * Use OpenAI ChatGPT to interpret recent log entries and surface insights.
 * Body: { level?, limit?, question? }
 *   level    – filter logs by level before sending to OpenAI
 *   limit    – max entries to include (default 50)
 *   question – optional free-form question about the logs
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { level, limit, question } = req.body || {};
    const parsedLimit = limit ? parseInt(String(limit), 10) : 50;

    const entries = logger.memoryTransport.getEntries({
      level: level || undefined,
      limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 50,
    });

    if (entries.length === 0) {
      return res.json({ analysis: 'No log entries found matching the given criteria.' });
    }

    const logText = entries
      .map((e) => `[${e.timestamp}] ${e.level.toUpperCase()}: ${e.message}`)
      .join('\n');

    const userContent = question
      ? `Here are the recent log entries:\n\n${logText}\n\nQuestion: ${question}`
      : `Here are the recent log entries. Please summarise any errors, warnings, or unusual patterns:\n\n${logText}`;

    const messages = [
      {
        role: 'system',
        content:
          'You are an expert DevOps and AI systems reliability engineer. ' +
          'Analyse the provided log entries and give a concise diagnostic summary ' +
          'with actionable recommendations where applicable.',
      },
      { role: 'user', content: userContent },
    ];

    const result = await openai.chat(messages);
    return res.json({ analysis: result.content, entriesAnalyzed: entries.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
