import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PhoneCall } from 'lucide-react'

interface FaqSectionProps {
  onOpenDemo: () => void
}

export function FaqSection({ onOpenDemo }: FaqSectionProps) {
  const faqs = [
    {
      q: '¿Cómo se garantiza la confidencialidad y privacidad médica de los socios?',
      a: 'TrazAPP implementa cifrado simétrico AES-256 de grado bancario para todas las historias clínicas y datos filiatorios sensibles. La base de datos opera bajo estricto cumplimiento de la Ley de Protección de Datos Personales (Ley 25.326) y las regulaciones del secreto médico. Solo los usuarios con rol médico o directivo autorizado pueden acceder a las prescripciones.'
    },
    {
      q: '¿Los reportes y libros foliados tienen validez legal ante ARICCAME e INASE?',
      a: 'Totalmente. El motor de exportación de TrazAPP genera actas de cultivo, balances de stock y remitos de entrega estructurados según los formatos exigidos en las inspecciones de la Agencia Regulatoria de la Industria del Cáñamo y del Cannabis Medicinal (ARICCAME) y el Instituto Nacional de Semillas (INASE).'
    },
    {
      q: '¿Qué sensores de cultivo son compatibles y qué ocurre si se corta internet?',
      a: 'TrazAPP es compatible con protocolos estándar industriales (Zigbee 3.0, WiFi y MQTT). Si tu sala de cultivo experimenta una caída de internet, la central IoT local continúa grabando en memoria interna hasta 72 horas de telemetría y ejecuta las rutinas de climatización de forma autónoma, subiendo los datos a la nube automáticamente cuando vuelve la conexión.'
    },
    {
      q: '¿TrazAPP retiene comisiones sobre las cuotas cobradas por Mercado Pago?',
      a: 'Cero comisión. La integración de pagos es directa entre la cuenta de Mercado Pago de tu asociación o club y tu cuenta bancaria. TrazAPP cobra únicamente el valor fijo del plan mensual contratado, sin porcentajes ocultos sobre la facturación de tus membresías.'
    },
    {
      q: '¿Cómo es el proceso de migración si hoy llevamos todo en Excel o cuadernos?',
      a: 'Contamos con un protocolo guiado de importación masiva de socios, números de trámite REPROCANN y stock inicial. Nuestro equipo de soporte técnico en Argentina te asiste paso a paso en una videollamada para que tu club comience a operar en menos de 48 horas sin perder ningún dato histórico.'
    }
  ]

  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Respuestas técnicas &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            normativas
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Todo lo que tu equipo directivo y legal necesita saber antes de implementar TrazAPP.
        </p>
      </div>

      <div className="bg-[#090e18]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="border-b border-white/[0.06] last:border-0 px-2 py-1"
            >
              <AccordionTrigger className="text-left text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-300 leading-relaxed pb-4 pt-1">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA Box Bottom */}
      <div className="mt-12 text-center p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <div className="font-bold text-sm text-white">¿Tenés una consulta específica sobre tu club?</div>
          <div className="text-xs text-slate-400 mt-0.5">Nuestro equipo técnico en Buenos Aires te responde en el día.</div>
        </div>
        <button
          onClick={onOpenDemo}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Consultar por WhatsApp</span>
        </button>
      </div>
    </section>
  )
}
