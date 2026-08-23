# Slack Command Layer

> Documents the `/bos` Slack command namespace for the lippytm.ai Business of Businesses fleet.

## Overview

The Slack command layer bridges the human operator (Charles) and the GitHub + AI automation stack. Commands create issues, trigger workflows, request status reports, and route tasks to the appropriate agent.

**Workspace:** lippytm.ai Slack  
**Bot:** `@BoS Bot` (Business of Businesses)  
**Prefix:** `/bos`  
**Backend:** Control Tower webhook (`POST /api/connectors/hermes/run`)

---

## Command Reference

### Status Commands

| Command | Description | Example |
|---|---|---|
| `/bos repo-status` | Get status of all fleet repos | `/bos repo-status` |
| `/bos repo-status [repo]` | Get status of a specific repo | `/bos repo-status Web3AI` |
| `/bos fleet-pulse` | Trigger a fleet health check | `/bos fleet-pulse` |
| `/bos revenue` | Show current revenue path status | `/bos revenue` |
| `/bos qa` | Show QA status across fleet | `/bos qa` |
| `/bos riskgate` | Show open risk items | `/bos riskgate` |

### Task Commands

| Command | Description | Example |
|---|---|---|
| `/bos create-task [title]` | Open a new GitHub issue in control tower | `/bos create-task Add Zapier webhook to AllBots` |
| `/bos create-task [repo] [title]` | Open issue in specific repo | `/bos create-task Web3AI Add Web3 connector` |
| `/bos claude [issue #]` | Ask Claude Code to review an issue | `/bos claude 73` |
| `/bos close-task [issue #]` | Mark a GitHub issue as completed | `/bos close-task 66` |

### Agent Commands

| Command | Description | Example |
|---|---|---|
| `/bos hermes [skill]` | Run a Hermes skill on demand | `/bos hermes repo-audit` |
| `/bos hermes summary` | Generate a nightly summary on demand | `/bos hermes summary` |
| `/bos clone-sync` | Trigger AI Clone sync to Clone repo | `/bos clone-sync` |
| `/bos fleet-sync` | Sync node kit to all fleet repos | `/bos fleet-sync` |

### Revenue and Business Commands

| Command | Description | Example |
|---|---|---|
| `/bos leads` | Show recent lead capture activity | `/bos leads` |
| `/bos dubb [name]` | Draft a Dubb video script for a lead | `/bos dubb John` |
| `/bos zapier status` | Check Zapier workflow status | `/bos zapier status` |

---

## Architecture

```
Slack → /bos command → Slack App → GitHub Actions webhook
                                        ↓
                           POST /api/connectors/hermes/run
                                        ↓
                           Hermes agent evaluates skill
                                        ↓
                  GitHub issue / PR / status report / Dubb script
```

---

## Setup Instructions

1. Create a Slack App in your lippytm.ai workspace
2. Add a Slash Command `/bos` pointing to:
   ```
   https://<TOWER_API_URL>/api/connectors/hermes/slack
   ```
3. Add the `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET` to GitHub secrets
4. Enable the `webhook.yml` workflow in this repository
5. Test with `/bos fleet-pulse`

> **Approval gate:** Do not route live payment commands or customer-facing broadcasts through Slack without Charles approval.

---

## Related Files

- [`AGENT_MODE.md`](../AGENT_MODE.md) — Agent autonomy rules
- [`fleet/CLAUDE_TASKS.md`](CLAUDE_TASKS.md) — Active task queue
- [`.github/workflows/webhook.yml`](../.github/workflows/webhook.yml) — Webhook dispatcher
- [`.github/workflows/hermes-scheduled.yml`](../.github/workflows/hermes-scheduled.yml) — Hermes nightly automation
