# Fork, Clone, Adapt Growth Pattern

Prompt #11 can grow by copying useful patterns, adapting them, and reconnecting them to the Control Tower.

## Purpose

Forking and cloning should create organized growth, not scattered duplication.

## Growth Pattern

```text
Find useful pattern -> Copy or fork -> Rename -> Adapt -> Review -> Document -> Register -> Improve.
```

## When to Fork or Clone

Use this pattern when:

- a repo template can help another repo
- a product format can become a second product
- a service checklist can become a new service
- a bot flow can be adapted for another audience
- a dashboard can be reused for another lane
- a workflow can become a standard kit

## Required Adaptation Fields

```yaml
adaptation:
  source: original repo, file, product, or service
  new_name: null
  target_lane: null
  target_user: null
  purpose_change: null
  files_to_update:
    - README.md
    - PROJECT.md
    - QUALITY.md
    - RISK_GATE.md
  review_needed: true
  next_action: null
```

## Anti-Clutter Rules

Do not clone something unless it has:

- a purpose
- a target user
- a repo or storage location
- a next action
- a review path

## Reconnection Rule

Every forked or cloned item should be added back to one of:

- `fleet/repos.yml`
- a product catalog
- a service catalog
- a dashboard
- a GitHub issue
- a project roadmap

## Principle

Forking and cloning create growth only when adaptation and documentation are included.
