# Tax Dashboard Requirements

## Purpose
This document defines requirements for dashboards that summarize tax-support reporting, accounting accountability, audit readiness, exceptions, and multi-entity status across the Business of Businesses ecosystem.

Dashboards should improve visibility and follow-up, but they should not replace detailed reports, supporting documentation, or professional review.

## Dashboard Goals
- show status at a glance
- surface unresolved exceptions quickly
- summarize entity-by-entity readiness
- track document completeness
- support monthly, quarterly, and year-end review
- support management decisions without hiding audit detail

## Core Views
### 1. Entity Readiness View
For each entity show:
- reporting period
- review status
- reconciliation status
- document completeness status
- exception count by severity
- professional review needed flag

### 2. Exception Queue View
Show:
- open exceptions
- severity
- owner
- due date or target resolution date
- linked report ID
- linked entity
- linked section

### 3. Document Completeness View
Show:
- missing receipts
- missing bank statements
- missing payroll support
- missing contractor documents
- missing prior return references

### 4. Cost-Center View
Show:
- revenue by cost center
- expense by cost center
- software/platform spend
- CRM and bot costs
- development costs
- education / entertainment cost buckets where used

### 5. Multi-Entity Consolidation View
Show:
- entities included
- intercompany issues count
- allocations pending review
- consolidated exceptions
- cross-entity reconciliation status

## Suggested Dashboard Metrics
- entity count
- reports in draft / review / archive
- total open exceptions
- critical exceptions count
- missing document count
- reconciled bank accounts count
- unreconciled differences amount
- intercompany mismatches count
- cost-center totals
- professional review pending count

## Recommended Filters
- reporting period
- entity
- status
- severity
- cost center
- exception category
- reviewer
- platform or repo

## Source Data Requirements
Dashboard data should come from structured sources such as:
- Tax Return Audit Report objects
- exception registers
- supporting document indexes
- reconciliation logs
- cost-center allocation files
- intercompany reconciliation files

## UX Principles
- keep summary cards linked to detailed records
- never hide unresolved critical issues behind aggregate totals
- distinguish draft data from reviewed data visually
- preserve entity-level drilldown
- show when data was last refreshed

## Guardrails
- dashboards should not imply final tax conclusions
- reviewed and unreviewed data must be distinguishable
- estimates should be labeled clearly
- AI-generated dashboard narratives require human review before external use

## Future Extensions
- monthly close scorecard
- year-end readiness score
- document request queue integration
- MyClaw follow-up task integration
- export-ready review packet builder
