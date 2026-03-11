import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { Cursor } from "../components/shared/Cursor";
import { TypewriterText } from "../components/shared/TypewriterText";
import { COLORS } from "../config/colors";
import { FONTS } from "../config/fonts";

/* ─────────────────────── constants ─────────────────────── */
const TOTAL = 600; // 20s @ 30fps

const AVATAR = "https://ui-avatars.com/api/?name=Sarah+M&background=6C5CE7&color=fff";
const DISPLAY = "Sarah Mitchell";
const HANDLE = "sarahmitchell";
const COPY_TEXT =
  "Embrace the warmth of our new Autumn Blend ☕ Rich, smooth, and crafted for cozy moments. Available now — taste the season.";

/* ─────────────────────── helper: zoom camera ─────────────────────── */
function useCamera(
  frame: number,
  fps: number,
  keyframes: { f: number; x: number; y: number; s: number }[]
) {
  let x = keyframes[0].x,
    y = keyframes[0].y,
    s = keyframes[0].s;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i],
      b = keyframes[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      x = interpolate(p, [0, 1], [a.x, b.x]);
      y = interpolate(p, [0, 1], [a.y, b.y]);
      s = interpolate(p, [0, 1], [a.s, b.s]);
      break;
    }
    if (frame > b.f) {
      x = b.x;
      y = b.y;
      s = b.s;
    }
  }
  return { x, y, s };
}

/* ─────────────────────── mini components ─────────────────────── */

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0,
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <img
      src={AVATAR}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
);

const CoffeeImage: React.FC<{ aspectRatio?: string; borderRadius?: number }> = ({
  aspectRatio = "1/1",
  borderRadius = 0,
}) => (
  <div
    style={{
      width: "100%",
      aspectRatio,
      borderRadius,
      overflow: "hidden",
      position: "relative",
      background: "linear-gradient(145deg, #2D1B4E, #1B2838, #2B1F1F)",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "15%",
        left: "20%",
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, #C08B5C 0%, transparent 70%)",
        filter: "blur(40px)",
        opacity: 0.7,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "15%",
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: "radial-gradient(circle, #8B4513 0%, transparent 70%)",
        filter: "blur(30px)",
        opacity: 0.5,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "10%",
        left: "40%",
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, #D4A574 0%, transparent 70%)",
        filter: "blur(25px)",
        opacity: 0.4,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: 72,
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
        }}
      >
        ☕
      </span>
    </div>
  </div>
);

/* ─────────────────────── toolbar icons (platform) ─────────────────────── */
const ToolbarIcon: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  glow?: boolean;
}> = ({ children, active, glow }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 16,
      background: active ? `${COLORS.primary}18` : "transparent",
      boxShadow: glow ? `0 0 12px ${COLORS.primary}40` : "none",
      border: active ? `1px solid ${COLORS.primary}35` : "1px solid transparent",
    }}
  >
    {children}
  </div>
);

/* ─────────────────────── PLATFORM CARDS ─────────────────────── */

