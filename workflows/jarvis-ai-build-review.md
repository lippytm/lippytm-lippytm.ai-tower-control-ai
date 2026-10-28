# Jarvis multi-provider AI build and review

## Purpose and owner

Turn a non-sensitive AI-building request into a proposed solution plus a separate
review. Owner: Control Tower operator; Business workspace administrators approve
any future ChatGPT-facing interface. Risk: medium for drafting, high if outputs
are later used for deployments or customer-facing communications.

This workflow connects API calls, not consumer chat accounts. It is implemented
but not authorized or live-tested against the operator's accounts.

Prior Jarvis/Hostinger assets already exist in other repositories. Reconcile
[their documented contracts](../integrations/existing-jarvis-connections.md)
before creating another runtime; this pilot does not negate past connections.

## Connections and prerequisites

| Platform | Connection prepared | Required operator action |
|---|---|---|
| ChatGPT / OpenAI | Existing OpenAI connector can build or review | Configure `OPENAI_API_KEY`, an accessible `OPENAI_MODEL`, and API billing |
| ChatGPT Business | Manual planning/handoff; automatic workspace adapter not implemented | Workspace administrator approves supported integration and data sharing |
| Gemini AI | Gemini `generateContent` API connector | Configure `GEMINI_API_KEY` and `GEMINI_MODEL` |
| Claude | Anthropic Messages API connector | Configure `ANTHROPIC_API_KEY` and `CLAUDE_MODEL` |
| Hostinger.com | VPS systemd/HTTPS hosting templates | Complete the private pilot and HTTPS setup; no hPanel API control |
| Jarvis assistants/swarms | Authenticated workflow and descriptive provider channels | Register pilot agents; no remote worker discovery or execution |
| Existing website agents | Pending documented API integration | Verify actual website URL and API; leave existing DNS intact |

Use the [Hostinger pilot guide](../integrations/hostinger-jarvis-chatgpt.md) first.
All provider keys belong in the VPS environment, not workflow inputs or Git.
Consumer subscriptions do not automatically include API access or credits.
Set explicit model IDs available to your API project; Gemini and Claude have no
guessed default models. Choose text models supporting these APIs and output budgets.

For compatibility with the existing Jarvis runtime, `ANTHROPIC_MODEL` is accepted
when `CLAUDE_MODEL` is unset. If both are present they must match, unless the request
explicitly selects a model. Conflicting inherited settings fail before inference
rather than silently choosing a different model. This does not share credentials,
tokens, sessions, or state between runtimes.

## Trigger, inputs, and outputs

Trigger: a manual authenticated request or the manually dispatched
`AI Builder and Jarvis Draft Review` GitHub Actions workflow.
There is no schedule, webhook auto-run, deployment, code execution, or posting.
Each successful run makes two paid inference requests. The reviewer receives
both the original prompt and the builder's output; approve sharing with both providers.
Models have a 2048-token output budget; truncated, blocked, and empty results fail.

```http
POST /api/workflows/build-review
Authorization: Bearer <short-lived-token>
Content-Type: application/json

{
  "prompt": "Propose a Jarvis assistant that drafts support replies for human approval.",
  "builder": { "provider": "gemini" },
  "reviewer": { "provider": "claude" }
}
```

Allowed providers: `openai`, `gemini`, `claude`. Each role can optionally specify a
`model`; otherwise its configured server model is used. The workflow prompt must
be non-empty and at most 12000 characters. Select different providers when an
independent provider review is desired; a second inference is not a guarantee of quality.

Success returns a `workflowId`, `status: awaiting_human_review`,
`draft: {provider, content, model, ...}`, `review: {provider, content, model, ...}`,
and `externalActionsExecuted: false`. This flag means no deployment, publication,
or agent commands were executed; the two provider API requests did occur.
Server-side workflow results are not persisted.

For single-provider drafting, use the JWT-protected
`POST /api/connectors/gemini/generate` or `POST /api/connectors/claude/generate`
with `{"prompt":"Draft a non-sensitive proposal","model":"<accessible-model-id>"}`.
These accept a single prompt, not a chat-history array. OpenAI retains its existing
`POST /api/connectors/openai/chat` messages interface.

New generation endpoints and the workflow have a 10-request/minute limiter in
addition to the global limiter. Missing configuration returns HTTP 503; invalid
input returns 400; provider failures return 502, not a successful draft.
Both roles are preflighted before builder inference. If review subsequently fails,
the request fails; earlier provider usage can still be billed. No automatic retries.

## GitHub Actions setup

1. Make these reviewed changes available on the default branch.
2. Create the `ai-pilot` GitHub environment and configure required reviewers and
   deployment branch restrictions where your repository plan supports them.
3. Configure `TOWER_API_URL`, `TOWER_CLIENT_ID`, and `TOWER_CLIENT_SECRET` as
   environment secrets matching the VPS. The URL must be an HTTPS origin without
   credentials, a path, query, or fragment.
4. Open Actions, select `AI Builder and Jarvis Draft Review`, and run it manually
   with a non-sensitive prompt and two configured providers.
5. Download the `ai-build-review` artifact, review `ai-build-review.json`, and
   create an approved implementation issue before applying anything.

The runner sends inputs as JSON, does not print tokens or drafts, and retains the
draft artifact for one day. Repository users able to read Actions artifacts may
read it; never put secrets or private customer material in prompts. Provider-side
retention policies are separate. A failed run does not upload a success artifact.
The older generic sync endpoint is a simulation and is not used by this workflow.

## Jarvis communications boundary

Agent definitions may include `openai`, `gemini`, `claude`, and `internal` channels.
Channels describe intended communications; they do not subscribe a remote agent,
start workers, or automatically route messages. The build-review workflow invokes
the chosen providers directly without mutating swarms.
Keep agent/swarm state disposable until a durable store and scoped identities exist.

## Definition of done, support, and rollback

- [ ] Private pilot login and protected endpoint checks pass.
- [ ] Two selected providers pass a non-sensitive sandbox request with spend alerts.
- [ ] Draft and review contain no secrets or unsupported promises.
- [ ] Human approves the implementation issue, validation, rollback, and support owner.
- [ ] Dashboard remains pending until actual account/endpoint validation succeeds.

For failures, inspect the HTTP status and redacted VPS service logs; check model
access, API quotas, and credentials with the affected provider. Never share raw
request headers or API responses containing private data in support issues.
Disable the GitHub workflow and remove its environment secrets to stop dispatch;
stop the VPS service to disable all Tower API requests. This does not undo external
provider billing. Manual fallback: draft and review separately in approved chat
workspaces without automated actions. Reuse value: a reviewed workflow template,
not guaranteed revenue or a guarantee of safe generated code.

API references for operator verification:
[Gemini generateContent](https://ai.google.dev/api/generate-content) and
[Claude Messages](https://platform.claude.com/docs/en/api/messages/create).
Current documentation and live account access were not reachable for verification
in this setup session; sandbox validation remains required.
