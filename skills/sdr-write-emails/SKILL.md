---
name: sdr-write-emails
description: "Write personalized cold email sequences for SDR leads and inject them into existing email sequences. Use when the user says 'write emails', 'create email outreach', 'personalize the sequence', 'write cold emails for these leads', or after scoring/segmentation is done."
---

# SDR Email Writer

All data comes from ACA MCP tools. No SQL needed - tools are automatically scoped to the user's organization.

## Prerequisites

- An email sequence must exist with steps and mailboxes configured
- Contacts should be scored (run `/sdr-score` first)

## Step 1 - Find or create the SDR sequence

Use ACA MCP `list_email_sequences` to find an existing SDR sequence.

If none exists, use `create_email_sequence`:
- 3 email steps with delays (email -> 3 day delay -> email -> 5 day delay -> email)
- Bodies can be placeholders - they'll be overridden per lead via custom_data
- Assign mailboxes via settings.mailbox_ids (use `list_email_mailboxes` for IDs)
- Set stop_on_reply: true

## Step 2 - Pull leads to write for

Use ACA MCP `search_contacts_and_leads`:
- Filter by tags: `sdr_ready_tier1` or `sdr_ready_tier2`
- Exclude tags: `sdr_outreach_sent`, `sdr_do_not_contact`
- Filter: must have email

For each contact, use `get_contact` to read enrichment data and ICP scores.

Limit to `$ARGUMENTS` if provided (e.g. `/sdr-write-emails 20`), default 20.

## Step 3 - Ensure leads exist

Contacts need a matching `leads` record. For each:
- Use ACA MCP `create_lead` with email, first_name, last_name, company, job_title, source_id (contact ID)
- Idempotent - duplicates ignored

## Step 4 - Write personalized emails

For each lead, write 3 emails using their enrichment data:

**Email 1 (opener):** Short specific subject. 3-4 sentences referencing their situation. End with a question.
**Email 2 (follow-up):** Different angle. 2-3 sentences. New proof point or insight.
**Email 3 (breakup):** 2 sentences. No pressure. Leave door open.

## Step 5 - Enroll with personalized content

Use ACA MCP `enroll_leads` with custom_data overrides:

```json
{
  "sequence_id": "<sequence_id>",
  "lead_ids": ["<lead_id>"],
  "custom_data": {
    "<lead_id>": {
      "custom_email_1_subject": "personalized subject",
      "custom_email_1_body": "<p>Personalized body</p>",
      "custom_email_2_subject": "follow-up subject",
      "custom_email_2_body": "<p>Follow-up body</p>",
      "custom_email_3_subject": "breakup subject",
      "custom_email_3_body": "<p>Breakup body</p>"
    }
  }
}
```

## Step 6 - Tag and activate

- Tag each contact `sdr_outreach_sent` via `add_contact_tag`
- Activate sequence if needed via `toggle_email_sequence`

## Messaging Rules

- Never use emojis
- Never use "I hope this finds you well" or "I wanted to reach out"
- Sound like a human, not a bot
- 3-5 sentences max per email
- Reference something SPECIFIC about them
- One soft CTA per email (question, not demand)
- Use regular hyphens, never em dashes
- Email bodies must be HTML (wrap in `<p>` tags)
