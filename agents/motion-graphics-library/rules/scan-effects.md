---
name: scan-effects
description: Scan lines, light sweeps, pulse rings, and vignettes for dramatic atmosphere in Remotion scenes.
metadata:
  tags: scan, sweep, pulse, vignette, atmosphere, dramatic
---

## Horizontal Scan Line

A thin horizontal line of light that sweeps top-to-bottom. Use for dramatic scenes (hook, shift, CTA).

```tsx
const ScanLine: React.FC<{
  color?: string;
  durationSec?: number;
}> = ({ color = "#6366f1", durationSec = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scanY = interpolate(frame, [0, durationSec * fps], [-5, 105], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        top: `${scanY}%`,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
        filter: "blur(1px)",
      }}
    />
  );
};
```

## Vertical Light Sweep

A wide vertical band of light that sweeps left-to-right across the scene. Creates a "reveal" feel.

```tsx
const LightSweep: React.FC<{
  color?: string;
  delay?: number;
}> = ({ color = "#ffffff", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweepX = interpolate(
    frame,
    [delay, delay + 1.5 * fps],
    [-20, 120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sweepX}%`,
          width: 120,
          background: `linear-gradient(90deg, transparent, ${color}15, ${color}08, transparent)`,
          transform: "skewX(-15deg)",
        }}
      />
    </div>
  );
};
```

## Pulse Ring

A ring that expands outward from a center point and fades. Use on stat reveals or impact moments.

```tsx
const PulseRing: React.FC<{
  color?: string;
  delay?: number;
  x?: string;
  y?: string;
}> = ({ color = "#6366f1", delay = 0, x = "50%", y = "50%" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 30, stiffness: 60 },
  });

  const size = interpolate(progress, [0, 1], [0, 600]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        opacity,
        transform: "translate(-50%, -50%)",
        boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`,
      }}
    />
  );
};
```

## Corner Vignette

Darkened corners that draw focus to the center. Static overlay - no animation needed.

```tsx
const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.6 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);
```

## Edge Glow

Subtle colored glow on one or more edges. Good for framing content.

```tsx
const EdgeGlow: React.FC<{
  color?: string;
  position?: "top" | "bottom" | "left" | "right";
}> = ({ color = "#6366f1", position = "bottom" }) => {
  const gradients: Record<string, string> = {
    top: `linear-gradient(to bottom, ${color}25 0%, transparent 30%)`,
    bottom: `linear-gradient(to top, ${color}25 0%, transparent 30%)`,
    left: `linear-gradient(to right, ${color}25 0%, transparent 30%)`,
    right: `linear-gradient(to left, ${color}25 0%, transparent 30%)`,
  };

  return (
    <AbsoluteFill
      style={{ background: gradients[position], pointerEvents: "none" }}
    />
  );
};
```

## Usage Rules

- Scan effects go on **top of content** (unlike particles which go between background and content).
- Use `pointerEvents: "none"` on overlays so they don't block interaction in the editor preview.
- **ScanLine** works best on scenes with 3-5s duration.
- **PulseRing** should be timed with a visual impact (text slam, number reveal) using the `delay` prop.
- **LightSweep** is a one-shot effect - use it once per scene, usually at the entrance.
- Don't stack more than 2 scan effects per scene or it gets noisy.
