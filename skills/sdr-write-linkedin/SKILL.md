---
name: sdr-write-linkedin
description: "Write personalized LinkedIn connection notes and DMs for SDR leads, inject into campaigns via set_campaign_lead_content. Use when the user says 'write LinkedIn messages', 'personalize connection requests', 'write DMs', or after scoring/segmentation for LinkedIn outreach."
---

# SDR LinkedIn Writer

All data comes from ACA MCP tools. No SQL needed - tools are automatically scoped to the user's organization.

Cowork has browser access for deeper Tier 1 research (LinkedIn profiles, company news, recent posts).

## Prerequisites

- A LinkedIn campaign must exist with template variables like `{{generated_data.connection_note}}`
- Campaign must be activated with a lead list (so campaign_lead_progress rows exist)
- Contacts should be scored (run `/sdr-score` first)

## Step 1 - Find the campaign

Use ACA MCP `list_campaigns` to find the SDR LinkedIn campaign.

If none exists, use `create_campaign` with steps:
```
connection_request(message: "{{generated_data.connection_note}}") -> delay(3 days) -> if_connected -> message("{{generated_data.dm_message}}") -> end
```
Assign sender accounts via `list_sender_accounts` (channel: "linkedin").
Assign lead list, activate via `update_campaign_status`.

## Step 2 - Pull leads to write for

Use ACA MCP `search_contacts_and_leads`:
- Filter by tags: `sdr_ready_tier1` or `sdr_ready_tier2`
- Exclude tags: `sdr_outreach_sent`, `sdr_do_not_contact`
- Filter: must have LinkedIn URL

For each, use `get_contact` for enrichment data and ICP scores.

Limit to `$ARGUMENTS` if provided, default 20.

## Step 3 - Research (Tier 1)

For Tier 1 leads, read enrichment_data for:
- Company description, growth signals, tech stack, recent posts
- primary_need and primary_need_reasoning from ICP scoring
- If in Cowork with browser, visit their LinkedIn profile for recent activity

## Step 4 - Write personalized content

For each lead:

**Connection note** (MAX 300 characters):
- No emojis, no "I noticed", no "I'd love to connect"
- Sound like a peer
- Reference their SPECIFIC situation
- One clear reason to connect

**Opening DM** (after they accept):
- DO NOT pitch
- Reference something specific
- Ask a genuine question
- 2-3 sentences

**Follow-up DM** (if no reply):
- Different angle, share something valuable
- 2 sentences

## Step 5 - Inject into campaign

Use ACA MCP `set_campaign_lead_content`:

```json
{
  "campaign_id": "<campaign_id>",
  "leads": [
    {
      "contact_id": "<contact_id>",
      "generated_data": {
        "connection_note": "Your 300-char note here",
        "dm_message": "Opening DM here",
        "followup_message": "Follow-up here"
      }
    }
  ]
}
```

## Step 6 - Tag

Tag each contact `sdr_outreach_sent` via `add_contact_tag`.

## Messaging Rules

- Connection notes: MAX 300 characters (LinkedIn hard limit)
- Never use emojis
- Never pitch in first DM
- Sound like a human peer
- Reference something SPECIFIC
- Ask questions more than statements
- Use regular hyphens, never em dashes
