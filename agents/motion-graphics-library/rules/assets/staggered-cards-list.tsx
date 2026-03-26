import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * StaggeredCards — cards slide in from the side with stagger delay.
 * Each card has icon, label, description, glow dot, and colored border.
 */

// Ideal composition size: 1080x1920 (portrait)

interface CardItem {
  icon: string;
  label: string;
  description: string;
  color: string;
}

const ITEMS: CardItem[] = [
  {
    icon: "\u{1F4CA}",
    label: "CRM Agent",
    description: "Auto-updates itself",
    color: "#6366f1",
  },
  {
    icon: "\u{1F4E7}",
    label: "Outreach Agent",
    description: "Writes AND optimizes sequences",
    color: "#10b981",
  },
  {
    icon: "\u{1F3AF}",
    label: "Scoring Agent",
    description: "Real-time signals, not static rules",
    color: "#f59e0b",
  },
  {
    icon: "\u{1F9E0}",
    label: "Reporting Agent",
    description: "Just tells you what matters",
    color: "#ef4444",
  },
];

const STAGGER_FRAMES = 6;

const StaggeredCards: React.FC<{
  items: CardItem[];
  staggerFrames?: number;
  delay?: number;
  direction?: "left" | "right";
}> = ({ items, staggerFrames = STAGGER_FRAMES, delay = 0, direction = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((item, i) => {
        const entrance = spring({
          frame,
          fps,
          delay: delay + i * staggerFrames,
          config: { damping: 200 },
        });
        const translateX = interpolate(
          entrance,
          [0, 1],
          [direction === "left" ? -60 : 60, 0],
        );

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 28px",
              borderRadius: 16,
              border: `1.5px solid ${item.color}35`,
              background: `${item.color}10`,
              transform: `translateX(${translateX}px)`,
              opacity: entrance,
            }}
          >
            <div style={{ fontSize: 36 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#ffffff",
                  textShadow: `0 0 30px ${item.color}40`,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 4,
                }}
              >
                {item.description}
              </div>
            </div>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 12px ${item.color}`,
                opacity: entrance,
              }}
            />
          </div>
        );
      })}
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
      <StaggeredCards items={ITEMS} staggerFrames={6} direction="left" />
    </AbsoluteFill>
  );
};
