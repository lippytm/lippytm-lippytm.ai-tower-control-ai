# Tax Return Audit Report Specification

## Purpose
The **Tax Return Audit Report** is a standardized internal reporting framework for the lippytm Business of Businesses ecosystem. It is designed to support accounting organization, accountability, audit preparation, document traceability, multi-entity reporting, and year-end tax package review.

This specification is meant to help structure information for internal use, development workflows, dashboards, bots, CRM follow-up, and human review. It is **not** a substitute for professional advice from a CPA, EA, accountant, tax preparer, or tax attorney.

## Goals
- improve accounting accountability
- create audit-ready summaries
- support tax return preparation review
- connect source transactions to reporting outputs
- support entity-by-entity and consolidated reporting
- surface exceptions early
- improve documentation discipline across business systems
- support flexible integration with bots, dashboards, and repository workflows

## Intended Users
- business owner / operator
- internal reviewer
- bookkeeper or accounting support person
- accountant / CPA / tax preparer during review
- repo governance and control-tower workflows
- AI-assisted reporting systems operating under human review

## Report Status Levels
Each report should include one of the following statuses:
- `draft`
- `in_review`
- `internally_reviewed`
- `awaiting_professional_review`
- `professionally_reviewed`
- `final_archive`

## Core Reporting Principles
1. **Traceability**
   Every major figure should be traceable to a source system, document, reconciliation, or supporting note.

2. **Entity clarity**
   Every report must identify the reporting entity clearly, including legal structure and reporting period.

3. **Boundary clarity**
   The report must distinguish confirmed values, estimates, assumptions, open questions, and items needing professional review.

4. **Exception visibility**
   Issues and inconsistencies must be listed explicitly, not buried in notes.

5. **Multi-entity readiness**
   The structure must work for a single business, parent-child structures, and consolidated Business of Businesses reporting.

## Required Metadata
Every report should include:
- report title
- report ID or internal reference
- entity name
- entity type / legal structure
- EIN or internal entity ID if appropriate
- reporting period start and end
- tax year
- return type
- accounting method
- prepared by
- reviewed by
- review status
- last updated timestamp
- source systems used
- confidentiality note

## Required Sections
### 1. Reporting Metadata
Defines the entity, tax year, accounting basis, preparer, reviewer, and review status.

### 2. Revenue Summary
Should include:
- gross receipts
- sales or service revenue
- other income
- non-operating income if tracked
- reconciliation notes to source systems

### 3. Expense Summary
Should include grouped expense categories such as:
- cost of goods sold if applicable
- contractor payments
- payroll
- software and subscriptions
- CRM / marketing
- professional services
- office / supplies / travel if applicable
- other operating expenses

### 4. Balance Sheet and Asset Checkpoints
Should include:
- bank and cash balances
- liabilities overview
- owner equity checkpoints
- major fixed asset changes
- depreciation notes
- loans and advances

### 5. Owner / Equity / Intercompany Activity
Should include:
- owner draws or distributions
- owner contributions
- loans to or from owner
- intercompany transfers
- related-party transactions

### 6. Payroll and Contractor Review
Should include:
- payroll totals
- contractor totals
- documentation status
- missing tax form issues
- payroll backup references

### 7. Sales Tax / Indirect Tax Notes
Where relevant, include:
- tax collected
- jurisdiction notes
- filing status notes
- unresolved collection or remittance questions

### 8. Adjustments and Reconciliations
Should include:
- book-to-report adjustments
- accrual/cash method notes
- year-end corrections
- unresolved reconciliation differences

### 9. Supporting Documents Index
Should reference supporting materials such as:
- bank statements
- receipts
- invoices
- payroll reports
- 1099/W-2 support
- contracts
- prior return reference docs
- depreciation schedules

### 10. Exception Register
Should identify:
- issue ID
- severity
- category
- description
- affected amount if known
- owner / reviewer action required
- status

### 11. Review and Escalation Notes
Should include:
- open questions
- assumptions used
- items requiring CPA review
- items requiring tax-attorney review
- items requiring business-owner decision

## Supporting Document Reference Scheme
Use a consistent internal reference pattern such as:
- `BANK-2026-01-001`
- `RECEIPT-2026-02-014`
- `PAYROLL-2026-Q1-001`
- `CONTRACT-2026-003`
- `RETURN-2025-FED-001`

This improves traceability across repositories, folders, and dashboards.

## Source Systems
Possible source systems may include:
- bank and card exports
- bookkeeping software
- invoice systems
- CRM systems
- payroll systems
- contractor payment exports
- subscription/platform billing statements
- GitHub, bot, and software platform cost records
- manually maintained supporting schedules

## Review Boundaries
This reporting framework:
- supports organization and accountability
- supports internal controls and audit preparation
- supports human review and collaboration with professionals
- does not replace professional tax determination or legal interpretation

## Suggested Export Formats
- Markdown for repository-native versioning
- JSON for workflows and dashboards
- CSV extracts for line-item review
- PDF or DOCX exports for human review packets
- summarized dashboard cards for monthly or quarterly accountability review

## Suggested Integrations
- control-tower governance dashboards
- finance/accounting repos
- legal-policy repo disclaimers and review boundaries
- MyClaw follow-up workflows for missing documents
- AI drafting tools for exception summaries under human review

## Minimum Signoff Workflow
1. preparer drafts report
2. internal reviewer checks completeness and exceptions
3. unresolved items are flagged for professional review where needed
4. approved version is archived with timestamp and supporting references

## Future Extensions
- automated exception scoring
- monthly close reporting views
- consolidated entity dashboards
- CRM-to-revenue traceability panels
- repo-level cost-center rollups
- AI-assisted narrative summaries with review gates
