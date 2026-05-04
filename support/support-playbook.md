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
