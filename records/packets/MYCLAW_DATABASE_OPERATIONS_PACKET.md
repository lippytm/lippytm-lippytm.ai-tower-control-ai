# Database Operations Packet — MyClaw.lippytm.AI-

## Metadata
- Packet ID: DBPK-MYCLAW-001
- Name: MyClaw Database Operations Packet
- Linked Scope IDs: REPO-MYCLAW-LIPPYTM-AI, BLD-MYCLAW-WORKFLOW-001
- Status: active

## Database Scope
- Object domain: CRM and workflow records
- Main records involved: intake records, follow-up records, status records, reminder records
- Main risks: missing state changes, missing follow-up links, weak sync paths
- Review level: internal

## Operations
- Read paths: intake state, follow-up state, current workflow stage
- Write paths: status updates, reminder updates, workflow notes
- Sync paths: repo records to CRM flow records
- Validation checks: record completeness, state consistency, missing-link checks

## Notes
- Assumptions: workflow quality depends on clean status and follow-up records.
- Limits: live sync lineage is still limited.
- Next update: add a linked workflow sandbox record.
