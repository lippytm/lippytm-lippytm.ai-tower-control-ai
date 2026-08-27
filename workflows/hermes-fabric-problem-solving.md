# Hermes + Fabric Problem Solving Workflow

## Purpose
Use Hermes fine-tuned models (NousResearch) and Fabric prompt patterns (danielmiessler/fabric)
as an advanced reasoning and pattern-extraction layer to decompose problems, extract insights,
and generate monetization strategies across any domain in the lippytm.ai network.

## Why Hermes + Fabric
- **Hermes models** are fine-tuned for strong instruction-following and multi-step reasoning,
  offering a diverse, open-weight alternative to proprietary models.
- **Fabric** provides a curated, reusable library of prompt patterns that turn any AI call
  into a structured, repeatable pipeline.
- Together they reduce single-model dependency, increase problem-solving diversity, and
  accelerate monetization ideation and execution.

## Inputs
- A problem statement, idea, document, lead note, or domain question
- Optional: Fabric pattern name to apply (see pattern examples below)
- Optional: target output type (analysis, summary, strategy, action list, email draft)

## Steps

### 1. Define the problem or input
Write a clear 1–3 sentence problem statement. Examples:
- "We have 5 affiliate links but no structured promotion system."
- "A lead asked about business funding but we have no intake workflow."
- "Our daily action list is not connected to revenue."

### 2. Select a Fabric pattern
Choose the best-fit Fabric pattern for the task:

| Pattern | Best for |
|---|---|
| `extract_wisdom` | Long documents, videos, meetings — pull out key insights |
| `create_summary` | Condense any content to essentials |
| `analyze_claims` | Evaluate truth and risk in content or proposals |
| `create_formal_email` | Draft professional outreach or follow-up |
| `create_idea_compass` | Explore an idea from multiple angles |
| `rate_content` | Score and assess quality of any content |
| `create_keynote` | Structure a presentation or pitch |
| `write_essay` | Produce a structured written argument or explainer |

Full pattern list: https://github.com/danielmiessler/fabric/tree/main/patterns

### 3. Run the pattern via Hermes or compatible model
**CLI example (Fabric installed):**
```bash
echo "Your problem or document text here" | fabric --pattern extract_wisdom --model hermes3
```

**Manual (no CLI):**
Copy the Fabric pattern system prompt from the patterns folder and paste it into
Hermes (via API or local run) or any compatible chat UI with the content as the user message.

### 4. Capture outputs to GitHub
Save structured outputs as:
- `docs/` — insight summaries, analysis docs
- `products/` — monetization strategy notes
- `workflows/` — prompt pipeline templates
- GitHub Issues — action items and next steps

### 5. Review and act
- All customer-facing outputs require human review before publication.
- Flag any financial, legal, or high-risk claims for RiskGate review.
- Convert actionable insights into GitHub issues with owner and due date.

## Output Types
- Structured problem-solution maps
- Monetization strategy drafts
- Content distillation summaries
- Reusable Fabric prompt pipeline templates
- Multi-step reasoning chains for AI coding or product planning
- Lead classification notes

## Risk Level
Medium — human review required for customer-facing and financial outputs.

## Rollback
If a Hermes model or Fabric pattern produces low-quality or misleading output:
- Discard the output and retry with a different pattern or model.
- Fall back to ChatGPT or Claude for the same task.
- Log the failure pattern in a GitHub issue for future pattern improvement.

## References
- Hermes models: https://huggingface.co/NousResearch
- Fabric framework: https://github.com/danielmiessler/fabric
- Agent definition: `agents/agent-registry.yml` → `hermes_fabric_problem_solver`
- Integration definition: `integrations/integration-registry.yml` → `hermes_fabric_to_control_tower`
- Platform entry: `registries/platforms.yaml` → `Hermes + Fabric`

## Owner / Next Action
- Owner: lippytm
- Next action: Install Fabric CLI, identify first 3 problem statements to run through workflow,
  save outputs to GitHub, and create issues for any actionable items.
