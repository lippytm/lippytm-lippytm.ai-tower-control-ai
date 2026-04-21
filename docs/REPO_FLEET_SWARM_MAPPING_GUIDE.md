# Repo Fleet Swarm Mapping Guide

## Purpose
This guide defines how to map swarm systems consistently across the full repository fleet so every repo can be linked to the right blueprints, profiles, platforms, entities, cost centers, and review levels.

## Core Goal
Create a repeatable mapping standard for all repositories so swarm manufacturing can scale across the fleet with less confusion and more reuse.

## Mapping Objects
For each repository aim to map:
- repo ID
- linked entity ID
- linked cost center ID
- linked platform IDs
- linked blueprint IDs
- linked profile IDs
- linked application IDs
- review level
- maturity stage
- priority wave

## Suggested Repo Categories
### Core Control Repos
Example uses:
- architecture
- control tower
- governance
- templates
- rollout coordination

### Business / CRM Repos
Example uses:
- offers
- CRM systems
- funnels
- revenue-growth surfaces

### Bot / Automation Repos
Example uses:
- bot systems
- orchestration
- automation logic
- agent support

### Knowledge / Encyclopedia Repos
Example uses:
- reference systems
- legal/policy systems
- educational systems
- applied knowledge packages

### Media / Creative Repos
Example uses:
- campaigns
- media planning
- narrative systems
- educational entertainment systems

### Accountability / Reporting Repos
Example uses:
- tax-support
- reporting
- dashboards
- accountability systems

## Suggested Mapping Sequence
1. assign repo ID
2. assign category
3. map linked entity ID and cost center ID
4. identify primary platform links
5. assign blueprint and profile IDs
6. set review level and maturity stage
7. add tracker row or update status file

## Best Practices
- use the same mapping pattern for every repo
- map every repo before trying to scale automation deeply
- keep repo category and application purpose clear
- use wave priorities to avoid rollout overload
- review mapping after major repo changes or new repo creation

## Future Extensions
- repo mapping template
- repo category taxonomy
- repo mapping dashboard cards
- repo-to-application matrix
