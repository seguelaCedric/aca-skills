---
name: sound-design
description: Background music and sound design philosophy for ACA video projects
metadata:
  tags: sound, sfx, music, bgm, audio, timestamp, sync, elevenlabs
---

# Sound Design

## Philosophy

Less is more. A video with just good background music sounds professional. A video with repetitive, mechanical SFX sounds amateur.

**Default approach**: Background music only. SFX are optional and should only be added when they genuinely enhance a moment.

## Background Music

Every video needs background music. It transforms the output from a slideshow into content.

### Option 1: AI-generated music (preferred)

Use the `generate_video_music` MCP tool to create custom background music and attach it to the project in one step:

```
generate_video_music({
  project_id: "uuid",
  prompt: "dark ambient electronic with subtle synth pads, minimal and professional",
  duration_seconds: 30,
  volume: 0.2
})
```

Good prompts for common video types:
- Tech/SaaS: "dark ambient electronic with subtle synth pads, minimal and professional"
- Hype/launch: "upbeat electronic with driving drums and energy, 130 bpm"
- Tutorial: "chill lo-fi hip hop with soft piano, relaxed and focused"
- Dramatic: "cinematic orchestral tension building with strings"

### Option 2: Mixkit free CDN (fallback)

Use `set_video_music` with a Mixkit URL if AI generation is unavailable:

```
set_video_music({
  project_id: "uuid",
  url: "https://assets.mixkit.co/music/623/623.mp3",
  title: "Deep Urban",
  volume: 0.2,
  source: "mixkit"
})
```

Available Mixkit tracks:
- **Dark tech**: `https://assets.mixkit.co/music/623/623.mp3` (Deep Urban)
- **Cyberpunk**: `https://assets.mixkit.co/music/140/140.mp3` (Cyberpunk City)
- **Ambient tech**: `https://assets.mixkit.co/music/134/134.mp3` (Deep Techno Ambience)
- **Minimal**: `https://assets.mixkit.co/music/162/162.mp3` (Minimal Techno 01)

Music volume: **0.15-0.25** when voiceover is present, **0.3-0.4** without voiceover.

## SFX Guidelines

**Do NOT blanket every visual action with a sound effect.** That's the #1 mistake.

Rules:
- **Max 4-6 SFX per video** - placed at moments that matter
- **Never repeat the same SFX sound twice in a row** - vary the sounds
- **SFX on cards/lists**: only on the FIRST item or the most important one, not every single card
- **SFX on transitions**: only on dramatic scene changes (e.g. the shift/reveal), not every fade
- A well-placed sound at the right moment beats 15 sounds on autopilot

When SFX work well:
- The hook slam - one dramatic impact at the very start
- A key reveal - the "aha" moment or big number
- The first card in a staggered list (not all of them)
- A dramatic transition (strikethrough, shift scene) - not every scene change
- The CTA - a single subtle chime at the end

### Static SFX library (fallback)

Available from the platform's SFX storage:
- `whoosh.wav`, `pop.wav`, `click.wav`, `ding.wav`
- `boom.wav`, `record_scratch.wav`, `cash_register.wav`, `typing.wav`

## SFX Timestamp Calculation

When you do use SFX, timestamps must be CALCULATED from TransitionSeries frame math:

```
fps = 30, TRANSITION_FRAMES = 10, overlap = 10/30 = 0.333s

Scene 1 starts at: 0
Scene N starts at: sceneN-1_start + sceneN-1_duration - 0.333
```

Then: `global_timestamp = scene_start + (animation_delay_frames / fps)`

## Push Music and SFX

Use MCP tools to push audio to the project:

**Music:**
```
set_video_music({
  project_id: "uuid",
  url: "https://...",
  title: "AI Generated",
  volume: 0.2,
  source: "ai"
})
```

**Sound effects:**
```
set_video_sound_effects({
  project_id: "uuid",
  sound_effects: [
    { id: "sfx-hook", url: "https://...", name: "Hook Impact", timestamp: 0.5, duration: 1.5, volume: 0.7 },
    { id: "sfx-cta", url: "https://...", name: "CTA Chime", timestamp: 28.0, duration: 1.0, volume: 0.6 }
  ]
})
```

SFX in `sound_effects[]` are rendered by the video renderer at the specified timestamp - they actually play in the final video output.
