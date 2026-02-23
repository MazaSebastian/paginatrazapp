import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X, Users, Building2, User, Sparkles, ArrowRight, Zap, Sprout, Stethoscope, Briefcase, Microscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TiltCard } from '@/components/TiltCard';
import { TextReveal } from '@/components/TextReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Perfecto para gestión de cultivo personal',
    icon: User,
    monthlyPrice: 45000,
    yearlyPrice: 380,
    popular: false,
    categories: [
      {
        name: 'Módulo de Cultivo',
        icon: Sprout,
        features: [
          { text: 'Gestión Integral', included: true },
          { text: 'Esquejes y Clones', included: true },
          { text: 'Control de Madres', included: true },
          { text: 'Gestión de Stock', included: true },
          { text: 'Dispositivos IoT', included: false },
        ]
      },
      {
        name: 'Módulo Médico & Dispensario',
        icon: Stethoscope,
        features: [
          { text: 'Historias Clínicas', included: false },
          { text: 'Seguimiento de Pacientes', included: false },
          { text: 'Gestión de Dispensario', included: false },
          { text: 'Recetas Médicas', included: false },
        ]
      },
      {
        name: 'Módulo de Laboratorio',
        icon: Microscope,
        features: [
          { text: 'Seguimiento Lab', included: false },
          { text: 'Extracciones y Resinas', included: false },
          { text: 'Elaboración de Aceites', included: false },
        ]
      },
      {
        name: 'Módulo Administrativo',
        icon: Briefcase,
        features: [
          { text: 'Control de Insumos', included: false },
          { text: 'Registro de Gastos', included: false },
          { text: 'Gestión de Socios', included: false },
          { text: 'Métricas y Reportes', included: false },
        ]
      }
    ],
    cta: 'Contactar Ventas',
    ctaVariant: 'outline' as const,
    highlight: 'Ideal para comenzar',
  },
  {
    id: 'team',
    name: 'Equipo',
    description: 'Para clubes y colectivos',
    icon: Users,
    monthlyPrice: 80000,
    yearlyPrice: 650,
    popular: true,
    categories: [
      {
        name: 'Módulo de Cultivo',
        icon: Sprout,
        features: [
          { text: 'Gestión Integral', included: true },
          { text: 'Esquejes y Clones', included: true },
          { text: 'Control de Madres', included: true },
          { text: 'Gestión de Stock', included: true },
          { text: 'Dispositivos IoT', included: true },
        ]
      },
      {
        name: 'Módulo Médico & Dispensario',
        icon: Stethoscope,
        features: [
          { text: 'Historias Clínicas', included: false },
          { text: 'Seguimiento de Pacientes', included: false },
          { text: 'Gestión de Dispensario', included: false },
          { text: 'Recetas Médicas', included: false },
        ]
      },
      {
        name: 'Módulo de Laboratorio',
        icon: Microscope,
        features: [
          { text: 'Seguimiento Lab', included: false },
          { text: 'Extracciones y Resinas', included: false },
          { text: 'Elaboración de Aceites', included: false },
        ]
      },
      {
        name: 'Módulo Administrativo',
        icon: Briefcase,
        features: [
          { text: 'Control de Insumos', included: true },
          { text: 'Registro de Gastos', included: true },
          { text: 'Gestión de Socios', included: true },
          { text: 'Métricas y Reportes', included: true },
        ]
      }
    ],
    cta: 'Contactar Ventas',
    ctaVariant: 'default' as const,
    highlight: 'Recomendado',
  },
  {
    id: 'ngo',
    name: 'ONG / Club',
    description: 'Especializado para cumplimiento REPROCANN',
    icon: Building2,
    monthlyPrice: 160000,
    yearlyPrice: 1100,
    popular: false,
    categories: [
      {
        name: 'Módulo de Cultivo',
        icon: Sprout,
        features: [
          { text: 'Gestión Integral', included: true },
          { text: 'Esquejes y Clones', included: true },
          { text: 'Control de Madres', included: true },
          { text: 'Gestión de Stock', included: true },
          { text: 'Dispositivos IoT', included: true },
        ]
      },
      {
        name: 'Módulo Médico & Dispensario',
        icon: Stethoscope,
        features: [
          { text: 'Historias Clínicas', included: true },
          { text: 'Seguimiento de Pacientes', included: true },
          { text: 'Gestión de Dispensario', included: true },
          { text: 'Recetas Médicas', included: true },
        ]
      },
      {
        name: 'Módulo de Laboratorio',
        icon: Microscope,
        features: [
          { text: 'Seguimiento Lab', included: true },
          { text: 'Extracciones y Resinas', included: true },
          { text: 'Elaboración de Aceites', included: true },
        ]
      },
      {
        name: 'Módulo Administrativo',
        icon: Briefcase,
        features: [
          { text: 'Control de Insumos', included: true },
          { text: 'Registro de Gastos', included: true },
          { text: 'Gestión de Socios', included: true },
          { text: 'Métricas y Reportes', included: true },
        ]
      }
    ],
    cta: 'Contactar Ventas',
    ctaVariant: 'outline' as const,
    highlight: 'Para organizaciones',
  },
];

