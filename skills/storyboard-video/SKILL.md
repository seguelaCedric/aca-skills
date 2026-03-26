---
name: storyboard-video
description: Storyboard-style video production using AI-generated images with motion graphic overlays, Ken Burns, and cinematic text. Revid/TikTok POV style. Use when the user wants to create a video from AI-generated images, storyboard scenes, photo-based narratives, POV videos, or any video where the visuals are photographs/illustrations rather than pure code-driven motion graphics. Also trigger for "revid style", "storyboard video", "image-based video", "POV video", or "photo slideshow with motion".
---

You are an expert storyboard video producer. Your job is to generate AI images for each scene, then compose them into a Remotion video with cinematic motion and text overlays.

## Foundation Skills

This skill builds on top of:

- **`remotion-best-practices`** - All Remotion API knowledge. Every animation uses `useCurrentFrame()`, `spring()`, `interpolate()`. No CSS transitions. No Tailwind animations.
- **`video-production`** - The ACA editor pipeline (no imports, globals only, metadata comments, push method, SFX timestamps, sound design). **Use that skill's Step 3 (Push), Step 4 (Sound Design), and all platform credentials.**
- **`motion-graphics-library`** - Reusable atmospheric components (Particles, ScanLine, PulseRing, LightSweep). Use these as OVERLAYS on top of photos, not as replacements.

When there is a conflict, **this skill wins** for anything related to image-based scene composition.

## What Makes This Different From video-production

| | video-production | storyboard-video |
|---|---|---|
| **Visuals** | Code-driven (DarkGrid, gradients, shapes) | AI-generated images as backgrounds |
| **Text** | IS the content (big text = the scene) | Overlays ON TOP of images |
| **Motion** | Grid drift, particles, spring entrances | Ken Burns zoom, parallax, photo reveals |
| **Use case** | LinkedIn thought leadership, data videos | POV stories, narratives, tutorials, memes |
| **Image gen** | None needed | Flux/Replicate for consistent characters |

## The Pipeline

```
Concept (POV idea, story, narrative)
    |
    v
0. CHARACTER DESIGN -- Define a consistent character description
    |
    v
1. SCENE LIST -- 5-8 scenes with image prompts + text overlays
    |
    v
2. GENERATE IMAGES -- Flux 1.1 Pro via Replicate (all in parallel)
    |
    v
3. COMPOSE REMOTION CODE -- Images + Ken Burns + overlays + text
    |
    v
4. PUSH CODE -- Use video-production pipeline (Step 3)
    |
    v
5. SOUND DESIGN -- Use video-production pipeline (Step 4)
```

## Step 0: Character Design

For consistent characters across scenes, define a **character reference block** -- a detailed, frozen description reused in every image prompt.

**Template:**
```
[AGE]-year-old [GENDER] with [HAIR], [FACIAL HAIR], wearing [OUTFIT DETAIL 1], [OUTFIT DETAIL 2], [OUTFIT DETAIL 3], [DISTINGUISHING FEATURE]
```

**Example:**
```
30-year-old man with a short brown beard, wearing full medieval plate armor, silver scratched dented metal, red cape draped over shoulders
```

**Rules:**
- Include 5+ physical details for consistency
- Mention SPECIFIC colors, materials, textures (not "nice outfit" but "charcoal wool overcoat with brass buttons")
- Lock the description -- use it VERBATIM in every scene prompt
- Never change details between scenes (no "brown beard" in one, "dark beard" in another)

## Step 1: Scene List

Each storyboard video needs 5-8 scenes. Each scene has:

```
Scene N:
  - Setting: [where the character is]
  - Action: [what they're doing]
  - Emotion: [their facial expression/body language]
  - Text Title: [3-8 words, big]
  - Text Subtitle: [optional, 8-15 words, smaller]
  - Mood: [warm/cold/dramatic/funny/calm]
  - Accent Color: [hex color for text glow and overlays]
```

**Pacing rules:**
- Scene 1 is always the HOOK -- most dramatic, text slams in
- Scenes 2-4 are the JOURNEY -- building narrative
- Scene 5+ is the PAYOFF -- emotional peak or punchline
- Last scene can be a CTA or cliffhanger ("Follow for Part 2")

## Step 2: Generate Images

Use **Flux 1.1 Pro** via Replicate MCP for highest quality.

**Prompt structure:**
```
Cinematic photo, [CHARACTER REFERENCE BLOCK], [SETTING], [ACTION], [EMOTION], [LIGHTING], photorealistic, 35mm film, shallow depth of field
```

**MCP call:**
```
mcp__claude_ai_Replicate__create_predictions
  version: "black-forest-labs/flux-1.1-pro"
  Prefer: "wait"
  input: {
    prompt: "...",
    aspect_ratio: "9:16",
    output_format: "webp",
    safety_tolerance: 5
  }
  jq_filter: "{id, status, output}"
```

**Generate ALL scenes in parallel** -- fire all 5-8 predictions at once.

