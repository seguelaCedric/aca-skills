---
name: progress-bar
description: Animated horizontal and circular progress bars with labels for Remotion scenes.
metadata:
  tags: progress, bar, circular, percentage, loading, fill
---

## Horizontal Progress Bar

A bar that fills from left to right with a glow effect. Use for showing percentages, completion rates, or comparisons.

```tsx
const ProgressBar: React.FC<{
  value: number;
  label: string;
  color?: string;
  delay?: number;
  showPercent?: boolean;
}> = ({ value, label, color = "#6366f1", delay = 0, showPercent = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const fillProgress = spring({
    frame, fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 200 },
  });
  const fillWidth = value * fillProgress;

  return (
    <div style={{ width: "100%", opacity: entrance }}>
      {/* Label row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#ffffff" }}>{label}</div>
        {showPercent && (
          <div style={{ fontSize: 24, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(fillWidth)}%
          </div>
        )}
      </div>
      {/* Track */}
      <div
        style={{
          width: "100%",
          height: 16,
          borderRadius: 8,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            width: `${fillWidth}%`,
            height: "100%",
            borderRadius: 8,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 20px ${color}60`,
          }}
        />
      </div>
    </div>
  );
};
```

## Multiple Progress Bars (Staggered)

A stack of progress bars that fill sequentially. Use for comparing multiple metrics.

```tsx
interface BarData {
  label: string;
  value: number;
  color: string;
}

const ProgressBars: React.FC<{
  bars: BarData[];
  staggerFrames?: number;
  delay?: number;
}> = ({ bars, staggerFrames = 8, delay = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "0 60px", width: "100%" }}>
    {bars.map((bar, i) => (
      <ProgressBar
        key={i}
        value={bar.value}
        label={bar.label}
        color={bar.color}
        delay={delay + i * staggerFrames}
      />
    ))}
  </div>
);
```

## Circular Progress

An SVG ring that fills clockwise. Use for single hero stats.

```tsx
const CircularProgress: React.FC<{
  value: number;
  label?: string;
  color?: string;
  size?: number;
  delay?: number;
}> = ({ value, label, color = "#6366f1", size = 200, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fillProgress = spring({
    frame, fps, delay,
    config: { damping: 200 },
  });

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillLength = (value / 100) * circumference * fillProgress;
  const offset = circumference - fillLength;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={10}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeDasharray={`${fillLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        {/* Center value */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.28,
            fontWeight: 900,
            color: "#ffffff",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(value * fillProgress)}%
        </div>
      </div>
      {label && (
        <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
          {label}
        </div>
      )}
    </div>
  );
};
```

## Usage Rules

- Progress fill uses `spring()` with `damping: 200` for smooth, non-bouncy fill.
- Always use `fontVariantNumeric: "tabular-nums"` on percentage labels so numbers don't jump.
- Circular progress starts from 12 o'clock (`transform: rotate(-90deg)` on the SVG).
- Fill bar has a `boxShadow` glow matching the color; circular fill has `drop-shadow`.
- Maximum 5 horizontal bars stacked. More than that, use an icon grid instead.
- The percentage value animates in sync with the fill (multiply by `fillProgress`).
