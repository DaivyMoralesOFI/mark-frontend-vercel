import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { Cursor } from "../components/shared/Cursor";
import { TypewriterText } from "../components/shared/TypewriterText";
import { FloatingParticle } from "../components/shared/FloatingParticle";
import { GraphNode } from "../components/shared/GraphNode";
import { GlowLine } from "../components/shared/GlowLine";
import { COLORS } from "../config/colors";
import { FONTS } from "../config/fonts";
import { generateParticles } from "../lib/particles";

export const Scene2BrandDNA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = 600;

  const particles = useMemo(
    () => generateParticles(40, [COLORS.primary, COLORS.primaryLight, "#6C5CE7", "#00CEC9"]),
    []
  );

  // PHASE 1 (0-150): Big headline LEFT, URL input floating RIGHT
  // PHASE 2 (150-250): Headline fades, zoom into URL input → extraction
  // PHASE 3 (250-600): Pull back, reveal graph nodes zooming in one by one

  // --- Phase 1: Headline ---
  const h1 = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  const h2 = spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  const subP = spring({ fps, frame: Math.max(0, frame - 45), config: { damping: 16, mass: 0.6, stiffness: 160 } });
  const headlineFade = interpolate(frame, [130, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Input card ---
  const inputEnter = spring({ fps, frame: Math.max(0, frame - 10), config: { damping: 14, mass: 0.7, stiffness: 150 } });
  // Zoom: input starts on right side, then zooms to center
  const zoomProgress = interpolate(frame, [140, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inputX = interpolate(zoomProgress, [0, 1], [1150, 960]);
  const inputY = interpolate(zoomProgress, [0, 1], [440, 400]);
  const inputScale = interpolate(zoomProgress, [0, 1], [1, 1.15]);
  const inputBorderGlow = frame >= 60 && frame < 200;

  // Extraction spinner (190-260)
  const extracting = frame >= 195 && frame < 270;
  const extractOpacity = interpolate(frame, [195, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    * interpolate(frame, [255, 270], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inputFade = interpolate(frame, [195, 215], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // --- Phase 3: Graph nodes ---
  const graphReveal = frame >= 270;
  // Camera: zoom out from center to show full graph
  const cameraScale = graphReveal
    ? interpolate(frame, [270, 340], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // Node positions in a nice spread
  const GCX = 960; const GCY = 480;
  const NODES = {
    logo: { x: GCX, y: GCY - 165 },
    identity: { x: GCX - 300, y: GCY + 10 },
    colors: { x: GCX + 300, y: GCY + 10 },
    typography: { x: GCX - 210, y: GCY + 230 },
    voice: { x: GCX + 210, y: GCY + 230 },
  };

  // Cursor
  const cursorKf = [
    { frame: 0, x: 1050, y: 500 },
    { frame: 25, x: 1050, y: 435, click: true },   // Click input
    { frame: 130, x: 1050, y: 435 },                // Stay while typing
    { frame: 145, x: 1220, y: 440, click: true },   // Click submit
    { frame: 200, x: 1100, y: 500 },                // Drift away
    // Graph phase: hover nodes
    { frame: 320, x: NODES.logo.x + 40, y: NODES.logo.y + 20 },
    { frame: 380, x: NODES.colors.x + 40, y: NODES.colors.y + 30, click: true },
    { frame: 440, x: NODES.typography.x + 40, y: NODES.typography.y + 20, click: true },
    { frame: 520, x: NODES.voice.x + 40, y: NODES.voice.y + 30 },
    { frame: 560, x: 960, y: 540 },
  ];

  // Fade out
  const fadeOut = interpolate(frame, [total - 25, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {COLORS.extractorBg.map((g, i) => <div key={i} style={{ position: "absolute", inset: 0, background: g, opacity: 0.35 }} />)}

      {/* PHASE 1: LEFT headline + RIGHT input */}
      {/* Headline - left side */}
      <div style={{
        position: "absolute", left: 120, top: "50%", transform: "translateY(-50%)",
        width: 600, opacity: headlineFade,
      }}>
        <div style={{
          fontFamily: FONTS.text, fontSize: 15, fontWeight: 600,
          color: COLORS.primaryLight, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16,
          opacity: subP, transform: `translateY(${interpolate(subP, [0, 1], [10, 0])}px)`,
        }}>
          Brand DNA Extractor
        </div>
        <div style={{
          fontFamily: FONTS.title, fontSize: 68, color: COLORS.textLight, lineHeight: 1.05,
          opacity: h1, transform: `translateY(${interpolate(h1, [0, 1], [20, 0])}px)`,
        }}>
          Know your brand
        </div>
        <div style={{
          fontFamily: FONTS.title, fontSize: 68, lineHeight: 1.05,
          opacity: h2, transform: `translateY(${interpolate(h2, [0, 1], [20, 0])}px)`,
          background: `linear-gradient(90deg, ${COLORS.primary}, #00CEC9)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          before you create.
        </div>
        <div style={{
          fontFamily: FONTS.text, fontSize: 18, color: COLORS.textSecondary, marginTop: 24, lineHeight: 1.6,
          opacity: subP, transform: `translateY(${interpolate(subP, [0, 1], [10, 0])}px)`,
          maxWidth: 440,
        }}>
          Paste any URL. Mark extracts colors, typography, voice, and identity — instantly.
        </div>
      </div>

      {/* URL Input card - floating, then zooms to center */}
      {frame < 270 && (
        <div style={{
          position: "absolute", left: inputX, top: inputY,
          transform: `translate(-50%, -50%) scale(${inputScale})`,
          opacity: inputEnter * inputFade,
        }}>
          <div style={{
            width: 480, borderRadius: 20,
            backgroundColor: `${COLORS.surfaceCard}F5`,
            backdropFilter: "blur(30px)",
            border: inputBorderGlow ? `1px solid ${COLORS.primary}50` : `1px solid ${COLORS.outlineVariant}`,
            boxShadow: inputBorderGlow
              ? `0 0 40px ${COLORS.primary}15, 0 20px 60px rgba(0,0,0,0.4)`
              : "0 20px 60px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}>
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18, color: COLORS.textMuted }}>🌐</span>
              <div style={{ flex: 1 }}>
                <TypewriterText
                  text="https://www.coffeebrand.com"
                  startFrame={35}
                  charsPerFrame={0.45}
                  cursorColor={COLORS.primary}
                  style={{ fontFamily: FONTS.text, fontSize: 15, color: COLORS.text }}
                />
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: frame >= 120 ? COLORS.primary : "rgba(255,255,255,0.05)",
                display: "flex", justifyContent: "center", alignItems: "center",
                boxShadow: frame >= 120 ? `0 0 16px ${COLORS.primary}40` : "none",
              }}>
                <span style={{ color: frame >= 120 ? "#fff" : COLORS.textMuted, fontSize: 16, fontWeight: 700 }}>↑</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extraction animation */}
      {extracting && (
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          opacity: extractOpacity,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            border: `3px solid ${COLORS.primary}30`, borderTop: `3px solid ${COLORS.primary}`,
            transform: `rotate(${(frame - 195) * 8}deg)`,
          }} />
          <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: `${COLORS.primary}20`, filter: "blur(40px)" }} />
          <span style={{ fontFamily: FONTS.text, fontSize: 17, fontWeight: 600, color: COLORS.text }}>
            Extracting Brand DNA...
          </span>
        </div>
      )}

      {/* Particles */}
      {frame >= 200 && frame < 300 && particles.map((p) => (
        <FloatingParticle key={p.id} particle={p} startFrame={205} centerX={960} centerY={480} />
      ))}

      {/* PHASE 3: Graph revealed with camera zoom-out */}
      {graphReveal && (
        <div style={{
          position: "absolute", inset: 0,
          transform: `scale(${cameraScale})`, transformOrigin: "center center",
        }}>
          {/* Lines */}
          <GlowLine x1={NODES.logo.x} y1={NODES.logo.y} x2={NODES.identity.x} y2={NODES.identity.y} color={COLORS.graph.identity} startFrame={290} strokeWidth={1.5} />
          <GlowLine x1={NODES.logo.x} y1={NODES.logo.y} x2={NODES.colors.x} y2={NODES.colors.y} color={COLORS.graph.colors} startFrame={310} strokeWidth={1.5} />
          <GlowLine x1={NODES.identity.x} y1={NODES.identity.y} x2={NODES.typography.x} y2={NODES.typography.y} color={COLORS.graph.typography} startFrame={330} strokeWidth={1.5} />
          <GlowLine x1={NODES.colors.x} y1={NODES.colors.y} x2={NODES.voice.x} y2={NODES.voice.y} color={COLORS.graph.voice} startFrame={350} strokeWidth={1.5} />

          {/* Nodes */}
          <GraphNode variant="logo" x={NODES.logo.x} y={NODES.logo.y} startFrame={280} />
          <GraphNode variant="identity" x={NODES.identity.x} y={NODES.identity.y} startFrame={310} />
          <GraphNode variant="colors" x={NODES.colors.x} y={NODES.colors.y} startFrame={340} />
          <GraphNode variant="typography" x={NODES.typography.x} y={NODES.typography.y} startFrame={370} />
          <GraphNode variant="voice" x={NODES.voice.x} y={NODES.voice.y} startFrame={400} />

          {/* "Your entire brand identity — mapped." overlay */}
          {frame >= 460 && <GraphOverlayText frame={frame} fps={fps} />}
        </div>
      )}

      <Cursor keyframes={cursorKf} startFrame={3} visible={frame < total - 30} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const GraphOverlayText: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const p = spring({ fps, frame: Math.max(0, frame - 460), config: { damping: 15, mass: 0.5, stiffness: 180 } });
  return (
    <div style={{
      position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
      opacity: p,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      <div style={{
        fontFamily: FONTS.title, fontSize: 44, color: COLORS.textLight,
        textShadow: `0 0 40px ${COLORS.primary}30`,
      }}>
        Your entire brand identity — mapped.
      </div>
      <div style={{ fontFamily: FONTS.text, fontSize: 16, color: COLORS.textMuted }}>
        Colors · Typography · Voice · Identity · Logo — in seconds
      </div>
    </div>
  );
};
