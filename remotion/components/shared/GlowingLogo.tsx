import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { COLORS } from "../../config/colors";

interface GlowingLogoProps {
  startFrame?: number;
  size?: number;
  glowIntensity?: number;
}

export const GlowingLogo: React.FC<GlowingLogoProps> = ({
  startFrame = 0,
  size = 200,
  glowIntensity = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleProgress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 12, mass: 0.8, stiffness: 150 },
  });

  const scale = interpolate(scaleProgress, [0, 1], [0.6, 1]);
  const opacity = interpolate(scaleProgress, [0, 1], [0, 1]);
  const glowSpread = interpolate(scaleProgress, [0, 1], [0, glowIntensity]);

  const pulse = Math.sin((frame - startFrame) * 0.05) * 5 + glowSpread;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <Img
        src={staticFile("mark-light.svg")}
        style={{
          width: size,
          height: "auto",
          filter: `drop-shadow(0 0 ${pulse}px ${COLORS.glow.magentaStrong}) drop-shadow(0 0 ${pulse * 2}px ${COLORS.glow.magenta})`,
        }}
      />
    </div>
  );
};
