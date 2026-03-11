import React from "react";
import { useCurrentFrame } from "remotion";
import { getTypewriterText } from "../../lib/text";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  showCursor?: boolean;
  style?: React.CSSProperties;
  cursorColor?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.5,
  showCursor = true,
  style,
  cursorColor = "#D946EF",
}) => {
  const frame = useCurrentFrame();
  const displayed = getTypewriterText(text, frame, startFrame, charsPerFrame);
  const isTyping = displayed.length < text.length;
  const cursorVisible = showCursor && (isTyping || frame % 30 < 15);

  return (
    <span style={style}>
      {displayed}
      {cursorVisible && (
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: "1em",
            backgroundColor: cursorColor,
            marginLeft: 2,
            verticalAlign: "text-bottom",
          }}
        />
      )}
    </span>
  );
};
