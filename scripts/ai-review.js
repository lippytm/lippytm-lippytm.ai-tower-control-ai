#!/usr/bin/env node
'use strict';

require('dotenv').config();
const fs = require('fs');
const { compareTask } = require('../src/orchestration/providers');

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error('Provide a review input file');
  const material = fs.readFileSync(inputPath, 'utf8').slice(0, 100000);
  const requested = (process.env.AI_REVIEW_PROVIDERS || 'openai,gemini,claude')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  const results = await compareTask({
    providers: requested,
    messages: [
      { role: 'system', content: 'Review this proposed repository change for correctness, security, privacy, cost, and business impact. Do not approve financial or customer-data actions.' },
      { role: 'user', content: material },
    ],
  });
  process.stdout.write(JSON.stringify({ results, humanApprovalRequired: true }, null, 2));
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
