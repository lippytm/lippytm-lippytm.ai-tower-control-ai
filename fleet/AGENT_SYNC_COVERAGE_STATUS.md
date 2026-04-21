# Agent Sync Coverage Status

## Purpose
Track synchronization coverage between the lippytm swarm factory and external or cross-platform AI agent systems.

## Coverage Table
| Scope Type | Scope Name | Source ID | Target System | Sync Pattern | Review Level | Compatibility Status | Sync Status | Notes |
|---|---|---|---|---|---|---|---|---|
| control-tower | lippytm-lippytm.ai-tower-control-ai | REPO-CONTROL-TOWER | GitHub-centered systems | one-to-many | internal | high | active | canonical control layer |
| repo | lippytm.ai | REPO-TBD | platform adapters | planned | internal | medium | planned |  |
| repo | lippytmai.getbizfunds.com- | REPO-TBD | CRM / growth surfaces | planned | internal / customer review | medium | planned | high-priority business surface |
| platform | MyClaw | PLAT-MYCLAW | CRM workflows | one-to-one | internal | medium | planned |  |
| platform | ChatGPT / OpenAI | PLAT-OPENAI | drafting / orchestration | one-to-many | internal | high | planned |  |
| platform | Claude | PLAT-CLAUDE | long-form drafting | one-to-many | internal | high | planned |  |
| platform | Grok | PLAT-GROK | research framing | one-to-many | internal | medium | planned |  |
| platform | ManyChat | PLAT-MANYCHAT | campaign and CRM flows | one-to-one | internal / customer review | medium | planned |  |
| platform | BotBuilders | PLAT-BOTBUILDERS | offer and packaging flows | one-to-one | internal | medium | planned |  |
| knowledge-profile | Charles Earl Lipshay Context Systems | PROFILE-CHARLES | continuity and knowledge surfaces | many-to-many | internal | medium | planned |  |

## Best Practices
- update this tracker alongside profile and application changes
- keep compatibility notes aligned with the compatibility matrix
- use this file as the seed for future synchronization dashboards
