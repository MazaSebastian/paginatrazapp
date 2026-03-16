import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

export function ScrollRevealText({ text, className = "", wordClassName = "" }: ScrollRevealTextProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
        
        return (
          <motion.span 
            key={i} 
            style={{ opacity }} 
            className={`mr-[0.25em] ${wordClassName}`}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}
