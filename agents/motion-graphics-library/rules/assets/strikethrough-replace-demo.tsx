import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * StrikethroughReplace — old text gets a red strikethrough line drawn across,
 * then dims while new replacement text slides in below.
 * Three-phase animation: enter -> strike -> replace.
 */

// Ideal composition size: 1080x1920 (portrait)

const OLD_TEXT = "11 SaaS tools";
const NEW_TEXT = "4 AI agents";
const FONT_SIZE = 56;

const StrikethroughReplace: React.FC<{
  oldText: string;
  newText: string;
  oldColor?: string;
  newColor?: string;
  strikeColor?: string;
  fontSize?: number;
  delay?: number;
}> = ({
  oldText,
  newText,
  oldColor = "rgba(255,255,255,0.5)",
  newColor = "#10b981",
  strikeColor = "#ef4444",
  fontSize = FONT_SIZE,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Old text fades in
  const oldEntrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  // Phase 2: Strikethrough line draws across
  const strikeDelay = delay + Math.round(0.6 * fps);
  const strikeProgress = interpolate(
    frame,
    [strikeDelay, strikeDelay + Math.round(0.4 * fps)],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Phase 3: Old text dims, new text slides up
  const replaceDelay = delay + Math.round(1.2 * fps);
  const replaceEntrance = spring({
    frame,
    fps,
    delay: replaceDelay,
    config: { damping: 200 },
  });
  const oldDim = interpolate(replaceEntrance, [0, 1], [1, 0.3]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Old text with strikethrough */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            fontSize,
            fontWeight: 800,
            color: oldColor,
            opacity: oldEntrance * oldDim,
          }}
        >
          {oldText}
        </div>
        {/* Animated strike line */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: 0,
            height: 4,
            width: `${strikeProgress}%`,
            background: strikeColor,
            borderRadius: 2,
            boxShadow: `0 0 12px ${strikeColor}80`,
          }}
        />
      </div>

      {/* New replacement text */}
      <div
        style={{
          fontSize: fontSize * 1.1,
          fontWeight: 900,
          color: newColor,
          transform: `translateY(${interpolate(replaceEntrance, [0, 1], [20, 0])}px)`,
          opacity: replaceEntrance,
          textShadow: `0 0 60px ${newColor}50`,
        }}
      >
        {newText}
      </div>
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
        padding: 60,
      }}
    >
      <StrikethroughReplace oldText={OLD_TEXT} newText={NEW_TEXT} />
    </AbsoluteFill>
  );
};
