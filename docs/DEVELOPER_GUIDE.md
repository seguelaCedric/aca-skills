# ACA Skills Plugin - Developer Guide

Build custom Claude Code skills on top of the ACA (Automated Client Acquisition) platform. This guide covers the MCP tools and resources available to your skills, the plugin structure, and best practices.

---

## 1. Architecture Overview

### How It Works

```
Claude Code  --->  ACA MCP Server  --->  Supabase (PostgreSQL + Edge Functions)
  (your skill)       (auth + routing)       (data + business logic)
```

1. **You connect Claude Code to ACA's MCP server** via your MCP configuration. The server URL and API key are provided when you create an MCP API key in the ACA dashboard.
2. **The MCP server handles authentication and organization scoping automatically.** Every tool call is scoped to the authenticated user's organization -- you never pass org IDs manually (unless you use `switch_organization` for agency/multi-tenant scenarios).
3. **Your skill gets two things:**
   - **Tools** -- actions that read, create, update, or delete data (100+ tools)
   - **Resources** -- read-only snapshots of organizational data (20+ resources)

### Mental Model

Think of ACA MCP as a comprehensive API for:
- Content creation and publishing (ideas, blueprints, generation, carousels, autopilots)
- A CRM with contacts, leads, pipelines, and lead lists
- Multi-channel outreach (LinkedIn, email, WhatsApp, Instagram campaigns)
- A programmatic video editor (Remotion compositions pushed via code)
- AI agent configuration (autopilot profiles, knowledge base, lead magnets)

Your skill orchestrates these tools to automate workflows that would otherwise require clicking through the ACA dashboard.

---

## 2. Available MCP Tools (Complete Reference)

### Help & Documentation

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `get_help` | Get documentation about ACA MCP tools and usage | `topic`: overview, ideas, library, content_generation, blueprints, organizations, campaigns, autopilots, all | Documentation text |

### Content Creation

#### Ideas

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_ideas` | List content ideas with filtering | `search`, `limit`, `offset`, `include_analysis` | Array of ideas |
| `get_idea` | Get full idea details including ai_analysis | `idea_id` (required) | Single idea with hooks, CTAs, talking points |
| `create_idea` | Save a content topic/idea (does NOT generate content) | `title` (required), `keywords`, `key_talking_points`, `emotional_triggers`, `content_framework`, `brand_voice_id`, `product_id`, `tag_ids`, `ai_analysis` | Created idea |
| `bulk_create_ideas` | Save multiple ideas at once (max 100) | `ideas[]` (required) -- same fields as create_idea | Array of created ideas |
| `update_idea` | Update an existing idea | `idea_id` (required), any idea field | Updated idea |
| `delete_ideas` | Delete one or more ideas | `idea_ids[]` (required) | Confirmation |
| `generate_content_ideas` | AI-generate content ideas based on parameters | Varies | Generated ideas |

#### Blueprints (Reusable Templates)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_blueprints` | List blueprint templates | `pipeline`, `is_active` | Array of blueprints |
| `get_blueprint` | Get full blueprint details | `blueprint_id` (required) | Blueprint with prompts and config |
| `get_blueprint_schema` | Get the complete schema for creating blueprints | None | Schema documentation |
| `create_blueprint` | Create a blueprint template | `name` (required), `pipeline` (required: rich_article, social_media_post, image_only, generative_video_oneshot, video_script, storyboard_video_longform), `master_prompt`, `image_prompt`, `model_config`, `structure`, `tags` | Created blueprint |
| `update_blueprint` | Update a blueprint template | `blueprint_id` (required), any blueprint field | Updated blueprint |
| `delete_blueprint` | Delete a blueprint | `blueprint_id` (required) | Confirmation |

#### Content Generation

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `trigger_content_generation` | GENERATE content (articles, videos, images, carousels) | `blueprint_id` (required), `pipeline` (required), `items[]` (required -- each with `idea_id` or `idea_title`, `slot_values`), `library_elements`, `output_config`, `auto_approve` | Generation job with job_id |
| `create_carousel` | Quick carousel generation from a topic | `idea` (required), `blueprint_id`, `brand_voice_id`, `talking_points[]`, `slide_count`, `template`, `custom_palette`, `aspect_ratio` | Generation job |
| `list_generation_jobs` | List generation jobs | `status` (queued, processing, review, completed, failed), `limit` | Array of jobs |
| `get_generation_job` | Get job details and outputs | `job_id` (required) | Job with outputs |

