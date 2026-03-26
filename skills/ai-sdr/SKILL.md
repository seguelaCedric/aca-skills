---
name: ai-sdr
description: "Autonomous AI SDR orchestrator. Chains the individual SDR skills together. Use when the user gives a high-level SDR task like 'find 100 roofers in Texas and sell them AI calling', 'run the SDR loop', or wants the full autonomous pipeline."
disable-model-invocation: true
---

# AI SDR Orchestrator

This skill chains the individual SDR skills together for end-to-end autonomous outreach.

## Available SDR Skills

| Skill | Purpose |
|-------|---------|
| `/sdr-status` | Check pipeline health, budget, activity |
| `/sdr-research` | Find and import leads from LinkedIn |
| `/sdr-score` | Trigger ICP analysis, route by tier |
| `/sdr-segment` | Segment leads by tier, industry, channel |
| `/sdr-write-emails` | Write personalized emails, inject into sequences |
| `/sdr-write-linkedin` | Write personalized LinkedIn notes/DMs, inject into campaigns |

## For a new target (e.g. "find 100 roofers in Texas and sell them AI calling")

1. Check if product + ICP exist for this offering. If not, create via ACA MCP `create_product` and `create_icp`
2. Create an SDR agent profile via `create_agent_profile` (for reply handling)
3. Create a knowledge document via `create_knowledge_document` (so the reply agent has context)
4. Run `/sdr-research` to import leads
5. Run `/sdr-score` to analyze and tier them
6. Run `/sdr-segment` to organize by channel
7. Run `/sdr-write-linkedin` for LinkedIn leads
8. Run `/sdr-write-emails` for email leads
9. Run `/sdr-status` to confirm everything is in motion

## For the hourly Cowork loop

```
/sdr-status
/sdr-score
/sdr-write-linkedin
/sdr-write-emails
```

Add `/sdr-research` if pipeline needs refill.

## Reply handling

Replies are handled automatically by the ACA autopilot engine (conversation-autopilot.ts).
The SDR agent profile attached to conversations handles intent classification, auto-replies,
meeting booking via GHL, and escalation. No skill needed for this.

## Important

- The existing `analyze-company` system handles lead research (website scraping + Unipile LinkedIn data + LLM analysis). Cowork browser access is available for manual research but the automated pipeline is usually better for scale.
- All outreach goes through existing ACA plumbing (campaigns + email sequences). Claude writes the content, the engines handle delivery, rate limits, and retries.
