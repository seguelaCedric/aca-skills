---
name: sdr-status
description: "Check AI SDR pipeline health, budget, and activity. Use when the user asks about SDR status, pipeline health, how many leads are ready, LinkedIn budget, or outreach progress."
---

# SDR Status Check

All data comes from ACA MCP tools. No SQL needed - tools are automatically scoped to the user's organization.

## Steps

1. **Get contacts by tag** via ACA MCP `search_contacts_and_leads`:
   - Search with tag filter `sdr_ready_tier1` -> count = Tier 1 ready
   - Search with tag filter `sdr_ready_tier2` -> count = Tier 2 ready
   - Search with tag filter `sdr_outreach_sent` -> count = outreach sent
   - Search with tag filter `sdr_connected` -> count = connected
   - Search with tag filter `sdr_skip` -> count = skipped

2. **Get LinkedIn budget** via ACA MCP `list_sender_accounts` (channel: "linkedin")

3. **Get email capacity** via ACA MCP `list_email_mailboxes`

4. **Get active campaigns** via ACA MCP `list_campaigns`

5. **Get active sequences** via ACA MCP `list_email_sequences`

## Report Format

```
SDR Pipeline
  Tier 1 ready:       X (personalized outreach pending)
  Tier 2 ready:       X (bulk sequence pending)
  Outreach sent:      X
  Connected:          X
  Skipped:            X

LinkedIn Budget (today)
  [Account]: connected
  [Account]: connected
  Total accounts: X

Email
  Mailboxes: X connected
  Active sequences: X

Active Campaigns: X
```
