import { useState, useEffect } from 'react'
import { 
  Wifi, 
  Database, 
  CheckCircle2, 
  ChevronRight,
  Plus
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
    co2: number
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
  const [selectedStrain, setSelectedStrain] = useState('Lemon Cherry')
  const [currentTime, setCurrentTime] = useState('14:32:05')
  const [showIncidenceModal, setShowIncidenceModal] = useState(false)
  const [incidenceRegistered, setIncidenceRegistered] = useState(false)

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toTimeString().split(' ')[0])
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Parpadeo suave en modo rostro
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 180)
    }, 3500)
    return () => clearInterval(blinkInterval)
  }, [])

  // Grilla de 18 macetas (3x6)
  const plants = [
    { id: 'A1', status: 'optimal', vwc: '42%' },
    { id: 'A2', status: 'optimal', vwc: '41%' },
    { id: 'A3', status: alertActive ? 'dry' : 'optimal', vwc: alertActive ? '22%' : '39%' },
    { id: 'A4', status: 'optimal', vwc: '43%' },
    { id: 'A5', status: 'optimal', vwc: '40%' },
    { id: 'A6', status: 'optimal', vwc: '42%' },
    { id: 'B1', status: 'optimal', vwc: '44%' },
    { id: 'B2', status: alertActive ? 'warning' : 'optimal', vwc: alertActive ? '25%' : '41%' },
    { id: 'B3', status: 'optimal', vwc: '43%' },
    { id: 'B4', status: 'optimal', vwc: '38%' },
    { id: 'B5', status: 'optimal', vwc: '40%' },
    { id: 'B6', status: 'optimal', vwc: '42%' },
    { id: 'C1', status: 'optimal', vwc: '41%' },
    { id: 'C2', status: 'optimal', vwc: '40%' },
    { id: 'C3', status: 'optimal', vwc: '43%' },
    { id: 'C4', status: 'optimal', vwc: '42%' },
    { id: 'C5', status: 'optimal', vwc: '41%' },
    { id: 'C6', status: 'optimal', vwc: '44%' },
  ]

  return (
    <div 
      className="w-full h-full bg-[#050811] text-slate-100 font-mono select-none overflow-hidden flex flex-col justify-between p-3 relative border border-emerald-500/20"
      style={{
        boxShadow: alertActive 
          ? 'inset 0 0 35px rgba(225,29,72,0.35)' 
          : 'inset 0 0 35px rgba(16,185,129,0.2)'
      }}
    >
      {/* Scanline CRT overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 z-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODO A: FACE MODE (Rostro IA con Ojos Cibernéticos) */}
      {/* ────────────────────────────────────────────────────────── */}
      {mode === 'face' ? (
        <div className="flex-1 flex flex-col justify-between py-2 relative z-10">
          {/* Header minimalista de alerta o estado */}
          <div className="flex items-center justify-between text-[11px] tracking-wider px-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${alertActive ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className={alertActive ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
                {alertActive ? 'CRITICAL ALERT' : 'GROWY IA • ONLINE'}
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">{currentTime}</span>
          </div>

          {/* Ojos de Growy (Capsule Cyber Eyes) */}
          <div className="flex flex-col items-center justify-center my-auto">
            {alertActive && (
              <div className="mb-2 text-[10px] text-rose-300 font-bold bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 rounded-full animate-pulse">
                [!] {alertMessage}
              </div>
            )}

            <div className="flex items-center gap-12 sm:gap-14 my-4">
              {/* Ojo Izquierdo */}
              <div 
                className={`w-12 sm:w-16 rounded-3xl transition-all duration-200 relative overflow-hidden flex items-center justify-center ${
                  blink ? 'h-1' : 'h-20 sm:h-24'
                } ${
                  alertActive
                    ? 'bg-gradient-to-b from-rose-500 to-red-600 shadow-[0_0_35px_rgba(244,63,94,0.85)]'
                    : 'bg-gradient-to-b from-cyan-400 via-emerald-400 to-teal-500 shadow-[0_0_35px_rgba(45,212,191,0.8)]'
                }`}
              >
                {!blink && (
                  <div className="w-4 h-4 rounded-full bg-white/90 shadow-[0_0_8px_white] absolute top-2.5 right-2.5" />
                )}
              </div>

              {/* Ojo Derecho */}
              <div 
                className={`w-12 sm:w-16 rounded-3xl transition-all duration-200 relative overflow-hidden flex items-center justify-center ${
                  blink ? 'h-1' : 'h-20 sm:h-24'
                } ${
                  alertActive
                    ? 'bg-gradient-to-b from-rose-500 to-red-600 shadow-[0_0_35px_rgba(244,63,94,0.85)]'
                    : 'bg-gradient-to-b from-cyan-400 via-emerald-400 to-teal-500 shadow-[0_0_35px_rgba(45,212,191,0.8)]'
                }`}
              >
                {!blink && (
                  <div className="w-4 h-4 rounded-full bg-white/90 shadow-[0_0_8px_white] absolute top-2.5 right-2.5" />
                )}
              </div>
            </div>

            {/* Prompt de interacción */}
            <button
              onClick={onToggleMode}
              className="text-[10px] text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer mt-2 bg-white/[0.05] px-3 py-1 rounded-full border border-white/10"
            >
              <span>Tocá la pantalla para abrir</span>
              <span className="text-emerald-400 font-bold">TRAZAPP SENSE</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Telemetría al pie en tiempo real */}
          <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/[0.08] text-center text-[10px]">
            <div className="bg-black/40 rounded p-1">
              <div className="text-slate-500 text-[9px]">TEMP</div>
              <div className="font-bold text-emerald-300">{telemetry.temp.toFixed(1)}°C</div>
            </div>
            <div className="bg-black/40 rounded p-1">
              <div className="text-slate-500 text-[9px]">HUM</div>
              <div className="font-bold text-teal-300">{telemetry.hum.toFixed(1)}%</div>
            </div>
            <div className="bg-black/40 rounded p-1">
              <div className="text-slate-500 text-[9px]">VPD</div>
              <div className={`font-bold ${telemetry.vpd < 0.7 || telemetry.vpd > 1.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {telemetry.vpd.toFixed(2)}k
              </div>
            </div>
            <div className="bg-black/40 rounded p-1">
              <div className="text-slate-500 text-[9px]">SUELO</div>
              <div className="font-bold text-cyan-300">{telemetry.soilMoisture.toFixed(0)}%</div>
            </div>
            <div className="bg-black/40 rounded p-1">
              <div className="text-slate-500 text-[9px]">PLANTAS</div>
              <div className="font-bold text-amber-300">{telemetry.plantsCount}</div>
            </div>
          </div>
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────── */
        /* MODO B: OPERATIVE MODE ("TRAZAPP SENSE") */
        /* ────────────────────────────────────────────────────────── */
        <div className="flex-1 flex flex-col justify-between py-1 relative z-10 text-[10px]">
          {/* Barra superior de estado */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onToggleMode}
                className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer font-bold"
              >
                ← ROSTRO
              </button>
              <span className="font-bold text-emerald-400 text-[11px]">TRAZAPP SENSE</span>
            </div>
            <div className="flex items-center gap-1 text-[9px]">
              <span className="text-emerald-400 flex items-center gap-0.5">
                <Wifi className="w-2.5 h-2.5" /> ON
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-teal-400 flex items-center gap-0.5">
                <Database className="w-2.5 h-2.5" /> SUPABASE
              </span>
            </div>
          </div>

          {/* Subheader: Lote y Conteo */}
          <div className="flex items-center justify-between py-1.5">
            <div>
              <span className="text-slate-400 text-[9px]">MAPA DE SALA: </span>
              <span className="text-white font-bold">18 MACETAS</span>
            </div>
            <div className="flex items-center gap-1">
              {['Lemon Cherry', 'ZOAP', 'Papaya'].map((strain) => (
                <button
                  key={strain}
                  onClick={() => setSelectedStrain(strain)}
                  className={`px-1.5 py-0.5 rounded text-[8px] transition-colors cursor-pointer ${
                    selectedStrain === strain 
                      ? 'bg-emerald-500 text-black font-bold' 
                      : 'bg-black/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {strain}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de 18 macetas */}
          <div className="grid grid-cols-6 gap-1 my-1 flex-1 items-center">
            {plants.map((plant) => {
              let bg = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              if (plant.status === 'dry') {
                bg = 'bg-rose-950/60 border-rose-500/70 text-rose-200 animate-pulse'
              } else if (plant.status === 'warning') {
                bg = 'bg-amber-950/60 border-amber-500/60 text-amber-200'
              }

              return (
                <div
                  key={plant.id}
                  className={`p-1 rounded border flex flex-col items-center justify-center text-center ${bg}`}
                >
                  <span className="text-[9px] font-bold">{plant.id}</span>
                  <span className="text-[7px] text-slate-400 font-mono">{plant.vwc}</span>
                </div>
              )
            })}
          </div>

          {/* Footer de acción rápida */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <div className="text-[8px] text-slate-400">
              Lote: <span className="text-emerald-300 font-bold">{selectedStrain} #B4</span>
            </div>
            <button
              onClick={() => {
                setShowIncidenceModal(true)
                setTimeout(() => {
                  setIncidenceRegistered(true)
                  setTimeout(() => {
                    setShowIncidenceModal(false)
                    setIncidenceRegistered(false)
                  }, 1800)
                }, 1200)
              }}
              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm shadow-emerald-500/20"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>REGISTRAR INCIDENCIA</span>
            </button>
          </div>

          {/* Modal rápido de incidencia simulada */}
          {showIncidenceModal && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 text-center">
              {!incidenceRegistered ? (
                <>
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <div className="text-[10px] font-bold text-white">Sincronizando con TrazAPP Cloud...</div>
                  <div className="text-[8px] text-slate-400">Firmando Hash con clave de sala</div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-1" />
                  <div className="text-[10px] font-bold text-emerald-300">¡Incidencia Foliada con Éxito!</div>
                  <div className="text-[8px] text-slate-400">Sincronizada vía MCP con Supabase</div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
