import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Cpu,
  FileText,
  Shield,
  BarChart3,
  Zap,
  Lock,
  Globe,
  Clock,
  TrendingUp,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal } from '@/components/TextReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const features = [
  {
    id: 1,
    title: 'Integración IoT',
    description: 'Conecta sensores, monitores y controladores para seguimiento ambiental en tiempo real. Compatible con dispositivos Tuya, Arduino y Raspberry Pi.',
    icon: Cpu,
    size: 'large',
    gradient: 'from-emerald-500/20 to-emerald-700/10',
    stats: [
      { label: 'Dispositivos', value: 50, suffix: '+' },
      { label: 'Latencia', value: 100, suffix: 'ms', prefix: '<' },
    ],
  },
  {
    id: 2,
    title: 'Reportes PDF',
    description: 'Genera informes profesionales de cumplimiento con un clic. Exporta historiales de lotes, resultados de laboratorio y trazabilidad de auditoría.',
    icon: FileText,
    size: 'medium',
    gradient: 'from-blue-500/20 to-blue-700/10',
  },
  {
    id: 3,
    title: 'Cumplimiento REPROCANN',
    description: 'Herramientas integradas para regulaciones argentinas. Documentación automática y gestión de pacientes.',
    icon: Shield,
    size: 'medium',
    gradient: 'from-purple-500/20 to-purple-700/10',
    badge: 'Argentina',
  },
  {
    id: 4,
    title: 'Análisis Avanzado',
    description: 'Rastrea patrones de crecimiento, predice rendimientos y optimiza tu cultivo con información de aprendizaje automático.',
    icon: BarChart3,
    size: 'large',
    gradient: 'from-amber-500/20 to-amber-700/10',
    chart: true,
  },
  {
    id: 5,
    title: 'Alertas en Tiempo Real',
    description: 'Recibe notificaciones instantáneas cuando los parámetros se salgan de los rangos óptimos.',
    icon: Bell,
    size: 'small',
    gradient: 'from-red-500/20 to-red-700/10',
  },
  {
    id: 6,
    title: 'Datos Seguros',
    description: 'Encriptación de extremo a extremo con verificación blockchain para trazabilidad de auditoría.',
    icon: Lock,
    size: 'small',
    gradient: 'from-cyan-500/20 to-cyan-700/10',
  },
  {
    id: 7,
    title: 'Acceso Global',
    description: 'Monitorea tus cultivos desde cualquier parte del mundo.',
    icon: Globe,
    size: 'small',
    gradient: 'from-indigo-500/20 to-indigo-700/10',
  },
  {
    id: 8,
    title: 'Monitoreo 24/7',
    description: 'El seguimiento continuo nunca duerme.',
    icon: Clock,
    size: 'small',
    gradient: 'from-pink-500/20 to-pink-700/10',
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

  const sizeClasses = {
    small: 'md:col-span-1 md:row-span-1',
    medium: 'md:col-span-1 md:row-span-2',
    large: 'md:col-span-2 md:row-span-2',
  };

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
      className={`relative group ${sizeClasses[feature.size as keyof typeof sizeClasses]}`}
      style={{ perspective: '1000px' }}
    >
      <TiltCard tiltAmount={8} scale={1.02}>
        <div
          className={`h-full glass rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-500 overflow-hidden bg-gradient-to-br ${feature.gradient} relative`}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
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
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              {feature.badge && (
                <motion.span
                  className="px-2 py-1 rounded-full bg-white/10 text-xs text-white/80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {feature.badge}
                </motion.span>
              )}
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              </motion.div>
            </div>

            {/* Title & Description */}
            <motion.h3
              className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors"
            >
              {feature.title}
            </motion.h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-grow group-hover:text-zinc-300 transition-colors">
              {feature.description}
            </p>

            {/* Stats (for large cards) */}
            {feature.stats && (
              <div className="flex gap-6 mt-4 pt-4 border-t border-white/10">
                {feature.stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-white">
                      {stat.prefix}
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                    </div>
                    <div className="text-xs text-zinc-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Chart Visualization (for analytics card) */}
            {feature.chart && (
              <div className="mt-4 pt-4">
                <div className="flex items-end gap-1.5 h-24">
                  {[35, 55, 40, 70, 50, 85, 65, 90, 75, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${height}%` } : {}}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + i * 0.05,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="flex-1 rounded-t bg-emerald-500/40 hover:bg-emerald-400/60 transition-colors cursor-pointer relative group/bar"
                    >
                      {/* Tooltip */}
                      <motion.div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap"
                      >
                        {height}%
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                  <span>Ene</span>
                  <span>Oct</span>
                </div>
              </div>
            )}
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
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px]"
      />

      {/* Connected particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
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
          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-block px-4 py-1 rounded-full glass text-emerald-400 text-sm font-medium mb-4"
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>{' '}
            Funciones Poderosas
          </motion.span>

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
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Un conjunto completo de herramientas diseñadas para el cultivo moderno de cannabis,
            desde el seguimiento de semillas hasta los informes de cumplimiento.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 lg:gap-6 auto-rows-min">
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
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium">¿Listo para comenzar?</span>
            </motion.div>
            <motion.a
              href="#pricing"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
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
