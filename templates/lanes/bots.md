# Bots Lane Checklist

Apply this after the universal repo templates. For: `Chatlippytm.ai.Bots`, `Clawlippytm.ai.Bots`, `ClawBase44.ai.Bots`, `Transparency-Logic-Time-Machine-Bots-`, `AllBots.com`.

## Foundation checklist

- [ ] Each bot has a YAML definition in `agents/`: name, role, channels, self-healing rules
- [ ] Bot persona, purpose, and limits are documented
- [ ] ManyChat/BotBuilders intake flow documented for each bot
- [ ] Support escalation path defined: when does a bot hand off to a human?
- [ ] Test scripts or manual validation steps added for every conversation path

## Security checklist

- [ ] No API keys or secrets in bot code — environment secrets only
- [ ] No customer PII stored in public repo
- [ ] Bots cannot make financial, funding, legal, or medical claims autonomously
- [ ] High-risk bot actions require human approval gate

## Compliance checklist

- [ ] No unsupported income, funding, or outcome guarantees in any bot response
- [ ] Escalation language reviewed by human before going live
- [ ] Customer data handling follows `SECURITY.md`

## Bot definition template (copy to `agents/<bot-name>.yml`)

```yaml
name: [bot-name]
role: [worker/support/sales/creative]
channels:
  - [openai/manychat/botbuilders/internal]
escalation:
  trigger: [condition that triggers human handoff]
  target: [human team or channel]
self_healing:
  max_restarts: 3
  stale_threshold_ms: 60000
compliance_notice: true
```

## Next actions after applying templates

1. Create `agents/` folder and one YAML per bot
2. Document escalation path in README
3. Add manual test plan
4. Connect to ManyChat/BotBuilders intake flow
5. Update `fleet/repos.yml`
