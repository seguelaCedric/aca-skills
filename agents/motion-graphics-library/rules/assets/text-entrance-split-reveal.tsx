import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Split Reveal - Text is hidden behind two panels that slide apart.
 *
 * Ideal composition size: 1080x1920 (portrait) or 1920x1080 (landscape)
 *
 * The text is rendered at full opacity but clipped. Two overlay panels
 * (top half + bottom half) slide away to reveal it. This creates a
 * cinematic curtain-open effect.
 */

const SplitReveal: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  splitColor?: string;
  accentColor?: string;
  delay?: number;
}> = ({
  text,
  color = "#ffffff",
  fontSize = 64,
  splitColor = "#0a0a1a",
  accentColor = "#6366f1",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panels slide apart
  const splitProgress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const topOffset = interpolate(splitProgress, [0, 1], [0, -105]);
  const bottomOffset = interpolate(splitProgress, [0, 1], [0, 105]);

  // Text glow intensifies after reveal
  const glowOpacity = interpolate(splitProgress, [0.5, 1], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center line flash
  const lineFlash = interpolate(splitProgress, [0, 0.3, 0.6], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Text (always rendered, revealed by panels moving) */}
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color,
          textAlign: "center",
          padding: "0 60px",
          textShadow: `0 0 60px ${accentColor}${Math.round(glowOpacity * 255)
            .toString(16)
            .padStart(2, "0")}`,
          zIndex: 1,
        }}
      >
        {text}
      </div>

      {/* Top panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: splitColor,
          transform: `translateY(${topOffset}%)`,
          zIndex: 2,
        }}
      />

      {/* Bottom panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: splitColor,
          transform: `translateY(${-bottomOffset}%)`,
          zIndex: 2,
        }}
      />

      {/* Center line flash */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "50%",
          height: 2,
          background: accentColor,
          opacity: lineFlash,
          transform: "translateY(-50%)",
          boxShadow: `0 0 20px ${accentColor}`,
          zIndex: 3,
        }}
      />
    </AbsoluteFill>
  );
};

export const MyAnimation = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      <SplitReveal
        text="The Future Is Now"
        accentColor="#6366f1"
        fontSize={72}
      />
    </AbsoluteFill>
  );
};
