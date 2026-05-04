# GitHub Copilot Instructions for lippytm.ai Control Tower

## Mission

This repository is the Control Tower for the lippytm.ai Business-of-Businesses AI Coding and Automation Network.

Copilot should help build durable, reviewable assets that organize repositories, agents, workflows, prompts, dashboards, support systems, product packages, and automation plans.

## Operating model

Use this pattern:

```text
Idea -> GitHub issue -> registry entry -> workflow -> docs/code/templates -> quality review -> support path -> product/money path -> dashboard update
```

## Primary platforms

- GitHub as source of truth
- ChatGPT for planning, review, and writing support
- GitHub Copilot for coding and repo editing support
- Twin as autonomous agent/workflow layer
- ManyChat and BotBuilders as front-line communication layers
- lippytmai.getbizfunds.com as business/funding front door
- Replit, Base44, MyClaw, and OpenClaw as app/agent builder layers

## Preferred work style

- Make small, reviewable changes.
- Prefer Markdown, YAML, and simple scripts before complex apps.
- Use registries for platforms, agents, workflows, products, and integrations.
- Use issues before major changes.
- Keep docs clear enough for humans and AI agents.
- Add checklists and definitions of done.
- Include support and rollback notes where relevant.

## Quality is Job #1

Every generated file, issue, workflow, or code suggestion should consider:

- purpose
- owner or next action
- input and output
- test or validation method
- risk level
- fallback path
- support path
- monetization or long-term asset value when relevant

## Security rules

Do not add secrets, API keys, tokens, passwords, private customer data, seed phrases, payment credentials, or OAuth credentials to the repository.

Use placeholder names only, such as:

```text
TWIN_API_KEY
MANYCHAT_API_KEY
GITHUB_TOKEN
STRIPE_SECRET_KEY
```

Never include real secret values.

## Claims and compliance rules

Avoid unsupported claims about:

- guaranteed income
- guaranteed funding
- legal results
- tax outcomes
- investment returns
- trading profits
- medical outcomes

For customer-facing work, keep language realistic, reviewable, and human-approved.

## Autocomplete automation behavior

When autocomplete suggests content, prefer:

- reusable prompts
- registry entries
- checklist items
- issue bodies
- documentation sections
- test plans
- support scripts
- product/service package notes
- safe placeholders

Avoid autocomplete that creates:

- hardcoded secrets
- unsafe deployments
- misleading customer promises
- hidden background behavior
- unclear financial/legal claims

## Standard folders

Use and extend these folders:

```text
ai-coding/
agents/
architecture/
business/
dashboards/
integrations/
marketing/
platforms/
products/
quality/
security/
support/
workflows/
```

## Definition of useful completion

A useful completion should improve at least one of:

- clarity
- automation readiness
- repo modernization
- quality
- security
- support readiness
- productization
- monetization path
- fleet coordination
- future AI agent usability
