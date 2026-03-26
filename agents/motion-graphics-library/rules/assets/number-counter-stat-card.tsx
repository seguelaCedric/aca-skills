import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * StatCard — animated counter with a label, wrapped in a card with a glowing border.
 * Entrance + counting animation are sequenced with a delay offset.
 */

// Ideal composition size: 1080x1920 (portrait)

const STAT_COLOR = "#6366f1";

const StatCard: React.FC<{
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  delay?: number;
}> = ({
  value,
  label,
  prefix = "",
  suffix = "",
  color = STAT_COLOR,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });
  const countProgress = spring({
    frame,
    fps,
    delay: delay + Math.round(0.2 * fps),
    config: { damping: 200 },
  });

  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const displayValue = Math.round(value * countProgress);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 40px",
        borderRadius: 16,
        border: `1.5px solid ${color}35`,
        background: `${color}08`,
        transform: `translateY(${translateY}px)`,
        opacity: entrance,
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          color: "#ffffff",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 40px ${color}50`,
        }}
      >
        {prefix}
        {displayValue.toLocaleString()}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: `${color}cc`,
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const MyAnimation = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a1a",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: 60,
      }}
    >
      <StatCard value={92} suffix="%" label="Cost Cut" color="#10b981" delay={0} />
      <StatCard value={11} label="Tools Killed" color="#ef4444" delay={Math.round(0.2 * fps)} />
      <StatCard value={4} label="Agents" color="#6366f1" delay={Math.round(0.4 * fps)} />
      <StatCard value={0} label="Dashboards" color="#f59e0b" delay={Math.round(0.6 * fps)} />
    </AbsoluteFill>
  );
};
