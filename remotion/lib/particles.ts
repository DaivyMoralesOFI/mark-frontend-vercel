export interface Particle {
  id: number;
  angle: number;
  speed: number;
  delay: number;
  size: number;
  color: string;
}

export function generateParticles(
  count: number,
  colors: string[]
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
      speed: 2 + Math.random() * 4,
      delay: Math.floor(Math.random() * 15),
      size: 2 + Math.random() * 3,
      color: colors[i % colors.length],
    });
  }
  return particles;
}

export function getParticlePosition(
  particle: Particle,
  frame: number,
  startFrame: number = 0,
  centerX: number = 960,
  centerY: number = 540
): { x: number; y: number; opacity: number } {
  const elapsed = Math.max(0, frame - startFrame - particle.delay);
  const distance = elapsed * particle.speed;
  const maxDistance = 500;

  return {
    x: centerX + Math.cos(particle.angle) * distance,
    y: centerY + Math.sin(particle.angle) * distance,
    opacity: distance > maxDistance ? 0 : 1 - distance / maxDistance,
  };
}
