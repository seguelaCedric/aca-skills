---
name: editor-runtime
description: ACA editor runtime overrides - no imports, pre-injected globals, metadata comments
metadata:
  tags: aca, editor, runtime, globals, imports, metadata, sandbox
---

# ACA Editor Runtime

The ACA video editor runs compositions in a sandboxed runtime where all Remotion packages are pre-injected as globals. This changes how code is written.

## Overrides (take precedence over remotion-best-practices)

1. **NO import statements** -- The remotion-best-practices skill shows `import { ... } from "remotion"` in its examples. **Ignore all imports.** In the ACA editor, all dependencies are pre-injected as globals. Just use `AbsoluteFill`, `spring`, `interpolate`, etc. directly.
2. **Metadata comments are REQUIRED** at the top of every composition:
   - `// @aspect portrait|landscape|square`
   - `// @duration Xs` (total duration in seconds)
   - `// @fps 30`
3. **MUST end with** `export default ComponentName`
4. **All sub-components defined inline** -- No separate files, no external imports.
5. **`premountFor={15}`** on every `TransitionSeries.Sequence` (the remotion-best-practices skill uses `premountFor={1 * fps}` which is 30 frames -- use 15 instead for the ACA editor).
