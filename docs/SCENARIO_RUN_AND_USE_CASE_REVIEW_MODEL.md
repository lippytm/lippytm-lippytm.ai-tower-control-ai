# Scenario Run and Use-Case Review Model

## Purpose
This document defines the next operating layer after use-case and execution support records.

## Core Goal
Show how use cases are exercised in named scenarios and then reviewed for improvement, reuse, and promotion value.

## Layer Structure
### Layer 1 — Use Case
A named operating use for a promoted asset stack.

### Layer 2 — Execution Support
The support record for how the use case is maintained and improved.

### Layer 3 — Scenario Run
A named scenario showing one concrete execution path for the use case.

### Layer 4 — Use-Case Review
A review record that evaluates what the scenario showed and what should improve next.

## Best Practices
- create scenario runs only after a use-case and execution support record exist
- keep scenario names concrete and tied to a scope
- connect review records back to scenario runs, use cases, and parent promoted assets
- update coverage trackers whenever a scope gains a scenario run or review record
