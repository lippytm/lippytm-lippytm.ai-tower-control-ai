# Entity Master Register Specification

## Purpose
The Entity Master Register is the canonical reference for all legal entities, internal operating units, projects, cost centers, platforms, bots, and related reporting relationships used across the lippytm Business of Businesses ecosystem.

Its purpose is to make monthly operations, accountability reporting, tax-support reporting, intercompany tracking, dashboard views, and professional handoff easier and more consistent.

This register is a governance and accounting-support tool. It does not replace formal legal, accounting, or tax records.

## Goals
- maintain one trusted list of entities and related units
- assign stable identifiers across reports and workflows
- connect entities to tax, accounting, CRM, repo, and cost-center structures
- improve consistency across dashboards and templates
- support parent/child and affiliate relationships
- support professional review packet assembly

## Scope
The register may include:
- legal business entities
- internal operating units
- brands or initiatives
- projects and programs
- repositories
- platforms and software systems
- bots / agents
- cost centers
- related-party units where relevant to reporting

## Core Design Principle
Every meaningful reporting object should map back to one or more stable IDs from this register.

Examples:
- entity ID
- cost center ID
- repo ID
- platform ID
- bot ID
- document owner ID
- intercompany relationship ID

## Required Fields for Legal Entities
Each legal entity record should include:
- `entity_id`
- `legal_name`
- `display_name`
- `entity_type`
- `status`
- `formation_jurisdiction`
- `tax_year_basis`
- `accounting_method`
- `return_type`
- `ein_or_internal_reference`
- `parent_entity_id` if any
- `primary_cost_center_ids`
- `primary_repo_ids`
- `primary_platform_ids`
- `owner_or_responsible_party`
- `notes`

## Optional Fields for Internal Units
Internal or non-legal units may include:
- `unit_id`
- `unit_type`
- `linked_entity_id`
- `cost_center_id`
- `reporting_owner`
- `operational_status`
- `notes`

## Suggested Categories
### Entity Types
- LLC
- sole_proprietorship
- partnership
- corporation
- nonprofit
- internal_unit
- project_unit
- brand_unit

### Unit Types
- repo
- platform
- bot
- crm_workflow
- cost_center
- dashboard
- reporting_packet

### Status Values
- active
- inactive
- planned
- archived
- under_review

## Relationship Tracking
Each entity or unit may also track relationships such as:
- parent / child
- affiliate
- shared service provider
- revenue source relationship
- intercompany transfer relationship
- cost allocation relationship
- CRM ownership relationship

## Recommended ID Format
Use stable, human-readable IDs where practical.

Examples:
- `ENT-001`
- `CC-CRM-MKT`
- `REPO-LIPPYTM-AI`
- `PLAT-MYCLAW`
- `BOT-CHAT-001`
- `REL-INTERCO-001`

## Suggested Example Record Shape
```json
{
  "entity_id": "ENT-001",
  "legal_name": "Example Entity LLC",
  "display_name": "Example Entity",
  "entity_type": "LLC",
  "status": "active",
  "formation_jurisdiction": "Nevada",
  "tax_year_basis": "calendar",
  "accounting_method": "cash",
  "return_type": "Schedule C / 1065 / 1120S / other",
  "ein_or_internal_reference": "internal-only",
  "parent_entity_id": null,
  "primary_cost_center_ids": ["CC-AI-OPS"],
  "primary_repo_ids": ["REPO-LIPPYTM-AI"],
  "primary_platform_ids": ["PLAT-MYCLAW", "PLAT-OPENAI"],
  "owner_or_responsible_party": "Owner",
  "notes": ""
}
```

## Operating Rules
- assign each legal entity one canonical ID
- do not recycle IDs after archival
- record historical status changes rather than deleting records
- keep entity-level and internal-unit records distinct but linked
- update the register before introducing new reporting structures where possible

## Integrations
The Entity Master Register should be referenced by:
- tax return audit reports
- internal controls checklists
- intercompany reconciliations
- cost-center allocations
- document indexes
- CRM-to-revenue traceability records
- dashboards and review packets

## Best Practices
- keep one owner responsible for register hygiene
- use the same IDs everywhere
- separate confidential identifiers from public or repo-shareable labels where needed
- map every repo and platform to at least one entity or unit record
- keep historical notes on restructures, renames, and reporting changes

## Future Extensions
- entity master template file
- unit master template file
- relationship register
- repo-to-entity mapping table
- platform-to-cost-center mapping table
- dashboard integration spec
