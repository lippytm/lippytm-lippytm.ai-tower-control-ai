# AI Clone Engine Cross-Platform Integration Layer

## Purpose

This document turns GitHub into the central command record for the lippytm.AI AI Clone Engine across multiple AI systems and business-development tools.

The goal is not to depend on one AI platform. The goal is to let multiple AI systems contribute to the same organized business engine through shared prompts, project memory, repository records, issue templates, agent instructions, and documentation.

## Core platforms in the current integration mix

| Platform / Agent | Role in the AI Clone Engine | GitHub interaction pattern |
|---|---|---|
| ChatGPT | Planning, documentation, repo coordination, business systems, prompt packs, setup guidance | Creates/updates docs, registries, issue templates, prompts, README files, workflows |
| Claude | Long-form writing, artifact drafting, deep restructuring, product documents, campaign material | Output should be copied into GitHub docs or issues so it becomes reusable project memory |
| Hermes Agent | Messenger, coordinator, dispatcher, routing layer, task handoff, cross-project updates | Creates routing logs, task dispatch notes, update summaries, and agent handoff records |
| Fable 5 | Story/product/media universe development, narrative planning, creative franchise material | Stores universe bibles, story maps, product lore, campaign branches, and media plans in GitHub |
| Grok | Research, alternate viewpoint scanning, social/current-topic awareness, fast idea testing | Stores research notes, comparison notes, and external-opinion summaries with source/date fields |
| GitHub | Source of truth, control tower, registry, history, version control, project memory | Holds all reusable instructions, project files, issue queues, agent records, snippets, and roadmaps |

## Operating principle

GitHub is the memory spine. Each AI platform can generate ideas, analysis, drafts, code, plans, prompts, campaigns, or agent instructions, but the reusable result should be captured in GitHub.

The AI Clone Engine should treat every useful AI output as one of these artifact types:

1. Prompt
2. Agent instruction
3. Workflow
4. Product draft
5. Business plan section
6. Campaign asset
7. Research note
8. Issue/task
9. Repository file
10. Registry entry
11. RiskGate/QA note
12. Handoff note

## Cross-platform handoff protocol

Use this handoff format whenever work moves from one AI platform to another:

```markdown
# AI Handoff Note

## Source AI
ChatGPT / Claude / Hermes / Fable 5 / Grok / Other

## Destination
GitHub repo, issue, document, prompt pack, campaign, product, or agent

## Project
Name of project or repository

## What was produced
Short summary of the output

## What should happen next
Clear next action

## Reusable artifacts
List files, snippets, prompts, documents, or ideas that should be saved

## Business purpose
How this helps lippytm.AI, AI Clone Engine, AgentBots, AI Swarms, publishing, business funding, or revenue generation

## RiskGate notes
Copyright, safety, privacy, security, factual accuracy, or customer-facing concerns
```

## Standard repository folders

Recommended folder structure for AI Clone Engine integration:

```text
docs/
  ai-clone-engine/
  business-identity/
  agent-registry/
  platform-handoffs/
  product-factory/
  campaign-factory/
  research-notes/
  riskgate/
prompts/
  master-prompts/
  agent-prompts/
  platform-prompts/
  product-prompts/
agents/
  hermes/
  claude/
  chatgpt/
  grok/
  fable5/
registries/
  projects.yaml
  platforms.yaml
  agents.yaml
  repositories.yaml
  products.yaml
```

## Platform-specific operating rules

### ChatGPT

Use ChatGPT for planning, repo setup, systems architecture, docs, prompt pack generation, implementation guidance, and GitHub-first organization.

Save outputs into GitHub when they become reusable.

### Claude

Use Claude for long-form drafts, books, sales pages, product copy, restructuring, and careful writing passes.

Paste or import the final useful version into GitHub with a short note naming Claude as the source AI.

### Hermes Agent

Use Hermes as the task router and messenger layer for the lippytm.ai AI Clone Swarms.

Hermes is the **Layer 0 Dispatcher** — it sits between Marvin Tower (supreme coordinator)
and all 12 specialist Marvin execution agents. Hermes does not execute tasks; it classifies,
dispatches, confirms, and logs.

#### Input types Hermes accepts
- Task dispatch from Marvin Tower
- Raw task requests from human operator (Charles Earl Lipshay)
- Cross-project update notices
- Agent handoff requests
- Content production requests
- Cross-platform coordination summaries
- Repository update requests
- Business-development next steps

