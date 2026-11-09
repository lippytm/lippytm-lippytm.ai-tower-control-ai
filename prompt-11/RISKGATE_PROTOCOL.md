# Prompt #11 RiskGate Protocol

RiskGate protects the Control Tower from unsafe, unclear, or oversized changes.

## Risk Levels

### Low

Low-risk tasks include:

- documentation updates
- README improvements
- issue templates
- dashboard text
- non-production examples
- small formatting improvements

Low-risk work can usually proceed after normal review.

### Medium

Medium-risk tasks include:

- workflow skeletons
- scripts that do not touch secrets
- test infrastructure
- bot command prototypes
- non-production automation
- repo structure changes

Medium-risk work should include validation steps and clear rollback notes.

### High

High-risk tasks include:

- deployment changes
- secret handling
- permission changes
- production automation
- data deletion
- billing or payment changes
- security-sensitive logic
- changes affecting many repos at once

High-risk work requires explicit human approval before merge or deployment.

### Blocked

Blocked tasks include work that is missing:

- purpose
- owner
- acceptance criteria
- risk level
- rollback plan
- required credentials
- required human approval

Blocked work should not proceed until clarified.

## Required RiskGate Checklist

Before merging meaningful changes, confirm:

- [ ] The task has a clear owner.
- [ ] The task has acceptance criteria.
- [ ] The task has a risk level.
- [ ] The change is scoped.
- [ ] The change avoids unrelated modifications.
- [ ] QA or manual validation steps are documented.
- [ ] Secrets are not exposed.
- [ ] Deployment impact is understood.
- [ ] Rollback or recovery path is clear.
- [ ] Human approval is recorded when needed.

## Human Approval Rule

Any high-risk task must remain unmerged until the human owner approves it in GitHub.

## Principle

RiskGate is not a brake on progress. It is the steering system that keeps the fleet pointed in the right direction.
