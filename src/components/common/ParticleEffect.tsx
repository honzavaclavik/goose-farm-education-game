import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ParticleType = 'confetti' | 'sparkle' | 'coins' | 'feathers' | 'stars';

interface ParticleEffectProps {
  type: ParticleType;
  /** Whether particles are currently active */
  active: boolean;
  /** Number of particles to spawn */
  count?: number;
  /** Duration in ms before auto-clearing */
  duration?: number;
  /** Origin x position (0-1 fraction of container) */
  originX?: number;
  /** Origin y position (0-1 fraction of container) */
  originY?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: string;
  dx: number;
  dy: number;
  duration: number;
}

const COLORS: Record<ParticleType, string[]> = {
  confetti: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#7B68EE'],
  sparkle: ['#FFD700', '#FFF8E1', '#FFE082', '#FFECB3'],
  coins: ['#FFD700', '#FFC107', '#FF8F00'],
  feathers: ['#E1BEE7', '#CE93D8', '#B39DDB', '#90CAF9', '#81D4FA'],
  stars: ['#FFD700', '#FFF176', '#FFE082', '#FFCC02'],
};

const SHAPES: Record<ParticleType, string[]> = {
  confetti: ['■', '●', '▲', '◆'],
  sparkle: ['✦', '✧', '⬥'],
  coins: ['●'],
  feathers: ['〜'],
  stars: ['★', '✦', '⭐'],
};

function createParticle(id: number, type: ParticleType, originX: number, originY: number): Particle {
  const colors = COLORS[type];
  const shapes = SHAPES[type];
  const angle = Math.random() * Math.PI * 2;
  const speed = 40 + Math.random() * 80;

  return {
    id,
    x: originX,
    y: originY,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.8,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed - 60, // upward bias
    duration: 0.6 + Math.random() * 0.6,
  };
}

export function ParticleEffect({
  type,
  active,
  count = 12,
  duration = 1200,
  originX = 0.5,
  originY = 0.5,
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const newParticles = Array.from({ length: count }, (_, i) =>
      createParticle(Date.now() + i, type, originX * 100, originY * 100)
    );
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [active, type, count, duration, originX, originY]);

  if (particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 1,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              left: `calc(${p.x}% + ${p.dx}px)`,
              top: `calc(${p.y}% + ${p.dy}px)`,
              opacity: 0,
              scale: p.scale,
              rotate: p.rotation,
            }}
            transition={{
              duration: p.duration,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              color: p.color,
              fontSize: type === 'coins' ? '16px' : '12px',
              lineHeight: 1,
              textShadow: type === 'sparkle' || type === 'stars'
                ? `0 0 4px ${p.color}`
                : 'none',
            }}
          >
            {p.shape}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
