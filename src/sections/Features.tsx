import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Sprout,
  Stethoscope,
  Briefcase,
  TrendingUp,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal } from '@/components/TextReveal';

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

// Bento Card Component with enhanced animations
function BentoCard({
  feature,
  index
}: {
  feature: typeof features[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className={`relative group h-full md:col-span-1 md:row-span-1`}
      style={{ perspective: '1000px' }}
    >
      <TiltCard tiltAmount={8} scale={1.02}>
        <div
          className={`h-full glass rounded-2xl p-6 border border-white/5 hover:border-green-500/50 transition-all duration-500 overflow-hidden bg-gradient-to-br ${feature.gradient} relative`}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
            }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-4 gap-4 md:gap-0">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowUpRight className="w-5 h-5 text-green-400" />
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
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-[80px]"
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
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge Hidden as Requested */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            <TextReveal delay={0.2} stagger={0.03}>
              Todo lo que Necesitas
            </TextReveal>
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

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
          {features.map((feature, index) => (
            <BentoCard key={feature.id} feature={feature} index={index} />
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
