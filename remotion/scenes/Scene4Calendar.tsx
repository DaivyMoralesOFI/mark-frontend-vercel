import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Cursor } from "../components/shared/Cursor";
import { COLORS } from "../config/colors";
import { FONTS } from "../config/fonts";

// Workflow canvas scene: show result nodes as a flow
const FLOW_NODES = [
  { id: "prompt", x: 260, y: 440, label: "Your prompt", type: "bubble" as const, detail: "A vibrant coffee post..." },
  { id: "img1", x: 700, y: 300, label: "Generated", type: "image" as const, color: "#C08B5C" },
  { id: "img2", x: 700, y: 600, label: "Variation", type: "image" as const, color: "#8B4513" },
  { id: "edit", x: 1120, y: 300, label: "Edited", type: "image" as const, color: "#D4A574" },
];

export const Scene4Calendar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = 540;

  // PHASE 1 (0-140): LEFT headline + RIGHT floating canvas preview (small)
  // PHASE 2 (140-540): Headline fades, canvas zooms to fill screen, cursor navigates nodes

  const h1 = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  const h2 = spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 14, mass: 0.6, stiffness: 180 } });
  const subP = spring({ fps, frame: Math.max(0, frame - 40), config: { damping: 16, mass: 0.6, stiffness: 160 } });
  const headlineFade = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Canvas zoom: starts small on right, zooms to full
  const canvasZoom = interpolate(frame, [130, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const canvasScale = interpolate(canvasZoom, [0, 1], [0.5, 1]);
  const canvasX = interpolate(canvasZoom, [0, 1], [1200, 960]);
  const canvasY = interpolate(canvasZoom, [0, 1], [450, 540]);
  const canvasOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bottom text
  const bottomTextP = spring({ fps, frame: Math.max(0, frame - 400), config: { damping: 15, mass: 0.6, stiffness: 160 } });

  // Cursor
  const cursorKf = [
    { frame: 0, x: 1100, y: 400 },
    { frame: 40, x: 1150, y: 380 },
    // After zoom: interact with canvas
    { frame: 210, x: 700, y: 310, click: true },
    { frame: 280, x: 700, y: 610, click: true },
    { frame: 350, x: 1120, y: 310, click: true },
    { frame: 420, x: 280, y: 900, click: true },   // Zoom controls
    { frame: 500, x: 960, y: 540 },
  ];

  const fadeOut = interpolate(frame, [total - 25, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: fadeOut }}>
      {COLORS.extractorBg.map((g, i) => <div key={i} style={{ position: "absolute", inset: 0, background: g, opacity: 0.2 }} />)}

      {/* Headline */}
      <div style={{
        position: "absolute", left: 120, top: "50%", transform: "translateY(-50%)",
        width: 550, opacity: headlineFade, zIndex: 10,
      }}>
        <div style={{
          fontFamily: FONTS.text, fontSize: 15, fontWeight: 600,
          color: COLORS.primaryLight, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16,
          opacity: subP,
        }}>
          Workflow Canvas
        </div>
        <div style={{
          fontFamily: FONTS.title, fontSize: 68, color: COLORS.textLight, lineHeight: 1.05,
          opacity: h1, transform: `translateY(${interpolate(h1, [0, 1], [20, 0])}px)`,
        }}>
          See the full picture
        </div>
        <div style={{
          fontFamily: FONTS.title, fontSize: 68, lineHeight: 1.05,
          opacity: h2, transform: `translateY(${interpolate(h2, [0, 1], [20, 0])}px)`,
          background: `linear-gradient(90deg, #00CEC9, ${COLORS.primaryLight})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          of every creation.
        </div>
        <div style={{
          fontFamily: FONTS.text, fontSize: 18, color: COLORS.textSecondary, marginTop: 24, lineHeight: 1.6,
          opacity: subP, maxWidth: 440,
        }}>
          Every prompt, variation, and edit — connected in a visual workflow you can navigate.
        </div>
      </div>

      {/* Canvas area: scales from small preview to full */}
      <div style={{
        position: "absolute", left: canvasX, top: canvasY,
        transform: `translate(-50%, -50%) scale(${canvasScale})`,
        width: 1500, height: 900,
        opacity: canvasOpacity,
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden",
          backgroundColor: COLORS.bg,
          border: `1px solid ${COLORS.outlineVariant}`,
          boxShadow: canvasZoom < 0.5 ? "0 20px 60px rgba(0,0,0,0.4)" : "none",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, ${COLORS.outlineVariant}30 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }} />

          {/* Edges */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {[[0, 1], [0, 2], [1, 3]].map(([fromI, toI]) => {
              const from = FLOW_NODES[fromI];
              const to = FLOW_NODES[toI];
              const delay = 160 + fromI * 20 + toI * 10;
              const p = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 20, mass: 1, stiffness: 100 } });
              const len = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
              return (
                <line key={`${fromI}-${toI}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={COLORS.outlineVariant} strokeWidth={1.5}
                  strokeDasharray="6 4" strokeDashoffset={interpolate(p, [0, 1], [len, 0])}
                  opacity={p * 0.5}
                />
              );
            })}
          </svg>

          {/* Flow nodes */}
          {FLOW_NODES.map((node, i) => (
            <FlowNode key={node.id} node={node} frame={frame} fps={fps} delay={140 + i * 25} />
          ))}

          {/* Zoom controls bottom-left */}
          <div style={{
            position: "absolute", bottom: 24, left: 24,
            display: "flex", flexDirection: "column", gap: 4,
            backgroundColor: `${COLORS.surfaceOverlay}E6`, backdropFilter: "blur(20px)",
            border: `1px solid ${COLORS.borderSubtle}`, borderRadius: 12, padding: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}>
            {["+", "−", "⊞", "⟳"].map((icon) => (
              <div key={icon} style={{
                width: 32, height: 32, borderRadius: 8,
                display: "flex", justifyContent: "center", alignItems: "center",
                color: COLORS.textSecondary, fontSize: 16,
              }}>{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom selling text */}
      {frame >= 400 && (
        <div style={{
          position: "absolute", bottom: 50, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: bottomTextP,
        }}>
          <div style={{
            fontFamily: FONTS.title, fontSize: 40, color: COLORS.textLight,
            textShadow: `0 0 40px ${COLORS.primary}25`,
          }}>
            Your content pipeline — visualized.
          </div>
          <div style={{ fontFamily: FONTS.text, fontSize: 15, color: COLORS.textMuted }}>
            Navigate, iterate, and perfect every piece before publishing.
          </div>
        </div>
      )}

      <Cursor keyframes={cursorKf} startFrame={3} visible={frame >= 180 && frame < total - 30} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const FlowNode: React.FC<{ node: typeof FLOW_NODES[0]; frame: number; fps: number; delay: number }> = ({ node, frame, fps, delay }) => {
  const p = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 14, mass: 0.6, stiffness: 160 } });
  const scale = interpolate(p, [0, 1], [0.6, 1]);

  if (node.type === "bubble") {
    return (
      <div style={{
        position: "absolute", left: node.x, top: node.y,
        transform: `translate(-50%, -50%) scale(${scale})`, opacity: p,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
            display: "flex", justifyContent: "center", alignItems: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
            border: `1px solid ${COLORS.borderCard}`,
          }}>DM</div>
          <div style={{
            maxWidth: 260, padding: "10px 14px",
            backgroundColor: COLORS.surfaceCard, border: `1px solid ${COLORS.borderCard}`,
            borderRadius: "14px 14px 14px 4px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}>
            <span style={{ fontFamily: FONTS.text, fontSize: 12, color: COLORS.textSecondary, lineHeight: "1.5" }}>{node.detail}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "absolute", left: node.x, top: node.y,
      transform: `translate(-50%, -50%) scale(${scale})`, opacity: p,
    }}>
      <div style={{
        width: 280, borderRadius: 20, overflow: "hidden",
        backgroundColor: COLORS.surfaceCard, border: `1px solid ${COLORS.borderSubtle}`,
        boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
      }}>
        <div style={{
          width: "100%", height: 180,
          background: `linear-gradient(145deg, ${node.color}40, ${COLORS.bg})`,
          display: "flex", justifyContent: "center", alignItems: "center", position: "relative",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `radial-gradient(circle, ${node.color} 0%, transparent 70%)`,
            filter: "blur(18px)", opacity: 0.4, position: "absolute",
          }} />
          <span style={{ fontSize: 36, zIndex: 2 }}>☕</span>
        </div>
        <div style={{ padding: "10px 14px" }}>
          <span style={{ fontFamily: FONTS.text, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{node.label}</span>
        </div>
      </div>
    </div>
  );
};
