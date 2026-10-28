# Bookmark: existing AI/Jarvis connection repairs

Paused by the operator at 2026-10-28 00:57 UTC.
Owner/next action: resume existing-system verification without reinstalling.

## Resume prompt

> Resume the existing Hostinger, AI Building AI, Jarvis swarm, ChatGPT/Business,
> Gemini, and Claude connection repairs from this bookmark. Reuse existing systems.
> Check the three repair reviews and any new feedback first. Do not claim live
> connections are repaired based on source tests. Help me find Hostinger's VPS
> browser terminal before requesting diagnostic output. Do not request secrets,
> reinstall applications, change DNS, merge, or deploy without explicit approval.

## Saved engineering state

Control Tower branch: `copilot/repair-existing-connections-20261028`.
Last code-repair commit before this bookmark:
`250f8c1ba3fad546a9078b7067182b2bcff12cc1`.
Changes are pushed. This bookmark will be a subsequent documentation commit.

| Review | State at pause | Scope |
|---|---|---|
| https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai/pull/94 | Open, ready for review, not merged | Authentication, dispatch, provider handling, model compatibility, dependency gate, swarm consistency, and hosting guide |
| https://github.com/lippytm/Hostinger.com-with-my-AI-Jarvis-Assistant-ChatGPT-ChatGPT-Business-Gemini-AI-Claude/pull/3 | Open, ready for review, not merged | Replace broken installer with non-installing source preflight and preservation tests |
| https://github.com/lippytm/aievolutionaryevolutions.com-Hermes-Fabric-MemPalace-/pull/5 | Open, ready for review, not merged | Same installer repair; disable invalid inactive deployment template |

No VPS services, account settings, DNS, private environments, or existing workers
were changed. No live model or Hostinger account calls were made.

## Confirmed findings and validation

- The old installers clone a website repository missing root `package.json` and
  `server.js`, then attempt to run those files. That is a confirmed source mismatch.
- The actual established Jarvis implementation is
  `lippytm/AI-Jarvis-Assistant-ChatGPT-Gemini-AI-GitHub-Claude-and-all-of-my-Repositories-DOG-Dog-dog-`.
  Its `runtime/` needs the full checkout and `config/prompt-11-profile.json`.
  Its documented default is loopback port 8787; it is an advisory pilot, not a
  public remote execution service. Preserve existing deployments.
- Existing Hostinger inventory adapter, Hermes/MemPalace contracts, and verified
  bundle procedures are recorded in `integrations/existing-jarvis-connections.md`.
- Latest local Control Tower validation: 191 tests and lint passed.
- Canonical Jarvis inspected revision
  `b1b15992e8c08f1e77e4de178981e55c70346026`: 296 Python and 34 Node tests passed.
- Both installer repair suites passed six offline tests and their GitHub CI.
  Tests preserve existing private configuration and installed dependency sentinels.
- Tower Node 22/24 CI, CodeQL, docs, dependency audit, and correctness check passed
  at the recorded code head. One automated review was still pending at last check;
  recheck instead of assuming completion.
- Dependency Graph was unavailable to the original review action. The replacement
  lockfile audit gate passes without that feature and still blocks high/critical
  advisories. Local audit found no moderate/high/critical advisories after fixes.
  Six low-severity Jest/deepmerge advisory entries remain; no current patched
  deepmerge release was available. No forced downgrade or advisory suppression.

## Next steps after the break

1. Recheck all three reviews for new feedback and exact-head CI results.
2. Help the operator navigate Hostinger hPanel > VPS > select server > Browser
   terminal. The operator did not know how to reach/run terminal diagnostics.
3. If navigation is unclear, request a screenshot with account/private details
   hidden. Never ask for passwords, tokens, private keys, or environment contents.
4. Once in the VPS terminal, run only the read-only local health-status probe below.
5. Identify the authoritative running service/revision before any repair or restart.
   Verify each provider and existing handoff only after owner-approved access.
6. Merge/deploy decisions remain separate approvals. Do not bypass pending review.

Read-only probe for the VPS terminal, not this development workspace:

```bash
for port in 8787 3000 3001; do
  printf 'port %s: ' "$port"
  curl --noproxy '*' --connect-timeout 2 --max-time 3 -s \
    -o /dev/null -w '%{http_code}\n' "http://127.0.0.1:$port/health"
done
```

Ask for status lines only. `000` means no HTTP response, not proof that the service
is broken; the actual deployment may use another port or route.
This session had no SSH agent and was not supplied a configured host alias.
Public domain resolution failed from this environment; that is not a complete
diagnosis of the operator's DNS or proof that existing agents are offline.

## Footnote: completion boundary

Source repaired, pushed, reviewed, merged, deployed, reachable, authenticated, and
successful end-to-end are different states. Only source repairs and the checks
above are established. Live reconnection is unfinished. Existing website agents
and verified manual handoffs remain the fallback. Risk is high for account access,
cross-provider data sharing, or deployment; preserve the prior working system.
Support details and rollback boundaries are in the linked integration guides.
