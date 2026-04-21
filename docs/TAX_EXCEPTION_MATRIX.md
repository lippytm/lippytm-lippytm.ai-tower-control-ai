# Tax Exception Matrix

## Purpose
The Tax Exception Matrix standardizes how issues are identified, scored, prioritized, reviewed, and escalated inside the Tax Return Audit Report Framework.

It helps separate minor documentation issues from major accounting or tax-risk issues and supports consistent workflows across entities, repos, bots, dashboards, and human reviewers.

## Severity Levels
### `info`
Low-risk item or note that should be tracked for completeness.

Examples:
- optional support note missing but amount is otherwise verified
- formatting inconsistency
- explanatory note needed for future clarity

### `review`
Item needs human review but is not necessarily a material problem.

Examples:
- category looks unusual
- missing non-critical documentation
- incomplete cross-reference
- inconsistent naming or coding

### `warning`
Likely important issue that could affect reporting quality, classification, documentation, or tax-return support accuracy.

Examples:
- uncategorized material transaction
- reconciliation mismatch
- missing contractor documentation
- unusual owner draw without explanation
- asset purchase without clear classification

### `critical`
High-priority item that may materially affect reporting integrity, audit readiness, or tax-return support and likely requires escalation.

Examples:
- unsupported major deduction
- personal/business mixing pattern
- unresolved large revenue mismatch
- missing payroll backup for material amounts
- significant intercompany inconsistency
- prior return inconsistency with possible tax impact

## Category Matrix
| Category | Default Severity | Typical Trigger | Typical Action |
|---|---|---|---|
| missing_receipt | review | documentation absent for supported expense | obtain support or explain |
| uncategorized_transaction | warning | transaction lacks usable category | classify and review |
| personal_business_mixing_risk | critical | personal and business use appear mixed | escalate and document |
| reconciliation_mismatch | warning | source totals do not tie | investigate and reconcile |
| unsupported_deduction | critical | deduction lacks support or rationale | escalate for review |
| missing_contractor_info | warning | contractor records incomplete | collect missing information |
| missing_payroll_backup | critical | payroll support missing for material amounts | escalate immediately |
| intercompany_mismatch | warning | entities do not agree on transfer or balance | reconcile both sides |
| prior_return_inconsistency | critical | current data conflicts with prior reporting | escalate and compare |
| sales_tax_uncertainty | warning | unclear tax collection/remittance handling | review jurisdiction rules |
| owner_draw_anomaly | warning | unusual distribution without support | confirm intent and classification |
| fixed_asset_uncertainty | review | unclear capitalization vs expense treatment | review support |
| related_party_transaction | warning | related-party activity lacks documentation | document and review |
| revenue_completeness_question | critical | deposits or sales appear incomplete | investigate source records |

## Exception Lifecycle
Recommended statuses:
- `open`
- `in_review`
- `awaiting_documents`
- `awaiting_professional_review`
- `resolved`
- `archived`

## Recommended Exception Fields
Each exception should include:
- exception ID
- severity
- category
- description
- entity
- reporting period
- affected amount if known
- linked report section
- source reference
- assigned owner
- status
- target resolution date
- professional review needed flag
- resolution note

## Escalation Guidelines
Escalate to internal reviewer when:
- item affects classification, completeness, or documentation
- item remains unresolved after initial review
- item could alter a summarized report line

Escalate to accountant / CPA / tax preparer when:
- item may affect tax treatment
- item is material or recurring
- item involves carryovers, adjustments, unusual deductions, payroll, multi-entity effects, or unclear classification

Escalate to tax attorney when:
- issue involves legal interpretation, entity treatment disputes, risk exposure, or high-stakes uncertainty beyond standard preparation support

## Materiality Considerations
Severity should consider more than dollar amount. Also consider:
- pattern frequency
- repeated control failures
- documentation weakness
- legal/regulatory sensitivity
- cross-entity impact
- public/customer-facing implications where relevant

## Best Practices
- do not downgrade an exception only because it is inconvenient
- distinguish bookkeeping cleanup from judgment-required tax questions
- keep a named owner for every open exception
- update the exception register monthly or at each close cycle
- link every exception to a report section and supporting document reference where possible
- preserve resolved exceptions for historical learning and audit trail continuity
