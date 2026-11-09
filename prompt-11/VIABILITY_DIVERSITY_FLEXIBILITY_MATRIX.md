# Prompt #11 Viability, Diversity, and Flexibility Matrix

This matrix helps evaluate ideas, repositories, products, services, projects, and platforms before scaling them.

## Purpose

Prompt #11 should encourage innovation while preventing scattered, unclear, or low-value work from consuming too much attention.

Every concept should be scored for:

- viability
- diversity value
- flexibility
- revenue relevance
- technical readiness
- documentation readiness
- risk
- reuse potential

## Viability Score

```yaml
viability_score:
  problem_clarity: 0-5
  audience_clarity: 0-5
  value_proposition: 0-5
  build_feasibility: 0-5
  time_to_prototype: 0-5
  revenue_potential: 0-5
  reuse_potential: 0-5
  qa_feasibility: 0-5
  risk_manageability: 0-5
  documentation_readiness: 0-5
```

### Interpretation

```yaml
score_band:
  0-15: park_or_redefine
  16-25: research_more
  26-35: prototype_small
  36-45: high_priority_candidate
  46-50: flagship_candidate
```

## Diversity Score

Diversity means the portfolio should not depend on one product type, one platform, one tool, one audience, or one revenue source.

```yaml
diversity_score:
  different_audience: 0-5
  different_revenue_model: 0-5
  different_technical_lane: 0-5
  different_content_lane: 0-5
  different_distribution_channel: 0-5
  different_time_horizon: 0-5
```

### Diversity Lanes

- AI development tools
- business funding readiness
- bot and automation services
- publishing products
- education products
- creative entertainment systems
- affiliate/partner offers
- consulting/setup services
- internal productivity tools
- dashboards and infrastructure

## Flexibility Score

Flexibility means a concept can be reused, repackaged, repurposed, and adapted without starting over.

```yaml
flexibility_score:
  reusable_template_value: 0-5
  multi_repo_applicability: 0-5
  multi_product_applicability: 0-5
  modular_design: 0-5
  low_dependency_lock_in: 0-5
  easy_to_document: 0-5
  easy_to_demo: 0-5
```

## Risk Adjustment

Subtract risk points when needed:

```yaml
risk_adjustment:
  unclear_claims: -5
  legal_or_compliance_complexity: -5
  payment_or_billing_complexity: -4
  customer_data_complexity: -4
  deployment_complexity: -3
  missing_owner: -3
  missing_docs: -2
  missing_qa: -2
```

## Final Recommendation

```yaml
recommendation:
  build_now: score >= 40 and risk manageable
  prototype_small: score 30-39
  document_first: score 20-29
  research_first: unclear audience or evidence
  park: low score or high unclear risk
  split: idea is too large and should become multiple tasks
```

## Best-Practice Use

Use this matrix before:

- building a new repo
- adding a new product
- launching a service
- creating a new bot or agent
- expanding a swarm
- adding paid offers
- changing platform architecture
- spending money on tools

## Prompt #11 Principle

High imagination is welcome. High ambiguity must be converted into smaller, clearer, testable steps.
