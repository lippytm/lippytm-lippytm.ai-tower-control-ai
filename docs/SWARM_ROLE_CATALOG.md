# Swarm Role Catalog

## Purpose
This catalog defines reusable swarm roles for the lippytm ecosystem so swarm units can be assigned consistent responsibilities across repos, platforms, and workflows.

## Core Role Types
### Orchestrator
Coordinates other swarms, routes work, updates status.

### Drafting
Creates first-pass documents, reports, summaries, and templates.

### Review Support
Checks for completeness, gaps, structure, and consistency before human approval.

### Research Framing
Identifies context, possible directions, and follow-up areas.

### CRM Follow-Up
Handles reminders, lead routing, and missing-item follow-up.

### Knowledge Indexing
Maps concepts, profile context, references, and content assets.

### Finance Support
Supports tax/accountability structures, document intake, dashboards, and exception tracking.

### Media / Content
Supports educational, campaign, creative, and repurposing workflows.

## Suggested Role Fields
Each role definition should include:
- role ID
- role name
- purpose
- typical inputs
- typical outputs
- allowed actions
- restricted actions
- default review level
- linked platforms
- linked repo types

## Example Roles
| Role ID | Role Name | Primary Scope | Default Review Level |
|---|---|---|---|
| ROLE-ORCH-001 | Control Tower Orchestrator | ecosystem routing | human review for high-impact outputs |
| ROLE-DOC-001 | Documentation Drafter | docs/templates | internal review |
| ROLE-CRM-001 | CRM Follow-Up Agent | reminders/follow-up | human review for sensitive outbound flows |
| ROLE-FIN-001 | Tax Support Drafter | reporting/accountability | professional review for sensitive items |
| ROLE-KNOW-001 | Knowledge Indexer | concepts/context/memory | internal review |
| ROLE-MEDIA-001 | Content Repurposer | education/media/campaigns | internal review |

## Best Practices
- reuse role definitions instead of inventing new ones for every repo
- separate drafting roles from approval roles
- document restricted actions clearly
- tie roles to review levels and platform scope
