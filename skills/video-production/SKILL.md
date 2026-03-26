---
name: video-production
description: End-to-end video production skill for turning content (LinkedIn posts, ideas, scripts) into Remotion video compositions pushed to the ACA video editor via MCP. Use this skill whenever the user asks to "turn this into a video", "make a video from this", "create a video", "push to the editor", or any request that involves producing a Remotion video composition from content. Also trigger when the user mentions video production, motion graphics, animated content, or pushing code to the video editor/composer. If video creation from existing content is even tangentially involved, use this skill.
---

Expert video producer for the ACA platform. Takes content (LinkedIn posts, scripts, ideas) and produces complete Remotion video compositions, then pushes them to the video editor.

## Remotion Knowledge

For all Remotion API knowledge (animations, spring configs, interpolation, sequencing, transitions, audio, video, text, fonts, 3D, etc.), **load and follow the `remotion-best-practices` skill**. That skill is the single source of truth for how Remotion works.

For reusable **motion graphic building blocks** (backgrounds, particles, text entrances, counters, cards, comparisons, CTAs, etc.), **load and follow the `motion-graphics-library` skill**.

This skill adds the **ACA editor-specific constraints** on top of that knowledge. When there is a conflict, **this skill wins** because it targets the ACA sandboxed runtime environment.

## The Pipeline

Every video production follows this exact pipeline. No shortcuts.

```
0. GATHER ASSETS -> Check for org logos and brand assets
1. STORYBOARD   -> Extract script beats, map to scenes
2. WRITE CODE   -> Self-contained TSX composition
3. PUSH CODE    -> push_remotion_code MCP tool
4. SOUND DESIGN -> generate_video_music + set_video_sound_effects MCP tools
5. VOICEOVER    -> generate_video_tts MCP tool
6. User sees it live in /editor/:projectId
```

## Rules

Read individual rule files for detailed instructions on each step:

- [rules/editor-runtime.md](rules/editor-runtime.md) - ACA editor overrides: no imports, globals, metadata comments
- [rules/storyboard.md](rules/storyboard.md) - Script-first workflow, content-to-video conversion
- [rules/code-format.md](rules/code-format.md) - Code template, available globals, aspect ratios, duration math
- [rules/visual-style.md](rules/visual-style.md) - Typography, color, and layout requirements
- [rules/push-to-editor.md](rules/push-to-editor.md) - Push code via MCP tools
- [rules/sound-design.md](rules/sound-design.md) - BGM, SFX, timestamp calculation, audio push via MCP
- [rules/voiceover.md](rules/voiceover.md) - TTS generation, voice selection, push via MCP
- [rules/quality-checklist.md](rules/quality-checklist.md) - Pre-push verification checklist

For motion graphic components (DarkGrid, Particles, ScanLine, cards, counters, etc.), load the `motion-graphics-library` skill directly.

## Step 0: Gather Assets (MANDATORY)

Before storyboarding, check if the organization has logos and brand assets in storage.

**Logo storage convention:**
```
content-media/video-assets/logos/{org_id}/
  logo-primary.png       -- Main logo (transparent PNG)
  logo-white.png         -- White/mono version for dark backgrounds (PREFERRED)
  logo-icon.png          -- Icon-only / square mark
  logo-wordmark.png      -- Text-only wordmark
```

**Decision tree:**
- Logos found -> Use `ImageLogoReveal` with `<Img>` (see `motion-graphics-library` logo-reveal rule)
- No logos -> Use text-based `LogoReveal` or `UnderlineReveal`
- User provides a logo URL -> Use it directly with `<Img>`

**Third-party logos:**
```tsx
// logo.dev - requires a token (get one at logo.dev)
<Img src="https://img.logo.dev/{domain}?token=YOUR_TOKEN&size=200&format=png" style={{ width: 48 }} />

// Clearbit (free, no token needed)
<Img src="https://logo.clearbit.com/{domain}" style={{ width: 48 }} />
```

Always prefer `logo-white.png` on dark backgrounds. Always use `<Img>` from Remotion (global), never `<img>` or CSS `background-image`.
