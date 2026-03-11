import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

interface ChatBubbleProps {
  message: string;
  sender: "ai" | "user";
  startFrame?: number;
  typewriter?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender,
  startFrame = 0,
  typewriter = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 15, mass: 0.6, stiffness: 200 },
  });

  const translateY = interpolate(progress, [0, 1], [20, 0]);

  const elapsed = Math.max(0, frame - startFrame - 10);
  const displayedMessage = typewriter
    ? message.substring(0, Math.min(Math.floor(elapsed * 0.6), message.length))
    : message;

  const isAI = sender === "ai";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAI ? "flex-start" : "flex-end",
        opacity: progress,
        transform: `translateY(${translateY}px)`,
        padding: "4px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          maxWidth: 500,
          flexDirection: isAI ? "row" : "row-reverse",
        }}
      >
        {isAI && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryContainer})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            M
          </div>
        )}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: isAI ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
            backgroundColor: isAI ? COLORS.surfaceContainer : `${COLORS.primary}25`,
            border: `1px solid ${isAI ? "rgba(255,255,255,0.06)" : `${COLORS.primary}40`}`,
            fontFamily: FONTS.text,
            fontSize: 15,
            lineHeight: 1.5,
            color: COLORS.text,
          }}
        >
          {displayedMessage}
          {typewriter && displayedMessage.length < message.length && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 14,
                backgroundColor: COLORS.primary,
                marginLeft: 2,
                verticalAlign: "text-bottom",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
