import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  intensity?: number;
}

export function GlowEffect({
  children,
  className = '',
  glowColor = 'rgba(16, 185, 129, 0.3)',
  glowSize = 200,
  intensity = 0.5,
}: GlowEffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          x: glowX,
          y: glowY,
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: isHovering ? intensity : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Spotlight effect
export function Spotlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}

// Aurora background effect
export function AuroraBackground({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora layers */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div 
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.1), transparent, rgba(52, 211, 153, 0.1), transparent)',
            }}
          />
        </motion.div>
        
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div 
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            style={{
              background: 'conic-gradient(from 180deg, transparent, rgba(16, 185, 129, 0.08), transparent, rgba(110, 231, 183, 0.08), transparent)',
            }}
          />
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Floating particles with connection lines
export function ConnectedParticles({
  count = 30,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 3 + 1,
    }));
    setParticles(newParticles);
  }, [count]);

  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.vx + 100) % 100,
          y: (p.y + p.vy + 100) % 100,
        }))
      );
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection lines */}
        {particles.map((p1, i) =>
          particles.slice(i + 1).map((p2, _j) => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 15) return null;
            
            const opacity = (1 - distance / 15) * 0.2;
            
            return (
              <line
                key={`${p1.id}-${p2.id}`}
                x1={`${p1.x}%`}
                y1={`${p1.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke={`rgba(16, 185, 129, ${opacity})`}
                strokeWidth="1"
              />
            );
          })
        )}
      </svg>
      
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-emerald-400/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Import useMotionTemplate
import { useMotionTemplate } from 'framer-motion';
