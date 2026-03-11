import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { sceneFadeIn, sceneFadeOut } from "../../lib/transitions";
import { COLORS } from "../../config/colors";

interface SceneContainerProps {
  children: React.ReactNode;
  totalFrames: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  backgroundColor?: string;
  showVignette?: boolean;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  children,
  totalFrames,
  fadeInDuration = 15,
  fadeOutDuration = 20,
  backgroundColor = COLORS.bg,
  showVignette = true,
}) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = sceneFadeIn(frame, fadeInDuration);
  const fadeOutOpacity = sceneFadeOut(frame, totalFrames, fadeOutDuration);
  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);

  return (
    <AbsoluteFill style={{ backgroundColor, opacity }}>
      {children}
      {showVignette && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
