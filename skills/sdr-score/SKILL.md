---
name: sdr-score
description: "Trigger ICP analysis and scoring on unscored leads, then route them by tier. Use when leads need to be scored, analyzed, or when the user says 'score these leads', 'analyze the list', or 'who should we contact first'."
---

# SDR Lead Scoring & Routing

All data comes from ACA MCP tools. No SQL needed - tools are automatically scoped to the user's organization.

## Step 1 - Find unscored leads

Use ACA MCP `search_contacts_and_leads` to find contacts that haven't been scored:
- Filter by tags that do NOT include `sdr_ready_tier1`, `sdr_ready_tier2`, `sdr_skip`, `sdr_analysis_triggered`
- Or use `list_lead_lists` to find active lists, then `get_lead_list` to get members and cross-reference

Use `get_contact` on each to check if they have enrichment data / ICP scores.

## Step 2 - Trigger AI analysis

For contacts without enrichment, use the `ai-sdr-run` edge function:

```
POST {supabase_url}/functions/v1/ai-sdr-run
{ "organization_id": "<from list_accessible_organizations>", "action": "trigger_scoring", "contact_ids": ["id1", "id2", ...] }
```

This calls the existing `analyze-companies-batch` pipeline which scrapes websites, pulls LinkedIn data, and runs LLM-based ICP scoring.

Tag each contact `sdr_analysis_triggered` via ACA MCP `add_contact_tag`.

Report: "Triggered analysis for X contacts. Results available in ~5-10 minutes."

## Step 3 - Route scored leads

Find contacts that have been analyzed but not yet routed:
- Use `search_contacts_and_leads` to find contacts with `sdr_analysis_triggered` tag but without `sdr_ready_tier1`, `sdr_ready_tier2`, or `sdr_skip`
- Use `get_contact` on each to read their ICP score and decision-maker score from enrichment data

## Step 4 - Tag by tier

For each scored contact, use ACA MCP `add_contact_tag`:

- **Tier 1** (icp_score >= 80 AND decision_maker_score >= 70):
  Tag: `sdr_ready_tier1`
  Add note via `add_contact_note`: "SDR Tier 1 - ICP: {score}, DM: {score}. Need: {primary_need}"

- **Tier 2** (icp_score >= 50, OR icp_score >= 40 AND decision_maker_score >= 80):
  Tag: `sdr_ready_tier2`

- **Skip** (below both thresholds):
  Tag: `sdr_skip`

## Report

```
Scoring complete.
- Triggered analysis: X new contacts
- Routed: Y contacts (Z Tier 1, W Tier 2, V skipped)
- Tier 1 ready for /sdr-write-linkedin or /sdr-write-emails:
  [Name] @ [Company] - ICP: X, DM: Y - Need: [primary_need]
```
