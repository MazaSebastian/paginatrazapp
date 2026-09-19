import { useState, useEffect } from 'react'
import { 
  Wifi, 
  Database, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Sprout, 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  X,
  Gauge
} from 'lucide-react'

export interface GrowyScreenProps {
  mode: 'face' | 'sense'
  onToggleMode: () => void
  alertActive?: boolean
  alertMessage?: string
  telemetry: {
    temp: number
    hum: number
    vpd: number
    soilMoisture: number
    plantsCount: number
  }
}

// 5 Genéticas reales documentadas en la pantalla física de la sala B2
export interface StrainInfo {
  name: string
  shortName: string
  count: number
  percent: number
  color: string
  badgeColor: string
}

const STRAINS: Record<string, StrainInfo> = {
  'Monkey Mintz x Toronja': {
    name: 'Monkey Mintz x Toronja',
    shortName: 'Monkey Mintz',
    count: 3,
    percent: 11.1,
    color: '#06b6d4', // cyan-500
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  'Peanut Butter Breath': {
    name: 'Peanut Butter Breath',
    shortName: 'Peanut Butter',
    count: 4,
    percent: 14.8,
    color: '#c084fc', // purple-400
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  'CBD Charlottes Angel': {
    name: 'CBD Charlottes Angel',
    shortName: 'CBD Charlotte',
    count: 7,
    percent: 25.9,
    color: '#10b981', // emerald-500
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  '010': {
    name: '010 (Reserva Genética)',
    shortName: '010',
    count: 12,
    percent: 44.4,
    color: '#38bdf8', // sky-400
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  },
  'White Widow': {
    name: 'White Widow IBL',
    shortName: 'White Widow',
    count: 1,
    percent: 3.7,
    color: '#f59e0b', // amber-500
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  }
}

export function GrowyScreenContent({
  mode,
  onToggleMode,
  alertActive = false,
  alertMessage = 'PARÁMETROS AMBIENTALES FUERA DE RANGO',
  telemetry
}: GrowyScreenProps) {
  const [blink, setBlink] = useState(false)
  const [activeTab, setActiveTab] = useState<'lote' | 'mapa' | 'resumen'>('lote')
  const [selectedStrainFilter, setSelectedStrainFilter] = useState<string | 'ALL'>('ALL')
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState('16:32:30')
  const [showIncidenceModal, setShowIncidenceModal] = useState(false)
  const [incidenceRegistered, setIncidenceRegistered] = useState(false)

  // Reloj en tiempo real idéntico al firmware de Waveshare
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toTimeString().split(' ')[0])
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Animación natural de parpadeo de ojos en modo Rostro
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 160)
    }, 3600)
    return () => clearInterval(blinkInterval)
  }, [])

  // Modelo de 27 plantas en Cama B2 (3 filas x 9 columnas = 27 plantas exactas)
  const plants = [
    // Fila A (9 plantas)
    { id: 'A1', row: 'A', col: 1, strain: 'White Widow', vwc: 41.5, rootTemp: 20.4, status: 'optimal' },
    { id: 'A2', row: 'A', col: 2, strain: 'Peanut Butter Breath', vwc: 42.0, rootTemp: 20.5, status: 'optimal' },
    { id: 'A3', row: 'A', col: 3, strain: 'Peanut Butter Breath', vwc: alertActive ? 21.8 : 39.4, rootTemp: 20.8, status: alertActive ? 'dry' : 'optimal' },
    { id: 'A4', row: 'A', col: 4, strain: 'Peanut Butter Breath', vwc: 43.1, rootTemp: 20.3, status: 'optimal' },
    { id: 'A5', row: 'A', col: 5, strain: 'Monkey Mintz x Toronja', vwc: 40.8, rootTemp: 20.6, status: 'optimal' },
    { id: 'A6', row: 'A', col: 6, strain: 'Monkey Mintz x Toronja', vwc: 42.4, rootTemp: 20.5, status: 'optimal' },
    { id: 'A7', row: 'A', col: 7, strain: 'Monkey Mintz x Toronja', vwc: 41.2, rootTemp: 20.7, status: 'optimal' },
    { id: 'A8', row: 'A', col: 8, strain: 'CBD Charlottes Angel', vwc: 43.8, rootTemp: 20.4, status: 'optimal' },
    { id: 'A9', row: 'A', col: 9, strain: 'CBD Charlottes Angel', vwc: 40.2, rootTemp: 20.5, status: 'optimal' },
    
    // Fila B (9 plantas)
    { id: 'B1', row: 'B', col: 1, strain: 'CBD Charlottes Angel', vwc: 44.1, rootTemp: 20.3, status: 'optimal' },
    { id: 'B2', row: 'B', col: 2, strain: 'CBD Charlottes Angel', vwc: alertActive ? 24.6 : 41.0, rootTemp: 20.9, status: alertActive ? 'warning' : 'optimal' },
    { id: 'B3', row: 'B', col: 3, strain: 'CBD Charlottes Angel', vwc: 42.7, rootTemp: 20.5, status: 'optimal' },
    { id: 'B4', row: 'B', col: 4, strain: 'CBD Charlottes Angel', vwc: 39.5, rootTemp: 20.6, status: 'optimal' },
    { id: 'B5', row: 'B', col: 5, strain: 'CBD Charlottes Angel', vwc: 40.6, rootTemp: 20.4, status: 'optimal' },
    { id: 'B6', row: 'B', col: 6, strain: '010', vwc: 42.1, rootTemp: 20.5, status: 'optimal' },
    { id: 'B7', row: 'B', col: 7, strain: '010', vwc: 43.4, rootTemp: 20.3, status: 'optimal' },
    { id: 'B8', row: 'B', col: 8, strain: '010', vwc: 39.8, rootTemp: 20.6, status: 'optimal' },
    { id: 'B9', row: 'B', col: 9, strain: '010', vwc: 41.3, rootTemp: 20.4, status: 'optimal' },
    
    // Fila C (9 plantas)
    { id: 'C1', row: 'C', col: 1, strain: '010', vwc: 41.0, rootTemp: 20.5, status: 'optimal' },
    { id: 'C2', row: 'C', col: 2, strain: '010', vwc: 40.2, rootTemp: 20.6, status: 'optimal' },
    { id: 'C3', row: 'C', col: 3, strain: '010', vwc: 42.8, rootTemp: 20.4, status: 'optimal' },
    { id: 'C4', row: 'C', col: 4, strain: '010', vwc: 42.0, rootTemp: 20.5, status: 'optimal' },
    { id: 'C5', row: 'C', col: 5, strain: '010', vwc: 41.5, rootTemp: 20.4, status: 'optimal' },
    { id: 'C6', row: 'C', col: 6, strain: '010', vwc: 44.0, rootTemp: 20.3, status: 'optimal' },
    { id: 'C7', row: 'C', col: 7, strain: '010', vwc: 41.8, rootTemp: 20.5, status: 'optimal' },
    { id: 'C8', row: 'C', col: 8, strain: '010', vwc: 40.5, rootTemp: 20.6, status: 'optimal' },
    { id: 'C9', row: 'C', col: 9, strain: 'Peanut Butter Breath', vwc: 42.9, rootTemp: 20.4, status: 'optimal' },
  ]

  const selectedPlant = selectedPlantId ? plants.find(p => p.id === selectedPlantId) : null

  return (
    <div 
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-full h-full bg-[#050811] text-slate-100 font-mono select-none overflow-hidden flex flex-col justify-between p-2.5 relative border border-emerald-500/25 rounded-md"
      style={{
        boxShadow: alertActive 
          ? 'inset 0 0 45px rgba(225,29,72,0.35)' 
          : 'inset 0 0 45px rgba(16,185,129,0.18)'
      }}
    >
      {/* Scanline CRT overlay sutil (estilo monitor industrial Waveshare) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)',
          backgroundSize: '100% 3px'
        }}
      />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MODO A: ROSTRO IA CIBERNÉTICO (STANDBY INTERACTIVO)          */}
      {/* ──────────────────────────────────────────────────────────── */}
      {mode === 'face' ? (
        <div 
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onToggleMode()
          }}
          className="flex-1 flex flex-col justify-between relative z-10 cursor-pointer group"
          title="Hacé clic en la pantalla para abrir TRAZAPP SENSE"
        >
          {/* Top Bar Minimalista */}
          <div className="flex items-center justify-between text-[11px] tracking-wider px-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${alertActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className={alertActive ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {alertActive ? 'CRITICAL ALERT' : 'GROWY IA • ONLINE'}
              </span>
              <span className="text-slate-500 text-[10px] hidden sm:inline">| SALA B2</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <span>{currentTime}</span>
            </div>
          </div>

          {/* Ojos Cibernéticos de Growy (Proporciones Perfectas sin Desborde) */}
          <div className="flex flex-col items-center justify-center my-auto py-1">
            {alertActive && (
              <div className="mb-2 text-[10px] text-rose-300 font-bold bg-rose-500/20 border border-rose-500/40 px-3 py-0.5 rounded-full animate-pulse">
                [!] {alertMessage}
              </div>
            )}

            <div className="flex items-center gap-14 sm:gap-16 my-1">
              {/* Ojo Izquierdo */}
              <div 
                className={`w-14 sm:w-16 rounded-3xl transition-all duration-150 relative overflow-hidden flex items-center justify-center shadow-2xl ${
                  blink ? 'h-1.5' : 'h-16 sm:h-20'
                } ${
                  alertActive
                    ? 'bg-gradient-to-b from-rose-500 to-red-600 shadow-[0_0_40px_rgba(244,63,94,0.9)]'
                    : 'bg-gradient-to-b from-cyan-300 via-emerald-400 to-teal-500 shadow-[0_0_40px_rgba(45,212,191,0.85)]'
                }`}
              >
                {!blink && (
                  <div className="w-4 h-4 rounded-full bg-white/95 shadow-[0_0_10px_white] absolute top-2.5 right-2.5" />
                )}
              </div>

              {/* Ojo Derecho */}
              <div 
                className={`w-14 sm:w-16 rounded-3xl transition-all duration-150 relative overflow-hidden flex items-center justify-center shadow-2xl ${
                  blink ? 'h-1.5' : 'h-16 sm:h-20'
                } ${
                  alertActive
                    ? 'bg-gradient-to-b from-rose-500 to-red-600 shadow-[0_0_40px_rgba(244,63,94,0.9)]'
                    : 'bg-gradient-to-b from-cyan-300 via-emerald-400 to-teal-500 shadow-[0_0_40px_rgba(45,212,191,0.85)]'
                }`}
              >
                {!blink && (
                  <div className="w-4 h-4 rounded-full bg-white/95 shadow-[0_0_10px_white] absolute top-2.5 right-2.5" />
                )}
              </div>
            </div>

            {/* Prompt de interacción táctil */}
            <div className="mt-2 text-[10.5px] text-slate-300 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5 bg-white/[0.06] hover:bg-emerald-500/20 px-3.5 py-1 rounded-full border border-white/15">
              <span>Tocá la pantalla para abrir</span>
              <span className="text-emerald-400 font-bold">TRAZAPP SENSE</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Telemetría inferior compacta (Sin recortar ni colapsar) */}
          <div className="grid grid-cols-5 gap-1.5 pt-1.5 border-t border-white/[0.1] text-center text-[10px]">
            <div className="bg-black/50 rounded p-1 border border-white/5">
              <div className="text-slate-400 text-[9px]">TEMP</div>
              <div className="font-bold text-emerald-300 text-[11px]">{telemetry.temp.toFixed(1)}°C</div>
            </div>
            <div className="bg-black/50 rounded p-1 border border-white/5">
              <div className="text-slate-400 text-[9px]">HUM</div>
              <div className="font-bold text-teal-300 text-[11px]">{telemetry.hum.toFixed(1)}%</div>
            </div>
            <div className="bg-black/50 rounded p-1 border border-white/5">
              <div className="text-slate-400 text-[9px]">VPD</div>
              <div className={`font-bold text-[11px] ${telemetry.vpd < 0.7 || telemetry.vpd > 1.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {telemetry.vpd.toFixed(2)}k
              </div>
            </div>
            <div className="bg-black/50 rounded p-1 border border-white/5">
              <div className="text-slate-400 text-[9px]">SUELO</div>
              <div className="font-bold text-cyan-300 text-[11px]">{telemetry.soilMoisture.toFixed(0)}%</div>
            </div>
            <div className="bg-black/50 rounded p-1 border border-white/5">
              <div className="text-slate-400 text-[9px]">PLANTAS</div>
              <div className="font-bold text-amber-300 text-[11px]">{telemetry.plantsCount}</div>
            </div>
          </div>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────── */
        /* MODO B: TRAZAPP SENSE OS (RÉPLICA EXACTA DE LA WAVESHARE)     */
        /* ──────────────────────────────────────────────────────────── */
        <div className="flex-1 flex flex-col justify-between relative z-10 text-[11px]">
          {/* Header Bar Industrial (Idéntica a growy-photo-screen.jpg) */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.12]">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleMode()
                }}
                className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white cursor-pointer font-bold text-[10px] flex items-center gap-1 transition-all select-none active:scale-95"
                title="Volver a los ojos de Growy"
              >
                <span>👁️</span>
                <span>ROSTRO</span>
              </button>
              <span className="font-bold text-cyan-400 text-[12px] tracking-wide drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                TRAZAPP SENSE
              </span>
            </div>

            {/* Selector de Pestañas (Tabs) con hit area amplia y stopPropagation */}
            <div 
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-black/75 p-1 rounded-lg border border-white/20 shadow-inner"
            >
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('lote')
                  setSelectedPlantId(null)
                }}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1 ${
                  activeTab === 'lote' 
                    ? 'bg-cyan-400 text-black shadow-md font-extrabold ring-1 ring-cyan-300' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🧬</span>
                <span>INFO LOTE</span>
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('mapa')
                }}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1 ${
                  activeTab === 'mapa' 
                    ? 'bg-emerald-400 text-black shadow-md font-extrabold ring-1 ring-emerald-300' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🗺️</span>
                <span>MAPA PLANTAS</span>
              </button>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab('resumen')
                  setSelectedPlantId(null)
                }}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer select-none active:scale-95 flex items-center gap-1 ${
                  activeTab === 'resumen' 
                    ? 'bg-teal-400 text-black shadow-md font-extrabold ring-1 ring-teal-300' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>📊</span>
                <span>AMBIENTE</span>
              </button>
            </div>

            {/* Estado Superior Derecho */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-slate-400">{currentTime}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded text-[9.5px]">
                <Wifi className="w-2.5 h-2.5" />
                <span>ONLINE</span>
              </span>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* VISTA 1: INFO DE LOTE (RÉPLICA FOTO REAL CON DONUT CHART)      */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'lote' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="font-bold text-slate-200">DISTRIBUCIÓN DE GENÉTICAS | SALA B2</span>
                <span className="text-emerald-400 font-bold">27 PLANTAS (100% SALA B2)</span>
              </div>

              {/* Grid Central: Donut Chart a la izquierda, Desglose a la derecha */}
              <div className="grid grid-cols-12 gap-3 items-center my-auto py-1">
                {/* Donut Chart SVG de 27 Plantas */}
                <div className="col-span-4 flex flex-col items-center justify-center relative">
                  <svg className="w-28 h-28 transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                    {/* Anillo base */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                    
                    {/* 010 (44.4%) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" strokeWidth="12"
                      strokeDasharray="238.76" strokeDashoffset={238.76 * (1 - 0.444)} strokeLinecap="round" />
                    
                    {/* CBD Charlotte (25.9%) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12"
                      strokeDasharray="238.76" strokeDashoffset={238.76 * (1 - 0.259)} 
                      transform="rotate(160 50 50)" />
                    
                    {/* Peanut Butter (14.8%) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#c084fc" strokeWidth="12"
                      strokeDasharray="238.76" strokeDashoffset={238.76 * (1 - 0.148)} 
                      transform="rotate(253 50 50)" />
                    
                    {/* Monkey Mintz (11.1%) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="12"
                      strokeDasharray="238.76" strokeDashoffset={238.76 * (1 - 0.111)} 
                      transform="rotate(306 50 50)" />

                    {/* White Widow (3.7%) */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="12"
                      strokeDasharray="238.76" strokeDashoffset={238.76 * (1 - 0.037)} 
                      transform="rotate(346 50 50)" />
                  </svg>

                  {/* Texto central del Donut (27 PLANTAS / 100%) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[16px] font-extrabold text-white leading-none">27</span>
                    <span className="text-[7.5px] text-emerald-300 font-bold uppercase">Plantas</span>
                    <span className="text-[6.5px] text-slate-400">100% Cama B2</span>
                  </div>
                </div>

                {/* Lista con las 5 Genéticas reales y sus barras de progreso */}
                <div className="col-span-8 flex flex-col gap-1 pr-1">
                  {Object.values(STRAINS).map((s) => (
                    <div 
                      key={s.name}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStrainFilter(s.name)
                        setActiveTab('mapa')
                      }}
                      className="group flex flex-col bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] p-1 rounded border border-white/5 hover:border-white/20 transition-all cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-between text-[9px] mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-slate-200 font-medium truncate group-hover:text-white">{s.name}</span>
                        </div>
                        <span className="text-slate-400 text-[8.5px] font-mono flex-shrink-0 ml-1">
                          {s.count} pl. <span className="font-bold text-slate-200">({s.percent.toFixed(1)}%)</span>
                        </span>
                      </div>
                      {/* Barra de progreso de la genética */}
                      <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${s.percent}%`, backgroundColor: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer de acción rápida */}
              <div className="pt-1 border-t border-white/[0.08] flex items-center justify-between text-[9.5px]">
                <span className="text-slate-400">Trazabilidad criptográfica conectada a TrazAPP Cloud</span>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTab('mapa')
                  }}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[9.5px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-emerald-500/25"
                >
                  <span>🗺️ VER EN MAPA INTERACTIVO</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* VISTA 2: MAPA DE PLANTAS (FEATURE ESTRELLA - 3x9 GRILLA B2)  */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'mapa' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
              {/* Filtro superior de cepas */}
              <div className="flex items-center justify-between pb-1 text-[9px]">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedStrainFilter('ALL')
                    }}
                    className={`px-2 py-0.5 rounded text-[8.5px] font-bold cursor-pointer transition-all active:scale-95 ${
                      selectedStrainFilter === 'ALL' 
                        ? 'bg-emerald-400 text-black font-extrabold shadow-sm' 
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    TODAS (27)
                  </button>
                  {Object.values(STRAINS).map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStrainFilter(s.name)
                      }}
                      className={`px-2 py-0.5 rounded text-[8.5px] font-medium cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                        selectedStrainFilter === s.name 
                          ? 'text-black font-bold shadow-sm' 
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: selectedStrainFilter === s.name ? s.color : undefined
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span>{s.shortName}</span>
                    </button>
                  ))}
                </div>
                <span className="text-slate-400 text-[8px] hidden sm:inline">Tocá una planta para ver datos</span>
              </div>

              {/* Grilla 3x9: Cama B2 (27 Plantas) */}
              <div className="grid grid-cols-9 gap-1 my-auto">
                {plants.map((p) => {
                  const strainData = STRAINS[p.strain] || STRAINS['010']
                  const isFiltered = selectedStrainFilter !== 'ALL' && selectedStrainFilter !== p.strain
                  const isSelected = selectedPlantId === p.id

                  let statusBorder = 'border-white/10 hover:border-emerald-400'
                  let bgGlow = 'bg-black/40'

                  if (p.status === 'dry') {
                    statusBorder = 'border-rose-500 animate-pulse ring-1 ring-rose-500/50'
                    bgGlow = 'bg-rose-950/40'
                  } else if (p.status === 'warning') {
                    statusBorder = 'border-amber-500 ring-1 ring-amber-500/40'
                    bgGlow = 'bg-amber-950/30'
                  } else if (isSelected) {
                    statusBorder = 'border-emerald-400 ring-2 ring-emerald-400/60'
                    bgGlow = 'bg-emerald-950/50'
                  }

                  return (
                    <div
                      key={p.id}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlantId(isSelected ? null : p.id)
                      }}
                      className={`p-1 rounded-md border flex flex-col items-center justify-between text-center transition-all cursor-pointer select-none ${bgGlow} ${statusBorder} ${
                        isFiltered ? 'opacity-25 scale-95' : 'opacity-100 hover:scale-105 active:scale-90'
                      }`}
                    >
                      {/* Cabecera de celda: ID + Color de cepa */}
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[8px] font-bold text-white leading-none">{p.id}</span>
                        <span 
                          className="w-2 h-2 rounded-full border border-white/30" 
                          style={{ backgroundColor: strainData.color }}
                          title={p.strain}
                        />
                      </div>

                      {/* Lectura de humedad VWC de la planta */}
                      <div className="my-0.5">
                        <span className={`text-[7.5px] font-mono font-bold leading-none ${
                          p.status === 'dry' ? 'text-rose-400' : p.status === 'warning' ? 'text-amber-300' : 'text-slate-300'
                        }`}>
                          {p.vwc.toFixed(0)}%
                        </span>
                      </div>

                      {/* Micro barra de estado */}
                      <div className="w-full bg-black/60 h-0.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${Math.min(100, (p.vwc / 45) * 100)}%`,
                            backgroundColor: p.status === 'dry' ? '#f43f5e' : strainData.color
                          }} 
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Fila inferior: Detalle de la planta clickeada o resumen de cama */}
              <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[9px]">
                {selectedPlant ? (
                  <div className="flex items-center justify-between w-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-[10px]">[{selectedPlant.id}]</span>
                      <span className="text-white font-medium">{selectedPlant.strain}</span>
                      <span className="text-slate-400">| Suelo: <strong className="text-emerald-300">{selectedPlant.vwc}% VWC</strong></span>
                      <span className="text-slate-400">| Radicular: <strong className="text-cyan-300">{selectedPlant.rootTemp}°C</strong></span>
                    </div>
                    <button 
                      onClick={() => setSelectedPlantId(null)}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>Cama B2: <strong className="text-white">Living Soil</strong></span>
                      <span>•</span>
                      <span>Riego: <strong className="text-emerald-400">Goteo Automatizado</strong></span>
                    </div>
                    <div className="text-[8.5px] text-emerald-400 font-bold">
                      27 / 27 SENSORES SINCRONIZADOS
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* VISTA 3: RESUMEN AMBIENTAL (TELEMETRÍA DE SALA)               */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'resumen' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span className="font-bold text-slate-200">TELEMETRÍA EN TIEMPO REAL • SALA B2</span>
                <span className="text-teal-400 font-bold">SONDA MULTISENSOR ACTIVA</span>
              </div>

              {/* Tarjetas de Telemetría (6 Parámetros Clave) */}
              <div className="grid grid-cols-3 gap-2 my-auto py-1">
                {/* Temp */}
                <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[8.5px] flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-emerald-400" />
                      <span>TEMPERATURA</span>
                    </div>
                    <div className="text-[14px] font-bold text-emerald-300 font-mono mt-0.5">
                      {telemetry.temp.toFixed(1)} °C
                    </div>
                    <div className="text-[7.5px] text-slate-500">Rango: 18 - 24 °C</div>
                  </div>
                </div>

                {/* Humedad */}
                <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[8.5px] flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-teal-400" />
                      <span>HUMEDAD REL.</span>
                    </div>
                    <div className="text-[14px] font-bold text-teal-300 font-mono mt-0.5">
                      {telemetry.hum.toFixed(1)} %
                    </div>
                    <div className="text-[7.5px] text-slate-500">Rango: 60 - 70 %</div>
                  </div>
                </div>

                {/* VPD */}
                <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[8.5px] flex items-center gap-1">
                      <Wind className="w-3 h-3 text-cyan-400" />
                      <span>VPD CANOPIA</span>
                    </div>
                    <div className={`text-[14px] font-bold font-mono mt-0.5 ${
                      telemetry.vpd < 0.7 || telemetry.vpd > 1.5 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {telemetry.vpd.toFixed(2)} kPa
                    </div>
                    <div className="text-[7.5px] text-slate-500">Objetivo: 0.8 - 1.2</div>
                  </div>
                </div>

                {/* Suelo VWC */}
                <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[8.5px] flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-amber-400" />
                      <span>SUELO VWC</span>
                    </div>
                    <div className="text-[14px] font-bold text-cyan-300 font-mono mt-0.5">
                      {telemetry.soilMoisture.toFixed(0)} %
                    </div>
                    <div className="text-[7.5px] text-slate-500">Living Soil B2</div>
                  </div>
                </div>

                {/* CO2 */}
                <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[8.5px] flex items-center gap-1">
                      <Activity className="w-3 h-3 text-sky-400" />
                      <span>DIÓXIDO CO2</span>
                    </div>
                    <div className="text-[14px] font-bold text-sky-300 font-mono mt-0.5">
                      840 ppm
                    </div>
                    <div className="text-[7.5px] text-slate-500">Inyección Controlada</div>
                  </div>
                </div>

                {/* Luz PPFD */}
                <div className="bg-black/50 p-1.5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-[8.5px] flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-yellow-400" />
                      <span>LUZ PPFD</span>
                    </div>
                    <div className="text-[14px] font-bold text-yellow-300 font-mono mt-0.5">
                      750 µmol
                    </div>
                    <div className="text-[7.5px] text-slate-500">LED Bar 720W</div>
                  </div>
                </div>
              </div>

              {/* Botón de Incidencia / Firma */}
              <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between">
                <div className="text-[9px] text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Sincronizado vía protocolo MCP con TrazAPP</span>
                </div>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowIncidenceModal(true)
                    setTimeout(() => {
                      setIncidenceRegistered(true)
                      setTimeout(() => {
                        setShowIncidenceModal(false)
                        setIncidenceRegistered(false)
                      }, 1800)
                    }, 1200)
                  }}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[9.5px] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md shadow-emerald-500/25"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>REGISTRAR TAREA / INCIDENCIA</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal rápido de firma de incidencia */}
          {showIncidenceModal && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 text-center rounded">
              {!incidenceRegistered ? (
                <>
                  <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <div className="text-[11px] font-bold text-white">Sincronizando con TrazAPP Cloud...</div>
                  <div className="text-[9px] text-slate-400">Firmando Hash con clave criptográfica de Sala B2</div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                  <div className="text-[11px] font-bold text-emerald-300">¡Incidencia Registrada con Éxito!</div>
                  <div className="text-[9px] text-slate-400">Foliada en Ledger Supabase vía MCP</div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