#### Submission & Publishing

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `submit_content` | Submit generated content for review/approval | Varies | Submission result |
| `publish_content` | Publish approved content | Varies | Publication result |
| `push_to_ghl` | Publish to social media via GHL/LeadConnector | `account_ids[]` (required), `content_output_id` or `content_output_ids[]`, `schedule_date`, `caption`, `post_type` (feed, reel, story, carousel) | Publication result |
| `list_publishing_accounts` | List all available publishing destinations | None | Array of accounts with account_id, platform, name |

#### Pipelines & Models Reference

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_pipelines` | List available content generation pipelines | None | Pipelines with required/optional models |
| `list_available_models` | List AI models by type | `model_type` (text_llm, image_generator, tts, image_to_video, world_simulator, face_swap) | Available models |
| `list_voices` | List available ElevenLabs voices | None | Voices with voice_id |

### Library Management

#### Brand Voices

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_brand_voices` | List all brand voice configurations | None | Array of brand voices |
| `get_brand_voice` | Get brand voice with visual identity details | `brand_voice_id` (required) | Full brand voice |
| `create_brand_voice` | Create a brand voice | `name` (required), `description`, `tone`, `style_guidelines`, `mood_keywords` | Created brand voice |
| `update_brand_voice` | Update a brand voice | `brand_voice_id` (required), `name`, `tone`, `color_palette`, `font_style`, `visual_style_description` | Updated brand voice |
| `delete_brand_voices` | Delete brand voices | `brand_voice_ids[]` (required) | Confirmation |

#### Characters

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_characters` | List AI characters/personas | `visual_style`, `gender` | Array of characters |
| `get_character` | Get full character details | `character_id` (required) | Character with visual + voice config |
| `create_character` | Create an AI character | `name` (required), `description`, `visual_style`, `gender`, `age_range`, `personality_traits`, `voice_selection` (ElevenLabs voice_id), `reference_image_urls` | Created character |
| `update_character` | Update a character | `character_id` (required), any character field, `add_reference_image_urls`, `remove_reference_image_urls` | Updated character |
| `delete_characters` | Delete characters | `character_ids[]` (required) | Confirmation |

#### Products

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_products` | List all products | None | Array of products |
| `get_product` | Get product with features, benefits, media | `product_id` (required) | Full product |
| `create_product` | Create a product | `name` (required), `description`, `features[]`, `key_benefits[]`, `category` | Created product |
| `update_product` | Update a product | `product_id` (required), any product field | Updated product |
| `delete_products` | Delete products | `product_ids[]` (required) | Confirmation |

#### ICPs (Ideal Customer Profiles)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_icps` | List all ICPs | None | Array of ICPs |
| `create_icp` | Create an ICP | `name` (required), `description`, `summary`, `pain_points[]`, `desires[]`, `objections[]`, `language_style` | Created ICP |
| `update_icp` | Update an ICP | `icp_id` (required), any ICP field | Updated ICP |
| `delete_icps` | Delete ICPs | `icp_ids[]` (required) | Confirmation |
| `set_product_icp_fit` | Set fit score (1-10) between product and ICP | `product_id` (required), `icp_id` (required), `fit_score` (required, 1-10), `fit_notes` | Fit record |
| `get_suggested_icps` | Get ICPs ranked by fit for products | `product_ids[]` (required) | Ranked ICPs |

#### Blocks (Hooks, Angles, CTAs, Story Elements)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_blocks` | List content blocks | `block_type` (hook, angle, cta, story_element) | Array of blocks |
| `create_block` | Create a content block | `block_type` (required), `content` (required), `name`, `tags` | Created block |
| `bulk_create_blocks` | Create multiple blocks (max 100) | `blocks[]` (required) | Array of created blocks |
| `delete_blocks` | Delete blocks | `block_ids[]` (required) | Confirmation |

