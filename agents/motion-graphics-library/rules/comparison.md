---
name: comparison
description: Before/after, VS split, and cost comparison patterns for Remotion scenes.
metadata:
  tags: comparison, before-after, versus, split, cost, data
---

## VS Split

Two columns with a glowing "VS" separator. Use for head-to-head comparisons (old vs new, before vs after, competitor vs us).

See [VSSplit](assets/comparison-vs-split.tsx) for a complete runnable example with "Old Stack vs AI Agents".

```tsx
const VSSplit: React.FC<{
  leftTitle: string;
  leftItems: string[];
  leftColor?: string;
  rightTitle: string;
  rightItems: string[];
  rightColor?: string;
  delay?: number;
}> = ({
  leftTitle, leftItems, leftColor = "#ef4444",
  rightTitle, rightItems, rightColor = "#10b981",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const vsEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 12, stiffness: 200 },
  });
  const rightEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0, width: "100%" }}>
      {/* Left column */}
      <div
        style={{
          flex: 1, padding: 40, opacity: leftEntrance,
          transform: `translateX(${interpolate(leftEntrance, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 900, color: leftColor, marginBottom: 24, textShadow: `0 0 30px ${leftColor}40` }}>
          {leftTitle}
        </div>
        {leftItems.map((item, i) => (
          <div key={i} style={{ fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: leftColor, boxShadow: `0 0 8px ${leftColor}` }} />
            {item}
          </div>
        ))}
      </div>

      {/* VS separator */}
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          width: 80, transform: `scale(${vsEntrance})`, opacity: vsEntrance,
        }}
      >
        <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)" }} />
        <div style={{ fontSize: 32, fontWeight: 900, color: "#ffffff", padding: "16px 0", textShadow: "0 0 30px rgba(255,255,255,0.5)" }}>
          VS
        </div>
        <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)" }} />
      </div>

      {/* Right column */}
      <div
        style={{
          flex: 1, padding: 40, opacity: rightEntrance,
          transform: `translateX(${interpolate(rightEntrance, [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 900, color: rightColor, marginBottom: 24, textShadow: `0 0 30px ${rightColor}40` }}>
          {rightTitle}
        </div>
        {rightItems.map((item, i) => (
          <div key={i} style={{ fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: rightColor, boxShadow: `0 0 8px ${rightColor}` }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Cost Comparison

Two price points with an arrow between them showing the transformation. Use for "$2,400/mo -> $200/mo" type reveals.

```tsx
const CostComparison: React.FC<{
  oldCost: string;
  newCost: string;
  oldLabel?: string;
  newLabel?: string;
  delay?: number;
}> = ({
  oldCost, newCost,
  oldLabel = "Before", newLabel = "After",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const arrowEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.5 * fps),
    config: { damping: 200 },
  });
  const newEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.8 * fps),
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
      {/* Old cost */}
      <div style={{ textAlign: "center", opacity: oldEntrance }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{oldLabel}</div>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#ef4444", textShadow: "0 0 40px rgba(239,68,68,0.4)" }}>
          {oldCost}
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          fontSize: 48, color: "rgba(255,255,255,0.6)",
          opacity: arrowEntrance,
          transform: `scaleX(${arrowEntrance})`,
        }}
      >
        {"\u2192"}
      </div>

      {/* New cost */}
      <div style={{ textAlign: "center", transform: `scale(${newEntrance})`, opacity: newEntrance }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{newLabel}</div>
        <div style={{ fontSize: 80, fontWeight: 900, color: "#10b981", textShadow: "0 0 60px rgba(16,185,129,0.5)" }}>
          {newCost}
        </div>
      </div>
    </div>
  );
};
```

## Before/After Stack

Vertical layout with old state on top (dimmed) and new state below (highlighted). Good for portrait/mobile format.

```tsx
const BeforeAfterStack: React.FC<{
  beforeTitle: string;
  beforeItems: string[];
  afterTitle: string;
  afterItems: string[];
  delay?: number;
}> = ({ beforeTitle, beforeItems, afterTitle, afterItems, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beforeEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const dividerEntrance = spring({ frame, fps, delay: delay + Math.round(0.4 * fps), config: { damping: 200 } });
  const afterEntrance = spring({ frame, fps, delay: delay + Math.round(0.7 * fps), config: { damping: 200 } });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "0 60px" }}>
      {/* Before */}
      <div style={{ opacity: beforeEntrance * 0.6 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#ef4444", marginBottom: 12 }}>{beforeTitle}</div>
        {beforeItems.map((item, i) => (
          <div key={i} style={{ fontSize: 22, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{item}</div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", opacity: dividerEntrance }} />

      {/* After */}
      <div style={{ opacity: afterEntrance, transform: `translateY(${interpolate(afterEntrance, [0, 1], [20, 0])}px)` }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#10b981", marginBottom: 12, textShadow: "0 0 30px rgba(16,185,129,0.4)" }}>{afterTitle}</div>
        {afterItems.map((item, i) => (
          <div key={i} style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>{item}</div>
        ))}
      </div>
    </div>
  );
};
```

## Usage Rules

- "Before" / "Old" side always uses red/muted colors; "After" / "New" uses green/bright.
- Entrance order: old side first, separator/arrow second, new side last.
- The new/after side should be visually larger and more prominent than the old side.
- For cost comparisons: old cost = red, new cost = green, new cost font is ~1.25x larger.
- Always add glow (`textShadow`, `boxShadow`) to the "winner" side.
- Use the `delay` prop to sync with the scene's timeline position.
