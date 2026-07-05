# Education Lane Checklist

Apply this after the universal repo templates. For: `earn-while-you-learn`.

## Foundation checklist

- [ ] Curriculum outline written as first file (`curriculum.md` or `docs/curriculum.md`)
- [ ] Learning tracks, modules, and outcomes defined in a structured table or YAML
- [ ] `docs/business-model.md` explains revenue model clearly and compliantly
- [ ] Compliance notice on all course materials
- [ ] Student support path and FAQ defined in `docs/support-playbook.md`

## Required compliance notice (add to README and all course pages)

> **Compliance notice:** This educational content is for informational and skill-building purposes only. Participation does not guarantee income, employment, business results, or financial returns of any kind.

## Curriculum template (copy to `docs/curriculum.md`)

```markdown
# Curriculum

## Track: [Track name]

| Module | Topic | Outcome | Format | Duration |
|---|---|---|---|---|
| 1 | [Topic] | [Learner will be able to...] | [video/text/quiz] | [time] |
| 2 | [Topic] | [Outcome] | [format] | [time] |

## Support

For questions: [support email or link]
```

## Security checklist

- [ ] No student PII in public repo
- [ ] Payment processing via Stripe or approved platform — credentials in secrets only
- [ ] Human review before publishing any course content

## Next actions after applying templates

1. Write `docs/curriculum.md`
2. Add compliance notice to README
3. Add `docs/business-model.md`
4. Add `docs/support-playbook.md`
5. Update `fleet/repos.yml`
