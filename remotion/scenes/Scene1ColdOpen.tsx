import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { COLORS } from "../config/colors";
import { FONTS } from "../config/fonts";

export const Scene1ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo
  const logoP = spring({ fps, frame: Math.max(0, frame - 10), config: { damping: 12, mass: 0.7, stiffness: 140 } });
  const pulse = Math.sin(frame * 0.05) * 4;

  // Line 1: "Your brand"
  const l1 = spring({ fps, frame: Math.max(0, frame - 35), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  // Line 2: "deserves better content."
  const l2 = spring({ fps, frame: Math.max(0, frame - 55), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  // Accent line
  const accentP = spring({ fps, frame: Math.max(0, frame - 80), config: { damping: 20, mass: 0.5, stiffness: 200 } });
  const accentW = interpolate(accentP, [0, 1], [0, 140]);

  // "Meet Mark" fade
  const meetP = spring({ fps, frame: Math.max(0, frame - 110), config: { damping: 15, mass: 0.6, stiffness: 160 } });

  // Fade out
  const fadeOut = interpolate(frame, [180, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {COLORS.extractorBg.map((g, i) => <div key={i} style={{ position: "absolute", inset: 0, background: g, opacity: 0.5 }} />)}

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* LEFT — Headline text */}
        <div style={{ flex: 1, paddingLeft: 140, display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{
            fontFamily: FONTS.title, fontSize: 82, color: COLORS.textLight,
            letterSpacing: 1, lineHeight: 1.05,
            opacity: l1, transform: `translateY(${interpolate(l1, [0, 1], [25, 0])}px)`,
          }}>
            Your brand
          </div>
          <div style={{
            fontFamily: FONTS.title, fontSize: 82, color: COLORS.textLight,
            letterSpacing: 1, lineHeight: 1.05,
            opacity: l2, transform: `translateY(${interpolate(l2, [0, 1], [25, 0])}px)`,
          }}>
            deserves better
          </div>
          <div style={{
            fontFamily: FONTS.title, fontSize: 82,
            letterSpacing: 1, lineHeight: 1.05,
            opacity: l2, transform: `translateY(${interpolate(l2, [0, 1], [25, 0])}px)`,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            content.
          </div>

          {/* Accent bar */}
          <div style={{
            width: accentW, height: 4, borderRadius: 4, marginTop: 24,
            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
          }} />

          {/* Meet Mark */}
          <div style={{
            marginTop: 32, fontFamily: FONTS.text, fontSize: 20, fontWeight: 400,
            color: COLORS.textSecondary, letterSpacing: 1,
            opacity: meetP, transform: `translateY(${interpolate(meetP, [0, 1], [12, 0])}px)`,
          }}>
            Meet <span style={{ fontWeight: 700, color: COLORS.textLight }}>Mark</span> — your AI marketing engine.
          </div>
        </div>

        {/* RIGHT — Logo floating */}
        <div style={{
          flex: 1, display: "flex", justifyContent: "center", alignItems: "center",
        }}>
          <div style={{
            opacity: logoP,
            transform: `scale(${interpolate(logoP, [0, 1], [0.5, 1])})`,
            filter: `drop-shadow(0 0 ${35 + pulse}px rgba(217,70,239,0.45))`,
          }}>
            <Img src={staticFile("mark-magic-wand.png")} style={{ width: 220, height: 220, borderRadius: 44 }} />
          </div>
        </div>
      </div>

      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
