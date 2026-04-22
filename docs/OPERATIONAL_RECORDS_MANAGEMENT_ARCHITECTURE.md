# Operational Records Management Architecture

## Purpose
This document defines how operational records should be structured, linked, maintained, and improved across the lippytm ecosystem.

## Core Goal
Keep the growing control-tower system usable by making records easier to:
- create
- link
- review
- update
- score
- promote
- reuse

## Record Families
- builder records
- packet records
- bundle records
- sandbox records
- health-loop records
- scorecards
- coverage trackers
- remediation records

## Architecture Layers
### Layer 1 — Record Creation
Create records with stable IDs, clear scope names, and linked object references.

### Layer 2 — Record Linkage
Connect records to repos, builders, sandboxes, applications, platforms, and trackers.

### Layer 3 — Record Quality
Keep assumptions, limits, next steps, and review level visible.

### Layer 4 — Record Promotion
Move strong records into bundled assets, application packaging, implementation packets, and future-wave reuse.

### Layer 5 — Record Maintenance
Update records when scope maturity changes, when linked assets are added, and when remediation or promotion work advances.

## Best Practices
- prefer live records over only framework docs once a scope is prioritized
- keep one clear purpose per record
- link each record to at least one tracker or scorecard when practical
- update records in waves instead of letting them drift
- treat records as operating assets, not static notes

## Best Current Need
The highest-value improvement is still increasing live operational density for the major scopes already identified in coverage files.

## Future Extensions
- record refresh checklist
- record linkage scorecard
- operational density tracker
