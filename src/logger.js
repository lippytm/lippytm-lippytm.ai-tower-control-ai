'use strict';

const winston = require('winston');
const Transport = require('winston-transport');

/** Maximum number of log entries retained in memory for the /api/logs endpoint. */
const LOG_BUFFER_SIZE = parseInt(process.env.LOG_BUFFER_SIZE || '500', 10);

/**
 * A custom Winston transport that keeps the most-recent N log entries in a
 * circular in-memory buffer so they can be queried via the /api/logs route.
 */
class MemoryTransport extends Transport {
  constructor(opts = {}) {
    super(opts);
    this._buffer = [];
    this._size = opts.size || LOG_BUFFER_SIZE;
  }

  log(info, callback) {
    if (this._buffer.length >= this._size) {
      this._buffer.shift();
    }
    this._buffer.push({
      level: info.level,
      message: info.message,
      timestamp: info.timestamp || new Date().toISOString(),
      // Carry through any extra metadata (jobId, error, etc.)
      ...Object.fromEntries(
        Object.entries(info).filter(
          ([k]) => !['level', 'message', 'timestamp', 'splat', Symbol.for('level'), Symbol.for('splat'), Symbol.for('message')].includes(k)
        )
      ),
    });
    callback();
  }

  /** Return the buffered entries, optionally filtered by level. */
  getEntries({ level, limit } = {}) {
    let entries = this._buffer.slice();
    if (level) {
      entries = entries.filter((e) => e.level === level);
    }
    if (limit && limit > 0) {
      entries = entries.slice(-limit);
    }
    return entries;
  }

  /** Flush all buffered entries (used in tests). */
  clear() {
    this._buffer = [];
  }
}

const memoryTransport = new MemoryTransport();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    memoryTransport,
  ],
});

/** Expose the memory transport so routes can query buffered entries. */
logger.memoryTransport = memoryTransport;

module.exports = logger;
