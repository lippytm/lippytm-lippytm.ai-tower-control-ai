# Ecosystem Inventory Relationship Matrix

## Purpose
This document defines how to track relationships among inventory objects across the full lippytm ecosystem.

The goal is to make the manufactured inventory map relational, so repos, products, components, concepts, storylines, platforms, and applications can be connected explicitly.

## Relationship Types
Suggested relationship types include:
- contains
- supports
- delivers_to
- reuses
- depends_on
- inspired_by
- adapts_into
- maps_to
- packages_as
- reports_on
- teaches
- narrates

## Suggested Relationship Fields
For each relationship track:
- relationship ID
- source object ID
- source object type
- relationship type
- target object ID
- target object type
- strength or priority
- notes

## Example Matrix
| Relationship ID | Source Object ID | Source Type | Relationship Type | Target Object ID | Target Type | Priority | Notes |
|---|---|---|---|---|---|---|---|
|  |  | repo | contains |  | component | high / medium / low |  |
|  |  | concept | adapts_into |  | product |  |  |
|  |  | storyline | packages_as |  | media_asset |  |  |
|  |  | learning_module | teaches |  | concept |  |  |
|  |  | report_asset | reports_on |  | product |  |  |

## Best Practices
- keep relationship types simple and reusable
- prefer explicit mapping over implied relationships
- use priority to identify the strongest or most important links first
- update relationships whenever major inventory objects are added or revised

## Future Extensions
- relationship register template
- relationship dashboard cards
- reuse heatmap
