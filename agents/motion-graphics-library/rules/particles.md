---
name: particles
description: Floating particles, glow orbs, rising dust, and falling sparks for atmospheric motion in Remotion scenes.
metadata:
  tags: particles, dust, sparks, glow, atmosphere, ambient
---

## Floating Particles

Small dots that rise from the bottom and fade in/out. The default atmospheric layer for every scene.

See [Floating Particles](assets/particles-floating.tsx) for a complete runnable example.

```tsx
const Particles: React.FC<{
  count?: number;
  color?: string;
  direction?: "up" | "down";
}> = ({ count = 15, color = "#6366f1", direction = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = i * 137.5;
        const x = (seed * 7.3) % 100;
        const startY = direction === "up" ? 110 + ((seed * 3.1) % 20) : -10 - ((seed * 3.1) % 20);
        const speed = 0.2 + ((seed * 1.7) % 0.4);
        const size = 3 + ((seed * 2.3) % 6);
        const sign = direction === "up" ? -1 : 1;
        const y = startY + sign * ((frame / fps) * speed * 25);
        const opacity = interpolate(
          y,
          direction === "up" ? [-10, 20, 80, 110] : [-10, 20, 80, 110],
          [0, 0.5, 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

### Parameters

| Prop | Default | Description |
|------|---------|-------------|
| `count` | `15` | Number of particles |
| `color` | `"#6366f1"` | Particle color (hex) |
| `direction` | `"up"` | `"up"` = rise from bottom, `"down"` = fall from top |

### Density guidelines

- `count: 8-12` - subtle, background ambiance
- `count: 15-20` - standard density
- `count: 25-35` - dense, dramatic scenes (hook, CTA)

## Pulsing Glow Orbs

Large blurred circles that slowly pulse in opacity. Creates a breathing, organic feel.

```tsx
const GlowOrbs: React.FC<{
  color?: string;
  count?: number;
}> = ({ color = "#6366f1", count = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = i * 234.7;
        const x = 15 + ((seed * 3.7) % 70);
        const y = 10 + ((seed * 5.3) % 80);
        const size = 300 + ((seed * 2.1) % 400);
        const phaseOffset = (seed * 1.3) % (2 * Math.PI);
        const pulse = interpolate(
          Math.sin((frame / fps) * 0.8 + phaseOffset),
          [-1, 1],
          [0.08, 0.25],
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              opacity: pulse,
              filter: "blur(60px)",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

## Spark Burst

Particles that explode outward from a center point. Use for dramatic moments (hook impact, stat reveal).

```tsx
const SparkBurst: React.FC<{
  color?: string;
  count?: number;
  delay?: number;
}> = ({ color = "#f59e0b", count = 20, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 30, stiffness: 80 },
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const distance = 100 + ((i * 47.3) % 300);
        const size = 2 + ((i * 3.7) % 4);
        const x = 50 + Math.cos(angle) * distance * progress;
        const y = 50 + Math.sin(angle) * distance * progress;
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

## Usage Rules

- **Always use `overflow: "hidden"`** on the container to prevent particles from escaping the frame.
- Particle positions are derived from a seed (`i * 137.5`) for deterministic, evenly-distributed placement. Don't use `Math.random()` - it breaks Remotion's frame-by-frame rendering.
- Use `interpolate()` with ascending inputRange for opacity fade in/out.
- Particles should match or complement the scene's accent color.
- Layer particles BETWEEN the background and content - never on top of text.
