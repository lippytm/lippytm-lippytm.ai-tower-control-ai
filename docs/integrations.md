# Integrations

This document describes every platform, API, and connector integrated into the lippytm.ai Control Tower.

## Integration inventory

| Platform | Connector file | Auth method | Status | Risk level |
|---|---|---|---|---|
| OpenAI / ChatGPT | `src/connectors/openai.js` | API key (`OPENAI_API_KEY`) | Active | Medium |
| AllBots.com.ai | `src/connectors/allbots.js` | API key (`ALLBOTS_API_KEY`) | Active | Medium |
| Factory.ai | `src/connectors/factory-ai.js` | API key (`FACTORY_AI_API_KEY`) | Active | Medium |
| Replit | `src/connectors/replit.js` | API key (`REPLIT_API_KEY`) | Active | Medium |
| GitHub Copilot / Actions | `src/connectors/github-copilot.js` | Token (`GITHUB_TOKEN`) | Active | Medium |
| Hermes Agent | `src/connectors/hermes.js` | API key (`HERMES_API_KEY`) | Active | Medium |
| Twin | Planned | API key (`TWIN_API_KEY`) | Planned | Medium |
| ManyChat | Planned | API key (`MANYCHAT_API_KEY`) | Planned | Medium |
| BotBuilders | Planned | API key (`BOTBUILDERS_API_KEY`) | Planned | Medium |
| Stripe | Planned | Secret key (`STRIPE_SECRET_KEY`) | Planned | High |
| Zapier | Planned | Webhook secret (`ZAPIER_WEBHOOK_SECRET`) | Planned | Medium |
| Dubb.AI | Planned | API key (`DUBB_API_KEY`) | Planned | Low |

## Security rule

All credentials are stored in environment secrets only. Never commit real values. See `.env.example` for placeholder names.

## API routes

| Method | Path | Platform | Description |
|---|---|---|---|
| `POST` | `/api/connectors/openai/chat` | OpenAI | Chat completion |
| `GET` | `/api/connectors/openai/models` | OpenAI | List models |
| `POST` | `/api/connectors/chatgpt/broadcast` | OpenAI → all | Broadcast to all targets |
| `GET` | `/api/connectors/allbots/bots` | AllBots | List bots |
| `POST` | `/api/connectors/allbots/bots` | AllBots | Create bot |
| `POST` | `/api/connectors/allbots/bots/:botId/messages` | AllBots | Send message |
| `GET` | `/api/connectors/factory-ai/pipelines` | Factory.ai | List pipelines |
| `POST` | `/api/connectors/factory-ai/pipelines/:id/runs` | Factory.ai | Trigger run |
| `GET` | `/api/connectors/replit/repls` | Replit | List Repls |
| `POST` | `/api/connectors/replit/repls` | Replit | Create Repl |
| `GET` | `/api/connectors/github-copilot/runs` | GitHub | List workflow runs |
| `POST` | `/api/connectors/github-copilot/dispatch` | GitHub | Dispatch workflow |
| `GET` | `/api/connectors/hermes/status` | Hermes | Hermes agent status |

## Adding a new integration

1. Create `src/connectors/<platform>.js` following the existing connector pattern.
2. Add credential placeholder to `.env.example` and `SECURITY.md`.
3. Register connector name in `src/data-management/sync.js` → `CONNECTORS` array.
4. Add routes in `src/routes/connectors.js`.
5. Document in this file and in `platforms/<platform>.yml`.
6. Add Hermes swarm channel type if applicable.
7. Run `npm test` to validate.
8. Update `ROADMAP.md` and `fleet/FLEET_STATUS.md`.

## Failure and fallback

- If an upstream API is unavailable, the broadcast endpoint returns `"status": "error"` per target rather than failing the whole request.
- Every connector should catch errors and return a structured error object.
- Manual fallback: use the platform's native UI or API directly.
- For critical failures, see `support/support-playbook.md` and `RUNBOOK.md`.

## Related docs

- `README.md` — API reference
- `src/connectors/` — connector implementations
- `platforms/` — platform registry
- `SECURITY.md` — credential handling rules
- `.env.example` — placeholder names
