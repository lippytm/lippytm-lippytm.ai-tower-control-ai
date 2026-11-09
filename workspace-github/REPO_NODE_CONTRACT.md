# Repo Node Contract

The Repo Node Contract defines how each repository connects to the Workspace GitHub Interface and Prompt #11 Engines.

## Minimum Repo Node Files

Each connected repo should eventually include:

```text
PROJECT.md
QUALITY.md
RISK_GATE.md
AGENT_MODE.md
PROMPT_11_NODE.md
```

## Recommended GitHub Files

```text
.github/ISSUE_TEMPLATE/claude-code-task.yml
.github/ISSUE_TEMPLATE/prompt-11-maintenance-review.yml
.github/workflows/node-quality-gate.yml
.github/workflows/fleet-pulse.yml
```

## Required Repo Metadata

```yaml
repo_node:
  repo: lippytm/example-repo
  owner: lippytm
  lane: control-tower|bots|web3|publishing|creative|infrastructure|qa|revenue|life-systems|education
  status: active|planned|blocked|archived
  priority: low|medium|high|critical
  risk_level: low|medium|high|blocked
  revenue_relevance: none|indirect|direct|urgent
  control_tower: lippytm/lippytm-lippytm.ai-tower-control-ai
  prompt_11_engines_attached: true|false
  next_action: null
```

## Communication Responsibilities

Each repo node should:

- maintain a clear purpose
- store work as GitHub issues
- use pull requests for meaningful changes
- include validation steps
- identify risk level
- report blockers
- update next action
- preserve documentation
- connect back to the Control Tower

## Control Tower Responsibilities

The Control Tower should:

- keep the fleet registry
- store shared templates
- track rollout progress
- generate dashboards
- coordinate Prompt #11 Engines
- list repo blockers
- list next actions

## Repo Status Report

```yaml
repo_status_report:
  repo: lippytm/example-repo
  date: YYYY-MM-DD
  health: unknown|poor|fair|good
  docs_status: missing|partial|good
  qa_status: missing|partial|required|passing
  riskgate_status: missing|partial|required|approved
  open_tasks: 0
  open_prs: 0
  blockers: []
  next_action: null
```

## Principle

A repo is connected to the workspace when it can explain its purpose, show its status, receive tasks, produce PRs, and report its next action.
