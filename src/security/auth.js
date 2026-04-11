'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

/* istanbul ignore next */
if (JWT_SECRET === 'changeme' || JWT_SECRET.length < 32) {
  logger.warn(
    'JWT_SECRET is weak or using the default value. ' +
      'Set a strong secret (≥32 random characters) via the JWT_SECRET environment variable.'
  );
}

/**
 * Generate a signed JWT for an API consumer.
 * @param {object} payload  Data to embed in the token (e.g. { clientId, role }).
 * @param {string} [expiresIn='1h']  Token lifetime.
 * @returns {string}
 */
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT and return its decoded payload.
 * @param {string} token
 * @returns {object}  Decoded payload.
 * @throws {Error}  If the token is invalid or expired.
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Express middleware – requires a valid Bearer token in the Authorization header.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { generateToken, verifyToken, requireAuth };
