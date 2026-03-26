---
name: quality-checklist
description: Pre-push verification checklist for ACA video productions
metadata:
  tags: quality, checklist, verification, review, qa
---

# Quality Checklist

Before pushing code, verify ALL of these:

## Script Fidelity
- [ ] Every visible text in the video traces back to the source content - no invented copy
- [ ] Narrative arc matches the source: same order of ideas, same story beats

## Code Format
- [ ] Metadata comments present: `// @aspect`, `// @duration`, `// @fps`
- [ ] `export default ComponentName` at end
- [ ] No import statements anywhere
- [ ] All animations use `spring()`/`interpolate()`, no CSS transitions
- [ ] Duration math is correct (scenes minus transitions)
- [ ] `premountFor={15}` on every `TransitionSeries.Sequence`
- [ ] All `interpolate()` inputRanges are STRICTLY monotonically increasing
- [ ] Code compiles (no syntax errors, all variables defined)

## Visual Quality
- [ ] Text is BIG: titles >= 56px, hero numbers >= 80px, body >= 36px, nothing below 24px
- [ ] Every scene has at least 2 motion graphic layers (DarkGrid + Particles minimum)
- [ ] Every element has an animated entrance (no static pops)
- [ ] Text has glow via textShadow matching scene accent color
- [ ] Background uses DarkGrid with radial gradient + grid + glow orb (never flat black)

## Sound Design
- [ ] Background music added (volume 0.15-0.25 with voiceover, 0.3-0.4 without)
- [ ] SFX are intentional (max 4-6 per video) - placed at key moments, not on every action
- [ ] No SFX sound repeated back-to-back - vary the sounds
- [ ] If SFX present, timestamps are CALCULATED from TransitionSeries frame math

## Voiceover
- [ ] TTS audio generated and pushed to project voiceover field
- [ ] Voiceover script follows the source content narrative faithfully
- [ ] Voice matches org's character or user's request
- [ ] Word timestamps present in voiceover (enables automatic captions)
