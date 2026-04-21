# AI Solution to Platform Matrix

## Purpose
This document maps AI solution types to best-fit delivery and support platforms across the lippytm ecosystem.

## Solution Types
- internal utility
- product
- service
- application
- educational module
- media asset
- CRM system
- reporting system
- synchronization system

## Platforms
- GitHub
- MyClaw
- ChatGPT / OpenAI
- Claude
- Grok
- ManyChat
- BotBuilders

## Matrix
| Solution Type | GitHub | MyClaw | ChatGPT / OpenAI | Claude | Grok | ManyChat | BotBuilders | Notes |
|---|---|---|---|---|---|---|---|---|
| internal utility | strong | low | strong | strong | support | low | low | GitHub remains system-of-record |
| product | strong | support | support | support | support | support | strong | packaging varies by product type |
| service | support | strong | support | support | support | support | strong | delivery often mixes human + platform surfaces |
| application | strong | support | support | support | support | support | support | depends on audience and review level |
| educational module | strong | support | strong | strong | support | low | support | reusable across many surfaces |
| media asset | support | low | strong | strong | support | support | support | cross-format packaging opportunity |
| CRM system | support | strong | support | low | low | strong | support | MyClaw/ManyChat strongest operational surfaces |
| reporting system | strong | support | strong | strong | support | low | low | governance and traceability remain important |
| synchronization system | strong | support | support | support | support | low | low | GitHub-centered records should remain canonical |

## Best Practices
- use this matrix to choose first-wave delivery surfaces for AI solutions
- treat GitHub as the authoritative architecture and status layer
- allow one solution to use multiple platforms when packaging and delivery differ
- preserve review-level visibility when a solution spans several platforms

## Future Extensions
- platform fit scorecard
- solution delivery heatmap
- platform packaging checklist
