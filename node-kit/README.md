# Prompt #11 Repo Node Kit

The Repo Node Kit is the standard starter pack for connecting each repository to the Prompt #11 Control Tower.

## Purpose

Use this kit to make every repo easier to understand, review, improve, maintain, and coordinate.

## Files

```text
PROJECT.md
QUALITY.md
RISK_GATE.md
AGENT_MODE.md
PROMPT_11_NODE.md
.github/workflows/fleet-pulse.yml
.github/workflows/node-quality-gate.yml
```

## How to Apply

1. Copy the node kit into a target repo.
2. Fill in the repo-specific details.
3. Add the repo to `fleet/repos.yml` in the Control Tower.
4. Create a GitHub issue for the node setup.
5. Open a small PR.
6. Run QA checks.
7. Review RiskGate if required.
8. Update the fleet dashboard.

## Minimum Viable Node

A repo becomes a minimum viable Prompt #11 node when it has:

- project purpose
- quality standard
- RiskGate checklist
- Agent Mode rules
- node identity
- next action
- fleet registry entry

## Principle

No repo should be an isolated island. Every repo should know its purpose, status, risks, and next useful action.