#### Prompt Templates

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_prompt_templates` | List saved prompt template snippets | `prompt_type` (text, image), `pipeline_type` | Array of templates |
| `get_prompt_template` | Get full prompt template | `template_id` (required) | Template with content |
| `create_prompt_template` | Save a reusable prompt snippet | `name` (required), `prompt_content` (required), `prompt_type`, `description`, `category` | Created template |

#### Strategy Documents

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_strategy_documents` | List marketing plans/documents | `document_type` (lead_magnet, sales_strategy, content_calendar, funnel, email_sequence, landing_page, ad_copy, other) | Array of documents |
| `get_strategy_document` | Get document with full content | `document_id` (required) | Full document |
| `create_strategy_document` | Save a marketing reference document | `name` (required), `document_type` (required), `content`, `file_url`, `tags`, `related_product_ids`, `related_icp_ids` | Created document |
| `update_strategy_document` | Update a document | `document_id` (required), any document field | Updated document |
| `delete_strategy_documents` | Delete documents | `document_ids[]` (required) | Confirmation |

#### Knowledge Base (RAG)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_knowledge_documents` | List knowledge base documents | `status` (pending, processing, completed, failed) | Array of documents |
| `get_knowledge_document` | Get document with processing status | `document_id` (required) | Document with chunk count |
| `create_knowledge_document` | Create a knowledge doc from text (auto-chunked for RAG) | `name` (required), `content` (required), `description` | Created document |
| `delete_knowledge_documents` | Delete knowledge docs (removes chunks + embeddings) | `document_ids[]` (required) | Confirmation |

### Lead Generation & SDR

#### CRM Contacts

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_contacts` | List CRM contacts with search and filters | `search`, `status`, `pipeline_id`, `stage_id`, `tags[]`, `source`, `contact_type`, `outreach_status`, `min_score`, `max_score`, `sort_by`, `limit`, `offset` | Contacts with total count |
| `get_contact` | Get contact with identities, activities, notes | `contact_id` (required) | Full contact |
| `create_contact` | Create a CRM contact | `display_name` (required), `first_name`, `last_name`, `company`, `job_title`, `primary_email`, `primary_linkedin_url`, `pipeline_id`, `stage_id`, `tags[]`, `custom_fields` | Created contact |
| `update_contact` | Update a contact | `contact_id` (required), any contact field | Updated contact |
| `delete_contacts` | Delete contacts (max 100) | `contact_ids[]` (required) | Confirmation |
| `bulk_update_contacts` | Bulk update status/pipeline/tags (max 100) | `contact_ids[]` (required), `status`, `pipeline_id`, `stage_id`, `owner_user_id`, `tags[]` | Confirmation |
| `add_contact_tag` | Add a tag to a contact | `contact_id` (required), `tag` (required) | Confirmation |
| `remove_contact_tag` | Remove a tag from a contact | `contact_id` (required), `tag` (required) | Confirmation |
| `add_contact_note` | Add an internal note (supports markdown) | `contact_id` (required), `content` (required), `is_pinned` | Created note |
| `list_crm_pipelines` | List pipelines with stages | None | Pipelines with stage IDs |

#### Email Leads

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_leads` | List email leads with search | `search`, `source`, `email_status`, `limit`, `offset` | Array of leads |
| `get_lead` | Get lead with active enrollments | `lead_id` (required) | Full lead |
| `create_lead` | Create a lead (idempotent by email) | `email` (required), `first_name`, `last_name`, `company`, `job_title`, `linkedin_url`, `source` | Created/existing lead |
| `bulk_create_leads` | Create multiple leads (max 100) | `leads[]` (required) | Created leads + skip count |
| `search_contacts_and_leads` | Search across both CRM contacts and email leads | `query` (required), `limit` | Matches from both systems |

