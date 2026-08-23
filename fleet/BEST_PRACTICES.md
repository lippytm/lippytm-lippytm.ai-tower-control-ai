# Fleet Best Practices

Canonical best practices for all 31 lippytm.ai fleet repositories. Apply universally first, then apply your lane-specific rules.

Last reviewed: 2026-07-05

---

## Universal Foundation — Required for Every Repo

Every fleet repository, regardless of lane or purpose, must meet this minimum viable standard.

### Required files

| File | Purpose |
|---|---|
| `README.md` | Mission, audience, quick start, next steps |
| `ROADMAP.md` | Phased plan with status markers |
| `QUALITY.md` | Quality principles and universal checklist |
| `SECURITY.md` | No-secrets rule, high-risk areas, incident steps |
| `CONTRIBUTING.md` | Contribution workflow, avoid list, definition of done |
| `.github/copilot-instructions.md` | Repo purpose, folder map, preferred completions |
| `.github/PULL_REQUEST_TEMPLATE.md` | Quality checklist gating every PR |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Standard idea intake |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Standard defect intake |
| `.github/dependabot.yml` | Automated dependency security alerts |

Use `templates/repo/` in this Control Tower repo to copy these files into any fleet repo.

### Required GitHub Actions workflows

| Workflow | Purpose |
|---|---|
| CI (lint + test) | Run on push and PR to main |
| Dependabot / dependency review | Block PRs with known-vulnerable dependencies |
| CodeQL security scan | Weekly + push/PR scan |
| Quality gate | Block merge on missing secrets, compliance, or quality failures |

Use `templates/repo/workflows/` to copy workflow files into any fleet repo.

### Registry and dashboard hygiene

- Every repo must have a row in `fleet/repos.yml` with correct `status`, `automation`, `qa`, `risk_level`, and `next_action`.
- Every repo must appear in `fleet/FLEET_STATUS.md`.
- Update both files after every meaningful repo change.
- Run `fleet-pulse.yml` nightly to detect drift.

---

## Lane-Specific Best Practices

### Control Tower (`lippytm-lippytm.ai-tower-control-ai`)

- Keep all 12 standard GitHub Actions workflows green.
- Maintain `fleet/repos.yml` as source of truth — update before and after every fleet-wide change.
- Run `hermes-scheduled.yml`, `fleet-pulse.yml`, and `fleet-status-update.yml` nightly without manual intervention.
- All high-risk actions must pass through `RISK_GATE.md` before execution.
- Document every new connector, agent, or integration in both `integrations/` and `platforms/`.
- Apply the agent task loop: label issues `agent-task` to trigger the Claude Code loop.

### Website (`lippytm.ai`, `balletcrypto.github.io`, `gatsby-starter-blog`)

- Add a clear homepage purpose statement and CTA in `README.md`.
- Document what the site does, who it is for, and the primary visitor action.
- Add `docs/architecture.md` describing tech stack and deployment method.
- Add `docs/runbook.md` covering deploy, rollback, and DNS change procedures.
- Add a contact and support path so visitors know how to get help.
- Enable Dependabot for all npm/pip/gem dependencies.
- No customer data stored in public repos.

### Revenue (`lippytmai.getbizfunds.com-`, `biz-funds-intake`)

- Apply compliance notice to every customer-facing page and form.
- Document intake flow: lead → form → CRM → follow-up → qualified → offer.
- Add `RISK_GATE.md` review step before any funding or payment workflow goes live.
- Keep all funding claim language realistic, human-approved, and reviewed before publication.
- Add `docs/support-playbook.md` so every lead gets a consistent response.
- Risk level: high — human review required for every customer-facing change.

> **Compliance notice:** Nothing in revenue repos constitutes a guarantee of funding approval, income, profit, legal outcomes, tax outcomes, investment returns, or trading results.

### Bots (`Chatlippytm.ai.Bots`, `Clawlippytm.ai.Bots`, `ClawBase44.ai.Bots`, `Transparency-Logic-Time-Machine-Bots-`, `AllBots.com`)

- Define each bot's persona, purpose, channels, and escalation path in a YAML manifest.
- Add `agents/` folder with one YAML definition per bot: name, role, channels, self-healing rules.
- Document ManyChat/BotBuilders intake flow per bot.
- Add test scripts or manual validation steps for every bot conversation path.
- Add a support escalation path so bots hand off to humans for high-risk requests.
- Never allow bots to make financial, funding, legal, or medical claims autonomously.

