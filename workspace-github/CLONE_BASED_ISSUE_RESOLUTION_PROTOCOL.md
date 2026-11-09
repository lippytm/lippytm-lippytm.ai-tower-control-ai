# Clone-Based Issue Resolution Protocol

This protocol explains how cloning, forking, adapting, and reconnecting GitHub workspace patterns helps resolve issues across the Prompt #11 repo fleet.

## Purpose

The goal is to make every issue visible, trackable, reviewable, fixable, and documented.

The system should not pretend there will never be failures. Instead, it should make failures easier to detect, understand, repair, validate, and prevent from repeating.

## Core Resolution Law

```text
Issue observed -> GitHub record -> classify -> reproduce or inspect -> fix proposal -> PR -> QA -> RiskGate -> merge -> document -> prevent repeat.
```

## Why Clone Patterns Into Repos

Cloning the Prompt #11 node kit into each repository gives every repo the same basic operating tools:

- project purpose
- quality checklist
- RiskGate checklist
- Agent Mode rules
- Prompt #11 node identity
- maintenance review template
- quality workflow template
- fleet pulse workflow template
- next-action visibility

This makes issues easier to compare, route, and resolve across the full workspace.

## Standard Issue Lifecycle

### 1. Capture

Every problem, gap, bug, missing file, workflow failure, unclear doc, or blocker should become a GitHub issue.

### 2. Classify

Each issue should identify:

```yaml
issue_classification:
  repo: lippytm/example-repo
  lane: control-tower|bots|web3|publishing|creative|infrastructure|qa|revenue|life-systems|education
  issue_type: bug|docs|workflow|qa|riskgate|integration|product|service|platform|unknown
  priority: low|medium|high|urgent
  risk_level: low|medium|high|blocked
  owner: lippytm
  next_action: null
```

### 3. Inspect

Use available evidence:

- issue body
- PR diff
- workflow result
- logs when available
- affected files
- repo docs
- dashboard status
- user notes

### 4. Propose Fix

A fix proposal should include:

- what appears wrong
- what should change
- files affected
- validation plan
- rollback or correction path
- owner decision needed if any

### 5. Open PR

Fixes should move through pull requests when files change.

### 6. Validate

Validation may include:

- tests
- build check
- workflow check
- docs review
- manual checklist
- reviewer confirmation

### 7. Close or Continue

Close the issue only when the fix is validated and documented.

If not fixed, update the issue with the next action instead of leaving it stale.

## Resolution Status Values

```yaml
resolution_status:
  - new
  - classified
  - inspecting
  - fix_proposed
  - pr_open
  - qa_review
  - riskgate_review
  - fixed
  - needs_more_work
  - blocked
  - parked
```

## Repeat-Prevention Rule

After a fix, ask:

1. Should this become a template update?
2. Should this be added to the node kit?
3. Should a workflow catch this next time?
4. Should docs be clarified?
5. Should the dashboard track this condition?
6. Should other repos be checked for the same problem?

## Clone-Based Growth Rule

When one repo gets a good fix, decide whether to clone the pattern to other repos.

```text
Fix once -> document pattern -> test in one repo -> apply to next repo -> update Control Tower.
```

## Principle

A healthy GitHub workspace is not one where nothing ever breaks. It is one where every important issue has a record, an owner, a next action, a review path, and a way to improve the system after the fix.
