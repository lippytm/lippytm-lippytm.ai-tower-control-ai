# Fleet Topology

This document defines the recommended topology for the lippytm multi-repository AI fleet.

The topology is designed to support:

- centralized visibility
- distributed execution
- safe approvals
- mass manufacturing of new repo systems
- gradual evolution without losing structure

---

## Topology Overview

```text
                     +----------------------+
                     |      lippytm.ai      |
                     |  Standards / BrainKit|
                     +----------+-----------+
                                |
                                v
                 +--------------+---------------+
                 | lippytm-lippytm.ai-tower-... |
                 |   Fleet Control / Orchestrator|
                 +--------+-----------+----------+
                          |           |
                          |           |
                          v           v
          +---------------+--+     +--+----------------+
          | MyClaw.lippytm.AI |     | Chatlippytm.ai... |
          | Swarm Fabric      |     | Repo Ops Swarm    |
          +--------+----------+     +---------+---------+
                   |                          |
         +---------+------+          +--------+--------+
         |                |          |                 |
         v                v          v                 v
+--------+------+ +-------+-----+ +--+----------------+---+
| getbizfunds    | | OpenClaw    | | Web3AI               |
| Revenue Gateway| | Assistant UI| | Commerce / Payments  |
+--------+------+ +-------+-----+ +-----------+-----------+
         |                |                     |
         +----------------+---------------------+
                          |
                          v
                +---------+----------+
                | Labs / Knowledge   |
                | and Creative Repos |
                +--------------------+
```

---

## Topology Layers

### Layer 1 — Standards and Policy
**Primary repo:** `lippytm/lippytm.ai`

Responsibilities:
- repo standards
- folder standards
- schemas and contracts
- quality gate definitions
- risk and approval policies
- fleet role classification

This layer is the source of truth for how the rest of the fleet should behave.

---

### Layer 2 — Control and Orchestration
**Primary repo:** `lippytm/lippytm-lippytm.ai-tower-control-ai`

Responsibilities:
- fleet registry
- mission execution
- rollout coordination
- telemetry aggregation
- connector health tracking
- approval and rollback coordination

This layer does not need to perform all work itself. It needs to know what exists, what state it is in, and what should happen next.

---

### Layer 3 — Swarm Execution Fabric
**Primary repo:** `lippytm/MyClaw.lippytm.AI-`

Responsibilities:
- task routing
- agent communication
- message delivery
- escalation
- memory handoff
- supervisor paths

This layer turns high-level missions into coordinated multi-agent action.

---

### Layer 4 — Product and Revenue Surfaces
**Primary repos:**
- `lippytm/lippytmai.getbizfunds.com-`
- `lippytm/OpenClaw-lippytm.AI-`
- bot family repos

Responsibilities:
- public pages
- offers
- forms and intake
- bot interfaces
- customer journeys
- conversion paths

These repos are where the outside world meets the system.

---

### Layer 5 — Commerce and Access
**Primary repo:** `lippytm/Web3AI`

Responsibilities:
- payments
- subscriptions
- tokenized access
- affiliate economics
- proof-of-service or usage receipts

This layer monetizes the value created in the product and operational layers.

---

### Layer 6 — Research, Labs, and Knowledge
**Primary repos:** labs and encyclopedia / creative repos

Responsibilities:
- experiments
- content products
- narrative systems
- future concepts
- prototype validation

This layer feeds long-term evolution.

---

## Connection Types

### Control Links
Used by the Control Tower to manage repos, agents, and workflows.

Examples:
- workflow dispatch
- registry refresh
- rollout request
- incident escalation

### Swarm Links
Used between agents and execution surfaces.

Examples:
- task assignment
- heartbeat
- supervisor escalation
- state transitions

### Product Links
Used between public surfaces and operational systems.

Examples:
- lead intake to routing
- bot interface to task execution
- pricing page to subscription service

### Commerce Links
Used between monetized services and access systems.

Examples:
- checkout completion
- access pass verification
- usage metering
- affiliate credit

### Knowledge Links
Used between content systems and commercial or experimental systems.

Examples:
- ebook funnel to lead capture
- educational module to assistant workflow
- creative concept to prototype lab

---

## Topology Node Classes

| Node Class | Meaning |
|---|---|
| `authority` | Defines standards or policy |
| `orchestrator` | Coordinates actions across nodes |
| `executor` | Performs tasks or workflows |
| `interface` | Exposes UI, forms, or conversations |
| `commerce` | Handles payment or access state |
| `knowledge` | Produces educational or narrative assets |
| `lab` | Tests prototypes or experiments |

---

## Required Topology Metadata

Each node should eventually expose:

```yaml
repo: lippytm/example
node_class: orchestrator
lane: control
risk_level: critical
public_surface: false
fleet_managed: true
brainkit_managed: true
telemetry_enabled: true
```

---

## Recommended Execution Flow

1. Standards layer defines rules
2. Control layer decides mission and eligible targets
3. Swarm layer routes and distributes tasks
4. Product or interface layer receives or presents results
5. Commerce layer records value exchange if monetized
6. Telemetry flows back to control and standards layers
7. Labs and knowledge layers absorb lessons for future upgrades

---

## Topology Design Goals

- no single repo needs to do everything
- critical policies stay centralized
- creative and experimental work remains possible
- public systems remain connected to operational intelligence
- monetization is modular rather than scattered
- new repos can be added as nodes without redesigning the fleet

---

## Rule of thumb

The fleet should feel like a living engineering network: one authority layer, one control layer, one execution fabric, many product surfaces, one modular commerce layer, and many future-facing experiments.
