# lippytm.ai Tower Control

Control tower for OpenAI ChatGPT's integrated interfaces with other applications, projects, and platforms — BotBuilders, ManyChat, Replit, and more.

## Architecture

```
app.py                        ← Flask entry point
config.py                     ← Environment-based configuration
integrations/
  openai_client.py            ← OpenAI ChatGPT wrapper
  manychat.py                 ← ManyChat API helpers
  botbuilder.py               ← Azure Bot Framework helpers
  replit.py                   ← Replit webhook verification
routes/
  chat.py                     ← POST /api/chat
  webhooks.py                 ← POST /webhooks/{manychat,botbuilder,replit}
```

## Quick start

### 1. Clone and install dependencies

```bash
git clone https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai.git
cd lippytm-lippytm.ai-tower-control-ai
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment variables

Copy the example below into a `.env` file and fill in your keys:

```ini
# Required
OPENAI_API_KEY=sk-...

# Optional – defaults shown
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=1024

# ManyChat (for /webhooks/manychat)
MANYCHAT_API_KEY=
MANYCHAT_PAGE_ID=

# Azure Bot Framework (for /webhooks/botbuilder)
BOTBUILDER_APP_ID=
BOTBUILDER_APP_PASSWORD=

# Replit (for /webhooks/replit)
REPLIT_WEBHOOK_SECRET=

# Server
FLASK_SECRET_KEY=change-me-in-production
DEBUG=false
PORT=5000
```

### 3. Run the server

```bash
python app.py
# or for production:
gunicorn app:app
```

## API reference

### `GET /health`
Returns `{"status": "ok"}` — useful for uptime checks.

### `POST /api/chat`
Send a message to OpenAI ChatGPT and receive a reply.

**Request body**
```json
{
  "message": "Hello!",
  "history": [
    {"role": "system", "content": "You are a helpful assistant."}
  ]
}
```

**Response**
```json
{"reply": "Hi there! How can I help you today?"}
```

### `POST /webhooks/manychat`
Receive inbound ManyChat messages, generate a ChatGPT reply, and return it in ManyChat's dynamic-content format.

### `POST /webhooks/botbuilder`
Receive Azure Bot Framework activities and reply via ChatGPT.

### `POST /webhooks/replit`
Receive Replit webhook events (signature-verified using `REPLIT_WEBHOOK_SECRET`).

## Adding new integrations

1. Create a new module in `integrations/`.
2. Add a new Blueprint in `routes/` and register it in `app.py`.
3. Document any new environment variables in this README.
