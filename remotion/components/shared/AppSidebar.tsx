import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

interface AppSidebarProps {
  startFrame?: number;
  activeItem?: string;
}

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", active: false },
  { icon: "📅", label: "Calendar", active: false },
  { icon: "◉", label: "Campaigns", active: false },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  startFrame = 0,
  activeItem = "Create post",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 20, mass: 0.8, stiffness: 150 },
  });

  const translateX = interpolate(progress, [0, 1], [-80, 0]);

  return (
    <div
      style={{
        width: 240,
        height: "100%",
        backgroundColor: COLORS.surfaceCard,
        borderRight: `1px solid ${COLORS.outlineVariant}`,
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        opacity: progress,
        transform: `translateX(${translateX}px)`,
      }}
    >
      {/* Logo header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, padding: "0 4px" }}>
        <Img
          src={staticFile("mark-magic-wand.png")}
          style={{ width: 32, height: 32, borderRadius: 8 }}
        />
        <div>
          <span style={{ fontFamily: FONTS.text, fontSize: 16, fontWeight: 700, color: COLORS.text }}>
            Mark
          </span>
          <span style={{ fontFamily: FONTS.text, fontSize: 10, color: COLORS.textMuted, marginLeft: 6 }}>
            v1.0
          </span>
        </div>
      </div>

      {/* Create post button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderRadius: 10,
          backgroundColor: activeItem === "Create post" ? "rgba(230, 229, 226, 0.08)" : "transparent",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            backgroundColor: COLORS.primary,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 12,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          +
        </div>
        <span style={{ fontFamily: FONTS.text, fontSize: 13, fontWeight: 500, color: COLORS.text }}>
          Create post
        </span>
      </div>

      {/* Nav section */}
      <div style={{ marginTop: 8 }}>
        <span style={{
          fontFamily: FONTS.text,
          fontSize: 10,
          fontWeight: 600,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          padding: "0 12px",
          marginBottom: 6,
          display: "block",
        }}>
          Navigation
        </span>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 12px",
              borderRadius: 8,
              marginTop: 2,
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.5 }}>{item.icon}</span>
            <span style={{ fontFamily: FONTS.text, fontSize: 13, color: COLORS.textMuted }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom user */}
      <div style={{ marginTop: "auto", borderTop: `1px solid ${COLORS.outlineVariant}`, paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 4px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            DM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: FONTS.text, fontSize: 13, fontWeight: 500, color: COLORS.text }}>
              Daivy Morales
            </span>
            <span style={{ fontFamily: FONTS.text, fontSize: 11, color: COLORS.textMuted }}>
              daivy@mark.ai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
