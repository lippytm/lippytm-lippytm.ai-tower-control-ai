# Prompt #11 Tool Roles

Prompt #11 works only when every tool has a clear job.

## GitHub

GitHub is the durable source of truth.

Use GitHub for:

- repositories
- issues
- pull requests
- code review
- commits
- documentation
- Actions workflows
- dashboards
- decision records
- QA evidence
- RiskGate records

Rule: If the work matters, put it in GitHub.

## Slack

Slack is the command and coordination layer.

Use Slack for:

- quick task intake
- `/bos` commands
- status requests
- build notifications
- blocker alerts
- human coordination

Rule: Slack can start work, but GitHub must remember work.

## ChatGPT

ChatGPT is the architecture, planning, documentation, and review layer.

Use ChatGPT for:

- system architecture
- repo strategy
- task decomposition
- issue writing
- acceptance criteria
- PR review support
- QA checklist creation
- RiskGate reasoning
- documentation generation
- revenue prioritization
- Slack command design

Rule: ChatGPT creates clarity and structure before implementation.

## Claude Code

Claude Code is the scoped implementation layer.

Use Claude Code for:

- small code changes
- bug fixes
- workflow updates
- tests
- refactors
- documentation updates tied to code
- PR creation

Rule: Claude Code should work through issues and pull requests, not invisible uncontrolled changes.

## GitHub Actions

GitHub Actions is the automation, QA, and reporting layer.

Use GitHub Actions for:

- CI checks
- docs checks
- fleet pulse reports
- quality gates
- release checks
- dashboard generation
- repo status collection

Rule: Automation should report clearly and fail safely.

## RiskGate

RiskGate is the review and approval layer.

Use RiskGate for:

- high-impact changes
- workflow changes
- deployment changes
- secret-handling changes
- business-critical changes
- irreversible changes

Rule: High-risk work needs human approval before merge or deployment.

## Future Tools

Future integrations can include:

- n8n for workflow routing
- Zapier for lightweight automations
- Replit or Zo Computer for runtime experiments
- ManyChat and BotBuilders for customer-facing flows
- Docker for portable services
- monitoring tools for uptime and health

Rule: Add tools only when they make the system more useful, safer, or easier to operate.
