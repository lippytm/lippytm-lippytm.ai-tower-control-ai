# Agent Mode — Autonomous Operating Rules

## Purpose

This document defines the boundaries, behaviors, and escalation rules for AI agents (GitHub Copilot, Claude Code, Hermes, and future agents) operating in the lippytm.ai Control Tower and fleet.

---

## Agent Operating Doctrine

```
Observe → Propose → Wait for approval (if required) → Execute → Verify → Report
```

Agents **never** act unilaterally on high- or critical-risk tasks. They propose, document, and wait.

---

## What Agents May Do Autonomously (Low Risk)

- Create or update Markdown documentation files
- Add or modify GitHub issue templates and PR templates
- Update fleet registry files (`fleet/repos.yml`, status dashboards)
- Create new workflow files for low-risk automations (docs checks, status pings)
- Add comments, labels, or checklists to existing issues
- Generate reports, status summaries, or audit logs

---

## What Agents Must Propose (Medium Risk — Human Review Required)

- Add new GitHub Actions workflows that call external APIs
- Add new connectors or integrations in `src/connectors/`
- Update `fleet/repos.yml` with new repos or change repo roles
- Modify `.github/copilot-instructions.md`
- Create or update `.env.example` with new placeholders
- Add new npm packages or update existing dependencies

---

## What Agents Must NOT Do Without Explicit Human Approval (High / Critical)

- Push or merge to `main` directly
- Activate live Zapier Zaps or outbound Dubb campaigns
- Modify secrets, credentials, or OAuth configs in production
- Publish customer-facing pages with income, legal, or financial claims
- Change payment, affiliate, or payout flows
- Send real outbound emails, DMs, or video messages to customers

---

## Handoff Protocol

When an agent completes a task or hits a boundary, it must:

1. Open or update a GitHub issue summarizing what was done and what is blocked
2. Apply the appropriate risk label (`risk: low`, `risk: medium`, `risk: high`, `risk: critical`)
3. Tag `@lippytm` if human approval is required
4. Leave a clear "Next step for human" comment before stopping

---

## Agent Registry

| Agent | Role | Trigger | Autonomy level |
|---|---|---|---|
| **GitHub Copilot** | Code and docs suggestions | Manual invocation | Medium (propose + wait for PR approval) |
| **Claude Code** | Issue-driven code changes | GitHub issue mention | Medium (propose PR, wait for approval) |
| **Hermes** | Scheduled nightly summaries and audits | Cron / webhook | Low (read-only + report) |
| **Fleet Pulse** | Fleet health monitoring | Cron + push events | Low (status + alert) |
| **Quality Gate** | PR quality enforcement | Pull request event | Low (check + block merge if failing) |

---

## Related Files

- [`RISK_GATE.md`](RISK_GATE.md) — Risk assessment and approval gate
- [`SECURITY.md`](SECURITY.md) — Security disclosure policy
- [`QUALITY.md`](QUALITY.md) — Quality standards
- [`fleet/CLAUDE_TASKS.md`](fleet/CLAUDE_TASKS.md) — Current Claude Code task queue
