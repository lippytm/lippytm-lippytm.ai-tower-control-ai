# Security

This repository must protect credentials, customer data, platform access, and public-facing claims.

## Core rule

Do not commit real secrets, API keys, passwords, tokens, OAuth credentials, private keys, seed phrases, payment credentials, customer private data, or sensitive records.

## Use secret managers

Store secrets only in approved platform secret managers:

- GitHub Actions secrets
- Deployment environment variables
- Replit secrets
- Vercel / Render / Fly.io environment variables
- Approved password manager or vault

## Safe placeholders

Use placeholder names only in code and docs:

```text
GITHUB_TOKEN
OPENAI_API_KEY
TWIN_API_KEY
MANYCHAT_API_KEY
STRIPE_SECRET_KEY
DATABASE_URL
WEBHOOK_SECRET
```

Never write the actual value.

## AI prompt security

Do not paste secrets into ChatGPT, Twin, Copilot Chat, public issues, documentation, or comments. Describe secrets by name only.

## Customer data

Minimize customer data. Do not store sensitive customer data in public repos. Use proper access control and collect only the minimum information required.

## High-risk areas

Human review required for:

- customer private data
- funding / finance / legal / tax / investment / trading claims
- billing / payment workflows
- API integrations using credentials
- deployments
- public-facing support or marketing claims
- robotics or physical-world actions

## If a secret is exposed

1. Stop using the exposed credential.
2. Rotate or revoke it immediately.
3. Remove it from the repo.
4. Check Git history and logs.
5. Replace with a placeholder.
6. Add a prevention issue.

## Related

- [Security policy](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/blob/main/security/SECRETS_POLICY.md)
- `CONTRIBUTING.md`
- `QUALITY.md`
