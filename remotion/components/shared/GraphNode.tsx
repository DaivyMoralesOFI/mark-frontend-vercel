import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../../config/colors";
import { FONTS } from "../../config/fonts";

type NodeVariant = "logo" | "identity" | "colors" | "typography" | "voice";

interface GraphNodeProps {
  variant: NodeVariant;
  x: number;
  y: number;
  startFrame?: number;
}

// Matches real app node styles from:
// src/modules/create-post/components/flow/BrandLogoNode.tsx etc.
const NODE_CONFIG: Record<NodeVariant, {
  label: string;
  dotColor: string;
  content: React.ReactNode;
}> = {
  logo: {
    label: "BRAND LOGO",
    dotColor: "#3B82F6",
    content: (
      <div style={{
        width: "100%", height: 100, borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <span style={{ fontSize: 36 }}>☕</span>
        <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Format</span>
          <span style={{ fontSize: 9, color: COLORS.primaryLight, backgroundColor: `${COLORS.primary}15`, padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>SVG</span>
        </div>
      </div>
    ),
  },
  identity: {
    label: "IDENTITY",
    dotColor: "#F59E0B",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <div style={{
          padding: 12, borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Name</div>
          <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600 }}>Coffee Brand Co.</div>
        </div>
        <div style={{
          padding: 12, borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Mission</div>
          <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: "1.4" }}>Crafting exceptional coffee experiences</div>
        </div>
      </div>
    ),
  },
  colors: {
    label: "COLOR SYSTEM",
    dotColor: "#EC4899",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Key Palette</div>
        <div style={{ display: "flex", gap: 10 }}>
          {["#6C5CE7", "#A29BFE", "#FD79A8"].map((color) => (
            <div key={color} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 12,
                backgroundColor: color, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
              }} />
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontWeight: 700, letterSpacing: -0.5 }}>{color}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase" }}>Surface</div>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>#1A1520</span>
          </div>
          <div style={{ width: 60, height: 10, borderRadius: 50, backgroundColor: "#1A1520", border: "1px solid rgba(255,255,255,0.05)" }} />
        </div>
      </div>
    ),
  },
  typography: {
    label: "TYPOGRAPHY",
    dotColor: "#8B5CF6",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <div style={{
          padding: 12, borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Headings</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, fontFamily: "'Pathway Gothic One', sans-serif" }}>The quick brown fox</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Pathway Gothic One · Bold</div>
        </div>
        <div style={{
          padding: 12, borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Body</div>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: "1.4" }}>A journey through craft and flavor</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Poppins · Regular</div>
        </div>
      </div>
    ),
  },
  voice: {
    label: "VOICE & TONE",
    dotColor: "#10B981",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Warm", "Artisanal", "Inviting", "Premium"].map((tag) => (
            <span key={tag} style={{
              padding: "3px 10px", borderRadius: 50,
              backgroundColor: `${COLORS.primary}12`,
              color: COLORS.primaryLight, fontSize: 10, fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{
          padding: 12, borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Style</div>
          <div style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: "1.4" }}>Conversational yet refined</div>
        </div>
        <div style={{
          padding: 12, borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.03)",
          fontStyle: "italic",
        }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: "1.4" }}>
            "Every cup tells a story of craftsmanship and passion."
          </div>
        </div>
      </div>
    ),
  },
};

export const GraphNode: React.FC<GraphNodeProps> = ({ variant, x, y, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = NODE_CONFIG[variant];

  const progress = spring({ fps, frame: Math.max(0, frame - startFrame), config: { damping: 12, mass: 0.6, stiffness: 150 } });
  const scale = interpolate(progress, [0, 1], [0.3, 1]);

  return (
    <div style={{
      position: "absolute", left: x, top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity: progress,
    }}>
      {/* Card - matches real app: bg-surface-container-lowest/95 dark:bg-[#121212]/90 backdrop-blur-xl rounded-3xl */}
      <div style={{
        width: variant === "colors" ? 270 : 240,
        padding: 20,
        borderRadius: 24,
        backgroundColor: `${COLORS.surfaceDark}E6`,
        backdropFilter: "blur(20px)",
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {/* Title row - matches: dot + uppercase label */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            backgroundColor: config.dotColor,
            boxShadow: `0 0 8px ${config.dotColor}80`,
          }} />
          <span style={{
            fontFamily: FONTS.text,
            fontSize: 10, fontWeight: 700,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase", letterSpacing: 2,
          }}>
            {config.label}
          </span>
        </div>

        {/* Content */}
        {config.content}
      </div>
    </div>
  );
};
