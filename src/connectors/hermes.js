'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.HERMES_API_KEY;
  const baseURL = process.env.HERMES_API_URL || 'http://localhost:8000';
  if (!apiKey) throw new Error('HERMES_API_KEY is not configured');
  return axios.create({
    baseURL,
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });
}

/**
 * Run a Hermes skill or task by name, optionally passing input text.
 * @param {string} skill  Name of the skill or task to execute.
 * @param {string} [input]  Optional input/prompt to pass to the skill.
 * @param {object} [options]  Additional parameters forwarded to the Hermes API.
 * @returns {Promise<object>}
 */
async function runSkill(skill, input, options = {}) {
  logger.debug('Hermes: runSkill', { skill });
  const client = getClient();
  const body = { skill, ...(input !== undefined ? { input } : {}), ...options };
  const response = await client.post('/api/run', body);
  return response.data;
}

/**
 * List all skills registered in the Hermes agent.
 * @returns {Promise<Array>}
 */
async function listSkills() {
  logger.debug('Hermes: listSkills');
  const client = getClient();
  const response = await client.get('/api/skills');
  return response.data;
}

/**
 * Create a cron-scheduled automation in the Hermes agent.
 * @param {object} config  Schedule configuration.
 * @param {string} config.name     Human-readable name for the automation.
 * @param {string} config.cron     Cron expression (e.g. "0 2 * * *" for 2 AM daily).
 * @param {string} config.skill    Skill to run on the schedule.
 * @param {string} [config.input]  Optional input passed to the skill each run.
 * @param {string} [config.delivery]  Delivery channel (e.g. "telegram", "discord", "internal").
 * @returns {Promise<object>}
 */
async function scheduleAutomation(config) {
  logger.debug('Hermes: scheduleAutomation', { name: config.name, cron: config.cron });
  const client = getClient();
  const response = await client.post('/api/schedule', config);
  return response.data;
}

/**
 * Search Hermes cross-session memory using a natural-language query.
 * @param {string} query  Natural-language search query.
 * @param {object} [options]  Optional params (e.g. limit).
 * @returns {Promise<Array>}
 */
async function searchMemory(query, options = {}) {
  logger.debug('Hermes: searchMemory', { query });
  const client = getClient();
  const response = await client.get('/api/memory/search', { params: { q: query, ...options } });
  return response.data;
}

module.exports = { runSkill, listSkills, scheduleAutomation, searchMemory };
