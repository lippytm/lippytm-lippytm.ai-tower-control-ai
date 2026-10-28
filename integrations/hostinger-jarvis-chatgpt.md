# Hostinger VPS, Jarvis swarms, and ChatGPT connection starter

## Purpose and current boundary

Owner/next action: the VPS operator verifies the server OS and installs the private
pilot below. Risk: high when public, because authorized clients can invoke paid APIs
and modify swarm state. This is a deployment starter, not a completed connection.

Target flow:

```text
ChatGPT / ChatGPT Business (future approved interface)
    -> HTTPS + authenticated adapter (not implemented)
    -> Control Tower on Hostinger VPS
    -> OpenAI API / explicitly configured external agent connectors
```

The website `aievolutionaryevolutions.com` is user-reported as hosting existing
agents. Its DNS and agent API could not be verified during setup. Do not change
its root domain, existing site, or DNS until ownership and hosting are confirmed.
Prefer a separate verified subdomain for this pilot.

| Input | Output | Boundary |
|---|---|---|
| `POST /api/auth/token` with configured credentials | One-hour JWT | Single operator client; not user-specific permissions |
| `POST /api/connectors/openai/chat` with messages | OpenAI response and usage | Requires API key, model access, and separate API billing |
| `POST /api/swarm/agents` with name, role, channels | Agent descriptor | Registration does not deploy a remote worker |
| `POST /api/swarm/swarms` with name | Swarm descriptor | State is in memory and lost on restart |
| `GET /api/swarm/agents` | Registered agents | Does not discover external website agents |

Use only a private, disposable pilot until persistent storage, scoped identities,
and each external connector's current API compatibility have been validated.
Do not connect customer data, autonomous deployments, payments, or public messaging.

## 1. Prepare the VPS

First reconcile the [existing Jarvis/Hostinger assets](existing-jarvis-connections.md).
These instructions create a separate private pilot, not a replacement for a prior
connection or deployment. Do not run them over an existing working application.

In Hostinger hPanel, open the VPS browser terminal. Confirm OS with
`cat /etc/os-release`. These templates require Linux with systemd, a supported
Node.js LTS version 22 or newer in `/usr/local/bin` or `/usr/bin`, npm, Git, and Caddy.
Install prerequisites using instructions for the confirmed OS; do not run
unreviewed install scripts. Check `node --version`, `npm --version`, and `caddy version`.

Check for an existing service/site before using `/opt/control-tower` or changing
the proxy. Use your normal GitHub authentication for a private checkout; never
put a GitHub token in a clone URL. From a normal sudo-enabled operator account:

```bash
sudo useradd --system --user-group --home-dir /opt/control-tower --no-create-home control-tower
sudo install -d -o "$USER" /opt/control-tower
git clone https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai.git /opt/control-tower
cd /opt/control-tower
npm ci
npm test
npm run lint
npm prune --omit=dev
sudo chown -R "$USER":control-tower /opt/control-tower
sudo chmod -R g+rX,g-w /opt/control-tower
sudo chmod -R o-rwx /opt/control-tower
sudo install -m 600 -o root -g root .env.example /etc/control-tower.env
sudoedit /etc/control-tower.env
```

Skip account/directory creation if already provisioned; do not overwrite a deployment.
Deploy a reviewed revision containing these starter files.
The operator retains checkout access for updates; the service group has read/search
access but no write access. Keep the environment file root-owned and private.

