import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Timer,
  Power
} from 'lucide-react'

type RoomStage = 'veg' | 'flower' | 'dry'

interface StagePreset {
  name: string
  photoperiod: string
  targetTemp: number
  targetRh: number
  targetVpd: number
  targetPpfd: number
  co2: number
  lightStatus: string
  description: string
}

const PRESETS: Record<RoomStage, StagePreset> = {
  veg: {
    name: 'Vegetativo Acelerado',
    photoperiod: '18h Luz / 6h Noche',
    targetTemp: 25.4,
    targetRh: 68,
    targetVpd: 0.95,
    targetPpfd: 480,
    co2: 850,
    lightStatus: 'Ciclo Diurno Activo (75% Dimer)',
    description: 'Promueve desarrollo radicular expansivo y elongación controlada sin estrés hídrico.'
  },
  flower: {
    name: 'Floración Pico (Semana 6)',
    photoperiod: '12h Luz / 12h Noche',
    targetTemp: 23.2,
    targetRh: 45,
    targetVpd: 1.35,
    targetPpfd: 980,
    co2: 1250,
    lightStatus: 'Espectro Rojo Lejano Activo (100% Dimer)',
    description: 'Densificación de cálices, máxima síntesis de cannabinoides y prevención de botrytis.'
  },
  dry: {
    name: 'Secado Lento & Estabilización',
    photoperiod: '0h Luz / 24h Oscuridad',
    targetTemp: 18.2,
    targetRh: 58,
    targetVpd: 0.88,
    targetPpfd: 0,
    co2: 420,
    lightStatus: 'Oscuridad Absoluta',
    description: 'Curado bio-preservativo. Degradación de clorofila y conservación de terpenos volátiles.'
  }
}