#### Lead Lists

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_lead_lists` | List lead lists (manual and smart) | `search`, `status`, `source_type`, `include_smart`, `limit`, `offset` | Array of lists |
| `get_lead_list` | Get list with paginated members | `list_id` (required), `include_members`, `members_limit`, `members_offset` | List with members |
| `create_lead_list` | Create a lead list | `name` (required), `description`, `source_type`, `contact_ids[]` | Created list |
| `update_lead_list` | Update list name/description/status | `list_id` (required), `name`, `description`, `status` | Updated list |
| `delete_lead_list` | Delete list and memberships | `list_id` (required) | Confirmation |
| `add_contacts_to_list` | Add contacts to list (max 500) | `list_id` (required), `contact_ids[]` (required) | Confirmation |
| `remove_contacts_from_list` | Remove contacts from list | `list_id` (required), `contact_ids[]` (required) | Confirmation |

#### LinkedIn Search & Import

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `search_linkedin_parameters` | Look up LinkedIn filter IDs (locations, industries, companies, etc.) | `parameter_type` (required: location, industry, company, school, skill, function, seniority), `keywords` (required), `account_id` | Matching filter IDs |
| `build_linkedin_search_url` | Build a LinkedIn search URL from filters | `keywords` (required), `platform` (linkedin, sales_navigator, recruiter), `geo_urns[]`, `network[]`, `industry_urns[]`, `company_urns[]` | Search URL |
| `start_linkedin_import` | Import leads from LinkedIn search into a list | `list_name` (required), `list_id`, `max_leads` (1-2500), `account_id`, `search_url` or `keywords` + filter IDs | Import job with job_id |
| `get_linkedin_import_job` | Check import job progress | `job_id` (required) | Progress, leads found/imported/skipped |
| `list_linkedin_import_jobs` | List recent import jobs | `status`, `limit` | Array of jobs |
| `cancel_linkedin_import` | Cancel a pending/running import | `job_id` (required) | Confirmation |
| `list_linkedin_connections` | List LinkedIn network connections | `search`, `account_id`, `limit`, `offset` | Array of connections |
| `get_linkedin_connection` | Get connection details + CRM link status | `connection_id` (required) | Full connection |

#### Lead Magnet Campaigns

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_lead_magnet_campaigns` | List lead magnet campaigns with stats | None | Campaigns with leads, DMs, monitored posts |
| `get_lead_magnet_campaign` | Get campaign details | `campaign_id` (required) | Full campaign |
| `create_lead_magnet_campaign` | Create a keyword-monitoring campaign | `account_id` (required), `name` (required), `trigger_keywords` (required), `dm_template`, `icp_id`, `ai_chatbot_enabled`, `lead_magnet_url`, `agent_profile_id` | Created campaign |
| `update_lead_magnet_campaign` | Update campaign settings | `campaign_id` (required), any campaign field | Updated campaign |
| `delete_lead_magnet_campaign` | Delete a campaign | `campaign_id` (required) | Confirmation |
| `toggle_lead_magnet_campaign` | Activate/deactivate a campaign | `campaign_id` (required), `is_active` (required) | Confirmation |
| `list_campaign_leads` | List leads captured by a campaign | `campaign_id` (required), `status`, `limit`, `offset` | Array of leads with scores |

### Email Outreach

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_email_sequences` | List email sequences with step/mailbox counts | None | Array of sequences |
| `get_email_sequence` | Get sequence with steps, settings, autopilot config | `sequence_id` (required) | Full sequence |
| `create_email_sequence` | Create an email sequence (starts as draft) | `name` (required), `steps[]` (each with `order`, `type`: email/delay/condition/ab_test, type-specific fields), `settings` (mailbox_ids, stop_on_reply, daily_limit, send_window, etc.) | Created sequence |
| `update_email_sequence` | Update sequence (partial settings merge) | `sequence_id` (required), `name`, `steps[]`, `status`, `settings` | Updated sequence |
| `delete_email_sequence` | Delete sequence and enrollments | `sequence_id` (required) | Confirmation |
| `toggle_email_sequence` | Activate or pause a sequence | `sequence_id` (required), `status` (active, paused) | Confirmation |
| `list_email_enrollments` | List enrolled leads with status | `sequence_id` (required), `status`, `limit`, `offset` | Array of enrollments |
| `enroll_leads` | Bulk enroll leads into a sequence | `sequence_id` (required), `lead_ids[]` (required) | Confirmation |
| `update_enrollment_status` | Update a single enrollment status | `enrollment_id` (required), `sequence_id` (required), `status` (required) | Confirmation |
| `list_email_mailboxes` | List connected email mailboxes | None | Array of mailboxes with IDs |

### Video Editor

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `push_remotion_code` | Push a Remotion TSX composition to the video editor | `code` (required -- self-contained TSX, no imports), `project_id` (omit to create new), `title` | Project with ID and editor URL |
| `list_video_projects` | List video editor projects | `limit` | Array of projects |
| `get_video_project` | Get project with Remotion code | `project_id` (required) | Project with remotion_code |
| `set_video_sound_effects` | Set sound effects on a project | `project_id` (required), `sound_effects[]` (each with `id`, `url`, `name`, `timestamp`, `duration`, `volume`) | Confirmation |
| `set_video_music` | Set background music | `project_id` (required), `url` (required), `title`, `volume` (0.0-1.0), `source` | Confirmation |
| `set_video_voiceover` | Set voiceover audio | `project_id` (required), `url` (required), `script`, `voice_id`, `word_timestamps[]` | Confirmation |
| `generate_video_tts` | Generate TTS voiceover via ElevenLabs and attach to project | `project_id` (required), `text` (required), `voice_id` | Voiceover with word timestamps |
| `generate_video_music` | Generate AI background music and attach to project | `project_id` (required), `prompt` (required), `duration_seconds`, `volume` | Music attachment |

### Campaign Builder (Multi-Channel Outreach)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_sender_accounts` | List available sender accounts for campaigns | `channel` (linkedin, email, whatsapp, instagram, telegram) | Array of accounts |
| `list_campaigns` | List outreach campaigns | `status`, `search`, `limit`, `offset` | Compact campaign list |
| `get_campaign` | Get campaign with sequence and lead progress | `campaign_id` (required), `include_sequence`, `include_leads_summary` | Full campaign |
| `create_campaign` | Create a campaign with step-based sequence DSL | `name` (required), `lead_list_id`, `sender_account_ids[]`, `steps[]` (each with `type`, message/delay/condition fields), `stop_on_reply`, `campaign_type`, `primary_channel` | Created campaign (draft) |
| `update_campaign` | Update a draft/paused campaign | `campaign_id` (required), any campaign field | Updated campaign |
| `update_campaign_status` | Change campaign status (active/paused/draft) | `campaign_id` (required), `status` (required) | Confirmation |
| `delete_campaigns` | Delete draft/paused campaigns | `campaign_ids[]` (required) | Confirmation |
| `set_campaign_lead_content` | Inject custom content for a specific lead in a campaign | Varies | Confirmation |

