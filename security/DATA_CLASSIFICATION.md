# Tower Control Data Classification

## Purpose

Define data classification for cross-repository automation, fleet status, CRM/bot routing, security rollout, and autonomous systems planning.

## Public data

Examples:

- Public roadmap files.
- Public security checklists.
- Public fleet status summaries without private data.
- Public repository names.
- Public social/website copy.

Handling:

- Safe to publish after review.
- Review for accuracy and safe claims.

## Internal data

Examples:

- Draft rollout plans.
- Internal task lists.
- Non-sensitive workflow notes.
- Non-sensitive performance summaries.

Handling:

- Review before publishing.
- Keep private if it reveals sensitive strategy or operational details.

## Confidential data

Examples:

- CRM exports.
- Lead/customer details.
- Private business notes.
- Internal partner notes.
- Security review notes with sensitive context.

Handling:

- Do not commit to public GitHub.
- Store in controlled systems only.
- Limit access.
- Redact before using examples.

## Restricted / high-risk data

Examples:

- GitHub PATs.
- API keys.
- Deployment keys.
- Private keys.
- Passwords.
- `.env` files.
- Database credentials.
- Bot platform credentials.
- CRM credentials.
- Payment credentials.
- Private customer records.

Handling:

- Never commit to GitHub.
- Rotate immediately if exposed.
- Use secure secret storage.
- Do not include in prompts, logs, screenshots, or public issues.

## Fleet status data rules

Fleet status reports may include:

- Repo name.
- Security package status.
- Workflow status.
- Open security issue count.
- Next action.

Fleet status reports must not include:

- Secrets.
- Private lead data.
- Private customer data.
- Credential values.
- Raw database dumps.

## Autonomous automation data rules

Autonomous systems must not access or act on restricted data unless specifically designed, secured, reviewed, and approved.

High-risk automation must be gated through RiskGate and human review.

## Incident rule

If confidential or restricted data is exposed:

1. Remove exposure.
2. Rotate secrets if needed.
3. Pause affected automation.
4. Review affected repos.
5. Document the issue.
6. Add prevention controls.
