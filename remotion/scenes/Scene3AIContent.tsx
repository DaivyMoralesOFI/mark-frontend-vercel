import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { Cursor } from "../components/shared/Cursor";
import { TypewriterText } from "../components/shared/TypewriterText";
import { COLORS } from "../config/colors";
import { FONTS } from "../config/fonts";

export const Scene3AIContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = 660;

  // PHASE 1 (0-160): LEFT headline "Create posts that feel like your brand" + RIGHT shows settings bar floating
  // PHASE 2 (160-380): Headline slides left, prompt input zooms in center, cursor types, clicks submit
  // PHASE 3 (380-550): Loading → result card zooms in beautifully
  // PHASE 4 (550-660): Edit input appears, cursor types edit, selling text below

  // --- Headlines ---
  const h1 = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  const h2 = spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  const subP = spring({ fps, frame: Math.max(0, frame - 45), config: { damping: 16, mass: 0.6, stiffness: 160 } });
  const headlineFade = interpolate(frame, [140, 170], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Settings pills floating on the right ---
  const settingsItems = [
    { label: "Promotional", icon: "📢", delay: 15 },
    { label: "Instagram", icon: "📷", delay: 25 },
    { label: "Post", icon: "📄", delay: 35 },
  ];
  const settingsFade = interpolate(frame, [150, 175], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Prompt input: zooms into center ---
  const showInput = frame >= 160 && frame < 400;
  const inputP = spring({ fps, frame: Math.max(0, frame - 165), config: { damping: 14, mass: 0.7, stiffness: 150 } });
  const inputFocused = frame >= 200;
  const inputFade = interpolate(frame, [380, 400], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Loading ---
  const isLoading = frame >= 360 && frame < 420;
  const loadOpacity = interpolate(frame, [360, 375], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame, [410, 420], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Result card ---
  const showResult = frame >= 410;
  const resultP = spring({ fps, frame: Math.max(0, frame - 415), config: { damping: 12, mass: 0.7, stiffness: 140 } });
  const resultScale = interpolate(resultP, [0, 1], [0.7, 1]);

  // --- Edit input ---
  const showEdit = frame >= 530;
  const editP = spring({ fps, frame: Math.max(0, frame - 535), config: { damping: 15, mass: 0.5, stiffness: 200 } });

  // --- Selling text alongside result ---
  const sellP = spring({ fps, frame: Math.max(0, frame - 460), config: { damping: 15, mass: 0.6, stiffness: 160 } });

  // Cursor
  const cursorKf = [
    { frame: 0, x: 1100, y: 440 },
    // Phase 1: hover over settings
    { frame: 25, x: 1100, y: 410, click: true },
    { frame: 60, x: 1250, y: 410, click: true },
    // Phase 2: move to prompt input
    { frame: 170, x: 960, y: 470 },
    { frame: 195, x: 860, y: 490, click: true },  // Click input
    { frame: 340, x: 860, y: 490 },                // Typing
    { frame: 355, x: 1120, y: 545, click: true },  // Click submit
    // Phase 3: watch result
    { frame: 430, x: 750, y: 380 },
    // Phase 4: edit
    { frame: 540, x: 830, y: 730, click: true },  // Click edit input
    { frame: 640, x: 830, y: 730 },
  ];

  const fadeOut = interpolate(frame, [total - 25, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {COLORS.extractorBg.map((g, i) => <div key={i} style={{ position: "absolute", inset: 0, background: g, opacity: 0.3 }} />)}

      {/* PHASE 1: Headline left, settings right */}
      <div style={{
        position: "absolute", left: 120, top: "50%", transform: "translateY(-50%)",
        width: 600, opacity: headlineFade,
      }}>
        <div style={{
          fontFamily: FONTS.text, fontSize: 15, fontWeight: 600,
          color: COLORS.primaryLight, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16,
          opacity: subP,
        }}>
          AI Content Creation
        </div>
        <div style={{
          fontFamily: FONTS.title, fontSize: 68, color: COLORS.textLight, lineHeight: 1.05,
          opacity: h1, transform: `translateY(${interpolate(h1, [0, 1], [20, 0])}px)`,
        }}>
          Create posts that
        </div>
        <div style={{
          fontFamily: FONTS.title, fontSize: 68, lineHeight: 1.05,
          opacity: h2, transform: `translateY(${interpolate(h2, [0, 1], [20, 0])}px)`,
          background: `linear-gradient(90deg, ${COLORS.primary}, #FD79A8)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          feel like your brand.
        </div>
        <div style={{
          fontFamily: FONTS.text, fontSize: 18, color: COLORS.textSecondary, marginTop: 24, lineHeight: 1.6,
          opacity: subP, maxWidth: 440,
        }}>
          Describe your idea. Mark generates on-brand visuals aligned with your colors, voice, and identity.
        </div>
      </div>

      {/* Floating settings pills — right side */}
      <div style={{
        position: "absolute", right: 180, top: "45%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 14, opacity: settingsFade,
      }}>
        {settingsItems.map((item) => {
          const p = spring({ fps, frame: Math.max(0, frame - item.delay), config: { damping: 14, mass: 0.5, stiffness: 180 } });
          return (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 24px", borderRadius: 16,
              backgroundColor: `${COLORS.surfaceCard}E6`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${COLORS.borderSubtle}`,
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              opacity: p, transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)`,
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontFamily: FONTS.text, fontSize: 16, fontWeight: 500, color: COLORS.text }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* PHASE 2: Prompt input centered */}
      {showInput && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(inputP, [0, 1], [0.85, 1])})`,
          opacity: inputP * inputFade,
        }}>
          <div style={{
            width: 560, borderRadius: 20,
            backgroundColor: `${COLORS.surfaceCard}F5`, backdropFilter: "blur(30px)",
            border: inputFocused ? `1px solid ${COLORS.primary}50` : `1px solid ${COLORS.outlineVariant}`,
            boxShadow: inputFocused ? `0 0 40px ${COLORS.primary}12, 0 20px 60px rgba(0,0,0,0.4)` : "0 20px 60px rgba(0,0,0,0.4)",
          }}>
            <div style={{ padding: "16px 20px 10px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ marginTop: 3, fontSize: 16, color: COLORS.textMuted }}>📎</span>
              <div style={{ flex: 1, minHeight: 60 }}>
                {inputFocused ? (
                  <TypewriterText
                    text="A vibrant coffee post with warm autumn colors, cozy vibes, and our new seasonal blend"
                    startFrame={210}
                    charsPerFrame={0.38}
                    cursorColor={COLORS.primary}
                    style={{ fontFamily: FONTS.text, fontSize: 15, color: COLORS.text, lineHeight: "1.55" }}
                  />
                ) : (
                  <span style={{ fontFamily: FONTS.text, fontSize: 15, color: `${COLORS.text}35` }}>Describe your post idea...</span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 16px 14px" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["# 4:3", "🔗", "🧬"].map((icon, i) => (
                  <span key={i} style={{ padding: "4px 10px", borderRadius: 8, fontFamily: FONTS.text, fontSize: 12, color: COLORS.textMuted }}>{icon}</span>
                ))}
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: frame >= 330 ? COLORS.primary : "rgba(255,255,255,0.05)",
                display: "flex", justifyContent: "center", alignItems: "center",
                boxShadow: frame >= 330 ? `0 0 14px ${COLORS.primary}40` : "none",
              }}>
                <span style={{ color: frame >= 330 ? "#fff" : COLORS.textMuted, fontSize: 16, fontWeight: 700 }}>↑</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span style={{ fontFamily: FONTS.text, fontSize: 10, color: `${COLORS.textMuted}40` }}>Mark AI will generate content using your Brand DNA</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 28px", borderRadius: 20,
          backgroundColor: `${COLORS.surfaceCard}F5`, backdropFilter: "blur(30px)",
          border: `1px solid ${COLORS.outlineVariant}`, boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
          opacity: loadOpacity,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            border: `2px solid ${COLORS.textMuted}30`, borderTop: `2px solid ${COLORS.textMuted}`,
            transform: `rotate(${(frame - 360) * 10}deg)`,
          }} />
          <span style={{ fontFamily: FONTS.text, fontSize: 15, color: COLORS.textSubtle }}>Creating your image...</span>
        </div>
      )}

      {/* PHASE 3: Result card + selling text on left */}
      {showResult && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* LEFT: selling text */}
          <div style={{
            position: "absolute", left: 100, top: "50%", transform: "translateY(-50%)",
            width: 380, opacity: sellP,
          }}>
            <div style={{
              fontFamily: FONTS.title, fontSize: 48, color: COLORS.textLight, lineHeight: 1.1,
              marginBottom: 16,
            }}>
              From idea to visual in seconds.
            </div>
            <div style={{
              fontFamily: FONTS.text, fontSize: 16, color: COLORS.textSecondary, lineHeight: 1.6,
            }}>
              Every image is generated using your brand's color palette, typography, and tone — no templates needed.
            </div>
            <div style={{
              display: "flex", gap: 10, marginTop: 24,
            }}>
              {["On-brand colors", "AI-powered", "Instant"].map((tag, i) => {
                const tp = spring({ fps, frame: Math.max(0, frame - 490 - i * 10), config: { damping: 15, mass: 0.5, stiffness: 200 } });
                return (
                  <span key={tag} style={{
                    padding: "6px 16px", borderRadius: 50,
                    backgroundColor: `${COLORS.primary}12`, border: `1px solid ${COLORS.primary}25`,
                    fontFamily: FONTS.text, fontSize: 13, fontWeight: 500, color: COLORS.primaryLight,
                    opacity: tp,
                  }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Result image card */}
          <div style={{
            position: "absolute", right: 140, top: "50%",
            transform: `translateY(-50%) scale(${resultScale})`,
            opacity: resultP,
          }}>
            {/* Prompt bubble */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
                display: "flex", justifyContent: "center", alignItems: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
                border: `1px solid ${COLORS.borderCard}`,
              }}>DM</div>
              <div style={{
                maxWidth: 340, padding: "8px 14px",
                backgroundColor: COLORS.surfaceCard, border: `1px solid ${COLORS.borderCard}`,
                borderRadius: "14px 14px 14px 4px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              }}>
                <span style={{ fontFamily: FONTS.text, fontSize: 11, color: COLORS.textSecondary, lineHeight: "1.4" }}>
                  A vibrant coffee post with warm autumn colors...
                </span>
              </div>
            </div>
            {/* Image */}
            <div style={{
              width: 420, borderRadius: 24, overflow: "hidden",
              backgroundColor: COLORS.bg, border: `1px solid ${COLORS.borderSubtle}`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${COLORS.primary}08`,
            }}>
              <div style={{
                width: "100%", height: 320,
                background: "linear-gradient(145deg, #2D1B4E, #1B2838, #2B1F1F)",
                position: "relative", display: "flex", justifyContent: "center", alignItems: "center",
              }}>
                <div style={{ position: "absolute", top: "20%", left: "25%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #C08B5C 0%, transparent 70%)", filter: "blur(35px)", opacity: 0.6 }} />
                <div style={{ position: "absolute", top: "45%", right: "20%", width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, #8B4513 0%, transparent 70%)", filter: "blur(25px)", opacity: 0.5 }} />
                <span style={{ fontSize: 56, zIndex: 2, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>☕</span>
              </div>
            </div>

            {/* Edit input */}
            {showEdit && (
              <div style={{
                marginTop: 12, width: 380, margin: "12px auto 0",
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px", borderRadius: 50,
                backgroundColor: COLORS.surfaceOverlay, border: `1px solid ${COLORS.borderSubtle}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)", backdropFilter: "blur(20px)",
                opacity: editP,
              }}>
                <span style={{ color: COLORS.textMuted, fontSize: 14 }}>📎</span>
                <TypewriterText text="Make the cup bigger and add steam" startFrame={545} charsPerFrame={0.4} cursorColor={COLORS.primary}
                  style={{ fontFamily: FONTS.text, fontSize: 13, color: COLORS.text, flex: 1 }} />
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  backgroundColor: frame >= 610 ? COLORS.primary : "rgba(255,255,255,0.05)",
                  display: "flex", justifyContent: "center", alignItems: "center",
                }}>
                  <span style={{ color: frame >= 610 ? "#fff" : COLORS.textMuted, fontSize: 13, fontWeight: 700 }}>↑</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Cursor keyframes={cursorKf} startFrame={3} visible={frame < total - 30} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
