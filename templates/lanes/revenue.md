# Revenue Lane Checklist

Apply this after the universal repo templates. For: `lippytmai.getbizfunds.com-`, `biz-funds-intake`.

## Foundation checklist

- [ ] README clearly states the revenue model and compliance notice
- [ ] `docs/business-model.md` explains intake flow and revenue path
- [ ] `docs/support-playbook.md` ensures consistent lead responses
- [ ] `RISK_GATE.md` copied and reviewed before any live workflow runs
- [ ] Intake flow documented: lead → form → CRM → follow-up → qualified → offer

## Security checklist

- [ ] No real payment credentials or Stripe keys in repo
- [ ] All webhook secrets use environment secrets only
- [ ] No customer PII stored in public repo
- [ ] Human review required before any payment or billing workflow goes live

## Compliance checklist (required — high risk lane)

- [ ] Compliance notice on README, every page, and every form
- [ ] No guaranteed income, funding, profit, legal outcome, or investment return claims
- [ ] Language reviewed by a qualified professional before publication
- [ ] Human-approved before any customer-facing content is published

> **Required compliance notice:** Nothing in this repository constitutes a guarantee of funding approval, income, profit, legal outcomes, tax outcomes, investment returns, or trading results. All tools and services are for educational and automation assistance only.

## Productization checklist

- [ ] Offer language is realistic and human-reviewed
- [ ] Referral/affiliate tracking is labeled correctly
- [ ] Support path defined for every lead who does not convert

## Next actions after applying templates

1. Add compliance notice to README
2. Document intake flow in `docs/business-model.md`
3. Add `RISK_GATE.md`
4. Add `docs/support-playbook.md`
5. Human review before going live
6. Update `fleet/repos.yml` status and risk_level
