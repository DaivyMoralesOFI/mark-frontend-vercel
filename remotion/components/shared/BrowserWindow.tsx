import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../../config/colors";

interface BrowserWindowProps {
  children: React.ReactNode;
  startFrame?: number;
  width?: number;
  height?: number;
}

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  children,
  startFrame = 0,
  width = 900,
  height = 500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 15, mass: 0.8, stiffness: 150 },
  });

  const translateY = interpolate(progress, [0, 1], [60, 0]);
  const opacity = progress;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: COLORS.surfaceContainer,
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 0 40px ${COLORS.glow.magenta}`,
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 40,
          backgroundColor: COLORS.surfaceElevated,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28C840" }} />
        <div
          style={{
            flex: 1,
            height: 26,
            borderRadius: 6,
            backgroundColor: "rgba(255,255,255,0.06)",
            marginLeft: 16,
            marginRight: 16,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
          }}
        >
          {children}
        </div>
      </div>
      {/* Browser viewport */}
      <div
        style={{
          flex: 1,
          height: height - 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`,
        }}
      />
    </div>
  );
};
