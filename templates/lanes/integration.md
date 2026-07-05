# Integration Lane Checklist

Apply this after the universal repo templates. For: `MyClaw.lippytm.AI-`, `OpenClaw-lippytm.AI-`, `Base44-`.

## Foundation checklist

- [ ] `docs/architecture.md` describes: what this connects, what data flows, what triggers what
- [ ] All credential names documented in `.env.example` and `SECURITY.md` (never real values)
- [ ] `docs/integrations.md` lists every connected platform, API endpoint, and expected response
- [ ] Manual test plan added and completed before enabling any automation
- [ ] Failure and fallback playbook documented for each integration point

## Security checklist

- [ ] Zero real credentials in repo — environment secrets only
- [ ] `.env.example` with placeholder names committed
- [ ] No customer PII passed through integration without encryption and access control
- [ ] Human review before any live API connection is enabled

## `.env.example` template

```text
# [Platform] Integration
PLATFORM_API_KEY=your-api-key-here
PLATFORM_WEBHOOK_SECRET=your-webhook-secret-here
PLATFORM_BASE_URL=https://api.platform.com
```

## Failure and fallback template

```markdown
## Failure playbook: [integration name]

- Symptom: [what error looks like]
- First response: [check logs / retry / alert human]
- Escalation: [contact platform support / disable integration]
- Manual fallback: [use platform native UI]
- Recovery: [steps to re-enable after fix]
```

## Next actions after applying templates

1. Add `docs/architecture.md` with data flow diagram or description
2. Add `.env.example` with placeholders
3. Add `docs/integrations.md`
4. Write manual test plan
5. Document failure and fallback for each integration point
6. Human review before enabling live connection
7. Update `fleet/repos.yml`
