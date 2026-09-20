'use strict';

const router = require('express').Router();
const { requireAuth } = require('../security/auth');
const { sanitizeInput } = require('../security/rateLimiter');
const jarvis = require('../jarvis/assistant');

router.use(requireAuth);

function sanitizeJarvisPayload(payload = {}) {
  return {
    ...payload,
    goals: Array.isArray(payload.goals) ? payload.goals.map(sanitizeInput) : [],
    checkIn: {
      ...(payload.checkIn || {}),
      blockers: Array.isArray(payload.checkIn?.blockers)
        ? payload.checkIn.blockers.map(sanitizeInput)
        : [],
      symptoms: Array.isArray(payload.checkIn?.symptoms)
        ? payload.checkIn.symptoms.map(sanitizeInput)
        : [],
    },
  };
}

router.get('/tools', (_req, res) => {
  return res.json({
    assistant: 'Jarvis',
    tier: 'free',
    tools: jarvis.getFreeToolsCatalog(),
  });
});

router.post('/check-in', (req, res) => {
  const sanitizedPayload = sanitizeJarvisPayload(req.body || {});

  return res.json(jarvis.runJarvisCheckIn(sanitizedPayload));
});

router.post('/self-heal', (req, res) => {
  const enriched = jarvis.runJarvisCheckIn(sanitizeJarvisPayload(req.body || {}));
  return res.json({
    assistant: enriched.assistant,
    stabilityBand: enriched.stabilityBand,
    selfHealingProtocol: enriched.selfHealingProtocol,
    recommendedTools: enriched.freeTools
      .filter((tool) => jarvis.isHealingTool(tool))
      .map((tool) => ({
        id: tool.id,
        name: tool.name,
        category: tool.category,
        cost: tool.cost,
        value: tool.value,
      })),
  });
});

module.exports = router;
