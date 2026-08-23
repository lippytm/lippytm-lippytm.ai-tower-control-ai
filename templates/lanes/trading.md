# Trading Lane Checklist

Apply this after the universal repo templates. For: `trading-bots`.

> ⚠️ **Risk level: CRITICAL.** Human approval required for every change, no exceptions.

## Foundation checklist (human review required before each step)

- [ ] `RISK_GATE.md` copied and placed as first file reviewed — no code runs before this is approved
- [ ] Compliance notice added to README, every file, and every comment block
- [ ] All API credentials use environment secrets — zero exceptions
- [ ] Manual paper-trading validation plan written and completed
- [ ] `docs/runbook.md` includes kill-switch and emergency stop procedures
- [ ] Human sign-off on record before any live capital connection

## Required compliance notice (add to README and every major file)

> ⚠️ **Compliance notice:** Trading bots are experimental tools only. Past performance does not guarantee future results. All live trading carries risk of significant financial loss. This repository does not constitute investment advice. Never connect to live capital without qualified professional review and explicit human approval.

## Kill-switch and emergency stop (add to `docs/runbook.md`)

```markdown
## Emergency stop procedure

1. Immediately revoke all trading API keys from the exchange dashboard.
2. Close all open positions manually via the exchange UI.
3. Disable all scheduled workflows in GitHub Actions.
4. Document the incident in a GitHub issue.
5. Do not re-enable without human review and written approval.
```

## Security checklist

- [ ] Zero real credentials in repo
- [ ] Exchange API keys use IP whitelisting and minimum required permissions
- [ ] No customer funds or accounts stored or referenced in public repo
- [ ] All changes require two human reviews before merge

## Next actions after applying templates

1. Add compliance notice to README
2. Copy and review `RISK_GATE.md`
3. Write paper-trading plan before connecting any live API
4. Write `docs/runbook.md` with kill-switch procedure
5. Human sign-off required before any next step
6. Update `fleet/repos.yml` risk_level: critical
