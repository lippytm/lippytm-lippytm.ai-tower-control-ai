# AI Identity Lane Checklist

Apply this after the universal repo templates. For: `AI-Clone-of-Charles-Earl-Lipshay-lippytm-lippytm.AI-lippytmai-`.

> ⚠️ **Never edit this repo directly.** All changes must go through `fleet/clone/` in the Control Tower and be synced via `sync-to-clone.yml`.

## Foundation checklist

- [ ] README explains that direct edits are not allowed — all changes through Control Tower
- [ ] Persona, values, communication style, and limits documented in `fleet/clone/AI_CLONE_PERSONA.md`
- [ ] Human review gate in place before any persona change is synced
- [ ] All persona changes version-controlled with clear, descriptive commit messages
- [ ] `CLONE_REPO_PAT` secret configured in Control Tower repo

## Correct edit workflow

```
1. Edit fleet/clone/AI_CLONE_PERSONA.md or AI_CLONE_MANIFEST.md in Control Tower
2. Open PR in Control Tower — human review required
3. Merge PR — sync-to-clone.yml pushes changes to AI Clone repo automatically
4. Verify sync completed in GitHub Actions
5. Update fleet/FLEET_STATUS.md
```

## README notice (add to top of AI Clone repo README)

```markdown
> ⚠️ **Do not edit this repository directly.** This repo is managed by the [lippytm.ai Control Tower](https://github.com/lippytm/lippytm-lippytm.ai-tower-control-ai). All persona and identity changes must go through `fleet/clone/` and are synced automatically.
```

## Security checklist

- [ ] No real credentials in persona or identity files
- [ ] `CLONE_REPO_PAT` stored in Control Tower secrets only
- [ ] Human approval required before any persona change is synced

## Next actions

1. Add "do not edit directly" notice to README
2. Verify `sync-to-clone.yml` workflow is running successfully
3. Confirm `CLONE_REPO_PAT` secret is set
4. Review `fleet/clone/AI_CLONE_PERSONA.md` is current
5. Update `fleet/repos.yml` status
