---
name: cta-scene
description: CTA button with pulse glow, keyword prompt, and arrow indicator for Remotion video end scenes.
metadata:
  tags: cta, button, call-to-action, pulse, glow, keyword, end
---

## CTA Button with Pulse

A glowing button that pulses continuously. The closing scene of every video.

```tsx
const CTAButton: React.FC<{
  text: string;
  color?: string;
  delay?: number;
}> = ({ text, color = "#f59e0b", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 200 },
  });

  // Continuous pulse after entrance
  const pulsePhase = Math.max(0, frame - delay - Math.round(0.5 * fps));
  const pulse = interpolate(
    Math.sin((pulsePhase / fps) * 3),
    [-1, 1],
    [0.7, 1],
  );

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "24px 56px",
        borderRadius: 16,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        transform: `scale(${entrance * pulse})`,
        opacity: entrance,
        boxShadow: `0 0 40px ${color}60, 0 0 80px ${color}30`,
      }}
    >
      <span style={{ fontSize: 36, fontWeight: 900, color: "#000000" }}>
        {text}
      </span>
    </div>
  );
};
```

## Keyword Prompt

"Comment [KEYWORD] below" call-to-action with the keyword highlighted. Standard LinkedIn video CTA.

See [KeywordPrompt](assets/cta-keyword-prompt.tsx) for a complete end scene with headline, subtext, and pulsing keyword badge.

```tsx
const KeywordPrompt: React.FC<{
  keyword: string;
  promptText?: string;
  color?: string;
  delay?: number;
}> = ({
  keyword,
  promptText = "Comment",
  color = "#f59e0b",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const keywordEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 12, stiffness: 200 },
  });
  const arrowEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.6 * fps),
    config: { damping: 200 },
  });

  // Keyword pulse
  const pulsePhase = Math.max(0, frame - delay - Math.round(0.8 * fps));
  const pulse = interpolate(Math.sin((pulsePhase / fps) * 2.5), [-1, 1], [0.85, 1]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Prompt text */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "rgba(255,255,255,0.7)",
          opacity: textEntrance,
        }}
      >
        {promptText}
      </div>

      {/* Keyword badge */}
      <div
        style={{
          padding: "16px 48px",
          borderRadius: 12,
          background: `${color}20`,
          border: `2px solid ${color}`,
          transform: `scale(${keywordEntrance * pulse})`,
          opacity: keywordEntrance,
          boxShadow: `0 0 30px ${color}40`,
        }}
      >
        <span style={{ fontSize: 48, fontWeight: 900, color, letterSpacing: 4 }}>
          {keyword}
        </span>
      </div>

      {/* Arrow pointing down */}
      <div
        style={{
          fontSize: 40,
          color: "rgba(255,255,255,0.5)",
          opacity: arrowEntrance,
          transform: `translateY(${interpolate(
            Math.sin((frame / fps) * 2),
            [-1, 1],
            [-5, 5]
          )}px)`,
        }}
      >
        {"\u2193"}
      </div>
    </div>
  );
};
```

## Full CTA Scene

Complete end scene composition: headline + subtext + keyword prompt. Use this as a full scene template.

```tsx
const FullCTAScene: React.FC<{
  headline: string;
  subtext: string;
  keyword: string;
  accentColor?: string;
}> = ({ headline, subtext, keyword, accentColor = "#f59e0b" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const subtextEntrance = spring({ frame, fps, delay: Math.round(0.3 * fps), config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        gap: 40,
      }}
    >
      {/* Headline */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          opacity: headlineEntrance,
          textShadow: `0 0 60px ${accentColor}40`,
        }}
      >
        {headline}
      </div>

      {/* Subtext */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.5,
          opacity: subtextEntrance,
          transform: `translateY(${interpolate(subtextEntrance, [0, 1], [15, 0])}px)`,
        }}
      >
        {subtext}
      </div>

      {/* Keyword CTA */}
      <KeywordPrompt
        keyword={keyword}
        color={accentColor}
        delay={Math.round(0.8 * fps)}
      />
    </AbsoluteFill>
  );
};
```

## Usage Rules

- CTA is always the **last scene** of the video.
- The CTA button/keyword uses **gold/amber** (`#f59e0b`) accent by default - the "action" color.
- Pulse animation is continuous (uses `Math.sin` on the raw frame) - it starts after the entrance completes.
- The bouncing arrow (`\u2193`) adds motion to what would otherwise be a static element.
- Don't put too much text in the CTA - headline should be 3-6 words, subtext 1-2 short sentences.
- The keyword should be a single word in ALL CAPS.
