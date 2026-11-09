# Roll Out Prompt #11 to Repositories

This rollout plan applies Prompt #11 Engines and the Workspace GitHub Interface to the repo fleet through small, reviewable PRs.

## Rollout Rule

```text
One repo -> one node-kit PR -> review -> dashboard update -> next repo.
```

Do not apply broad changes to all repos in one invisible step.

## Rollout Stages

### Stage 1: Prepare Control Tower

- Maintain `fleet/repos.yml`.
- Maintain `node-kit/` templates.
- Maintain `workspace-github/` docs.
- Maintain Prompt #11 Engine docs.
- Keep PR #65 reviewable.

### Stage 2: Choose Target Repo

Select based on:

- priority
- revenue relevance
- readiness
- risk level
- usefulness to other repos
- current clarity

### Stage 3: Create Repo Node Issue

Create an issue in the target repo:

```text
Apply Prompt #11 Repo Node Kit
```

Issue should include:

- target repo
- purpose
- files to add
- risk level
- validation plan
- next action

### Stage 4: Open Node Kit PR

Add or adapt:

```text
PROJECT.md
QUALITY.md
RISK_GATE.md
AGENT_MODE.md
PROMPT_11_NODE.md
.github/workflows/node-quality-gate.yml
.github/workflows/fleet-pulse.yml
```

### Stage 5: Review

Check:

- repo purpose is clear
- files are adapted to repo
- no unrelated changes
- no secrets
- QA checklist exists
- next action is documented

### Stage 6: Update Control Tower

Update:

- `fleet/repos.yml`
- fleet status dashboard
- rollout notes
- blockers
- next repo target

## First Target Repos

1. `lippytm/Web3AI`
2. `lippytm/AllBots.com`
3. `lippytm/Chatlippytm.ai.Bots`
4. `lippytm/Clawlippytm.Bots`
5. `lippytm/MyClaw.lippytm.AI-`
6. `lippytm/Base44-`
7. `lippytm/AI-Full-Stack-AI-DevOps-Synthetic-Intelligence-Engines-AgentsBots-Web3-Websites-`
8. `lippytm/balletcrypto.github.io`
9. `lippytm/gatsby-starter-blog`
10. `lippytm/The-Encyclopedia-of-Law-Civilian-Law-Military-Law-Business-Law-AI-Law.-`

## Success Criteria

A repo is upgraded when:

- node kit files exist
- repo purpose is clear
- Prompt #11 node identity exists
- quality checklist exists
- RiskGate checklist exists
- next action is visible
- Control Tower registry is updated

## Principle

Scale the workspace by making each repo understandable, reviewable, and connected.
