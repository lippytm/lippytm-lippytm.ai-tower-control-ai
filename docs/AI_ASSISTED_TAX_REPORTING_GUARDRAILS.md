# AI-Assisted Tax Reporting Guardrails

## Purpose
This document defines guardrails for using AI systems in tax-support reporting, accounting accountability, audit summaries, exception narration, document collection workflows, and management reporting.

It is intended to help the lippytm ecosystem use AI productively while preserving clear human-review and professional-review boundaries.

## Core Principle
AI may assist with:
- summarization
- organization
- drafting
- exception highlighting
- checklist support
- document indexing
- workflow follow-up
- dashboard narration

AI should **not** be treated as the final authority for tax treatment, legal interpretation, or professional judgment.

## Approved AI Use Cases
### 1. Draft Summaries
AI may draft:
- executive summaries
- exception descriptions
- review notes
- monthly accountability summaries
- document request lists

### 2. Structural Assistance
AI may help:
- fill templates from already-reviewed data
- organize supporting document references
- standardize naming and reference IDs
- convert report data between markdown, JSON, CSV, and dashboard-friendly formats

### 3. Follow-Up Workflows
AI-assisted bots may:
- ask for missing receipts or documents
- remind users to complete reconciliations
- flag incomplete checklist items
- route unresolved exceptions to a human review queue

## Restricted or High-Risk Use Cases
AI must not independently:
- determine final tax positions
- represent itself as providing legal or tax advice
- finalize unresolved classification or deduction issues
- override professional review requirements
- auto-close critical exceptions without human review
- create false certainty where source support is missing

## Required Human Review Triggers
Human review is required when:
- an exception is marked `warning` or `critical`
- data is incomplete or estimated
- personal/business mixing risk appears
- intercompany inconsistencies exist
- payroll or contractor support is missing
- a deduction or classification is unclear
- a prior-year inconsistency appears
- a professional review flag is set

## Professional Review Triggers
Escalate to a CPA, tax preparer, EA, accountant, or tax attorney when:
- tax treatment is uncertain
- the matter is material
- legal interpretation may be involved
- the issue spans multiple entities or jurisdictions
- payroll, sales tax, owner activity, or related-party treatment is unclear

## Prompting and Data-Handling Guardrails
- avoid sharing unnecessary sensitive identifiers in prompts
- minimize private data when drafting summaries
- distinguish confirmed facts from assumptions
- require citation or source-reference fields where feasible
- keep prompts and outputs tied to report IDs and review status
- preserve archival versions of reviewed outputs

## Output Labeling Guidance
AI-assisted outputs should be labeled where appropriate as:
- draft
- AI-assisted summary
- pending human review
- pending professional review

## Example Workflow Pattern
1. human prepares or imports structured report data
2. AI drafts summary, checklist notes, or exception narrative
3. human reviews and edits output
4. unresolved items are escalated
5. approved version is archived with references

## Platform-Neutral Application
These guardrails should apply across:
- ChatGPT / OpenAI
- Claude
- Grok
- MyClaw workflows
- GitHub Copilot where code or automation supports reporting
- future bots, dashboards, and orchestration systems

## Best Practices
- use AI as a force multiplier, not a replacement for judgment
- require human signoff on customer-facing or professional-facing summaries
- preserve source references and document links
- separate organizational support from tax conclusions
- train bots to ask for missing evidence instead of guessing
- keep review status visible at all times
