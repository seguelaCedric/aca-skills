---
name: icon-grid
description: Grid of icons or emojis that light up sequentially with glow effects for Remotion scenes.
metadata:
  tags: icons, grid, emoji, sequential, light-up, stagger
---

## Icon Grid with Sequential Light-Up

A grid of icon/emoji items that light up one by one. Use for showing a tech stack, tool list, or feature set.

```tsx
interface GridItem {
  icon: string;
  label: string;
  color?: string;
}

const IconGrid: React.FC<{
  items: GridItem[];
  columns?: number;
  staggerFrames?: number;
  delay?: number;
  defaultColor?: string;
}> = ({ items, columns = 3, staggerFrames = 5, delay = 0, defaultColor = "#6366f1" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "center",
        padding: "0 40px",
      }}
    >
      {items.map((item, i) => {
        const color = item.color || defaultColor;
        const entrance = spring({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: { damping: 200 },
        });

        return (
          <div
            key={i}
            style={{
              width: `calc(${100 / columns}% - ${20 * (columns - 1) / columns}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 12px",
              borderRadius: 16,
              border: `1.5px solid ${color}${entrance > 0.5 ? "40" : "15"}`,
              background: `${color}${entrance > 0.5 ? "12" : "05"}`,
              opacity: interpolate(entrance, [0, 0.3, 1], [0.2, 0.4, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(entrance, [0, 1], [0.85, 1])})`,
            }}
          >
            <div style={{ fontSize: 40 }}>{item.icon}</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: entrance > 0.5 ? "#ffffff" : "rgba(255,255,255,0.3)",
                textAlign: "center",
                textShadow: entrance > 0.5 ? `0 0 20px ${color}40` : "none",
              }}
            >
              {item.label}
            </div>
            {/* Glow dot indicator */}
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                opacity: entrance,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
```

## Compact Icon Row

Single horizontal row of icons for tight spaces. Use for small lists (3-5 items).

```tsx
const IconRow: React.FC<{
  items: { icon: string; label: string }[];
  color?: string;
  staggerFrames?: number;
  delay?: number;
}> = ({ items, color = "#6366f1", staggerFrames = 6, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
      {items.map((item, i) => {
        const entrance = spring({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: { damping: 15, stiffness: 200 },
        });

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              transform: `scale(${entrance})`,
              opacity: entrance,
            }}
          >
            <div
              style={{
                fontSize: 48,
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                background: `${color}15`,
                border: `1.5px solid ${color}30`,
              }}
            >
              {item.icon}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

## Usage Rules

- Items start dim (`opacity: 0.2`, muted border/bg) and "light up" as the spring completes.
- Grid columns: 3 for 6-9 items, 4 for 8-12 items. Never more than 4 columns in portrait.
- Keep labels SHORT (1-2 words max).
- Each item can have its own color for variety, or use a single `defaultColor` for uniformity.
- `staggerFrames: 5` is fast (good for lots of items), `staggerFrames: 8-10` is slower (good for dramatic reveals).
- Maximum 12 items per grid. Beyond that, split into multiple scenes.
