# Tax Data Schema

## Purpose
This document defines a flexible data model for the Tax Return Audit Report Framework so it can be used in templates, dashboards, bots, workflows, exports, and future automation systems.

This schema is intended for internal reporting support and structured review. It does not determine tax treatment by itself.

## Design Goals
- support single-entity and multi-entity reporting
- support document traceability
- support exception handling and review workflows
- support integration with AI-assisted summarization under human review
- support future JSON, API, database, or spreadsheet mappings

## Top-Level Object
```json
{
  "report_id": "TRAR-2026-001",
  "entity_name": "Example Entity LLC",
  "entity_type": "LLC",
  "ein_or_internal_id": "XX-XXXXXXX or internal reference",
  "tax_year": 2025,
  "reporting_period_start": "2025-01-01",
  "reporting_period_end": "2025-12-31",
  "return_type": "1120 / 1120S / 1065 / Schedule C / other",
  "accounting_method": "cash / accrual / hybrid",
  "prepared_by": "name or role",
  "reviewed_by": "name or role",
  "review_status": "draft",
  "source_systems": [],
  "financial_summary": {},
  "reconciliations": [],
  "exceptions": [],
  "supporting_documents": [],
  "audit_trail_refs": [],
  "multi_entity": {},
  "notes": ""
}
```

## Suggested Field Definitions

### Metadata Fields
- `report_id`: unique internal report reference
- `entity_name`: legal or internal entity name
- `entity_type`: LLC, sole proprietorship, corporation, partnership, etc.
- `ein_or_internal_id`: EIN or internal tracking ID
- `tax_year`: numeric tax year for the report
- `reporting_period_start`: ISO date
- `reporting_period_end`: ISO date
- `return_type`: expected tax return type
- `accounting_method`: cash, accrual, hybrid
- `prepared_by`: preparer name or role
- `reviewed_by`: reviewer name or role
- `review_status`: draft, in_review, internally_reviewed, awaiting_professional_review, professionally_reviewed, final_archive
- `source_systems`: array of system identifiers or names

### Financial Summary Object
```json
{
  "gross_revenue": 0,
  "other_income": 0,
  "cost_of_goods_sold": 0,
  "operating_expenses": 0,
  "payroll_total": 0,
  "contractor_total": 0,
  "owner_distributions": 0,
  "owner_contributions": 0,
  "sales_tax_collected": 0,
  "fixed_assets_changes": 0,
  "net_book_result": 0,
  "reconciliation_status": "not_started"
}
```

### Reconciliation Object
```json
{
  "reconciliation_id": "REC-001",
  "category": "bank / revenue / expense / payroll / intercompany / fixed_assets",
  "status": "open / matched / adjusted / escalated",
  "difference_amount": 0,
  "source_ref": "BANK-2025-12-001",
  "note": ""
}
```

### Exception Object
```json
{
  "exception_id": "EX-001",
  "severity": "info",
  "category": "missing_receipt",
  "description": "",
  "affected_amount": 0,
  "status": "open / in_review / resolved / escalated",
  "owner": "",
  "action_required": "",
  "supporting_ref": "",
  "professional_review_needed": false
}
```

### Supporting Document Object
```json
{
  "document_ref": "RECEIPT-2025-042",
  "document_type": "receipt / invoice / bank_statement / payroll_report / contract / prior_return",
  "description": "",
  "location": "repo path / folder / URL / vault reference",
  "reviewed": false
}
```

### Audit Trail Reference Object
```json
{
  "ref_id": "AUD-001",
  "source_type": "transaction / reconciliation / schedule / reviewer_note / bot_log",
  "source_location": "",
  "linked_section": "Revenue Summary",
  "note": ""
}
```

### Multi-Entity Object
```json
{
  "parent_entity": "",
  "related_entities": [],
  "consolidated": false,
  "allocation_method": "",
  "intercompany_eliminations_needed": false,
  "cross_entity_notes": ""
}
```

## Suggested Enumerations
### Review Status
- `draft`
- `in_review`
- `internally_reviewed`
- `awaiting_professional_review`
- `professionally_reviewed`
- `final_archive`

### Reconciliation Status
- `not_started`
- `open`
- `matched`
- `adjusted`
- `escalated`

### Exception Severity
- `info`
- `review`
- `warning`
- `critical`

### Exception Categories
- `missing_receipt`
- `uncategorized_transaction`
- `personal_business_mixing_risk`
- `reconciliation_mismatch`
- `unsupported_deduction`
- `missing_contractor_info`
- `missing_payroll_backup`
- `intercompany_mismatch`
- `prior_return_inconsistency`
- `sales_tax_uncertainty`
- `owner_draw_anomaly`
- `fixed_asset_uncertainty`

## Best Practices
- keep human-readable report and machine-readable schema aligned
- use stable reference IDs for documents and exceptions
- allow local extensions by entity or project without breaking the core model
- do not let bots auto-resolve tax-sensitive exceptions without human review
- track what is confirmed versus estimated
- preserve archival versions of finalized report objects

## Future Extensions
- JSON Schema version
- API payload spec
- CSV export mapping
- dashboard card mapping
- workflow validation rules
- monthly close and quarterly tax-support variants
