import React from "react";
import { spring, interpolate, SpringConfig } from "remotion";

const DEFAULT_SPRING: SpringConfig = { damping: 15, mass: 0.8, stiffness: 200 };

export function getLetterStyles(
  frame: number,
  fps: number,
  letterIndex: number,
  baseDelay: number = 0,
  interval: number = 3
): React.CSSProperties {
  const delay = baseDelay + letterIndex * interval;
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: DEFAULT_SPRING,
  });

  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
    display: "inline-block",
  };
}

export function getTypewriterText(
  text: string,
  frame: number,
  startFrame: number = 0,
  charsPerFrame: number = 0.5
): string {
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  return text.substring(0, charCount);
}

export function getWordStyles(
  frame: number,
  fps: number,
  wordIndex: number,
  baseDelay: number = 0,
  interval: number = 8
): React.CSSProperties {
  const delay = baseDelay + wordIndex * interval;
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 20, mass: 0.6, stiffness: 180 },
  });

  return {
    opacity: progress,
    transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
    display: "inline-block",
    marginRight: "0.3em",
  };
}
