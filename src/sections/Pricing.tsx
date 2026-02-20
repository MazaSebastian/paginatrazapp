import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X, Users, Building2, User, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal } from '@/components/TextReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Perfecto para gestión de cultivo personal',
    icon: User,
    monthlyPrice: 6250,
    yearlyPrice: 45000,
    popular: false,
    features: [
      { text: 'Modulo de cultivo', included: true },
      { text: 'Gestion de esquejes', included: true },
      { text: 'Stock', included: true },
      { text: 'Gestion de Madres', included: true },
      { text: 'Dispositivos IoT', included: false },
      { text: 'Modulo Médico', included: false },
      { text: 'Seguimiento de Pacientes', included: false },
      { text: 'Modulo de Dispensario', included: false },
      { text: 'Modulo de Laboratorio', included: false },
      { text: 'Modulo de Extracciones/Resinas', included: false },
      { text: 'Modulo de Aceites', included: false },
      { text: 'Insumos', included: false },
      { text: 'Gastos', included: false },
      { text: 'Gestión de Socios', included: false },
      { text: 'Métricas', included: false },
    ],
    cta: 'Iniciar Prueba Gratis',
    ctaVariant: 'outline' as const,
    highlight: 'Ideal para comenzar',
  },
  {
    id: 'team',
    name: 'Equipo',
    description: 'Para clubes y colectivos',
    icon: Users,
    monthlyPrice: 115000 / 12,
    yearlyPrice: 70000,
    popular: true,
    features: [
      { text: 'Modulo de cultivo', included: true },
      { text: 'Gestion de esquejes', included: true },
      { text: 'Stock', included: true },
      { text: 'Gestion de Madres', included: true },
      { text: 'Dispositivos IoT', included: true },
      { text: 'Modulo Médico', included: false },
      { text: 'Seguimiento de Pacientes', included: false },
      { text: 'Modulo de Dispensario', included: false },
      { text: 'Modulo de Laboratorio', included: false },
      { text: 'Modulo de Extracciones/Resinas', included: true },
      { text: 'Modulo de Aceites', included: true },
      { text: 'Insumos', included: true },
      { text: 'Gastos', included: true },
      { text: 'Gestión de Socios', included: false },
      { text: 'Métricas', included: false },
    ],
    cta: 'Iniciar Prueba Gratis',
    ctaVariant: 'default' as const,
    highlight: 'Recomendado',
  },
  {
    id: 'ngo',
    name: 'ONG / Club',
    description: 'Especializado para cumplimiento REPROCANN',
    icon: Building2,
    monthlyPrice: 220000 / 12,
    yearlyPrice: 150000,
    popular: false,
    features: [
      { text: 'Modulo de cultivo', included: true },
      { text: 'Gestion de esquejes', included: true },
      { text: 'Stock', included: true },
      { text: 'Gestion de Madres', included: true },
      { text: 'Dispositivos IoT', included: true },
      { text: 'Modulo Médico', included: true },
      { text: 'Seguimiento de Pacientes', included: true },
      { text: 'Modulo de Dispensario', included: true },
      { text: 'Modulo de Laboratorio', included: true },
      { text: 'Modulo de Extracciones/Resinas', included: true },
      { text: 'Modulo de Aceites', included: true },
      { text: 'Insumos', included: true },
      { text: 'Gastos', included: true },
      { text: 'Gestión de Socios', included: true },
      { text: 'Métricas', included: true },
    ],
    cta: 'Contactar Ventas',
    ctaVariant: 'outline' as const,
    highlight: 'Para organizaciones',
  },
];

// Pricing Card Component with enhanced animations
function PricingCard({
  plan,
  isYearly,
  index
}: {
  plan: typeof plans[0];
  isYearly: boolean;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className={`relative ${plan.popular ? 'z-20' : 'z-10'}`}
    >
      <TiltCard tiltAmount={plan.popular ? 5 : 3} scale={1.01}>
        <div
          className={`relative rounded-2xl overflow-hidden ${plan.popular
            ? 'border-2 border-emerald-500/50 shadow-emerald-lg shadow-2xl'
            : 'border border-white/10'
            }`}
        >
          {/* Popular Badge */}
          {plan.popular && (
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-emerald-600 py-2 text-center z-20"
              initial={{ y: -40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <span className="text-sm font-medium text-white flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                Más Popular
              </span>
            </motion.div>
          )}

          <div className={`glass p-6 ${plan.popular ? 'pt-14' : ''} relative overflow-hidden`}>
            {/* Glow effect for popular */}
            {plan.popular && (
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Plan Header */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-emerald-500/20' : 'bg-white/5'
                  }`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-emerald-400' : 'text-zinc-400'}`} />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-zinc-500">{plan.description}</p>
              </div>
            </div>

            {/* Highlight text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-emerald-400 mb-4"
            >
              {plan.highlight}
            </motion.p>

            {/* Price with animation */}
            <div className="mb-6 relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-zinc-500 text-lg">$</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={price}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl font-bold text-white"
                  >
                    <AnimatedCounter value={price} duration={1.5} />
                  </motion.span>
                </AnimatePresence>
                <span className="text-zinc-500">/{isYearly ? 'año' : 'mes'}</span>
              </div>
              {isYearly && (
                <motion.p
                  className="text-sm text-emerald-400 mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Ahorra ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString('es-AR')}/año
                </motion.p>
              )}
            </div>

            {/* CTA Button with enhanced hover */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10"
            >
              <Button
                className={`w-full mb-6 relative overflow-hidden group ${plan.popular
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-emerald-500/50'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {plan.popular && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.span>
                  )}
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: '-200%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 0.8 }}
                />
              </Button>
            </motion.div>

            {/* Features List with hover effects */}
            <div className="space-y-3 relative z-10">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Funciones incluidas
              </p>
              {plan.features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{
                      scale: hoveredFeature === i ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-zinc-600" />
                      </div>
                    )}
                  </motion.div>
                  <span className={`text-sm transition-colors ${feature.included
                    ? 'text-zinc-300'
                    : 'text-zinc-600'
                    } ${hoveredFeature === i && feature.included ? 'text-emerald-300' : ''}`}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="relative py-32 overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1 rounded-full glass text-emerald-400 text-sm font-medium mb-4"
          >
            💎 Precios Simples
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            <TextReveal delay={0.2} stagger={0.03}>
              Elige tu Plan
            </TextReveal>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8"
          >
            Desde cultivadores individuales hasta grandes ONGs, tenemos un plan que se adapta a tus necesidades
            y garantiza cumplimiento total con las regulaciones.
          </motion.p>

          {/* Billing Toggle with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.span
              className={`text-sm transition-colors ${!isYearly ? 'text-white' : 'text-zinc-500'}`}
              animate={{ scale: !isYearly ? 1.1 : 1 }}
            >
              Mensual
            </motion.span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-emerald-500"
            />
            <motion.span
              className={`text-sm transition-colors ${isYearly ? 'text-white' : 'text-zinc-500'}`}
              animate={{ scale: isYearly ? 1.1 : 1 }}
            >
              Anual
            </motion.span>
            <motion.span
              className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ahorra 20%
            </motion.span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center text-zinc-500 text-sm mt-12"
        >
          Todos los planes incluyen 14 días de prueba gratuita. No se requiere tarjeta de crédito.
        </motion.p>
      </div>
    </section>
  );
}