**Image prompt rules:**
- Always start with "Cinematic photo,"
- Always include the full character reference block (verbatim)
- Always end with "photorealistic, 35mm film, shallow depth of field"
- Specify lighting: "morning sunlight", "fluorescent lighting", "golden hour", "underground lighting"
- Specify camera distance: wide shot, medium shot, close-up
- For portrait videos, always set `aspect_ratio: "9:16"`
- Never mention text or UI elements in the image prompt -- text is added in Remotion

## Step 3: Compose Remotion Code

### Required Components

Every storyboard video MUST include these inline components:

**1. KenBurns -- Slow zoom on every image (MANDATORY)**

This is what separates a storyboard video from a slideshow. Every image MUST have Ken Burns.

```tsx
const KenBurns = ({ src, zoomFrom = 1.0, zoomTo = 1.12, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames || 5 * fps], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);
  const tx = interpolate(progress, [0, 1], [0, panX]);
  const ty = interpolate(progress, [0, 1], [0, panY]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translate(${tx}px, ${ty}px)` }} />
    </AbsoluteFill>
  );
};
```

**Ken Burns variation per scene** -- don't use the same zoom on every scene:

| Scene type | zoomFrom | zoomTo | panX | panY | Feel |
|------------|----------|--------|------|------|------|
| Hook / dramatic | 1.15 | 1.0 | 0 | 0 | Zoom OUT (reveal) |
| Calm / establishing | 1.0 | 1.08 | 0 | 0 | Slow zoom IN |
| Action / movement | 1.0 | 1.1 | -20 | 0 | Pan left while zooming |
| Emotional / close-up | 1.0 | 1.06 | 0 | -10 | Slight upward drift |
| Finale / epic | 1.0 | 1.15 | 0 | 0 | Dramatic zoom IN |

**2. Cinematic Overlay -- Gradient for text legibility (MANDATORY)**

Never put text directly on photos without an overlay. The image is beautiful -- don't obscure it entirely, but make the text readable.

```tsx
const CinematicOverlay = ({ position = "bottom", intensity = 0.6 }) => {
  const gradients = {
    bottom: `linear-gradient(to top, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.6}) 35%, transparent 70%)`,
    top: `linear-gradient(to bottom, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.5}) 30%, transparent 65%)`,
    full: `linear-gradient(to top, rgba(0,0,0,${intensity}) 0%, rgba(0,0,0,${intensity * 0.3}) 50%, rgba(0,0,0,${intensity * 0.15}) 100%)`,
    vignette: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
  };
  return <AbsoluteFill style={{ background: gradients[position] }} />;
};
```

**Overlay rules:**
- Hook scene: `position="full"` intensity 0.5-0.6 (text is the star, image is backdrop)
- Body scenes: `position="bottom"` intensity 0.5-0.6 (image visible on top, text at bottom)
- Emotional/quote scenes: `position="vignette"` intensity 0.5 (image centered, edges darkened)
- NEVER use no overlay -- text on raw photos is unreadable

**3. Motion Graphic Overlays (from motion-graphics-library)**

Layer these SUBTLY on top of photos. Don't overdo it -- photos + too many particles looks cheap.

```tsx
// Subtle white particles (count 5-8, NOT 15-25 like motion graphics videos)
<Particles count={6} color="#ffffff" />

// LightSweep for reveals (once per scene, not repeating)
<LightSweep color="#ffffff" delay={Math.round(0.3 * fps)} />

// ScanLine ONLY on hook and CTA scenes
<ScanLine color={accentColor} durationSec={4} />
```

**What NOT to use on photo scenes:**
- DarkGrid -- it's for code-driven backgrounds, not photos
- GlowOrbs -- competes with the photo's natural lighting
- SparkBurst -- too aggressive on top of a photograph

### Text Overlay Patterns for Photos

Text on storyboard videos is different from motion graphics videos. It's SMALLER, positioned carefully, and doesn't dominate the frame.

**Hook scene text (center, large):**
```tsx
// POV tag (optional)
<div style={{ padding: "8px 28px", borderRadius: 8, background: `rgba(R,G,B,0.85)` }}>
  <span style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", letterSpacing: 3, textTransform: "uppercase" }}>POV</span>
</div>

