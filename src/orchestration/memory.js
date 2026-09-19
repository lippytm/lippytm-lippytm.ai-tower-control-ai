'use strict';

const memory = require('../../config/workflow-memory.json');
const projects = require('../../config/project-registry.json');

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\b(seed phrase|recovery phrase|social security number|bank account number)\b/i,
  /\b(sk-[a-z0-9_-]{16,}|AIza[a-z0-9_-]{20,})\b/i,
];

function getMemory() {
  return { ...memory, projects: projects.projects };
}

function validateMemoryEntry(entry) {
  const text = JSON.stringify(entry || {});
  const errors = [];
  if (!entry || !entry.projectId) errors.push('projectId is required');
  if (!entry || !entry.summary) errors.push('summary is required');
  if (!entry || !entry.sourceProvider) errors.push('sourceProvider is required');
  if (!entry || !entry.nextAction) errors.push('nextAction is required');
  if (SECRET_PATTERNS.some((pattern) => pattern.test(text))) errors.push('Potential secret or private financial/identity data detected');
  const known = projects.projects.some((project) => project.id === (entry && entry.projectId));
  if (entry && entry.projectId && !known) errors.push('Unknown projectId');
  return { valid: errors.length === 0, errors, humanApprovalRequired: true };
}

module.exports = { getMemory, validateMemoryEntry };
