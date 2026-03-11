import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { GlowingLogo } from "../components/shared/GlowingLogo";
import { AnimatedText } from "../components/shared/AnimatedText";
import { COLORS } from "../config/colors";
import { FONTS } from "../config/fonts";
import { SCENE_FRAMES } from "../config/constants";

const FEATURES = [
  { icon: "🧬", title: "Brand DNA Extraction", desc: "Analyze any website in seconds" },
  { icon: "🎨", title: "AI Content Creation", desc: "Generate posts aligned to your brand" },
  { icon: "✏️", title: "Smart Editing", desc: "Iterate with natural language" },
  { icon: "🔄", title: "Workflow Canvas", desc: "Visualize your entire content pipeline" },
];

export const Scene5ChatCoach: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = SCENE_FRAMES.scene5.duration;

  // Phase 1: Features grid (0-300)
  // Phase 2: Final logo + tagline (300-600)

  const showFeatures = frame < 350;
  const showFinale = frame >= 300;

  // Features grid fade
  const featuresFade = frame >= 300
    ? interpolate(frame, [300, 350], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // Logo entrance
  const logoP = spring({ fps, frame: Math.max(0, frame - 320), config: { damping: 12, mass: 0.8, stiffness: 120 } });
  const logoScale = interpolate(logoP, [0, 1], [0.5, 1]);
  const logoPulse = Math.sin((frame - 320) * 0.04) * 5;

  // Tagline
  const tagP = spring({ fps, frame: Math.max(0, frame - 380), config: { damping: 15, mass: 0.6, stiffness: 160 } });
  const tagY = interpolate(tagP, [0, 1], [20, 0]);

  // Domain
  const domainP = spring({ fps, frame: Math.max(0, frame - 430), config: { damping: 20, mass: 0.6, stiffness: 150 } });

  // CTA
  const ctaP = spring({ fps, frame: Math.max(0, frame - 470), config: { damping: 15, mass: 0.5, stiffness: 200 } });
  const ctaScale = interpolate(ctaP, [0, 1], [0.8, 1]);

  // Final fade to black
  const fadeToBlack = frame >= total - 60
    ? interpolate(frame, [total - 60, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeToBlack }}>
      {/* Gradient background */}
      {COLORS.extractorBg.map((g, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, background: g, opacity: 0.4 }} />
      ))}

      {/* Features grid */}
      {showFeatures && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity: featuresFade,
        }}>
          {/* Section title */}
          <div style={{
            fontFamily: FONTS.text, fontSize: 14, fontWeight: 600,
            color: COLORS.primaryLight, letterSpacing: 4, textTransform: "uppercase",
            marginBottom: 12,
            opacity: spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 20, mass: 0.5, stiffness: 200 } }),
          }}>
            Everything you need
          </div>
          <div style={{
            fontFamily: FONTS.title, fontSize: 56, color: COLORS.textLight,
            marginBottom: 50, letterSpacing: 2,
            opacity: spring({ fps, frame: Math.max(0, frame - 30), config: { damping: 20, mass: 0.6, stiffness: 160 } }),
          }}>
            One Platform. Infinite Content.
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            {FEATURES.map((feat, i) => {
              const p = spring({
                fps,
                frame: Math.max(0, frame - 60 - i * 15),
                config: { damping: 14, mass: 0.6, stiffness: 160 },
              });
              const y = interpolate(p, [0, 1], [30, 0]);

              return (
                <div key={feat.title} style={{
                  width: 260, padding: 28, borderRadius: 20,
                  backgroundColor: `${COLORS.surfaceCard}E6`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${COLORS.borderSubtle}`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  opacity: p, transform: `translateY(${y}px)`,
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  <span style={{ fontSize: 32 }}>{feat.icon}</span>
                  <span style={{ fontFamily: FONTS.text, fontSize: 17, fontWeight: 600, color: COLORS.text }}>
                    {feat.title}
                  </span>
                  <span style={{ fontFamily: FONTS.text, fontSize: 13, color: COLORS.textMuted, lineHeight: "1.5" }}>
                    {feat.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Final logo + tagline */}
      {showFinale && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          {/* Logo */}
          <div style={{
            opacity: logoP, transform: `scale(${logoScale})`,
            filter: `drop-shadow(0 0 ${40 + logoPulse}px rgba(217,70,239,0.5))`,
            marginBottom: 28,
          }}>
            <Img src={staticFile("mark-magic-wand.png")} style={{ width: 140, height: 140, borderRadius: 28 }} />
          </div>

          {/* Mark title */}
          <div style={{
            fontFamily: FONTS.title, fontSize: 90, color: COLORS.textLight,
            letterSpacing: 8, textTransform: "uppercase",
            opacity: logoP, marginBottom: 16,
          }}>
            Mark
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: FONTS.text, fontSize: 36, fontWeight: 500,
            color: COLORS.text, opacity: tagP,
            transform: `translateY(${tagY}px)`,
            textShadow: `0 0 40px ${COLORS.primary}40`,
            marginBottom: 12,
          }}>
            One platform. Every brand story.
          </div>

          {/* Domain */}
          <div style={{
            fontFamily: FONTS.text, fontSize: 18, fontWeight: 300,
            color: COLORS.textMuted, letterSpacing: 4,
            opacity: domainP, marginBottom: 40,
          }}>
            mark.ai
          </div>

          {/* CTA Button */}
          <div style={{
            opacity: ctaP, transform: `scale(${ctaScale})`,
            padding: "14px 40px", borderRadius: 50,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryContainer})`,
            fontFamily: FONTS.text, fontSize: 16, fontWeight: 600, color: "#fff",
            boxShadow: `0 0 30px ${COLORS.primary}40, 0 8px 24px rgba(0,0,0,0.3)`,
          }}>
            Get Started Free →
          </div>
        </div>
      )}

      {/* Vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