### AI Agents

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_agent_profiles` | List AI agent profiles | None | Array of profiles |
| `get_agent_profile` | Get profile with autopilot config | `profile_id` (required) | Full profile with rules, escalation |
| `create_agent_profile` | Create an agent profile | `name` (required), `description`, `config` (rules, require_approval, conversation_goal, system_instructions, escalation_rules, etc.), `is_default` | Created profile |
| `update_agent_profile` | Update a profile | `profile_id` (required), `name`, `description`, `config` | Updated profile |
| `delete_agent_profiles` | Delete profiles | `profile_ids[]` (required) | Confirmation |
| `set_default_agent_profile` | Set org default profile | `profile_id` (required) | Confirmation |

### Autopilots (Automated Content Production)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_autopilots` | List content autopilots | `status` (active, paused, archived) | Array of autopilots |
| `get_autopilot` | Get autopilot with content mix, destinations, pool stats | `autopilot_id` (required) | Full autopilot |
| `create_autopilot` | Create scheduled content automation | `name` (required), `content_mix[]` (required -- blueprint_id + weight), `frequency` (required -- amount + unit), `destinations[]` (required -- account_id + platform), `scheduling_mode`, `evergreen` | Created autopilot |
| `update_autopilot` | Update autopilot settings | `autopilot_id` (required), any field | Updated autopilot |
| `delete_autopilot` | Delete autopilot permanently | `autopilot_id` (required) | Confirmation |
| `toggle_autopilot_status` | Pause or activate | `autopilot_id` (required), `status` (active, paused) | Confirmation |
| `trigger_autopilot` | Run an autopilot NOW | `autopilot_id` (required) | Generation job_id |
| `sync_autopilot_pool` | Sync idea pool from configured tags | `autopilot_id` (required) | Sync result |
| `add_ideas_to_pool` | Add specific ideas to the pool | `autopilot_id` (required), `idea_ids[]` (required) | Confirmation |
| `list_pool_entries` | List pool entries with status | `autopilot_id` (required), `status`, `limit` | Pool entries |
| `recycle_autopilot_pool` | Recycle produced ideas back to available | `autopilot_id` (required), `include_failed` | Recycle result |

### Media & Assets

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `standalone_generate_image` | Generate an image using AI | Varies | Generated image URL |
| `check_image_status` | Check status of an image generation job | Varies | Status and URL |
| `render_carousel_slides` | Render carousel slide images | Varies | Rendered slide URLs |
| `list_saved_content` | List saved/bookmarked content | Varies | Array of saved items |
| `create_carousel` | Quick carousel from a topic | See Content Creation section | Generation job |

### Integrations

