# AI Tower Control

An AI Control Tower that connects **ChatGPT / OpenAI** with **AllBots.com.ai**, **Factory.ai**, **Replit**, and **GitHub Copilot**, with built-in cybersecurity and automated data-management capabilities.

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
├── security/
│   ├── auth.js                  # JWT generation, verification, requireAuth middleware
│   └── rateLimiter.js           # Strict rate limiter + input sanitization
├── data-management/
│   └── sync.js                  # Connector-agnostic data-sync job scheduler
└── routes/
    ├── index.js                 # Route aggregator
    ├── auth.js                  # POST /api/auth/token
    ├── connectors.js            # /api/connectors/* endpoints
    └── data.js                  # /api/data/* endpoints
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

