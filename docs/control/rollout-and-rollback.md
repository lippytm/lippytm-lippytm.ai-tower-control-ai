# Rollout and Rollback

This document defines how the Control Tower should coordinate change across the lippytm fleet.

The goal is simple:

- move fast enough to keep innovation alive
- move carefully enough to protect trust, revenue, and operational stability

---

## Rollout Philosophy

A rollout is not just a deployment.

A rollout is a governed introduction of change across one or more repos, workflows, agents, or product surfaces.

Every rollout should answer:

- what is changing?
- why is it changing?
- who or what is affected?
- what could break?
- how will we know it worked?
- how do we back out safely?

---

## Rollout Types

### 1. Documentation Rollout
Low-risk standards, docs, or prompt structure changes.

### 2. Internal Workflow Rollout
Changes to automations, scripts, or non-public execution flows.

### 3. Product Rollout
Changes to public pages, bots, interfaces, or user-facing behavior.

### 4. Control Rollout
Changes to orchestration, registry, policy, connector, or fleet logic.

### 5. Commerce Rollout
Changes affecting pricing, access, payments, subscriptions, or billing logic.

---

## Rollout Stages

### Stage 0 — Proposal
Define:
- objective
- affected repos
- expected value
- risk class
- success criteria

### Stage 1 — Dry Run
Validate assumptions using:
- preview runs
- simulations
- non-destructive checks
- schema validation
- documentation review

### Stage 2 — Controlled Execution
Execute on a limited target set.

Examples:
- one repo before many repos
- one bot class before the whole product family
- one offer page before full funnel changes

### Stage 3 — Observe
Collect:
- errors
- telemetry
- output quality
- conversion or workflow signals
- operator feedback

### Stage 4 — Expand or Halt
If successful, expand. If not, stop and evaluate.

### Stage 5 — Closeout
Record:
- final state
- lessons learned
- follow-up tasks
- rollback needs if partially reverted

---

## Rollout Metadata Template

```yaml
rollout_id: rollout-2026-001
name: fleet standards bootstrap
change_type: documentation_rollout
affected_repos:
  - lippytm/lippytm.ai
  - lippytm/lippytm-lippytm.ai-tower-control-ai
risk_class: S1
approval_required: false
success_criteria:
  - files created successfully
  - docs readable and aligned with BrainKit
  - no protected runtime paths changed
rollback_plan: remove created files or replace with corrected versions
```

---

## Rollout Guardrails

### Always Required
- repo targets identified
- paths identified
- change purpose documented
- success criteria documented
- rollback path documented

### Required for Control or Commerce Rollouts
- explicit approval
- protected path review
- blast radius assessment
- telemetry confirmation plan

### Required for Multi-Repo Rollouts
- execution order
- dependency awareness
- pause conditions
- partial success handling

---

## Rollback Philosophy

Rollback is not failure.

Rollback is a designed safety mechanism.

A rollback should be simple, fast, and well-documented enough that an operator or future agent can execute it without confusion.

---

## Rollback Triggers

Rollback should be considered if any of the following happens:

- protected functionality breaks
- deployment fails repeatedly
- routing becomes inconsistent
- output quality drops sharply
- monetization paths break
- approval logic is bypassed or uncertain
- user trust or public messaging risk increases

---

## Rollback Strategies

### 1. File Revert
Restore the last known good file state.

### 2. Feature Disable
Turn off a workflow, route, connector, or module without deleting it.

### 3. Traffic Redirect
Route tasks or requests back to stable paths.

### 4. Scope Reduction
Keep only the safe part of a rollout and disable the rest.

### 5. Full Rollback
Return all affected systems to the last validated state.

---

## Rollback Readiness Checklist

Before any significant rollout, confirm:

- previous known good state is identifiable
- changed files are traceable
- protected paths are documented
- dependent systems are known
- operator contact or decision path exists
- telemetry or logs can confirm restoration

---

## Partial Rollout Handling

Not every rollout will succeed uniformly.

If some repos succeed and others fail:

- mark rollout state as `partial`
- list successful and failed targets separately
- decide whether to expand, freeze, or revert
- create follow-up tasks for unresolved targets

---

## Recommended Rollout Order for Fleet Changes

1. standards repo
2. control tower repo
3. swarm repo
4. product or revenue surfaces
5. commerce systems
6. lab or knowledge repos if needed

This order preserves authority and operational coordination before public or monetized exposure.

---

## Success Signals

A rollout is healthy when:

- target changes are present and correct
- no unexpected paths were touched
- telemetry confirms expected behavior
- no critical incidents were introduced
- follow-up work is clear and manageable

---

## Rule of thumb

Roll out changes in the same way you would scale a business system: with intention, traceability, reversibility, and enough structure that growth does not become confusion.
