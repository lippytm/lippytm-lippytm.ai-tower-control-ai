# Hermes Agent Integration

**Source:** [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
**Docs:** [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/)
**License:** MIT

---

## Purpose

Hermes Agent is a self-improving AI agent runtime integrated into the lippytm.ai Control Tower as the autonomous execution and learning layer. It adds:

- A **closed learning loop** — creates and refines skills from experience
- A **cron scheduler** — unattended nightly summaries, audits, and memory consolidation
- **Subagent delegation** — spawn isolated subagents for parallel workstreams
- **Cross-session memory search** — FTS5 + LLM summarization across all past sessions
- **Multi-platform gateway** — Telegram, Discord, Slack, WhatsApp, Signal, CLI
- **Model-agnostic** — OpenRouter, Nous Portal, OpenAI, and more (no lock-in)
- **OpenClaw migration path** — `hermes claw migrate`

---

## Setup

### 1. Install Hermes

**Linux / macOS / WSL2:**
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.bashrc
hermes setup
```

**Docker:**
```bash
docker run -p 8000:8000 nousresearch/hermes-agent
```

### 2. Start the Hermes gateway

```bash
hermes gateway      # starts the messaging gateway and REST API
```

### 3. Configure environment variables

Copy from `.env.example` and fill in:

```bash
HERMES_API_URL=http://localhost:8000   # Base URL of your running Hermes gateway
HERMES_API_KEY=your_hermes_api_key     # API key configured in hermes setup
```

> **Never commit real values.** Add these as GitHub repository secrets for CI/CD.

### 4. Verify the connection

```bash
curl -H "Authorization: Bearer $HERMES_API_KEY" \
  http://localhost:8000/api/skills
```

---

## Control Tower Endpoints

All endpoints require a valid Tower JWT ****** (`POST /api/auth/token`).

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/connectors/hermes/run` | Trigger a Hermes skill or task |
| `GET` | `/api/connectors/hermes/skills` | List available skills |
| `POST` | `/api/connectors/hermes/schedule` | Create a cron automation |
| `GET` | `/api/connectors/hermes/memory/search` | Search cross-session memory |

### Run a skill

```json
POST /api/connectors/hermes/run
{
  "skill": "nightly-summary",
  "input": "Summarize today's Control Tower activity.",
  "options": { "delivery": "telegram" }
}
```

### Create a cron automation

```json
POST /api/connectors/hermes/schedule
{
  "name": "Nightly Repo Audit",
  "cron": "0 2 * * *",
  "skill": "repo-audit",
  "input": "Audit the lippytm.ai Control Tower for quality and security gaps.",
  "delivery": "internal"
}
```

### Search cross-session memory

```
GET /api/connectors/hermes/memory/search?q=affiliate+campaign&limit=10
```

### ChatGPT broadcast with Hermes target

```json
POST /api/connectors/chatgpt/broadcast
{
  "messages": [{ "role": "user", "content": "Summarize today's deployment plan." }],
  "targets": {
    "hermes": { "skill": "nightly-summary", "options": { "delivery": "internal" } }
  }
}
```

---

## Skill Creation Pattern

After Hermes completes a complex task, it autonomously proposes a reusable skill. You can also create skills manually:

```bash
hermes     # open the CLI
/skills    # list skills
/skill create "repo-audit" "Audit a GitHub repository for quality gaps."
```

Skills conform to the [agentskills.io](https://agentskills.io) open standard and can be shared across compatible agents.

---

## OpenClaw Migration Path

If you are migrating from OpenClaw:

```bash
hermes claw migrate
```

This transfers your OpenClaw configuration, skills, and history to Hermes.

---

## Scheduled Automations

The Control Tower ships with a GitHub Actions workflow (`.github/workflows/hermes-scheduled.yml`) that runs three nightly tasks automatically:

1. **nightly-summary** — summarize Control Tower activity
2. **repo-audit** — quality and security gap scan
3. **memory-consolidate** — consolidate cross-session memory

Requires these repository secrets:

| Secret | Description |
|--------|-------------|
| `TOWER_API_URL` | Deployed Tower base URL |
| `TOWER_CLIENT_ID` | Tower auth client ID |
| `TOWER_CLIENT_SECRET` | Tower auth client secret |

---

## Swarm Channel Type

Hermes is registered as a valid AgentBot channel type (`hermes`) alongside `openai`, `replit`, `github-copilot`, etc. Use it when creating swarm agents:

```bash
curl -X POST /api/swarm/agents \
  -H "Authorization: Bearer $TOWER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "hermes-worker", "role": "worker", "channels": ["hermes", "openai"]}'
```

---

## Fallback / Rollback

If the Hermes gateway is unavailable:

1. Direct OpenAI calls via `POST /api/connectors/openai/chat`
2. Twin agent execution via existing Control Tower Twin workflows
3. Manual ChatGPT workflow via Control Tower prompts in the `ai-coding/` folder

To disable Hermes entirely: remove `HERMES_API_KEY` from your `.env` and skip `hermes` in any broadcast targets.

---

## Risk & Compliance

- **Risk level:** Medium
- **Vendor lock-in:** Low — MIT-licensed and model-agnostic
- **Secrets policy:** Store `HERMES_API_KEY` as a repository secret only; never commit
- **Human review required for:** customer-facing outputs, funding/legal claims, payment workflows
- **Data:** Hermes stores cross-session memory locally by default; review before connecting to customer data sources
