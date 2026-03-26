---
name: visual-style
description: Typography rules, motion graphics requirements, and color guidelines for ACA video productions
metadata:
  tags: visual, style, typography, motion, graphics, colors, layout
---

# Visual Style Guidelines

For the actual **motion graphic components** (DarkGrid, Particles, ScanLine, etc.), load the `motion-graphics-library` skill. This rule covers the ACA-specific typography, color, and layout requirements.

## Typography (MINIMUM sizes for 1080x1920 portrait)

- Scene titles / hook text: **56-72px**, fontWeight 900
- Key numbers / hero text: **80-130px**, fontWeight 900
- Body text / descriptions: **36-48px**, fontWeight 700
- Subtitles / secondary text: **28-38px**, fontWeight 600
- Labels / monospace tags: **24-32px**
- NEVER go below 24px -- it won't be readable on mobile

## Motion Graphics (REQUIRED on every scene)

Every scene MUST include at least 2 of these motion graphic elements (see `motion-graphics-library` for copy-pasteable code):
1. **Animated grid background** -- from `motion-graphics-library` [backgrounds.md](../../../.agents/skills/motion-graphics-library/rules/backgrounds.md)
2. **Floating particles** -- from `motion-graphics-library` [particles.md](../../../.agents/skills/motion-graphics-library/rules/particles.md)
3. **Glow orbs** -- large blurred radial gradients that pulse or shift
4. **Scan lines** -- from `motion-graphics-library` [scan-effects.md](../../../.agents/skills/motion-graphics-library/rules/scan-effects.md)
5. **Text glow** -- textShadow with colored glow: `textShadow: "0 0 60px rgba(r,g,b,0.4)"`
6. **Accent dot/line indicators** -- small glowing dots next to list items with boxShadow glow

Do NOT create static scenes with just text on a flat background. Every frame must have visible motion.

## Color and Layout

- **Dark backgrounds** -- radial gradients, not flat black
- **Accent colors per scene** -- vary across scenes (red, green, purple, gold, blue)
- **Generous padding** -- 50-80px on all sides for mobile
- **Borders with glow** -- cards use `border: "1.5px solid ${color}35"` with matching background `${color}10`

## Scene Layering (REQUIRED)

Every scene layers these in order (see `motion-graphics-library` SKILL.md for full details):
1. **Background** (DarkGrid or similar) -- never flat colors
2. **Atmospheric layer** (Particles and/or ScanLine) -- at least one
3. **Content layer** (text, cards, numbers, etc.)
4. **Text glow** via textShadow matching the scene accent color