#### Output types Hermes produces
- Routing classification (task type + destination agent)
- Dispatch note (instructions for the destination Marvin)
- Risk flag (`[HERMES-HOLD: human-review-required]` when applicable)
- Status return to Marvin Tower
- GitHub dispatch log entry saved to `agents/hermes/logs/`

#### Routing logic
Hermes classifies every task into one of these categories and routes accordingly:

| Classification | Destination |
|---|---|
| workflow-build / deployment | Marvin Factory |
| bot / ManyChat / BotBuilders | Marvin AllBots |
| Web3 / blockchain / crypto | Marvin Web3 |
| DevOps / CI-CD / repo health | Marvin DevOps |
| SciFi universe / lore / IP writing | Marvin Prime |
| ad copy / marketing content | Marvin AdCopy |
| IP protection / copyright | Marvin Copyright |
| knowledge / Encyclopedia | Marvin Encyclopedia |
| affiliate / revenue tracking | Marvin Affiliate |
| funding / business development | Marvin Funding |
| support / customer issues | Marvin Support |
| GitHub / repo management | Marvin Cloner |
| cross-swarm coordination / escalation | Marvin Tower |

#### Swarm integration note
Hermes connects the AI Clone Engine platforms (ChatGPT, Claude, Fable 5, Grok, Gemini) to
the Marvin Swarm agents. When an AI platform produces output that requires swarm action,
Hermes classifies and routes it rather than having each platform communicate directly with
each Marvin. This keeps the swarm organized and auditable.

Full integration spec: `docs/ai-clone-engine/HERMES-SWARM-INTEGRATION.md`
Agent definition: `agents/hermes/`
Dispatch log folder: `agents/hermes/logs/`

### Fable 5

Use Fable 5 for story universe, media, franchise, narrative product, and entertainment-development layers.

Fable 5 outputs should be saved as:

- universe bibles
- character/system maps
- episode/story concepts
- multimedia campaign notes
- creative franchise branches
- educational entertainment product notes

### Grok

Use Grok for research, social awareness, current-topic scanning, alternate framing, and fast exploration.

Because current-topic research can change, Grok outputs should be saved with:

- date
- topic
- source links when available
- confidence level
- what still needs verification

### GitHub

GitHub should be treated as the control tower, not just code storage.

Every important idea should become one of these:

- markdown file
- issue
- project registry entry
- agent registry entry
- prompt file
- campaign file
- product file
- README update
- RiskGate note

## AI Clone Engine command prompt

Use this prompt when starting a new AI session on any platform:

```text
You are helping build the lippytm.AI AI Clone Engine. Treat GitHub as the central source of truth. The active identity layer uses lippytimemachines@gmail.com for original/personal/recovery continuity and lippytmai.biz@gmail.com for business development. The active project portfolio includes lippytm.AI, lippytmai.getbizfunds.com, lippytmai.zo.computer, AgentBots, AI Swarms, OpenClaw, ClawBots, Prompt #11, AI publishing systems, business funding workflows, and cross-platform AI collaboration.

Your job is to produce reusable artifacts that can be saved into GitHub: prompts, docs, issues, registries, workflows, product drafts, campaign assets, research notes, agent instructions, or RiskGate notes. Always include a clear handoff note explaining what should be saved and what the next action is.
```

## GitHub integration goals

1. Use the Control Tower repo as the main command center.
2. Add cross-platform AI handoff notes to `docs/platform-handoffs/`.
3. Add platform-specific prompts to `prompts/platform-prompts/`.
4. Add agent definitions to `agents/` and `registries/agents.yaml`.
5. Add project/repo mapping to `registries/repositories.yaml`.
6. Convert Claude, Hermes, Fable 5, and Grok outputs into GitHub-tracked artifacts.
7. Use GitHub issues for tasks that need follow-up.
8. Use RiskGate notes before customer-facing publishing, funding claims, medical/legal/financial statements, or copyrighted/inspired franchise material.

## Next build steps

- Create an AI platform registry.
- Create a reusable platform handoff template.
- Create starter prompts for Claude, Hermes, Fable 5, Grok, and ChatGPT.
- Create a repository propagation list for the first 10 repos.
- Create issue templates for AI handoffs, product ideas, research notes, and RiskGate review.

## Security and privacy rule

Do not store passwords, API keys, private tokens, recovery codes, payment data, or private identity documents in GitHub. Store only safe operating instructions, public business emails, non-secret project notes, and reusable documentation.