// Title (centered, 50-62px, NOT 72-80px like motion graphics)
<div style={{ fontSize: 58, fontWeight: 900, color: "#ffffff", textAlign: "center", textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}>
  {title}
</div>
```

**Body scene text (bottom-anchored, left-aligned):**
```tsx
// Container at bottom of frame
<AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 50px 100px 50px", gap: 10 }}>
  <div style={{ fontSize: 46, fontWeight: 900, color: "#ffffff", lineHeight: 1.2, textShadow: "0 4px 25px rgba(0,0,0,0.8)" }}>
    {title}
  </div>
  <div style={{ fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.75)", textShadow: "0 2px 15px rgba(0,0,0,0.6)" }}>
    {subtitle}
  </div>
</AbsoluteFill>
```

**Key differences from motion graphics text:**
- Smaller font sizes (46-58px titles vs 60-80px)
- Always has `textShadow` with BLACK (not colored glow) for photo legibility
- Bottom-anchored on body scenes so the photo is visible
- No colored `textShadow` glow -- use black shadow for contrast on photos
- Accent colors applied to SPECIFIC words, not all text

**Accent word highlighting:**
```tsx
// Highlight one or two key words in the accent color
<div style={{ fontSize: 50, fontWeight: 900, color: "#ffffff", textShadow: "0 4px 25px rgba(0,0,0,0.8)" }}>
  First mission: <span style={{ color: "#f59e0b" }}>acquire coffee.</span>
</div>
```

### Scene Entrance Animations

Each scene needs animated text entrances. Use `spring()` from remotion-best-practices.

**Slide from side (body scenes):**
```tsx
const entrance = spring({ frame, fps, delay: Math.round(0.3 * fps), config: { damping: 200 } });
const tx = interpolate(entrance, [0, 1], [-40, 0]);
// style: transform: `translateX(${tx}px)`, opacity: entrance
```

**Slam from center (hook scene):**
```tsx
const slam = spring({ frame, fps, delay: Math.round(0.5 * fps), config: { damping: 12, stiffness: 200 } });
// style: transform: `scale(${slam})`, opacity: interpolate(slam, [0, 0.5], [0, 1])
```

**Rise from bottom (subtitles):**
```tsx
const rise = spring({ frame, fps, delay: Math.round(0.8 * fps), config: { damping: 200 } });
const ty = interpolate(rise, [0, 1], [25, 0]);
// style: transform: `translateY(${ty}px)`, opacity: rise
```

**Tag/badge pop (POV, Follow tags):**
```tsx
const pop = spring({ frame, fps, delay: Math.round(0.2 * fps), config: { damping: 200 } });
// style: transform: `translateY(${interpolate(pop, [0, 1], [-20, 0])}px)`, opacity: pop
```

### Transition Variety

Don't use the same transition for every scene. Alternate:

```
Scene 1 -> 2: slide({ direction: "from-right" })   // energy
Scene 2 -> 3: slide({ direction: "from-bottom" })   // surprise
Scene 3 -> 4: slide({ direction: "from-left" })     // contrast
Scene 4 -> 5: fade()                                 // emotional beat
```

Use `linearTiming({ durationInFrames: 12 })` for slides (slightly longer than motion graphics videos for cinematic feel).

### CTA / Cliffhanger Tag

The last scene should include a "Follow for Part 2" or CTA badge:

```tsx
<div style={{
  padding: "10px 24px", borderRadius: 8,
  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
  alignSelf: "flex-start",
  opacity: tagEntrance, transform: `translateY(${interpolate(tagEntrance, [0, 1], [15, 0])}px)`,
}}>
  <span style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Follow for Part 2</span>
</div>
```

## Scene Duration and Pacing

Storyboard videos are faster-paced than motion graphics videos:

| Scene type | Duration | Why |
|------------|----------|-----|
| Hook | 4-5s | Needs time for text slam + image reveal |
| Body scenes | 4-5s | Image + text + read time |
| Emotional beat | 5s | Give it room to breathe |
| CTA / finale | 4-5s | Quick, don't overstay |

Total video: **20-30s** (shorter than motion graphics which run 30-40s)

## Transition duration

Use `12` frames for slide transitions (0.4s) -- slightly slower than motion graphics (10 frames) for a more cinematic feel.

## Sound Design

Use the same SFX library and calculation method from `video-production` Step 4. But the SFX mapping is different for photo-based scenes:

| Visual Action | SFX | Volume |
|---------------|-----|--------|
| Hook text slam | Vine Boom | 0.85 |
| Slide transitions | Whoosh | 0.75 |
| Fade transitions | Page Turn (softer) | 0.5 |
| Title text slides in | Switch | 0.55 |
| Subtitle appears | Switch (quieter) | 0.45 |
| POV/tag badge | Switch | 0.6 |
| Emotional moment | Ding | 0.65 |
| CTA/Follow tag | Ding | 0.7 |

**Music volume: 0.28-0.35** (slightly louder than motion graphics because there's less visual noise to compete with).

**Music mood matching:**
- Funny/meme POV -> Minimal Techno or no music
- Epic/inspirational -> Dark Tech or Cyberpunk
- Calm/story -> Ambient Tech

## Quality Checklist

Before pushing:

- [ ] Every image uses the SAME character reference block (no detail drift)
- [ ] Every image has Ken Burns (never static)
- [ ] Ken Burns VARIES per scene (zoom in, zoom out, pan left, etc.)
- [ ] CinematicOverlay on every scene (never raw text on photo)
- [ ] Text uses BLACK textShadow (not colored glow)
- [ ] Text is bottom-anchored on body scenes, centered on hook
- [ ] Font sizes: 46-58px titles (smaller than motion graphics)
- [ ] Max 1-2 accent-colored words per scene (not all text colored)
- [ ] Particles are SUBTLE (count 5-8, white, not scene-colored)
- [ ] No DarkGrid, no GlowOrbs on photo scenes
- [ ] Transitions alternate directions (not all the same)
- [ ] All remotion-best-practices rules followed (spring/interpolate only, no CSS)
- [ ] ACA editor format (no imports, metadata comments, export default)
- [ ] Sound design completed with calculated timestamps
