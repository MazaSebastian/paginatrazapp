import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dna, 
  Sprout, 
  Flower2, 
  Scissors, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Hash
} from 'lucide-react'

interface BatchStage {
  id: number
  key: string
  title: string
  subtitle: string
  icon: any
  tag: string
  date: string
  operator: string
  metrics: { label: string; value: string }[]
  details: string
  certificateId: string
  hash: string
}

const BATCH_STAGES: BatchStage[] = [
  {
    id: 1,
    key: 'genetica',
    title: 'Genética & Clon Madre',
    subtitle: 'Preservación varietal y origen botánico',
    icon: Dna,
    tag: 'Origen Certificado',
    date: '14 Ene 2026',
    operator: 'Ing. Agr. Lucas Benítez (MP 4821)',
    certificateId: 'INASE-REG-2024-C91',
    hash: 'e89f4b029a1b18dc8e3f9402a7b6f3c1d9482710a',
    metrics: [
      { label: 'Variedad', value: 'Lemon Haze Fenotipo #04' },
      { label: 'Perfil Terpénico', value: 'Limoneno / Mirceno alto' },
      { label: 'Ratio Cannabinoide', value: '22:1 (THC:CBD)' },
      { label: 'Gen Madre ID', value: 'MDR-LMSH-04-A' }
    ],
    details: 'Selección clonal estabilizada con testeo PCR negativo para viroide latente del lúpulo (HLVd). ADN trazable a banco de germoplasma registrado.'
  },
  {
    id: 2,
    key: 'vegetativo',
    title: 'Arraigue & Fase Vegetativa',
    subtitle: 'Fotoperiodo 18/6 y desarrollo foliar',
    icon: Sprout,
    tag: 'Sala Alpha-1',
    date: '02 Feb 2026',
    operator: 'Cultivador Líder: Mariano Ross',
    certificateId: 'LOT-VEG-2026-08',
    hash: '3f7a8b11c94028fa1b98472a6c8e310d7a6b49e21',
    metrics: [
      { label: 'Ejemplares Vigorosos', value: '60 plantas' },
      { label: 'Sustrato', value: 'Living Soil Microbiótico' },
      { label: 'Conductividad (EC)', value: '1.4 mS/cm' },
      { label: 'Días de Ciclo', value: '28 días cumplidos' }
    ],
    details: 'Monitoreo constante de bio-nutrición foliar con extractos fermentados orgánicos. Poda apical estandarizada para uniformidad de canopia.'
  },
  {
    id: 3,
    key: 'floracion',
    title: 'Inducción & Floración',
    subtitle: 'Ciclo 12/12 y biosíntesis de tricomas',
    icon: Flower2,
    tag: 'Sala Beta-4 (LED)',
    date: '02 Mar 2026',
    operator: 'Ing. Agr. Lucas Benítez',
    certificateId: 'LOT-FLR-2026-19',
    hash: 'a1b7e930f84819c6e3b829471d0a5f82c6b48192a',
    metrics: [
      { label: 'Días en Floración', value: '63 días' },
      { label: 'PPFD Promedio', value: '980 µmol/m²s' },
      { label: 'Control Biológico', value: 'Ácaros Amblyseius sp.' },
      { label: 'Cero Plaguicidas', value: '100% Certificado' }
    ],
    details: 'Maduración monitored por microscopía óptica (85% tricomas lechosos, 15% ámbar). Lavado de raíces controlado con agua de ósmosis inversa.'
  },
  {
    id: 4,
    key: 'cosecha',
    title: 'Cosecha, Secado & Curado',
    subtitle: 'Deshidratación lenta a 18°C / 58% RH',
    icon: Scissors,
    tag: 'Cámara Clean-Room',
    date: '05 May 2026',
    operator: 'Responsable Lab: Camila Duarte',
    certificateId: 'LOT-DRY-2026-04',
    hash: '9482710ab6f3c1d3f7a8b11c94028fa1b98472a6c',
    metrics: [
      { label: 'Biomasa Fresca', value: '19.450 kg' },
      { label: 'Flores Manicuradas', value: '4.120 kg seco' },
      { label: 'Humedad Final de Flor', value: '11.4% de equilibrio' },
      { label: 'Actividad de Agua (aw)', value: '0.61 aw (Anti-hongo)' }
    ],
    details: 'Corte en frío, manicurado artesanal y secado oscuro de 16 días con estabilización en frascos farmacéuticos de vidrio con sellado hermético.'
  },
  {
    id: 5,
    key: 'certificacion',
    title: 'Lote Certificado & QR Final',
    subtitle: 'Liberación de lote para dispensario',
    icon: QrCode,
    tag: 'Listo para Dispensar',
    date: '25 May 2026',
    operator: 'Director Técnico Farmacéutico',
    certificateId: 'TRZ-AR-2026-8841',
    hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    metrics: [
      { label: 'Potencia THC', value: '20.4% w/w' },
      { label: 'CBD Total', value: '0.85% w/w' },
      { label: 'CBG & Terpenos', value: '3.1% bio-activos' },
      { label: 'Metales & Mohos', value: 'Ausente (HPLC)' }
    ],
    details: 'Lote oficialmente registrado en base de datos TrazAPP con código QR inalterable para validación de socios y autoridades de control (ARICCAME).'
  }
]

