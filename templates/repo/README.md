# Repo Standard Templates

These templates provide the minimum viable repo standard for every lippytm.ai fleet repository.

## How to use

1. Copy the relevant files into your target fleet repo.
2. Replace all `[placeholder]` values with repo-specific content.
3. Enable the workflows in your target repo's `.github/workflows/` folder.
4. Register the repo in `fleet/repos.yml` and `fleet/FLEET_STATUS.md`.
5. Apply lane-specific checklist from `templates/lanes/`.

## Files in this folder

| File | Copy to | Description |
|---|---|---|
| `README-template.md` | `README.md` | Repo mission, audience, quick start |
| `ROADMAP-template.md` | `ROADMAP.md` | Phased plan with status markers |
| `QUALITY-template.md` | `QUALITY.md` | Quality checklist and review levels |
| `SECURITY-template.md` | `SECURITY.md` | Security rules and incident steps |
| `CONTRIBUTING-template.md` | `CONTRIBUTING.md` | Contribution workflow |
| `copilot-instructions-template.md` | `.github/copilot-instructions.md` | Copilot behavior guidance |
| `PULL_REQUEST_TEMPLATE-template.md` | `.github/PULL_REQUEST_TEMPLATE.md` | PR quality checklist |
| `issue-templates/feature_request-template.md` | `.github/ISSUE_TEMPLATE/feature_request.md` | Feature request form |
| `issue-templates/bug_report-template.md` | `.github/ISSUE_TEMPLATE/bug_report.md` | Bug report form |
| `dependabot-template.yml` | `.github/dependabot.yml` | Dependabot config |
| `workflows/ci-template.yml` | `.github/workflows/ci.yml` | CI workflow |
| `workflows/codeql-template.yml` | `.github/workflows/codeql.yml` | CodeQL security scan |
| `workflows/quality-gate-template.yml` | `.github/workflows/quality-gate.yml` | Quality gate |

## Lane-specific checklists

After applying these base templates, apply your lane checklist from `templates/lanes/`:

| Lane | Checklist |
|---|---|
| Website | `templates/lanes/website.md` |
| Revenue | `templates/lanes/revenue.md` |
| Bots | `templates/lanes/bots.md` |
| Integration | `templates/lanes/integration.md` |
| R&D | `templates/lanes/rd.md` |
| Agents / AI | `templates/lanes/agents.md` |
| Education | `templates/lanes/education.md` |
| Security | `templates/lanes/security-lane.md` |
| Trading | `templates/lanes/trading.md` |
| Creative | `templates/lanes/creative.md` |
| Strategy | `templates/lanes/strategy.md` |
| Docs | `templates/lanes/docs.md` |
| Support | `templates/lanes/support.md` |
| Productivity | `templates/lanes/productivity.md` |
| AI Identity | `templates/lanes/ai-identity.md` |

## Reference

- Full best practices: `fleet/BEST_PRACTICES.md`
- Repo modernization workflow: `workflows/repo-modernization.md`
- Definition of Done: `quality/definition-of-done.md`
