# Workspace GitHub Interface

The Workspace GitHub Interface is the coordination layer that lets the Control Tower communicate with all repositories in the lippytm.AI fleet.

## Purpose

This interface makes GitHub the durable command center for Prompt #11 Engines, repo nodes, AI swarms, products, services, platforms, and development workflows.

## Core Idea

```text
Control Tower -> Workspace Interface -> Repo Registry -> Repo Nodes -> Issues/PRs -> QA -> RiskGate -> Dashboard.
```

## What the Interface Does

The Workspace GitHub Interface should help:

- register all repositories
- classify each repo by lane and priority
- apply Prompt #11 node kit files
- route tasks to the correct repo
- create standard issues and PRs
- track QA and RiskGate status
- track Claude Code readiness
- track Slack command readiness
- track dashboard status
- report blockers and next actions

## Workspace Components

```text
workspace-github/WORKSPACE_GITHUB_INTERFACE.md
workspace-github/REPO_NODE_CONTRACT.md
workspace-github/WORKSPACE_SYNC_PLAN.md
workspace-github/ROLL_OUT_PROMPT_11_TO_REPOS.md
workspace-github/REPO_COMMUNICATION_MAP.yml
workspace-github/WORKSPACE_DASHBOARD_SPEC.md
```

## Repo Node Contract

Every repo should eventually have:

```text
PROJECT.md
QUALITY.md
RISK_GATE.md
AGENT_MODE.md
PROMPT_11_NODE.md
.github/ISSUE_TEMPLATE/claude-code-task.yml
.github/ISSUE_TEMPLATE/prompt-11-maintenance-review.yml
.github/workflows/node-quality-gate.yml
.github/workflows/fleet-pulse.yml
```

## Workspace Roles

### Control Tower

Stores the source of truth:

- fleet registry
- Prompt #11 doctrine
- node kit
- rollout plans
- dashboards
- templates

### Repo Node

Each repo stores its own purpose, quality rules, risks, next action, and local task history.

### GitHub Issues

Issues are the task memory.

### Pull Requests

PRs are the reviewable change path.

### GitHub Actions

Actions are the check and reporting layer.

### Dashboards

Dashboards show status, health, blockers, and next actions.

## Workspace Rule

Do not push broad changes to all repos at once. Roll out the interface repo-by-repo through small pull requests.

## First Rollout Order

1. Control Tower
2. Web3AI
3. AllBots.com
4. Chatlippytm.ai.Bots
5. Clawlippytm.Bots
6. MyClaw.lippytm.AI-
7. Base44-
8. AI DevOps repo
9. Publishing repo
10. Education repo

## Principle

The Workspace GitHub Interface makes the repo fleet act like one coordinated workspace while preserving review, ownership, and repo-level clarity.
