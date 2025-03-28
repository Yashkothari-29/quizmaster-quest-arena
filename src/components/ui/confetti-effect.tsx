
import React, { useState, useEffect } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const colors = [
  '#6C00FF', // Purple
  '#00FFE0', // Teal
  '#FF003D', // Red
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FF00', // Green
];

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  active,
  duration = 3000,
  particleCount = 100,
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
      }));
      
      setParticles(newParticles);
      setIsVisible(true);
      
      // Hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
