# Prompt #11 Self-Healing Protocol

Prompt #11 self-healing means the Control Tower can detect common operational failures, document them, propose recovery steps, and route safe fixes through GitHub issues and pull requests.

Self-healing does **not** mean uncontrolled automatic repair. It means safe recovery patterns with evidence, limits, QA, RiskGate, and human approval when needed.

## Core Rule

```text
Detect -> Classify -> Contain -> Propose Fix -> Validate -> Document -> Prevent Recurrence.
```

## What Self-Healing Can Detect

Prompt #11 should watch for:

- failed GitHub Actions workflows
- missing required files
- broken docs links
- incomplete task objects
- issues without acceptance criteria
- PRs without QA plans
- stale branches
- blocked tasks
- missing repo metadata
- repeated manual work
- missing RiskGate review
- missing status dashboard updates
- repo registry drift
- unclear ownership
- merge conflicts
- dependency or build failures reported by CI

## Self-Healing Levels

### Level 0: Observe Only

The system records a failure or gap but does not act.

Use when:

- evidence is incomplete
- risk is unclear
- business impact is unknown
- owner is unclear

### Level 1: Recommend

The system proposes a fix as a GitHub issue or PR checklist.

Use when:

- the problem is clear
- the fix is low risk
- a human should review first

### Level 2: Draft Fix

The system creates a branch or asks Claude Code to draft a small PR.

Use when:

- the fix is scoped
- rollback is clear
- QA can validate the change
- no secrets or production settings are affected

### Level 3: Assisted Recovery

The system prepares a recovery plan for human approval.

Use when:

- workflows are repeatedly failing
- a repo is blocked
- a release is stuck
- multiple repos are affected
- risk is medium or high

### Level 4: Human-Controlled Intervention

Human owner decides and approves the recovery.

Required when:

- high-risk workflows are affected
- deployment settings are involved
- secrets, permissions, billing, data, or production systems are involved
- many repos are affected at once

## Standard Self-Healing Task

```yaml
healing_task:
  id: HEAL-0001
  detected_from: workflow|issue|pr|dashboard|manual|slack|chatgpt|claude
  failure_type: ci_failure|missing_file|stale_task|missing_qa|missing_riskgate|repo_drift|docs_gap|merge_conflict|unknown
  affected_repo: lippytm/example-repo
  affected_file: null
  evidence:
    - Link or note showing the failure
  severity: low|medium|high|blocked
  containment_step: What prevents the issue from getting worse?
  proposed_fix: What should change?
  qa_plan:
    - Validation step 1
    - Validation step 2
  rollback_plan: How to reverse the fix if wrong.
  approval_required: true|false
  owner: lippytm
  status: detected|triaged|fix_proposed|pr_open|qa|riskgate|approved|healed|blocked
  recurrence_prevention: What prevents the same problem from returning?
  next_action: The next concrete step.
```

## Recovery Playbooks

### Missing Required File

1. Detect missing file through Quality Gate.
2. Create issue using healing task object.
3. Draft small PR adding the missing file.
4. Run Quality Gate.
5. Update dashboard.

### Failed Workflow

1. Capture workflow name, run URL, failing job, and error summary.
2. Classify severity.
3. Check if failure is flaky, configuration, dependency, syntax, or missing file.
4. Propose fix.
5. Draft PR if low or medium risk.
6. Require approval if deployment, secrets, permissions, or production behavior are involved.

### Stale or Blocked Task

1. Identify issue older than threshold with no next action.
2. Comment with recommended next step.
3. Add `status:blocked` or `status:needs-next-action` label.
4. Route to weekly review.

### Repo Registry Drift

1. Compare discovered repos to `fleet/repos.yml`.
2. Create an improvement issue listing missing repos or stale metadata.
3. Update registry by PR.
4. Update `fleet/PROMPT_11_STATUS.md`.

## Healing Boundaries

Self-healing must not:

- delete data without explicit approval
- change secrets or permissions automatically
- deploy production changes automatically
- hide failures
- mark work complete without validation
- bypass QA
- bypass RiskGate
- bypass the human owner on high-risk changes

## Success Metrics

Track:

- failures detected
- failures triaged
- fixes proposed
- fixes merged
- repeat failures reduced
- blocked tasks reopened or resolved
- missing files restored
- workflow failures fixed
- dashboards updated after recovery

## Principle

A healthy system does not pretend nothing broke. A healthy system detects breakage early, makes it visible, proposes a safe repair, validates the result, and documents the lesson.
