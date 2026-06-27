# Support Playbook

Purpose: create a consistent support system for lippytm.ai automation, chatbot, AI coding, affiliate, funding-intake, and business service workflows.

Quality is Job #1. Be helpful, realistic, and careful.

## Support categories

- Sales questions
- AI automation setup
- Chatbot / ManyChat / BotBuilders questions
- Twin agent questions
- GitHub / repo / Copilot questions
- Website / Replit / Base44 questions
- Funding intake questions
- Affiliate link questions
- Billing/payment questions
- Technical troubleshooting
- Security/privacy concerns
- General business planning

## Severity levels

### Low
General question, documentation update, simple clarification.

### Medium
Customer confusion, setup issue, missing workflow, broken link, unclear instructions.

### High
Payment/billing concern, customer data concern, funding/legal/tax/finance claim risk, public-facing error.

### Critical
Secret exposure, unauthorized access, private customer data leak, payment credential exposure, unsafe automation.

## Universal support response structure

```text
Thanks for reaching out — I can help with that.

Here is what I understand:
[short summary]

Recommended next step:
[next action]

A few things to check:
[checklist]

If this involves billing, private data, funding, legal, tax, or financial details, we should handle it carefully and review before taking action.
```

## Support Router Agent prompt

```text
You are the Support Router Agent for lippytm.ai.

When I give you a customer question, error, complaint, support message, or internal issue, return:

1. Issue type
2. Severity
3. Customer-friendly reply
4. Troubleshooting steps
5. Escalation path
6. GitHub issue/task format
7. FAQ or support-doc improvement
8. Risk/sensitivity warning

Be helpful, realistic, and careful. Do not make unsupported promises.
```

## Funding intake caution

Do not promise:

- funding approval
- specific loan terms
- credit outcomes
- tax outcomes
- legal/entity outcomes
- investment returns
- business income

Use careful wording:

```text
We can help organize your information, prepare intake steps, and route you toward available business funding or service options, but approvals and terms depend on the provider, application, qualifications, and review process.
```

## Affiliate support caution

When discussing affiliate links, be transparent and practical. Avoid guaranteed results.

## Technical troubleshooting checklist

- [ ] What platform is involved?
- [ ] What action was attempted?
- [ ] What was expected?
- [ ] What happened instead?
- [ ] Any error message?
- [ ] Any recent change?
- [ ] Does it involve credentials or private data?
- [ ] Can it be reproduced?
- [ ] Is there a safe manual workaround?

## GitHub issue format for support

```markdown
## Support issue

### Summary

### Platform

### Severity

### Steps to reproduce or understand

### Expected result

### Actual result

### Customer impact

### Risk/sensitivity

### Recommended next action

### Support/doc improvement
```

## Escalation rules

Escalate for human review when:

- customer private data is involved
- payment or billing is involved
- legal/tax/funding/finance claims are involved
- public-facing claims need review
- security risk appears
- API keys, tokens, or credentials are mentioned
- deployment or workflow changes are requested

## Support improvement loop

Every repeated support issue should become:

- FAQ update
- support script
- troubleshooting checklist
- GitHub issue
- workflow improvement
- product/package improvement
- dashboard note

---

## Hermes Agent – Skill failures and gateway reconnect

### Symptom: Hermes skill returns error or times out

**Checklist:**
- [ ] Is the Hermes gateway process running? (`hermes gateway` or Docker container status)
- [ ] Is `HERMES_API_URL` set correctly and reachable from the Tower?
- [ ] Is `HERMES_API_KEY` valid? (Test: `GET /api/connectors/hermes/skills`)
- [ ] Has the Hermes process run out of memory or crashed? Check process logs.
- [ ] Is the skill name spelled correctly? (List available skills at `GET /api/connectors/hermes/skills`)
- [ ] Is the Hermes model provider configured and reachable? (`hermes model`)
- [ ] Did the model API key expire or hit rate limits?

**Reconnect steps:**
1. Restart the Hermes gateway: `hermes gateway` (or restart the Docker container)
2. Verify it's live: `curl $HERMES_API_URL/api/skills -H "Authorization: Bearer ${HERMES_API_KEY}"`
3. Retry the failing Tower request
4. If still failing, fall back to direct OpenAI via `POST /api/connectors/openai/chat`

### Symptom: Nightly scheduled workflow fails

**Checklist:**
- [ ] Check GitHub Actions run logs for the `hermes-scheduled.yml` workflow
- [ ] Verify `TOWER_API_URL`, `TOWER_CLIENT_ID`, `TOWER_CLIENT_SECRET` are set as repo secrets
- [ ] Verify the Tower is deployed and accessible from GitHub Actions runners
- [ ] Verify the auth token step succeeded (check the `auth` step output)
- [ ] Check if the Hermes gateway is up at the scheduled time

**Reconnect steps:**
1. Fix the failing secret or deployment
2. Re-run the workflow manually: Actions → Hermes Scheduled Automations → Run workflow

### Symptom: Memory search returns no results

**Checklist:**
- [ ] Has Hermes run at least one full session? Memory is built from past sessions.
- [ ] Is the FTS5 index populated? (`hermes doctor` may show index status)
- [ ] Is the query broad enough? Try a single-word query first.

### Escalation

Escalate when:
- Customer data may be present in Hermes memory
- The gateway has been running with an exposed `HERMES_API_KEY`
- Hermes skill output is being published without human review

**Fallback:** All Hermes functions can be replaced manually via `POST /api/connectors/openai/chat` or Twin agent workflows.

**Reference:** `integrations/hermes-agent.md`
