'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

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

/**
 * Verify an HMAC-SHA256 webhook signature.
 * The caller must pass the raw request body (Buffer) and the signature header value.
 *
 * Expected header format: `sha256=<hex-digest>`
 *
 * @param {Buffer|string} rawBody  Raw request body (before JSON.parse).
 * @param {string} signatureHeader  Value of the `X-Hub-Signature-256` (or similar) header.
 * @param {string} [secret]  Shared webhook secret; defaults to `WEBHOOK_SECRET` env var.
 * @returns {boolean}  `true` if the signature is valid.
 */
function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  const webhookSecret = secret || process.env.WEBHOOK_SECRET;
  if (!webhookSecret) return false;
  if (!signatureHeader) return false;

  const [algorithm, receivedDigest] = signatureHeader.split('=');
  if (algorithm !== 'sha256' || !receivedDigest) return false;

  const expectedDigest = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  const expected = Buffer.from(expectedDigest, 'hex');
  const received = Buffer.from(receivedDigest, 'hex');
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

module.exports = { generateToken, verifyToken, requireAuth, verifyWebhookSignature };
