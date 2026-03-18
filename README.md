# AI Tower Control

An AI Control Tower that connects **ChatGPT / OpenAI** with **AllBots.com.ai**, **Factory.ai**, **Replit**, and **GitHub Copilot**, with built-in cybersecurity and automated data-management capabilities.

---

## Features

| Feature | Description |
|---|---|
| **ChatGPT / OpenAI** | Chat completions and model listing via the OpenAI API |
| **AllBots.com.ai** | List, create, and message bots on AllBots.com.ai |
| **Factory.ai** | List pipelines, trigger runs, and monitor results |
| **Replit** | List, create, and run Repls via the Replit API |
| **GitHub Copilot** | Trigger and monitor GitHub Actions workflows; query commits |
| **Cybersecurity** | JWT authentication, Helmet security headers, per-route rate limiting, input sanitization, route param validation |
| **Data Management** | Schedule and track data-sync jobs between any pair of connectors |
| **Observability** | Request-ID correlation header, environment-aware structured logging |

---

## Architecture

```
src/
├── server.js                    # Express application entry-point
├── logger.js                    # Winston logger (JSON in prod, pretty in dev)
├── connectors/
│   ├── openai.js                # ChatGPT / OpenAI connector
│   ├── allbots.js               # AllBots.com.ai connector
│   ├── factory-ai.js            # Factory.ai connector
│   ├── replit.js                # Replit connector
│   └── github-copilot.js        # GitHub Copilot / Actions connector
├── security/
│   ├── auth.js                  # JWT generation, verification, requireAuth middleware
│   ├── rateLimiter.js           # Strict rate limiter, input sanitization, param validation
│   └── requestId.js             # X-Request-Id correlation middleware
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

### 5. Lint

```bash
npm run lint        # check
npm run lint:fix    # auto-fix
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

### Health

```
GET /health
-> { "status": "ok", "service": "ai-tower-control", "version": "1.0.0",
     "environment": "production", "uptimeSeconds": 42 }
```

---

## Security

* **JWT** – all protected endpoints require a signed Bearer token (HS256, configurable expiry). The server refuses to start in production if `JWT_SECRET` is the default `changeme`.
* **Helmet** – HTTP security headers (CSP, HSTS, etc.) on every response.
* **CORS** – restricted to origins listed in `CORS_ORIGIN`; all cross-origin requests are blocked when the variable is not set.
* **Rate limiting** – global limiter (default 100 req/min) + strict limiter (10 req/min) on `/api/auth/token`.
* **Input sanitization** – NUL bytes and ASCII control characters stripped, whitespace trimmed before forwarding user text to AI backends.
* **Route parameter validation** – `botId`, `replId`, `pipelineId`, `runId`, `branch`, and `workflowId` are validated against an allowlist regex to prevent path traversal and injection attacks.
* **Secrets via environment variables** – no credentials are hard-coded; see `.env.example`.

## Observability

* **Request-ID** – every request receives a unique `X-Request-Id` response header (UUID v4 generated server-side, or passed through from upstream). Use this to correlate log entries across services.
* **Structured logging** – JSON in production, human-readable timestamped format in development. Log level controlled via `LOG_LEVEL` env var (defaults to `warn` in production, `info` in development).
* **Graceful shutdown** – `SIGTERM` and `SIGINT` are handled: the server stops accepting new connections and waits for in-flight requests to complete before exiting. Configurable timeout via `SHUTDOWN_TIMEOUT_MS`.