Set these values in `/etc/control-tower.env`, not in GitHub or chat:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
TRUST_PROXY=loopback
CORS_ORIGINS=https://tower.example.com
JWT_SECRET=<independently-generated-random-value>
TOWER_CLIENT_ID=<operator-chosen-client-name>
TOWER_CLIENT_SECRET=<different-independently-generated-random-value>
```

Generate each secret separately with `openssl rand -hex 32` in your private VPS
terminal. Replace every placeholder, including the origin. Remove unused connector
key placeholders. Add `OPENAI_API_KEY` and an accessible `OPENAI_MODEL` only when
you intend to enable paid inference. Store an encrypted backup of configuration.
The service reads the root-owned environment file through systemd.

## 2. Start a loopback-only pilot

```bash
cd /opt/control-tower
sudo install -m 644 deploy/hostinger/control-tower.service /etc/systemd/system/control-tower.service
sudo systemctl daemon-reload
sudo systemctl enable --now control-tower
sudo systemctl status control-tower --no-pager
curl --fail http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/api/swarm/agents
```

Expected: health reports `status: ok`; the protected endpoint returns HTTP 401.
Health confirms HTTP availability only, not OpenAI access or remote connectivity.
Do not expose port 3000 through the Hostinger firewall or host firewall.
Use one Node process: the in-memory stores are not shared across replicas.

Test configured login without printing the JWT or putting secrets into shell history:

```bash
sudo "$(command -v node)" --env-file=/etc/control-tower.env - <<'NODE'
async function check() {
  const base = 'http://127.0.0.1:3000';
  const login = await fetch(`${base}/api/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: process.env.TOWER_CLIENT_ID,
      clientSecret: process.env.TOWER_CLIENT_SECRET,
    }),
  });
  if (!login.ok) throw new Error(`Login failed: HTTP ${login.status}`);
  const { token } = await login.json();
  const agents = await fetch(`${base}/api/swarm/agents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!agents.ok) throw new Error(`Agent listing failed: HTTP ${agents.status}`);
  const data = await agents.json();
  if (!Array.isArray(data.agents)) throw new Error('Invalid agent-list response');
  console.log(`Authenticated successfully; registered agents: ${data.agents.length}`);
}
check().catch((error) => { console.error(error.message); process.exitCode = 1; });
NODE
```

Register a pilot agent through `POST /api/swarm/agents` with
`{"name":"Jarvis Pilot","role":"coordinator","channels":["internal"]}` using
an authenticated local API client. This creates a disposable descriptor only,
not an autonomous assistant. Real worker execution needs a separately reviewed change.

## 3. Add HTTPS only after private validation

Verify a chosen subdomain points to the VPS; resolve any stale IPv6 record too.
Allow inbound 80/443 in both firewalls while preserving your existing SSH access.
Back up the existing Caddy configuration. Copy `deploy/hostinger/Caddyfile` to
`/etc/caddy/control-tower.caddy`, replace `tower.example.com` with the verified
subdomain, and add `import /etc/caddy/control-tower.caddy` to the existing main
Caddyfile. Do not replace existing sites. Validate and reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Verify HTTPS health, unauthenticated HTTP 401, and authenticated listing using
the public URL before calling this deployed. Caddy manages TLS for a reachable
domain. Loopback proxy trust assumes Caddy is on the same host; do not bind this
service to a public interface with that configuration.

## 4. Connect ChatGPT and existing agents in the next stage

The [Jarvis build-review workflow](../workflows/jarvis-ai-build-review.md) now
provides manual OpenAI, Gemini, and Claude API drafting/review after configuration.
It does not replace the workspace adapter or external-agent API work below.

ChatGPT and ChatGPT Business subscriptions are not OpenAI API credits and do not
automatically connect conversation history or custom GPTs to this server.
Keep personal and Business workspaces separate; do not merge or delete accounts.
Business workspace owners/admins must approve available integration features.

For a ChatGPT-facing interface, first confirm supported custom GPT Actions or
app integration options in the intended workspace. Build a narrow adapter with
an OpenAPI schema and supported authentication rather than pasting the operator's
one-hour JWT or client secret into a chat. No such adapter is implemented here.
Start read-only; require explicit approval for writes and external side effects.

For existing website agents, obtain the exact working agent URL, platform name,
documented API/webhook specification, and required authentication method. Register
each connection as pending until an authenticated sandbox test succeeds. Do not
guess endpoints, scrape login sessions, or give agents Hostinger account credentials.
Hostinger API access is not required merely to run this app on the VPS.

## Completion, fallback, and support

- [ ] Server OS, reviewed revision, and prerequisites recorded.
- [ ] Private health, invalid-login rejection, and authenticated listing verified.
- [ ] Existing website left intact; verified subdomain has working HTTPS.
- [ ] No secrets in Git; API spend limits and alerts configured.
- [ ] Durable storage and scoped access implemented before real workloads.
- [ ] ChatGPT interface and each external agent tested separately before activation.

Rollback: `sudo systemctl disable --now control-tower`; remove only the new proxy
import/site, validate and reload Caddy, and restore the prior reviewed revision/config.
Restarting loses pilot agents, swarms, and sync jobs. Rotating `JWT_SECRET` invalidates
issued tokens; rotate client credentials separately after suspected exposure.

Support: inspect `sudo journalctl -u control-tower -n 100 --no-pager`, redact secrets
and private data before sharing, and open a repository support issue. Use Hostinger
support for VPS/DNS/account failures and the relevant provider for API access/billing.
Manual fallback is existing website agents and ChatGPT with no automated side effects.
Long-term asset value: a reusable, reviewable hosting bridge; no revenue guarantees.
