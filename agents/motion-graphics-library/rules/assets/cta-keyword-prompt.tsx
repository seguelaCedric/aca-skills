import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * KeywordPrompt — "Comment [KEYWORD] below" CTA with pulsing badge
 * and bouncing arrow indicator. Standard LinkedIn video end scene.
 */

// Ideal composition size: 1080x1920 (portrait)

const CTA_HEADLINE = "Agents as a Service";
const CTA_SUBTEXT =
  "The founders who get this first will run circles around the rest.";
const CTA_KEYWORD = "AGENTS";
const CTA_COLOR = "#f59e0b";

const KeywordPrompt: React.FC<{
  keyword: string;
  promptText?: string;
  color?: string;
  delay?: number;
}> = ({
  keyword,
  promptText = "Comment",
  color = CTA_COLOR,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textEntrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });
  const keywordEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 12, stiffness: 200 },
  });
  const arrowEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(0.6 * fps),
    config: { damping: 200 },
  });

  // Continuous pulse after entrance
  const pulsePhase = Math.max(0, frame - delay - Math.round(0.8 * fps));
  const pulse = interpolate(
    Math.sin((pulsePhase / fps) * 2.5),
    [-1, 1],
    [0.85, 1],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
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
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            color,
            letterSpacing: 4,
          }}
        >
          {keyword}
        </span>
      </div>

      {/* Bouncing arrow */}
      <div
        style={{
          fontSize: 40,
          color: "rgba(255,255,255,0.5)",
          opacity: arrowEntrance,
          transform: `translateY(${interpolate(
            Math.sin((frame / fps) * 2),
            [-1, 1],
            [-5, 5],
          )}px)`,
        }}
      >
        {"\u2193"}
      </div>
    </div>
  );
};

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineEntrance = spring({
    frame,
    fps,
    delay: 0,
    config: { damping: 200 },
  });
  const subtextEntrance = spring({
    frame,
    fps,
    delay: Math.round(0.3 * fps),
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        gap: 40,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          opacity: headlineEntrance,
          textShadow: `0 0 60px ${CTA_COLOR}40`,
        }}
      >
        {CTA_HEADLINE}
      </div>
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
        {CTA_SUBTEXT}
      </div>
      <KeywordPrompt
        keyword={CTA_KEYWORD}
        color={CTA_COLOR}
        delay={Math.round(0.8 * fps)}
      />
    </AbsoluteFill>
  );
};
