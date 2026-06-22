# Diagnostic Sandboxes

Diagnostic sandboxes are controlled places to test ideas, docs, workflows, templates, and repo changes before applying them broadly.

## Purpose

A sandbox lets Prompt #11 experiment safely and learn from results before scaling.

## Sandbox Types

```yaml
sandbox_types:
  docs_sandbox: test documentation and templates
  workflow_sandbox: test GitHub Actions patterns
  repo_sandbox: test repo node kit rollout
  product_sandbox: test offer packaging
  bot_sandbox: test chatbot or command flow outlines
  dashboard_sandbox: test status report formats
  learning_sandbox: test educational content
```

## Sandbox Record

```yaml
sandbox:
  id: SBX-0001
  name: Example Sandbox
  type: docs_sandbox|workflow_sandbox|repo_sandbox|product_sandbox|bot_sandbox|dashboard_sandbox|learning_sandbox
  owner: lippytm
  purpose: null
  repo: lippytm/example-repo
  test_item: null
  expected_result: null
  actual_result: null
  notes: []
  decision: keep|revise|scale|park
  next_action: null
```

## Sandbox Rules

- Test small.
- Document the expected result.
- Record what happened.
- Keep successful patterns.
- Revise unclear patterns.
- Park weak patterns.
- Scale only after review.

## Best Uses

Use sandboxes before:

- applying node kit to many repos
- launching new workflows
- packaging offers
- creating new bot flows
- changing dashboard formats
- repeating a new process across the fleet

## Principle

A sandbox reduces risk by letting the system learn before scaling.