export function InteractiveIoTRoom() {
  const [activeStage, setActiveStage] = useState<RoomStage>('flower')
  const [extractorOn, setExtractorOn] = useState(true)
  const [co2Injection, setCo2Injection] = useState(true)
  const [tempOffset, setTempOffset] = useState(0)
  const [alertTriggered, setAlertTriggered] = useState(false)

  const currentPreset = PRESETS[activeStage]
  const currentTemp = +(currentPreset.targetTemp + tempOffset).toFixed(1)
  const currentVpd = +(currentPreset.targetVpd + (tempOffset * 0.08)).toFixed(2)

  const isVpdOptimal = currentVpd >= 0.8 && currentVpd <= 1.5

  const triggerAnomaly = () => {
    setTempOffset(4.2)
    setAlertTriggered(true)
    setTimeout(() => {
      setExtractorOn(true)
    }, 800)
  }

  const resetAnomaly = () => {
    setTempOffset(0)
    setAlertTriggered(false)
  }

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-[#090e18]/90 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.12)] p-4 sm:p-7 text-white relative overflow-hidden">
      {/* Glow ambiental */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20" />

      {/* Header del centro de control */}
      <div className="flex flex-col items-center justify-center text-center gap-4 pb-6 border-b border-white/[0.08] relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute inset-0" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Sala Cultivo Alpha-03</h3>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-md font-semibold">
              Online • Mesh IoT Zigbee
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 -mt-2 text-center">
          Último muestreo ambiental hace 2 segundos • 14 sensores conectados
        </p>

        {/* Selector de Etapa de Sala */}
        <div className="flex items-center justify-center bg-[#0d1526] p-1 rounded-2xl border border-white/10 w-full sm:w-auto mx-auto">
          {(['veg', 'flower', 'dry'] as RoomStage[]).map((stage) => {
            const isActive = activeStage === stage
            return (
              <button
                key={stage}
                onClick={() => {
                  setActiveStage(stage)
                  setTempOffset(0)
                  setAlertTriggered(false)
                }}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex-1 sm:flex-initial cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="stage-tab-pill"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {stage === 'veg' && 'Vegetativo'}
                {stage === 'flower' && 'Floración'}
                {stage === 'dry' && 'Secado & Curado'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Banner de Alerta Activa si se dispara anomalía */}
      <AnimatePresence>
        {alertTriggered && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center sm:text-left">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              <div>
                <span className="font-bold text-amber-300">Anomalía Detectada:</span> Elevación térmica ({currentTemp}°C) superior al umbral crítico.
                <span className="text-amber-200/80 ml-1 hidden sm:inline">Extractor forzado al 100% y alerta despachada al cultivador por WhatsApp.</span>
              </div>
            </div>
            <button
              onClick={resetAnomaly}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold text-[11px] border border-amber-500/30 shrink-0 cursor-pointer mx-auto sm:mx-0"
            >
              Normalizar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Principal de Telemetría */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
        {/* Temp Card */}
        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center group">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-2 w-full text-center">
            <span className="text-xs font-semibold uppercase tracking-wider">Temperatura</span>
            <Thermometer className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-3xl sm:text-4xl font-black tracking-tight font-mono ${alertTriggered ? 'text-amber-400' : 'text-white'}`}>
                {currentTemp}
              </span>
              <span className="text-sm font-semibold text-slate-400">°C</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center justify-center gap-1 text-center">
              <span>Target: {currentPreset.targetTemp}°C</span>
              <span>• ±0.4°C</span>
            </div>
          </div>
        </div>

        {/* Humedad Card */}
        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center group">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-2 w-full text-center">
            <span className="text-xs font-semibold uppercase tracking-wider">Humedad (RH)</span>
            <Droplets className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
                {currentPreset.targetRh}
              </span>
              <span className="text-sm font-semibold text-slate-400">%</span>
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1 text-center">
              Punto de Rocío: 14.1°C
            </div>
          </div>
        </div>

        {/* VPD Card (Clave para Bio-Cultivo) */}
        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center group">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-2 w-full text-center">
            <span className="text-xs font-semibold uppercase tracking-wider">VPD Transpiración</span>
            <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-3xl sm:text-4xl font-black tracking-tight font-mono ${isVpdOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentVpd}
              </span>
              <span className="text-sm font-semibold text-slate-400">kPa</span>
            </div>
            <div className="text-[11px] font-semibold mt-1 flex items-center justify-center gap-1 text-center">
              {isVpdOptimal ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Transpiración Foliar Óptima
                </span>
              ) : (
                <span className="text-amber-400 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Fuera de Parámetro
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Radiación PPFD / CO2 */}
        <div className="p-4 rounded-2xl bg-[#0f172a]/70 border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center group">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-2 w-full text-center">
            <span className="text-xs font-semibold uppercase tracking-wider">Flujo Fotónico</span>
            <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white">
                {currentPreset.targetPpfd}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">µmol/m²s</span>
            </div>
            <div className="text-[11px] text-amber-300 font-mono mt-1 text-center">
              CO₂: {currentPreset.co2} ppm enriquecido
            </div>
          </div>
        </div>
      </div>

      {/* Panel Inferior: Controles de Hardware & Simulación */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col items-center text-center gap-5">
        {/* Descripción de etapa agronómica */}
        <div className="space-y-2 flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide text-center">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algoritmo de Control: {currentPreset.name}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed text-center">
            {currentPreset.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono text-slate-400 pt-1 text-center">
            <span className="flex items-center justify-center gap-1">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              {currentPreset.photoperiod}
            </span>
            <span>•</span>
            <span className="text-slate-300">{currentPreset.lightStatus}</span>
          </div>
        </div>

        {/* Actuadores y Switchers en Vivo */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
          <button
            onClick={() => setExtractorOn(!extractorOn)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              extractorOn 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Wind className={`w-3.5 h-3.5 ${extractorOn ? 'animate-spin' : ''}`} />
            <span>Extracción {extractorOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setCo2Injection(!co2Injection)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              co2Injection 
                ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 shadow-sm shadow-teal-500/20' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Inyector CO₂ {co2Injection ? '1200ppm' : 'Standby'}</span>
          </button>

          <button
            onClick={alertTriggered ? resetAnomaly : triggerAnomaly}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-rose-600/30 hover:from-amber-600/40 hover:to-rose-600/40 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{alertTriggered ? 'Normalizar Sensores' : 'Simular Alarma Térmica'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
