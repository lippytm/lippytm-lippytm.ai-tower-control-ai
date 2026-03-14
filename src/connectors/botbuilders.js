'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.BOTBUILDERS_API_KEY;
  const baseURL = process.env.BOTBUILDERS_BASE_URL || 'https://api.botbuilders.com/v1';
  if (!apiKey) throw new Error('BOTBUILDERS_API_KEY is not configured');
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
 * List all bots in the BotBuilders account.
 * @returns {Promise<Array>}
 */
async function listBots() {
  logger.debug('BotBuilders: listBots');
  const client = getClient();
  const response = await client.get('/bots');
  return response.data;
}

/**
 * Get details for a specific bot.
 * @param {string} botId
 * @returns {Promise<object>}
 */
async function getBot(botId) {
  logger.debug('BotBuilders: getBot', { botId });
  const client = getClient();
  const response = await client.get(`/bots/${botId}`);
  return response.data;
}

/**
 * Send a message to a BotBuilders bot and receive a reply.
 * @param {string} botId
 * @param {string} message
 * @returns {Promise<object>}
 */
async function sendMessage(botId, message) {
  logger.debug('BotBuilders: sendMessage', { botId });
  const client = getClient();
  const response = await client.post(`/bots/${botId}/messages`, { message });
  return response.data;
}

module.exports = { listBots, getBot, sendMessage };
