import { useState } from 'react'
import { motion } from 'framer-motion'
import { SplitText } from '@/components/ui/SplitText'
import { Check, ArrowRight, ShieldCheck } from 'lucide-react'
import { SpecularButton } from '@/components/ui/SpecularButton'

interface PricingProps {
  onOpenDemo: () => void
}

export function Pricing({ onOpenDemo }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  const plans = [
    {
      name: 'Club Inicial',
      tagline: 'Para clubes emergentes y proyectos de cultivo de hasta 50 socios.',
      monthlyPrice: '$85.000',
      annualPrice: '$68.000',
      period: '/mes',
      highlighted: false,
      features: [
        'Hasta 50 socios registrados con carnet',
        '2 Salas de cultivo con telemetría IoT',
        'Validación de QR REPROCANN en dispensario',
        'Control estricto de cupo legal (40g/mes)',
        'Trazabilidad por lotes (clon a curado)',
        'Soporte técnico por WhatsApp',
      ],
      cta: 'Comenzar con Club Inicial',
    },
    {
      name: 'Asociación Profesional',
      tagline: 'El estándar elegido por las principales asociaciones cannábicas de Argentina.',
      monthlyPrice: '$165.000',
      annualPrice: '$132.000',
      period: '/mes',
      highlighted: true,
      badge: 'MÁS ELEGIDO',
      features: [
        'Hasta 150 socios registrados',
        'Salas de cultivo y secado ilimitadas',
        'Validación y retiro de cupo en dispensario',
        'Gestión formal de aportes societarios y caja',
        'Pasaporte genético con Hash SHA-256',
        'Generación de Libro Foliado ARICCAME / INASE',
        'Integración con balanzas de pesaje e impresoras',
        'Onboarding y migración guiada sin costo',
      ],
      cta: 'Solicitar Demostración',
    },
    {
      name: 'Productor Industrial & Redes',
      tagline: 'Para productores a gran escala, laboratorios y federaciones multi-sede.',
      monthlyPrice: 'Personalizado',
      annualPrice: 'Personalizado',
      period: '',
      highlighted: false,
      features: [
        'Socios y pacientes ilimitados',
        'Arquitectura Multi-Sede y Multi-Dispensario',
        'Integración con ERPs y sistemas contables propios',
        'Calibración de sensores IoT in-situ',
        'SLA 99.9% de disponibilidad garantizada',
        'Asesoría técnica y legal regulatoria dedicada',
        'Servidor dedicado y backup cada 6 horas',
      ],
      cta: 'Hablar con Especialista Enterprise',
    }
  ]

  return (
    <section id="precios" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight flex flex-wrap items-center justify-center gap-x-2">
          <SplitText
            text="Planes a la medida del crecimiento de"
            tag="span"
            className="text-white"
            delay={24}
            duration={0.6}
            splitType="chars"
            from={{ opacity: 0, y: 35 }}
            to={{ opacity: 1, y: 0 }}
            rootMargin="-50px"
          />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 inline-block"
          >
            tu asociación
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-base sm:text-lg text-slate-400"
        >
          Sin comisiones sobre las cuotas de tus socios. Migración guiada desde Excel o sistemas antiguos incluida.
        </motion.p>

        {/* Toggle Mensual / Anual */}
        <div className="mt-8 inline-flex items-center bg-[#0b121e] p-1.5 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Facturación Mensual
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Pago Anual</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase">
              20% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Grid de Planes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice
          return (
            <div
              key={plan.name}
              className={`p-7 sm:p-8 rounded-3xl flex flex-col items-center text-center justify-between relative transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-[#091322]/95 border-2 border-emerald-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.2)] lg:-translate-y-2'
                  : 'bg-[#090e18]/80 border border-white/[0.08] hover:border-emerald-500/30'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="w-full flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-white mb-1 text-center">{plan.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed text-center max-w-xs mx-auto">{plan.tagline}</p>

                {/* Precio */}
                <div className="flex items-baseline justify-center gap-1 mb-6 pb-6 border-b border-white/[0.08] w-full text-center">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    {price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-slate-400 font-semibold">{plan.period}</span>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8 w-full max-w-sm flex flex-col items-center">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-center gap-2.5 text-xs text-slate-300 text-center">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full flex flex-col items-center justify-center">
                <SpecularButton
                  size="md"
                  radius={16}
                  tint={plan.highlighted ? '#059669' : '#0f172a'}
                  tintOpacity={1}
                  textColor="#ffffff"
                  lineColor={plan.highlighted ? '#6ee7b7' : '#10b981'}
                  baseColor={plan.highlighted ? '#047857' : '#1e293b'}
                  intensity={1.3}
                  shineSize={20}
                  shineFade={45}
                  thickness={1.5}
                  speed={0.4}
                  followMouse
                  proximity={220}
                  onClick={onOpenDemo}
                  className={`w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer ${
                    plan.highlighted
                      ? 'shadow-lg shadow-emerald-600/30'
                      : 'border border-white/10 hover:border-emerald-500/40'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </SpecularButton>

                <div className="mt-3 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sin costo de instalación inicial</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
