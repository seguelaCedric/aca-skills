---
name: code-format
description: Remotion code template, available globals, aspect ratios, and duration math for ACA editor
metadata:
  tags: code, template, globals, aspect, duration, format, remotion
---

# Code Format

The code MUST follow the exact format the ACA video editor expects. This is non-negotiable.

For Remotion API details (spring configs, interpolation, sequencing, transitions), see the `remotion-best-practices` skill rules. The ACA editor overrides in [editor-runtime.md](editor-runtime.md) take precedence when there is a conflict.

## Template

```tsx
// @aspect portrait
// @duration 34s
// @fps 30

// NO IMPORTS -- all dependencies are pre-injected as globals
// Just use them directly: AbsoluteFill, useCurrentFrame, spring, etc.

const MyScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      {/* content */}
    </AbsoluteFill>
  );
};

const MainComposition = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={4 * fps} premountFor={15}>
          <MyScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        {/* more scenes... */}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default MainComposition;
```

## Available Globals (no imports needed)

**Core Remotion:**
```
AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate,
Sequence, Series, Audio, Video, Img, Loop, freeze, random, staticFile,
OffthreadVideo, Easing, interpolateColors, continueRender, delayRender
```

**Transitions:**
```
TransitionSeries, linearTiming, springTiming, fade, slide, flip, wipe
```

**Media:**
```
Gif, Lottie, prefetchVideo, getAudioData, getVideoMetadata, visualizeAudio
```

**Noise/Generative:**
```
generateNoiseFrame, NoiseCanvas
```

**SVG Paths:**
```
evolvePath, getLength, getPointAtLength, interpolatePath, parsePath,
scalePath, translatePath, getBoundingBox
```

**Shapes:**
```
Circle, Ellipse, Pie, Polygon, Rect, Star, Triangle,
makeCircle, makeEllipse, makePie, makePolygon, makeRect, makeStar, makeTriangle
```

**Layout:**
```
measureText, fitText
```

**Motion Blur:**
```
CameraMotionBlur, Trail
```

## Aspect Ratio Resolutions

| Aspect | Width | Height | Use Case |
|--------|-------|--------|----------|
| portrait | 1080 | 1920 | LinkedIn, TikTok, Reels, Stories |
| landscape | 1920 | 1080 | YouTube, presentations |
| square | 1080 | 1080 | Instagram feed, LinkedIn feed |

**LinkedIn video default: portrait (1080x1920)**

## Duration Calculation

This is the most common mistake. Get it right.

```
Total duration = sum of all scene durations - sum of all transition durations

Example:
- 1 hook scene: 4s (120 frames)
- 6 body scenes: 5s each (150 frames each = 900 frames)
- 6 transitions: 10 frames each (60 frames total)
- Total = 120 + 900 - 60 = 960 frames = 32s at 30fps

So: // @duration 32s
```
