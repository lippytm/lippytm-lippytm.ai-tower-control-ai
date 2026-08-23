# Security Lane Checklist

Apply this after the universal repo templates. For: `cybersecurity-layer`.

> **Risk level: high.** Human review required for every change.

## Foundation checklist

- [ ] `SECURITY.md` and `docs/architecture.md` written before any code
- [ ] Every tool, scan type, and alert path documented
- [ ] `docs/runbook.md` includes incident response steps
- [ ] Human review gate on every PR to main
- [ ] No scan results, credentials, or customer vulnerability data stored in public repo

## Architecture doc must include

- [ ] What tools are used (scanners, monitors, alert systems)
- [ ] What each tool scans (code, deps, secrets, network, etc.)
- [ ] Where alerts go (Slack, email, GitHub Security tab)
- [ ] Who is responsible for reviewing each alert type
- [ ] How findings are triaged and resolved

## Incident response template (add to `docs/runbook.md`)

```markdown
## Incident response

1. Detect — how is the incident identified?
2. Contain — stop the spread or impact
3. Assess — what data or systems are affected?
4. Notify — who needs to know? (internal, customer, regulator)
5. Remediate — fix the root cause
6. Review — post-mortem and prevention issue
```

## Security checklist

- [ ] Zero real credentials in repo
- [ ] No customer vulnerability data in public repo
- [ ] CODEOWNERS set for all security files
- [ ] All security tooling changes require human sign-off

## Next actions after applying templates

1. Write `docs/architecture.md` with tool inventory
2. Write `docs/runbook.md` with incident response steps
3. Enable CodeQL and Dependabot
4. Add CODEOWNERS
5. Human review before any code is added
6. Update `fleet/repos.yml`
