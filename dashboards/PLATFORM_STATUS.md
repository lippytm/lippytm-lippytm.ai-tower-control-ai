# Platform Status Dashboard

This dashboard tracks the platforms connected to the lippytm.ai Business-of-Businesses AI Coding and Automation Network.

Pending/not-connected labels below describe this Control Tower setup, not the
absence of prior connections in other repositories. Existing Jarvis/Hostinger
source assets are documented in `integrations/existing-jarvis-connections.md`;
their current live account health has not been verified by this session.

| Platform | Role | Status | Links / Notes | Next Action | Risk Level |
|---|---|---|---|---|---|
| GitHub Control Tower | Source of truth | Active | This repo | Continue building registries, dashboards, and workflows | Low |
| GitHub Copilot | AI coding autocomplete | Instructions added | `.github/copilot-instructions.md` | Use for repo modernization and docs/code assistance | Medium |
| ChatGPT | Strategy, planning, writing, review | Active | Used for planning and GitHub issue creation | Continue issue-first planning and review | Medium |
| Hostinger VPS | Control Tower hosting target | Starter prepared; not deployed | `deploy/hostinger/` and `integrations/hostinger-jarvis-chatgpt.md` | Verify OS and run private pilot | High |
| Existing Jarvis / Hostinger projects | Prior cross-repository integrations | Source verified; live health unverified | `integrations/existing-jarvis-connections.md` | Identify authoritative runtime and verify a harmless round trip before replacing anything | High |
| ChatGPT Business | Approved Jarvis interface target | Not connected | Requires workspace approval and an authenticated adapter; API billing is separate | Confirm supported workspace integration method | High |
| Gemini API | Jarvis drafting and review | Connector implemented; account not validated | `workflows/jarvis-ai-build-review.md` | Configure API key/model on VPS and run sandbox request | Medium |
| Claude API | Jarvis drafting and review | Connector implemented; account not validated | `workflows/jarvis-ai-build-review.md` | Configure API key/model on VPS and run sandbox request | Medium |
| aievolutionaryevolutions.com | User-reported existing AI agents | Endpoint unverified; not connected | DNS could not be resolved during setup | Confirm working URL and documented agent API | High |
| Twin | Autonomous agent/workflow layer | Links recorded | Builder: https://build.twin.so/?ref=E7A31F7E / Affiliate: https://twin.so?via=charles-lipshay | Build first Twin agents manually, then connect workflows | Medium |
| ManyChat | Front-line messaging | Planned | Facebook/Instagram/Messenger lead capture | Create intake and follow-up flows | Medium |
| BotBuilders | Chatbot business system | Planned | Product/service channel | Create sales and support chatbot flows | Medium |
| lippytmai.getbizfunds.com | Business/funding front door | Active concept | Funding and business services | Create safe funding intake automation | High |
| Replit | Fast app prototypes | Planned | App builder layer | Use for prototypes after docs/workflows are clear | Medium |
| Base44 | Website/app builder | Planned | Web/app layer | Connect to website launch workflows | Medium |
| MyClaw | AI assistant/agent concept | Planned | Agent layer | Define integration role and repo growth path | Medium |
| OpenClaw | AI assistant/agent concept | Planned | Agent layer | Define integration role and repo growth path | Medium |
| Facebook | Traffic and lead source | Planned | Social/channel layer | Connect content and Messenger workflow | Medium |
| Instagram | Traffic and lead source | Planned | Social/channel layer | Connect content and Messenger workflow | Medium |
| Messenger | Conversation layer | Planned | ManyChat/BotBuilders channel | Build lead capture and follow-up scripts | Medium |
| Upland / Atlas Earth concepts | Virtual property experiments | R&D | Future creative/business experiments | Keep separate from core client promises | Medium |

## Platform best practices

- Use GitHub as source of truth.
- Keep platform links and roles documented.
- Do not store secrets in repos.
- Use human review for high-risk actions.
- Build manual workflows before API/webhook automation.
- Track each platform's next action.
- Keep tools swappable through generic roles.

## Current priority

1. GitHub Control Tower
2. Twin agent setup
3. ManyChat/BotBuilders messaging workflows
4. GetBizFunds safe intake workflow
5. Copilot-assisted repo modernization
