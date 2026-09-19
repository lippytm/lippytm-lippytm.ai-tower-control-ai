# Seamless Multi-AI Workflow

1. Capture one bounded business or development task.
2. Assign bundle ID, registry version, source and target DOG IDs, risk level, expected output, and SHA-256.
3. Put only approved non-secret material on a review branch.
4. Give the same hash-bound packet to Gemini and Claude for independent work.
5. Require each provider receipt to repeat its platform, DOG ID, registry version, bundle ID, and received hash.
6. Preserve disagreements; do not manufacture consensus.
7. RiskGate checks privacy, security, costs, communications, publishing, deployment, credentials, and irreversible effects.
8. Charles approves, rejects, or requests revision.
9. QA verifies the selected output and GitHub records the approved evidence.
10. Roll back by disabling only the affected adapter, revoking its credential, and restoring the last approved revision.

## Verification rule

Configured is not connected. Delivered is not synchronized. Synchronization is verified only after identity, version, bundle, and hash checks pass and the event is recorded.

## Rollout order

Control Tower → Prompt #11 governance → Gemini/NotebookLM adapter → Claude/Hermes adapter → AI Clone/Hermes runtime → approved business repositories.

Every rollout uses a branch and draft pull request. No automatic merge or production deployment.
