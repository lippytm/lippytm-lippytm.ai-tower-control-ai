# CRM to Revenue Traceability

## Purpose
This document defines a practical traceability model for connecting CRM activity, lead sources, campaigns, bots, and customer workflows to revenue reporting and accountability summaries.

This improves business visibility, supports management reporting, and helps the broader tax-support framework tie revenue back to operational activity without replacing formal accounting records.

## Goals
- connect lead source to revenue source where feasible
- improve accountability across CRM, bots, and business operations
- support cost-center reporting and profitability analysis
- help validate completeness of revenue pipelines
- support internal audit trail and management review

## Core Idea
Every meaningful revenue event should be traceable through some combination of:
- lead source
- campaign source
- CRM workflow
- bot or agent interaction
- platform or repo touchpoint
- entity receiving revenue
- supporting accounting entry or document reference

## Recommended Traceability Fields
For each revenue-related record track as many of these as practical:
- revenue event ID
- customer or account ID
- lead source
- campaign source
- CRM workflow ID
- bot or agent ID
- platform or repo source
- entity name
- product or service category
- booking date
- amount
- invoice or receipt reference
- accounting entry reference
- reconciliation status
- notes

## Example Mapping Model
| Revenue Event ID | Lead Source | CRM Workflow | Bot / Agent | Platform / Repo | Entity | Amount | Accounting Ref | Notes |
|---|---|---|---|---|---|---:|---|---|
|  | organic / affiliate / social / ad / referral / direct |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |

## Suggested Lead / Revenue Source Categories
- direct referral
- affiliate
- organic search
- social media
- email campaign
- chatbot or agent workflow
- educational content funnel
- entertainment/media funnel
- paid advertising
- marketplace / third-party platform

## Business of Businesses Applications
This traceability model can be used to:
- compare CRM investment to revenue outcomes
- map bot-assisted workflows to sales
- analyze which repos or platforms support revenue generation
- support cost-center and management reporting
- improve revenue completeness review during close cycles

## Guardrails
- do not treat CRM attribution as a substitute for accounting records
- keep revenue traceability separate from final tax determination
- preserve privacy and data-minimization practices
- mark estimated attribution separately from confirmed accounting entries

## Best Practices
- standardize IDs across CRM, bots, dashboards, and accounting records where possible
- preserve a link from summary dashboards back to detailed evidence
- treat missing attribution as an operational issue, not automatically an accounting error
- use AI to summarize attribution trends only after source data is reviewed
- align lead-source categories across systems to reduce reporting noise

## Future Extensions
- campaign-to-revenue scorecards
- repo/platform contribution analysis
- MyClaw document and lead-follow-up integration
- dashboard drilldowns by entity, cost center, and campaign
