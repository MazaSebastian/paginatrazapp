import { motion } from 'framer-motion'
import { SplitText } from '@/components/ui/SplitText'
import { X, Check, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react'
import { SpecularButton } from '@/components/ui/SpecularButton'

interface ComparisonSectionProps {
  onOpenDemo: () => void
}

export function ComparisonSection({ onOpenDemo }: ComparisonSectionProps) {
  const comparisonData = [
    {
      feature: 'Monitoreo de Cultivo y Climatización',
      traditional: 'Termohigrómetros manuales anotados en papel. Si el extractor o aire se corta de noche, se pierde toda la producción sin aviso.',
      trazapp: 'Telemetría IoT Mesh 24/7 con cálculo dinámico de VPD y alertas automáticas a WhatsApp al detectar cualquier anomalía térmica o lumínica.'
    },
    {
      feature: 'Validación Legal REPROCANN',
      traditional: 'Fichas impresas o fotos de carnet vencidas en WhatsApp, exponiendo al club a sanciones penales por entregas indebidas.',
      trazapp: 'Lector de QR en tiempo real con bloqueo automático si el socio tiene el registro vencido o si supera los 40g mensuales establecidos por ley.'
    },
    {
      feature: 'Cadena de Custodia & Pasaporte de Lote',
      traditional: 'Pérdida de la genealogía de la planta madre. Imposibilidad de demostrar ante INASE / ARICCAME el origen varietal del cannabis.',
      trazapp: 'Pasaporte genético digital con Hash criptográfico SHA-256 inalterable: desde el esqueje y nutrición hasta el perfil terpénico de flor seca.'
    },
    {
      feature: 'Cobro de Cuotas y Cuotas Societarias',
      traditional: 'Cobros caóticos en efectivo, planillas de Excel desactualizadas y socios que retiran sin estar al día con su aporte.',
      trazapp: 'Cobranza automatizada con Mercado Pago. Envío automático de enlaces de pago por WhatsApp y conciliación bancaria instantánea.'
    },
    {
      feature: 'Auditorías e Inspecciones Oficiales',
      traditional: 'Días enteros de pánico buscando cuadernos y facturas para presentar balances y libros de cultivo ante inspecciones.',
      trazapp: 'Exportación en 1 clic del Libro Foliado Oficial de Cultivo en formato PDF/Excel homologado según normativas vigentes.'
    },
    {
      feature: 'Gestión de Retiro & Dispensario',
      traditional: 'El teléfono del cultivador o presidente colapsado de mensajes a deshoras y planillas manuales de entrega propensas a errores.',
      trazapp: 'Terminal de dispensario con validación de carnet REPROCANN en tiempo real, control estricto de cupo legal y emisión de remitos digitales.'
    }
  ]

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight flex flex-wrap items-center justify-center gap-x-2">
          <SplitText
            text="¿Por qué los clubes líderes migran a"
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 inline-block"
          >
            TrazAPP OS?
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-base sm:text-lg text-slate-400"
        >
          Descubrí la diferencia entre gestionar tu cultivo a ciegas con cuadernos y planillas vs. operar con un estándar biotecnológico blindado.
        </motion.p>
      </div>

      {/* Tarjeta Comparativa Doble */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* ── COLUMNA: GESTIÓN TRADICIONAL ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101c]/70 border border-rose-500/20 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-500/20">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Gestión Manual / Planillas</h3>
                <span className="text-xs text-rose-400 font-semibold">Vulnerable, caótico y con alto riesgo legal</span>
              </div>
            </div>

            <div className="space-y-6">
              {comparisonData.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="p-1 rounded-full bg-rose-500/15 text-rose-400 shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{item.feature}</div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.traditional}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-rose-500/15 text-center text-xs text-slate-500">
            Pérdida promedio estimada: hasta 35% de producción por desvíos ambientales y descontrol de stock.
          </div>
        </div>

        {/* ── COLUMNA: TRAZAPP CLOUD OS ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1526]/90 border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)]">
          {/* Subtle top badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md">
            ESTÁNDAR BIO-PHARMA
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">TrazAPP Enterprise OS</h3>
                <span className="text-xs text-emerald-400 font-semibold">Trazabilidad total, IoT automatizado y cumplimiento legal</span>
              </div>
            </div>

            <div className="space-y-6">
              {comparisonData.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">{item.feature}</div>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">{item.trazapp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-emerald-300 font-semibold text-center sm:text-left">
              Tranquilidad operativa y respaldo institucional garantizado.
            </div>
            <SpecularButton
              size="sm"
              radius={14}
              tint="#059669"
              tintOpacity={1}
              textColor="#ffffff"
              lineColor="#6ee7b7"
              baseColor="#047857"
              intensity={1.3}
              shineSize={18}
              shineFade={40}
              thickness={1.5}
              speed={0.4}
              followMouse
              proximity={200}
              onClick={onOpenDemo}
              className="px-5 py-2.5 shadow-md shadow-emerald-600/20 cursor-pointer w-full sm:w-auto"
            >
              <span className="font-bold text-xs flex items-center gap-1.5">
                Migrar a TrazAPP
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </SpecularButton>
          </div>
        </div>

      </div>
    </section>
  )
}
