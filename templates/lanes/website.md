# Website Lane Checklist

Apply this after the universal repo templates. For: `lippytm.ai`, `balletcrypto.github.io`, `gatsby-starter-blog`.

## Foundation checklist

- [ ] README has clear homepage purpose and primary CTA
- [ ] README states who the site is for and what action a visitor should take
- [ ] `docs/architecture.md` describes tech stack, hosting, and deployment method
- [ ] `docs/runbook.md` covers deploy, rollback, and DNS change procedures
- [ ] Contact and support path documented (email, form, or chat link)
- [ ] Dependabot enabled for npm/pip/gem dependencies

## Security checklist

- [ ] No API keys or secrets in frontend code
- [ ] Environment variables used for all dynamic config
- [ ] No customer data stored in public repo

## Compliance checklist

- [ ] No unsupported income, funding, legal, or outcome guarantees on any page
- [ ] Privacy policy link if collecting any user data
- [ ] Human review before publishing customer-facing content

## Productization checklist

- [ ] Clear CTA connected to revenue path (lippytmai.getbizfunds.com, offer page, or affiliate link)
- [ ] Contact form or lead capture connected to CRM or ManyChat
- [ ] Analytics or tracking plan (no PII in logs)

## Next actions after applying templates

1. Add `docs/architecture.md`
2. Add `docs/runbook.md`
3. Enable Dependabot
4. Add CI workflow
5. Update `fleet/repos.yml` status to `active_buildout`
