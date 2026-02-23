import { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
    text,
    delay = 50,
    className = '',
    animateBy = 'words',
    direction = 'top',
    onAnimationComplete,
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const ref = useRef<HTMLParagraphElement>(null);
    const controls = useAnimation();

    useEffect(() => {
        controls.start('visible');
    }, [controls]);

    const defaultVariants = {
        hidden: { filter: 'blur(10px)', opacity: 0, transform: `translate3d(0,${direction === 'top' ? '-50px' : '50px'},0)` },
        visible: { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
    };

    return (
        <p ref={ref} className={`flex flex-wrap justify-center ${className}`}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    variants={defaultVariants}
                    initial="hidden"
                    animate={controls}
                    transition={{
                        delay: index * (delay / 1000),
                        duration: 0.8, // 800ms
                        ease: [0.1, 0.4, 0.1, 1],
                    }}
                    onAnimationComplete={() => {
                        if (index === elements.length - 1 && onAnimationComplete) {
                            onAnimationComplete();
                        }
                    }}
                    className="inline-block"
                    style={{ marginRight: animateBy === 'words' ? '0.25em' : '0' }}
                    dangerouslySetInnerHTML={animateBy === 'letters' && element === ' ' ? { __html: '&nbsp;' } : undefined}
                >
                    {animateBy === 'words' || element !== ' ' ? element : null}
                </motion.span>
            ))}
        </p>
    );
};
