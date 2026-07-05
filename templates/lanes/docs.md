# Docs Lane Checklist

Apply this after the universal repo templates. For: `docs`, `The-Encyclopedia-of-Law-...`.

## Foundation checklist

- [ ] Content organized by audience: beginners, practitioners, AI agents
- [ ] Table of contents added to every large document
- [ ] "Last reviewed" date on every legal, tax, or compliance-adjacent document
- [ ] Compliance notice on all legal/tax/financial reference content
- [ ] Docs are AI-agent-readable: clear headings, no jargon blocks, structured YAML where useful

## Required compliance notice (for legal, tax, or financial reference docs)

> **Compliance notice:** This repository contains informational and reference content only. It does not constitute legal, tax, financial, investment, medical, or professional advice. Consult a qualified professional before making any decisions.

## Document structure template

```markdown
# [Document Title]

> **Audience:** [beginners / practitioners / AI agents]
> **Last reviewed:** YYYY-MM-DD
> **Compliance notice:** [include if legal/tax/financial content]

## Table of contents

1. [Section 1](#section-1)
2. [Section 2](#section-2)

## Section 1

[Content]

## Section 2

[Content]
```

## Compliance checklist

- [ ] No legal, tax, financial, or professional advice claims
- [ ] Review dates present on all compliance-adjacent files
- [ ] Human review before publishing any legal reference content
- [ ] AI-generated content labeled as such where required

## Next actions after applying templates

1. Add compliance notice to README
2. Add review dates to all files
3. Organize content by audience
4. Add table of contents to large docs
5. Human review before publishing legal content
6. Update `fleet/repos.yml`
