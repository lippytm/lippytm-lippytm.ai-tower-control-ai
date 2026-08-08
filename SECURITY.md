# Security Policy

This repository must protect credentials, customer data, platform access, and public-facing claims.

## Supported Scope

Security review applies to:

- Express routes and middleware.
- Authentication and JWT handling.
- Connector integrations.
- Environment variables and secrets.
- GitHub Actions workflows.
- AgentBots, swarms, and automation features.
- Any user, customer, business, funding, or credential-related data.

## Core Rule

Do not commit real secrets, API keys, passwords, tokens, OAuth credentials, private keys, seed phrases, payment credentials, customer private data, or sensitive records.

## Use Secret Managers

Store secrets only in approved platform secret managers, such as:

- GitHub Actions secrets
- deployment environment variables
- Replit secrets
- Vercel/Render/Fly.io environment variables
- approved password manager or vault

## Safe Placeholders

Use placeholder names only:

```text
GITHUB_TOKEN
TWIN_API_KEY
MANYCHAT_API_KEY
BOTBUILDERS_API_KEY
OPENAI_API_KEY
STRIPE_SECRET_KEY
DATABASE_URL
WEBHOOK_SECRET
```

Never write the actual value.

## AI Prompt Security

Do not paste secrets into ChatGPT, Twin, Copilot Chat, public issues, documentation, or comments.

When asking AI for help, describe secrets by name only:

```text
Use MANYCHAT_API_KEY from the environment.
```

## Customer Data

Minimize customer data. Do not store sensitive customer data in public repos. Use proper access control and only collect the minimum information required.

## High-Risk Areas

Human review required for:

- customer private data
- funding/finance/legal/tax/investment/trading claims
- billing/payment workflows
- API integrations using credentials
- deployments
- public-facing support or marketing claims
- robotics or physical-world actions

## Risk Levels

### Low
Documentation, non-sensitive setup, internal notes, and general workflow clarity.

### Medium
External API configuration, customer-facing chatbot behavior, automation routing, and public documentation.

### High
Authentication, authorization, secrets, production deployment, customer data, payments, business funding, legal/tax/investment content, and outbound automations.

### Critical
Confirmed secret exposure, unauthorized access, private data leakage, payment credential exposure, unsafe physical-world actions, or automation that can cause real-world harm.

## Reporting a Vulnerability

Open a private security advisory if available, or create a minimal issue that does not disclose exploitable details. Include:

- Affected area.
- Expected behavior.
- Observed behavior.
- Risk level.
- Suggested mitigation.

Do not post secrets, tokens, private data, exploit chains, or customer information in public issues.

## If a Secret Is Exposed

1. Stop using the exposed credential.
2. Rotate or revoke it immediately.
3. Remove it from the repo.
4. Check Git history and logs.
5. Replace with a placeholder.
6. Add a prevention issue.

## Deployment Gate

Before production deployment:

- [ ] Run lint and tests.
- [ ] Review environment variables.
- [ ] Replace all default secrets.
- [ ] Restrict CORS.
- [ ] Review rate limits.
- [ ] Confirm no secrets are in git history.
- [ ] Confirm rollback plan.
- [ ] Document owner approval.

## Related Docs

- `security/SECRETS_POLICY.md`
- `quality/definition-of-done.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
