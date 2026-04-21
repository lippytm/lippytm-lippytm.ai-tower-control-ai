# R&D Application Builder to Platform Matrix

## Purpose
This document maps R&D application builder types to best-fit platform surfaces across the lippytm ecosystem.

## Builder Types
- reasoning builders
- diagnostics builders
- workflow builders
- multimedia builders
- database/object builders
- learning builders
- cross-domain solution builders

## Platforms
- GitHub
- ChatGPT / OpenAI
- Claude
- Grok
- MyClaw
- ManyChat
- BotBuilders
- websites / dashboards
- internal utilities

## Matrix
| Builder Type | GitHub | ChatGPT / OpenAI | Claude | Grok | MyClaw | ManyChat | BotBuilders | Websites / Dashboards | Internal Utilities | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| reasoning builders | strong | strong | strong | support | low | low | low | support | strong | strong for documentation and comparison work |
| diagnostics builders | strong | support | support | support | support | low | low | support | strong | useful for internal review loops |
| workflow builders | strong | support | support | support | strong | strong | support | support | strong | strong for CRM and operations |
| multimedia builders | support | strong | strong | support | low | support | support | strong | support | strong for learning and media packaging |
| database/object builders | strong | support | support | low | support | low | low | support | strong | best anchored in GitHub and internal systems |
| learning builders | strong | strong | strong | support | support | support | support | strong | support | reusable across many surfaces |
| cross-domain solution builders | strong | strong | strong | support | support | support | support | strong | strong | often best as multi-platform packages |

## Best Practices
- keep GitHub as the authoritative architecture and tracking layer
- use this matrix to choose first-wave builder promotion targets
- allow multi-platform packaging when builder logic and delivery surfaces differ
- preserve review-level visibility when builders span several platforms

## Future Extensions
- builder platform scorecard
- builder promotion heatmap
- builder packaging checklist
