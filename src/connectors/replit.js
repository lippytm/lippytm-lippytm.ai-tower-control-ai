'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.REPLIT_API_KEY;
  const baseURL = process.env.REPLIT_BASE_URL || 'https://replit.com/api/v1';
  if (!apiKey) {throw new Error('REPLIT_API_KEY is not configured');}
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });
}

/**
 * List Repls owned by the authenticated user.
 * @returns {Promise<Array>}
 */
async function listRepls() {
  logger.debug('Replit: listRepls');
  const client = getClient();
  const response = await client.get('/repls');
  return response.data;
}

/**
 * Create a new Repl.
 * @param {object} config  { title, language, description, isPrivate }
 * @returns {Promise<object>}
 */
async function createRepl(config) {
  logger.debug('Replit: createRepl', { title: config.title, language: config.language });
  const client = getClient();
  const response = await client.post('/repls', config);
  return response.data;
}

/**
 * Run (execute) a Repl by its ID.
 * @param {string} replId
 * @returns {Promise<object>}
 */
async function runRepl(replId) {
  logger.debug('Replit: runRepl', { replId });
  const client = getClient();
  const response = await client.post(`/repls/${replId}/run`);
  return response.data;
}

module.exports = { listRepls, createRepl, runRepl };
