# External Agent Compatibility Matrix

## Purpose
This document provides a high-level compatibility model for synchronizing lippytm swarm-factory assets with external or adjacent AI agent systems and applications.

## Compatibility Dimensions
| Dimension | Description |
|---|---|
| Identity Compatibility | Can stable IDs be mapped clearly? |
| Context Compatibility | Can summaries, scope, and review levels transfer cleanly? |
| Workflow Compatibility | Can tasks and triggers be coordinated? |
| Output Compatibility | Can outputs be reused in the target system? |
| Traceability Compatibility | Can logs, notes, and tracker references be preserved? |

## Suggested Compatibility Status Values
- low
- medium
- high
- unknown

## Example Matrix
| Agent System Category | Identity | Context | Workflow | Output | Traceability | Notes |
|---|---|---|---|---|---|---|
| repo-native systems | high | high | high | high | high | GitHub-centered systems fit best |
| CRM agent systems | medium | high | high | medium | medium | good for follow-up and routing |
| drafting / summary systems | medium | high | medium | high | medium | strong for docs and summaries |
| reporting systems | medium | medium | medium | high | high | stronger with stable report IDs |
| knowledge indexing systems | high | high | medium | high | medium | useful for continuity and mapping |
| media/campaign systems | medium | high | medium | high | medium | repurposing is strong |
| future external agent ecosystems | unknown | unknown | unknown | unknown | unknown | profile gradually by wave |

## Best Practices
- assess compatibility before scaling synchronization
- prefer high-identity and high-traceability pairings first
- keep unknown systems in discovery mode until patterns are proven
- update compatibility notes as new adapters are created

## Future Extensions
- compatibility assessment template
- platform-specific compatibility notes
- sync-readiness scorecard
