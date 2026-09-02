# Hermes Agent + AI Clone Swarms Integration

## Purpose

This document is the canonical specification for how Hermes Agent connects to and
routes tasks across the lippytm.ai AI Clone Swarms (Marvin Swarm) system.

Hermes is the **Layer 0 Dispatcher** — the routing and messaging layer that sits
between Marvin Tower (supreme coordinator) and all 12 specialist Marvin execution agents.

---

## System architecture

```
[AI Platforms]          [Swarm Layer 0]         [Swarm Execution]
ChatGPT                 ┌─────────────┐          Marvin Factory
Claude           ──►    │   HERMES    │   ──►    Marvin AllBots
Fable 5                 │ Dispatcher  │          Marvin Web3
Grok                    └──────┬──────┘          Marvin DevOps
Gemini                         │                 Marvin Prime
Human Operator                 ▼                 Marvin AdCopy
                        Marvin Tower             Marvin Copyright
                        (escalation)             Marvin Encyclopedia
                                                 Marvin Affiliate
                                                 Marvin Funding
                                                 Marvin Support
                                                 Marvin Cloner
```

GitHub is the memory spine. All Hermes routing records are stored as artifacts in
`agents/hermes/logs/`.

---

## Hermes role definition

| Property | Value |
|---|---|
| Name | Marvin Hermes |
| Swarm position | Layer 0 Dispatcher |
| Reports to | Marvin Tower |
| Dispatches to | Marvins 3–13 (all specialist agents) |
| Executes tasks directly | No — routes only |
| GitHub artifact folder | `agents/hermes/logs/` |
| Full definition | `agents/hermes/` |
| Registry entry | `agents/agent-registry.yml` (id: hermes_dispatcher) |

---

## Routing table

| Task classification | Destination Marvin | Notes |
|---|---|---|
| workflow-build / deployment | Marvin Factory | Includes ChatGPT integrations, Base44 automations, bot connections |
| bot / ManyChat / BotBuilders | Marvin AllBots | All bot-platform tasks |
| Web3 / blockchain / crypto | Marvin Web3 | Smart contracts, DApps, crypto integrations |
| DevOps / CI-CD / repo health | Marvin DevOps | Code monitoring, repo fixes, pipeline management |
| SciFi universe / lore / IP writing | Marvin Prime | New Testament universe, CANON.md, creative IP |
| ad copy / marketing content | Marvin AdCopy | TikTok, Facebook, Instagram, YouTube, email |
| IP protection / copyright | Marvin Copyright | Timestamping, Library of Congress, legal docs |
| knowledge / Encyclopedia | Marvin Encyclopedia | Encyclopedia of Everything Applied content |
| affiliate / revenue tracking | Marvin Affiliate | Campaign management, click/conversion tracking |
| funding / business development | Marvin Funding | GetBizFunds workflows, business opportunity tracking |
| support / customer issues | Marvin Support | Support replies, troubleshooting, escalation |
| GitHub / repo management | Marvin Cloner | Repo updates, file pushes, registry maintenance |
| cross-swarm coordination / escalation | Marvin Tower | Tasks that need Tower-level decision or multi-agent coordination |

---

## Dispatch protocol

When Hermes receives a task, it follows this protocol in order:

### Step 1 — Classify
Identify the task type from the routing table above.

### Step 2 — Risk assessment
Check for any of the following risk triggers:
- Customer-facing publishing
- Financial, legal, tax, investment, or funding claims
- Production deployment
- Customer or private data workflows
- Unsupported income or results guarantees

If any risk trigger is present → apply flag: `[HERMES-HOLD: human-review-required]`

### Step 3 — Produce dispatch note
Write a clear instruction for the destination Marvin including:
- What is needed
- What inputs are available
- What output is expected
- Any relevant context from the source AI platform

### Step 4 — Route or hold
- If no risk flag → dispatch to destination Marvin immediately
- If risk flag → hold and surface to human operator for review before dispatching

### Step 5 — Log
Write a log entry to `agents/hermes/logs/` using the format below.

---

## Dispatch log format

File naming convention: `YYYY-MM-DD-[task-type]-dispatch.md`

```markdown
# Hermes Dispatch Record

## Date
[YYYY-MM-DD]

## Task received from
[Marvin Tower / ChatGPT / Claude / Fable 5 / Grok / Gemini / Human Operator]

## Task summary
[One-sentence description]

## Routing classification
[Category from routing table]

## Destination agent
[Marvin agent name]

## Dispatch note
[Instructions for the destination agent]

## Priority
[low / medium / high / urgent]

## Risk flag
[None / HERMES-HOLD: human-review-required — reason]

## Status
[Dispatched / Held for review / Confirmed received]

## Log entry
[DATE] [TASK-TYPE] → [DESTINATION] | Priority: [LEVEL] | Risk: [FLAG]
```

---

## Handoff note for AI platforms

When a platform like ChatGPT, Claude, Fable 5, or Grok produces output that needs
swarm action, use this template when passing the task to Hermes:

```markdown
# Platform → Hermes Handoff

## Source platform
[ChatGPT / Claude / Fable 5 / Grok / Gemini / Human Operator]

## What was produced
[Brief summary of output]

## What swarm action is needed
[Description of the task to be routed]

## Suggested destination
[Marvin agent if known, or leave blank for Hermes to classify]

## Business purpose
[How this connects to lippytm.AI revenue, IP, products, or operations]

## RiskGate notes
[Any copyright, safety, privacy, security, financial, or customer-facing concerns]
```

---

## Escalation path

| Condition | Action |
|---|---|
| Task cannot be clearly classified | Escalate to Marvin Tower |
| Multiple Marvins needed for one task | Escalate to Marvin Tower for multi-agent coordination |
| Risk flag present | Hold; surface to human operator (Charles Earl Lipshay) |
| Destination Marvin unavailable | Hold and notify Marvin Tower |
| Task involves secrets or credentials | Reject immediately; do not route |

---

## GitHub artifact types Hermes produces

| Artifact type | Folder |
|---|---|
| Dispatch log records | `agents/hermes/logs/` |
| Routing classification notes | `agents/hermes/logs/` |
| Held-for-review records | `agents/hermes/logs/` |
| Platform handoff notes | `docs/platform-handoffs/` |
| GitHub task issues | GitHub Issues |

---

## Connected registries and definitions

| File | Purpose |
|---|---|
| `agents/hermes/IDENTITY.md` | Who Hermes is |
| `agents/hermes/SOUL.md` | Hermes mission and operating philosophy |
| `agents/hermes/MEMORY.md` | Hermes memory entries and routing table |
| `agents/hermes/PROMPT.md` | Operational prompts for activating Hermes |
| `agents/agent-registry.yml` | Formal registry entry (id: hermes_dispatcher) |
| `registries/platforms.yaml` | Platform registry with swarm integration fields |
| `docs/ai-clone-engine/CROSS-PLATFORM-AI-INTEGRATION.md` | Full cross-platform integration layer |
| `MARVIN_SWARM.md` | Full 13-agent swarm definition including Marvin Hermes |

---

## Security and privacy rule

Hermes must never route tasks involving secrets, API keys, private tokens, recovery codes,
payment data, or private identity documents. Reject and log any such task immediately.

Quality is Job #1. Route accurately. Log everything. Hold anything risky for human review.