### Integration (`MyClaw.lippytm.AI-`, `OpenClaw-lippytm.AI-`, `Base44-`)

- Define integration role in `docs/architecture.md`: what does this connect, what data flows, what triggers what.
- Document credential names (never values) in `.env.example` and `SECURITY.md`.
- Write `docs/integrations.md` listing every connected platform, API endpoint, and expected response.
- Add manual test plan before enabling any automation.
- Add failure and fallback playbooks for each integration point.
- Risk level: medium — human review required before enabling live API connections.

### R&D (`Web3AI`, `AI-Time-Machines`, `Factory.ai`, `ai-coding-factory`)

- Label all R&D repos as experimental — add a prominent `> ⚠️ This is an R&D / experimental repository.` notice in `README.md`.
- Separate working prototypes from ideas and concepts in subfolders (`experiments/`, `prototypes/`, `concepts/`).
- Create `docs/research-log.md` tracking what was tried, what worked, and what failed.
- Define a promotion path: when an R&D concept is ready to become a product, follow `templates/repo/RD_TO_PRODUCT_CHECKLIST.md`.
- Apply cost and risk controls before connecting R&D to live APIs or customer data.

### Agents & AI (`MARVIN`, `AI-Full-Stack-AI-DevOps-Synthetic-Intelligence-Engines-AgentsBots-Web3-Websites-`)

- Define each agent with a YAML manifest: name, role, channels, self-healing rules, escalation path.
- Document swarm topology in `docs/architecture.md`: which agents are in which swarm and their relationships.
- Add health-check endpoints and monitoring steps in `docs/runbook.md`.
- Configure `SWARM_MAX_AUTO_RESTARTS` and stale threshold per swarm via environment variables.
- Log every agent state transition to a maintenance log.
- Apply the Control Tower swarm orchestrator pattern from `src/swarm/` as reference.

### Education (`earn-while-you-learn`)

- Write a curriculum outline as the first file (`curriculum.md` or `docs/curriculum.md`).
- Define learning tracks, modules, and outcomes in a structured Markdown table or YAML.
- Add `docs/business-model.md` explaining the earn-while-you-learn revenue model clearly and compliantly.
- Include a compliance notice on all course materials: educational tools only, no income guarantees.
- Define student support path and FAQ in `docs/support-playbook.md`.

> **Compliance notice:** Educational tools only. Participation in any program does not guarantee income, employment, or financial results.

### Security (`cybersecurity-layer`)

- Start with `SECURITY.md` and `docs/architecture.md` before any code.
- Document every tool, scan type, and alert path.
- Require human review for every change to security tooling.
- Add `docs/runbook.md` with incident response steps.
- Never store scan results, credentials, or customer vulnerability data in a public repo.
- Risk level: high — human approval required for all changes.

### Trading (`trading-bots`)

- Risk level is **critical** — human approval required for every change, no exceptions.
- Add `RISK_GATE.md` as the first file reviewed before any code runs.
- Add compliance notice to every file: no investment return guarantees, no trading profit guarantees.
- All API credentials use environment secrets only — no exceptions.
- Manual paper-trading validation required before any live capital connection.
- Add `docs/runbook.md` with kill-switch and emergency stop procedures.
- Never deploy to a live account without explicit signed human approval on record.

> **Compliance notice:** Trading bots are experimental tools. Past results do not guarantee future returns. All live trading carries risk of loss. This is not investment advice.

### Creative (`CryptoSteampunk`, `AI-Time-Machines`)

- Write a world-building canon document (`CANON.md`) as the first asset.
- Define creative direction, tone, characters, and universe rules before building any output.
- Separate creative assets (stories, art, prompts) from automation code.
- Document monetization path: licensing, NFTs, media partnerships, affiliate content.
- Apply compliance notices to any AI-generated content used commercially.

### Strategy (`quantum-leap`, `civilization-blueprint`)

- Write a one-page executive summary in `README.md` before adding any detail.
- Use phased roadmaps: near-term (90 days), mid-term (6 months), long-horizon (1–3 years).
- Tie every strategy doc back to a concrete next action and an owner.
- Add a review date (`Last reviewed: YYYY-MM-DD`) to the top of each file.
- Review and update at minimum quarterly.

