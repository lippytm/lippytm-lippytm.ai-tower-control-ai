'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.MANYCHAT_API_KEY;
  if (!apiKey) throw new Error('MANYCHAT_API_KEY is not configured');
  return axios.create({
    baseURL: 'https://api.manychat.com',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 20_000,
  });
}

/**
 * Get information about the connected ManyChat page / account.
 * @returns {Promise<object>}
 */
async function getPageInfo() {
  logger.debug('ManyChat: getPageInfo');
  const client = getClient();
  const response = await client.get('/fb/page/getInfo');
  return response.data;
}

/**
 * Find a subscriber by name.
 * @param {string} name  Subscriber's full name.
 * @returns {Promise<object>}
 */
async function findSubscriber(name) {
  logger.debug('ManyChat: findSubscriber', { name });
  const client = getClient();
  const response = await client.get('/fb/subscriber/findByName', { params: { name } });
  return response.data;
}

/**
 * Send a message to a subscriber.
 * @param {string} subscriberId  ManyChat subscriber ID.
 * @param {object} data  Message data ({ message_tag, data: [...] }).
 * @returns {Promise<object>}
 */
async function sendMessage(subscriberId, data) {
  logger.debug('ManyChat: sendMessage', { subscriberId });
  const client = getClient();
  const response = await client.post('/fb/sending/sendContent', {
    subscriber_id: subscriberId,
    data,
  });
  return response.data;
}

module.exports = { getPageInfo, findSubscriber, sendMessage };
