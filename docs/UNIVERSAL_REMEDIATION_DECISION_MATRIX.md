# Universal Remediation Decision Matrix

## Purpose
This document helps route errors, degradations, and weak signals into the right remediation path across the lippytm ecosystem.

## Decision Dimensions
For each failure evaluate:
- severity
- scope size
- repeatability
- platform impact
- packaging impact
- documentation impact
- reuse impact
- best sandbox target
- best promotion target

## Example Matrix
| Failure Family | Severity | Repeatability | Best First Response | Best Sandbox Target | Best Promotion Target | Notes |
|---|---|---|---|---|---|---|
| workflow gap | medium / high | high / medium / low | classify and contain | workflow sandbox | workflow builder / CRM toolkit | strong candidate for reuse |
| builder gap | medium / high | high / medium / low | score and refine | reasoning or diagnostics sandbox | builder record / bundle | often blocks multiple scopes |
| documentation gap | low / medium / high | high / medium / low | patch docs and trackers | reasoning sandbox if ambiguity is high | template / tracker / note | often easy win |
| sandbox failure | medium / high | high / medium / low | rerun and compare | same sandbox or cross-sandbox test | repeatability asset / promotion block | preserve lineage |
| platform-fit gap | medium / high | high / medium / low | compare surfaces | platform sandbox | platform packaging update | matrix support useful |
| packaging gap | medium / high | high / medium / low | clarify target output | multimedia or workflow sandbox | application / bundle / AI solution package | often affects monetization too |

## Best Practices
- route failures into the smallest effective remediation path first
- prefer reuse-aware fixes over isolated patching when practical
- block promotion when repeatability and documentation are weak
- use the matrix together with failure packets, scorecards, and health loops
