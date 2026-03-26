import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * LogoReveal — logo text scales in with a bouncy spring while a glow ring
 * expands behind it, followed by a tagline fade-in.
 */

// Ideal composition size: 1080x1920 (portrait)

const LOGO_TEXT = "ACQUIST";
const TAGLINE = "Automated Client Acquisition";
const ACCENT_COLOR = "#6366f1";

const LogoReveal: React.FC<{
  logoText: string;
  tagline?: string;
  color?: string;
  delay?: number;
}> = ({ logoText, tagline, color = ACCENT_COLOR, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    delay,
    config: { damping: 12, stiffness: 200 },
  });
  const glowExpand = spring({
    frame,
    fps,
    delay,
    config: { damping: 30, stiffness: 60 },
  });
  const taglineEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(0.6 * fps),
    config: { damping: 200 },
  });

  const glowSize = interpolate(glowExpand, [0, 1], [0, 400]);
  const glowOpacity = interpolate(glowExpand, [0, 0.3, 1], [0, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Glow ring behind logo */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: glowSize,
            height: glowSize,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            opacity: glowOpacity,
            transform: "translate(-50%, -50%)",
            filter: "blur(40px)",
          }}
        />
        {/* Logo text */}
        <div
          style={{
            position: "relative",
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 4,
            transform: `scale(${logoScale})`,
            opacity: logoScale,
            textShadow: `0 0 60px ${color}60`,
          }}
        >
          {logoText}
        </div>
      </div>

      {/* Tagline */}
      {tagline && (
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            opacity: taglineEntrance,
            transform: `translateY(${interpolate(taglineEntrance, [0, 1], [15, 0])}px)`,
            letterSpacing: 2,
          }}
        >
          {tagline}
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
      <LogoReveal logoText={LOGO_TEXT} tagline={TAGLINE} color={ACCENT_COLOR} />
    </AbsoluteFill>
  );
};
