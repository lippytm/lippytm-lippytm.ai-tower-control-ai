# Productivity Lane Checklist

Apply this after the universal repo templates. For: `zenith-tasks`.

## Foundation checklist

- [ ] Task lifecycle defined: create → assign → in-progress → review → done → archive
- [ ] Integration hooks with GitHub issues documented so tasks stay synchronized
- [ ] Connection to BoB operating loop documented
- [ ] Weekly review workflow and template added

## Task lifecycle template (add to `docs/architecture.md`)

```markdown
## Task lifecycle

| Status | Definition | Next step |
|---|---|---|
| create | Task identified and logged | Assign owner |
| assign | Owner confirmed | Begin work |
| in-progress | Work underway | Update status daily |
| review | Work complete, needs check | Reviewer signs off |
| done | Accepted and merged | Archive or close |
| archive | Historical record | No action needed |
```

## Weekly review template (copy to `workflows/weekly-review.md`)

```markdown
# Weekly Review — [Week of YYYY-MM-DD]

## Tasks completed this week

- [ ] [Task 1]
- [ ] [Task 2]

## Tasks in progress

- [ ] [Task 1] — [status / blocker]

## Blockers or risks

- [Blocker 1]

## Next week priorities

1. [Priority 1]
2. [Priority 2]

## Fleet registry update needed?

- [ ] Yes — update fleet/repos.yml
- [ ] No
```

## Security checklist

- [ ] No customer PII in task records in public repo

## Next actions after applying templates

1. Write task lifecycle in `docs/architecture.md`
2. Document GitHub issue integration
3. Add weekly review template
4. Connect to BoB operating loop docs
5. Update `fleet/repos.yml`
