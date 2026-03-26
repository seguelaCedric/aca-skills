---
name: text-entrances
description: Animated text entrance patterns for Remotion - slam, slide-up, scale-in, split-reveal, word-by-word.
metadata:
  tags: text, entrance, animation, slam, slide, scale, reveal, words
---

## Slam Entrance

Text scales up from 0 and slams into place with a bouncy spring. The most dramatic entrance - use for hook text and hero numbers.

```tsx
const SlamText: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  delay?: number;
  accentColor?: string;
}> = ({ text, color = "#ffffff", fontSize = 72, delay = 0, accentColor = "#6366f1" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 200 },
  });
  const opacity = interpolate(scale, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontSize,
        fontWeight: 900,
        color,
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity,
        textShadow: `0 0 60px ${accentColor}60`,
      }}
    >
      {text}
    </div>
  );
};
```

## Slide-Up Entrance

Text slides up from below with a fade. The workhorse entrance for body text, subtitles, and descriptions.

```tsx
const SlideUpText: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  delay?: number;
}> = ({ text, color = "#ffffff", fontSize = 42, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });
  const translateY = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontSize,
        fontWeight: 700,
        color,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
```

## Scale-In Entrance

Text scales from a small size with a smooth (non-bouncy) spring. Good for secondary headings and labels.

```tsx
const ScaleInText: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  delay?: number;
}> = ({ text, color = "#ffffff", fontSize = 48, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });
  const scale = interpolate(progress, [0, 1], [0.6, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontSize,
        fontWeight: 800,
        color,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
```

## Split Reveal

Text is clipped by two panels that slide apart, revealing the text underneath. Cinematic feel.

See [assets/text-entrance-split-reveal.tsx](assets/text-entrance-split-reveal.tsx) for the full implementation.

## Word-by-Word Entrance

Each word enters independently with a stagger delay. Good for quotes, insights, and punchlines.

```tsx
const WordByWord: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  staggerFrames?: number;
  delay?: number;
  accentColor?: string;
}> = ({ text, color = "#ffffff", fontSize = 48, staggerFrames = 4, delay = 0, accentColor = "#6366f1" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 16px", justifyContent: "center" }}>
      {words.map((word, i) => {
        const progress = spring({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: { damping: 200 },
        });
        const translateY = interpolate(progress, [0, 1], [30, 0]);

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight: 800,
              color,
              display: "inline-block",
              transform: `translateY(${translateY}px)`,
              opacity: progress,
              textShadow: `0 0 40px ${accentColor}40`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

## When to use which

| Pattern | Best for | Spring config |
|---------|----------|---------------|
| **Slam** | Hook text, hero numbers, dramatic reveals | `damping: 12, stiffness: 200` (bouncy) |
| **SlideUp** | Body text, subtitles, descriptions | `damping: 200` (smooth) |
| **ScaleIn** | Secondary headings, labels, tags | `damping: 200` (smooth) |
| **SplitReveal** | Dramatic reveals, brand names | `damping: 200` (smooth) |
| **WordByWord** | Quotes, insights, punchlines | `damping: 200` (smooth) |

## Usage Rules

- Every text element MUST have an animated entrance. No static text appearing on frame 0.
- Use the `delay` prop (in frames) to stagger multiple text elements within a scene.
- Common stagger: title at `delay: 0`, subtitle at `delay: Math.round(0.3 * fps)`.
- Always add `textShadow` with the scene's accent color for glow effect.
- Minimum font sizes: titles >= 56px, body >= 36px, labels >= 24px.
