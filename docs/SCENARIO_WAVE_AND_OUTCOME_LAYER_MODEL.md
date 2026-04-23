# Scenario Wave and Outcome Layer Model

## Purpose
This document defines the next operating layer after review actions, improvement decisions, and scenario iterations.

## Core Goal
Capture how iteration plans become named scenario waves, how decisions produce outcomes, and how one iteration compares against another.

## Layer Structure
### Layer 1 — Scenario Iteration
A named next-run plan for a scope.

### Layer 2 — Scenario Wave Record
A record for one named wave of scenario execution.

### Layer 3 — Decision Outcome Record
A record for what the decision actually produced.

### Layer 4 — Iteration Comparison Record
A record comparing the current iteration wave against a prior one.

## Best Practices
- create a scenario wave after an iteration record exists
- create an outcome record after a decision and wave exist
- create comparison records when a new wave can be compared to an earlier path
- update coverage trackers whenever a scope gains one of these records
