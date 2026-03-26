---
name: strikethrough-replace
description: Text strikethrough with animated replacement for Remotion - old text gets struck through, new text fades in.
metadata:
  tags: strikethrough, replace, before-after, text, transformation
---

## Strikethrough + Replace

Old text gets a strikethrough line drawn across it, then new replacement text slides in below or beside it. Classic "transformation" visual for before/after messaging.

See [StrikethroughReplace](assets/strikethrough-replace-demo.tsx) for a complete runnable example with the three-phase animation.

```tsx
const StrikethroughReplace: React.FC<{
  oldText: string;
  newText: string;
  oldColor?: string;
  newColor?: string;
  strikeColor?: string;
  fontSize?: number;
  delay?: number;
}> = ({
  oldText,
  newText,
  oldColor = "rgba(255,255,255,0.5)",
  newColor = "#10b981",
  strikeColor = "#ef4444",
  fontSize = 56,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Old text fades in
  const oldEntrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  // Phase 2: Strikethrough line draws across
  const strikeDelay = delay + Math.round(0.6 * fps);
  const strikeProgress = interpolate(
    frame,
    [strikeDelay, strikeDelay + Math.round(0.4 * fps)],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 3: Old text dims, new text slides up
  const replaceDelay = delay + Math.round(1.2 * fps);
  const replaceEntrance = spring({
    frame,
    fps,
    delay: replaceDelay,
    config: { damping: 200 },
  });
  const oldDim = interpolate(replaceEntrance, [0, 1], [1, 0.3]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Old text with strikethrough */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            fontSize,
            fontWeight: 800,
            color: oldColor,
            opacity: oldEntrance * oldDim,
          }}
        >
          {oldText}
        </div>
        {/* Animated strike line */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: 0,
            height: 4,
            width: `${strikeProgress}%`,
            background: strikeColor,
            borderRadius: 2,
            boxShadow: `0 0 12px ${strikeColor}80`,
          }}
        />
      </div>

      {/* New replacement text */}
      <div
        style={{
          fontSize: fontSize * 1.1,
          fontWeight: 900,
          color: newColor,
          transform: `translateY(${interpolate(replaceEntrance, [0, 1], [20, 0])}px)`,
          opacity: replaceEntrance,
          textShadow: `0 0 60px ${newColor}50`,
        }}
      >
        {newText}
      </div>
    </div>
  );
};
```

## Inline Strikethrough (Single Line)

For replacing a single word or number within a sentence. The old value gets struck and the new value appears next to it.

```tsx
const InlineStrikeReplace: React.FC<{
  before: string;
  oldValue: string;
  newValue: string;
  after?: string;
  color?: string;
  newColor?: string;
  fontSize?: number;
  delay?: number;
}> = ({
  before,
  oldValue,
  newValue,
  after = "",
  color = "#ffffff",
  newColor = "#10b981",
  fontSize = 42,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const strikeDelay = delay + Math.round(0.5 * fps);
  const strikeProgress = interpolate(
    frame,
    [strikeDelay, strikeDelay + Math.round(0.3 * fps)],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const newEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(1.0 * fps),
    config: { damping: 15, stiffness: 200 },
  });

  return (
    <div style={{ fontSize, fontWeight: 700, color, opacity: entrance, display: "flex", flexWrap: "wrap", gap: "0 12px", alignItems: "center" }}>
      <span>{before}</span>
      <span style={{ position: "relative", color: "rgba(255,255,255,0.4)" }}>
        {oldValue}
        <div
          style={{
            position: "absolute", top: "52%", left: 0, height: 3,
            width: `${strikeProgress}%`, background: "#ef4444", borderRadius: 2,
          }}
        />
      </span>
      <span
        style={{
          color: newColor,
          fontWeight: 900,
          transform: `scale(${interpolate(newEntrance, [0, 1], [0.5, 1])})`,
          opacity: newEntrance,
          textShadow: `0 0 40px ${newColor}50`,
        }}
      >
        {newValue}
      </span>
      {after && <span>{after}</span>}
    </div>
  );
};
```

## Usage Rules

- The strikethrough animation uses `interpolate()` on width percentage, not CSS transition.
- Three-phase timing: (1) old text enters, (2) strike line draws, (3) replacement slides in.
- The strike line has a `boxShadow` glow in red for emphasis.
- Old text dims to `opacity: 0.3` when replacement appears.
- Replacement text is slightly larger (`fontSize * 1.1`) and bolder to show the upgrade.
- Standard delays: old at `0`, strike at `0.6s`, replace at `1.2s`. Adjust with `delay` prop for scene timing.
