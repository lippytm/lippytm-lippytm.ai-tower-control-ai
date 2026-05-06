# Tower Control Security Checklist

## Purpose

Use this checklist before creating or changing cross-repository automation, GitHub Actions workflows, security rollout systems, CRM/bot routing plans, fleet status systems, or autonomous agent workflows.

## Core principle

Quality and Quality Assurance is Job #1. The tower-control repo must protect every repo, not create new risk across the fleet.

## Repository checklist

- [ ] Security policy exists.
- [ ] Security checklist exists.
- [ ] Dependabot is configured.
- [ ] Code scanning is configured where useful.
- [ ] Dependency review runs on pull requests.
- [ ] Security-risk issue template exists.
- [ ] No secrets are committed.
- [ ] No `.env` files are committed.
- [ ] No private lead/customer data is committed.
- [ ] No automation credentials are committed.
- [ ] No database dumps are committed.

## Cross-repo automation checklist

- [ ] Automation purpose is documented.
- [ ] Affected repositories are listed.
- [ ] Required permissions are listed.
- [ ] Permissions use least privilege.
- [ ] High-risk actions require human approval.
- [ ] Rollback plan exists.
- [ ] Dry-run mode exists where possible.
- [ ] Logs do not expose secrets.
- [ ] Changes happen through PRs when possible.

## RiskGate checklist

Before execution, classify the action:

- [ ] Low risk: docs/copy/checklist update.
- [ ] Medium risk: workflow, dependency, website, bot, CRM routing change.
- [ ] High risk: secrets, deployment, database, auth, payments, autonomous external action.

High-risk changes require explicit review.

## GitHub Actions checklist

- [ ] Workflow permissions use least privilege.
- [ ] Pull request workflows do not expose secrets to untrusted code.
- [ ] Third-party actions are reviewed.
- [ ] Failed runs are categorized using the failed-run taxonomy.
- [ ] True vulnerabilities get a security-risk issue.

## Data checklist

- [ ] No CRM exports in GitHub.
- [ ] No private lead/customer records in public docs.
- [ ] No secrets in logs.
- [ ] No database dumps.
- [ ] Test data is not real private customer data.

## Autonomous systems checklist

- [ ] AI proposes.
- [ ] RiskGate classifies.
- [ ] Human approves high-risk actions.
- [ ] Executor acts only within documented scope.
- [ ] Results are logged.
- [ ] Security review follows failures.

## Weekly security rhythm

- [ ] Review failed Actions runs.
- [ ] Review Dependabot alerts and PRs.
- [ ] Review CodeQL/security findings.
- [ ] Review open security-risk issues.
- [ ] Review cross-repo automation changes.
- [ ] Update rollout tracking issue.

## Best practice

The tower-control repo should move slower and safer than normal repos. It coordinates the fleet, so every automation must be documented, reviewable, reversible, and security-aware.
