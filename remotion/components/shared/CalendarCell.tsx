import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

interface CalendarCellProps {
  day: number;
  posts?: Array<{ title: string; platform: string; color: string }>;
  startFrame?: number;
  index?: number;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  day,
  posts = [],
  startFrame = 0,
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = startFrame + index * 3;
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 15, mass: 0.5, stiffness: 200 },
  });

  return (
    <div
      style={{
        width: 150,
        height: 110,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceContainer,
        border: "1px solid rgba(255,255,255,0.06)",
        padding: 10,
        opacity: progress,
        transform: `scale(${0.8 + progress * 0.2})`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.text,
          fontSize: 13,
          color: COLORS.textMuted,
          fontWeight: 500,
        }}
      >
        {day}
      </span>
      {posts.map((post, i) => (
        <div
          key={i}
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            backgroundColor: `${post.color}18`,
            borderLeft: `3px solid ${post.color}`,
            fontFamily: FONTS.text,
            fontSize: 11,
            color: COLORS.textSecondary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {post.title}
        </div>
      ))}
    </div>
  );
};
