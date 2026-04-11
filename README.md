# AI Tower Control

An AI Control Tower that connects **ChatGPT / OpenAI** with **AllBots.com.ai**, **Factory.ai**, **Replit**, and **GitHub Copilot**, with built-in cybersecurity, automated data-management capabilities, and an **AI Generative Synthetic Intelligence Engine Swarms AgentsBots** extension.

---

## Features

| Feature | Description |
|---|---|
| **ChatGPT / OpenAI** | Chat completions and model listing via the OpenAI API |
| **ChatGPT Broadcast** | Send a ChatGPT prompt and distribute the response to all connected platforms in one request |
| **AllBots.com.ai** | List, create, and message bots on AllBots.com.ai |
| **Factory.ai** | List pipelines, trigger runs, and monitor results |
| **Replit** | List, create, and run Repls via the Replit API |
| **GitHub Copilot** | Trigger and monitor GitHub Actions workflows; query commits |
| **Cybersecurity** | JWT authentication, Helmet security headers, per-route rate limiting, input sanitization |
| **Data Management** | Schedule and track data-sync jobs between any pair of connectors |
| **AgentsBots Swarms** | Create autonomous AgentBots, group them into swarms, broadcast messages, and self-heal stale agents |

---

## Architecture

```
src/
├── server.js                    # Express application entry-point
├── logger.js                    # Winston logger
├── connectors/
│   ├── openai.js                # ChatGPT / OpenAI connector
│   ├── allbots.js               # AllBots.com.ai connector
│   ├── factory-ai.js            # Factory.ai connector
│   ├── replit.js                # Replit connector
│   └── github-copilot.js        # GitHub Copilot / Actions connector
├── swarm/
│   ├── agent.js                 # AgentBot lifecycle, config, maintenance log
│   └── orchestrator.js          # Swarm orchestrator, membership, self-healing health-checks
├── security/
│   ├── auth.js                  # JWT generation, verification, requireAuth middleware
│   └── rateLimiter.js           # Strict rate limiter + input sanitization
├── data-management/
│   └── sync.js                  # Connector-agnostic data-sync job scheduler
└── routes/
    ├── index.js                 # Route aggregator
    ├── auth.js                  # POST /api/auth/token
    ├── connectors.js            # /api/connectors/* endpoints
    ├── data.js                  # /api/data/* endpoints
    └── swarm.js                 # /api/swarm/* endpoints
tests/                           # Jest unit + integration tests
```

---

## Quick Start

