# Slack Commands for Prompt #11

Slack is the human command layer for Prompt #11. Commands should create or update durable GitHub records.

## Command Namespace

```text
/bos prompt11
```

## Commands

### Status

```text
/bos prompt11 status
```

Returns the current Prompt #11 status dashboard.

### Create Task

```text
/bos prompt11 task <repo> <request>
```

Creates a GitHub issue using `communications/TASK_OBJECT_MODEL.yml`.

### Code Request

```text
/bos prompt11 code <repo> <feature-or-fix>
```

Creates a scoped implementation issue that can be routed to Claude Code.

### QA Request

```text
/bos prompt11 qa <repo-or-pr>
```

Creates or updates a QA checklist for a repo or pull request.

### RiskGate Review

```text
/bos prompt11 risk <repo-or-task>
```

Creates or updates a RiskGate review item.

### Revenue Priority

```text
/bos prompt11 revenue <idea-or-repo>
```

Creates a revenue-priority task for offers, lead flows, checkout, delivery, onboarding, or support systems.

### Evolve Repo

```text
/bos prompt11 evolve <repo> <improvement-request>
```

Creates a repo improvement task using the Prompt #11 lifecycle.

### Documentation Request

```text
/bos prompt11 docs <repo> <doc-request>
```

Creates a documentation task.

### Blocker List

```text
/bos prompt11 blocked
```

Returns blocked tasks from the dashboard or issue labels.

### Next Action

```text
/bos prompt11 next
```

Returns the next recommended Control Tower action.

## Implementation Rule

Slack commands should not be the system of record. Slack starts or queries work. GitHub remembers work.

## MVP Flow

```text
/bos prompt11 code lippytm/Web3AI add README health check
```

Expected flow:

1. Slack receives command.
2. Slack app creates GitHub issue.
3. Issue includes task object fields.
4. Issue receives labels.
5. Claude Code can be requested from the issue.
6. PR is reviewed by QA and RiskGate.
7. Slack receives status updates.
