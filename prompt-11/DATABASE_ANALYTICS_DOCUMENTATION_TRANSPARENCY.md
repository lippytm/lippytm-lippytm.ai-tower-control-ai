# Database, Analytics, Documentation, and Transparency Model

Prompt #11 needs durable records so repos, products, services, projects, platforms, and AI-assisted workflows can be reviewed and improved.

## Purpose

This model defines what should be tracked, where it should live, and how it should support better decisions.

## Record Types

```yaml
record_types:
  repo_record: repository status and metadata
  task_record: issue, PR, or work item
  product_record: product or offer details
  service_record: service process and delivery notes
  platform_record: platform purpose and integrations
  sandbox_record: test result and decision
  quality_record: review score and validation notes
  risk_record: risk level and approval notes
  improvement_record: improvement proposal and result
  transparency_record: what changed and why
```

## Suggested Storage Layers

### GitHub

Use GitHub for:

- issues
- PRs
- docs
- workflows
- dashboards
- decision records
- repo registry

### Markdown Files

Use markdown for:

- human-readable docs
- project profiles
- runbooks
- quality checklists
- transparency reports

### YAML Files

Use YAML for:

- registries
- task models
- engine profiles
- swarm profiles
- dashboards that may later become machine-readable

### Future Database

A future database can store:

- repo metadata
- product metadata
- task status
- support requests
- analytics events
- customer or lead records when appropriate and reviewed

## Analytics Questions

Track answers to:

1. Which repos are active?
2. Which repos are blocked?
3. Which products are closest to launch?
4. Which services can create revenue soon?
5. Which workflows save time?
6. Which docs are missing?
7. Which ideas repeat often?
8. Which templates are reusable?
9. Which tasks are stuck?
10. Which next action has the highest value?

## Transparency Report

```yaml
transparency_report:
  id: TR-0001
  date: YYYY-MM-DD
  scope: repo|product|service|platform|workflow|portfolio
  what_changed: null
  why_it_changed: null
  evidence: []
  risks: []
  owner_decisions: []
  validation: []
  next_action: null
```

## Documentation Rule

If a change matters, document:

- what changed
- why it changed
- where it changed
- how it was checked
- what happens next

## Principle

The system improves when memory is organized, evidence is visible, and decisions can be reviewed later.
