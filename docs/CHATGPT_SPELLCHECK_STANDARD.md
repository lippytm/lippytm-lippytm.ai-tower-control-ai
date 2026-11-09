# ChatGPT Spellcheck Standard

This standard applies to everything in this repository that is created for, by, or about ChatGPT.

## Scope

Run spellcheck for ChatGPT-related content, including:

- ChatGPT prompts.
- System prompts and agent instructions.
- Bot scripts and chatbot copy.
- README sections that mention ChatGPT or OpenAI.
- API examples involving ChatGPT or OpenAI.
- Markdown documentation.
- YAML workflows that route ChatGPT-related automation.
- JSON configuration files for ChatGPT, bots, swarms, prompts, and connectors.
- Marketing, support, onboarding, and educational content generated with ChatGPT.

## Required Command

```bash
npm run spellcheck
```

This command runs `cspell` across supported repository files.

## ChatGPT Content Rules

- Correct ordinary spelling mistakes before merge.
- Keep official product and ecosystem names consistent: `ChatGPT`, `OpenAI`, `GPT`, `AgentBots`, `RiskGate`, `lippytm`, and related terms.
- Add legitimate brand names, repo names, product names, and project-specific vocabulary to `cspell.json`.
- Do not add misspellings to the dictionary just to make the check pass.
- Do not disable spellcheck globally for ChatGPT content.
- Treat spelling, clarity, and category separation as part of Quality Job #1.

## Prompt Quality Checklist

Before merging ChatGPT prompt content, confirm:

- [ ] The prompt is spelled correctly.
- [ ] ChatGPT/OpenAI/GPT naming is consistent.
- [ ] Instructions are clear and not contradictory.
- [ ] The intended output is obvious.
- [ ] Safety, privacy, and human review boundaries are clear when relevant.
- [ ] The content label is clear when mixing business, education, advertising, fiction, or experimental R&D.

## Dictionary Policy

Use `cspell.json` for accepted project vocabulary only. Good entries include:

- product names
- repository names
- bot names
- domain names
- technical acronyms
- intentional lippytm ecosystem terms

Bad entries include:

- accidental typos
- unclear abbreviations
- secret values
- customer names or private data
- misspelled words that should be corrected in the source

## System Rule

Anything about ChatGPT should be checked for spelling before it becomes reusable system material.
