# Support Playbook

The lippytm.ai Control Tower support playbook. See `support/support-playbook.md` for the full detailed playbook.

## Quick reference

### Support flow

```
Incoming request → Triage by category → Apply canned reply or escalate → Resolve → Log → Close
```

### Categories and contacts

| Category | First response | Escalation |
|---|---|---|
| AI coding questions | Copilot / ChatGPT + link to docs | Human review |
| Automation / workflow | Link to workflows/ + runbook | Human review |
| Chatbot / ManyChat | Link to bot workflow docs | Human review |
| Funding intake | Compliance-reviewed response only | Human + compliance review |
| Billing / payment | Do not respond without human review | Human review always |
| Security / privacy | Immediate human escalation | Critical — human only |
| General business | Standard canned reply | Human review |

### Canned replies

See `support/canned-replies.md` for approved response templates.

### Escalation rules

- **Low risk:** AI or automation can draft a response; human approves before sending.
- **Medium risk:** Human reviews draft before sending.
- **High / Critical risk:** Human only, no AI draft is sent without explicit approval.

### Compliance notice for all customer support

> We do not guarantee funding approval, income, legal outcomes, tax outcomes, investment returns, or trading results. Our tools and services are for educational and automation assistance only.

## Related docs

- `support/support-playbook.md` — detailed playbook
- `support/canned-replies.md` — approved response templates
- `RISK_GATE.md` — approval gate for high-risk responses
- `SECURITY.md` — credential and data handling rules
