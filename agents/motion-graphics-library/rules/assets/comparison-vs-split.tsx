import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/*
 * VSSplit — two-column comparison with a glowing "VS" separator.
 * Left side enters from the left, right side enters from the right,
 * VS badge bounces in between them.
 */

// Ideal composition size: 1080x1920 (portrait)

const LEFT_TITLE = "Old Stack";
const LEFT_ITEMS = ["$2,400/mo in SaaS", "11 tools to manage", "Manual data entry", "Dashboards nobody checks"];
const RIGHT_TITLE = "AI Agents";
const RIGHT_ITEMS = ["$200/mo in API calls", "4 agents that think", "Self-updating CRM", "Outcomes, not dashboards"];

const VSSplit: React.FC<{
  leftTitle: string;
  leftItems: string[];
  leftColor?: string;
  rightTitle: string;
  rightItems: string[];
  rightColor?: string;
  delay?: number;
}> = ({
  leftTitle,
  leftItems,
  leftColor = "#ef4444",
  rightTitle,
  rightItems,
  rightColor = "#10b981",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEntrance = spring({ frame, fps, delay, config: { damping: 200 } });
  const vsEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(0.3 * fps),
    config: { damping: 12, stiffness: 200 },
  });
  const rightEntrance = spring({
    frame,
    fps,
    delay: delay + Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        width: "100%",
      }}
    >
      {/* Left column */}
      <div
        style={{
          flex: 1,
          padding: 40,
          opacity: leftEntrance,
          transform: `translateX(${interpolate(leftEntrance, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: leftColor,
            marginBottom: 24,
            textShadow: `0 0 30px ${leftColor}40`,
          }}
        >
          {leftTitle}
        </div>
        {leftItems.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: leftColor,
                boxShadow: `0 0 8px ${leftColor}`,
              }}
            />
            {item}
          </div>
        ))}
      </div>

      {/* VS separator */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          transform: `scale(${vsEntrance})`,
          opacity: vsEntrance,
        }}
      >
        <div
          style={{
            width: 2,
            flex: 1,
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#ffffff",
            padding: "16px 0",
            textShadow: "0 0 30px rgba(255,255,255,0.5)",
          }}
        >
          VS
        </div>
        <div
          style={{
            width: 2,
            flex: 1,
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
      </div>

      {/* Right column */}
      <div
        style={{
          flex: 1,
          padding: 40,
          opacity: rightEntrance,
          transform: `translateX(${interpolate(rightEntrance, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: rightColor,
            marginBottom: 24,
            textShadow: `0 0 30px ${rightColor}40`,
          }}
        >
          {rightTitle}
        </div>
        {rightItems.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: rightColor,
                boxShadow: `0 0 8px ${rightColor}`,
              }}
            />
            {item}
          </div>
        ))}
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
      }}
    >
      <VSSplit
        leftTitle={LEFT_TITLE}
        leftItems={LEFT_ITEMS}
        rightTitle={RIGHT_TITLE}
        rightItems={RIGHT_ITEMS}
      />
    </AbsoluteFill>
  );
};
