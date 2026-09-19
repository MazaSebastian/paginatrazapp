import { Suspense, useRef, useState } from 'react'
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
  Radio
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
  const [selectedMedia, setSelectedMedia] = useState<'video1' | 'video2' | 'photo_front' | 'photo_screen' | 'photo_probe'>('video1')

  const handleResetCamera = (view: 'front' | 'back' | 'iso' | 'bed' | 'probe') => {
    if (!controlsRef.current) return
    if (view === 'front') {
      controlsRef.current.reset()
      controlsRef.current.setAzimuthalAngle(0)
      controlsRef.current.setPolarAngle(Math.PI / 2)
    } else if (view === 'back') {
      controlsRef.current.setAzimuthalAngle(Math.PI)
      controlsRef.current.setPolarAngle(Math.PI / 2)
    } else if (view === 'iso') {
      controlsRef.current.setAzimuthalAngle(Math.PI / 4)
      controlsRef.current.setPolarAngle(Math.PI / 2.7)
    } else if (view === 'bed') {
      controlsRef.current.setAzimuthalAngle(0.18)
      controlsRef.current.setPolarAngle(Math.PI / 2.4)
    } else if (view === 'probe') {
      controlsRef.current.setAzimuthalAngle(0.35)
      controlsRef.current.setPolarAngle(Math.PI / 2.1)
    }
  }

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
        {viewMode === '3d' ? (
          <div className="pointer-events-auto flex items-center gap-1 bg-black/75 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-md">
            <button
              onClick={() => handleResetCamera('bed')}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sprout className="w-3 h-3 text-emerald-400" />
              <span>Cama B2</span>
            </button>
            <button
              onClick={() => handleResetCamera('front')}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Foco Growy
            </button>
            <button
              onClick={() => handleResetCamera('probe')}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>Sonda</span>
            </button>
            <button
              onClick={() => handleResetCamera('iso')}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              360°
            </button>
            <button
              onClick={() => handleResetCamera('back')}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Caño
            </button>
          </div>
        ) : (
          /* Indicador de transmisión en vivo / footage real */
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-emerald-500/30 backdrop-blur-md shadow-lg text-[11px] font-mono text-emerald-300">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="font-bold text-white">SALA B2 • METRAJE REAL</span>
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
            camera={{ position: [0, 0.4, 6.2], fov: 44 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Iluminación base de la sala de cultivo */}
            <ambientLight intensity={0.65} />
            <directionalLight position={[5, 8, 6]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[-5, -2, -4]} intensity={0.6} color="#059669" />
            <pointLight position={[0, 1.8, 3]} intensity={0.8} color="#34d399" />
            <pointLight position={[0, -2, -2]} intensity={0.5} color="#06b6d4" />

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
                position={[0, -2.85, 0]}
                opacity={0.7}
                scale={12}
                blur={2.2}
                far={5}
                color="#022c22"
              />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={true}
              minDistance={2.4}
              maxDistance={9.5}
              maxPolarAngle={Math.PI / 1.75}
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
        <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          {/* Media de fondo (Video en loop o Foto en alta resolución) */}
          <div className="absolute inset-0 z-0 bg-black">
            {selectedMedia === 'video1' && (
              <video
                src="/footage/growy-facility-1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90"
              />
            )}
            {selectedMedia === 'video2' && (
              <video
                src="/footage/growy-facility-2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90"
              />
            )}
            {selectedMedia === 'photo_front' && (
              <img
                src="/footage/growy-photo-front.jpg"
                alt="Growy Montaje Frontal"
                className="w-full h-full object-cover opacity-90"
              />
            )}
            {selectedMedia === 'photo_screen' && (
              <img
                src="/footage/growy-photo-screen.jpg"
                alt="Growy Pantalla TrazAPP Sense"
                className="w-full h-full object-cover opacity-90"
              />
            )}
            {selectedMedia === 'photo_probe' && (
              <img
                src="/footage/growy-photo-probe.jpg"
                alt="Sonda de suelo en Living Soil"
                className="w-full h-full object-cover opacity-90"
              />
            )}

            {/* Viñeta cinematográfica y gradiente técnico */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />
          </div>

          {/* Telemetría HUD superpuesta en el video */}
          <div className="relative z-10 pt-14 sm:pt-16 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="bg-black/80 border border-emerald-500/30 p-3 rounded-2xl backdrop-blur-md shadow-2xl">
              <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Telemetría en Vivo • Sala Comercial
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
              <span className="text-slate-400 text-[10px] block">LOTE COMERCIAL</span>
              <span className="text-emerald-400 font-bold">27 PLANTAS EN CAMA B2</span>
              <div className="text-[9px] text-slate-400 mt-0.5">Monkey Mintz • Toronja • PBB</div>
            </div>
          </div>

          {/* Hotspots interactivos sobre el metraje */}
          <div className="relative z-10 my-auto flex flex-col gap-2 items-start pointer-events-auto">
            <button
              onClick={() => onSelectHotspot('mount')}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>[+] Fijación en Caño Estructural de Sala</span>
            </button>
            <button
              onClick={() => onSelectHotspot('soil_probe')}
              className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>[+] Sonda Industrial XZ-LMUS-SM-TM en Living Soil</span>
            </button>
          </div>

          {/* Barra inferior: Selector de tomas de video y fotos */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 pointer-events-auto">
            <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setSelectedMedia('video1')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'video1'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Video 1: Cama B2</span>
              </button>
              <button
                onClick={() => setSelectedMedia('video2')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'video2'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Video 2: Recorrido</span>
              </button>
              <button
                onClick={() => setSelectedMedia('photo_front')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'photo_front'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Foto Montaje</span>
              </button>
              <button
                onClick={() => setSelectedMedia('photo_screen')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'photo_screen'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Foto Pantalla</span>
              </button>
              <button
                onClick={() => setSelectedMedia('photo_probe')}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                  selectedMedia === 'photo_probe'
                    ? 'bg-emerald-500 text-black font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>Foto Sonda</span>
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
