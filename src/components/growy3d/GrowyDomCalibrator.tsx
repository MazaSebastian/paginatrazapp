import { useState } from 'react'
import { createPortal } from 'react-dom'
import { 
  Crosshair, 
  RotateCcw, 
  Save, 
  Copy, 
  Check, 
  X, 
  Sliders, 
  Eye, 
  Maximize2,
  Minimize2,
  MoveVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export interface DomCalibration {
  offsetY: number        // Desplazamiento vertical del DOM (px)
  offsetX: number        // Desplazamiento horizontal del DOM (px)
  posOffsetY: number     // Offset 3D Y en Three.js (unidades 3D)
  posOffsetZ: number     // Offset 3D Z en Three.js (unidades 3D)
  distanceFactor: number // Factor de escala Drei
  hitboxPadding: number  // Margen de expansión táctil invisible en botones (px)
  showHitboxes: boolean  // Modo visualizador de hitboxes
}

export const STORAGE_KEY_CALIBRATION = 'growy_dom_screen_calibration_v1'

export const DEFAULT_DOM_CALIBRATION: DomCalibration = {
  offsetY: 0,
  offsetX: 0,
  posOffsetY: 0,
  posOffsetZ: 0,
  distanceFactor: 0.969,
  hitboxPadding: 20,     // 20px extra de área táctil vertical invisible (calibrado con precisión exacta)
  showHitboxes: false,
}

// Cargar calibración persistida desde localStorage si existe
export function loadSavedCalibration(): DomCalibration {
  if (typeof window === 'undefined') return DEFAULT_DOM_CALIBRATION
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CALIBRATION)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...DEFAULT_DOM_CALIBRATION, ...parsed }
    }
  } catch (e) {
    console.warn('No se pudo cargar la calibración previa:', e)
  }
  return DEFAULT_DOM_CALIBRATION
}

interface GrowyDomCalibratorProps {
  calibration: DomCalibration
  onChange: (calib: DomCalibration) => void
  isOpen: boolean
  onToggleOpen: () => void
}