export function InteractiveBatchTracker() {
  const [selectedStageIndex, setSelectedStageIndex] = useState(4)
  const [isVerifying, setIsVerifying] = useState(false)

  const activeStage = BATCH_STAGES[selectedStageIndex]

  const handleVerifyHash = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
    }, 600)
  }

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-[#090e18]/90 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.12)] p-4 sm:p-7 text-white relative overflow-hidden">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg font-bold">
              LOTE ACTIVO: #TRZ-2026-LH04
            </span>
            <span className="text-xs text-slate-400">• Genética: Lemon Haze Elite</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Cadena de custodia criptográfica e historial genealógico inalterable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyHash}
            disabled={isVerifying}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verificando Hash...' : 'Firma Criptográfica Válida'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Progreso de Etapas (Pill Selector Interactivo) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-6">
        {BATCH_STAGES.map((stage, idx) => {
          const isSelected = selectedStageIndex === idx
          const Icon = stage.icon
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0f172a]/60 border-white/[0.06] hover:border-white/20 hover:bg-[#0f172a]'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="stage-indicator-bar"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  0{stage.id}.
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
              <div className="font-bold text-xs text-white truncate">{stage.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stage.tag}</div>
            </button>
          )
        })}
      </div>

      {/* Contenido Detallado de la Etapa Seleccionada */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Columna Izquierda: Especificaciones Técnicas */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-white/[0.08]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activeStage.title}</span>
                  <span className="text-xs font-normal text-slate-400">— {activeStage.subtitle}</span>
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[11px] font-mono font-semibold">
                  Cert: {activeStage.certificateId}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeStage.details}
              </p>

              {/* Métricas clave */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/[0.06]">
                {activeStage.metrics.map((metric, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/30 border border-white/[0.04]">
                    <div className="text-[10px] text-slate-400 font-medium">{metric.label}</div>
                    <div className="text-xs font-bold font-mono text-emerald-300 mt-0.5 truncate">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Responsable técnico y Timestamp */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Operador: {activeStage.operator}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Registro: {activeStage.date}</span>
                </div>
              </div>
            </div>

            {/* Hash Criptográfico Inviolable */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <Hash className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-[11px] font-mono text-slate-300 truncate">
                  <span className="text-slate-500">SHA256:</span> {activeStage.hash}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">
                INMUTABLE
              </span>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Certificación y QR Code */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0f172a]/90 border border-emerald-500/30 flex flex-col items-center text-center">
            <div className="p-3 bg-white rounded-2xl shadow-xl shadow-emerald-500/10 mb-4 group relative">
              {/* Representación visual de un código QR moderno de trazabilidad */}
              <div className="w-32 h-32 bg-white flex flex-col justify-between p-1.5 border border-slate-200 rounded-lg">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-4 border-slate-900 rounded-xs flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-900" />
                  </div>
                  <div className="w-8 h-8 border-4 border-slate-900 rounded-xs flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-900" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 bg-emerald-600 rounded-xs" />
                  <div className="w-2 h-2 bg-slate-900" />
                  <div className="w-3 h-3 bg-emerald-600" />
                  <div className="w-2 h-2 bg-slate-900" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 border-4 border-slate-900 rounded-xs flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-900" />
                  </div>
                  <div className="w-10 h-6 flex flex-wrap gap-0.5">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                    <div className="w-1.5 h-1.5 bg-emerald-600" />
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Pasaporte Digital de Lote
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
              Escaneable por inspectores de ARICCAME, directores médicos y socios del dispensario.
            </p>

            {/* Verificado REPROCANN ocultado */}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
