# Secrets Policy

This repository must never contain real secrets, private credentials, or sensitive customer data.

## Do not commit

Never commit:

- API keys
- access tokens
- passwords
- OAuth client secrets
- private keys
- seed phrases
- payment credentials
- customer private data
- medical, legal, financial, or identity records
- database URLs with credentials
- webhook signing secrets

## Use placeholders only

Use placeholder names like:

```text
GITHUB_TOKEN
TWIN_API_KEY
MANYCHAT_API_KEY
BOTBUILDERS_API_KEY
STRIPE_SECRET_KEY
DATABASE_URL
WEBHOOK_SECRET
OPENAI_API_KEY
```

Never include the real value.

## Where secrets belong

Use platform secret managers, such as:

- GitHub Actions secrets
- deployment platform environment variables
- Replit secrets
- Vercel/Render/Fly.io environment variables
- approved password manager or secure vault

## Prompt safety

Do not paste secrets into ChatGPT, Twin, Copilot Chat, public issues, README files, comments, or documentation.

When asking an AI tool for help, describe secrets by name only.

Example:

```text
Use MANYCHAT_API_KEY from the environment.
```

Do not write the actual key.

## Customer data

Customer data should be minimized.

Do not store sensitive customer data in public repos. Use private systems, proper access control, and only the minimum data needed for the workflow.

## If a secret is exposed

1. Remove the secret from the file.
2. Rotate or revoke the exposed credential immediately.
3. Check Git history and platform logs.
4. Replace with a safe placeholder.
5. Add a follow-up issue for prevention.

## Automation rules

AI agents, scripts, GitHub Copilot, Twin agents, and workflow automations must not create or expose real secrets.

Any workflow requiring credentials must document:

- secret name
- platform where it should be stored
- purpose
- required permissions
- rotation note

Do not document secret values.
