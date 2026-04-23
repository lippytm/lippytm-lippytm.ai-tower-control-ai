# Downstream Promoted Asset Consumption Model

## Purpose
This document defines the next layer above promoted toolkits and promoted applications across the lippytm ecosystem.

## Core Goal
Turn promoted assets into clearer downstream operating records that show how promoted toolkits and promoted applications are actually consumed by later systems.

## Downstream Layers
### Layer 1 — Promoted Asset Source
Promoted toolkit or promoted application records.

### Layer 2 — Consumer Record
A downstream record showing which later workflow, app, package, or system consumes the promoted asset.

### Layer 3 — Deployment Package
A downstream package showing how a promoted asset is organized for a target platform, workflow, or use case.

### Layer 4 — Utilization Tracking
A tracker showing where promoted assets are actually being used and where they still remain only prepared.

## Best Practices
- build consumer records after promoted pairs exist
- keep downstream records linked to the parent promoted toolkit or application
- make target platform and use case explicit
- update utilization trackers whenever a new consumer or deployment package is created
