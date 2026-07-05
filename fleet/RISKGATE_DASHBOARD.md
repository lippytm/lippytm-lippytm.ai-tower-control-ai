# RiskGate Dashboard

> Tracks open risk items, pending approvals, and completed gates across the fleet.

## Open Risk Items

| # | Item | Level | Repo | Status | Owner |
|---|---|---|---|---|---|
| 1 | Live Zapier Zaps not yet activated | critical | All | ⏸ Blocked until Charles approval | @lippytm |
| 2 | Dubb.AI outbound campaign not yet launched | high | control-tower | ⏸ Blocked until Charles approval | @lippytm |
| 3 | Funding page claims review | high | lippytmai.getbizfunds.com- | 🟡 Pending | @lippytm |
| 4 | Trading bots activation | critical | trading-bots | ⏸ Blocked — requires written approval | @lippytm |
| 5 | Payment/affiliate flow setup | critical | Multiple | ⏸ Blocked | @lippytm |

---

## Recently Approved

| Date | Item | Level | Approved by | Notes |
|---|---|---|---|---|
| 2026-07 | AI Clone sync workflow | medium | lippytm | sync-to-clone.yml activated |
| 2026-07 | Hermes nightly automation | medium | lippytm | hermes-scheduled.yml activated |
| 2026-07 | Fleet registry creation | low | lippytm | fleet/repos.yml created |

---

## Gate Rules Summary

| Level | Action needed |
|---|---|
| 🔴 Critical | Written approval in GitHub issue from @lippytm before any execution |
| 🟠 High | PR comment approval from @lippytm before merge |
| 🟡 Medium | At least 1 human review on PR (Copilot/Claude Code may propose) |
| 🟢 Low | Autonomous execution allowed — log result in fleet status |

---

## How to Open a New Risk Item

1. Create a GitHub issue with label `risk: critical`, `risk: high`, `risk: medium`, or `risk: low`
2. Describe the action, affected repos, and desired outcome
3. Tag `@lippytm` for critical/high items
4. Add to this dashboard manually or via the `fleet-status-update.yml` workflow

---

## Related Files

- [`RISK_GATE.md`](../RISK_GATE.md) — Full risk gate policy
- [`AGENT_MODE.md`](../AGENT_MODE.md) — Agent autonomy boundaries
- [`FLEET_STATUS.md`](FLEET_STATUS.md) — Fleet health overview
