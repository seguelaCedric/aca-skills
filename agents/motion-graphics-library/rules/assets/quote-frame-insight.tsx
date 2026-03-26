import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * QuoteFrame — oversized decorative quotation marks frame the quote text,
 * which fades in with a slide, followed by attribution.
 */

// Ideal composition size: 1080x1920 (portrait)

const QUOTE_TEXT = "You don't need a dashboard. You need an outcome.";
const QUOTE_ATTRIBUTION = "Every founder who switched";
const ACCENT_COLOR = "#a78bfa";

const QuoteFrame: React.FC<{
  quote: string;
  attribution?: string;
  color?: string;
  delay?: number;
}> = ({ quote, attribution, color = ACCENT_COLOR, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markEntrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });
  const textEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 200 },
  });
  const attrEntrance = spring({
    frame,
    fps,
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

export const MyAnimation = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <QuoteFrame
        quote={QUOTE_TEXT}
        attribution={QUOTE_ATTRIBUTION}
        color={ACCENT_COLOR}
      />
    </AbsoluteFill>
  );
};
