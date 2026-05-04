# Repo Modernization Workflow

Purpose: upgrade every lippytm.ai repository into an AI-ready, Copilot-ready, prompt-ready, support-ready, and productization-ready asset.

Quality is Job #1. Use small, reviewable changes. Do not commit secrets.

## Trigger

Run this workflow when:

- a repo has no clear README
- a repo needs Copilot instructions
- a repo needs quality/security docs
- a repo needs productization direction
- a repo is being added to the fleet
- a repo needs cleanup, focus, or support docs

## Inputs

- repository name
- current README or repo summary
- repo purpose if known
- target audience
- connected platforms
- monetization or long-term asset path

## Outputs

- repo mission
- audience/customer type
- README improvement plan
- docs to add
- issue list
- Copilot instruction plan
- security checklist
- quality checklist
- support path
- monetization/productization note

## Standard files to add or improve

- [ ] README.md
- [ ] ROADMAP.md
- [ ] QUALITY.md
- [ ] SECURITY.md
- [ ] CONTRIBUTING.md
- [ ] docs/architecture.md
- [ ] docs/runbook.md
- [ ] docs/business-model.md
- [ ] docs/integrations.md
- [ ] docs/support-playbook.md
- [ ] .github/copilot-instructions.md
- [ ] .github/ISSUE_TEMPLATE/feature_request.md
- [ ] .github/ISSUE_TEMPLATE/bug_report.md
- [ ] .github/PULL_REQUEST_TEMPLATE.md

## Prompt

```text
Upgrade this repository into an AI-ready lippytm.ai fleet repository.

Create or improve:
- README.md
- ROADMAP.md
- QUALITY.md
- SECURITY.md
- CONTRIBUTING.md
- docs/architecture.md
- docs/runbook.md
- docs/business-model.md
- docs/integrations.md
- docs/support-playbook.md
- .github/copilot-instructions.md
- .github/ISSUE_TEMPLATE/feature_request.md
- .github/ISSUE_TEMPLATE/bug_report.md
- .github/PULL_REQUEST_TEMPLATE.md

Also create:
- repo mission
- audience
- creative direction
- automation opportunities
- AI coding opportunities
- monetization opportunities
- affiliate opportunities
- support process
- quality checklist
- security checklist
- next 3 issues to open

Keep the result practical, modular, and reviewable. Quality is Job #1.
```

## Best practices

- Start with docs before code.
- Make the repo understandable to a new human or AI agent.
- Use consistent file names across the fleet.
- Add Copilot instructions before asking for large code changes.
- Add support and business-model docs so the repo can become useful commercially.
- Keep experimental ideas separate from customer-facing claims.

## Definition of done

- [ ] Repo mission is clear
- [ ] README has purpose and next steps
- [ ] Copilot instructions exist or are planned
- [ ] Quality and security expectations are clear
- [ ] Support path is clear
- [ ] Productization path is identified
- [ ] Next 3 issues are created or drafted
