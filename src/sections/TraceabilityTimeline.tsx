import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sprout, Sun, Flower2, FlaskConical, Microscope, Check } from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import TrueFocus from '@/components/TrueFocus';
import { useIsMobile } from '@/hooks/use-mobile';

const stages = [
  {
    id: 1,
    title: 'Germinación/Clones',
    description: 'Estandarización genética y seguimiento del crecimiento inicial.',
    icon: Sprout,
    color: '#22C55E',
    details: ['Gestion de lotes', 'Control de tasa de efectividad', 'Asignación de ID único'],
  },
  {
    id: 2,
    title: 'Vegetativo',
    description: 'Reflejo digital de tu sala en tiempo real. Gestión centralizada de nutrición, sanidad y tareas preventivas con respaldo de datos IoT.',
    icon: Sun,
    color: '#4ADE80',
    details: ['Integración de sensores IoT', 'Seguimiento de nutrientes', 'Análisis de crecimiento'],
  },
  {
    id: 3,
    title: 'Floración',
    description: 'Registro para la planificación de cosecha. Gestión de cronogramas de floración y monitoreo de indicadores de madurez para maximizar el rendimiento terapéutico.',
    icon: Flower2,
    color: '#86EFAC',
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
    details: ['Carga de información cromatografíca', 'Analisis de Cannabinoides', 'Control de efectividad terapeutica'],
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
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#86EFAC" />
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
          stroke="rgba(34, 197, 94, 0.1)"
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
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-green-400"
        style={{
          top: useTransform(progress, [0, 1], ['0%', '100%']),
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)',
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
  const isMobile = useIsMobile();
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

  if (isMobile) {
    return (
      <div
        ref={ref}
        className={`relative flex items-center gap-8 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
      >
        {/* Scroll Highlight Overlay - Subtle Glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl blur-xl -z-10 bg-green-500/10"
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
                ? 'border-green-500/50 shadow-green-lg'
                : 'border-white/5 hover:border-green-500/30'
                }`}
              whileHover={{ y: -5 }}
            >
              {/* Scroll Highlight Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-green-400/50 pointer-events-none"
                style={{ opacity: highlightOpacity }}
              />

              {/* Header */}
              <div className={`flex flex-col lg:flex-row items-center gap-4 mb-4 text-center lg:text-left ${isReversed ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
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
                  <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                    {stage.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors text-center lg:text-left md:text-left px-2 lg:px-0">
                {stage.description}
              </p>

              {/* Expandable details - CSS driven for mobile performance */}
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <ul className={`space-y-3 lg:space-y-2 pt-4 border-t border-white/5 flex flex-col items-center lg:items-start ${isReversed ? 'lg:text-right lg:items-end' : ''}`}>
                    {stage.details.map((detail, i) => (
                      <li
                        key={i}
                        className={`flex items-center text-left lg:text-left gap-2 text-xs text-slate-400 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                      >
                        <div className="transform scale-100 transition-transform duration-300">
                          <Check className="w-3 h-3 flex-shrink-0" style={{ color: stage.color }} />
                        </div>
                        <span className="opacity-100 transition-opacity duration-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
                backgroundColor: isActive ? stage.color : '#0B1120',
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
              <span className="text-xs font-bold" style={{ color: isActive ? '#0B1120' : stage.color }}>
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
      </div>
    );
  }

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
        className="absolute inset-0 rounded-3xl blur-xl -z-10 bg-green-500/10"
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
              ? 'border-green-500/50 shadow-green-lg'
              : 'border-white/5 hover:border-green-500/30'
              }`}
            whileHover={{ y: -5 }}
          >
            {/* Scroll Highlight Border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-green-400/50 pointer-events-none"
              style={{ opacity: highlightOpacity }}
            />

            {/* Header */}
            <div className={`flex flex-col lg:flex-row items-center gap-4 mb-4 text-center lg:text-left ${isReversed ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
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
                <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                  {stage.title}
                </h3>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors text-center lg:text-left md:text-left px-2 lg:px-0">
              {stage.description}
            </p>

            {/* Expandable details - CSS driven for performance */}
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <ul className={`space-y-3 lg:space-y-2 pt-4 border-t border-white/5 flex flex-col items-center lg:items-start ${isReversed ? 'lg:text-right lg:items-end' : ''}`}>
                  {stage.details.map((detail, i) => (
                    <li
                      key={i}
                      className={`flex items-center text-left lg:text-left gap-2 text-xs text-slate-400 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                    >
                      <div className="transform scale-100 transition-transform duration-300">
                        <Check className="w-3 h-3 flex-shrink-0" style={{ color: stage.color }} />
                      </div>
                      <span className="opacity-100 transition-opacity duration-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
              backgroundColor: isActive ? stage.color : '#0B1120',
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
            <span className="text-xs font-bold" style={{ color: isActive ? '#0B1120' : stage.color }}>
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
  const isMobile = useIsMobile();
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
      {!isMobile && (
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]"
        />
      )}

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 cursor-default">
            <motion.span
              className="block mb-2"
              whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              Seguimiento completo de
            </motion.span>
            <motion.div
              className="flex justify-center text-white mt-4"
              whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              style={{ filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.2))" }}
            >
              <TrueFocus
                sentence="principio a fin."
                manualMode={false}
                blurAmount={5}
                borderColor="#29ff7b"
                animationDuration={0.8}
                pauseBetweenAnimations={2}
                ignoreWords={['a']}
              />
            </motion.div>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
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

    </section>
  );
}