const DefaultCard: React.FC = () => (
  <div
    style={{
      width: 440,
      borderRadius: 24,
      overflow: "hidden",
      background: COLORS.surfaceCard,
      border: `1px solid ${COLORS.borderSubtle}`,
      boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${COLORS.primary}08`,
    }}
  >
    <CoffeeImage />
    <div style={{ padding: "16px 20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12 }}>✨</span>
        <span
          style={{
            fontFamily: FONTS.text,
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: COLORS.textMuted,
          }}
        >
          Generated Copy
        </span>
      </div>
      <p
        style={{
          fontFamily: FONTS.text,
          fontSize: 12,
          color: COLORS.textSecondary,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {COPY_TEXT}
      </p>
    </div>
  </div>
);

const InstagramCard: React.FC = () => (
  <div
    style={{
      width: 440,
      borderRadius: 20,
      overflow: "hidden",
      background: "#000",
      border: "1px solid #333",
      boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    }}
  >
    {/* Header */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
      }}
    >
      <Avatar size={32} />
      <span
        style={{
          fontFamily: FONTS.text,
          fontSize: 13,
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {HANDLE}
      </span>
      <span
        style={{
          marginLeft: "auto",
          color: "#fff",
          fontSize: 18,
          letterSpacing: 2,
        }}
      >
        •••
      </span>
    </div>
    <CoffeeImage aspectRatio="1/1" />
    {/* Actions */}
    <div style={{ padding: "10px 14px 6px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: 22 }}>♡</span>
          <span style={{ fontSize: 22 }}>💬</span>
          <span style={{ fontSize: 22 }}>↗</span>
        </div>
        <span style={{ fontSize: 22 }}>🔖</span>
      </div>
      <p
        style={{
          fontFamily: FONTS.text,
          fontSize: 13,
          fontWeight: 700,
          color: "#fff",
          margin: "8px 0 4px",
        }}
      >
        1,234 likes
      </p>
      <p
        style={{
          fontFamily: FONTS.text,
          fontSize: 12,
          color: "#fff",
          lineHeight: 1.4,
          margin: 0,
        }}
      >
        <strong>{HANDLE}</strong> {COPY_TEXT.slice(0, 100)}...
      </p>
      <p
        style={{
          fontFamily: FONTS.text,
          fontSize: 10,
          color: "#666",
          marginTop: 6,
          textTransform: "uppercase",
        }}
      >
        2 hours ago
      </p>
    </div>
  </div>
);

const LinkedInCard: React.FC = () => (
  <div
    style={{
      width: 440,
      borderRadius: 20,
      overflow: "hidden",
      background: "#1B1F23",
      border: "1px solid #333",
      boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
      }}
    >
      <Avatar size={44} />
      <div>
        <p
          style={{
            fontFamily: FONTS.text,
            fontSize: 14,
            fontWeight: 600,
            color: "#FFFFFFE6",
            margin: 0,
          }}
        >
          {DISPLAY}
        </p>
        <p
          style={{
            fontFamily: FONTS.text,
            fontSize: 11,
            color: "#FFFFFF99",
            margin: 0,
          }}
        >
          Marketing Manager · 2nd
        </p>
        <p
          style={{
            fontFamily: FONTS.text,
            fontSize: 11,
            color: "#FFFFFF99",
            margin: 0,
          }}
        >
          2h · 🌐
        </p>
      </div>
    </div>
    <p
      style={{
        fontFamily: FONTS.text,
        fontSize: 13,
        color: "#FFFFFFE6",
        lineHeight: 1.5,
        padding: "0 16px 8px",
        margin: 0,
      }}
    >
      {COPY_TEXT}
    </p>
    <CoffeeImage aspectRatio="1.2/1" />
    <div
      style={{
        padding: "8px 16px",
        borderBottom: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontFamily: FONTS.text, fontSize: 12, color: "#FFFFFF99" }}>
        👍💡❤️ 1,482
      </span>
      <span style={{ fontFamily: FONTS.text, fontSize: 12, color: "#FFFFFF99" }}>
        87 comments · 24 reposts
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "6px 8px",
      }}
    >
      {["👍 Like", "💬 Comment", "🔁 Repost", "↗ Send"].map((a) => (
        <span
          key={a}
          style={{
            fontFamily: FONTS.text,
            fontSize: 12,
            color: "#FFFFFF99",
            padding: "6px 8px",
          }}
        >
          {a}
        </span>
      ))}
    </div>
  </div>
);

const FacebookCard: React.FC = () => (
  <div
    style={{
      width: 440,
      borderRadius: 20,
      overflow: "hidden",
      background: "#242526",
      border: "1px solid #3A3B3C",
      boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 14px",
      }}
    >
      <Avatar size={40} />
      <div>
        <p
          style={{
            fontFamily: FONTS.text,
            fontSize: 14,
            fontWeight: 600,
            color: "#E4E6EB",
            margin: 0,
          }}
        >
          {DISPLAY}
        </p>
        <p
          style={{
            fontFamily: FONTS.text,
            fontSize: 12,
            color: "#B0B3B8",
            margin: 0,
          }}
        >
          2h · 🌎
        </p>
      </div>
    </div>
    <p
      style={{
        fontFamily: FONTS.text,
        fontSize: 13,
        color: "#E4E6EB",
        lineHeight: 1.4,
        padding: "0 14px 8px",
        margin: 0,
      }}
    >
      {COPY_TEXT}
    </p>
    <CoffeeImage aspectRatio="1.2/1" />
    <div
      style={{
        padding: "8px 14px",
        borderBottom: "1px solid #3A3B3C",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontFamily: FONTS.text, fontSize: 13, color: "#B0B3B8" }}>
        👍❤️ 248
      </span>
      <span style={{ fontFamily: FONTS.text, fontSize: 13, color: "#B0B3B8" }}>
        32 comments · 12 shares
      </span>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "6px 8px",
      }}
    >
      {["👍 Like", "💬 Comment", "↗ Share"].map((a) => (
        <span
          key={a}
          style={{
            fontFamily: FONTS.text,
            fontSize: 13,
            fontWeight: 500,
            color: "#B0B3B8",
            padding: "8px 12px",
          }}
        >
          {a}
        </span>
      ))}
    </div>
  </div>
);

const TikTokCard: React.FC = () => (
  <div
    style={{
      width: 300,
      aspectRatio: "9/16",
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
      background: "#000",
      border: "1px solid #333",
      boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(145deg, #2D1B4E, #1B2838, #2B1F1F)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "25%",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, #C08B5C 0%, transparent 70%)",
          filter: "blur(35px)",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 64, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
          ☕
        </span>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)",
      }}
    />
    {/* Right icons */}
    <div
      style={{
        position: "absolute",
        right: 12,
        bottom: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      {["♡ 45.2K", "💬 1.2K", "🔖 8.4K", "↗ 2.1K"].map((item) => {
        const [icon, count] = item.split(" ");
        return (
          <div
            key={item}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span style={{ fontSize: 22, color: "#fff" }}>{icon}</span>
            <span
              style={{
                fontFamily: FONTS.text,
                fontSize: 10,
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {count}
            </span>
          </div>
        );
      })}
    </div>
    {/* Bottom */}
    <div style={{ position: "absolute", bottom: 16, left: 12, right: 60 }}>
      <p
        style={{
          fontFamily: FONTS.text,
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          margin: 0,
        }}
      >
        @{HANDLE}
      </p>
      <p
        style={{
          fontFamily: FONTS.text,
          fontSize: 12,
          color: "#fff",
          lineHeight: 1.3,
          margin: "4px 0 0",
        }}
      >
        {COPY_TEXT.slice(0, 80)}...
      </p>
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}
      >
        <span style={{ fontSize: 12 }}>🎵</span>
        <span style={{ fontFamily: FONTS.text, fontSize: 11, color: "#fff" }}>
          Original Sound - {DISPLAY}
        </span>
      </div>
    </div>
  </div>
);

/* ─────────────────────── MAIN SCENE ─────────────────────── */

export const SceneSocialPreviews: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /*
    TIMELINE (600 frames = 20s)
    ─────────────────────────────
    0-90     PHASE 1: Headline "Preview your post on every platform" + default card fades in
    90-130   Cursor moves to toolbar, clicks Instagram icon
    130-230  PHASE 2: Card morphs → Instagram preview, zoom into the card
    230-260  Cursor clicks LinkedIn
    260-350  PHASE 3: Card morphs → LinkedIn, camera pans
    350-380  Cursor clicks Facebook
    380-440  PHASE 4: Facebook preview
    440-470  Cursor clicks TikTok
    470-540  PHASE 5: TikTok preview (vertical card), zoom out slightly
    540-600  PHASE 6: All 4 cards fan out in a row, headline "One image. Every platform."
  */

  // ── Global fade in/out ──
  const globalFadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalFadeOut = interpolate(frame, [TOTAL - 20, TOTAL], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = Math.min(globalFadeIn, globalFadeOut);

  // ── Which platform is active ──
  type PlatformKey = "default" | "instagram" | "linkedin" | "facebook" | "tiktok" | "all";
  let activePlatform: PlatformKey = "default";
  if (frame >= 540) activePlatform = "all";
  else if (frame >= 470) activePlatform = "tiktok";
  else if (frame >= 380) activePlatform = "facebook";
  else if (frame >= 260) activePlatform = "linkedin";
  else if (frame >= 130) activePlatform = "instagram";

  // ── Headline ──
  const h1P = spring({
    fps,
    frame: Math.max(0, frame - 5),
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });
  const h2P = spring({
    fps,
    frame: Math.max(0, frame - 18),
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });
  const subP = spring({
    fps,
    frame: Math.max(0, frame - 40),
    config: { damping: 16, mass: 0.6, stiffness: 160 },
  });
  const headlineOpacity = interpolate(frame, [80, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Card spring (per platform) ──
  const getCardSpring = (startFrame: number) =>
    spring({
      fps,
      frame: Math.max(0, frame - startFrame),
      config: { damping: 13, mass: 0.6, stiffness: 160 },
    });

  const defaultCardP = getCardSpring(30);
  const instaP = getCardSpring(135);
  const linkedinP = getCardSpring(265);
  const facebookP = getCardSpring(385);
  const tiktokP = getCardSpring(475);

  // Fade between card transitions
  const cardTransition = (showStart: number, hideStart: number) => {
    const show = interpolate(frame, [showStart, showStart + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const hide = interpolate(frame, [hideStart - 8, hideStart + 4], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.min(show, hide);
  };

  // ── Camera ──
  const cameraKf = [
    { f: 0, x: 0, y: 0, s: 1 },
    { f: 90, x: 0, y: 0, s: 1 },
    { f: 140, x: 60, y: 30, s: 1.15 },   // zoom into Instagram
    { f: 230, x: 60, y: 30, s: 1.15 },
    { f: 270, x: -30, y: 10, s: 1.1 },   // pan to LinkedIn
    { f: 350, x: -30, y: 10, s: 1.1 },
    { f: 390, x: 40, y: -10, s: 1.12 },  // pan to Facebook
    { f: 440, x: 40, y: -10, s: 1.12 },
    { f: 480, x: 0, y: 20, s: 1.08 },    // TikTok
    { f: 535, x: 0, y: 20, s: 1.08 },
    { f: 555, x: 0, y: 0, s: 0.82 },     // zoom out for finale
  ];
  const cam = useCamera(frame, fps, cameraKf);

  // ── Toolbar state ──
  const toolbarOpacity = interpolate(frame, [65, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * interpolate(frame, [535, 545], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toolbarP = spring({
    fps,
    frame: Math.max(0, frame - 68),
    config: { damping: 15, mass: 0.5, stiffness: 200 },
  });

  // ── Cursor keyframes ──
  const cursorKf = [
    { frame: 0, x: 900, y: 600 },
    // Move to toolbar (instagram icon)
    { frame: 85, x: 840, y: 300 },
    { frame: 100, x: 840, y: 300, click: true },
    // Wait, then move to LinkedIn icon
    { frame: 225, x: 876, y: 300 },
    { frame: 240, x: 876, y: 300, click: true },
    // Move to Facebook
    { frame: 345, x: 912, y: 300 },
    { frame: 360, x: 912, y: 300, click: true },
    // Move to TikTok
    { frame: 435, x: 948, y: 300 },
    { frame: 450, x: 948, y: 300, click: true },
    // Exit
    { frame: 530, x: 1000, y: 400 },
    { frame: 545, x: 1200, y: 600 },
  ];

  // ── PHASE 6: Finale — all cards fan out ──
  const finaleP = spring({
    fps,
    frame: Math.max(0, frame - 548),
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });
  const finaleHeadP = spring({
    fps,
    frame: Math.max(0, frame - 560),
    config: { damping: 14, mass: 0.6, stiffness: 160 },
  });

  // Selling tag pills at the bottom
  const tags = ["Instagram", "LinkedIn", "Facebook", "TikTok"];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, opacity: globalOpacity }}>
      {/* Ambient bg */}
      {COLORS.extractorBg.map((g, i) => (
        <div
          key={i}
          style={{ position: "absolute", inset: 0, background: g, opacity: 0.25 }}
        />
      ))}

      {/* Camera wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`,
          transformOrigin: "center center",
        }}
      >
        {/* ── PHASE 1: Headline ── */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            opacity: headlineOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: 15,
              fontWeight: 600,
              color: COLORS.primaryLight,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 16,
              opacity: subP,
            }}
          >
            Social Preview
          </div>
          <div
            style={{
              fontFamily: FONTS.title,
              fontSize: 66,
              color: COLORS.textLight,
              lineHeight: 1.05,
              opacity: h1P,
              transform: `translateY(${interpolate(h1P, [0, 1], [20, 0])}px)`,
            }}
          >
            Preview your post
          </div>
          <div
            style={{
              fontFamily: FONTS.title,
              fontSize: 66,
              lineHeight: 1.05,
              opacity: h2P,
              transform: `translateY(${interpolate(h2P, [0, 1], [20, 0])}px)`,
              background: `linear-gradient(90deg, ${COLORS.primary}, #FD79A8)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            on every platform.
          </div>
          <div
            style={{
              fontFamily: FONTS.text,
              fontSize: 18,
              color: COLORS.textSecondary,
              marginTop: 24,
              lineHeight: 1.6,
              opacity: subP,
              maxWidth: 440,
            }}
          >
            Instantly see how your content looks on Instagram, LinkedIn, Facebook,
            and TikTok — before you publish.
          </div>
        </div>

        {/* ── Default card (right side, phase 1) ── */}
        {activePlatform === "default" && (
          <div
            style={{
              position: "absolute",
              right: 180,
              top: "50%",
              transform: `translateY(-50%) scale(${interpolate(defaultCardP, [0, 1], [0.85, 1])})`,
              opacity: defaultCardP *
                interpolate(frame, [120, 135], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
            }}
          >
            <DefaultCard />
          </div>
        )}

        {/* ── Toolbar (floating above center card) ── */}
        {activePlatform !== "all" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 270,
              transform: `translateX(-50%) translateY(${interpolate(toolbarP, [0, 1], [15, 0])}px)`,
              opacity: toolbarOpacity,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px",
              background: `${COLORS.surfaceCard}E6`,
              backdropFilter: "blur(20px)",
              borderRadius: 14,
              border: `1px solid ${COLORS.borderSubtle}`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            }}
          >
            <ToolbarIcon>
              <span style={{ fontSize: 14 }}>⬇</span>
            </ToolbarIcon>
            <ToolbarIcon>
              <span style={{ fontSize: 14, color: "#EF4444" }}>🗑</span>
            </ToolbarIcon>
            <div
              style={{
                width: 1,
                height: 22,
                background: COLORS.borderSubtle,
                margin: "0 4px",
              }}
            />
            <ToolbarIcon
              active={activePlatform === "instagram"}
              glow={activePlatform === "instagram"}
            >
              <span style={{ fontSize: 14 }}>📷</span>
            </ToolbarIcon>
            <ToolbarIcon
              active={activePlatform === "facebook"}
              glow={activePlatform === "facebook"}
            >
              <span style={{ fontSize: 14 }}>👤</span>
            </ToolbarIcon>
            <ToolbarIcon
              active={activePlatform === "linkedin"}
              glow={activePlatform === "linkedin"}
            >
              <span style={{ fontSize: 14 }}>💼</span>
            </ToolbarIcon>
            <ToolbarIcon
              active={activePlatform === "tiktok"}
              glow={activePlatform === "tiktok"}
            >
              <span style={{ fontSize: 14 }}>🎵</span>
            </ToolbarIcon>
          </div>
        )}

        {/* ── Platform cards (center, one at a time) ── */}
        {activePlatform === "instagram" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "53%",
              transform: `translate(-50%, -50%) scale(${interpolate(instaP, [0, 1], [0.88, 1])})`,
              opacity: instaP * cardTransition(130, 260),
            }}
          >
            <InstagramCard />
          </div>
        )}
        {activePlatform === "linkedin" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "53%",
              transform: `translate(-50%, -50%) scale(${interpolate(linkedinP, [0, 1], [0.88, 1])})`,
              opacity: linkedinP * cardTransition(260, 380),
            }}
          >
            <LinkedInCard />
          </div>
        )}
        {activePlatform === "facebook" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "53%",
              transform: `translate(-50%, -50%) scale(${interpolate(facebookP, [0, 1], [0.88, 1])})`,
              opacity: facebookP * cardTransition(380, 470),
            }}
          >
            <FacebookCard />
          </div>
        )}
        {activePlatform === "tiktok" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "53%",
              transform: `translate(-50%, -50%) scale(${interpolate(tiktokP, [0, 1], [0.88, 1])})`,
              opacity: tiktokP * cardTransition(470, 540),
            }}
          >
            <TikTokCard />
          </div>
        )}

        {/* ── PHASE 6: Finale — all cards spread ── */}
        {activePlatform === "all" && (
          <>
            {/* Headline */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 60,
                transform: `translateX(-50%) translateY(${interpolate(finaleHeadP, [0, 1], [30, 0])}px)`,
                opacity: finaleHeadP,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.title,
                  fontSize: 56,
                  lineHeight: 1.1,
                  background: `linear-gradient(90deg, ${COLORS.primary}, #FD79A8, #38BDF8)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                One image. Every platform.
              </div>
              <div
                style={{
                  fontFamily: FONTS.text,
                  fontSize: 18,
                  color: COLORS.textSecondary,
                  marginTop: 12,
                }}
              >
                See exactly how your content will look — instantly.
              </div>
            </div>

            {/* Cards row */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "52%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "flex-start",
                gap: 24,
              }}
            >
              {[
                { Card: InstagramCard, label: "Instagram", delay: 0 },
                { Card: LinkedInCard, label: "LinkedIn", delay: 4 },
                { Card: FacebookCard, label: "Facebook", delay: 8 },
                { Card: TikTokCard, label: "TikTok", delay: 12 },
              ].map(({ Card, label, delay }, i) => {
                const p = spring({
                  fps,
                  frame: Math.max(0, frame - 550 - delay),
                  config: { damping: 14, mass: 0.6, stiffness: 150 },
                });
                return (
                  <div
                    key={label}
                    style={{
                      transform: `translateY(${interpolate(p, [0, 1], [60, 0])}px) scale(0.52)`,
                      opacity: p,
                      transformOrigin: "top center",
                    }}
                  >
                    <Card />
                  </div>
                );
              })}
            </div>

            {/* Tags */}
            <div
              style={{
                position: "absolute",
                bottom: 65,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 10,
              }}
            >
              {tags.map((tag, i) => {
                const tp = spring({
                  fps,
                  frame: Math.max(0, frame - 570 - i * 6),
                  config: { damping: 15, mass: 0.5, stiffness: 200 },
                });
                return (
                  <span
                    key={tag}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 50,
                      backgroundColor: `${COLORS.primary}12`,
                      border: `1px solid ${COLORS.primary}25`,
                      fontFamily: FONTS.text,
                      fontSize: 14,
                      fontWeight: 500,
                      color: COLORS.primaryLight,
                      opacity: tp,
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </>
        )}

        {/* ── Platform label (appears during individual previews) ── */}
        {activePlatform !== "default" && activePlatform !== "all" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 90,
              transform: "translateX(-50%)",
              fontFamily: FONTS.text,
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.primaryLight,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: interpolate(
                frame,
                [
                  activePlatform === "instagram" ? 140 : activePlatform === "linkedin" ? 270 : activePlatform === "facebook" ? 390 : 480,
                  (activePlatform === "instagram" ? 140 : activePlatform === "linkedin" ? 270 : activePlatform === "facebook" ? 390 : 480) + 15,
                ],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              ),
            }}
          >
            {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)} Preview
          </div>
        )}
      </div>

      {/* Cursor */}
      <Cursor keyframes={cursorKf} startFrame={3} visible={frame < 540} />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
