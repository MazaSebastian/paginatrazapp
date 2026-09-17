import { motion } from 'framer-motion'
import { 
  Bot, 
  CreditCard, 
  Cpu, 
  Scale, 
  Printer, 
  ShieldCheck 
} from 'lucide-react'

export function IntegracionesSection() {
  const integrations = [
    {
      category: 'Comunicaciones & IA',
      name: 'Meta Cloud WhatsApp API',
      description: 'Conexión oficial directa con Meta Business. Sin riesgo de bloqueo de línea ni intermediarios.',
      icon: Bot,
      badge: 'API Oficial Meta'
    },
    {
      category: 'Pasarela de Pagos',
      name: 'Mercado Pago (0% Comisión TrazAPP)',
      description: 'Cobro automatizado de cuotas societarias. El dinero ingresa 100% directo a la cuenta de tu club.',
      icon: CreditCard,
      badge: 'Cobro Directo'
    },
    {
      category: 'Hardware & Telemetría IoT',
      name: 'Sensores Zigbee 3.0 & MQTT',
      description: 'Compatibilidad con sensores de VPD, temperatura, humedad relativa, CO2 y humedad de sustrato.',
      icon: Cpu,
      badge: 'Mesh Industrial'
    },
    {
      category: 'Instrumental de Pesaje',
      name: 'Básculas & Balanzas Certificadas',
      description: 'Integración serial/USB con OHAUS, Systel y Mettler Toledo. Registro automático de peso sin tipeo manual.',
      icon: Scale,
      badge: 'Tara Automática'
    },
    {
      category: 'Rotulado & Trazabilidad Física',
      name: 'Impresoras Térmicas Zebra & Epson',
      description: 'Emisión instantánea de etiquetas resistentes a la humedad con código QR de lote para frascos y bandejas.',
      icon: Printer,
      badge: 'ESC/POS & ZPL'
    },
    {
      category: 'Homologación Institucional',
      name: 'Formatos INASE, ARICCAME & MinSalud',
      description: 'Generación de libros foliados de cultivo y actas de entrega compatibles con los formatos de auditoría.',
      icon: ShieldCheck,
      badge: 'Marco Normativo AR'
    }
  ]

  return (
    <section id="integraciones" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Integrado con el hardware y estándares{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            que ya utilizás
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          TrazAPP se sincroniza con tus sensores, balanzas, impresoras de rótulos y pasarelas de pago para crear un flujo operativo sin fricciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-3xl bg-[#090e18]/80 border border-white/[0.08] hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-white/5 text-slate-300 border border-white/10">
                    {item.badge}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                <span>Plug & Play • Sin setup complejo</span>
                <span className="text-emerald-400 font-mono">100% Conectado</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
