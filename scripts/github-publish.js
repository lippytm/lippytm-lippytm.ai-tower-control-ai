#!/usr/bin/env node
'use strict';

const fs = require('fs');
const axios = require('axios');

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required');

const api = axios.create({
  baseURL: `https://api.github.com/repos/${repository}`,
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  timeout: 30_000,
});

async function main() {
  const manifestPath = process.argv[2] || process.env.PUBLISH_MANIFEST;
  if (!manifestPath) throw new Error('Provide a publishing manifest path');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const base = manifest.base || 'main';
  const branch = manifest.branch;
  if (!branch || !branch.startsWith('agent/')) throw new Error('Manifest branch must start with agent/');
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new Error('Manifest files are required');

  const baseRef = await api.get(`/git/ref/heads/${base}`);
  try {
    await api.post('/git/refs', { ref: `refs/heads/${branch}`, sha: baseRef.data.object.sha });
  } catch (error) {
    if (error.response && error.response.status !== 422) throw error;
  }

  for (const file of manifest.files) {
    if (!file.path || file.path.includes('..')) throw new Error('Unsafe manifest path');
    const content = fs.readFileSync(file.source, 'utf8');
    let sha;
    try {
      const current = await api.get(`/contents/${file.path}`, { params: { ref: branch } });
      sha = current.data.sha;
    } catch (error) {
      if (!error.response || error.response.status !== 404) throw error;
    }
    await api.put(`/contents/${file.path}`, {
      message: file.message || `Publish ${file.path}`,
      content: Buffer.from(content).toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    });
  }

  const pulls = await api.get('/pulls', { params: { head: `${repository.split('/')[0]}:${branch}`, base, state: 'open' } });
  if (pulls.data.length) {
    process.stdout.write(JSON.stringify({ pullRequest: pulls.data[0].html_url, existing: true }));
    return;
  }
  const pull = await api.post('/pulls', {
    title: manifest.title || 'AI-assisted publishing update',
    head: branch,
    base,
    body: manifest.body || 'Created by the AI Tower controlled publishing workflow.',
    draft: manifest.draft !== false,
  });
  process.stdout.write(JSON.stringify({ pullRequest: pull.data.html_url, existing: false }));
}

main().catch((error) => {
  const detail = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
  process.stderr.write(`Publishing failed: ${detail}\n`);
  process.exit(1);
});
