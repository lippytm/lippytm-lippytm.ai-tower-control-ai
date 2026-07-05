# Claude Code Task Queue

> Tracks active and pending tasks for Claude Code and GitHub Copilot across the fleet.

## Operating Model

```
Slack command → GitHub issue (labeled agent-task) → Claude Code proposes PR → RiskGate → Human approves → QA passes → Merge
```

---

## Active Tasks

| # | Issue | Repo | Task | Lane | Risk | Status | Assigned |
|---|---|---|---|---|---|---|---|
| 1 | [#73](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/73) | control-tower | BoB Systems upgrade: Zapier + Dubb + README | Revenue | medium | 🔄 In progress | Copilot |
| 2 | [#66](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/66) | control-tower | Connect 30+ repos into Systems of Systems | Fleet | medium | 🔄 In progress | Copilot |

---

## Backlog

| # | Issue | Repo | Task | Lane | Risk | Priority |
|---|---|---|---|---|---|---|
| 3 | [#57](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/57) | control-tower | Deploy AI Coding + BoB portfolio expansion | AI Coding | medium | P1 |
| 4 | [#53](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/53) | control-tower | Super Synthetic Intelligence Engines framework | Agents | medium | P2 |
| 5 | [#52](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/52) | control-tower | AI apps deployment framework | Product | medium | P2 |
| 6 | [#51](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/51) | control-tower | AI R&D framework for continuous evolution | R&D | medium | P3 |
| 7 | [#50](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/50) | control-tower | Next-level AI improvements across all repos | Fleet | medium | P3 |
| 8 | [#49](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/issues/49) | control-tower | Master expansion roadmap | Strategy | low | P4 |

---

## Completed Tasks

| # | Issue | Repo | Task | Completed | Notes |
|---|---|---|---|---|---|
| — | fleet/clone | control-tower | AI Clone identity hub and sync workflow | 2026-07 | sync-to-clone.yml |
| — | fleet/clone | control-tower | Two-way Clone connection template | 2026-07 | CLONE_CONNECTION.md |
| — | — | control-tower | Hermes scheduled nightly automations | 2026-07 | hermes-scheduled.yml |

---

## How to Add a Task

1. Open a GitHub issue in the appropriate repo
2. Add label `agent-task` and the appropriate `risk:` label
3. Mention `@github-copilot` or `@claude` in the issue body to trigger agent review
4. Claude Code / Copilot will propose a PR — review and approve to proceed

---

## Related Files

- [`AGENT_MODE.md`](../AGENT_MODE.md) — Agent autonomy rules
- [`RISK_GATE.md`](../RISK_GATE.md) — Human approval requirements
- [`.github/ISSUE_TEMPLATE/agent-task.yml`](../.github/ISSUE_TEMPLATE/agent-task.yml) — Issue template for agent tasks
