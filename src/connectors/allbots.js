'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.ALLBOTS_API_KEY;
  const baseURL = process.env.ALLBOTS_BASE_URL || 'https://api.allbots.com.ai';
  if (!apiKey) {throw new Error('ALLBOTS_API_KEY is not configured');}
  return axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 20_000,
  });
}

/**
 * List all bots registered on AllBots.com.ai.
 * @returns {Promise<Array>}
 */
async function listBots() {
  logger.debug('AllBots: listing bots');
  const client = getClient();
  const response = await client.get('/bots');
  return response.data;
}

/**
 * Send a message to a specific AllBots bot.
 * @param {string} botId
 * @param {string} message
 * @returns {Promise<object>}
 */
async function sendMessage(botId, message) {
  logger.debug('AllBots: sendMessage', { botId });
  const client = getClient();
  const response = await client.post(`/bots/${botId}/messages`, { message });
  return response.data;
}

/**
 * Create a new bot on AllBots.com.ai.
 * @param {object} config  Bot configuration (name, description, engine, etc.).
 * @returns {Promise<object>}
 */
async function createBot(config) {
  logger.debug('AllBots: createBot', { name: config.name });
  const client = getClient();
  const response = await client.post('/bots', config);
  return response.data;
}

module.exports = { listBots, sendMessage, createBot };
