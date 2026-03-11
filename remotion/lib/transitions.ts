import { interpolate } from "remotion";

export function crossDissolve(
  frame: number,
  sceneEnd: number,
  duration: number = 15
): { outgoing: number; incoming: number } {
  const start = sceneEnd - duration;
  return {
    outgoing: interpolate(frame, [start, sceneEnd], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    incoming: interpolate(frame, [start, sceneEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  };
}

export function sceneFadeOut(
  frame: number,
  totalFrames: number,
  fadeDuration: number = 20
): number {
  const fadeStart = totalFrames - fadeDuration;
  return interpolate(frame, [fadeStart, totalFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function sceneFadeIn(
  frame: number,
  fadeDuration: number = 15
): number {
  return interpolate(frame, [0, fadeDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
