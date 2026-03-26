---
name: sdr-segment
description: "Segment scored SDR leads into targeted lists by tier, industry, role, or channel readiness. Use when the user says 'segment leads', 'create lists by tier', 'split by industry', 'who has LinkedIn vs email only', or needs to organize leads before outreach."
---

# SDR Lead Segmentation

All data comes from ACA MCP tools. No SQL needed - tools are automatically scoped to the user's organization.

## Step 1 - Get scored leads

Use ACA MCP `search_contacts_and_leads`:
- Search for contacts with tag `sdr_ready_tier1` (not yet `sdr_outreach_sent`)
- Search for contacts with tag `sdr_ready_tier2` (not yet `sdr_outreach_sent`)

For each batch, use `get_contact` to get full details (LinkedIn URL, email, enrichment data).

## Step 2 - Segment by criteria

**By channel readiness:**
- Has LinkedIn URL -> LinkedIn campaign eligible
- Has email -> email sequence eligible
- Has both -> multi-channel (LinkedIn first, email fallback)
- Has neither -> skip or needs enrichment

**By tier:** Already tagged from `/sdr-score`

**By industry/company size/role:** Read from contact's enrichment_data via `get_contact`

## Step 3 - Create lists for each segment

Use ACA MCP `create_lead_list` for each segment:
- name: "SDR - [Segment Name] - [date]"
- description: what this segment represents

Use ACA MCP `add_contacts_to_list` to populate each list.

## Step 4 - Tag contacts

Use ACA MCP `add_contact_tag` to tag contacts with their segment for tracking.

## Report

```
Segmentation complete.

Lists created:
- [List Name]: X contacts (LinkedIn: Y, Email: Z)
- [List Name]: X contacts (LinkedIn: Y, Email: Z)

Channel breakdown:
- LinkedIn + Email: X
- LinkedIn only: X
- Email only: X
- Neither: X (need enrichment)

Next: /sdr-write-linkedin for LinkedIn segments, /sdr-write-emails for email segments
```
