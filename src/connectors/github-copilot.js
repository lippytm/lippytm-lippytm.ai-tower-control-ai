'use strict';

const axios = require('axios');
const logger = require('../logger');

function getClient() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {throw new Error('GITHUB_TOKEN is not configured');}
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    timeout: 20_000,
  });
}

/**
 * List recent workflow runs for the configured repo (used to observe Copilot / CI activity).
 * @param {object} [params]  Optional query params (branch, status, per_page, page).
 * @returns {Promise<object>}
 */
async function listWorkflowRuns(params = {}) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {throw new Error('GITHUB_OWNER and GITHUB_REPO must be configured');}
  logger.debug('GitHub Copilot: listWorkflowRuns', { owner, repo });
  const client = getClient();
  const response = await client.get(`/repos/${owner}/${repo}/actions/runs`, { params });
  return response.data;
}

/**
 * Trigger a GitHub Actions workflow dispatch event (e.g. a Copilot automation workflow).
 * @param {string} workflowId  Workflow file name or numeric ID.
 * @param {string} ref  Branch or tag ref.
 * @param {object} [inputs]  Optional workflow inputs.
 * @returns {Promise<void>}
 */
async function dispatchWorkflow(workflowId, ref, inputs = {}) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {throw new Error('GITHUB_OWNER and GITHUB_REPO must be configured');}
  logger.debug('GitHub Copilot: dispatchWorkflow', { owner, repo, workflowId, ref });
  const client = getClient();
  await client.post(`/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, {
    ref,
    inputs,
  });
}

/**
 * Get the latest commit on a branch (used to detect data/code updates).
 * @param {string} branch
 * @returns {Promise<object>}
 */
async function getLatestCommit(branch = 'main') {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) {throw new Error('GITHUB_OWNER and GITHUB_REPO must be configured');}
  logger.debug('GitHub Copilot: getLatestCommit', { owner, repo, branch });
  const client = getClient();
  const response = await client.get(`/repos/${owner}/${repo}/commits/${branch}`);
  return response.data;
}

module.exports = { listWorkflowRuns, dispatchWorkflow, getLatestCommit };
