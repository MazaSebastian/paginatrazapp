import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.floor(latest).toLocaleString();
  });

  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isInView && !hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, motionValue, hasAnimated]);

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (latest) => {
      setDisplay(latest);
    });
    return () => unsubscribe();
  }, [displayValue]);

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}

// Slot machine number effect
export function SlotMachineNumber({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const digits = value.toString().split('');

  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      {digits.map((digit, index) => (
        <motion.span
          key={index}
          className="inline-block overflow-hidden"
          style={{ height: '1em' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.1 }}
        >
          <motion.span
            className="flex flex-col"
            initial={{ y: '-1000%' }}
            animate={isInView ? { y: `-${parseInt(digit) * 10}%` } : {}}
            transition={{
              delay: index * 0.1 + 0.2,
              duration: 1.5,
              ease: [0.645, 0.045, 0.355, 1],
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, i) => (
              <span key={i} className="h-[1em] flex items-center justify-center">
                {num}
              </span>
            ))}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

// Rolling counter with odometer effect
export function OdometerCounter({
  value,
  suffix = '',
  className = '',
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(startValue + (value - startValue) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