#### GHL (GoHighLevel / LeadConnector)

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_ghl_accounts` | List connected GHL social accounts | None | Accounts (Facebook, Instagram, LinkedIn, TikTok, YouTube) |
| `push_to_ghl` | Publish content to GHL accounts | See Content Creation section | Publication result |

#### Twitter/X

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_twitter_accounts` | List connected Twitter/X accounts | Varies | Array of accounts |
| `publish_to_twitter` | Publish a tweet | Varies | Tweet result |
| `schedule_tweet` | Schedule a tweet for later | Varies | Scheduled tweet |

#### Notion

Tools available via the Notion MCP server (separate connection):
- `notion-search`, `notion-fetch`, `notion-create-pages`, `notion-update-page`, `notion-create-database`, etc.

### Tags & Organization

| Tool | Description | Key Parameters | Returns |
|------|-------------|----------------|---------|
| `list_tags` | List all idea tags | None | Array of tags |
| `create_tag` | Create an idea tag | `name` (required) | Created tag |
| `assign_tags` | Assign tags to an idea (replaces existing) | `idea_id` (required), `tag_ids[]` (required) | Confirmation |
| `list_accessible_organizations` | List orgs the user can access | None | Array of organizations |
| `switch_organization` | Switch active org context (for agency accounts) | `organization_id` (required) | Confirmation |
| `get_library_context` | Get library context for content generation | Varies | Library summary |

---

## 3. Available MCP Resources

Resources are read-only data snapshots you can access without calling tools. They return the current state of organizational data.

| URI | Name | Returns |
|-----|------|---------|
| `aca://brand-voices` | Brand Voices | All brand voice configurations |
| `aca://products` | Products | All products with details |
| `aca://icps` | ICPs | All Ideal Customer Profiles |
| `aca://characters` | Characters | All AI characters/personas |
| `aca://tags` | Tags | All idea tags |
| `aca://blueprints` | Blueprints | All content blueprints |
| `aca://prompt-templates` | Prompt Templates | All prompt templates |
| `aca://blocks` | Blocks | All content blocks (hooks, angles, CTAs, story elements) |
| `aca://strategy-documents` | Strategy Documents | All strategy documents |
| `aca://pipelines` | Pipelines | Available content generation pipelines |
| `aca://agent-profiles` | AI Agent Profiles | All AI agent profiles (autopilot configurations) |
| `aca://knowledge-documents` | Knowledge Documents | All knowledge base documents for RAG |
| `aca://lead-magnet-campaigns` | Lead Magnet Campaigns | All lead magnet campaigns with stats |
| `aca://outreach-campaigns` | Outreach Campaigns | All outreach campaigns with status and metrics |
| `aca://email-sequences` | Email Sequences | All email sequences with status and step count |
| `aca://email-mailboxes` | Email Mailboxes | All connected email mailboxes with status |
| `aca://contacts` | CRM Contacts | All CRM contacts (compact list with pagination) |
| `aca://leads` | Email Leads | All email leads for sequence enrollment |
| `aca://crm-pipelines` | CRM Pipelines | All CRM pipelines with their stages |
| `aca://lead-lists` | Lead Lists | All lead lists with names, counts, and types |
| `aca://linkedin-connections` | LinkedIn Connections | LinkedIn network connections (first 100) |

---

## 4. Building a Custom Skill

### Skill File Structure

A skill is a single directory containing a `SKILL.md` file and optional `rules/` subdirectory:

```
skills/
  my-skill/
    SKILL.md              # Main skill definition (required)
    rules/                # Optional detailed rule files
      some-rule.md
      another-rule.md
```

### SKILL.md Format

The `SKILL.md` file uses YAML frontmatter followed by markdown instructions:

```markdown
---
name: weekly-report
description: "Generate a weekly content performance report. Use this skill when
the user asks for a weekly report, content analytics, performance summary, or
weekly metrics review."
---

# Weekly Report Generator

You are a content analytics expert for the ACA platform.

## Workflow

1. Read the organization's recent content using `list_generation_jobs`
2. Get autopilot performance with `get_autopilot`
3. Review campaign metrics with `list_campaigns`
4. Compile a summary report with key metrics

## Output Format

Present the report as a structured markdown document with:
- Content produced this week (by pipeline type)
- Publishing success rate
- Campaign engagement metrics
- Recommendations for next week

## Rules

- Always use real data from the MCP tools -- never fabricate metrics
- Compare week-over-week when historical data is available
- Flag any autopilots that ran out of ideas in their pool
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Kebab-case skill identifier |
| `description` | Yes | When to trigger this skill. Be explicit about trigger phrases. Claude Code uses this to decide when to activate the skill. |

### How to Reference MCP Tools in Skill Instructions

Write your skill instructions as if you're telling an AI assistant which tools to use and in what order. Use the tool names directly:

```markdown
## Step 1: Gather Data

