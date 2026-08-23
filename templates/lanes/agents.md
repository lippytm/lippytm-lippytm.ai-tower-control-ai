# Agents & AI Lane Checklist

Apply this after the universal repo templates. For: `MARVIN`, `AI-Full-Stack-AI-DevOps-Synthetic-Intelligence-Engines-AgentsBots-Web3-Websites-`.

## Foundation checklist

- [ ] Each agent has a YAML manifest: name, role, channels, self-healing rules, escalation path
- [ ] Swarm topology documented in `docs/architecture.md`
- [ ] Health-check endpoints and monitoring steps in `docs/runbook.md`
- [ ] `SWARM_MAX_AUTO_RESTARTS` and stale threshold configured via environment variables
- [ ] Every agent state transition logged to a maintenance log

## Agent manifest template (copy to `agents/<agent-name>.yml`)

```yaml
name: [agent-name]
role: [coordinator/worker/support/monitor]
swarm: [swarm-name]
channels:
  - [openai/allbots/replit/github-copilot/internal]
self_healing:
  max_auto_restarts: 3
  stale_threshold_ms: 60000
  health_check_interval_ms: 30000
escalation:
  trigger: [failed state after max restarts]
  target: [human operator / Slack channel]
metadata:
  created: [YYYY-MM-DD]
  owner: [owner name or handle]
```

## Swarm topology template (add to `docs/architecture.md`)

```markdown
## Swarm topology

| Swarm name | Members | Role | Health check |
|---|---|---|---|
| [swarm-name] | [agent-1, agent-2] | [purpose] | [interval] |
```

## Security checklist

- [ ] No real credentials in agent code — environment secrets only
- [ ] Agent cannot make financial or legal decisions autonomously
- [ ] Human approval required for critical actions

## Next actions after applying templates

1. Create `agents/` folder with one YAML per agent
2. Add swarm topology to `docs/architecture.md`
3. Add health-check steps to `docs/runbook.md`
4. Configure self-healing environment variables
5. Enable maintenance log
6. Update `fleet/repos.yml`
