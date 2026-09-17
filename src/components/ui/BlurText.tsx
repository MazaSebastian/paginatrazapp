import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface BlurTextProps {
  text?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, any>
  animationTo?: Record<string, any>
  stepDuration?: number
  style?: React.CSSProperties
  onAnimationComplete?: () => void
}

export function BlurText({
  text = '',
  as = 'p',
  delay = 80,
  className = '',
  animateBy = 'words',
  direction = 'top',
  rootMargin = '-50px',
  animationFrom,
  animationTo,
  stepDuration = 0.5,
  style = {},
  onAnimationComplete
}: BlurTextProps) {
  const Component = as as any
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: rootMargin as any })
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')

  const initialY = direction === 'top' ? -20 : 20

  const fromSnapshot = animationFrom ?? {
    filter: 'blur(10px)',
    opacity: 0,
    y: initialY
  }

  const toSnapshot = animationTo ?? {
    filter: 'blur(0px)',
    opacity: 1,
    y: 0
  }

  return (
    <Component
      ref={ref as any}
      className={className}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        ...style
      }}
    >
      {elements.map((segment, index) => {
        const isSpace = segment === ' '
        return (
          <motion.span
            key={index}
            className="inline-block will-change-[transform,filter,opacity]"
            initial={fromSnapshot}
            animate={isInView ? toSnapshot : fromSnapshot}
            transition={{
              duration: stepDuration,
              delay: (index * delay) / 1000,
              ease: [0.16, 1, 0.3, 1]
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {isSpace ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      })}
    </Component>
  )
}

export default BlurText
