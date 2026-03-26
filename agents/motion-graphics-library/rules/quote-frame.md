---
name: quote-frame
description: Quote and testimonial reveal patterns for Remotion with oversized quotation marks and attribution.
metadata:
  tags: quote, testimonial, insight, wisdom, attribution, reveal
---

## Quote with Quotation Marks

Oversized decorative quotation marks frame the quote text. The text reveals word-by-word or with a fade.

See [QuoteFrame](assets/quote-frame-insight.tsx) for a complete runnable example with quote marks and attribution.

```tsx
const QuoteFrame: React.FC<{
  quote: string;
  attribution?: string;
  color?: string;
  delay?: number;
}> = ({ quote, attribution, color = "#6366f1", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markEntrance = spring({
    frame, fps, delay,
    config: { damping: 200 },
  });
  const textEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 200 },
  });
  const attrEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.8 * fps),
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 60px",
        gap: 24,
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          fontSize: 120,
          fontWeight: 900,
          color: `${color}40`,
          lineHeight: 0.6,
          transform: `scale(${markEntrance})`,
          opacity: markEntrance,
          textShadow: `0 0 40px ${color}30`,
        }}
      >
        {"\u201C"}
      </div>

      {/* Quote text */}
      <div
        style={{
          fontSize: 40,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.5,
          opacity: textEntrance,
          transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
          textShadow: `0 0 40px ${color}30`,
        }}
      >
        {quote}
      </div>

      {/* Attribution */}
      {attribution && (
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: `${color}aa`,
            opacity: attrEntrance,
          }}
        >
          -- {attribution}
        </div>
      )}
    </div>
  );
};
```

## Minimal Quote (Line Accent)

A vertical accent line on the left with the quote text. Clean, modern style.

```tsx
const MinimalQuote: React.FC<{
  quote: string;
  color?: string;
  delay?: number;
}> = ({ quote, color = "#6366f1", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const lineHeight = interpolate(lineEntrance, [0, 1], [0, 100]);
  const textEntrance = spring({
    frame, fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 200 },
  });

  return (
    <div style={{ display: "flex", gap: 28, padding: "0 60px", alignItems: "center" }}>
      {/* Accent line */}
      <div
        style={{
          width: 4,
          height: `${lineHeight}%`,
          background: color,
          borderRadius: 2,
          boxShadow: `0 0 12px ${color}60`,
          minHeight: 0,
          alignSelf: "stretch",
        }}
      />
      {/* Quote text */}
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.6,
          opacity: textEntrance,
          transform: `translateX(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
        }}
      >
        {quote}
      </div>
    </div>
  );
};
```

## Insight Reveal (Word Highlight)

Quote text where key words get highlighted with a background sweep as they're revealed. Use for the "aha moment" scene.

```tsx
const InsightReveal: React.FC<{
  words: { text: string; highlight?: boolean }[];
  highlightColor?: string;
  delay?: number;
}> = ({ words, highlightColor = "#f59e0b", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 12px",
        justifyContent: "center",
        padding: "0 50px",
      }}
    >
      {words.map((word, i) => {
        const entrance = spring({
          frame, fps,
          delay: delay + i * 3,
          config: { damping: 200 },
        });
        const highlightFill = word.highlight
          ? interpolate(
              frame,
              [delay + i * 3 + Math.round(0.2 * fps), delay + i * 3 + Math.round(0.5 * fps)],
              [0, 100],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          : 0;

        return (
          <span
            key={i}
            style={{
              fontSize: 44,
              fontWeight: word.highlight ? 900 : 700,
              color: word.highlight ? "#000000" : "#ffffff",
              opacity: entrance,
              display: "inline-block",
              padding: word.highlight ? "4px 12px" : "4px 0",
              borderRadius: 6,
              background: word.highlight
                ? `linear-gradient(90deg, ${highlightColor} ${highlightFill}%, transparent ${highlightFill}%)`
                : "transparent",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
```

## Usage Rules

- Quotes should be the **exact words** from the source content - never paraphrased.
- Maximum 2 lines of text for readability at 40px+ font size.
- Use `QuoteFrame` for formal quotes with attribution, `MinimalQuote` for insight/wisdom, `InsightReveal` for aha moments.
- Quotation marks (`"`) use the Unicode curly quote character `\u201C`, not straight quotes.
- Attribution uses a double hyphen (`--`), not an em dash.
- The quote scene is typically a "calm" scene in the pacing rhythm - use smooth springs (`damping: 200`), no bouncy entrances.
