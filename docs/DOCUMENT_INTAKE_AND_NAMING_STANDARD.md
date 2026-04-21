# Document Intake and Naming Standard

## Purpose
This standard defines how supporting documents should be collected, named, indexed, stored, and linked to reports across the Business of Businesses accounting-accountability system.

A consistent intake standard reduces confusion, improves audit readiness, speeds monthly close, and makes professional review packets easier to assemble.

## Goals
- make supporting files easier to find
- standardize naming across periods and entities
- improve traceability from report to evidence
- reduce duplicate or missing documentation issues
- support bots, dashboards, and review workflows

## Covered Document Types
This standard may apply to:
- bank statements
- card statements
- receipts
- invoices
- payroll reports
- contractor support
- tax notices
- prior returns
- depreciation schedules
- loan documents
- contracts and agreements
- intercompany schedules
- allocation schedules
- CRM or revenue support exports

## Core Intake Principles
1. every important document gets a stable reference ID
2. naming should reflect entity, period, and document type
3. source documents should be indexed before or during review
4. missing documents should be logged as exceptions, not ignored
5. reviewed status should be trackable

## Recommended Reference ID Format
Use a format like:
- `BANK-ENT001-2026-01-001`
- `CARD-ENT001-2026-01-001`
- `RECEIPT-ENT001-2026-004`
- `INVOICE-ENT001-2026-011`
- `PAYROLL-ENT001-2026-Q1-001`
- `1099-ENT001-2026-001`
- `RETURN-ENT001-2025-FED-001`
- `ALLOC-ENT001-2026-03-001`
- `INTERCO-ENT001-ENT002-2026-02-001`

## Recommended File Naming Pattern
`<DOC_TYPE>_<ENTITY_ID>_<PERIOD>_<SEQ>_<SHORT-DESCRIPTION>`

Examples:
- `BANK_ENT-001_2026-01_001_OPERATING-CHECKING.pdf`
- `RECEIPT_ENT-001_2026-02_014_SOFTWARE-SUBSCRIPTION.pdf`
- `PAYROLL_ENT-001_2026-Q1_001_SUMMARY.pdf`
- `INTERCO_ENT-001-ENT-002_2026-03_001_SHARED-HOSTING.xlsx`

## Intake Fields to Capture
Every indexed document should capture:
- document reference ID
- document type
- linked entity ID
- linked period
- source name
- short description
- file location
- date received
- reviewed yes/no
- linked report or reconciliation ID
- notes

## Intake Workflow
### Stage 1 — Receive
Collect documents from email, uploads, scans, exports, or connected systems.

### Stage 2 — Normalize
Rename files according to the standard and assign a reference ID.

### Stage 3 — Index
Add document metadata to the supporting document index.

### Stage 4 — Link
Associate each document with the relevant report, reconciliation, exception, or allocation schedule.

### Stage 5 — Review
Mark whether the document has been reviewed and whether it is complete.

### Stage 6 — Escalate
If the document is missing, incomplete, unclear, or inconsistent, create or update an exception record.

## Suggested Storage Structure
Examples:
- `supporting-docs/<entity-id>/<year>/<month>/`
- `supporting-docs/<entity-id>/<year>/bank/`
- `supporting-docs/<entity-id>/<year>/payroll/`
- `supporting-docs/<entity-id>/<year>/contracts/`
- `supporting-docs/<entity-id>/<year>/tax/`

## Reviewed Status Values
- `not_reviewed`
- `reviewed`
- `incomplete`
- `superseded`
- `needs_follow_up`

## Best Practices
- never rely on vague filenames like `statement.pdf` or `receipt.jpg`
- use entity IDs consistently
- rename files early, not at year-end
- preserve originals where needed
- log missing documents immediately
- keep reviewed status current
- use bots to request missing files, not to guess what a missing file should show

## Future Extensions
- supporting document index template
- document intake checklist
- automated filename validator
- dashboard completeness integration
- MyClaw document request workflow integration
