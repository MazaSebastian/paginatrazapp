import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sprout, Sun, Flower2, FlaskConical, Microscope, Check } from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const stages = [
  {
    id: 1,
    title: 'Germinación/Clones',
    description: 'Estandarización genética y seguimiento del crecimiento inicial.',
    icon: Sprout,
    color: '#10B981',
    details: ['Gestion de lotes', 'Control de tasa de efectividad', 'Asignación de ID único'],
  },
  {
    id: 2,
    title: 'Vegetativo',
    description: 'Reflejo digital de tu sala en tiempo real. Gestión centralizada de nutrición, sanidad y tareas preventivas con respaldo de datos IoT.',
    icon: Sun,
    color: '#34D399',
    details: ['Integración de sensores IoT', 'Seguimiento de nutrientes', 'Análisis de crecimiento'],
  },
  {
    id: 3,
    title: 'Floración',
    description: 'Registro para la planificación de cosecha. Gestión de cronogramas de floración y monitoreo de indicadores de madurez para maximizar el rendimiento terapéutico.',
    icon: Flower2,
    color: '#6EE7B7',
    details: ['Perfilado de cannabinoides', 'Optimización de cosecha', 'Métricas de calidad'],
  },
  {
    id: 4,
    title: 'Analisis de rendimiento',
    description: 'Consolidación del historial completo del ciclo de vida, auditoría de rendimiento y control de calidad post-producción.',
    icon: FlaskConical,
    color: '#A7F3D0',
    details: ['Documentación de procesos', 'Seguimiento de lotes', 'Análisis de rendimiento'],
  },
  {
    id: 5,
    title: 'Resultados de laboratorio',
    description: 'Control de calidad orientado al paciente. Integración de analíticas de terceros para el seguimiento terapéutico, asegurando la consistencia química necesario en cada entrega del tratamiento.',
    icon: Microscope,
    color: '#D1FAE5',
    details: ['Integración de COA', 'Verificación de potencia', 'Cumplimiento de seguridad'],
  },
];