### 1. Clone & install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your API keys
```

### 3. Start the server

```bash
npm start        # production
npm run dev      # development (nodemon)
```

### 4. Run tests

```bash
npm test
```

---

## API Reference

### Authentication

All `/api/connectors/*` and `/api/data/*` endpoints require a Bearer token.

```
POST /api/auth/token
Body: { "clientId": "myapp", "clientSecret": "supersecretkey" }
-> { "token": "<jwt>", "tokenType": "Bearer", "expiresIn": "1h" }
```

Pass the token in subsequent requests:

```
Authorization: Bearer <jwt>
```

---

### ChatGPT / OpenAI

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/connectors/openai/chat` | Chat completion |
| `GET` | `/api/connectors/openai/models` | List models |
| `POST` | `/api/connectors/chatgpt/broadcast` | Send ChatGPT prompt and distribute response to all configured platforms |

**Broadcast example:**

```json
POST /api/connectors/chatgpt/broadcast
{
  "messages": [{ "role": "user", "content": "Summarize today's deployment plan." }],
  "model": "gpt-4o",
  "targets": {
    "allbots":        { "botId": "bot123" },
    "factory-ai":     { "pipelineId": "pipe456" },
    "replit":         { "replId": "repl789" },
    "github-copilot": { "workflowId": "ci.yml", "ref": "main", "inputs": { "env": "production" } }
  }
}
```

Each target is optional. Omit a target key (or leave out `targets` entirely) to skip that platform.

Response:
```json
{
  "chatgpt": { "id": "...", "content": "...", "model": "gpt-4o", "usage": {} },
  "broadcast": {
    "allbots":        { "status": "sent", "result": {} },
    "factory-ai":     { "status": "sent", "result": {} },
    "replit":         { "status": "sent", "result": {} },
    "github-copilot": { "status": "sent" }
  }
}
```

Possible `status` values per platform: `"sent"`, `"skipped"`, `"error"` (with an `"error"` field).


### AllBots.com.ai

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/allbots/bots` | List bots |
| `POST` | `/api/connectors/allbots/bots` | Create bot |
| `POST` | `/api/connectors/allbots/bots/:botId/messages` | Send message |

### Factory.ai

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/factory-ai/pipelines` | List pipelines |
| `POST` | `/api/connectors/factory-ai/pipelines/:id/runs` | Trigger run |
| `GET` | `/api/connectors/factory-ai/pipelines/:id/runs/:runId` | Get run status |

### Replit

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/replit/repls` | List Repls |
| `POST` | `/api/connectors/replit/repls` | Create Repl |
| `POST` | `/api/connectors/replit/repls/:replId/run` | Run Repl |

### GitHub Copilot

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/github-copilot/runs` | List workflow runs |
| `POST` | `/api/connectors/github-copilot/dispatch` | Dispatch workflow |
| `GET` | `/api/connectors/github-copilot/commit/:branch` | Latest commit |

### Data Management

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/data/connectors` | List connector names |
| `POST` | `/api/data/sync` | Schedule sync job |
| `GET` | `/api/data/sync` | List all sync jobs |
| `GET` | `/api/data/sync/:jobId` | Get job status |

---

### AgentsBots Swarms

All `/api/swarm/*` endpoints require a Bearer token.

#### AgentBot management

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/swarm/agents` | Create an AgentBot |
| `GET` | `/api/swarm/agents` | List agents (filter by `swarmId` or `state`) |
| `GET` | `/api/swarm/agents/:agentId` | Get agent details |
| `PATCH` | `/api/swarm/agents/:agentId` | Update agent config (name, role, channels, metadata) |
| `DELETE` | `/api/swarm/agents/:agentId` | Delete an agent |
| `POST` | `/api/swarm/agents/:agentId/state` | Transition lifecycle state (`idle`\|`running`\|`paused`\|`failed`\|`terminated`) |
| `GET` | `/api/swarm/agents/:agentId/maintenance-log` | View timestamped event log for the agent |

**Supported channel types:** `openai`, `allbots`, `factory-ai`, `replit`, `github-copilot`, `internal`

**Example – create a worker AgentBot:**

```bash
curl -X POST /api/swarm/agents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "worker-1", "role": "worker", "channels": ["openai", "replit"]}'
```

#### Swarm management

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/swarm/swarms` | Create a swarm |
| `GET` | `/api/swarm/swarms` | List all swarms |
| `GET` | `/api/swarm/swarms/:swarmId` | Get swarm details |
| `PATCH` | `/api/swarm/swarms/:swarmId` | Update swarm (name, description, scalingPolicy) |
| `DELETE` | `/api/swarm/swarms/:swarmId` | Dissolve swarm (terminates all member agents) |
| `POST` | `/api/swarm/swarms/:swarmId/agents` | Add an existing agent to the swarm |
| `DELETE` | `/api/swarm/swarms/:swarmId/agents/:agentId` | Remove agent from swarm |
| `POST` | `/api/swarm/swarms/:swarmId/start` | Start all idle/paused agents |
| `POST` | `/api/swarm/swarms/:swarmId/pause` | Pause all running agents |
| `POST` | `/api/swarm/swarms/:swarmId/broadcast` | Broadcast a message to all running agents |

**Example – create a swarm, add an agent, and start it:**

```bash
# 1. Create swarm
SWARM_ID=$(curl -sX POST /api/swarm/swarms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "swarm-alpha"}' | jq -r .swarmId)

# 2. Create agent
AGENT_ID=$(curl -sX POST /api/swarm/agents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "alpha-bot-1", "channels": ["openai"]}' | jq -r .agentId)

# 3. Add agent to swarm
curl -X POST /api/swarm/swarms/$SWARM_ID/agents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d "{\"agentId\": \"$AGENT_ID\"}"

# 4. Start all agents
curl -X POST /api/swarm/swarms/$SWARM_ID/start \
  -H "Authorization: Bearer <token>"
```

#### Self-healing

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/swarm/health-check` | Manually trigger a health-check cycle |

The orchestrator automatically restarts agents whose heartbeat has gone stale (exceeds `SWARM_STALE_THRESHOLD_MS`, default 60 s). After `SWARM_MAX_AUTO_RESTARTS` (default 3) consecutive failures the agent is marked `failed` and requires manual intervention.

The background loop fires every `SWARM_HEALTH_CHECK_INTERVAL_MS` (default 30 s) and is configurable via environment variables.

#### Adding / removing AgentsBots – developer guide

1. **Create** an AgentBot with `POST /api/swarm/agents` supplying a `name` and optionally `role`, `channels`, and `metadata`.
2. **Register** it with a swarm via `POST /api/swarm/swarms/:swarmId/agents`.
3. **Start** the swarm (or individual agent) using the `/start` and `/state` endpoints.
4. **Monitor** health via `GET /api/swarm/agents/:agentId/maintenance-log` or trigger a manual `POST /api/swarm/health-check`.
5. **Remove** cleanly with `DELETE /api/swarm/swarms/:swarmId/agents/:agentId` (keeps the agent record) or `DELETE /api/swarm/agents/:agentId` (permanent deletion).

---

## Security

* **JWT** - all protected endpoints require a signed Bearer token (HS256, configurable expiry). Set `JWT_SECRET` to a randomly-generated string of at least 32 characters; the server will log a warning if it detects the default value.
* **Helmet** - HTTP security headers (CSP, HSTS, etc.) on every response.
* **Rate limiting** - global limiter (default 100 req/min) + strict limiter (10 req/min) on `/api/auth/token`.
* **Input sanitization** - NUL bytes and non-printable control characters stripped and whitespace trimmed before forwarding user text to AI backends.
* **CORS** - configurable allowed-origin list via `CORS_ORIGINS` (defaults to `*` for development; restrict in production).
* **Secrets via environment variables** - no credentials are hard-coded; see `.env.example`.

---

## Deployment

### Replit

1. Fork or import this repository on [Replit](https://replit.com).
2. Open the **Secrets** tab and add all variables from `.env.example`.
3. Set `NODE_ENV=production`.
4. Click **Run**. The server auto-scales with Replit's infrastructure.

### Docker / any container platform

```bash
docker build -t ai-tower-control .
docker run -p 3000:3000 --env-file .env ai-tower-control
```

### GitHub Actions CI/CD

The repository ships with two workflows under `.github/workflows/`:

| Workflow | File | Trigger |
|---|---|---|
| CI (lint + test) | `ci.yml` | Push / PR to `main` |
| Webhook dispatcher | `webhook.yml` | Manual (`workflow_dispatch`) |

Configure the following repository secrets for the webhook workflow:

| Secret | Description |
|---|---|
| `TOWER_API_URL` | Base URL of your deployed AI Control Tower |
| `TOWER_CLIENT_ID` | `clientId` used to obtain an auth token |
| `TOWER_CLIENT_SECRET` | `clientSecret` for the above client (≥ 8 chars) |

### Onboarding a new integration

1. Add connector environment variables to your `.env` (copy from `.env.example`).
2. Create `src/connectors/<platform>.js` following the existing connector pattern.
3. Register the connector name in `src/data-management/sync.js` → `CONNECTORS` array.
4. Add route handlers in `src/routes/connectors.js`.
5. Run `npm test` to validate everything still works.

