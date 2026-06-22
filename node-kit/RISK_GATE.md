# RiskGate

RiskGate is the review checkpoint for repo changes that may affect quality, safety, cost, users, workflows, deployment, or business operations.

## Risk Levels

### Low

- Documentation updates
- README improvements
- templates
- examples
- non-production notes

### Medium

- workflow updates
- scripts
- tests
- repo structure changes
- command prototypes
- integration drafts

### High

- deployment settings
- permissions
- payment or billing workflows
- customer-facing behavior
- secrets handling
- production automation
- changes affecting many repos

### Blocked

- unclear owner
- unclear scope
- unclear validation
- unclear rollback
- missing context
- missing approval

## RiskGate Checklist

- [ ] Owner identified.
- [ ] Scope defined.
- [ ] Risk level assigned.
- [ ] Validation plan included.
- [ ] Rollback or correction path included.
- [ ] Secrets are not exposed.
- [ ] Deployment impact is understood.
- [ ] Business impact is understood.
- [ ] Human approval recorded when required.

## Decision

```yaml
riskgate:
  status: pending|approved|changes_requested|blocked
  reviewer: lippytm
  risk_level: low|medium|high|blocked
  decision_notes: null
  next_action: null
```

## Principle

RiskGate keeps Prompt #11 useful, reviewable, and under human ownership.
