'use strict';

const jwt = require('jsonwebtoken');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

if (process.env.NODE_ENV === 'production' &&
    (JWT_SECRET.length < 32 || JWT_SECRET.startsWith('CHANGEME'))) {
  throw new Error('Production requires a configured JWT_SECRET of at least 32 characters');
}

/* istanbul ignore next */
if (JWT_SECRET === 'changeme' || JWT_SECRET.length < 32 || JWT_SECRET.startsWith('CHANGEME')) {
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
  requireSigningSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT and return its decoded payload.
 * @param {string} token
 * @returns {object}  Decoded payload.
 * @throws {Error}  If the token is invalid or expired.
 */
function verifyToken(token) {
  requireSigningSecret();
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}

function requireSigningSecret() {
  if (JWT_SECRET.length < 32 || JWT_SECRET.startsWith('CHANGEME')) {
    throw Object.assign(new Error('JWT signing is not configured'), { status: 503 });
  }
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
  } catch (error) {
    if (error.status === 503) {
      return res.status(503).json({ error: error.message });
    }
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { generateToken, verifyToken, requireAuth };
