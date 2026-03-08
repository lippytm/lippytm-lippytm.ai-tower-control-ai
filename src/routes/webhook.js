'use strict';

const crypto = require('crypto');
const router = require('express').Router();
const logger = require('../logger');

/**
 * Verify an HMAC-SHA256 signature supplied in GitHub webhook deliveries.
 * Returns true when the computed digest matches the provided signature header.
 *
 * @param {string} secret      Shared webhook secret.
 * @param {string|Buffer} body Raw request body string/bytes.
 * @param {string} signature   Value of the x-hub-signature-256 header.
 * @returns {boolean}
 */
function verifyGithubSignature(secret, body, signature) {
  if (!signature) return false;
  const expected = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')}`;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch {
    return false;
  }
}

/**
 * POST /api/webhooks/github
 * Receives GitHub webhook events (push, pull_request, workflow_run, etc.).
 * When GITHUB_WEBHOOK_SECRET is set the delivery signature is validated.
 */
router.post('/github', (req, res) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers['x-hub-signature-256'];
    const rawBody = req.rawBody || JSON.stringify(req.body);
    if (!verifyGithubSignature(secret, rawBody, sig)) {
      logger.warn('GitHub webhook: invalid signature');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  }

  const event = req.headers['x-github-event'] || 'unknown';
  const delivery = req.headers['x-github-delivery'] || 'unknown';
  logger.info('GitHub webhook received', { event, delivery });

  return res.status(200).json({ received: true, event, delivery });
});

/**
 * POST /api/webhooks/factory-ai
 * Receives Factory.ai pipeline completion / status events.
 */
router.post('/factory-ai', (req, res) => {
  const payload = req.body || {};
  logger.info('Factory.ai webhook received', {
    pipelineId: payload.pipelineId,
    runId: payload.runId,
    status: payload.status,
  });
  return res.status(200).json({ received: true });
});

/**
 * POST /api/webhooks/allbots
 * Receives AllBots.com.ai agent event notifications.
 */
router.post('/allbots', (req, res) => {
  const payload = req.body || {};
  logger.info('AllBots webhook received', {
    botId: payload.botId,
    event: payload.event,
  });
  return res.status(200).json({ received: true });
});

module.exports = { router, verifyGithubSignature };
