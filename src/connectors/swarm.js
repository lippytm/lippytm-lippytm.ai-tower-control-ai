'use strict';

const openai = require('./openai');
const logger = require('../logger');

/**
 * Run a sequential agent swarm.
 * Each agent in the pipeline receives the previous agent's output as user input,
 * forming an autonomous chain where each specialised role builds on the last.
 *
 * @param {Array<{name:string, systemPrompt:string}>} agents  Ordered list of agent definitions.
 * @param {string} initialInput  The starting user message fed to the first agent.
 * @param {object} [options]  Extra options forwarded to each OpenAI chat call (e.g. model).
 * @returns {Promise<{ output: string, trace: Array<{agent:string, input:string, output:string}> }>}
 */
async function runSwarm(agents, initialInput, options = {}) {
  if (!Array.isArray(agents) || agents.length === 0) {
    throw new Error('agents must be a non-empty array');
  }
  if (!initialInput || typeof initialInput !== 'string') {
    throw new Error('initialInput must be a non-empty string');
  }

  const trace = [];
  let currentInput = initialInput;

  for (const agent of agents) {
    const { name, systemPrompt } = agent;
    if (!name || !systemPrompt) {
      throw new Error('Each agent must have a name and systemPrompt');
    }

    logger.info('Swarm: running agent', { agent: name });

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: currentInput },
    ];

    const result = await openai.chat(messages, options);
    trace.push({ agent: name, input: currentInput, output: result.content });
    currentInput = result.content;
  }

  logger.info('Swarm: completed', { agentCount: agents.length });
  return { output: currentInput, trace };
}

/**
 * Self-optimisation feedback loop: ask ChatGPT to iteratively improve a piece of
 * content over a configurable number of rounds, automating self-upgrade cycles.
 *
 * @param {string} content    The content to improve.
 * @param {number} [rounds=2] Number of improvement rounds (min 1).
 * @param {object} [options]  Extra options forwarded to OpenAI.
 * @returns {Promise<{ output: string, rounds: Array<{round:number, output:string}> }>}
 */
async function selfOptimize(content, rounds = 2, options = {}) {
  if (!content || typeof content !== 'string') {
    throw new Error('content must be a non-empty string');
  }
  if (!Number.isInteger(rounds) || rounds < 1) {
    throw new Error('rounds must be a positive integer');
  }

  const history = [];
  let current = content;

  for (let i = 1; i <= rounds; i++) {
    logger.info('Swarm: self-optimize round', { round: i, totalRounds: rounds });

    const messages = [
      {
        role: 'system',
        content:
          'You are an AI code and workflow optimization assistant. ' +
          'Review the provided content and return an improved version. ' +
          'Output only the improved content without any explanation.',
      },
      { role: 'user', content: current },
    ];

    const result = await openai.chat(messages, options);
    history.push({ round: i, output: result.content });
    current = result.content;
  }

  return { output: current, rounds: history };
}

module.exports = { runSwarm, selfOptimize };
