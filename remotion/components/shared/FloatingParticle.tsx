import React from "react";
import { useCurrentFrame } from "remotion";
import { Particle, getParticlePosition } from "../../lib/particles";

interface FloatingParticleProps {
  particle: Particle;
  startFrame?: number;
  centerX?: number;
  centerY?: number;
}

export const FloatingParticle: React.FC<FloatingParticleProps> = ({
  particle,
  startFrame = 0,
  centerX = 960,
  centerY = 540,
}) => {
  const frame = useCurrentFrame();
  const { x, y, opacity } = getParticlePosition(particle, frame, startFrame, centerX, centerY);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: particle.size,
        height: particle.size,
        borderRadius: "50%",
        backgroundColor: particle.color,
        opacity,
        filter: `blur(${particle.size * 0.3}px)`,
        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
      }}
    />
  );
};
