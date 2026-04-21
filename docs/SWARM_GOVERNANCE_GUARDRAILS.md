# Swarm Governance Guardrails

## Purpose
This document defines governance and review boundaries for the Mass Super Artificial Synthetic Intelligence Swarm architecture.

The objective is to make swarm operations scalable without losing accountability, safety, quality, or human oversight.

## Core Rules
1. every swarm must have a defined role and scope
2. every swarm must identify allowed and restricted actions
3. higher-risk actions require stronger human review
4. important outputs should be traceable where practical
5. no swarm should represent itself as final authority on legal, tax, or professional matters without qualified review

## Review Levels
### Level 1 — Operational Review
Low-risk drafting, indexing, or internal organization.

### Level 2 — Internal Human Review
Required for repo changes, customer-facing drafts, business summaries, important status reports, and policy-adjacent outputs.

### Level 3 — Professional Review
Required where outputs touch legal, tax, payroll, regulatory, or other professional-judgment-sensitive areas.

## Restricted Actions
Swarm units should not independently:
- finalize legal advice
- finalize tax treatment decisions
- approve critical business claims without review
- auto-close major exceptions without human review
- claim professional authority they do not have

## Recommended Tracking Fields
- swarm ID
- role ID
- owner
- review level
- linked entities / repos / platforms
- last updated date
- output log reference
- escalation path

## Best Practices
- keep review levels visible
- preserve handoff points to humans
- use GitHub as the canonical home for swarm definitions and status where possible
- log important decisions and unresolved issues
- review swarm definitions periodically as the fleet evolves
