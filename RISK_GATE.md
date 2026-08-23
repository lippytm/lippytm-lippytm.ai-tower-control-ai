# RiskGate — Human Approval Gate

## Purpose

The RiskGate is the mandatory human-approval layer for the lippytm.ai Control Tower. No high-risk automation, live deployment, or outbound communication may proceed without passing through this gate.

## Operating Doctrine

```
AI proposes → RiskGate evaluates → Human owner approves → Executor acts → QA verifies → Telemetry improves
```

---

## Risk Levels

| Level | Label | Description | Approval required |
|---|---|---|---|
| **Critical** | `risk: critical` | Payment flows, live Zaps to customers, OAuth credential changes, public legal/financial claims | Charles (lippytm) — written approval |
| **High** | `risk: high` | New external integrations, live deployments, database schema changes, funding pages | Charles (lippytm) — comment approval on PR/issue |
| **Medium** | `risk: medium` | New automations, workflow additions, registry changes, external API calls | Copilot or Claude Code + at least 1 human review |
| **Low** | `risk: low` | Docs, templates, issue templates, Markdown files, status dashboards | Copilot / Claude Code autonomous — no human hold |

---

## Blocked Without Approval

The following actions are **blocked** until Charles explicitly approves in a GitHub issue, PR comment, or signed-off commit message:

- Activating live Zapier Zaps that send real outbound messages or trigger payments
- Sending outbound Dubb video messages to real prospects
- Changing payment, affiliate, or payout flows
- Publishing claims about guaranteed income, funding approval, investment returns, legal outcomes, or medical results
- Modifying OAuth credentials or API secrets in production
- Pushing to a payment-gated or subscriber-gated product without QA sign-off

---

## Gate Checklist (add to PRs with risk level ≥ medium)

```markdown
## RiskGate Checklist
- [ ] Risk level assessed and labeled on this PR/issue
- [ ] No hardcoded secrets or credentials
- [ ] No guaranteed-outcome claims (income, funding, legal, tax, investment, medical)
- [ ] External API calls use placeholder secrets from .env.example
- [ ] Compliance/safety note present if customer-facing
- [ ] QA workflow passes (quality-gate.yml)
- [ ] Human owner reviewed and approved (for high/critical)
```

---

## Escalation Path

| Situation | Action |
|---|---|
| Unsure of risk level | Default to **high** and request Charles review |
| Automation about to touch payments | Stop immediately — open a new `risk: critical` issue |
| Security vulnerability found | Follow `SECURITY.md` — private disclosure first |
| Compliance concern | Tag `compliance` label and hold until Charles approves |

---

## Related Files

- [`SECURITY.md`](SECURITY.md) — Security disclosure and patching policy
- [`QUALITY.md`](QUALITY.md) — Quality standards and QA checklist
- [`AGENT_MODE.md`](AGENT_MODE.md) — Autonomous agent operating boundaries
- [`.github/workflows/quality-gate.yml`](.github/workflows/quality-gate.yml) — Automated quality gate workflow
