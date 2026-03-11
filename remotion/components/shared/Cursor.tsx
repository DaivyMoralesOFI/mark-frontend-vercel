import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface CursorKeyframe {
  frame: number;
  x: number;
  y: number;
  click?: boolean;
}

interface CursorProps {
  keyframes: CursorKeyframe[];
  startFrame?: number;
  visible?: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ keyframes, startFrame = 0, visible = true }) => {
  const frame = useCurrentFrame();
  const f = frame - startFrame;

  if (!visible || f < 0 || keyframes.length === 0) return null;

  let x = keyframes[0].x;
  let y = keyframes[0].y;
  let isClicking = false;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const curr = keyframes[i];
    const next = keyframes[i + 1];
    if (f >= curr.frame && f <= next.frame) {
      const p = interpolate(f, [curr.frame, next.frame], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      x = interpolate(p, [0, 1], [curr.x, next.x]);
      y = interpolate(p, [0, 1], [curr.y, next.y]);
      if (next.click && p > 0.92) isClicking = true;
      break;
    }
    if (f > next.frame) {
      x = next.x;
      y = next.y;
      if (next.click && f < next.frame + 6) isClicking = true;
    }
  }
  const last = keyframes[keyframes.length - 1];
  if (f >= last.frame) { x = last.x; y = last.y; if (last.click && f < last.frame + 6) isClicking = true; }

  const opacity = interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 9999, opacity, pointerEvents: "none" }}>
      <svg width="28" height="34" viewBox="0 0 24 28" fill="none" style={{
        transform: `scale(${isClicking ? 0.75 : 1})`,
        transition: "transform 0.08s ease",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
      }}>
        <path d="M5.5 1L5.5 21.5L10.2 16.8L14.5 25L17.5 23.5L13.2 15.3L19.5 14.5L5.5 1Z"
          fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      {isClicking && (
        <div style={{
          position: "absolute", top: -12, left: -12, width: 48, height: 48, borderRadius: "50%",
          border: `2px solid ${`rgba(217,70,239,0.5)`}`,
          boxShadow: "0 0 20px rgba(217,70,239,0.3)",
        }} />
      )}
    </div>
  );
};
