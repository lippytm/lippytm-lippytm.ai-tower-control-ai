# Business Email + AI Clone Engine Identity Setup

## Purpose

This document creates a practical identity layer for the lippytm.AI / Business of Businesses portfolio so the personal email and business email can both be used without losing access, confusing systems, or breaking existing repositories.

## Email roles

| Role | Email | Use |
|---|---|---|
| Personal / original access | lippytimemachines@gmail.com | Original ChatGPT/GitHub identity, recovery, personal use, legacy access |
| Business development identity | lippytmai.biz@gmail.com | Business development, GitHub business workflows, lippytmai.getbizfunds.com, AI Clone Engine, AgentBots, AI Swarms, portfolio operations |

## Operating rule

Do not delete or abandon the original personal email. Keep **lippytimemachines@gmail.com** as the legacy owner/recovery identity and add **lippytmai.biz@gmail.com** as the business development identity wherever each platform allows additional members, collaborators, admins, billing contacts, notifications, or organization identities.

## Practical workaround strategy

When a platform does not allow a simple email swap, use a two-identity bridge:

1. Keep the old account/email active.
2. Add the business email as a member, admin, collaborator, billing contact, notification address, or backup identity.
3. Document the relationship in GitHub so AI assistants and future setup scripts know both emails belong to the same business operator.
4. Use business email for new business-facing registrations, forms, repository references, customer-facing pages, and automation prompts.
5. Use personal/original email only when required for login, recovery, or ownership continuity.

## AI Clone Engine identity profile

```yaml
identity_layer:
  portfolio_owner: "Charles Lipshay"
  github_login: "lippytm"
  workspace_name: "lippytm.AI"
  personal_email:
    address: "lippytimemachines@gmail.com"
    role: "personal_original_access_recovery_legacy_owner"
  business_email:
    address: "lippytmai.biz@gmail.com"
    role: "business_development_ai_clone_engine_agentbots_ai_swarms"
  business_assets:
    primary_site: "lippytmai.getbizfunds.com"
    cloud_workspace: "lippytmai.zo.computer"
    github_owner: "lippytm"
  rule: "Keep personal email for continuity; use business email for business development and new external-facing operations."
```

## Repository propagation plan

Add a lightweight version of this identity layer to key repositories first:

1. lippytm/lippytm-lippytm.ai-tower-control-ai
2. lippytm/AI-Autonomous-Systems-for-all-of-my-lippytm.ai-Repositories-Research-and-Development-integration-
3. lippytm/lippytm.ai
4. lippytm/OpenClaw-lippytm.AI-
5. lippytm/Clawlippytm.ai.Bots
6. lippytm/Chatlippytm.ai.Bots
7. lippytm/AI-Full-Stack-AI-DevOps-Synthetic-Intelligence-Engines-AgentsBots-Web3-Websites-
8. lippytm/The-Encyclopedia-of-Everything-Applied-ChatAIBots
9. lippytm/Web3AI
10. lippytm/Factory.ai

## ChatGPT Business setup instruction for human navigation

When inside ChatGPT Business workspace settings, the intended action is:

- Keep **lippytimemachines@gmail.com** active.
- Invite **lippytmai.biz@gmail.com** as a business workspace member/admin if the workspace allows it.
- Accept the invite from the business Gmail inbox.
- Use the business email for business development conversations, GitHub, funding workflows, and public-facing business assets.

## AI assistant instruction snippet

Use this instruction in future ChatGPT, Codex, GitHub, or AI-agent sessions:

```text
Business Identity Instruction:
The operator has two valid emails. lippytimemachines@gmail.com is the original personal/recovery/login identity. lippytmai.biz@gmail.com is the business development identity for lippytm.AI, AI Clone Engine, GitHub workflows, lippytmai.getbizfunds.com, AgentBots, AI Swarms, and business portfolio operations. Do not replace the personal email unless the user explicitly requests it. Prefer adding the business email as a collaborator, admin, member, billing contact, notification recipient, or business-facing identity where possible.
```

## Next automation targets

- Create a shared identity snippet file for repo copying.
- Add this identity layer to each active repo over time.
- Build a simple AI Clone Engine registry that maps projects, repositories, emails, assets, agents, and business workflows.
- Create future setup scripts only for safe documentation/configuration tasks, not password handling or secret storage.

## Security rule

Never commit passwords, API keys, authentication tokens, recovery codes, billing card data, private identity documents, or secret keys into GitHub. Email addresses are acceptable for identity routing, but secrets must stay out of repositories.
