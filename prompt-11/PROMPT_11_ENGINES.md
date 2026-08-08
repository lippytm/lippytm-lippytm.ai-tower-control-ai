# Prompt #11 Engines

Prompt #11 Engines are the upgrade and update layer for applying Prompt #11 across AI systems, applications, agents, bots, swarms, workflows, and development engines.

Prompt #11 Engines are operational protocols. They do not claim consciousness, independent intent, or uncontrolled autonomy. They define how AI-assisted systems should plan, act, review, improve, maintain, and report through durable records.

## Core Engine Law

```text
AI proposes -> RiskGate evaluates -> human owner approves -> agents execute -> QA verifies -> documentation updates -> systems evolve.
```

## Purpose

Prompt #11 Engines attach the Prompt #11 operating doctrine to every AI system in the fleet.

They provide shared rules for:

- task intake
- planning
- code generation
- swarm coordination
- tool routing
- QA
- RiskGate
- self-improvement
- maintenance review
- operational awareness
- documentation
- revenue prioritization
- repo communication
- human approval

## Engine Set

```yaml
prompt_11_engines:
  version: 2.0
  control_tower: lippytm/lippytm-lippytm.ai-tower-control-ai
  engines:
    - intake_engine
    - classification_engine
    - planning_engine
    - code_generation_engine
    - swarm_coordination_engine
    - qa_engine
    - riskgate_engine
    - documentation_engine
    - improvement_engine
    - maintenance_engine
    - awareness_engine
    - revenue_priority_engine
    - repo_communication_engine
    - slack_command_engine
    - github_memory_engine
    - claude_code_engine
    - chatgpt_architecture_engine
```

## Engine Roles

### Intake Engine

Captures ideas, requests, errors, docs needs, revenue opportunities, app tasks, and swarm tasks.

Output: structured GitHub task.

### Classification Engine

Assigns lane, work type, risk level, revenue relevance, owner, status, and next action.

Output: task object with metadata.

### Planning Engine

Breaks requests into architecture, acceptance criteria, QA plan, and small implementation steps.

Output: GitHub issue plan or documentation.

### Code Generation Engine

Routes scoped implementation tasks to Claude Code, ChatGPT-generated code drafts, or human developers.

Output: branch, PR, patch, or implementation checklist.

### Swarm Coordination Engine

Coordinates multiple agents, bots, repos, or workflows while keeping each task traceable.

Output: routed work items and status updates.

### QA Engine

Checks quality, validation steps, docs, test status, and review readiness.

Output: QA result, checklist, or required changes.

### RiskGate Engine

Reviews scope, risk, approvals, rollback path, and operational impact.

Output: approved, changes requested, blocked, or needs owner decision.

### Documentation Engine

Turns actions into durable docs, runbooks, dashboards, templates, and lessons learned.

Output: committed documentation or issue notes.

### Improvement Engine

Finds repeated friction and proposes better methods.

Output: improvement proposal issue or PR.

### Maintenance Engine

Identifies items needing review, cleanup, or repair.

Output: maintenance review issue or small PR.

### Awareness Engine

Reports known facts, assumptions, missing information, risks, blockers, confidence, and next action.

Output: awareness report.

### Revenue Priority Engine

Ranks work by near-term revenue relevance, reusability, time to launch, risk, and documentation value.

Output: priority score and next revenue action.

### Repo Communication Engine

Keeps repo nodes connected to the Control Tower.

Output: fleet status, node status, issue routing, and PR links.

### Slack Command Engine

Receives human commands and routes them to GitHub records.

Output: GitHub issue, status response, or workflow request.

### GitHub Memory Engine

Stores durable truth in issues, PRs, docs, commits, workflows, and dashboards.

Output: auditable system memory.

### Claude Code Engine

Implements scoped changes through GitHub issues and PRs.

Output: implementation PR or code plan.

### ChatGPT Architecture Engine

Creates architecture, task breakdowns, review plans, business mapping, docs, and Prompt #11 system design.

Output: structured plan, checklist, issue body, or documentation.

## Engine Attachment Rule

Every AI system, application, agent, bot, swarm, or automation attached to the lippytm.AI ecosystem should declare its Prompt #11 engine profile.

```yaml
prompt_11_engine_profile:
  attached: true
  system_name: example-agent
  system_type: app|agent|bot|swarm|workflow|repo|assistant|runtime
  owner: lippytm
  control_tower: lippytm/lippytm-lippytm.ai-tower-control-ai
  active_engines:
    - intake_engine
    - planning_engine
    - qa_engine
    - riskgate_engine
    - awareness_engine
  risk_level: low|medium|high|blocked
  human_approval_required_for:
    - high_risk_changes
    - deployment_changes
    - permissions_changes
    - secrets_handling
    - billing_or_payment_changes
    - customer_data_changes
  next_action: Define the next useful action.
```

## Swarm Attachment Rule

Every swarm should identify:

- swarm purpose
- swarm lane
- participating agents
- allowed work
- restricted work
- quality checks
- RiskGate triggers
- owner approval triggers
- repo or dashboard where state is stored

## Engine Message Object

```yaml
engine_message:
  id: ENG-0001
  source_engine: intake_engine
  target_engine: planning_engine
  target_repo: lippytm/example-repo
  task_id: BOS-0001
  message_type: request|status|decision|review|handoff|alert|summary
  priority: low|medium|high|urgent
  risk_level: low|medium|high|blocked
  content_summary: Short message summary
  required_response: plan|pr|review|approval|status|none
  evidence:
    - Link or note
  next_action: Define next step
```

## Upgrade Path

Prompt #11 Engines should be rolled out in stages:

1. Add engine doctrine to the Control Tower.
2. Add engine profile template.
3. Add swarm attachment template.
4. Add engine message object.
5. Add repo node kit compatibility.
6. Add Slack command compatibility.
7. Add Claude Code issue compatibility.
8. Add GitHub dashboard compatibility.
9. Roll out to priority repos.
10. Review and improve from evidence.

## Safety Boundary

Prompt #11 Engines must not:

- bypass human approval for high-risk work
- expose secrets
- change production settings without review
- confuse business, education, creative, or experimental lanes
- claim consciousness or independent intent
- make irreversible changes without owner approval
- hide uncertainty or missing information

## Principle

Prompt #11 Engines make AI systems more coordinated, reviewable, useful, and durable. They upgrade swarms by giving every agent, bot, workflow, and app a shared operating law, shared task language, shared QA expectations, and shared human approval structure.
