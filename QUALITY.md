# Quality Gate Standards

Quality is Job #1 for the lippytm.ai Control Tower.

This repo guides AI coding, autocomplete automations, agents, workflows, dashboards, support systems, marketing assets, integrations, and fleet-wide repo modernization. Every asset should be clear, useful, reviewable, safe, and connected to a practical next action.

## Required Checks

Before merging meaningful changes, confirm:

- `npm ci` succeeds.
- `npm run lint` succeeds.
- `npm run spellcheck` succeeds.
- `npm test` succeeds.
- `npm run test:coverage` succeeds for code changes.
- New or changed behavior has tests when practical.
- README or docs are updated when setup, routes, environment variables, spellcheck dictionary, ChatGPT content standards, or workflows change.

## Spellcheck Standard

Spellcheck is part of the system-wide quality gate.

- Use `npm run spellcheck` before merging docs, code comments, prompts, workflows, markdown, YAML, or JSON updates.
- Add valid project-specific names to `cspell.json` instead of weakening the check globally.
- Correct misspellings when they are real mistakes.
- Keep brand names, repo names, bot names, and ecosystem terms explicit in the dictionary.

## ChatGPT Spellcheck Standard

Everything created for, by, or about ChatGPT must pass the spellcheck gate before becoming reusable system material.

This includes:

- ChatGPT prompts.
- System prompts and agent instructions.
- Bot scripts and chatbot copy.
- README sections that mention ChatGPT or OpenAI.
- API examples involving ChatGPT or OpenAI.
- Markdown documentation.
- YAML workflows that route ChatGPT-related automation.
- JSON configuration files for ChatGPT, bots, swarms, prompts, and connectors.
- Marketing, support, onboarding, and educational content generated with ChatGPT.

Use `docs/CHATGPT_SPELLCHECK_STANDARD.md` as the detailed rulebook.

## Quality Principles

- Clarity before complexity.
- Docs before deep automation.
- Manual workflow before API/webhook integration.
- Issues before major changes.
- Small, reviewable updates.
- No secrets in repos or prompts.
- Human review for high-risk actions.
- Support path for customer-facing work.
- Dashboard updates for meaningful changes.

## Universal Quality Checklist

- [ ] Purpose is clear.
- [ ] Audience or user is clear.
- [ ] Inputs and outputs are clear where relevant.
- [ ] Risk level is identified.
- [ ] No secrets are included.
- [ ] No unsupported income, funding, legal, tax, investment, trading, medical, or guaranteed outcome claims are included.
- [ ] Human review boundary is clear.
- [ ] Support or fallback path is included when useful.
- [ ] Spellcheck has passed or dictionary updates are documented.
- [ ] ChatGPT-related content follows `docs/CHATGPT_SPELLCHECK_STANDARD.md` when relevant.
- [ ] Dashboard or registry is updated when relevant.

## RiskGate Checklist

Use this before production deployment or any change involving credentials, automation, external APIs, user data, public endpoints, payments, business funding, customer data, or physical-world operations.

- What changed?
- What could break?
- What data or credentials are touched?
- What user-facing behavior changes?
- What rollback path exists?
- What test proves the change works?
- What security control prevents misuse?
- Who gives final human approval?

## Agent Mode Workflow

1. AI proposes the change.
2. RiskGate evaluates the risk.
3. Human owner approves the plan.
4. Implementation happens on a branch.
5. CI verifies lint, spellcheck, tests, and security.
6. PR review checks business, security, docs, and deployment impact.
7. Merge only after the system is safer, clearer, or more useful than before.

## Autocomplete Quality Rules

Copilot, ChatGPT, Twin, and future agents should prefer completions that create:

- clear docs
- issue bodies
- safe prompts
- workflow checklists
- registry entries
- support scripts
- test plans
- dashboards
- product/service notes

They should avoid completions that create:

- hardcoded secrets
- misleading claims
- hidden behavior
- unsafe deployments
- customer data exposure
- unclear financial/legal/funding promises

## Review Levels

### Low risk

Docs, internal notes, prompts, checklists, dashboards, and repo summaries.

### Medium risk

Customer-facing drafts, chatbot copy, support replies, integration plans, marketing copy.

### High risk

Funding, finance, legal, tax, investment, trading, customer data, payments, billing, deployments.

### Critical risk

Secrets exposure, unauthorized access, private data leak, payment credential exposure, unsafe physical-world actions.

High and critical risk work requires human review before execution or publication.

## Separation Standard

This repository may connect real business systems, educational materials, experimental R&D, and creative projects. Do not blur categories. Use explicit labels when content crosses domains:

- REAL BUSINESS
- EDUCATIONAL
- DOCUMENTARY / COMMENTARY
- FICTION / SATIRE
- EXPERIMENTAL R&D
- ADVERTISEMENT / OFFER
- AFFILIATE / PARTNER MENTION

Creative connection is allowed. Category confusion is not.
