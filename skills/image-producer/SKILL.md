---
name: lead-magnet-image-gen
description: "Generate scroll-stopping, organic-looking images for social media lead magnet posts using OpenRouter's Gemini Flash Image (google/nano-banana-2). Use this skill whenever the user asks to create an image for a social post, needs a visual for a LinkedIn or Twitter/X post, wants to generate a lead magnet image, asks for a post image, mentions 'image for my post', 'visual for my content', 'image prompt', 'post image', 'social media image', or references any kind of visual content for lead magnets. Also trigger when the user is working on a lead magnet post and needs an accompanying image, or when they mention any of the style names like 'whiteboard', 'billboard', 'sticky note', 'napkin', 'bookstore', 'NASDAQ', 'chalk wall', or similar. If an image for social media content is even tangentially involved, use this skill."
---

# Lead Magnet Image Generator

Generate hyper-photorealistic images for social media lead magnet posts using **google/nano-banana-2** (Gemini 3.1 Flash Image) via OpenRouter. Every image must look like a real photograph — not AI-generated, not a designed graphic, not a stock photo. The image's job is to stop the scroll.

## Model

- **Model:** `google/nano-banana-2` (alias for `google/gemini-3.1-flash-image-preview` on OpenRouter)
- **Default aspect ratio:** platform-dependent (see table below)
- **Supports:** text-to-image, text rendering

## How This Skill Works

1. Read the user's request and identify which inputs are available (hook, talking points, CTA, or topic)
2. Identify the target platform (LinkedIn, X, Instagram, Facebook) — default to LinkedIn
3. Suggest 2-3 styles from the style library that best fit the content, or use the one the user requests
4. Build the prompt from the selected style
5. Generate the image via `standalone_generate_image` MCP tool

All 24 styles are listed below under Style Categories.

## Generating the Image

Call the `standalone_generate_image` ACA MCP tool with:

```json
{
  "prompt": "<the full single-paragraph prompt built from the style>",
  "model": "google/nano-banana-2",
  "aspect_ratio": "<set by platform — see table below>"
}
```

The tool is synchronous — it returns the image URL directly (uploaded to Supabase Storage). No polling needed.

**Aspect ratio by platform:**

| Platform | Default | Wide shots (billboard, NASDAQ, airport, conference room) |
|---|---|---|
| LinkedIn | `4:5` | `16:9` |
| Twitter/X | `16:9` | `16:9` |
| Instagram | `4:5` | `1:1` |
| Facebook | `4:5` | `16:9` |

If the user doesn't specify a platform, default to LinkedIn (`4:5`).

## Text Extraction Rules

AI image generators fail when asked to render dense text. These rules apply to EVERY style:

**From hook:** Extract a 3-8 word headline. The hook arrives as 1-2 sentences — pull the most provocative fragment. "R.I.P. the 7-step email sequence. Nobody is replying to them anymore." becomes "R.I.P. the 7-Step Sequence." Keep the punch, cut the explanation.

**From talking points:** Extract 3-5 concept fragments of 2-4 words each. Strip every bullet to its core noun phrase. "Why a 3-touch sequence that switches channels beats a 7-touch" becomes "Multi-Channel Sequence." Never full sentences.

**From CTA:** Extract keyword only. "Comment CAMPAIGN + connect" becomes "CAMPAIGN."

**Absolute limits:**
- Max 25 total readable words in any image
- Headlines: 3-8 words, bold, dominant
- Labels/phrases: 2-4 words each, max 5
- 60%+ of any writing surface must be EMPTY space
- Handwritten text must look natural — uneven, imperfect, human
- NEVER include paragraphs, full sentences, or bullet lists as readable text

## Style Categories

### "This wasn't supposed to be public"
- **01 Leaked Whiteboard** — mid-session board, snapped from across the room
- **04 Abandoned Desk** — someone left in a hurry, notebook open mid-thought
- **16 Meeting Leftovers** — conference room post-meeting, board half-erased
- **19 Printer Tray Catch** — fresh printout someone left in the tray

### "Something demands attention"
- **05 Yellow Highlight** — one line screaming in bright yellow on a page
- **06 Sticky Note Intervention** — neon note stuck on a laptop screen
- **10 Crossed-Out Headline** — old way aggressively killed, new way below
- **14 Warning Label** — industrial hazard sign, instinct trigger
- **18 Emergency Note** — aggressive handwriting taped to a monitor

### "I need to read that"
- **02 Confrontational Billboard** — provocative headline, black/white, highway
- **07 Napkin Math** — equation that tells the whole story
- **11 Bathroom Mirror** — finger-written message through steam
- **12 Newspaper Front Page** — bold headline, classic authority format
- **13 Chalk Wall** — white chalk on dark brick
- **15 Receipt Tape** — unexpected format with line items
- **24 NASDAQ Tower** — Times Square, massive screen, ultimate flex

### "Strategy in progress"
- **03 Bookshelf Playbook** — one book pulled forward on a shelf
- **08 Glass Door Scrawl** — dry-erase marker on conference room glass
- **09 Crumpled & Smoothed** — paper thrown away then reconsidered
- **17 Airport Board** — split-flap board with unexpected content
- **20 Business Card Drop** — index card left on a bar counter
- **21 Bookstore Best Seller** — book face-out in a bookstore
- **22 Notepad Scribble** — yellow legal pad, blue pen, messy handwriting
- **23 Sticky Note Wall** — colorful notes in a cluster on office glass

## Style Selection Logic

When the user doesn't specify a style:
- **Aggressive/contrarian hook** (RIP, STOP, NEVER) → Warning Label, Crossed-Out Headline, Billboard, NASDAQ Tower
- **Curiosity/reveal hook** (numbers, results, systems) → Leaked Whiteboard, Napkin Math, Notepad Scribble, Meeting Leftovers
- **Story/confession hook** → Abandoned Desk, Crumpled & Smoothed, Bathroom Mirror
- **Heavy talking points** → Sticky Note Wall, Whiteboard, Glass Door Scrawl, Notepad Scribble
- **Strong CTA keyword** → Sticky Note Intervention (keyword on second note), Business Card Drop

Suggest 2-3 options and let the user pick, unless they've specified a style.

## Global Photography Rules

Baked into every style prompt. Non-negotiable:
- Hyper-photorealistic — must pass as a real photograph
- Hasselblad X2D camera (55mm wide, 80mm medium, 90mm close-up)
- Natural lighting ONLY
- Shallow depth of field
- No AI look — smudges, imperfections, slight disorder
- Muted, slightly desaturated, editorial color grading
- No people's faces. Hands are fine.
- Must work at thumbnail size

## What NOT to Do

- NEVER create UI mockup styles (Slack, iMessage, Google Docs) — AI can't render software interfaces convincingly
- NEVER create designed graphic layouts (split screens, scorecards, infographics)
- NEVER include more than 25 readable words in any image
- NEVER render full sentences or paragraphs as visible text
- NEVER describe scenes that couldn't plausibly exist in real life
- NEVER use Sony A7R — always Hasselblad X2D