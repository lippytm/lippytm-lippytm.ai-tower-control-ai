'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./logger');
const routes = require('./routes/index');
const { requestId } = require('./security/requestId');

// ── Production safety guard ───────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'changeme') {
  logger.error('JWT_SECRET is set to the default value. Set a strong secret before running in production.');
  process.exit(1);
}

const app = express();

// ── Request-ID (must be first to enable correlation in all downstream logs) ───
app.use(requestId);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

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
  // Allow tests to skip rate limiting by setting DISABLE_RATE_LIMIT=true
  skip: () => process.env.DISABLE_RATE_LIMIT === 'true',
});
app.use(limiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', routes);

// Health check (unauthenticated, for load-balancers / uptime monitors)
const { version } = require('../package.json');
const startTime = Date.now();

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ai-tower-control',
    version,
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  logger.error('Unhandled error', {
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
  });
  const status = err.status || 500;
  // In production, hide internal error details from the response
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3000', 10);

/* istanbul ignore next */
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`AI Control Tower listening on port ${PORT}`);
  });

  // Graceful shutdown: finish in-flight requests before exiting
  const shutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully…`);
    server.close(() => {
      logger.info('HTTP server closed. Exiting.');
      process.exit(0);
    });

    // Force-exit if graceful shutdown exceeds timeout
    setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, parseInt(process.env.SHUTDOWN_TIMEOUT_MS || '10000', 10)).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
