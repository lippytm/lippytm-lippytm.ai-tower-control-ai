'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const apiKey = process.env.FACTORY_AI_API_KEY;
  const baseURL = process.env.FACTORY_AI_BASE_URL || 'https://api.factory.ai';
  if (!apiKey) throw new Error('FACTORY_AI_API_KEY is not configured');
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
 * List AI pipelines available on Factory.ai.
 * @returns {Promise<Array>}
 */
async function listPipelines() {
  logger.debug('Factory.ai: listPipelines');
  const client = getClient();
  const response = await client.get('/pipelines');
  return response.data;
}

/**
 * Trigger an AI pipeline run on Factory.ai.
 * @param {string} pipelineId
 * @param {object} inputs  Key/value inputs for the pipeline.
 * @returns {Promise<object>}
 */
async function runPipeline(pipelineId, inputs) {
  logger.debug('Factory.ai: runPipeline', { pipelineId });
  const client = getClient();
  const response = await client.post(`/pipelines/${pipelineId}/runs`, { inputs });
  return response.data;
}

/**
 * Get the status / output of a pipeline run.
 * @param {string} pipelineId
 * @param {string} runId
 * @returns {Promise<object>}
 */
async function getPipelineRun(pipelineId, runId) {
  logger.debug('Factory.ai: getPipelineRun', { pipelineId, runId });
  const client = getClient();
  const response = await client.get(`/pipelines/${pipelineId}/runs/${runId}`);
  return response.data;
}

module.exports = { listPipelines, runPipeline, getPipelineRun };
