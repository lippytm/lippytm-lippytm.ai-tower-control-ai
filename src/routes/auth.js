'use strict';

const router = require('express').Router();
const { createHash, timingSafeEqual } = require('crypto');
const { generateToken } = require('../security/auth');
const { createStrictLimiter } = require('../security/rateLimiter');
const logger = require('../logger');

const strictLimiter = createStrictLimiter();

function matchesCredential(actual, expected) {
  const digest = (value) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(actual), digest(expected));
}

/**
 * POST /api/auth/token
 * Issue a JWT for a client application.
 * Body: { clientId: string, clientSecret: string }
 *
 * Credentials are provisioned by the operator through the server environment.
 */
router.post('/token', strictLimiter, (req, res) => {
  const { clientId, clientSecret } = req.body || {};

  if (typeof clientId !== 'string' || typeof clientSecret !== 'string' ||
      !clientId || !clientSecret) {
    return res.status(400).json({ error: 'clientId and clientSecret are required' });
  }

  const expectedId = process.env.TOWER_CLIENT_ID;
  const expectedSecret = process.env.TOWER_CLIENT_SECRET;
  if (!expectedId || !expectedSecret || expectedSecret.length < 32) {
    logger.error('API client authentication is not configured');
    return res.status(503).json({ error: 'API client authentication is not configured' });
  }

  const idMatches = matchesCredential(clientId, expectedId);
  const secretMatches = matchesCredential(clientSecret, expectedSecret);
  if (!idMatches || !secretMatches) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ clientId, role: 'api-consumer' });
  return res.json({ token, tokenType: 'Bearer', expiresIn: '1h' });
});

module.exports = router;
