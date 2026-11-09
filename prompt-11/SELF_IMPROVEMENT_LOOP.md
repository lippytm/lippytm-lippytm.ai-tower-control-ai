# Prompt #11 Self-Improvement Loop

Prompt #11 must improve itself without becoming uncontrolled automation.

Self-improvement means the Control Tower regularly observes what happened, identifies friction, proposes better processes, documents changes, and routes implementation through GitHub issues and pull requests.

## Core Rule

```text
The system may propose improvements. The human owner approves meaningful changes. QA and RiskGate remain active.
```

## Self-Improvement Cycle

### 1. Observe

Collect evidence from:

- GitHub issues
- pull requests
- workflow failures
- Slack command requests
- Claude Code task results
- ChatGPT planning notes
- repo dashboard status
- blocked tasks
- revenue task outcomes
- documentation gaps

### 2. Diagnose

Ask what is slowing progress:

- Which repos are blocked?
- Which tasks lack acceptance criteria?
- Which workflows are failing?
- Which docs are missing?
- Which revenue tasks are not moving?
- Which tools are unclear or duplicated?
- Which ideas are not becoming GitHub issues?
- Which PRs are too large to review safely?

### 3. Propose

Create an improvement proposal as a GitHub issue.

A proposal should include:

- problem observed
- evidence
- suggested improvement
- target repo or system layer
- expected benefit
- risk level
- QA plan
- rollback plan
- owner
- next action

### 4. Prioritize

Score proposals by:

```yaml
priority_score:
  revenue_impact: 0-5
  risk_reduction: 0-5
  time_saved: 0-5
  reuse_value: 0-5
  clarity_gain: 0-5
  implementation_ease: 0-5
```

High-priority improvements should either:

- help revenue move faster,
- reduce risk,
- reduce repeated manual work,
- improve repo health,
- improve documentation clarity,
- improve QA confidence,
- or improve fleet coordination.

### 5. Route

Route the improvement:

- documentation improvement -> ChatGPT draft or human edit
- code/workflow improvement -> Claude Code or human developer PR
- Slack command improvement -> Slack app task
- dashboard improvement -> GitHub Actions/script task
- repo health improvement -> repo node kit task
- revenue system improvement -> offer/intake/delivery task

### 6. Validate

Every improvement needs validation:

- Did it solve the observed problem?
- Did it reduce friction?
- Did it preserve safety?
- Did it improve documentation?
- Did it avoid unrelated changes?
- Did QA pass?
- Did the owner approve?

### 7. Document

Update the relevant docs:

- `PROMPT_11.md`
- `fleet/PROMPT_11_STATUS.md`
- `fleet/repos.yml`
- `communications/TASK_OBJECT_MODEL.yml`
- repo-specific `PROJECT.md`
- repo-specific `QUALITY.md`
- repo-specific `RISK_GATE.md`

### 8. Repeat

The next cycle should start from real evidence, not speculation.

## Self-Improvement Task Template

```yaml
improvement:
  id: IMP-0001
  source: issue|pr|workflow|slack|chatgpt|claude|manual
  observed_problem: Describe the friction or failure.
  evidence:
    - Link or note 1
    - Link or note 2
  proposed_change: Describe the improvement.
  target_layer: intake|classification|routing|execution|qa|riskgate|dashboard|docs|revenue|fleet
  target_repo: lippytm/example-repo
  expected_benefit: Explain the improvement.
  priority_score:
    revenue_impact: 0
    risk_reduction: 0
    time_saved: 0
    reuse_value: 0
    clarity_gain: 0
    implementation_ease: 0
  risk_level: low|medium|high|blocked
  qa_plan:
    - Validation step
  rollback_plan: How to reverse or correct if wrong.
  owner: lippytm
  status: proposed|accepted|in_progress|qa|approved|merged|rejected|blocked
  next_action: The next concrete step.
```

## Weekly Self-Review Questions

Each week, the Control Tower should answer:

1. What moved forward?
2. What stayed blocked?
3. What produced or could produce revenue?
4. What repeated task should be automated?
5. What repo needs cleanup first?
6. What documentation is missing?
7. What is the highest-value next PR?
8. What risk needs to be reduced before scaling?
9. What should Claude Code implement next?
10. What should ChatGPT design or review next?

## Daily Micro-Loop

Use a smaller daily loop:

```text
Review -> Pick one useful task -> Create issue -> Implement or document -> QA -> Update dashboard -> Pick next task.
```

## Safety Boundary

Prompt #11 self-improvement must not:

- bypass human approval for high-risk work
- expose secrets
- change production settings without review
- delete data without explicit approval
- merge large unclear changes
- rewrite project direction without owner review
- confuse fiction, education, business, and experimental work

## Success Metrics

Track these metrics:

- number of active repos classified
- number of tasks converted from chat to GitHub issues
- number of PRs completed
- number of blocked tasks resolved
- number of repos with QA files
- number of repos with RiskGate files
- number of revenue tasks shipped
- number of workflow failures fixed
- number of docs improved
- number of repeated tasks automated

## Principle

Prompt #11 does not improve by becoming more complicated. It improves by making the next useful action clearer, safer, faster, and better documented.
