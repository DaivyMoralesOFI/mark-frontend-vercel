import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

interface PlatformChipProps {
  name: string;
  color: string;
  startFrame?: number;
  index?: number;
}

export const PlatformChip: React.FC<PlatformChipProps> = ({
  name,
  color,
  startFrame = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = startFrame + index * 8;
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 15, mass: 0.6, stiffness: 200 },
  });

  const translateX = interpolate(progress, [0, 1], [-40, 0]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 20px",
        borderRadius: 50,
        backgroundColor: `${color}20`,
        border: `1px solid ${color}40`,
        opacity: progress,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <span
        style={{
          fontFamily: FONTS.text,
          fontSize: 16,
          fontWeight: 500,
          color: COLORS.text,
        }}
      >
        {name}
      </span>
    </div>
  );
};
