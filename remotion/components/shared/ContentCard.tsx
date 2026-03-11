import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

interface ContentCardProps {
  title: string;
  caption: string;
  platform: string;
  platformColor: string;
  startFrame?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  caption,
  platform,
  platformColor,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 15, mass: 0.7, stiffness: 180 },
  });

  const translateY = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        width: 340,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceContainer,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        opacity: progress,
        transform: `translateY(${translateY}px)`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          height: 180,
          background: `linear-gradient(135deg, ${platformColor}30, ${COLORS.primary}20)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          ▶
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: platformColor,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.text,
              fontSize: 12,
              color: COLORS.textMuted,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {platform}
          </span>
        </div>
        <span
          style={{
            fontFamily: FONTS.text,
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.text,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: FONTS.text,
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 1.4,
          }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
};
