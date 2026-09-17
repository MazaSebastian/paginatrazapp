import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { GrowyModel } from './GrowyModel'
import type { GrowyScreenProps } from './GrowyScreenContent'
import { RotateCw, Eye, LayoutGrid } from 'lucide-react'

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

  const handleResetCamera = (view: 'front' | 'back' | 'iso') => {
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
      controlsRef.current.setPolarAngle(Math.PI / 3)
    }
  }

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl bg-gradient-to-b from-[#0a0f1c] via-[#060913] to-[#04060d] border border-white/[0.08] overflow-hidden shadow-2xl">
      {/* Grid sutil de fondo de sala técnica */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Controles flotantes superiores en el visor 3D */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Indicador de 3D Interactivo */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs text-slate-300">
          <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin [animation-duration:8s]" />
          <span className="font-mono text-[11px] font-semibold text-white">Rotación 360° Libre</span>
        </div>

        {/* Selector de vistas rápidas de cámara */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/60 p-1 rounded-full border border-white/10 backdrop-blur-md">
          <button
            onClick={() => handleResetCamera('front')}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Frente
          </button>
          <button
            onClick={() => handleResetCamera('iso')}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Perspectiva
          </button>
          <button
            onClick={() => handleResetCamera('back')}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Atrás / Caño
          </button>
        </div>
      </div>

      {/* Botón flotante inferior para alternar modo de pantalla */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto flex items-center gap-2">
        <button
          onClick={onToggleMode}
          className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
        >
          {mode === 'face' ? (
            <>
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Abrir Modo Operativo (Sense)</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Abrir Modo Rostro (Face)</span>
            </>
          )}
        </button>
      </div>

      {/* Canvas Three.js */}
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Iluminación de estudio industrial */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-5, -2, -4]} intensity={0.8} color="#059669" />
        <pointLight position={[0, 2, 3]} intensity={0.9} color="#34d399" />
        <pointLight position={[0, -2, -2]} intensity={0.6} color="#06b6d4" />

        <Suspense fallback={null}>
          <GrowyModel
            mode={mode}
            onToggleMode={onToggleMode}
            alertActive={alertActive}
            alertMessage={alertMessage}
            telemetry={telemetry}
            activeHotspot={activeHotspot}
            onSelectHotspot={onSelectHotspot}
          />
          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.65}
            scale={8}
            blur={2.5}
            far={4}
            color="#047857"
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={3.5}
          maxDistance={7.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3.5}
          dampingFactor={0.06}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  )
}
