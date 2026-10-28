# Existing Jarvis and Hostinger integration assets

## Scope and evidence

The operator reports Hostinger and AI Building AI / Jarvis connections were
established previously across multiple repositories. Do not equate an unconfigured
Control Tower checkout with an absence of connections elsewhere.

The following public source assets were inspected on 2026-10-28. This is a source
inventory, not a live account-health report. Preserve previous deployments, DNS,
credentials, and data. Owner/next action: the operator confirms the active runtime
and authorizes a harmless round trip before any changes to an existing deployment.

## Existing implementation to reuse

The main Jarvis project is
`lippytm/AI-Jarvis-Assistant-ChatGPT-Gemini-AI-GitHub-Claude-and-all-of-my-Repositories-DOG-Dog-dog-`.
Reviewed revision: `b1b15992e8c08f1e77e4de178981e55c70346026`.

- `src/jarvis/hostinger.py`: existing read-only website inventory adapter. It
  requires `HOSTINGER_API_TOKEN` and literal `allow_external=True`, rejects
  redirects, bounds response size/pagination, and validates completeness.
  Reuse it in its existing private Python runtime instead of creating another
  Hostinger account client in this Node application.
- `docs/HERMES_MEMPALACE_HOSTINGER.md`: documents the Hostinger adapter, bounded
  ordered Hermes stages, approval boundaries, and local SQLite MemPalace receipts.
  Its recorded pilot status distinguishes mocked tests from live account access.
- `docs/ROUND_TRIP.md`: existing verified-bundle handoff procedure for ChatGPT
  Business, Gemini, Claude, GitHub, Hostinger, and other stations. Bundles preserve
  provenance; they do not establish shared hidden memory.
- `docs/CONNECTORS.md`: read/draft/write/destructive action classification,
  least-privilege execution, approval, and auditable results.

Source:
https://github.com/lippytm/AI-Jarvis-Assistant-ChatGPT-Gemini-AI-GitHub-Claude-and-all-of-my-Repositories-DOG-Dog-dog-/tree/b1b15992e8c08f1e77e4de178981e55c70346026

## Existing Hostinger and website surfaces

`lippytm/Hostinger.com-with-my-AI-Jarvis-Assistant-ChatGPT-ChatGPT-Business-Gemini-AI-Claude`
contains `docs/HOSTINGER_PARALLEL_PLATFORM.md`, reviewed at
`0becf348a750395fa1e811358c934b9c1c60debc`. It identifies
`aievolutionaryevolutions.com` as the web-facing platform, including an AI Jarvis
Command Center, AI Building AI Laboratory, and MemPalace Knowledge Library.
It separates the web interface from Linux execution and GitHub source of truth.

Source:
https://github.com/lippytm/Hostinger.com-with-my-AI-Jarvis-Assistant-ChatGPT-ChatGPT-Business-Gemini-AI-Claude/blob/0becf348a750395fa1e811358c934b9c1c60debc/docs/HOSTINGER_PARALLEL_PLATFORM.md

`lippytm/aievolutionaryevolutions.com-Hermes-Fabric-MemPalace-` contains
`github-workflows/deploy.yml`, a prior SSH/PM2 Hostinger VPS deployment template
using secret names `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY`. Its location outside
`.github/workflows/` does not activate it in GitHub Actions. The inspected template
also permits failed tests and force-resets the target checkout; do not activate or
copy it unchanged. No deployment command was executed by this session.

Source:
https://github.com/lippytm/aievolutionaryevolutions.com-Hermes-Fabric-MemPalace-/blob/HEAD/github-workflows/deploy.yml

## Control Tower interoperability

The new [build-review workflow](../workflows/jarvis-ai-build-review.md) is a
separate Node draft/review entry point, not a replacement for the existing Python
Jarvis, Hostinger adapter, or MemPalace ledger. Its `ai-build-review.json` artifact
is not a `jarvis.bundle.v1` bundle and must not be presented as one. Until an
explicit schema adapter is implemented, use a reviewed manual handoff and the
Jarvis project's own bundle creator/verifier.

