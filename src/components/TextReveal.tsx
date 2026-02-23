import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'words' | 'chars' | 'lines';
  stagger?: number;
  once?: boolean;
  interactive?: boolean;
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  type = 'words',
  stagger = 0.03,
  once = true,
  interactive = false,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: 50,
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const splitText = () => {
    if (type === 'chars') {
      return children.split('');
    } else if (type === 'words') {
      return children.split(' ');
    }
    return [children];
  };

  const items = splitText();

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ perspective: '1000px' }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={interactive ? {
            scale: 1.15,
            y: -3,
            color: '#4ADE80',
            textShadow: '0 0 8px rgba(52, 211, 153, 0.5)',
            transition: { type: "spring", stiffness: 400, damping: 15 }
          } : undefined}
        >
          {item === ' ' ? '\u00A0' : item}
          {type === 'words' && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Glitch text effect
export function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 -z-10 opacity-0 group-hover:opacity-70 text-green-500 animate-pulse"
        style={{ clipPath: 'inset(0 0 50% 0)', transform: 'translateX(2px)' }}
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 -z-10 opacity-0 group-hover:opacity-70 text-rose-500 animate-pulse"
        style={{ clipPath: 'inset(50% 0 0 0)', transform: 'translateX(-2px)' }}
      >
        {children}
      </span>
    </span>
  );
}

// Scramble text effect
export function ScrambleText({
  children,
  className = '',
  trigger = 'hover'
}: {
  children: string;
  className?: string;
  trigger?: 'hover' | 'inView';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        children
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return children[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / 2;

      if (iteration >= children.length) {
        clearInterval(interval);
        setDisplayText(children);
        setIsScrambling(false);
      }
    }, 30);
  };

  useEffect(() => {
    if (trigger === 'inView' && isInView) {
      scramble();
    }
  }, [isInView]);

  return (
    <span
      ref={ref}
      className={`inline-block font-mono ${className}`}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
    >
      {displayText}
    </span>
  );
}

// Typewriter effect
import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function Typewriter({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
      // Blink cursor after typing
      const blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(blinkInterval);
    }
  }, [displayText, started, speed, text, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span
          className={`inline-block w-[3px] h-[1em] bg-green-400 ml-1 align-middle transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'
            }`}
        />
      )}
    </span>
  );
}

// Magnetic text
export function MagneticText({
  children,
  className = ''
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    ref.current.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-200 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
}
