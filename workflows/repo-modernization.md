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

Use the templates in `templates/repo/` for ready-to-copy versions of each file below.

- [ ] README.md — copy from `templates/repo/README-template.md`
- [ ] ROADMAP.md — copy from `templates/repo/ROADMAP-template.md`
- [ ] QUALITY.md — copy from `templates/repo/QUALITY-template.md`
- [ ] SECURITY.md — copy from `templates/repo/SECURITY-template.md`
- [ ] CONTRIBUTING.md — copy from `templates/repo/CONTRIBUTING-template.md`
- [ ] docs/architecture.md
- [ ] docs/runbook.md
- [ ] docs/business-model.md
- [ ] docs/integrations.md
- [ ] docs/support-playbook.md
- [ ] .github/copilot-instructions.md — copy from `templates/repo/copilot-instructions-template.md`
- [ ] .github/ISSUE_TEMPLATE/feature_request.md — copy from `templates/repo/issue-templates/feature_request-template.md`
- [ ] .github/ISSUE_TEMPLATE/bug_report.md — copy from `templates/repo/issue-templates/bug_report-template.md`
- [ ] .github/PULL_REQUEST_TEMPLATE.md — copy from `templates/repo/PULL_REQUEST_TEMPLATE-template.md`
- [ ] .github/dependabot.yml — copy from `templates/repo/dependabot-template.yml`
- [ ] .github/workflows/ci.yml — copy from `templates/repo/workflows/ci-template.yml`
- [ ] .github/workflows/codeql.yml — copy from `templates/repo/workflows/codeql-template.yml`
- [ ] .github/workflows/quality-gate.yml — copy from `templates/repo/workflows/quality-gate-template.yml`

After applying the base templates, apply the lane-specific checklist from `templates/lanes/`.

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
- [ ] CI, CodeQL, and quality gate workflows enabled
- [ ] Dependabot enabled
- [ ] Lane-specific checklist from `templates/lanes/` applied
- [ ] Registered in `fleet/repos.yml` and `fleet/FLEET_STATUS.md`
- [ ] Next 3 issues are created or drafted

## Reference templates

| Resource | Location |
|---|---|
| Repo standard templates | `templates/repo/` |
| Lane-specific checklists | `templates/lanes/` |
| Fleet best practices | `fleet/BEST_PRACTICES.md` |
| Definition of Done | `quality/definition-of-done.md` |
