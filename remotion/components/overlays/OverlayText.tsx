import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { getWordStyles } from "../../lib/text";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

interface OverlayTextProps {
  text: string;
  startFrame?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  position?: "bottom" | "center" | "top";
}

export const OverlayText: React.FC<OverlayTextProps> = ({
  text,
  startFrame = 0,
  fontSize = 36,
  fontFamily,
  color = COLORS.text,
  position = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: 80, left: 0, right: 0 },
    center: { top: "50%", left: 0, right: 0, transform: "translateY(-50%)" },
    bottom: { bottom: 80, left: 0, right: 0 },
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        zIndex: 10,
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            ...getWordStyles(frame, fps, i, startFrame, 8),
            fontFamily: fontFamily || FONTS.text,
            fontSize,
            fontWeight: 600,
            color,
            textShadow: `0 0 30px ${COLORS.glow.magenta}`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};
