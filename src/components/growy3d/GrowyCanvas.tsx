import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { GrowyModel } from './GrowyModel'
import { GrowBedEnvironment } from './GrowBedEnvironment'
import type { GrowyScreenProps } from './GrowyScreenContent'
import { 
  Eye, 
  LayoutGrid, 
  Sprout, 
  Crosshair, 
  Video, 
  Box, 
  Camera, 
  Sparkles, 
  Film,
  Compass,
  Copy,
  Check,
  Save,
  RotateCcw
} from 'lucide-react'

interface GrowyCanvasProps {
  mode: 'face' | 'sense'
  onToggleMode: () => void
  alertActive: boolean
  alertMessage: string
  telemetry: GrowyScreenProps['telemetry']
  activeHotspot: string | null
  onSelectHotspot: (hotspot: string) => void
}

export function GrowyCanvas({
  mode,
  onToggleMode,
  alertActive,
  alertMessage,
  telemetry,
  activeHotspot,
  onSelectHotspot
}: GrowyCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const [viewMode, setViewMode] = useState<'3d' | 'footage'>('3d')
  const [selectedMedia, setSelectedMedia] = useState<
    'showreel' | 'video1_pro' | 'video2_pro' | 'photo_screen' | 'photo_canopy' | 'photo_probe' | 'photo_front'
  >('showreel')

type CameraPresetKey = 'panoramic' | 'front' | 'probe' | 'iso' | 'back'

interface CameraPreset {
  name: string
  position: [number, number, number]
  target: [number, number, number]
}

const DEFAULT_PRESETS: Record<CameraPresetKey, CameraPreset> = {
  panoramic: {
    name: 'Panorámica B2',
    position: [-3.27, 2.83, 5.34],
    target: [-0.2, -0.15, -2]
  },
  front: {
    name: 'Foco Growy',
    position: [0, 0.12, 1.9],
    target: [0, 0.08, 0.6]
  },
  probe: {
    name: 'Sonda Suelo',
    position: [1.45, -0.12, 0.8],
    target: [0.65, -0.42, 0.1]
  },
  iso: {
    name: 'Ángulo Opuesto',
    position: [-3.7, 2.0, 1.6],
    target: [-0.2, -0.15, -2.0]
  },
  back: {
    name: 'Caño Montaje',
    position: [0, 0.15, -0.8],
    target: [0, 0.08, 0.6]
  }
}

  // Presets configurados (cargados de localStorage si existen)
  const [presets, setPresets] = useState<Record<CameraPresetKey, CameraPreset>>(() => {
    try {
      const saved = localStorage.getItem('growy_cam_all_presets')
      if (saved) return { ...DEFAULT_PRESETS, ...JSON.parse(saved) }
    } catch (e) {
      console.error(e)
    }
    return DEFAULT_PRESETS
  })

  const [activeCalibratingView, setActiveCalibratingView] = useState<CameraPresetKey>('front')
  const [showCalibrator, setShowCalibrator] = useState(true)
  const [copiedSingle, setCopiedSingle] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [camMetrics, setCamMetrics] = useState({
    pos: [-3.27, 2.83, 5.34],
    target: [-0.2, -0.15, -2],
    distance: 8.5
  })

  // Escuchar movimientos de la cámara en vivo
  const handleControlsChange = () => {
    if (!controlsRef.current) return
    const cam = controlsRef.current.object
    const tgt = controlsRef.current.target
    const dx = cam.position.x - tgt.x
    const dy = cam.position.y - tgt.y
    const dz = cam.position.z - tgt.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
    setCamMetrics({
      pos: [
        Number(cam.position.x.toFixed(2)),
        Number(cam.position.y.toFixed(2)),
        Number(cam.position.z.toFixed(2))
      ],
      target: [
        Number(tgt.x.toFixed(2)),
        Number(tgt.y.toFixed(2)),
        Number(tgt.z.toFixed(2))
      ],
      distance: Number(dist.toFixed(2))
    })
  }

  // Guardar la vista activa en presets y localStorage
  const handleSaveActiveView = () => {
    const updated: Record<CameraPresetKey, CameraPreset> = {
      ...presets,
      [activeCalibratingView]: {
        ...presets[activeCalibratingView],
        position: camMetrics.pos,
        target: camMetrics.target
      }
    }
    setPresets(updated)
    localStorage.setItem('growy_cam_all_presets', JSON.stringify(updated))
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  // Copiar solo los parámetros de la vista que se está calibrando
  const handleCopySingle = () => {
    const text = `${presets[activeCalibratingView].name} (${activeCalibratingView}): position: [${camMetrics.pos.join(', ')}], target: [${camMetrics.target.join(', ')}]`
    navigator.clipboard.writeText(text)
    setCopiedSingle(true)
    setTimeout(() => setCopiedSingle(false), 2000)
  }

  // Copiar todas las 5 vistas calibradas en formato compacto
  const handleCopyAll = () => {
    const lines = (Object.keys(presets) as CameraPresetKey[]).map((k) => {
      const p = presets[k]
      return `${p.name} (${k}): position: [${p.position.join(', ')}], target: [${p.target.join(', ')}]`
    })
    navigator.clipboard.writeText(lines.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
  }

  // Restablecer todas a valores iniciales
  const handleResetToFactory = () => {
    localStorage.removeItem('growy_cam_all_presets')
    setPresets(DEFAULT_PRESETS)
    if (controlsRef.current) {
      controlsRef.current.target.set(...DEFAULT_PRESETS.panoramic.target)
      controlsRef.current.object.position.set(...DEFAULT_PRESETS.panoramic.position)
      controlsRef.current.update()
      handleControlsChange()
    }
  }

  // Cambiar de vista y mover la cámara instantáneamente
  const handleSwitchView = (viewKey: CameraPresetKey) => {
    setActiveCalibratingView(viewKey)
    if (!controlsRef.current) return
    const targetPreset = presets[viewKey] || DEFAULT_PRESETS[viewKey]
    controlsRef.current.target.set(...targetPreset.target)
    controlsRef.current.object.position.set(...targetPreset.position)
    controlsRef.current.update()
    handleControlsChange()
  }

  // Al cargar la vista 3D, iniciar en la panorámica B2
  useEffect(() => {
    if (viewMode === '3d' && controlsRef.current) {
      const p = presets.panoramic || DEFAULT_PRESETS.panoramic
      controlsRef.current.target.set(...p.target)
      controlsRef.current.object.position.set(...p.position)
      controlsRef.current.update()
      handleControlsChange()
    }
  }, [viewMode])

  return (
    <div className="relative w-full h-[540px] sm:h-[640px] rounded-3xl bg-gradient-to-b from-[#0a0f1c] via-[#060913] to-[#04060d] border border-white/[0.08] overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Grid sutil de fondo de sala técnica */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Ambient glow del cultivo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none" />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* BARRA SUPERIOR: SWITCHER [ 🌐 VISOR 3D ] vs [ 🎥 CASO REAL ] */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Switch Principal: 3D vs Metraje Real */}
        <div className="pointer-events-auto flex items-center p-1 rounded-full bg-black/80 border border-white/10 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Simulación 3D</span>
          </button>
          <button
            onClick={() => setViewMode('footage')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'footage'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Instalación Real</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          </button>
        </div>

        {/* Controles de cámara en modo 3D */}
        {viewMode === '3d' && (
          <div className="pointer-events-auto flex items-center gap-1 bg-black/75 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-md">
            <button
              onClick={() => handleSwitchView('panoramic')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                activeCalibratingView === 'panoramic'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sprout className="w-3 h-3 text-emerald-400" />
              <span>Panorámica B2</span>
            </button>
            <button
              onClick={() => handleSwitchView('front')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                activeCalibratingView === 'front'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Foco Growy
            </button>
            <button
              onClick={() => handleSwitchView('probe')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                activeCalibratingView === 'probe'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>Sonda</span>
            </button>
            <button
              onClick={() => handleSwitchView('iso')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                activeCalibratingView === 'iso'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Ángulo Opuesto
            </button>
            <button
              onClick={() => handleSwitchView('back')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                activeCalibratingView === 'back'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Caño
            </button>
            <div className="w-px h-3.5 bg-white/20 mx-0.5" />
            <button
              onClick={() => setShowCalibrator(!showCalibrator)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                showCalibrator
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Calibrador 3D</span>
            </button>
          </div>
        )}
      </div>

      {/* Panel Flotante Calibrador Multivista en Tiempo Real */}
      {viewMode === '3d' && showCalibrator && (
        <div className="absolute top-16 right-4 z-20 pointer-events-auto bg-black/95 border border-emerald-500/50 rounded-2xl p-3.5 backdrop-blur-xl shadow-2xl font-mono text-xs w-[310px] max-w-[92vw] animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              CALIBRADOR MULTIVISTA
            </span>
            <button
              onClick={() => setShowCalibrator(false)}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Selector de la vista que se está calibrando */}
          <div className="mt-2.5">
            <span className="text-slate-400 text-[9px] uppercase tracking-wider block mb-1">
              Seleccionar vista a calibrar:
            </span>
            <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px]">
              {(Object.keys(DEFAULT_PRESETS) as CameraPresetKey[]).map((key) => {
                const isActive = activeCalibratingView === key
                return (
                  <button
                    key={key}
                    onClick={() => handleSwitchView(key)}
                    className={`px-2 py-1 rounded-lg text-left truncate transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-black font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {DEFAULT_PRESETS[key].name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-2.5 p-2 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-[10px]">
            <div className="flex justify-between text-emerald-400 font-bold">
              <span>CALIBRANDO:</span>
              <span className="uppercase">{presets[activeCalibratingView]?.name}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[9px]">POSICIÓN (X, Y, Z):</span>
              <div className="text-emerald-300 font-bold select-all bg-black/60 px-1.5 py-0.5 rounded">
                [{camMetrics.pos[0]}, {camMetrics.pos[1]}, {camMetrics.pos[2]}]
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[9px]">PUNTO FOCAL / TARGET:</span>
              <div className="text-cyan-300 font-bold select-all bg-black/60 px-1.5 py-0.5 rounded">
                [{camMetrics.target[0]}, {camMetrics.target[1]}, {camMetrics.target[2]}]
              </div>
            </div>

            <div className="flex justify-between text-slate-400 pt-0.5">
              <span>Distancia: <strong className="text-white">{camMetrics.distance} m</strong></span>
              <span>FOV: <strong className="text-white">45°</strong></span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2.5 flex flex-col gap-1.5">
            <button
              onClick={handleSaveActiveView}
              className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md text-[11px]"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" />
                  <span>¡Guardado para {presets[activeCalibratingView]?.name}!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>💾 Guardar como {presets[activeCalibratingView]?.name}</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopySingle}
              className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 text-[10px]"
            >
              {copiedSingle ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado para {presets[activeCalibratingView]?.name}!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>📋 Copiar Parámetros de esta Vista</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyAll}
              className="w-full py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-emerald-500/30 text-[10px]"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3 h-3 text-emerald-300" />
                  <span className="text-emerald-300">¡Todas las 5 Vistas Copiadas!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>📋 Copiar TODAS las Vistas (Resumen Completo)</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetToFactory}
              className="w-full py-0.5 text-slate-400 hover:text-rose-400 flex items-center justify-center gap-1 transition-all cursor-pointer text-[9px] pt-1"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Restablecer todas a fábrica</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CUERPO PRINCIPAL: VISOR 3D vs REPRODUCTOR DE METRAJE REAL    */}
      {/* ──────────────────────────────────────────────────────────── */}
      {viewMode === '3d' ? (
        <>
          {/* Canvas Three.js con Entorno de Cultivo Completo */}
          <Canvas
            camera={{ position: [-3.27, 2.83, 5.34], fov: 45 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Iluminación base de la sala de cultivo */}
            <ambientLight intensity={0.65} />
            <directionalLight position={[4, 7, 5]} intensity={1.3} color="#ffffff" />
            <directionalLight position={[-4, -1, -3]} intensity={0.6} color="#059669" />
            <pointLight position={[0, 1.4, 1.8]} intensity={0.9} color="#34d399" />
            <pointLight position={[0, -0.6, -1.8]} intensity={0.6} color="#06b6d4" />

            <Suspense fallback={null}>
              {/* Entorno de cultivo real: Cama B2, living soil, canopia, red trellis, luminaria LED y sonda */}
              <GrowBedEnvironment
                activeHotspot={activeHotspot}
                onSelectHotspot={onSelectHotspot}
                telemetry={telemetry}
              />

              {/* Dispositivo Growy montado en caño con pantalla táctil interactiva */}
              <GrowyModel
                mode={mode}
                onToggleMode={onToggleMode}
                alertActive={alertActive}
                alertMessage={alertMessage}
                telemetry={telemetry}
                activeHotspot={activeHotspot}
                onSelectHotspot={onSelectHotspot}
              />

              {/* Sombra de contacto en la base de la sala técnica */}
              <ContactShadows
                position={[0, -1.38, -2.55]}
                opacity={0.65}
                scale={10}
                blur={2.0}
                far={4.5}
                color="#022c22"
              />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              target={[-0.2, -0.15, -2]}
              enablePan={false}
              enableZoom={true}
              minDistance={1.6}
              maxDistance={8.5}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3.8}
              dampingFactor={0.06}
              rotateSpeed={0.8}
              onChange={handleControlsChange}
            />
          </Canvas>

          {/* Botón flotante inferior para alternar modo de pantalla */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-auto flex items-center gap-2">
            <button
              onClick={onToggleMode}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              {mode === 'face' ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Abrir Modo Operativo (Sense B2)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Abrir Modo Rostro (Face)</span>
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        /* ────────────────────────────────────────────────────────── */
        /* MODO CASO REAL: REPRODUCTOR CINEMATOGRÁFICO CON TELEMETRÍA */
        /* ────────────────────────────────────────────────────────── */
        <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
          {/* Media de fondo (Montaje Comercial Showreel o tomas macro) */}
          <div className="absolute inset-0 z-0 bg-black">
            {selectedMedia === 'showreel' && (
              <video
                key="showreel"
                src="/footage/growy-commercial-showreel.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}
            {selectedMedia === 'video1_pro' && (
              <video
                key="video1_pro"
                src="/footage/growy-facility-1-pro.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}
            {selectedMedia === 'video2_pro' && (
              <video
                key="video2_pro"
                src="/footage/growy-facility-2-pro.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}
            {selectedMedia === 'photo_screen' && (
              <img
                src="/footage/growy-photo-screen.jpg"
                alt="Growy Pantalla TrazAPP Sense 4K"
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}
            {selectedMedia === 'photo_canopy' && (
              <img
                src="/footage/growy-photo-canopy.jpg"
                alt="Sensor en Canopia de Floración"
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}
            {selectedMedia === 'photo_probe' && (
              <img
                src="/footage/growy-photo-probe.jpg"
                alt="Sonda de suelo en Living Soil"
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}
            {selectedMedia === 'photo_front' && (
              <img
                src="/footage/growy-photo-front.jpg"
                alt="Growy Montaje Frontal"
                className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
              />
            )}

            {/* Viñeta sutil y gradiente de contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/65 pointer-events-none" />
          </div>

          {/* Telemetría HUD superpuesta en el video */}
          <div className="relative z-10 pt-14 sm:pt-16 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="bg-black/80 border border-emerald-500/30 p-3 rounded-2xl backdrop-blur-md shadow-2xl">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Telemetría en Vivo • Sala Comercial B2
              </div>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px]">VPD:</span>
                  <div className="text-emerald-300 font-bold">{telemetry.vpd.toFixed(2)} kPa</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">TEMP:</span>
                  <div className="text-white font-bold">{telemetry.temp.toFixed(1)}°C</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">HUM:</span>
                  <div className="text-teal-300 font-bold">{telemetry.hum.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">VWC SUSTRATO:</span>
                  <div className="text-cyan-300 font-bold">{telemetry.soilMoisture.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Badge de Genéticas de la Cama */}
            <div className="bg-black/80 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md text-[11px] font-mono text-right hidden sm:block">
              <span className="text-slate-400 text-[10px] block">LOTE COMERCIAL ACTIVO</span>
              <span className="text-emerald-400 font-bold">27 PLANTAS EN CAMA B2</span>
              <div className="text-[9px] text-slate-400 mt-0.5">Monkey Mintz • Toronja • PBB</div>
            </div>
          </div>

          {/* Hotspots interactivos sobre el metraje */}
          <div className="relative z-10 my-auto flex flex-col gap-2 items-start pointer-events-auto">
            <button
              onClick={() => onSelectHotspot('mount')}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>[+] Fijación en Caño Estructural de Sala</span>
            </button>
            <button
              onClick={() => onSelectHotspot('soil_probe')}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>[+] Sonda Industrial XZ-LMUS-SM-TM en Living Soil</span>
            </button>
          </div>

          {/* Barra inferior: Selector de tomas de video y fotos comerciales */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 pointer-events-auto">
            <div className="flex flex-wrap items-center gap-1.5 bg-black/85 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setSelectedMedia('showreel')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMedia === 'showreel'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Showreel Comercial</span>
              </button>
              <button
                onClick={() => setSelectedMedia('video1_pro')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'video1_pro'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Corredor B2</span>
              </button>
              <button
                onClick={() => setSelectedMedia('photo_screen')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'photo_screen'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Pantalla 4K</span>
              </button>
              <button
                onClick={() => setSelectedMedia('photo_canopy')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'photo_canopy'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sprout className="w-3 h-3" />
                <span>Canopia & Sensor</span>
              </button>
              <button
                onClick={() => setSelectedMedia('photo_probe')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'photo_probe'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Sonda Suelo</span>
              </button>
            </div>

            <button
              onClick={() => setViewMode('3d')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Volver a Simulación 3D</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