Use `list_contacts` with `sort_by: "created_at"` and `limit: 100` to get
recent contacts. Then use `list_lead_lists` to see which lists they belong to.

## Step 2: Score Leads

For each contact without a lead score, use `update_contact` to set a
`lead_score` based on the analysis.
```

### Best Practices

1. **Keep skills focused.** One skill should do one thing well. A "weekly report" skill is better than a "do everything" skill.

2. **Use rule files for complex instructions.** If a section of your skill is longer than ~50 lines, break it into a `rules/` file and reference it: `See [rules/scoring-criteria.md](rules/scoring-criteria.md)`.

3. **Be explicit about trigger phrases.** The `description` field determines when Claude Code activates your skill. Include every phrase a user might say.

4. **Reference existing skills for shared knowledge.** If your skill needs Remotion video knowledge, load the `remotion-best-practices` skill rather than duplicating that knowledge.

5. **Always validate before acting.** Before creating/updating data, have the skill read existing data first to avoid duplicates.

6. **Handle pagination.** Many list tools default to 20-50 results. If your skill needs all data, pass a high `limit` (up to 10000).

### Example: Weekly Report Skill

```markdown
---
name: weekly-report
description: "Generate a weekly content and outreach performance report. Trigger
when user says: weekly report, content report, performance summary, weekly
analytics, how did we do this week, weekly metrics."
---

# Weekly Report Generator

## Workflow

1. **Content Production**
   - Call `list_generation_jobs` with `limit: 100` to get recent jobs
   - Count by status (completed, failed, processing) and by pipeline type
   - Call `list_autopilots` to check pool health

2. **Outreach Performance**
   - Call `list_campaigns` to get active campaigns
   - For each active campaign, call `get_campaign` with `include_leads_summary: true`
   - Call `list_email_sequences` and check enrollment counts

3. **CRM Health**
   - Call `list_contacts` with `sort_by: "created_at"` to count new contacts
   - Call `list_lead_lists` to see list growth

4. **Compile Report**
   - Present as markdown with sections and bullet points
   - Include week-over-week comparison if data allows
   - End with 3 actionable recommendations

## Rules

- Never fabricate numbers. If data is unavailable, say so.
- Keep the report under 500 words.
- Highlight anything that needs attention (failed jobs, empty pools, stalled campaigns).
```

---

## 5. Video Editor Runtime

If your skill produces Remotion video compositions, it must follow the ACA editor's sandboxed runtime constraints.

### Key Constraints

1. **No import statements.** All dependencies are pre-injected as globals. Just use `AbsoluteFill`, `spring`, `interpolate`, etc. directly.

2. **Metadata comments are required** at the top of every composition:
   ```tsx
   // @aspect portrait|landscape|square
   // @duration 34s
   // @fps 30
   ```

3. **Must end with** `export default ComponentName`

4. **All sub-components defined inline.** No separate files, no external imports.

5. **`premountFor={15}`** on every `TransitionSeries.Sequence`.

### Available Globals

**Core Remotion:**
`AbsoluteFill`, `useCurrentFrame`, `useVideoConfig`, `spring`, `interpolate`, `Sequence`, `Series`, `Audio`, `Video`, `Img`, `Loop`, `freeze`, `random`, `staticFile`, `OffthreadVideo`, `Easing`, `interpolateColors`, `continueRender`, `delayRender`

**Transitions:**
`TransitionSeries`, `linearTiming`, `springTiming`, `fade`, `slide`, `flip`, `wipe`

**Media:**
`Gif`, `Lottie`, `prefetchVideo`, `getAudioData`, `getVideoMetadata`, `visualizeAudio`

**Noise/Generative:**
`generateNoiseFrame`, `NoiseCanvas`

**SVG Paths:**
`evolvePath`, `getLength`, `getPointAtLength`, `interpolatePath`, `parsePath`, `scalePath`, `translatePath`, `getBoundingBox`

**Shapes:**
`Circle`, `Ellipse`, `Pie`, `Polygon`, `Rect`, `Star`, `Triangle`, `makeCircle`, `makeEllipse`, `makePie`, `makePolygon`, `makeRect`, `makeStar`, `makeTriangle`

**Layout:**
`measureText`, `fitText`

**Motion Blur:**
`CameraMotionBlur`, `Trail`

### Aspect Ratio Resolutions

| Aspect | Width | Height | Use Case |
|--------|-------|--------|----------|
| portrait | 1080 | 1920 | LinkedIn, TikTok, Reels, Stories |
| landscape | 1920 | 1080 | YouTube, presentations |
| square | 1080 | 1080 | Instagram feed, LinkedIn feed |

### Duration Calculation

```
Total duration = sum of all scene durations - sum of all transition durations