// SVG Path Animation Component
function AnimatedPath({ progress }: { progress: any }) {
  const pathLength = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 hidden lg:block">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 4 1000"
        preserveAspectRatio="none"
      >
        {/* Background Path with glow */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M2 0 L2 1000"
          stroke="rgba(16, 185, 129, 0.1)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Animated Progress Path */}
        <motion.path
          d="M2 0 L2 1000"
          stroke="url(#gradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ pathLength }}
        />
      </svg>

      {/* Animated glow dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400"
        style={{
          top: useTransform(progress, [0, 1], ['0%', '100%']),
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)',
        }}
      />
    </div>
  );
}

// Stage Card Component with enhanced animations
function StageCard({
  stage,
  index,
  totalStages,
  globalProgress,
  isReversed,
  isActive,
  onClick
}: {
  stage: typeof stages[0];
  index: number;
  totalStages: number;
  globalProgress: any;
  isReversed: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Calculate trigger point based on index (centered in 5 segments: 10%, 30%, 50%, 70%, 90%)
  const triggerPoint = (index + 0.5) / totalStages;

  // Create responsive values based on global scroll progress
  // Window of +/- 10% around the trigger point
  const scale = useTransform(
    globalProgress,
    [triggerPoint - 0.1, triggerPoint, triggerPoint + 0.1],
    [1, 1.1, 1]
  );

  const highlightOpacity = useTransform(
    globalProgress,
    [triggerPoint - 0.1, triggerPoint, triggerPoint + 0.1],
    [0, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isReversed ? 100 : -100, rotateY: isReversed ? 15 : -15 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className={`relative flex items-center gap-8 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
      style={{ perspective: '1000px', scale }}
    >
      {/* Scroll Highlight Overlay - Subtle Glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl blur-xl -z-10 bg-emerald-500/10"
        style={{
          opacity: highlightOpacity,
        }}
      />

      {/* Content Card */}
      <div className={`flex-1 ${isReversed ? 'lg:text-right' : ''}`}>
        <TiltCard tiltAmount={5} scale={1.01}>
          <motion.div
            onClick={onClick}
            className={`glass rounded-2xl p-6 border transition-all duration-500 cursor-pointer group relative ${isActive
              ? 'border-emerald-500/50 shadow-emerald-lg'
              : 'border-white/10 hover:border-emerald-500/30'
              }`}
            whileHover={{ y: -5 }}
          >
            {/* Scroll Highlight Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-emerald-400/50 pointer-events-none"
              style={{ opacity: highlightOpacity }}
            />

            {/* Header */}
            <div className={`flex items-center gap-4 mb-4 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: `${stage.color}20` }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <stage.icon className="w-6 h-6" style={{ color: stage.color }} />
              </motion.div>
              <div>
                <motion.span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: stage.color }}
                >
                  Etapa {stage.id}
                </motion.span>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {stage.title}
                </h3>
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-4 group-hover:text-zinc-300 transition-colors">
              {stage.description}
            </p>

            {/* Expandable details */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className={`space-y-2 pt-4 border-t border-white/10 ${isReversed ? 'lg:text-right' : ''}`}>
                    {stage.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        className={`flex items-center gap-2 text-xs text-zinc-400 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                        initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
                        >
                          <Check className="w-3 h-3 flex-shrink-0" style={{ color: stage.color }} />
                        </motion.div>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>


          </motion.div>
        </TiltCard>
      </div>

      {/* Center Node */}
      <div className="hidden lg:flex items-center justify-center relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.2, type: 'spring' }}
          className="relative z-10 cursor-pointer"
          onClick={onClick}
          style={{ scale }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full border-4 flex items-center justify-center"
            style={{
              borderColor: stage.color,
              backgroundColor: isActive ? stage.color : '#050505',
              boxShadow: isActive ? `0 0 30px ${stage.color}` : 'none'
            }}
            animate={isActive ? {
              boxShadow: [
                `0 0 20px ${stage.color}`,
                `0 0 40px ${stage.color}`,
                `0 0 20px ${stage.color}`,
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-bold" style={{ color: isActive ? '#050505' : stage.color }}>
              {stage.id}
            </span>
          </motion.div>

          {/* Pulse rings */}
          {isActive && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${stage.color}` }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${stage.color}` }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Scroll Highlight Ring */}
          <motion.div
            className="absolute inset-0 rounded-full -z-10 bg-white"
            style={{ opacity: highlightOpacity, scale: 2, filter: 'blur(10px)', backgroundColor: stage.color }}
          />
        </motion.div>
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden lg:block" />
    </motion.div>
  );
}

export function TraceabilityTimeline() {
  const containerRef = useRef(null);
  const [activeStage, setActiveStage] = useState<number | null>(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section id="traceability" className="relative py-32 overflow-hidden">
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 grid-pattern opacity-30"
        style={{ y: backgroundY }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"
      />

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.span
            className="inline-block px-4 py-1 rounded-full glass text-emerald-400 text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            🌱 El Motor de Trazabilidad
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 cursor-default">
            <motion.span
              className="block mb-2"
              whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              Seguimiento completo
            </motion.span>
            <motion.span
              className="block text-gradient"
              whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              de principio a fin.
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Nuestro sistema de gestión y trazabilidad genética garantiza transparencia total y cumplimiento en cada paso del proceso de cultivo.
          </motion.p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Animated Path */}
          <AnimatedPath progress={scrollYProgress} />

          {/* Stage Cards */}
          <div className="space-y-16 lg:space-y-24">
            {stages.map((stage, index) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={index}
                totalStages={stages.length}
                globalProgress={scrollYProgress}
                isReversed={index % 2 === 1}
                isActive={activeStage === index}
                onClick={() => setActiveStage(activeStage === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: 100, suffix: '%', label: 'Trazabilidad' },
            { value: 5, suffix: '', label: 'Etapas de Crecimiento' },
            { value: 24, suffix: '/7', label: 'Monitoreo' },
            { value: 0, suffix: '', label: 'Brechas de Datos' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-xl p-6 text-center border border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer"
            >
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
