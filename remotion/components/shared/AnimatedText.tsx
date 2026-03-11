import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { getLetterStyles, getWordStyles } from "../../lib/text";

interface AnimatedTextProps {
  text: string;
  startFrame?: number;
  mode?: "letter" | "word";
  interval?: number;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame = 0,
  mode = "letter",
  interval,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (mode === "word") {
    const words = text.split(" ");
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}>
        {words.map((word, i) => (
          <span key={i} style={getWordStyles(frame, fps, i, startFrame, interval ?? 8)}>
            {word}
          </span>
        ))}
      </div>
    );
  }

  const letters = text.split("");
  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      {letters.map((letter, i) => (
        <span key={i} style={getLetterStyles(frame, fps, i, startFrame, interval ?? 3)}>
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </div>
  );
};
