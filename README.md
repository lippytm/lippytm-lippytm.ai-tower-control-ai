# AI Tower Control

An AI Control Tower that connects **ChatGPT / OpenAI**, **Perplexity AI**, **BotBuilders**, **ManyChat**, **Kartra**, **AllBots.com.ai**, **Factory.ai**, **Replit**, and **GitHub Copilot**, with built-in cybersecurity and automated data-management capabilities.

---

## Features

| Feature | Description |
|---|---|
| **ChatGPT / OpenAI** | Chat completions and model listing via the OpenAI API |
| **Perplexity AI** | AI-powered search and chat completions via the Perplexity API |
| **AllBots.com.ai** | List, create, and message bots on AllBots.com.ai |
| **Factory.ai** | List pipelines, trigger runs, and monitor results |
| **Replit** | List, create, and run Repls via the Replit API |
| **GitHub Copilot** | Trigger and monitor GitHub Actions workflows; query commits |
| **BotBuilders** | List, inspect, and send messages to BotBuilders chatbots |
| **ManyChat** | Manage subscribers and send messages via the ManyChat API |
| **Kartra** | Manage leads and sequences via the Kartra API |
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
│   ├── perplexity.js            # Perplexity AI connector
│   ├── allbots.js               # AllBots.com.ai connector
│   ├── factory-ai.js            # Factory.ai connector
│   ├── replit.js                # Replit connector
│   ├── github-copilot.js        # GitHub Copilot / Actions connector
│   ├── botbuilders.js           # BotBuilders connector
│   ├── manychat.js              # ManyChat connector
│   └── kartra.js                # Kartra connector
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

### Perplexity AI

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/connectors/perplexity/chat` | Chat completion |
| `POST` | `/api/connectors/perplexity/search` | AI-powered search query |

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

### BotBuilders

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/botbuilders/bots` | List bots |
| `GET` | `/api/connectors/botbuilders/bots/:botId` | Get bot details |
| `POST` | `/api/connectors/botbuilders/bots/:botId/messages` | Send message to bot |

### ManyChat

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/manychat/page` | Get page / account info |
| `GET` | `/api/connectors/manychat/subscribers?name=` | Find subscriber by name |
| `POST` | `/api/connectors/manychat/subscribers/:subscriberId/messages` | Send message to subscriber |

### Kartra

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/connectors/kartra/leads?email=` | Get lead by email |
| `POST` | `/api/connectors/kartra/leads` | Add a new lead |
| `POST` | `/api/connectors/kartra/leads/:email/sequences/:sequenceId` | Subscribe lead to sequence |

### Data Management

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/data/connectors` | List connector names |
| `POST` | `/api/data/sync` | Schedule sync job |
| `GET` | `/api/data/sync` | List all sync jobs |
| `GET` | `/api/data/sync/:jobId` | Get job status |

---

## Security

* **JWT** - all protected endpoints require a signed Bearer token (HS256, configurable expiry).
* **Helmet** - HTTP security headers (CSP, HSTS, etc.) on every response.
* **Rate limiting** - global limiter (default 100 req/min) + strict limiter (10 req/min) on `/api/auth/token`.
* **Input sanitization** - NUL bytes stripped and whitespace trimmed before forwarding user text to AI backends.
* **Secrets via environment variables** - no credentials are hard-coded; see `.env.example`.
