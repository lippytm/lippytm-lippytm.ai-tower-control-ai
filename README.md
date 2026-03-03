# AI Tower Control

An AI Control Tower that connects **ChatGPT / OpenAI** with **AllBots.com.ai**, **Factory.ai**, **Replit**, and **GitHub Copilot**, with built-in cybersecurity and automated data-management capabilities.

---

## Features

| Feature | Description |
|---|---|
| **ChatGPT / OpenAI** | Chat completions and model listing via the OpenAI API, with automatic retry and rate-limit back-off |
| **AllBots.com.ai** | List, create, and message bots on AllBots.com.ai |
| **Factory.ai** | List pipelines, trigger runs, and monitor results |
| **Replit** | List, create, and run Repls via the Replit API |
| **GitHub Copilot** | Trigger and monitor GitHub Actions workflows; query commits |
| **Cybersecurity** | JWT authentication, Helmet security headers, per-route rate limiting, input sanitization, webhook signature validation |
| **Data Management** | Schedule and track data-sync jobs between any pair of connectors |

---

## Architecture

```
src/
├── server.js                    # Express application entry-point
├── logger.js                    # Winston logger
├── connectors/
│   ├── openai.js                # ChatGPT / OpenAI connector (retry, error normalisation)
│   ├── allbots.js               # AllBots.com.ai connector
│   ├── factory-ai.js            # Factory.ai connector
│   ├── replit.js                # Replit connector
│   └── github-copilot.js        # GitHub Copilot / Actions connector
├── security/
│   ├── auth.js                  # JWT generation, verification, requireAuth, webhook signature validation
│   └── rateLimiter.js           # Strict rate limiter + input sanitization
├── data-management/
│   └── sync.js                  # Connector-agnostic data-sync job scheduler
└── routes/
    ├── index.js                 # Route aggregator
    ├── auth.js                  # POST /api/auth/token
    ├── connectors.js            # /api/connectors/* endpoints
    └── data.js                  # /api/data/* endpoints
tests/                           # Jest unit + integration tests
.github/workflows/
├── ci.yml                       # Lint, test and coverage on every push / PR
├── webhook.yml                  # Manual webhook dispatcher with fallback health check
└── scheduled.yml                # Daily AI model health probe + test run
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

**Example – chat completion:**

```bash
curl -s -X POST http://localhost:3000/api/connectors/openai/chat \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user",   "content": "Summarise the latest AI news in 3 bullets." }
    ]
  }'
```

The OpenAI connector automatically retries on `429 Too Many Requests` and `5xx` server errors using exponential back-off (up to 3 attempts).

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

## GitHub Actions Workflows

### `ci.yml` – Continuous Integration

Triggered on every push and pull-request to `main`/`master`.

- Runs on Node.js 18.x and 20.x in parallel.
- Steps: install → lint → test with coverage → upload coverage artifact.

### `webhook.yml` – Webhook Dispatcher

Manually triggered (`workflow_dispatch`) to post a sync event to the running AI Control Tower.

Required repository secrets: `TOWER_API_URL`, `TOWER_CLIENT_ID`, `TOWER_CLIENT_SECRET`.

Includes a fallback health-check step that runs when the dispatch fails, helping diagnose whether the tower is unreachable.

### `scheduled.yml` – Daily AI Model Evaluation

Runs automatically every day at 02:00 UTC (and can be triggered manually).

- Executes the full test suite to catch regressions.
- Optionally probes the configured OpenAI model for availability (requires `OPENAI_API_KEY` secret).

---

## Security

* **JWT** - all protected endpoints require a signed Bearer token (HS256, configurable expiry).
* **Helmet** - HTTP security headers (CSP, HSTS, etc.) on every response.
* **Rate limiting** - global limiter (default 100 req/min) + strict limiter (10 req/min) on `/api/auth/token`.
* **Input sanitization** - NUL bytes stripped and whitespace trimmed before forwarding user text to AI backends.
* **Secrets via environment variables** - no credentials are hard-coded; see `.env.example`.
* **Webhook signature validation** - use `verifyWebhookSignature(rawBody, signatureHeader)` from `src/security/auth.js` to validate incoming `sha256=<hex>` signatures against `WEBHOOK_SECRET`.

### Managing API Keys

- Store all secrets in `.env` (never commit this file – it is listed in `.gitignore`).
- In CI/CD, inject secrets through GitHub Actions secrets (`Settings → Secrets and variables → Actions`).
- Rotate `JWT_SECRET` and `WEBHOOK_SECRET` periodically and use a minimum length of 32 random characters.

