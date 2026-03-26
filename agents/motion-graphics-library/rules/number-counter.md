---
name: number-counter
description: Animated counting number patterns for Remotion - currency, percentages, integers with formatting.
metadata:
  tags: counter, number, counting, currency, percent, stat, data
---

## Basic Counter

Animates a number from 0 to a target value. Driven entirely by `spring()`.

```tsx
const Counter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  fontSize?: number;
  delay?: number;
  accentColor?: string;
}> = ({ value, prefix = "", suffix = "", color = "#ffffff", fontSize = 96, delay = 0, accentColor = "#6366f1" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const displayValue = Math.round(value * progress);

  return (
    <div
      style={{
        fontSize,
        fontWeight: 900,
        color,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        textShadow: `0 0 80px ${accentColor}50`,
      }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </div>
  );
};
```

## Currency Counter

Counts up with dollar sign and comma formatting. Use for cost comparisons.

```tsx
const CurrencyCounter: React.FC<{
  value: number;
  delay?: number;
  color?: string;
  fontSize?: number;
  accentColor?: string;
}> = ({ value, delay = 0, color = "#ffffff", fontSize = 96, accentColor = "#10b981" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const displayValue = Math.round(value * progress);

  return (
    <div
      style={{
        fontSize,
        fontWeight: 900,
        color,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        textShadow: `0 0 80px ${accentColor}50`,
      }}
    >
      ${displayValue.toLocaleString()}
    </div>
  );
};
```

## Percentage Counter

Counts up with `%` suffix. Use for stats and data scenes.

```tsx
const PercentCounter: React.FC<{
  value: number;
  delay?: number;
  color?: string;
  fontSize?: number;
  accentColor?: string;
}> = ({ value, delay = 0, color = "#ffffff", fontSize = 96, accentColor = "#f59e0b" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const displayValue = Math.round(value * progress);

  return (
    <div
      style={{
        fontSize,
        fontWeight: 900,
        color,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        textShadow: `0 0 80px ${accentColor}50`,
      }}
    >
      {displayValue}%
    </div>
  );
};
```

## Stat Card (Counter + Label)

A counter with a label underneath, wrapped in a card with a glowing border.

See [StatCard](assets/number-counter-stat-card.tsx) for a complete example with 4 staggered stat cards.

```tsx
const StatCard: React.FC<{
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  delay?: number;
}> = ({ value, label, prefix = "", suffix = "", color = "#6366f1", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });
  const countProgress = spring({
    frame,
    fps,
    delay: delay + Math.round(0.2 * fps),
    config: { damping: 200 },
  });

  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const displayValue = Math.round(value * countProgress);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 40px",
        borderRadius: 16,
        border: `1.5px solid ${color}35`,
        background: `${color}08`,
        transform: `translateY(${translateY}px)`,
        opacity: entrance,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#ffffff",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 40px ${color}50`,
        }}
      >
        {prefix}{displayValue.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: `${color}cc`, marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};
```

## Usage Rules

- Always use `fontVariantNumeric: "tabular-nums"` so numbers don't jump as digits change width.
- Counter animation starts smooth with `damping: 200` - don't use bouncy springs on counters (they look glitchy).
- For a "from X to Y" comparison: render two counters side by side with the first at full value and the second counting up with a delay.
- Always pair big numbers with a label or context text so the viewer knows what they're looking at.
- Use `textShadow` glow matching the accent color on every counter.
