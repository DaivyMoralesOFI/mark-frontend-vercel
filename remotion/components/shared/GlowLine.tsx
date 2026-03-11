import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface GlowLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  startFrame?: number;
  strokeWidth?: number;
}

export const GlowLine: React.FC<GlowLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  startFrame = 0,
  strokeWidth = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 20, mass: 1, stiffness: 100 },
  });

  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const dashOffset = interpolate(progress, [0, 1], [length, 0]);

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        <filter id={`glow-${x1}-${y1}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
        opacity={progress * 0.8}
        filter={`url(#glow-${x1}-${y1})`}
      />
    </svg>
  );
};
