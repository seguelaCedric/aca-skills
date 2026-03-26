# ACA Skills Plugin for Claude Code

Skills for [ACA (Automated Client Acquisition)](https://app.aca.so) - AI-powered content creation, video production, and multi-channel outreach.

## Prerequisites

- Claude Code installed
- ACA account with MCP connection configured

## Installation

```bash
# Add the marketplace
/plugin marketplace add claude/aca-skills

# Install the plugin
/plugin install aca@claude-aca
```

## Available Skills

### Content Production
| Skill | Invoke | Description |
|-------|--------|-------------|
| Content Strategist | `/aca:content-strategist` | Plan daily content topics across platforms |
| Trend Researcher | `/aca:trend-researcher` | Research trending AI/SaaS/agency topics |
| LinkedIn Copywriter | `/aca:linkedin-copywriter` | Write high-engagement LinkedIn posts |
| Twitter Copywriter | `/aca:twitter-copywriter` | Write punchy, viral tweets |
| Facebook Copywriter | `/aca:facebook-copywriter` | Write long-form Facebook posts |
| Instagram Copywriter | `/aca:instagram-copywriter` | Write Instagram captions and carousel content |
| Image Producer | `/aca:image-producer` | Generate lead magnet images for social posts |
| Content QA | `/aca:content-qa` | Review posts against quality rules before publishing |
| Social Publisher | `/aca:social-publisher` | Schedule and publish posts via GHL |

### Video Production
| Skill | Invoke | Description |
|-------|--------|-------------|
| Video Production | `/aca:video-production` | Turn content into Remotion video compositions |
| Storyboard Video | `/aca:storyboard-video` | Photo-based narrative videos with Ken Burns and overlays |

### SDR Outreach Pipeline
| Skill | Invoke | Description |
|-------|--------|-------------|
| AI SDR | `/aca:ai-sdr` | Full SDR orchestration workflow |
| Research | `/aca:sdr-research` | Find and import leads from LinkedIn |
| Score | `/aca:sdr-score` | Score leads against your ICP |
| Segment | `/aca:sdr-segment` | Segment leads into targeted lists |
| Write Emails | `/aca:sdr-write-emails` | Personalized cold email sequences |
| Write LinkedIn | `/aca:sdr-write-linkedin` | Personalized connection notes and DMs |
| Status | `/aca:sdr-status` | Check pipeline health and budget |

### Agent Skills (loaded automatically)
- **remotion-best-practices** - Remotion API knowledge for video creation
- **motion-graphics-library** - Reusable motion graphic components

## Building Custom Skills

Want to build your own skills on top of ACA? The **[Developer Guide](docs/DEVELOPER_GUIDE.md)** covers everything:

- All 100+ MCP tools with parameters and return values
- 20+ MCP resources for reading org data
- Video editor runtime constraints and available globals
- Skill file structure and best practices
- How to bundle and publish as a plugin

## MCP Tools Used

The video production skills use these ACA MCP tools:

| Tool | Purpose |
|------|---------|
| `push_remotion_code` | Push/update Remotion compositions to the video editor |
| `list_video_projects` | List video projects in the editor |
| `get_video_project` | Get a project's code and settings |
| `set_video_sound_effects` | Attach sound effects with timestamps |
| `set_video_music` | Set background music |
| `set_video_voiceover` | Attach voiceover audio |
| `generate_video_tts` | Generate TTS voiceover and attach to project |
| `generate_video_music` | Generate AI background music and attach to project |
| `standalone_generate_image` | Generate images for posts |
| `submit_content` | Store content in ACA |

## License

MIT
