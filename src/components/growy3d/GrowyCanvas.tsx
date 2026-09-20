import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Vector3 } from 'three'
import { GrowyModel } from './GrowyModel'
import { GrowBedEnvironment } from './GrowBedEnvironment'
import type { GrowyScreenProps } from './GrowyScreenContent'
import { 
  loadSavedCalibration, 
  type DomCalibration 
} from './GrowyDomCalibrator'
import { 
  Eye, 
  LayoutGrid, 
  Sprout, 
  Video, 
  Box
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
    position: [0, 0.19, 4.23],
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
  const [activeView, setActiveView] = useState<CameraPresetKey>('panoramic')
  const [calibration] = useState<DomCalibration>(loadSavedCalibration)

  // Suave interpolación entre posiciones y objetivos de cámara
  const handleSwitchView = (viewKey: CameraPresetKey) => {
    setActiveView(viewKey)
    if (!controlsRef.current) return
    const targetPreset = CAMERA_PRESETS[viewKey]

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

      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      }
    }
    requestAnimationFrame(animateCamera)
  }

  // Al cargar la vista 3D, iniciar en la panorámica B2
  useEffect(() => {
    if (viewMode === '3d' && controlsRef.current) {
      const p = CAMERA_PRESETS[activeView] || CAMERA_PRESETS.panoramic
      controlsRef.current.target.set(...p.target)
      controlsRef.current.object.position.set(...p.position)
      controlsRef.current.update()
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
                calibration={calibration}
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
              minDistance={1.2}
              maxDistance={9.5}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3.8}
              dampingFactor={0.06}
              rotateSpeed={0.8}
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
          {/* Media de fondo: Spot comercial en video continuo */}
          <div className="absolute inset-0 z-0 bg-black">
            <video
              src="/footage/growy-commercial-showreel.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-95 transition-opacity duration-500"
            />
            {/* Viñeta sutil y gradiente de contraste cinematográfico */}
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

          {/* Barra inferior: Spot demostrativo limpio con botón para volver a 3D */}
          <div className="relative z-10 flex items-center justify-between gap-2 pt-3 pointer-events-auto">
            <div className="flex items-center gap-2 bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md text-[11px] font-mono text-emerald-400 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold">Instalación Real • Spot Demostrativo Sala B2</span>
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
