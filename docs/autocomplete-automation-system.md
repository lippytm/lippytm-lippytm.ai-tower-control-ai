# Autocomplete Automation System

This document describes how GitHub Copilot, ChatGPT, Twin, and future AI agents should behave as autocomplete and code-generation tools within the lippytm.ai Control Tower and fleet.

## Purpose

Turn repeated manual tasks into reusable prompts, templates, workflows, and registries. Every suggestion from an AI tool should improve clarity, safety, automation readiness, or commercial value.

## Operating principle

```
Idea → Issue → Prompt → Template → Workflow → Registry → Product → Dashboard
```

## Preferred completions

AI autocomplete should prioritize generating:

| Type | Examples |
|---|---|
| Documentation | README, ROADMAP, QUALITY, SECURITY, CONTRIBUTING |
| Registry entries | `fleet/repos.yml`, `platforms/`, `agents/`, `integrations/` |
| Workflow checklists | Issue bodies, PR checklists, Definition of Done |
| Prompt templates | Repo modernization, agent task, support routing |
| Support scripts | Canned replies, escalation flows, FAQ entries |
| Test plans | Unit test outlines, validation steps, manual checks |
| Dashboards | Status tables, health checks, coverage reports |
| Product/service notes | Offer packages, pricing tiers, affiliate copy |
| Safe environment placeholders | `OPENAI_API_KEY`, `TWIN_API_KEY`, `STRIPE_SECRET_KEY` |

## Completions to avoid

AI autocomplete should never generate:

- Hardcoded secrets, API keys, tokens, passwords, or credentials
- Unsafe deployment instructions without human review gates
- Misleading customer promises (guaranteed income, funding, returns)
- Hidden or undocumented background behavior
- Customer private data or PII in any file
- Unclear or unqualified financial, legal, tax, or medical claims

## Lane-aware behavior

When working in a lane-specific repo, Copilot should apply lane-specific templates. See `fleet/BEST_PRACTICES.md` for per-lane rules.

| Lane | Priority completions |
|---|---|
| Control Tower | Registry entries, fleet status updates, connector docs |
| Website | Page purpose, CTA, deployment runbook |
| Revenue | Compliance-reviewed intake forms, referral flows |
| Bots | Agent YAML manifests, escalation flows, persona docs |
| Integration | `.env.example` placeholders, architecture docs, test plans |
| R&D | Research log entries, experiment records, promotion checklists |
| Agents/AI | Swarm manifests, health-check steps, maintenance logs |
| Education | Curriculum outlines, learning tracks, compliance notices |
| Security | Architecture docs, incident response steps, scan definitions |
| Trading | Risk gate entries, paper-trading plans, kill-switch docs |
| Creative | Canon docs, world-building notes, monetization outlines |
| Strategy | Executive summaries, phased roadmaps, quarterly review prompts |
| Docs | TOC entries, audience labels, compliance notices |
| Support | Canned replies, escalation rules, feedback loops |
| Productivity | Task lifecycle definitions, weekly review prompts |
| AI Identity | Persona updates via fleet/clone/ only — never direct edits |

## Agent task loop

When a GitHub issue is labeled `agent-task`:

1. Copilot/Claude reads the issue body and connected files.
2. Generates a minimal-change PR.
3. Applies the quality checklist from `.github/PULL_REQUEST_TEMPLATE.md`.
4. Flags any risk items for human review.
5. Posts a summary comment on the issue.
6. Updates `fleet/FLEET_STATUS.md` and `fleet/CLAUDE_TASKS.md` when complete.

## Prompt library locations

| Location | Contents |
|---|---|
| `workflows/` | Workflow playbooks and prompts |
| `templates/repo/` | Reusable repo standard files |
| `templates/lanes/` | Lane-specific checklists |
| `agents/` | Agent and Twin definitions |
| `support/canned-replies.md` | Approved support responses |
| `quality/definition-of-done.md` | Universal DoD checklist |

## Related docs

- `QUALITY.md` — quality principles
- `SECURITY.md` — security and secret rules
- `fleet/BEST_PRACTICES.md` — lane-specific best practices
- `workflows/repo-modernization.md` — repo upgrade playbook
- `quality/definition-of-done.md` — definition of done
