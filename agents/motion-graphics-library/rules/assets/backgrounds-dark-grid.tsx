import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * DarkGrid — animated grid background with radial gradient and glow orb.
 * The foundational atmospheric layer for motion graphic scenes.
 */

// Ideal composition size: 1080x1920 (portrait)

const COLOR_ACCENT = "#6366f1";
const COLOR_BASE_CENTER = "#1a0a2e";
const COLOR_BASE_MID = "#0a0a1a";
const COLOR_BASE_EDGE = "#020208";
const GRID_SIZE = 50;
const GRID_LINE_OPACITY = "12"; // hex alpha
const ORB_SIZE = 900;
const ORB_BLUR = 80;

const DarkGrid: React.FC<{ accentColor?: string }> = ({
  accentColor = COLOR_ACCENT,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = interpolate(frame, [0, 30 * fps], [0, -300], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill>
      {/* Radial gradient base */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at 50% 30%, ${COLOR_BASE_CENTER} 0%, ${COLOR_BASE_MID} 50%, ${COLOR_BASE_EDGE} 100%)`,
        }}
      />
      {/* Drifting grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${accentColor}${GRID_LINE_OPACITY} 1px, transparent 1px), linear-gradient(90deg, ${accentColor}${GRID_LINE_OPACITY} 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          transform: `translateY(${drift % GRID_SIZE}px)`,
        }}
      />
      {/* Top glow orb */}
      <div
        style={{
          position: "absolute",
          width: ORB_SIZE,
          height: ORB_SIZE,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          top: -350,
          left: "50%",
          transform: "translateX(-50%)",
          filter: `blur(${ORB_BLUR}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const MyAnimation = () => {
  return (
    <AbsoluteFill>
      <DarkGrid accentColor="#6366f1" />
      {/* Sample content to show the background in context */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#ffffff",
            textShadow: "0 0 60px rgba(99, 102, 241, 0.4)",
          }}
        >
          Dark Grid Background
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
