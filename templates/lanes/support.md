# Support Lane Checklist

Apply this after the universal repo templates. For: `sandbox-toolkit`.

## Foundation checklist

- [ ] Every support flow defined as a workflow: trigger → triage → response → escalation → close
- [ ] `docs/support-playbook.md` has canned responses and escalation rules
- [ ] Internal tools clearly labeled as separate from customer-facing tools
- [ ] Feedback loop established: issues found in support become GitHub issues
- [ ] Severity levels defined (low / medium / high / critical)

## Support flow template (copy to `docs/support-playbook.md`)

```markdown
## Support flow: [category]

- **Trigger:** [how is this request received?]
- **Triage:** [how is severity determined?]
- **Response:** [approved canned reply or escalation path]
- **Escalation:** [who handles it if not resolved in tier 1?]
- **Close:** [how is the issue marked resolved?]
- **Feedback loop:** [if this reveals a gap, open a GitHub issue for it]
```

## Severity levels

| Level | Definition | Response time |
|---|---|---|
| Low | Minor issue, no customer impact | 48 hours |
| Medium | Customer-facing issue or broken workflow | 24 hours |
| High | Data loss, security issue, or payment failure | Immediate |
| Critical | Secrets exposure, unauthorized access | Immediate — human only |

## Security checklist

- [ ] No customer PII in support logs stored in public repo
- [ ] High/critical support responses require human review before sending

## Next actions after applying templates

1. Write `docs/support-playbook.md` with at least 3 support flows
2. Add `support/canned-replies.md`
3. Connect feedback loop to GitHub issues
4. Define severity levels
5. Update `fleet/repos.yml`
