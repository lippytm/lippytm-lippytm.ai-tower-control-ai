# Programmer and Blockchain Developer Training CRM

This CRM layer helps Prompt #11 organize people, learning paths, training offers, coaching workflows, progress tracking, and support for programmers and blockchain developers.

## Purpose

The CRM should help teach and train people to become better programmers and blockchain developers by connecting learners to:

- intake forms
- skill assessments
- learning paths
- GitHub practice tasks
- project milestones
- mentorship notes
- progress dashboards
- support follow-ups
- product and service offers
- Prompt #11 Engines

## CRM Operating Law

```text
Lead -> Intake -> Skill Profile -> Learning Path -> Practice Task -> Review -> Progress Update -> Next Step.
```

## CRM Learner Record

```yaml
learner_record:
  learner_id: LRN-0001
  name: null
  contact_status: new|active|paused|completed|lost
  audience_type: beginner|student|career-changer|business-owner|developer|creator
  goals:
    - learn programming
    - learn blockchain basics
    - build projects
    - improve GitHub skills
  current_skill_level: beginner|intermediate|advanced|unknown
  preferred_path: programming|blockchain|ai-tools|web-development|automation|github|mixed
  related_offer: null
  assigned_learning_path: null
  current_task: null
  next_action: null
```

## Training Paths

### Programming Foundations

Focus:

- basic computer literacy
- command line basics
- GitHub basics
- HTML/CSS/JavaScript basics
- Python basics
- debugging habits
- documentation habits

### Web and App Development

Focus:

- frontend basics
- backend basics
- APIs
- databases
- deployment concepts
- project structure

### AI Tools and Automation

Focus:

- ChatGPT-assisted planning
- GitHub issue workflows
- prompt packs
- automation workflows
- QA checklists
- documentation

### Blockchain Developer Foundations

Focus:

- blockchain concepts
- wallet and network basics
- smart contract concepts
- test networks and simulation
- security mindset
- documentation and review

Blockchain training should remain education-first and sandbox-first unless separately reviewed.

### GitHub Career Practice

Focus:

- issues
- pull requests
- README writing
- small commits
- code review
- project portfolios
- proof-of-work

## CRM Pipeline Stages

```yaml
crm_pipeline:
  - new_lead
  - intake_needed
  - assessed
  - path_assigned
  - first_task_started
  - review_needed
  - progressing
  - offer_ready
  - completed_module
  - next_path_ready
```

## Prompt #11 CRM Engines

The CRM should connect to:

- Intake Engine
- Classification Engine
- Planning Engine
- Documentation Engine
- QA Engine
- Awareness Engine
- Revenue Priority Engine
- Repo Communication Engine

## Training CRM Best Practices

1. Start learners with small wins.
2. Use GitHub as proof-of-work.
3. Keep tasks beginner-safe and reviewable.
4. Separate education from financial advice.
5. Use sandbox practice for blockchain topics.
6. Track progress clearly.
7. Turn repeated lessons into reusable modules.
8. Turn student questions into better docs.
9. Use projects to build confidence.
10. Give each learner a next action.

## Principle

A training CRM should not just store contacts. It should guide learners from interest to skill, from skill to project, from project to portfolio, and from portfolio to opportunity.
