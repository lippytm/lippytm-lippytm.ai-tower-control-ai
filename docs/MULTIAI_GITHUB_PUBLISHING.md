# Multi-AI GitHub Publishing

This toolkit gives every lippytm repository a repeatable, approval-gated publishing path.

## Providers

- OpenAI/ChatGPT: orchestration and final synthesis
- Gemini: independent review and Google-oriented work
- Claude: long-form and structured review
- GitHub Actions: validation, evidence retention, draft pull-request creation

Providers are optional. Missing keys produce review errors for that provider without exposing secrets.

## Setup

Add encrypted repository or environment secrets: `OPENAI_API_KEY`, `GEMINI_API_KEY`, and `ANTHROPIC_API_KEY`. GitHub supplies `GITHUB_TOKEN` automatically. Protect the `controlled-publishing` environment with required reviewers.

## Use

1. Create a publishing manifest based on `publishing/manifest.example.json`.
2. Put generated outputs in the repository workspace.
3. Run **Controlled AI Publishing** from GitHub Actions.
4. Inspect CI and the uploaded AI-review evidence.
5. Review the draft pull request.
6. A person approves and merges it.

## Safety boundaries

- Draft pull requests are the default.
- Branch names must begin with `agent/`.
- Parent-path traversal is rejected.
- CI runs before publication.
- AI reviews are advisory; human approval remains mandatory.
- Never publish private BLB lead/customer data, SSNs, bank records, credit information, credentials, tokens, or API keys.
- Financial, legal, customer-contact, payment, deployment, and account changes require explicit human authorization.

## Multi-repository rollout

Copy the workflow, scripts, example manifest, and provider modules to each repository, or call a reusable workflow from this Control Tower. Begin with a small pilot group before organization-wide rollout.
