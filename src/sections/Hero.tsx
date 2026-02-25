import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Shield, Microscope, LayoutDashboard, Stethoscope, Sprout, MapPin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import ShinyText from '@/components/ShinyText';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { TiltCard } from '@/components/TiltCard';
import { AuroraBackground } from '@/components/GlowEffect';

// Magnetic Button Component
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-xl bg-green-400/20 blur-xl"
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.2 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}



// Glowing Orbs with complex animation
function GlowingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 40, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}


// Holographic Stat Card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HolographicStatCard({ icon: Icon, value, suffix, label, delay, index }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isMobile = useIsMobile();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: isMobile ? index * 0.15 : delay }}
      className="h-full"
    >
      <TiltCard tiltAmount={isMobile ? 0 : 15} glareEnabled={!isMobile} scale={isMobile ? 1 : 1.05} className="h-full">
        <div className="relative h-full group p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md overflow-hidden cursor-default transition-colors duration-300 hover:bg-white/10 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
          {/* Hover Gradient Background - Adjusted for Tilt */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Animated Border Effect */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-green-500/30 transition-all duration-500" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center h-full pt-4">
            <div className="mb-4 p-3 rounded-full bg-white/5 group-hover:bg-green-500/10 transition-colors duration-300 ring-1 ring-white/10 group-hover:ring-green-500/30">
              <Icon className="w-8 h-8 text-green-400 group-hover:scale-110 group-hover:text-green-300 transition-all duration-300" />
            </div>
            <div className={`font-bold text-white mb-2 tracking-tight drop-shadow-lg ${typeof value === 'number' ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
              {typeof value === 'number' ? (
                <AnimatedCounter value={value} suffix={suffix} duration={2.5} />
              ) : (
                <span>{value}{suffix}</span>
              )}
            </div>
            <div className="text-sm text-slate-300 uppercase tracking-widest font-medium group-hover:text-green-300 transition-colors">
              {label}
            </div>
          </div>

          {/* Decorate corners */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 blur-3xl -ml-12 -mb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <>
        <AuroraBackground className="absolute inset-0" />
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <GlowingOrbs />
      </>

      {/* Content with parallax */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32"
        style={isMobile ? {} : { y, opacity, scale }}
      >
        <div className="text-center">

          {/* Main Headline with character animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <div className="flex flex-wrap justify-center items-center gap-x-4">
              <span className="text-white">
                <ShinyText
                  text="Crecemos"
                  speed={2}
                  delay={3}
                  color="#ffffff"
                  shineColor="#22C55E"
                  spread={90}
                  direction="left"
                />
              </span>
              <span className="text-green-400">
                <ShinyText
                  text="con vos."
                  speed={2}
                  delay={3.5}
                  color="#4ade80"
                  shineColor="#ffffff"
                  spread={90}
                  direction="left"
                />
              </span>
            </div>
          </motion.h1>

          {/* Subheadline with fade up */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Administración, gestión y trazabilidad aplicada al <span className="text-green-400">cannabis medicinal.</span>
          </motion.p>

          {/* CTA Buttons with stagger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="relative group block">
              <MagneticButton className="w-full h-full">
                <Button
                  size="lg"
                  className="relative bg-[#020617]/40 backdrop-blur-xl border border-white/10 hover:border-green-500/50 text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 group-hover:shadow-green-lg overflow-hidden flex items-center gap-2 w-full"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Comenzar Ahora
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                    initial={{ x: '-200%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.8 }}
                  />
                </Button>
              </MagneticButton>
            </Link>

            {/*
            <TiltCard tiltAmount={5} scale={1.02}>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-white/5 hover:border-green-500/50 hover:text-white px-8 py-6 text-lg rounded-xl transition-all duration-300"
              >
                Ver Demo
              </Button>
            </TiltCard>
*/}
          </motion.div>

          {/* Stats Row */}
          {/* Stats Row */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {[
              { value: 100, suffix: '%', label: 'Trazable', icon: LayoutDashboard },
              { value: 'AES', suffix: '-256', label: 'Proteccion de Datos y Registros clínicos', icon: Lock },
              { value: 24, suffix: '/7', label: 'Seguimiento en Tiempo Real', icon: MapPin },
            ].map((stat, index) => (
              <HolographicStatCard
                key={stat.label}
                {...stat}
                delay={2 + index * 0.15}
                index={index}
              />
            ))}
          </div>

          {/* Trust Badges with hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { icon: Shield, text: 'Adecuado a REPROCANN' },
              { icon: Microscope, text: 'Certificado por Laboratorio' },
              { icon: Sprout, text: 'Preservación Genética' },
              { icon: Stethoscope, text: 'Acompañamiento Profesional' },
            ].map((badge, index) => (
              <motion.div
                key={badge.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.4 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className="flex items-center gap-2 text-slate-300 glass px-4 py-2 rounded-full cursor-pointer hover:border-green-500/30 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <badge.icon className="w-4 h-4 text-green-500" />
                </motion.div>
                <span className="text-sm">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator Removed as requested */}

      {/* Bottom Gradient Fade Removed to allow global background to show through */}
    </section>
  );
}
