# Runbook

This runbook explains how to operate the lippytm.ai Control Tower.

Quality is Job #1.

## Daily operating loop

1. Review `dashboards/MONEY_PATH_STATUS.md`.
2. Review `dashboards/AGENT_STATUS.md`.
3. Review `dashboards/PLATFORM_STATUS.md`.
4. Pick one daily money action from `workflows/daily-money-actions.md`.
5. Pick one repo improvement from `dashboards/FLEET_STATUS.md`.
6. Draft or update one issue.
7. Update one dashboard or registry if status changed.

## Adding a new idea

1. Create a feature request issue.
2. Classify the area: AI coding, workflow, support, platform, integration, product, marketing, or dashboard.
3. Identify risk level.
4. Run the AI Coding Intake workflow if technical.
5. Run the Productization prompt if commercial.
6. Add to registry/dashboard when useful.

## Adding a new platform

1. Add to `platforms/platform-registry.yml`.
2. Add platform-specific file under `platforms/` if needed.
3. Add integration entry under `integrations/integration-registry.yml`.
4. Identify required secret names only.
5. Add human review boundary.
6. Update `dashboards/PLATFORM_STATUS.md`.

## Adding a new workflow

1. Create `workflows/<workflow-name>.md`.
2. Add trigger, inputs, outputs, prompt, review boundary, and definition of done.
3. Add entry to `workflows/workflow-registry.yml`.
4. Update related dashboard.

## Adding a new agent

1. Add agent definition to `agents/twin-agents.md` or another agent file.
2. Add machine-readable entry to `agents/agent-registry.yml`.
3. Update `dashboards/AGENT_STATUS.md`.
4. Define allowed and forbidden actions.
5. Define human review boundary.

## Support issue process

1. Use `workflows/support-routing.md`.
2. Classify severity.
3. Use `support/canned-replies.md` when helpful.
4. Escalate high-risk issues.
5. Convert repeated issues into FAQ/support docs.
6. Update `dashboards/SUPPORT_STATUS.md`.

## Funding intake process

1. Use `workflows/funding-intake.md`.
2. Use safe wording.
3. Do not guarantee approval, terms, rates, outcomes, legal/tax results, or income.
4. Human review before customer-facing publication.
5. Route to lippytmai.getbizfunds.com/business services as appropriate.

## Repo modernization process

1. Check `fleet/repos.yml`.
2. Pick next priority repo.
3. Run `workflows/repo-modernization.md`.
4. Add README, Copilot instructions, quality/security docs, support path, productization path.
5. Create next 3 issues.
6. Update `dashboards/FLEET_STATUS.md`.

## Emergency: secret exposure

1. Stop using the exposed credential.
2. Rotate/revoke immediately.
3. Remove from files.
4. Check history/logs.
5. Replace with placeholder.
6. Add prevention issue.

## Review cadence

- Daily: money path and repo action
- Weekly: support and quality dashboard update
- Weekly: one repo modernization step
- Monthly: fleet status review
- Quarterly: retire, merge, or refocus weak repos
