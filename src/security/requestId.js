'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Attaches a unique `X-Request-Id` to every request and response.
 * This enables end-to-end correlation of log entries across services.
 *
 * The middleware first honours any `X-Request-Id` supplied by an upstream
 * load-balancer/gateway; otherwise it generates a new UUID v4.
 */
function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || uuidv4();
  req.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}

module.exports = { requestId };
