# R&D Lane Checklist

Apply this after the universal repo templates. For: `Web3AI`, `AI-Time-Machines`, `Factory.ai`, `ai-coding-factory`.

## Foundation checklist

- [ ] README has prominent experimental notice (see below)
- [ ] Subfolders separate working prototypes from ideas: `experiments/`, `prototypes/`, `concepts/`
- [ ] `docs/research-log.md` tracks what was tried, what worked, and what failed
- [ ] Promotion path defined: when an R&D concept is ready to become a product, what are the steps?
- [ ] Cost and risk controls documented before connecting to live APIs or customer data

## Required README notice

Add this to the top of `README.md`:

```markdown
> ⚠️ **Experimental repository.** This is R&D / research-and-development work. Nothing here is production-ready or a guarantee of any outcome. Human review required before connecting to live systems, APIs, or customer data.
```

## Research log template (copy to `docs/research-log.md`)

```markdown
# Research Log

## [Date] — [Experiment name]

- **Hypothesis:** [what you expected]
- **Method:** [what you tried]
- **Result:** [what happened]
- **Next step:** [iterate / promote / abandon]
- **Risk notes:** [any concerns]
```

## Promotion path (when R&D is ready)

- [ ] Core feature works reliably in isolation
- [ ] Manual test plan completed
- [ ] Security and compliance reviewed
- [ ] Business case identified
- [ ] Human approval to promote to `product` lane
- [ ] Update `fleet/repos.yml` lane and status

## Security checklist

- [ ] No real credentials in repo
- [ ] No live customer data connected to R&D experiments
- [ ] Cost controls in place for API usage

## Next actions after applying templates

1. Add experimental notice to README
2. Create `experiments/`, `prototypes/`, `concepts/` subfolders
3. Add `docs/research-log.md`
4. Document promotion path
5. Update `fleet/repos.yml`
