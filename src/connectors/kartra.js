'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.KARTRA_API_KEY;
  const appPassword = process.env.KARTRA_APP_PASSWORD;
  const baseURL = process.env.KARTRA_BASE_URL || 'https://app.kartra.com/api';
  if (!apiKey || !appPassword) throw new Error('KARTRA_API_KEY and KARTRA_APP_PASSWORD are not configured');
  return axios.create({
    baseURL,
    params: {
      app_id: apiKey,
      app_password: appPassword,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 20_000,
  });
}

/**
 * Get a Kartra lead by email address.
 * @param {string} email
 * @returns {Promise<object>}
 */
async function getLead(email) {
  logger.debug('Kartra: getLead', { email });
  const client = getClient();
  const response = await client.post('', {
    actions: [{ cmd: 'retrieve', object: 'lead', fields: { lead: { email } } }],
  });
  return response.data;
}

/**
 * Add a new lead to Kartra.
 * @param {object} leadData  Lead fields (first_name, last_name, email, etc.).
 * @returns {Promise<object>}
 */
async function addLead(leadData) {
  logger.debug('Kartra: addLead', { email: leadData.email });
  const client = getClient();
  const response = await client.post('', {
    actions: [{ cmd: 'create', object: 'lead', fields: { lead: leadData } }],
  });
  return response.data;
}

/**
 * Subscribe a lead to a Kartra sequence.
 * @param {string} email  Lead email.
 * @param {string} sequenceId  Kartra sequence ID.
 * @returns {Promise<object>}
 */
async function subscribeLeadToSequence(email, sequenceId) {
  logger.debug('Kartra: subscribeLeadToSequence', { email, sequenceId });
  const client = getClient();
  const response = await client.post('', {
    actions: [
      {
        cmd: 'execute',
        object: 'sequence',
        fields: { lead: { email }, sequence: { id: sequenceId } },
      },
    ],
  });
  return response.data;
}

module.exports = { getLead, addLead, subscribeLeadToSequence };
