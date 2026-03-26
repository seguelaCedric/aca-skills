import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * Floating Particles — small dots that rise from the bottom and fade in/out.
 * Deterministic positions via seed math (no Math.random).
 */

// Ideal composition size: 1080x1920 (portrait)

const PARTICLE_COUNT = 20;
const PARTICLE_COLOR = "#6366f1";
const SEED_MULTIPLIER = 137.5;

const Particles: React.FC<{
  count?: number;
  color?: string;
  direction?: "up" | "down";
}> = ({ count = PARTICLE_COUNT, color = PARTICLE_COLOR, direction = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = i * SEED_MULTIPLIER;
        const x = (seed * 7.3) % 100;
        const startY =
          direction === "up"
            ? 110 + ((seed * 3.1) % 20)
            : -10 - ((seed * 3.1) % 20);
        const speed = 0.2 + ((seed * 1.7) % 0.4);
        const size = 3 + ((seed * 2.3) % 6);
        const sign = direction === "up" ? -1 : 1;
        const y = startY + sign * ((frame / fps) * speed * 25);
        const opacity = interpolate(y, [-10, 20, 80, 110], [0, 0.5, 0.5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const MyAnimation = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a1a" }}>
      <Particles count={20} color="#6366f1" direction="up" />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            textShadow: "0 0 40px rgba(99, 102, 241, 0.4)",
          }}
        >
          Floating Particles
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
