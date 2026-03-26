---
name: backgrounds
description: Dark gradient backgrounds with animated grid overlays and glow orbs for Remotion scenes.
metadata:
  tags: background, grid, gradient, glow, dark, atmosphere
---

## Dark Grid Background

The foundation of every motion graphic scene. Layers a radial gradient, animated grid lines, and a blurred glow orb.

See [DarkGrid](assets/backgrounds-dark-grid.tsx) for a complete runnable example with sample content overlay.

```tsx
const DarkGrid: React.FC<{ accentColor?: string }> = ({
  accentColor = "#6366f1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = interpolate(frame, [0, 30 * fps], [0, -300], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill>
      {/* Radial gradient base */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 30%, ${accentColor}20 0%, #0a0a1a 50%, #020208 100%)`,
        }}
      />
      {/* Drifting grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${accentColor}12 1px, transparent 1px), linear-gradient(90deg, ${accentColor}12 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          transform: `translateY(${drift % 50}px)`,
        }}
      />
      {/* Top glow orb */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          top: -350,
          left: "50%",
          transform: "translateX(-50%)",
          filter: "blur(80px)",
        }}
      />
    </AbsoluteFill>
  );
};
```

### Parameters

| Prop | Default | Description |
|------|---------|-------------|
| `accentColor` | `"#6366f1"` | Hex color for grid lines and glow orb |

### Grid size variants

- `backgroundSize: "50px 50px"` - standard (default)
- `backgroundSize: "30px 30px"` - dense, techy feel
- `backgroundSize: "80px 80px"` - spacious, cinematic feel

### Color presets

```tsx
// Deep purple (default)
<DarkGrid accentColor="#6366f1" />

// Emerald green
<DarkGrid accentColor="#10b981" />

// Warm amber
<DarkGrid accentColor="#f59e0b" />

// Red/danger
<DarkGrid accentColor="#ef4444" />

// Cyan/ice
<DarkGrid accentColor="#06b6d4" />
```

## Dual-Glow Background

Two glow orbs that drift apart for a more dynamic atmosphere.

```tsx
const DualGlowBg: React.FC<{
  colorA?: string;
  colorB?: string;
}> = ({ colorA = "#6366f1", colorB = "#ec4899" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const driftX = interpolate(frame, [0, 10 * fps], [0, 80], {
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(frame, [0, 10 * fps], [0, -40], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050510" }}>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colorA}30 0%, transparent 70%)`,
          top: "10%",
          left: `calc(30% - ${driftX}px)`,
          transform: `translateY(${driftY}px)`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colorB}25 0%, transparent 70%)`,
          bottom: "5%",
          right: `calc(20% - ${driftX}px)`,
          transform: `translateY(${-driftY}px)`,
          filter: "blur(100px)",
        }}
      />
    </AbsoluteFill>
  );
};
```

## Gradient Shift Background

Background that slowly transitions between two gradient states. Good for longer scenes.

```tsx
const GradientShift: React.FC<{
  fromColor?: string;
  toColor?: string;
}> = ({ fromColor = "#1a0a2e", toColor = "#0a1a2e" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shift = interpolate(frame, [0, 5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const r1 = interpolateColors(shift, [0, 1], [fromColor, toColor]);
  const r2 = interpolateColors(shift, [0, 1], ["#0a0a1a", "#0a0a2a"]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${r1} 0%, ${r2} 60%, #020208 100%)`,
      }}
    />
  );
};
```

## Usage Rules

- **Never use flat black** (`#000000`) as a background. Always use a radial gradient.
- **Always animate something** in the background - grid drift, glow pulse, or color shift.
- **Layer order**: gradient base -> grid -> glow orbs -> content on top.
- Grid `drift` uses `extrapolateRight: "extend"` so it keeps scrolling beyond the animation range.
- Glow orbs use `filter: "blur(80-100px)"` for soft edges.
