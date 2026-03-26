---
name: staggered-cards
description: Cards entering with stagger delay, glowing borders, icon + label + description for Remotion scenes.
metadata:
  tags: cards, stagger, list, items, grid, delay
---

## Staggered Card List

Cards slide in from the side with a stagger delay between each. The standard pattern for listing items, features, agents, tools, etc.

See [StaggeredCards](assets/staggered-cards-list.tsx) for a complete runnable example with 4 agent cards.

```tsx
interface CardItem {
  icon: string;
  label: string;
  description: string;
  color: string;
}

const StaggeredCards: React.FC<{
  items: CardItem[];
  staggerFrames?: number;
  delay?: number;
  direction?: "left" | "right";
}> = ({ items, staggerFrames = 6, delay = 0, direction = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((item, i) => {
        const entrance = spring({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: { damping: 200 },
        });
        const translateX = interpolate(
          entrance,
          [0, 1],
          [direction === "left" ? -60 : 60, 0]
        );

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 28px",
              borderRadius: 16,
              border: `1.5px solid ${item.color}35`,
              background: `${item.color}10`,
              transform: `translateX(${translateX}px)`,
              opacity: entrance,
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: 36 }}>{item.icon}</div>
            {/* Text */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#ffffff",
                  textShadow: `0 0 30px ${item.color}40`,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                {item.description}
              </div>
            </div>
            {/* Glow dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 12px ${item.color}`,
                opacity: entrance,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
```

## Staggered Stat Row

Horizontal row of stat values that pop in sequentially. Use for stats, KPIs, quick data points.

```tsx
interface StatItem {
  value: string;
  label: string;
  color: string;
}

const StaggeredStats: React.FC<{
  items: StatItem[];
  staggerFrames?: number;
  delay?: number;
}> = ({ items, staggerFrames = 8, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
      {items.map((item, i) => {
        const entrance = spring({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: { damping: 15, stiffness: 200 },
        });
        const scale = interpolate(entrance, [0, 1], [0.5, 1]);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 32px",
              borderRadius: 16,
              border: `1.5px solid ${item.color}30`,
              background: `${item.color}08`,
              transform: `scale(${scale})`,
              opacity: entrance,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#ffffff",
                textShadow: `0 0 40px ${item.color}50`,
              }}
            >
              {item.value}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: `${item.color}cc`, marginTop: 6 }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

## Compact Pill List

Small, tight pills that stagger in. Use for tags, tools, or short lists.

```tsx
const StaggeredPills: React.FC<{
  items: string[];
  color?: string;
  delay?: number;
  staggerFrames?: number;
}> = ({ items, color = "#6366f1", delay = 0, staggerFrames = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
      {items.map((item, i) => {
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
              padding: "10px 20px",
              borderRadius: 100,
              border: `1px solid ${color}40`,
              background: `${color}15`,
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
              opacity: entrance,
              transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])})`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
```

## Usage Rules

- `staggerFrames` controls the delay between each card. 4-6 frames for fast stagger, 8-12 for dramatic stagger.
- Use `damping: 200` for smooth entrances, `damping: 15, stiffness: 200` for snappy/bouncy.
- Every card needs a `border` + `background` using the item's color at low opacity (`35` for border, `10` for background).
- Add a **glow dot** (small circle with `boxShadow`) to each card for polish.
- Maximum 4-6 cards per scene. More than 6 is too dense for a 5-second scene.
- Always wrap the container in generous padding (50-80px) for mobile readability.