Example:
- 1 hook scene: 4s (120 frames at 30fps)
- 6 body scenes: 5s each (900 frames)
- 6 transitions: 10 frames each (60 frames)
- Total = 120 + 900 - 60 = 960 frames = 32s

So: // @duration 32s
```

### Video Production Pipeline

```
0. GATHER ASSETS  -> Check for org logos and brand assets
1. STORYBOARD     -> Extract script beats, map to scenes
2. WRITE CODE     -> Self-contained TSX composition
3. PUSH CODE      -> push_remotion_code MCP tool
4. SOUND DESIGN   -> generate_video_music + set_video_sound_effects
5. VOICEOVER      -> generate_video_tts
6. User sees it live in /editor/:projectId
```

---

## 6. Plugin Structure

Bundle your skills as a plugin for distribution and reuse.

### Directory Layout

```
my-aca-plugin/
  .claude-plugin/
    plugin.json           # Plugin manifest (required)
    marketplace.json      # Marketplace listing (optional)
  skills/
    my-skill/
      SKILL.md
      rules/
        some-rule.md
    another-skill/
      SKILL.md
  agents/                 # Agent skills (heavier, multi-rule skills)
    my-agent/
      SKILL.md
      rules/
        rule-a.md
        rule-b.md
        assets/
          example.tsx
```

### plugin.json Schema

```json
{
  "name": "my-aca-plugin",
  "version": "1.0.0",
  "description": "Description of what this plugin provides",
  "author": {
    "name": "Your Name",
    "url": "https://github.com/you"
  },
  "repository": "https://github.com/you/my-aca-plugin",
  "license": "MIT",
  "keywords": ["aca", "your", "keywords"],
  "skills": "./skills/",
  "agents": "./agents/"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Plugin identifier (kebab-case) |
| `version` | Yes | Semver version |
| `description` | Yes | What the plugin provides |
| `author` | No | Author name and URL |
| `repository` | No | GitHub repository URL |
| `license` | No | License identifier |
| `keywords` | No | Discovery keywords |
| `skills` | Yes | Relative path to skills directory |
| `agents` | No | Relative path to agents directory |

### marketplace.json (Optional)

For publishing to a marketplace:

```json
{
  "name": "my-aca-plugin",
  "owner": {
    "name": "Your Name",
    "email": "you@example.com"
  },
  "metadata": {
    "description": "Plugin description for marketplace listing",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "my-aca-plugin",
      "source": "./",
      "description": "Short description",
      "version": "1.0.0",
      "keywords": ["aca", "content"],
      "category": "productivity"
    }
  ]
}
```

### Skills vs. Agents

- **Skills** (`skills/` directory): Focused, single-purpose instructions. Examples: linkedin-copywriter, image-producer, sdr-score.
- **Agents** (`agents/` directory): Heavier skill bundles with many rule files and reference assets. Examples: remotion-best-practices (40+ rule files), motion-graphics-library (15+ components with TSX examples).

Use agents when your skill needs extensive reference material (code examples, component libraries, detailed rule sets). Use skills for everything else.

### Publishing to GitHub

1. Initialize a git repository in your plugin directory
2. Push to GitHub
3. Others can clone or reference your plugin by adding the repository to their Claude Code configuration

```bash
cd my-aca-plugin
git init
git add .
git commit -m "Initial plugin release"
git remote add origin https://github.com/you/my-aca-plugin.git
git push -u origin main
```

---

## Quick Start Checklist

1. Get your ACA MCP API key from the dashboard
2. Configure Claude Code to connect to the ACA MCP server
3. Call `get_help` with `topic: "overview"` to verify your connection
4. Create a `skills/` directory with your first `SKILL.md`
5. Reference MCP tools by name in your skill instructions
6. Test by asking Claude Code to run your skill
