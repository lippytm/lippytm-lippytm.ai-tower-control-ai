# Workspace Issue Resolution Dashboard

This dashboard tracks issues across the Prompt #11 GitHub workspace.

## Purpose

The dashboard helps the Control Tower see what is working, what is broken, what is blocked, what is fixed, and what should be improved next.

## Summary

```yaml
issue_resolution_summary:
  total_open_issues: 0
  total_blocked_issues: 0
  total_prs_open: 0
  total_fixed_this_week: 0
  repeated_issue_patterns: 0
  next_highest_priority_issue: null
```

## Repo Issue Status

```yaml
repo_issue_status:
  repo: lippytm/example-repo
  open_issues: 0
  blocked_issues: 0
  open_prs: 0
  quality_status: unknown|needs-work|usable|strong
  most_important_issue: null
  next_action: null
```

## Issue Categories

Track issues by category:

- bugs
- documentation gaps
- workflow problems
- missing QA
- missing RiskGate
- unclear ownership
- repo registry drift
- product/service packaging gaps
- platform integration gaps
- dashboard gaps

## Resolution Board

| Repo | Issue | Category | Priority | Status | Next Action |
|---|---|---|---|---|---|
| example | example issue | docs | medium | new | classify issue |

## Repeated Issue Patterns

Use this section when the same problem appears in more than one repo.

```yaml
repeated_pattern:
  pattern_name: Missing PROJECT.md
  affected_repos:
    - lippytm/example-repo
  recommended_fix: Apply Prompt #11 node kit
  next_action: Open repo rollout issue
```

## Fixed Issues Log

```yaml
fixed_issue:
  repo: lippytm/example-repo
  issue: null
  fix_pr: null
  validation: null
  lesson_learned: null
  should_clone_pattern: true|false
```

## Next Action Rule

Every unresolved item should have a next action.

If the next action is unknown, the next action is:

```text
clarify owner, scope, evidence, and validation path.
```

## Principle

Issues are not failures of the system. Untracked issues are failures of visibility. Prompt #11 turns issues into visible, reviewable, fixable work.