// Lightweight native accordion for mobile to prevent Framer Motion lag
function MobileFeatureAccordionItem({ category, isCategoryDisabled }: { category: typeof plans[0]['categories'][0], isCategoryDisabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-white/5 rounded-lg px-3 glass overflow-hidden ${isCategoryDisabled ? 'opacity-60 grayscale border-transparent' : 'border-green-500/10'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
      >
        <div className={`flex items-center gap-2 ${isCategoryDisabled ? 'text-slate-500' : 'text-slate-200'}`}>
          <category.icon className={`w-4 h-4 ${isCategoryDisabled ? 'text-slate-500' : 'text-green-400'}`} />
          {category.name}
        </div>
        <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
            <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] pb-3' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-1">
            {category.features.map((feature, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${feature.included ? 'bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-slate-800'
                  }`}>
                  {feature.included ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <X className="w-3 h-3 text-slate-600" />
                  )}
                </div>
                <span className={`text-xs ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pricing Card Component with enhanced animations
function PricingCard({
  plan,
  isYearly,
  index,
  isMobile
}: {
  plan: typeof plans[0];
  isYearly: boolean;
  index: number;
  isMobile: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

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
            ? 'border-2 border-green-500/50 shadow-green-lg shadow-2xl'
            : 'border border-white/5'
            }`}
        >
          {/* Popular Badge */}
          {plan.popular && (
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 py-2 text-center z-20"
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
                    'radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Plan Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-3 mb-4 relative z-10 text-center md:text-left">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-green-500/20' : 'bg-white/5'
                  }`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-green-400' : 'text-slate-400'}`} />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500">{plan.description}</p>
              </div>
            </div>

            {/* Highlight text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-green-400 mb-4 text-center md:text-left"
            >
              {plan.highlight}
            </motion.p>

            {/* Price with animation */}
            <div className="mb-6 relative z-10 flex justify-center md:justify-start">
              <div className="flex items-baseline gap-1">
                <span className="text-slate-500 text-lg">{isYearly ? 'U$S' : '$'}</span>
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
                <span className="text-slate-500">/{isYearly ? 'año' : 'mes'}</span>
              </div>
            </div>

            {/* CTA Button with enhanced hover */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10"
            >
              <Link to={`/register?plan=${plan.id}`} className="block w-full">
                <Button
                  className={`w-full mb-6 relative overflow-hidden group ${plan.popular
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-green-500/50'
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
              </Link>
            </motion.div>

            {/* Features List with Accordion */}
            <div className="space-y-4 relative z-10">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 text-center md:text-left">
                Funciones por Módulo
              </p>
              {isMobile ? (
                <div className="w-full space-y-4">
                  {plan.categories.map((category, i) => {
                    const isCategoryDisabled = category.features.every(f => !f.included);
                    return (
                      <MobileFeatureAccordionItem
                        key={i}
                        category={category}
                        isCategoryDisabled={isCategoryDisabled}
                      />
                    );
                  })}
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {plan.categories.map((category, i) => {
                    const isCategoryDisabled = category.features.every(f => !f.included);
                    return (
                      <AccordionItem
                        value={`item-${i}`}
                        key={i}
                        className={`border border-white/5 rounded-lg px-3 glass overflow-hidden transition-all duration-300 ${isCategoryDisabled
                          ? 'opacity-60 grayscale data-[state=open]:border-slate-700/50'
                          : 'data-[state=open]:border-green-500/30'
                          }`}
                      >
                        <AccordionTrigger className={`hover:no-underline py-3 px-1 text-sm transition-colors ${isCategoryDisabled
                          ? 'text-slate-500 hover:text-slate-400'
                          : 'text-slate-300 hover:text-white'
                          }`}>
                          <div className="flex items-center gap-2">
                            <category.icon className={`w-4 h-4 ${isCategoryDisabled ? 'text-slate-500' : 'text-green-400'}`} />
                            {category.name}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-2 space-y-3">
                          {category.features.map((feature, j) => (
                            <div key={j} className="flex items-center gap-3 group">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${feature.included
                                ? 'bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                                : 'bg-slate-800'
                                }`}>
                                {feature.included ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <X className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                              <span className={`text-xs transition-all duration-300 ${feature.included
                                ? 'group-hover:translate-x-1 text-slate-300 group-hover:text-green-300'
                                : 'text-slate-600'
                                }`}>
                                {feature.text}
                              </span>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="relative py-32 overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated glow orbs */}
      {!isMobile && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px]"
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
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
            className="text-slate-400 text-lg max-w-2xl mx-auto mb-8"
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
              className={`text-sm transition-colors ${!isYearly ? 'text-white' : 'text-slate-500'}`}
              animate={{ scale: !isYearly ? 1.1 : 1 }}
            >
              Mensual
            </motion.span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-green-500"
            />
            <motion.span
              className={`text-sm transition-colors ${isYearly ? 'text-white' : 'text-slate-500'}`}
              animate={{ scale: isYearly ? 1.1 : 1 }}
            >
              Anual
            </motion.span>
            <motion.span
              className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium"
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
              isMobile={isMobile}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
