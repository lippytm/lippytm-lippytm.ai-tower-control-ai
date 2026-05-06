# Tower Control Security Policy

## Mission

Quality and Quality Assurance is Job #1. Security is a foundation of quality, transparency, documentation, database management, automation, autonomous systems, and trust.

## Scope

This repository is the tower-control layer for coordinating lippytm.ai repositories, GitHub workflows, bots, websites, CRM paths, Canva assets, business systems, and future autonomous automation.

Security review applies to:

- Cross-repository automation.
- GitHub Actions and workflow orchestration.
- Security rollout plans.
- Fleet status reports.
- CRM, website, and bot routing plans.
- Autonomous agent workflows.
- Any future scripts that modify repositories, files, issues, PRs, deployments, or external platforms.

## High-risk items

Treat these as high risk:

- API keys, tokens, passwords, private keys, `.env` files.
- GitHub PATs or automation credentials.
- Deployment credentials.
- CRM exports or private lead/customer data.
- Database credentials or dumps.
- Autonomous workflows that create, update, publish, deploy, message, or modify external systems.
- Security workflow changes.

## Tower-control security rules

- AI proposes, RiskGate decides, approved executors act.
- High-risk automation requires explicit human review.
- Workflow permissions must use least privilege.
- Secrets must never be committed.
- Fleet rollout changes should be documented.
- Security failures should be categorized, fixed, and logged.
- Cross-repo actions should prefer pull requests or reviewable commits.
- Quality and security documentation must stay current.

## Reporting a security issue

Do not post secrets, private lead/customer data, or exploit details in public issues. Use a private report path where available, or create a general security-risk issue without exposing sensitive details.

## Incident response

If sensitive information or automation credentials are exposed:

1. Remove exposure.
2. Rotate affected secrets immediately.
3. Pause risky automation.
4. Review affected repositories.
5. Patch the root cause.
6. Document prevention steps.
7. Improve fleet automation guardrails.
