'use strict';

const { getProjects, validateHandoff } = require('../src/orchestration/handoff');

test('registers Crypto Ecosystem AI Oracle and AI-DNF', () => {
  expect(getProjects().map((project) => project.id)).toEqual(expect.arrayContaining(['crypto-ecosystem-ai-oracle', 'ai-dnf']));
});

test('requires approval for crypto financial actions', () => {
  const result = validateHandoff({
    projectId: 'crypto-ecosystem-ai-oracle',
    sourceProvider: 'gemini',
    taskId: 'task-1',
    createdAt: new Date().toISOString(),
    content: 'scenario',
    provenance: { authorType: 'ai' },
    requestedAction: 'trade assets',
    risk: 'financial',
    humanApproval: false
  });
  expect(result.valid).toBe(true);
  expect(result.requiresHumanApproval).toBe(true);
  expect(result.executable).toBe(false);
});
