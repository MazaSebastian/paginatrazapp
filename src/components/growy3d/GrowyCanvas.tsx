import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Vector3 } from 'three'
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

type CameraPresetKey = 'panoramic' | 'front'

interface CameraPreset {
  name: string
  position: [number, number, number]
  target: [number, number, number]
}

const CAMERA_PRESETS: Record<CameraPresetKey, CameraPreset> = {
  panoramic: {
    name: 'Panorámica B2',
    position: [-3.27, 2.83, 5.34],
    target: [-0.2, -0.15, -2]
  },
  front: {
    name: 'Foco Growy',
    position: [0, 0.12, 1.9],
    target: [0, 0.08, 0.6]
  }
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

  const [activeView, setActiveView] = useState<CameraPresetKey>('panoramic')
  const [copied, setCopied] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [presets, setPresets] = useState<Record<CameraPresetKey, CameraPreset>>(() => {
    try {
      const saved = localStorage.getItem('growy_cam_presets_v2')
      if (saved) return { ...CAMERA_PRESETS, ...JSON.parse(saved) }
    } catch (e) {
      console.error(e)
    }
    return CAMERA_PRESETS
  })

  const [camMetrics, setCamMetrics] = useState({
    pos: [-3.27, 2.83, 5.34],
    target: [-0.2, -0.15, -2],
    distance: 8.5
  })

  // Monitoreo en tiempo real de coordenadas mientras el usuario mueve el mouse
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

  // Suave interpolación entre posiciones y objetivos de cámara
  const handleSwitchView = (viewKey: CameraPresetKey) => {
    setActiveView(viewKey)
    if (!controlsRef.current) return
    const targetPreset = presets[viewKey] || CAMERA_PRESETS[viewKey]

    const startPos = controlsRef.current.object.position.clone()
    const startTarget = controlsRef.current.target.clone()
    const endPos = new Vector3(...targetPreset.position)
    const endTarget = new Vector3(...targetPreset.target)

    const startTime = performance.now()
    const duration = 650 // ms

    const animateCamera = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)

      controlsRef.current?.object.position.lerpVectors(startPos, endPos, ease)
      controlsRef.current?.target.lerpVectors(startTarget, endTarget, ease)
      controlsRef.current?.update()
      handleControlsChange()

      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      }
    }
    requestAnimationFrame(animateCamera)
  }

  const handleSaveActiveView = () => {
    const updated = {
      ...presets,
      [activeView]: {
        ...presets[activeView],
        position: camMetrics.pos as [number, number, number],
        target: camMetrics.target as [number, number, number]
      }
    }
    setPresets(updated)
    localStorage.setItem('growy_cam_presets_v2', JSON.stringify(updated))
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2200)
  }

  const handleCopyCoordinates = () => {
    const text = `${presets[activeView].name} (${activeView}): position: [${camMetrics.pos.join(', ')}], target: [${camMetrics.target.join(', ')}]`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleResetActivePreset = () => {
    const updated = {
      ...presets,
      [activeView]: CAMERA_PRESETS[activeView]
    }
    setPresets(updated)
    localStorage.setItem('growy_cam_presets_v2', JSON.stringify(updated))
    handleSwitchView(activeView)
  }

  // Al cargar la vista 3D, iniciar en la panorámica B2
  useEffect(() => {
    if (viewMode === '3d' && controlsRef.current) {
      const p = presets[activeView] || CAMERA_PRESETS[activeView] || CAMERA_PRESETS.panoramic
      controlsRef.current.target.set(...p.target)
      controlsRef.current.object.position.set(...p.position)
      controlsRef.current.update()
      handleControlsChange()
    }
  }, [viewMode])

  return (
    <div className="w-full flex flex-col gap-3">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* VISOR PRINCIPAL 3D (100% LIMPIO, CERO MODALES ENCIMA)         */}
      {/* ──────────────────────────────────────────────────────────── */}
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
          <div className="pointer-events-auto flex items-center gap-1.5 bg-black/75 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-md">
            <button
              onClick={() => handleSwitchView('panoramic')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'panoramic'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Panorámica B2</span>
            </button>
            <button
              onClick={() => handleSwitchView('front')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'front'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Foco Growy</span>
            </button>
          </div>
        )}
      </div>

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
              enablePan={true}
              panSpeed={0.9}
              enableZoom={true}
              minDistance={0.3}
              maxDistance={12}
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

      {/* ──────────────────────────────────────────────────────────── */}
      {/* DOCK EXTERNO DE CALIBRACIÓN (100% FUERA DEL 3D, NADA ENCIMA) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {viewMode === '3d' && (
        <div className="w-full bg-[#080d1a]/95 border border-emerald-500/40 rounded-2xl p-3 sm:p-4 shadow-xl text-xs font-mono backdrop-blur-md transition-all">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-200 font-bold">CALIBRADOR EXTERNO DE CÁMARA</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px] font-bold">
                EN VIVO: {presets[activeView]?.name.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-emerald-300 font-semibold">Distancia:</span> {camMetrics.distance} m
              <span className="mx-2 text-white/20">|</span>
              <span className="text-slate-400">🖱️ Izq: Rotar • Der: Desplazar (Pan) • Rueda: Zoom</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5 items-center">
            {/* Posición */}
            <div className="bg-black/60 p-2 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[9px] block uppercase font-bold">Posición Cámara [X, Y, Z]</span>
              <span className="text-emerald-300 font-bold select-all text-xs">
                [{camMetrics.pos[0]}, {camMetrics.pos[1]}, {camMetrics.pos[2]}]
              </span>
            </div>

            {/* Target */}
            <div className="bg-black/60 p-2 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[9px] block uppercase font-bold">Punto Focal Target [X, Y, Z]</span>
              <span className="text-cyan-300 font-bold select-all text-xs">
                [{camMetrics.target[0]}, {camMetrics.target[1]}, {camMetrics.target[2]}]
              </span>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCoordinates}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md text-xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>📋 Copiar Coordenadas</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveActiveView}
                title="Guardar esta vista para navegarla en esta sesión"
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center gap-1 transition-all cursor-pointer border border-white/10 text-xs"
              >
                {savedSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline">{savedSuccess ? 'Guardado' : 'Guardar'}</span>
              </button>

              <button
                onClick={handleResetActivePreset}
                title="Restablecer a valores de fábrica"
                className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer border border-white/10 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
