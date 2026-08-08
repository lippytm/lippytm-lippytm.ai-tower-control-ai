# Agent Mode

Agent Mode defines how AI and automation should participate in this repository.

## Operating Law

```text
AI proposes -> RiskGate evaluates -> human owner approves -> agents execute -> QA verifies -> documentation updates -> systems evolve.
```

## Allowed Agent Work

Agents may help with:

- planning
- documentation
- issue drafting
- acceptance criteria
- code suggestions
- small PRs
- tests
- QA checklists
- dashboard updates
- maintenance review proposals

## Restricted Agent Work

Agents should not independently perform high-impact changes without owner review.

Restricted areas include:

- production deployment
- secret handling
- permissions
- billing
- customer data
- irreversible changes
- broad multi-repo changes

## Standard Agent Task Flow

1. Create or update a GitHub issue.
2. Add scope and acceptance criteria.
3. Classify lane, type, risk, and status.
4. Draft plan or PR.
5. Run QA or document validation.
6. Apply RiskGate when required.
7. Human owner approves, requests changes, or blocks.
8. Update docs and dashboard.

## Agent Output Requirements

Agent output should include:

- what changed
- why it changed
- files affected
- validation steps
- assumptions
- risks
- next action

## Principle

Agents accelerate work. They do not replace ownership, review, or judgment.
