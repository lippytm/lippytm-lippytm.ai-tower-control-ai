# Entity Master Register Template

> Canonical registry template for legal entities, internal units, platforms, repos, bots, cost centers, and reporting relationships.

---

## 1. Legal Entities
| Entity ID | Legal Name | Display Name | Entity Type | Status | Jurisdiction | Tax Year Basis | Accounting Method | Return Type | Parent Entity ID | Owner / Responsible Party | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ENT-001 |  |  | LLC / sole_proprietorship / partnership / corporation / other | active / inactive / planned / archived |  | calendar / fiscal | cash / accrual / hybrid |  |  |  |  |
| ENT-002 |  |  |  |  |  |  |  |  |  |  |  |

## 2. Internal Units / Projects / Brands
| Unit ID | Unit Name | Unit Type | Linked Entity ID | Cost Center ID | Status | Reporting Owner | Notes |
|---|---|---|---|---|---|---|---|
| UNIT-001 |  | internal_unit / project_unit / brand_unit / dashboard / reporting_packet |  |  |  |  |  |
| UNIT-002 |  |  |  |  |  |  |  |

## 3. Repositories
| Repo ID | Repository Name | Linked Entity ID | Linked Cost Center ID | Status | Owner | Notes |
|---|---|---|---|---|---|---|
| REPO-001 |  |  |  | active / archived / planned |  |  |
| REPO-002 |  |  |  |  |  |  |

## 4. Platforms / Systems
| Platform ID | Platform Name | Linked Entity ID | Linked Cost Center ID | Platform Type | Status | Notes |
|---|---|---|---|---|---|---|
| PLAT-001 | MyClaw |  |  | CRM / AI / hosting / accounting / automation / other | active / inactive / planned |  |
| PLAT-002 |  |  |  |  |  |  |

## 5. Bots / Agents / Workflows
| Bot ID | Bot / Workflow Name | Linked Entity ID | Linked Platform ID | Linked Cost Center ID | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| BOT-001 |  |  |  |  | active / paused / planned / archived |  |  |
| BOT-002 |  |  |  |  |  |  |  |

## 6. Cost Centers
| Cost Center ID | Cost Center Name | Type | Owner | Status | Notes |
|---|---|---|---|---|---|
| CC-AI-OPS | AI Operations | operating |  | active |  |
| CC-CRM-MKT | CRM / Marketing | operating |  | active |  |
| CC-DEV-ENG | Development / Engineering | operating |  | active |  |
| CC-EDU-CONTENT | Education / Content | program |  | active |  |
| CC-ENT-MEDIA | Entertainment / Media | program |  | active |  |
| CC-ADMIN-GOV | Admin / Governance | support |  | active |  |

## 7. Relationship Register
| Relationship ID | Relationship Type | Source ID | Target ID | Status | Notes |
|---|---|---|---|---|---|
| REL-001 | parent_child / affiliate / shared_service / intercompany / allocation / crm_ownership |  |  | active / inactive |  |
| REL-002 |  |  |  |  |  |

## 8. Update Log
| Date | Updated By | Change Summary | Notes |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |

---

## Best Practices
- add new IDs before the related report cycle begins where possible
- do not delete old IDs; archive them instead
- use the same IDs across templates, dashboards, document indexes, and tax reports
- note changes in ownership, status, or mapping in the update log