### Docs (`docs`, `The-Encyclopedia-of-Law-...`)

- Organize content by audience: beginners, practitioners, AI agents.
- Add a table of contents to every large document.
- Include a "last reviewed" date on legal, tax, or compliance-adjacent content.
- Add a compliance notice to legal encyclopedia content: reference only, not legal advice.
- Make docs AI-agent-readable: clear headings, no jargon blocks, structured YAML where useful.

> **Compliance notice:** This repository contains informational content only and does not constitute legal, tax, financial, or professional advice. Consult a qualified professional before making any decisions.

### Support (`sandbox-toolkit`)

- Define every support flow as a workflow: trigger → triage → response → escalation → close.
- Add `docs/support-playbook.md` with canned responses and escalation rules.
- Document which tools are for internal use and which are customer-facing.
- Add a feedback loop: capture issues encountered in support back into GitHub issues.
- Apply severity levels from `support/support-playbook.md` as the standard.

### Productivity (`zenith-tasks`)

- Define the task lifecycle: create → assign → in-progress → review → done → archive.
- Add integration hooks with GitHub issues so tasks stay synchronized.
- Document how tasks connect to the wider BoB operating loop.
- Add a weekly review workflow and template.

### AI Identity (`AI-Clone-of-Charles-Earl-Lipshay-lippytm-lippytm.AI-lippytmai-`)

- Never edit this repo directly — always edit through `fleet/clone/` and let `sync-to-clone.yml` push changes.
- Document the clone's persona, values, communication style, and limits in `fleet/clone/AI_CLONE_PERSONA.md`.
- Add a human review gate before any persona change is synced.
- Version-control persona changes with clear, descriptive commit messages.
- Requires `CLONE_REPO_PAT` secret — see `security/SECRETS_POLICY.md`.

---

## Cross-Fleet Operational Best Practices

### Git and PR hygiene

- Every change goes through a PR — never push directly to main.
- Every PR must pass the quality gate workflow before merge.
- Use the standard PR template checklist on every PR.
- Write clear commit messages: `Add funding intake workflow` not `update stuff`.
- Tag AI agent task issues with `agent-task` to trigger the Claude Code loop.

### Secrets management

- Zero secrets in any repo — use GitHub Actions secrets, Replit secrets, or a vault.
- Add `.env.example` with placeholder names to every repo that uses environment variables.
- Run Dependabot and CodeQL on every repo with code.
- If a secret is exposed: stop use → rotate → remove → check history → replace → add prevention issue.

### Fleet coordination

- Run `fleet-pulse.yml` nightly to catch drift across repos.
- Update `fleet/repos.yml` and `fleet/FLEET_STATUS.md` whenever a repo changes status.
- Use `fleet/CLAUDE_TASKS.md` as the active task queue for Copilot and AI agents.
- Use `fleet/RISKGATE_DASHBOARD.md` to track open risk items and approval status.

### Prioritization order

1. Activate all CI/QA workflows on all repos (quick wins, highest safety value).
2. Apply repo modernization workflow to Priority 2–10 repos (website, revenue, bots).
3. Apply safety gate and compliance review to all high/critical risk repos (trading, revenue, legal).
4. Build Twin agents and ManyChat flows after manual workflows are proven.
5. Productize proven workflows into offer packages and case studies.

### Compliance — always

- Compliance notice on every revenue, legal, funding, trading, and customer-facing doc.
- No unsupported claims about income, funding approval, legal outcomes, or investment returns.
- Human review required before any customer-facing content is published.
- Use `RISK_GATE.md` for every high or critical risk action.

---

## Reference links

| Resource | Location |
|---|---|
| Repo modernization workflow | `workflows/repo-modernization.md` |
| Repo standard templates | `templates/repo/` |
| Lane-specific checklists | `templates/lanes/` |
| Definition of Done | `quality/definition-of-done.md` |
| Fleet registry | `fleet/repos.yml` |
| Fleet status dashboard | `fleet/FLEET_STATUS.md` |
| Risk gate | `RISK_GATE.md` |
| Security policy | `security/SECRETS_POLICY.md` |
| Autocomplete system | `docs/autocomplete-automation-system.md` |
