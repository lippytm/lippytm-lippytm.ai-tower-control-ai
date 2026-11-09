# Prompt #11 Task Lifecycle

This lifecycle keeps development work auditable, reviewable, and useful across the full repo fleet.

## Lifecycle

1. **Intake**
   - Capture the idea, bug, feature, document request, revenue opportunity, or system improvement.
   - Preferred sources: Slack `/bos`, ChatGPT planning, GitHub issue, Claude Code session, or manual note.

2. **Classification**
   - Assign lane, work type, risk level, revenue relevance, owner, and status.
   - Use `communications/TASK_OBJECT_MODEL.yml` as the standard shape.

3. **Planning**
   - Use ChatGPT for architecture, issue design, acceptance criteria, QA checklist, and RiskGate framing.
   - Keep the result in GitHub as an issue body, comment, or doc update.

4. **Routing**
   - Route documentation, planning, and review to ChatGPT.
   - Route scoped code changes to Claude Code.
   - Route durable tracking to GitHub.
   - Route notifications and commands through Slack.

5. **Implementation**
   - Claude Code or a human developer works through a branch and pull request.
   - Keep scope small enough to review.
   - Avoid unrelated repo changes.

6. **QA**
   - Run available tests, linting, docs checks, and validation scripts.
   - If no tests exist, include a manual validation checklist in the PR.

7. **RiskGate**
   - Review risk level, secrets impact, deployment impact, business impact, and reversibility.
   - High-risk changes require explicit human approval before merge.

8. **Approval**
   - Human owner approves, requests changes, or blocks the task.

9. **Merge and Document**
   - Merge approved work.
   - Update docs, fleet dashboard, and next-action list.

10. **Evolution Loop**
   - Capture what changed.
   - Identify the next improvement.
   - Feed data back into the system.

## Status Values

```text
intake
planned
in_progress
pr_open
qa
riskgate
approved
merged
blocked
archived
```

## Principle

Small, documented, reviewable steps are better than large invisible jumps.
