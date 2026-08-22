'use strict';

const registry = require('../../config/project-registry.json');

const BLOCKED_ACTIONS = [
  'trade', 'transfer funds', 'sign transaction', 'deploy contract',
  'send payment', 'publish financial recommendation', 'contact customer',
];

function getProjects() {
  return registry.projects;
}

function validateHandoff(payload) {
  const required = ['projectId', 'sourceProvider', 'taskId', 'createdAt', 'content', 'provenance', 'requestedAction'];
  const missing = required.filter((field) => !payload || payload[field] === undefined || payload[field] === null);
  if (missing.length) return { valid: false, errors: missing.map((field) => `Missing ${field}`) };
  const project = registry.projects.find((item) => item.id === payload.projectId);
  if (!project) return { valid: false, errors: ['Unknown projectId'] };
  const action = String(payload.requestedAction).toLowerCase();
  const requiresHumanApproval = BLOCKED_ACTIONS.some((blocked) => action.includes(blocked))
    || ['financial', 'legal', 'security', 'high'].includes(payload.risk);
  return {
    valid: true,
    project,
    requiresHumanApproval,
    executable: !requiresHumanApproval || payload.humanApproval === true,
  };
}

module.exports = { getProjects, validateHandoff };
