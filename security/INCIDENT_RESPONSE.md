# Tower Control Incident Response

## Purpose

Provide a response plan for cross-repository automation, GitHub Actions, security rollout, CRM/bot routing, data exposure, and autonomous workflow incidents.

## Incident examples

- GitHub token or automation credential exposed.
- Cross-repo automation changes the wrong repo/file.
- Workflow permissions are too broad.
- Failed security run reveals configuration risk.
- CRM export or lead list committed.
- Database dump committed.
- Autonomous system publishes or modifies content without approval.
- Security workflow is broken across multiple repositories.

## Response process

### 1. Identify

Record:

- What happened?
- Which repo/workflow/automation is affected?
- Which credentials or data may be involved?
- How many repositories are affected?
- What is the severity?

### 2. Contain

- Pause risky automation.
- Disable affected workflow if needed.
- Revoke or rotate exposed credentials.
- Remove exposed data.
- Restrict access.
- Open a security-risk issue without exposing sensitive details.

### 3. Fix

- Patch workflow permissions.
- Correct automation scope.
- Add dry-run mode or approval gate.
- Update dependency or CodeQL configuration.
- Rewrite unsafe workflow logic.
- Update data handling docs.

### 4. Recover

- Re-run security workflows.
- Confirm affected repos are safe.
- Confirm secrets were rotated if needed.
- Confirm automation is paused or restored safely.
- Update fleet status.

### 5. Learn

- Add prevention checklist.
- Update failed-run taxonomy if needed.
- Update RiskGate rules.
- Update security rollout issue.
- Document lessons learned.

## Severity guide

### Low

Documentation or checklist issue.

### Medium

Workflow misconfiguration, dependency alert, overly broad non-secret workflow permission.

### High

Exposed token/key, private lead data, unsafe cross-repo automation, deployment credential risk.

### Critical

Compromised account, active abuse, major data exposure, production credential compromise, autonomous system causing broad unauthorized changes.

## Incident report template

```md
# Tower Control Security Incident

Date found:
Affected repo/workflow/automation:
Severity:
Number of repos affected:

## Summary

## Impact

## Containment

## Root cause

## Fix

## Secrets rotated?

## Fleet prevention added
```

## Best practice

Tower-control incidents can affect many repositories. Move carefully, pause risky automation first, rotate secrets when needed, and document prevention before expanding again.
