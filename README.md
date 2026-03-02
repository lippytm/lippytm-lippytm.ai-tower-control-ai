# AI Tower Control Tower

Central hub that automates workflows between **ChatGPT (OpenAI)**, **GitHub**, **ManyChat**, **BotBuilders (Microsoft Bot Framework)**, and **Replit**.

---

## Architecture

```
GitHub Actions / HTTP Webhooks
         |
         v
   ControlTower (src/control_tower.py)
    |-- OpenAI ChatGPT  (src/integrations/openai_integration.py)
    |-- GitHub          (src/integrations/github_integration.py)
    |-- ManyChat        (src/integrations/manychat.py)
    |-- BotBuilders     (src/integrations/botbuilders.py)
    +-- Replit          (src/integrations/replit.py)
         |
         v
   Webhook HTTP server  (src/webhook_server.py)
```

---

## Quick Start

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `GITHUB_TOKEN` | GitHub personal access token |
| `MANYCHAT_API_KEY` | ManyChat API key |
| `BOTBUILDERS_APP_ID` | Microsoft Bot Framework app ID |
| `BOTBUILDERS_APP_PASSWORD` | Microsoft Bot Framework app password |
| `REPLIT_API_KEY` | Replit API key |
| `WEBHOOK_SECRET` | (Optional) HMAC-SHA256 secret for webhook verification |

### 3. Run the webhook server

```bash
uvicorn src.webhook_server:app --host 0.0.0.0 --port 8000
```

Or deploy directly to Replit - this repo includes `.replit` and `replit.nix` configuration.

---

## GitHub Actions Workflows

### `integration.yml`

Runs on every push/PR and supports manual dispatch to broadcast a message to all platforms.

**Manual dispatch inputs:**
- `message` - text to broadcast
- `platform` - `manychat` | `botbuilders` | `all`

### `webhook.yml`

Handles inbound `repository_dispatch` events from other repositories or services:

| Event type | Required payload keys |
|---|---|
| `chatgpt-query` | `prompt` |
| `manychat-event` | `subscriber_id`, `message` |
| `botbuilders-event` | `text` |
| `replit-deploy` | `repl_id` |

**Trigger example (using curl):**

```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/lippytm/lippytm-lippytm.ai-tower-control-ai/dispatches \
  -d '{"event_type":"chatgpt-query","client_payload":{"prompt":"Summarize today news"}}'
```

---

## Webhook Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/webhook/chatgpt` | Send a ChatGPT prompt, receive reply |
| `POST` | `/webhook/manychat` | Process a ManyChat inbound event |
| `POST` | `/webhook/botbuilders` | Process a Bot Framework activity |
| `POST` | `/webhook/replit` | Trigger a Replit deployment |
| `POST` | `/webhook/github` | Accept GitHub webhook events |

---

## Running Tests

```bash
pytest tests/ -v
```

---

## Configuration

See [`config/integrations.yaml`](config/integrations.yaml) for the full list of configurable options.
