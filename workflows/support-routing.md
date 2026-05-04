# Support Routing Workflow

Purpose: route customer, internal, technical, chatbot, automation, funding-intake, affiliate, and repo questions into clear support actions.

Quality is Job #1. Be helpful, realistic, and careful.

## Trigger

A customer message, error, complaint, internal issue, or support question.

## Inputs

- message or issue
- platform involved
- customer/user impact
- urgency
- any error text
- whether private data, billing, funding, legal, tax, finance, or credentials are involved

## Outputs

- issue type
- severity
- customer-friendly reply
- troubleshooting checklist
- escalation path
- GitHub issue format
- FAQ/support-doc improvement
- risk warning

## Severity levels

- Low: simple question or documentation issue
- Medium: setup issue, broken link, customer confusion, unclear workflow
- High: billing, customer data, funding/legal/tax/finance claim risk, public-facing error
- Critical: exposed secrets, unauthorized access, customer data leak, payment credential exposure

## Prompt

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

## Escalation rules

Escalate for human review when:

- customer private data is involved
- payment or billing is involved
- legal, tax, funding, finance, investment, or trading claims are involved
- public-facing claims need review
- security risk appears
- API keys, tokens, or credentials are mentioned
- deployment or workflow changes are requested

## GitHub issue template

```markdown
## Support issue

### Summary

### Platform

### Severity

### Customer/user impact

### Steps or message

### Expected result

### Actual result

### Risk/sensitivity

### Recommended next action

### FAQ/support-doc improvement
```

## Definition of done

- [ ] Issue type is clear
- [ ] Severity is clear
- [ ] Reply is helpful and realistic
- [ ] Escalation path is clear
- [ ] Sensitive data is protected
- [ ] Support-doc improvement is identified
