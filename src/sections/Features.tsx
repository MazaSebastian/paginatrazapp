import { useRef } from 'react'
import { 
  Sprout, 
  Stethoscope, 
  Briefcase, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react'

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="features" ref={containerRef} className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Diseñado específicamente para las exigencias del{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Cannabis Medicinal
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Un ecosistema cloud unificado que reemplaza múltiples programas desconectados, blindando la operación legal, agronómica y financiera de tu club.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: Agronomía y Lotes (Gran Card, col 7) */}
        <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[#090e18]/85 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none -mr-20 -mt-20" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                <Sprout className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Módulo Agronómico
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Gestión de Lotes, Genética & Madres
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mb-6">
              Controla cada planta desde la selección del clon madre hasta la cosecha. Registra podas, trasplantes, formulaciones bio-nutricionales y pesos húmedo/seco con precisión de laboratorio.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/[0.06] text-center">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.04]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Linaje</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">Árbol Genealógico</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.04]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Pasaporte</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">QR Inviolable</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.04]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Análisis</div>
              <div className="text-sm font-bold text-teal-400 font-mono mt-0.5">HPLC / Cannabinoides</div>
            </div>
          </div>
        </div>

        {/* Card 2: Validador REPROCANN (Col 5) */}
        <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#090e18]/85 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-400 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Dispensario & Ley
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Validación REPROCANN Blindada
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Lectura automática del código QR del carnet oficial. El sistema calcula los gramos retirados en el mes y bloquea de inmediato si se excede el cupo legal de 40g o si el trámite venció.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold text-white">0% Entregas fuera de norma</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Firma Digital
            </span>
          </div>
        </div>

        {/* Card 3: Telemetría IoT en Tiempo Real (Col 5) */}
        <div className="md:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#090e18]/85 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Hardware IoT
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Telemetría de Sala & Alertas IoT
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Sincronización continua de VPD, temperatura, humedad y fotoperiodo. Si un sensor detecta un pico térmico o corte de ventilación, TrazAPP te alerta al WhatsApp en menos de 2 segundos.
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/[0.04] text-xs font-mono">
            <span className="text-slate-400">Latencia de telemetría:</span>
            <span className="text-emerald-400 font-bold">&lt; 200 ms</span>
          </div>
        </div>

        {/* Card 4: Finanzas, Mercado Pago y Gobernanza (Col 7) */}
        <div className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-[#090e18]/85 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Gobernanza & Finanzas
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Cobro de Membresías & Libro Foliado
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mb-6">
              Automatiza la cobranza mensual de aportes solidarios con Mercado Pago sin comisiones intermedias. Exporta con un click los balances y actas oficiales requeridas por ARICCAME e INASE.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-5 border-t border-white/[0.06]">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.04]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Cobro Automático</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">Mercado Pago 0% Fee</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.04]">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Auditoría INASE</div>
              <div className="text-sm font-bold text-teal-400 font-mono mt-0.5">Libro Foliado PDF</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
