# Review Action and Iteration Layer Model

## Purpose
This document defines the next operating layer after scenario runs and use-case reviews.

## Core Goal
Turn review outputs into named action records, improvement decisions, and scenario iterations so the system captures not only review, but also follow-through.

## Layer Structure
### Layer 1 — Scenario Run
A concrete execution path for a use case.

### Layer 2 — Use-Case Review
A review of what the scenario showed.

### Layer 3 — Review Action Record
A record for the immediate action chosen after review.

### Layer 4 — Improvement Decision Record
A record for the improvement decision and why it was chosen.

### Layer 5 — Scenario Iteration Record
A record for the next scenario wave shaped by the review and decision.

## Best Practices
- create action and decision records after a review exists
- keep one clear action path per record when possible
- tie scenario iterations back to the parent review and decision
- update coverage trackers whenever a scope gains one of these records
