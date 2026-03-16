import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  Sprout,
  Stethoscope,
  Briefcase,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TiltCard } from '@/components/TiltCard';
import { AnimatedMockups } from '@/components/AnimatedMockups';

const features = [
  {
    id: 1,
    title: 'Módulo de Cultivo',
    description: 'Gestión integral agronómica. Trazabilidad por lotes, control de madres y esquejes, seguimiento de salas y genética, monitoreo ambiental y parametrización IoT.',
    icon: Sprout,
    gradient: 'from-green-500/20 to-green-700/10',
  },
  {
    id: 2,
    title: 'Módulo Médico / Dispensario',
    description: 'Panel enfocado en el paciente. Gestión de historias clínicas, recetas, control de stock y entregas para dispensarios, con pleno cumplimiento REPROCANN.',
    icon: Stethoscope,
    gradient: 'from-blue-500/20 to-blue-700/10',
  },
  {
    id: 3,
    title: 'Módulo Administrativo y Gestión',
    description: 'El centro de tu negocio. Reportes detallados, gestión de usuarios y roles, control financiero, métricas de rendimiento y trazabilidad completa de auditoría.',
    icon: Briefcase,
    gradient: 'from-indigo-500/20 to-indigo-700/10',
  },
];

// Bento Card Component with enhanced hover animations
function BentoCard({
  feature,
  index,
  isMobile
}: {
  feature: typeof features[0];
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  // Spotlight effect logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className="h-full relative group"
    >
      <TiltCard tiltAmount={isMobile ? 0 : 5} scale={isMobile ? 1 : 1.02} glareEnabled={!isMobile} className="h-full">
        <div
          onMouseMove={handleMouseMove}
          className={`h-full relative glass rounded-2xl p-6 lg:p-8 flex flex-col justify-start border border-white/5 hover:border-green-500/50 transition-colors duration-500 overflow-hidden bg-gradient-to-br ${feature.gradient}`}
        >
          {/* Spotlight Effect */}
          <motion.div
            className="absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 pointer-events-none"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  450px circle at ${mouseX}px ${mouseY}px,
                  rgba(34, 197, 94, 0.15),
                  transparent 80%
                )
              `,
            }}
          />

          {/* Animated background gradient fallback class */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-start mb-4 gap-4 md:gap-0">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Title & Description */}
            <motion.h3
              className="text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors text-center md:text-left"
            >
              {feature.title}
            </motion.h3>
            <p className="text-slate-400 text-base leading-relaxed flex-grow group-hover:text-slate-300 transition-colors text-center md:text-left">
              {feature.description}
            </p>

          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Features() {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section id="features" className="relative py-32 overflow-hidden" ref={sectionRef}>
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 grid-pattern opacity-30"
        style={{ y: backgroundY }}
      />

      {/* Floating Orbs with enhanced animation */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.10) 0%, rgba(34, 197, 94, 0.02) 50%, transparent 80%)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.10) 0%, rgba(22, 163, 74, 0.02) 50%, transparent 80%)',
        }}
      />

      {/* Connected particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-green-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimatedMockups />

        <div className="mt-24 md:mt-32" />

        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge Hidden as Requested */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Todo lo que Necesitas
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Un conjunto completo de herramientas diseñadas para el cultivo moderno de cannabis,
            desde el seguimiento de semillas hasta los informes de cumplimiento.
          </motion.p>
        </div>

        {/* Interactive Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-20">
          {features.map((feature, index) => (
            <BentoCard 
              key={feature.id} 
              feature={feature} 
              index={index} 
              isMobile={isMobile} 
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-4 glass rounded-full px-6 py-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="flex items-center gap-2"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">¿Listo para comenzar?</span>
            </motion.div>
            <motion.a
              href="#pricing"
              className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 transition-colors"
              whileHover={{ x: 5 }}
            >
              Ver Precios
              <TrendingUp className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
