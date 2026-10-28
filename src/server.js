'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const routes = require('./routes/index');
const orchestrator = require('./swarm/orchestrator');

const app = express();

if (process.env.TRUST_PROXY === 'loopback') {
  app.set('trust proxy', 'loopback');
}

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// CORS_ORIGINS accepts a comma-separated list of allowed origins.
// Leave unset (or set to *) to allow all origins (development only).
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : '*';
app.use(cors({ origin: corsOrigins }));

// ── Request tracing ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Global rate limiter ───────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', routes);

// Health check (unauthenticated, for load-balancers / uptime monitors)
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'ai-tower-control' }));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const upstream = err.isAxiosError;
  const status = upstream ? 502 : (Number.isInteger(err.status) && err.status >= 400 && err.status <= 599 ? err.status : 500);
  logger.error('Request failed', {
    status,
    upstreamStatus: err.response?.status,
    code: err.code,
    requestId: _req.requestId,
  });
  const message = upstream ? 'Upstream provider request failed' :
    (status === 500 ? 'Internal server error' :
      (err.type === 'entity.parse.failed' ? 'Invalid JSON body' : err.message));
  res.status(status).json({ error: message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '127.0.0.1';

/* istanbul ignore next */
if (require.main === module) {
  const server = app.listen(PORT, HOST, () => {
    logger.info(`AI Control Tower listening on ${HOST}:${PORT}`);
    if (process.env.SWARM_HEALTH_CHECK_ENABLED === 'true') {
      orchestrator.startHealthCheckLoop();
    }
  });

  // Graceful shutdown on SIGTERM / SIGINT (e.g. Docker stop, Ctrl-C)
  function shutdown(signal) {
    logger.info(`${signal} received – shutting down gracefully`);
    orchestrator.stopHealthCheckLoop();
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force-exit after 10 seconds if connections are still open
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