export function GrowyDomCalibrator({
  calibration,
  onChange,
  isOpen,
  onToggleOpen
}: GrowyDomCalibratorProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [position, setPosition] = useState<'top-right' | 'bottom-right'>('top-right')
  const [minimized, setMinimized] = useState(false)

  const update = (partial: Partial<DomCalibration>) => {
    onChange({ ...calibration, ...partial })
    setSaved(false)
  }

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CALIBRATION, JSON.stringify(calibration))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error('Error al guardar calibración:', e)
    }
  }

  const handleReset = () => {
    onChange(DEFAULT_DOM_CALIBRATION)
    try {
      localStorage.removeItem(STORAGE_KEY_CALIBRATION)
    } catch {
      // ignore
    }
  }

  const handleCopy = () => {
    const code = JSON.stringify(calibration, null, 2)
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const portalTarget = typeof document !== 'undefined' ? document.body : null

  return (
    <>
      {/* Botón Flotante para Abrir/Cerrar el Calibrador */}
      <div className="absolute bottom-4 right-4 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={onToggleOpen}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-xl ${
            isOpen 
              ? 'bg-cyan-500 text-black shadow-cyan-500/30 scale-105' 
              : 'bg-black/80 hover:bg-black/90 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 shadow-black/60'
          }`}
          title="Calibrador milimétrico de interacción de botones DOM en pantalla Growy"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isOpen ? 'animate-spin' : ''}`} />
          <span>{isOpen ? 'Cerrar Calibrador' : 'Calibrar Clics DOM'}</span>
          {calibration.showHitboxes && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Modo Debug activo" />
          )}
        </button>
      </div>

      {/* Panel HUD Flotante de Calibración RENDERIZADO FUERA DE LA VENTANA 3D (Portal al body) */}
      {isOpen && portalTarget && createPortal(
        <div 
          onPointerDown={(e) => e.stopPropagation()}
          className={`fixed z-[99999] w-[340px] rounded-2xl bg-[#090e1a]/95 backdrop-blur-2xl border border-cyan-500/50 text-slate-200 font-mono text-[11px] shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-3.5 flex flex-col gap-3 pointer-events-auto select-none transition-all duration-200 animate-in fade-in zoom-in-95 ${
            position === 'top-right' ? 'top-20 right-6' : 'bottom-6 right-6'
          } ${minimized ? 'max-h-[58px] overflow-hidden border-cyan-500/30' : 'max-h-[85vh] overflow-y-auto'}`}
        >
          {/* Header del Widget */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-cyan-300 text-xs tracking-wide">CALIBRADOR DOM TÁCTIL</div>
                <div className="text-[9px] text-slate-400">Panel exterior desacoplado</div>
              </div>
            </div>
            
            {/* Controles de Ventana: Mover esquina, Minimizar, Cerrar */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPosition(p => p === 'top-right' ? 'bottom-right' : 'top-right')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title={`Mover a esquina ${position === 'top-right' ? 'inferior' : 'superior'}`}
              >
                <MoveVertical className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMinimized(m => !m)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={minimized ? "Expandir panel" : "Minimizar panel"}
              >
                {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={onToggleOpen}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Cerrar panel de calibración"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. Control Principal: Desplazamiento Vertical Y (El núcleo del problema) */}
          <div className="bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 flex items-center gap-1">
                <span>↕</span>
                <span>Desplazamiento Vertical (Y)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                {calibration.offsetY > 0 ? `+${calibration.offsetY}` : calibration.offsetY} px
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-tight">
              Ajustá si el botón &ldquo;INFO LOTE&rdquo; se clikea ligeramente arriba o abajo del cursor.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => update({ offsetY: calibration.offsetY - 1 })}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all"
              >
                -1
              </button>
              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={calibration.offsetY}
                onChange={(e) => update({ offsetY: parseInt(e.target.value, 10) })}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => update({ offsetY: calibration.offsetY + 1 })}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all"
              >
                +1
              </button>
            </div>
          </div>

          {/* 2. Control Secundario: Expansión de Hitbox (Área táctil invisible) */}
          <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 flex items-center gap-1">
                <Maximize2 className="w-3 h-3" />
                <span>Expansión de Hitbox Táctil</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                +{calibration.hitboxPadding} px
              </span>
            </div>
            <p className="text-[9.5px] text-slate-400 leading-tight">
              Aumenta el margen invisible de detección de clics alrededor de los botones para que nunca fallen.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => update({ hitboxPadding: Math.max(0, calibration.hitboxPadding - 2) })}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all"
              >
                -2
              </button>
              <input
                type="range"
                min="0"
                max="24"
                step="2"
                value={calibration.hitboxPadding}
                onChange={(e) => update({ hitboxPadding: parseInt(e.target.value, 10) })}
                className="flex-1 accent-emerald-400 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => update({ hitboxPadding: Math.min(24, calibration.hitboxPadding + 2) })}
                className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all"
              >
                +2
              </button>
            </div>
          </div>

          {/* 3. Desplazamiento Horizontal (X) */}
          <div className="bg-black/40 p-2 rounded-xl border border-white/10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <span>↔</span>
                <span>Desplazamiento Horizontal (X)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {calibration.offsetX > 0 ? `+${calibration.offsetX}` : calibration.offsetX} px
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={calibration.offsetX}
                onChange={(e) => update({ offsetX: parseInt(e.target.value, 10) })}
                className="flex-1 accent-slate-300 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Interruptor Modo Visualizador de Hitboxes (Debug) */}
          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <div>
                <div className="font-bold text-purple-300 text-[10.5px]">Visualizar Hitboxes (Debug)</div>
                <div className="text-[8.5px] text-slate-400">Resalta contornos exactos donde el navegador detecta clics</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => update({ showHitboxes: !calibration.showHitboxes })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                calibration.showHitboxes ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  calibration.showHitboxes ? 'translate-x-5' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>

          {/* 5. Ajustes 3D Avanzados (Colapsable) */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full px-2.5 py-1.5 bg-black/40 hover:bg-black/60 flex items-center justify-between text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[10px]"
            >
              <span>Ajustes Avanzados (3D Drei & Profundidad)</span>
              {advancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {advancedOpen && (
              <div className="p-2.5 bg-black/60 flex flex-col gap-2 border-t border-white/5 text-[9.5px]">
                {/* 3D Pos Y */}
                <div>
                  <div className="flex justify-between text-slate-400">
                    <span>Posición 3D Y:</span>
                    <span className="font-mono text-cyan-300">{(calibration.posOffsetY).toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.06"
                    max="0.06"
                    step="0.002"
                    value={calibration.posOffsetY}
                    onChange={(e) => update({ posOffsetY: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* 3D Pos Z */}
                <div>
                  <div className="flex justify-between text-slate-400">
                    <span>Profundidad 3D Z (Frente/Fondo):</span>
                    <span className="font-mono text-cyan-300">{(0.045 + calibration.posOffsetZ).toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.02"
                    max="0.03"
                    step="0.001"
                    value={calibration.posOffsetZ}
                    onChange={(e) => update({ posOffsetZ: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* DistanceFactor */}
                <div>
                  <div className="flex justify-between text-slate-400">
                    <span>Factor Drei (distanceFactor):</span>
                    <span className="font-mono text-cyan-300">{calibration.distanceFactor.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.88"
                    max="1.08"
                    step="0.002"
                    value={calibration.distanceFactor}
                    onChange={(e) => update({ distanceFactor: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Barra de Acciones: Guardar, Copiar, Reset */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                saved 
                  ? 'bg-emerald-500 text-black' 
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? '¡Guardado!' : 'Guardar'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 flex items-center gap-1 transition-all cursor-pointer"
              title="Copiar valores como JSON al portapapeles"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
              title="Restablecer valores originales"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>,
        portalTarget
      )}
    </>
  )
}
