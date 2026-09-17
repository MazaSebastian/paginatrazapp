import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface SplitTextProps {
  text: string
  className?: string
  delay?: number // ms per character
  duration?: number // seconds per character
  ease?: any
  splitType?: 'chars' | 'words'
  from?: Record<string, any>
  to?: Record<string, any>
  threshold?: number
  rootMargin?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  onLetterAnimationComplete?: () => void
}

export function SplitText({
  text,
  className = '',
  delay = 30,
  duration = 0.55,
  ease = [0.22, 1, 0.36, 1],
  splitType = 'chars',
  from = { opacity: 0, y: 35 },
  to = { opacity: 1, y: 0 },
  rootMargin = '-50px',
  textAlign = 'center',
  tag: Component = 'span',
  onLetterAnimationComplete
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: rootMargin as any })

  // Split into words to preserve word boundaries and prevent any text overlapping
  const words = text.split(' ')

  let charIndexCounter = 0

  return (
    <Component
      ref={containerRef as any}
      className={`${className.includes('inline') || className.includes('block') || className.includes('flex') ? '' : 'inline-block '}${className}`.trim()}
      style={{ textAlign }}
    >
      {words.map((word, wordIndex) => {
        const characters = word.split('')
        const wordStartIdx = charIndexCounter
        charIndexCounter += characters.length + 1 // +1 for the space

        return (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {splitType === 'chars' ? (
              characters.map((char, charIdx) => {
                const globalCharIdx = wordStartIdx + charIdx
                return (
                  <motion.span
                    key={charIdx}
                    className="inline-block"
                    initial={from}
                    animate={isInView ? to : from}
                    transition={{
                      duration,
                      delay: (globalCharIdx * delay) / 1000,
                      ease
                    }}
                    onAnimationComplete={
                      wordIndex === words.length - 1 && charIdx === characters.length - 1
                        ? onLetterAnimationComplete
                        : undefined
                    }
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {char}
                  </motion.span>
                )
              })
            ) : (
              <motion.span
                className="inline-block"
                initial={from}
                animate={isInView ? to : from}
                transition={{
                  duration,
                  delay: (wordIndex * delay) / 1000,
                  ease
                }}
                onAnimationComplete={
                  wordIndex === words.length - 1 ? onLetterAnimationComplete : undefined
                }
                style={{ willChange: 'transform, opacity' }}
              >
                {word}
              </motion.span>
            )}
            {/* Preservar espacio natural entre palabras */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        )
      })}
    </Component>
  )
}

export default SplitText