Inputs for reconciliation: active deployment repository/revision, runtime owner,
exact public endpoint, supported API/bundle contract, and non-sensitive evidence
of a harmless round trip. Outputs: a per-connection record distinguishing source
assets, deployment, authorization, reachability, and last successful verification.
Never copy secret values between repositories or place account inventory in
public manifests. Website inventory does not by itself prove domain ownership,
VPS status, application health, or publishing rights.

## Confirmed deployment fault and reviewed repair

The old installers in both the Hostinger platform and website repositories clone
the website repository, run npm at its root, and attempt `server.js`. The inspected
website default branch has neither `package.json` nor `server.js`. This is a
reproducible source/deployment mismatch, not evidence that an earlier deployed
copy never worked.

The actual existing Node implementation is the main Jarvis project's `runtime/`.
It depends on the full checkout and `config/prompt-11-profile.json`, uses loopback
port 8787 by default, and is a non-executing advisory pilot. Do not copy just that
directory, assume port 3001, or expose it as a public autonomous service.

Two remote repair commits were prepared and verified against their default
branches without changing a default branch or deployed service:

| Target | Repair commit | Branch state |
|---|---|---|
| Hostinger platform repository | `f996c5b1bc9af4fd225bf44a5478cee5efdbcba3` | `copilot/repair-existing-jarvis-install-path-20261028`, awaiting review |
| Website repository | `330e12a9159c58fedca1f4e961a75e5c4dba6e5f` | `copilot/repair-existing-jarvis-install-path-20261028`, awaiting review |

Those repairs replace automatic installation with read-only source preflight,
preserve existing services/firewalls/DNS/data, and document the correct runtime.
The website repair also replaces its destructive, inactive deployment template
with an explicit refusal stub. These prevent another broken reinstall; they do
not reconnect an account or deploy a missing website application.

Both installer repair branches now include six offline regression tests and
`.github/workflows/install-preflight.yml`. Tests cover valid source paths containing
spaces, invalid syntax, missing arguments/source, and preservation of existing
files without installing packages or executing the application. Review requests:

- Control Tower: https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/pull/94
- Hostinger installer: https://github.com/lippytm/Hostinger.com-with-my-AI-Jarvis-Assistant-ChatGPT-ChatGPT-Business-Gemini-AI-Claude/pull/3
- Website installer: https://github.com/lippytm/aievolutionaryevolutions.com-Hermes-Fabric-MemPalace-/pull/5

These are draft reviews, not merged repairs or deployed releases. The Tower also
accepts the existing Jarvis `ANTHROPIC_MODEL` variable; conflicting model settings
are rejected instead of silently routing to a different model.

Verification at main Jarvis revision
`b1b15992e8c08f1e77e4de178981e55c70346026`: 296 Python tests and 34 Node
runtime tests passed locally; Node syntax checks passed. Both replacement
preflights accepted the complete existing source and rejected missing inputs or
missing source files without installation. The recent Jarvis audit inspected in
Actions was successful, but its documented scope is public metadata/local
evidence, not a live Hostinger or multi-provider connection test.

Remaining live checks require the actual running VPS/service and owner-approved
credentials. This session did not access a VPS, use a Hostinger token, invoke paid
models, alter DNS, or restart workers. Domain resolution failed from this session;
that observation is not a diagnosis of the operator's entire DNS configuration.

## Validation and rollback checklist

- [ ] Confirm which existing runtime is authoritative before adding another service.
- [ ] Run the existing Hostinger adapter only with owner-approved account access.
- [ ] Check the actual website/agent endpoint without changing its DNS.
- [ ] Verify a non-sensitive bundle or authenticated read at the receiving station.
- [ ] Record the revision, time, scope, and result without credentials or raw inventory.
- [ ] Keep existing workers and website untouched until replacement is approved.

Risk: high for deployment, cross-provider data sharing, or account-level API access.
Fallback: continue using existing systems and manual verified handoffs. Rollback:
disable only the newly added Control Tower workflow/service, leaving prior systems
intact. Support: use the owning project's documented support path; route private
Hostinger account or DNS evidence to Hostinger support, not public issues.
