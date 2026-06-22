# Prompt #11 Repo Node

This repository is a node in the lippytm.AI Prompt #11 Control Tower fleet.

## Node Identity

```yaml
node:
  repo: lippytm/example-repo
  lane: control-tower|bots|web3|publishing|creative|infrastructure|qa|revenue|life-systems|education
  owner: lippytm
  status: active|planned|blocked|archived
  priority: low|medium|high|critical
  risk_level: low|medium|high|blocked
  revenue_relevance: none|indirect|direct|urgent
  control_tower: lippytm/lippytm-lippytm.ai-tower-control-ai
```

## Node Responsibilities

Each Prompt #11 repo node should:

- define its purpose
- maintain a clear README or project profile
- classify work through GitHub issues
- keep PRs small and reviewable
- document QA steps
- use RiskGate for meaningful changes
- report status to the Control Tower
- preserve separation between business, education, creative, and experimental lanes

## Node Status Report

```yaml
node_status:
  repo: lippytm/example-repo
  health: unknown|poor|fair|good
  qa_status: missing|partial|required|passing
  riskgate_status: missing|partial|required|approved
  docs_status: missing|partial|good
  claude_code_status: missing|planned|enabled
  slack_status: missing|planned|enabled
  next_action: null
  blockers:
    - null
```

## Connection to Control Tower

The Control Tower should track this repo through:

- `fleet/repos.yml`
- `fleet/FLEET_STATUS.md`
- GitHub issues
- GitHub PRs
- QA workflow results
- maintenance review records
- Prompt #11 dashboards

## Principle

A repo node should be understandable, reviewable, maintainable, and connected to the larger system.
