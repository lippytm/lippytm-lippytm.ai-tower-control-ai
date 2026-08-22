# P-011-CRM-001 — CRM Control Tower Registry and State Architecture

**Canonical source:** `lippytm/Prompt-11-`  
**Status:** Q2 architecture contract

## Registry families

The Control Tower coordinates stable records for:

- parties and organizations;
- roles, relationships, and identity-resolution candidates;
- contact tokens and channel preferences;
- consent, suppression, retention, and deletion requests;
- interactions and touchpoints;
- customer, learner, creator, affiliate, mentor, partner, community, and franchise journeys;
- opportunities, products, memberships, and renewals;
- learning goals, skills, lessons, assessments, projects, and verified outcomes;
- support cases, complaints, refunds, corrections, and service levels;
- campaigns, referrals, attribution, revenue references, and cost references;
- feedback, accessibility, fairness, environmental, and community outcomes;
- work packets, missions, agents, swarms, platforms, connectors, incidents, risks, gates, approvals, audits, and retirement.

## State machines

### Party lifecycle

`prospective → active → restricted → suppressed → correction_pending → retired → archived`

A party record is never silently deleted or merged when evidence, consent, legal hold, correction, or audit requirements apply.

### Consent lifecycle

`unknown → pending → granted → changed → withdrawn → expired → archived`

Only evidence-backed authorized actions may change consent. An AI cannot grant consent for a person.

### Journey lifecycle

`discovery → learning_or_qualification → active_service → success_review → retention_or_expansion → completed → retired`

### Support case

`new → triaged → assigned → in_progress → waiting → resolved → verified → closed → corrected_or_reopened`

### Social content

`draft → QA_review → approved → ready_to_publish → published → monitored → corrected_or_retired`

### Provider adapter

`proposed → architecture_only → sandbox → tested → conditionally_approved → bounded_operational → suspended_or_retired`

## Proposed service boundaries

Future authenticated endpoints may include:

- party and relationship registry;
- consent and suppression check;
- journey and mission routing;
- learning and support records;
- social-content passports;
- provider-adapter passports;
- data-quality and gate evaluation;
- correction and retirement propagation;
- audit and transparency events.

These are architecture boundaries, not currently deployed APIs.

## Release evaluation

Release is blocked when:

- Q4 is absent;
- a critical gate is not passed;
- RiskGate is Red;
- HumanApprovalGate is not approved by an identified authorized human;
- provider permissions, consent, rights, accessibility, security, correction, or rollback evidence is missing.

A quality score cannot override a failed critical gate.

## Dashboard views

- Relationship and consent health
- Learner and customer success
- Support and SLA risk
- Opportunity and attribution integrity
- Social publishing queue
- Platform and connector certification
- Data quality and duplicate review
- AI Clone, Hermes, and swarm missions
- Quality gates and human approvals
- Corrections, incidents, retirement, and archives

## Financial and high-impact boundary

The Control Tower may coordinate records and evidence. It cannot make autonomous credit, employment, housing, insurance, medical, legal, political, investment, payment, refund, contract, or asset-transfer decisions.

## Current boundary

This document is a Q2 registry contract. It does not claim a production database, live API, or complete synchronization among Airtable, HubSpot, Slack, ManyChat, Zo, social platforms, and future systems.
