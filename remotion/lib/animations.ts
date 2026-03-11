import { spring, interpolate, SpringConfig } from "remotion";

export const SPRING_PRESETS = {
  gentle: { damping: 200, mass: 0.5, stiffness: 100 } satisfies SpringConfig,
  snappy: { damping: 15, mass: 0.8, stiffness: 200 } satisfies SpringConfig,
  bouncy: { damping: 10, mass: 0.6, stiffness: 150 } satisfies SpringConfig,
  slow: { damping: 30, mass: 1.2, stiffness: 80 } satisfies SpringConfig,
} as const;

export function fadeIn(
  frame: number,
  startFrame: number = 0,
  duration: number = 20
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function fadeOut(
  frame: number,
  startFrame: number,
  duration: number = 20
): number {
  return interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function slideIn(
  frame: number,
  fps: number,
  delay: number,
  direction: "up" | "down" | "left" | "right",
  preset: SpringConfig = SPRING_PRESETS.snappy
): number {
  const progress = spring({ fps, frame: Math.max(0, frame - delay), config: preset });
  const distance = 80;
  const offset = interpolate(progress, [0, 1], [distance, 0]);

  switch (direction) {
    case "up":
    case "left":
      return -offset;
    case "down":
    case "right":
      return offset;
  }
}

export function scaleIn(
  frame: number,
  fps: number,
  delay: number = 0,
  preset: SpringConfig = SPRING_PRESETS.bouncy
): number {
  return spring({ fps, frame: Math.max(0, frame - delay), config: preset });
}

export function stagger(index: number, baseDelay: number, interval: number = 5): number {
  return baseDelay + index * interval;
}
