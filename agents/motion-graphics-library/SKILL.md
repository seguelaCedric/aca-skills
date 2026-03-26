---
name: motion-graphics-library
description: Reusable motion graphic building blocks for Remotion video compositions. Backgrounds, particles, text entrances, counters, cards, comparisons, CTAs, and more.
metadata:
  tags: motion-graphics, components, patterns, library, remotion, video
---

## Foundation

This skill builds ON TOP of `remotion-best-practices`. Every pattern here follows those rules:

- All animations driven by `useCurrentFrame()` + `interpolate()` or `spring()`
- **NO CSS transitions or animations** - they will not render correctly
- **NO Tailwind animation classes** - they will not render correctly
- All timing in seconds, multiplied by `fps` from `useVideoConfig()`
- `extrapolateRight: "clamp"` on all bounded interpolations
- `spring()` inputRanges are always strictly ascending

Load `remotion-best-practices` first for the foundational API knowledge. This skill provides the **visual building blocks** that compose into scenes.

## When to use

Use this skill whenever you need to build motion graphic scenes for video compositions. Each rule file contains a self-contained, copy-pasteable pattern with inline code.

## Pattern Categories

### Atmospheric Layers (background + ambient motion)
- [rules/backgrounds.md](rules/backgrounds.md) - Dark gradient backgrounds with animated grid overlays and glow orbs
- [rules/particles.md](rules/particles.md) - Floating particles, rising dust, falling sparks, glow orbs
- [rules/scan-effects.md](rules/scan-effects.md) - Horizontal scan lines, vertical light sweeps, pulse rings, vignettes

### Text & Typography
- [rules/text-entrances.md](rules/text-entrances.md) - Slam, slide-up, scale-in, split-reveal, word-by-word entrance patterns
- [rules/number-counter.md](rules/number-counter.md) - Animated counting numbers with formatting (currency, percent, integer)
- [rules/strikethrough-replace.md](rules/strikethrough-replace.md) - Strike through old text, reveal replacement with color shift
- [rules/quote-frame.md](rules/quote-frame.md) - Quote/testimonial reveal with oversized quotation marks and attribution

### Cards & Lists
- [rules/staggered-cards.md](rules/staggered-cards.md) - Cards entering with stagger delay, glowing borders, icon + label + description
- [rules/icon-grid.md](rules/icon-grid.md) - Grid of icons/emojis that light up sequentially with glow

### Data & Comparisons
- [rules/comparison.md](rules/comparison.md) - Before/after, VS split, cost comparison with animated separator
- [rules/progress-bar.md](rules/progress-bar.md) - Animated horizontal/circular progress bars with labels

### Branding & CTA
- [rules/logo-reveal.md](rules/logo-reveal.md) - Logo/brand entrance with scale, glow, and tagline fade-in
- [rules/cta-scene.md](rules/cta-scene.md) - CTA button with pulse glow, keyword prompt, arrow indicator

## How to compose scenes

Every scene should layer at minimum:

1. **Background** (from `backgrounds.md`) - never use flat colors
2. **Atmospheric layer** (from `particles.md` or `scan-effects.md`) - at least one
3. **Content layer** (from any content pattern above)
4. **Text glow** via `textShadow: "0 0 60px rgba(r,g,b,0.4)"` matching the scene accent color

This layering is what makes the output feel like motion graphics rather than a slideshow.
