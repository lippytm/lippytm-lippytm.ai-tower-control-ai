'use strict';

const router = require('express').Router();
const { generateToken } = require('../security/auth');
const { createStrictLimiter } = require('../security/rateLimiter');

const strictLimiter = createStrictLimiter();

/**
 * POST /api/auth/token
 * Issue a JWT for a client application.
 * Body: { clientId: string, clientSecret: string }
 *
 * NOTE: In production, validate clientId/clientSecret against a secrets store
 *       (e.g. database or AWS Secrets Manager). This stub accepts any non-empty pair
 *       to keep the example self-contained.
 */
router.post('/token', strictLimiter, (req, res) => {
  const { clientId, clientSecret } = req.body || {};

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'clientId and clientSecret are required' });
  }

  // TODO: replace with real credential validation
  if (clientSecret.length < 8) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ clientId, role: 'api-consumer' });
  return res.json({ token, tokenType: 'Bearer', expiresIn: '1h' });
});

module.exports = router;
