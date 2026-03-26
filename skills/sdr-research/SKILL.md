---
name: sdr-research
description: "Find and import leads for SDR outreach. Searches LinkedIn by role, industry, location. Creates lead lists. Use when the user says 'find leads', 'import from LinkedIn', 'get me a list of [role] in [location]', 'find [number] [type] companies', or needs to refill the SDR pipeline."
---

# SDR Lead Research & Import

You have access to ACA MCP tools for LinkedIn search and lead import.

## When the user gives a target (e.g. "find 100 roofers in Texas")

### Step 1 - Resolve search parameters

Use ACA MCP `search_linkedin_parameters` to convert human-readable terms into LinkedIn filter IDs:

- **Locations**: `search_linkedin_parameters` with parameter_type "location", keywords "Texas"
- **Industries**: `search_linkedin_parameters` with parameter_type "industry", keywords "Construction"
- **Seniorities**: `search_linkedin_parameters` with parameter_type "seniority", keywords "Owner"
- **Companies**: `search_linkedin_parameters` with parameter_type "company", keywords "..."

### Step 2 - Import leads

Use ACA MCP `start_linkedin_import`:
- `list_name`: descriptive name like "Roofers in Texas - [date]"
- `keywords`: the role/title to search for (e.g. "roofing contractor owner")
- `location_ids`: from step 1
- `industry_ids`: from step 1 (if applicable)
- `max_leads`: the number requested (default 100, max 2500)

### Step 3 - Monitor progress

Use ACA MCP `get_linkedin_import_job` with the job_id returned from step 2.
Report progress: "Imported X/Y leads so far..."

If the import takes time, let the user know and suggest checking back with `/sdr-status`.

### Step 4 - Verify the list

Use ACA MCP `get_lead_list` to confirm leads were imported and show a sample.

## When refilling the pipeline automatically

Check existing ICPs to understand the target profile:
- Use ACA MCP `list_icps` to see defined customer profiles
- Use the ICP's target_titles, target_industries, pain_points to inform the search
- Import into a new list named "SDR Auto-Import [date] - [ICP name]"

## Apify integration (if available)

If the user mentions Apify or wants to scrape specific sources:
- This requires an Apify MCP server to be connected
- Common actors: LinkedIn Profile Scraper, Google Maps Scraper, Yellow Pages Scraper
- Import scraped results into ACA via `bulk_create_leads` or `create_contact`

## Important notes

- LinkedIn import uses your connected Unipile accounts - it's rate limited by LinkedIn
- Max 2500 leads per import job
- Leads are imported as CRM contacts linked to the new lead list
- After import, run `/sdr-score` to analyze and score them
