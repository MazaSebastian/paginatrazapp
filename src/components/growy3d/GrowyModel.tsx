import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { GrowyScreenContent } from './GrowyScreenContent'
import type { GrowyScreenProps } from './GrowyScreenContent'

interface GrowyModelProps {
  mode: 'face' | 'sense'
  onToggleMode: () => void
  alertActive: boolean
  alertMessage: string
  telemetry: GrowyScreenProps['telemetry']
  activeHotspot: string | null
  onSelectHotspot: (hotspot: string) => void
}

export function GrowyModel({
  mode,
  onToggleMode,
  alertActive,
  alertMessage,
  telemetry,
  activeHotspot,
  onSelectHotspot
}: GrowyModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [screenVisible, setScreenVisible] = useState(true)
  const [cameraIsBehind, setCameraIsBehind] = useState(false)
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)

  // Detección de ángulo de cámara para Culling perfecto (evita que la pantalla se trasluzca por detrás)
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      // Micro-vibración técnica casi imperceptible
      groupRef.current.position.y = 0.1 + Math.sin(t * 1.2) * 0.008

      // Vector normal frontal de Growy (apunta hacia adelante en el eje +Z)
      const frontNormal = new THREE.Vector3(0, 0, 1)
      frontNormal.applyQuaternion(groupRef.current.quaternion)

      // Vector de dirección hacia la cámara
      const toCamera = state.camera.position.clone().sub(groupRef.current.position).normalize()
      const dot = frontNormal.dot(toCamera)

      // Si dot > 0.08, la cámara está mirando de frente a la pantalla
      const isFront = dot > 0.08
      if (isFront !== screenVisible) {
        setScreenVisible(isFront)
      }

      // Si dot < -0.08, la cámara está detrás de Growy
      const isBehind = dot < -0.08
      if (isBehind !== cameraIsBehind) {
        setCameraIsBehind(isBehind)
      }
    }
  })

  // Textura procedural de polímero técnico resistente impreso en 3D
  const technicalPolymerTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = '#0f131a'
    ctx.fillRect(0, 0, 64, 64)

    for (let x = 0; x < 64; x += 16) {
      for (let y = 0; y < 64; y += 16) {
        if ((x / 16 + y / 16) % 2 === 0) {
          ctx.fillStyle = '#171d26'
          ctx.fillRect(x, y, 16, 16)
          ctx.fillStyle = '#202734'
          ctx.fillRect(x + 2, y + 2, 12, 12)
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    return texture
  }, [])

  // Materiales PBR 100% opacos
  const materials = useMemo(() => {
    return {
      graphiteBody: new THREE.MeshStandardMaterial({
        color: '#12161f',
        roughness: 0.52,
        metalness: 0.2,
      }),
      carbonPlate: new THREE.MeshStandardMaterial({
        color: '#161b24',
        map: technicalPolymerTexture || undefined,
        roughness: 0.45,
        metalness: 0.35,
      }),
      allenScrew: new THREE.MeshStandardMaterial({
        color: '#c8d2e0',
        metalness: 0.95,
        roughness: 0.18,
      }),
      rubberClamp: new THREE.MeshStandardMaterial({
        color: '#0d1017',
        roughness: 0.75,
        metalness: 0.1,
      }),
      screenGlass: new THREE.MeshStandardMaterial({
        color: '#020408',
        roughness: 0.12,
        metalness: 0.1,
      }),
      sensorVent: new THREE.MeshStandardMaterial({
        color: '#080c14',
        roughness: 0.8,
        metalness: 0.5,
      }),
      glowEmerald: new THREE.MeshStandardMaterial({
        color: '#10b981',
        emissive: '#10b981',
        emissiveIntensity: 1.0,
        roughness: 0.2,
      }),
      technicalLabel: new THREE.MeshStandardMaterial({
        color: '#242e3d',
        metalness: 0.82,
        roughness: 0.28,
      }),
      aluminumCNC: new THREE.MeshStandardMaterial({
        color: '#475569',
        metalness: 0.92,
        roughness: 0.25,
      })
    }
  }, [technicalPolymerTexture])

  return (
    <group ref={groupRef} position={[0, 0.1, 0.6]}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. ABRAZADERAS TRASERAS DE MONTAJE AL CAÑO (DUAL HEAVY CLAMPS) */}
      {/* Abrazan directamente el travesaño frontal en z = 0           */}
      {/* ──────────────────────────────────────────────────────────── */}
      {[-0.46, 0.46].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0]}>
          {/* Anillo de la abrazadera alrededor del caño */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.aluminumCNC}>
            <cylinderGeometry args={[0.072, 0.072, 0.12, 24]} />
          </mesh>
          {/* Brazo de anclaje que une el caño con la carcasa */}
          <mesh position={[0, 0, 0.08]} material={materials.graphiteBody}>
            <boxGeometry args={[0.11, 0.18, 0.14]} />
          </mesh>
          {/* Tornillo Allen de ajuste */}
          <mesh position={[0, 0.075, 0]} material={materials.allenScrew}>
            <cylinderGeometry args={[0.016, 0.016, 0.08, 12]} />
          </mesh>
        </group>
      ))}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. CHASIS PRINCIPAL DE GROWY (TAMAÑO INDUSTRIAL REALISTA)     */}
      {/* ──────────────────────────────────────────────────────────── */}
      
      {/* Placa trasera sólida totalmente opaca (evita cualquier artefacto) */}
      <mesh position={[0, 0, 0.14]} rotation={[0, Math.PI, 0]} material={materials.graphiteBody}>
        <boxGeometry args={[1.48, 1.25, 0.04]} />
      </mesh>

      {/* Placa técnica metálica grabada en láser en el dorso */}
      <mesh position={[0, -0.15, 0.118]} rotation={[0, Math.PI, 0]} material={materials.technicalLabel}>
        <boxGeometry args={[0.85, 0.32, 0.008]} />
      </mesh>
      {cameraIsBehind && (
        <Html position={[0, -0.15, 0.112]} rotation={[0, Math.PI, 0]} transform distanceFactor={1.8}>
          <div className="text-center font-mono text-[7px] text-slate-300 select-none bg-black/75 p-1.5 rounded border border-white/10 shadow-lg">
            <div className="text-emerald-400 font-bold text-[8px]">GROWY INDUSTRIAL CONTROLLER</div>
            <div className="text-slate-400 text-[6.5px] mt-0.5">MODEL G1-PRO • TRAZAPP BIOTECH</div>
            <div className="text-slate-500 text-[6px]">IP65 • 24V DC • MCP v1.0 EMBEDDED</div>
          </div>
        </Html>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. MÓDULO SUPERIOR: PANTALLA TÁCTIL (COMO EN LAS FOTOS)       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0.22, 0.18]}>
        {/* Carcasa del bisel de pantalla */}
        <mesh material={materials.carbonPlate}>
          <boxGeometry args={[1.42, 0.74, 0.08]} />
        </mesh>

        {/* Marco de cristal frontal */}
        <mesh position={[0, 0, 0.042]} material={materials.screenGlass}>
          <planeGeometry args={[1.32, 0.66]} />
        </mesh>

        {/* Pantalla digital interactiva (ocultada por dot-product al ver de atrás) */}
        {screenVisible && (
          <Html
            transform
            distanceFactor={1.875}
            position={[0, 0, 0.048]}
            className="w-[540px] h-[270px] rounded-lg overflow-hidden shadow-2xl pointer-events-auto select-none"
          >
            <GrowyScreenContent
              mode={mode}
              onToggleMode={onToggleMode}
              alertActive={alertActive}
              alertMessage={alertMessage}
              telemetry={telemetry}
            />
          </Html>
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MÓDULO MEDIO: BOTÓN CENTRAL Y REJILLAS ESPIRALES (FOTO REAL) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, -0.26, 0.18]}>
        <mesh material={materials.graphiteBody}>
          <boxGeometry args={[1.42, 0.26, 0.08]} />
        </mesh>

        {/* Botón táctil central iluminado */}
        <mesh position={[0, 0, 0.045]} material={materials.allenScrew}>
          <boxGeometry args={[0.16, 0.14, 0.02]} />
        </mesh>
        <mesh position={[0, 0, 0.056]} material={materials.glowEmerald}>
          <circleGeometry args={[0.035, 16]} />
        </mesh>

        {/* Rejillas espirales de ventilación / sensores (Izquierda y Derecha) */}
        {[-0.42, 0.42].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0.045]}>
            <mesh material={materials.sensorVent}>
              <ringGeometry args={[0.025, 0.055, 20]} />
            </mesh>
            <mesh material={materials.sensorVent}>
              <ringGeometry args={[0.075, 0.105, 20]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. MÓDULO INFERIOR: PLACA ARTICULADA CON DEFLECTORES           */}
      {/* Idéntico al bracket inferior visible en growy-photo-screen.jpg*/}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, -0.52, 0.17]}>
        {/* Bisagras de conexión */}
        {[-0.35, 0.35].map((xHinge, i) => (
          <mesh key={i} position={[xHinge, 0.12, 0.02]} rotation={[0, 0, Math.PI / 2]} material={materials.allenScrew}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
          </mesh>
        ))}

        {/* Placa deflectora inferior */}
        <mesh material={materials.graphiteBody}>
          <boxGeometry args={[1.4, 0.3, 0.04]} />
        </mesh>

        {/* Rejillas circulares de la placa inferior */}
        {[-0.42, 0.42].map((xPos, idx) => (
          <mesh key={idx} position={[xPos, 0, 0.022]} material={materials.sensorVent}>
            <ringGeometry args={[0.04, 0.09, 20]} />
          </mesh>
        ))}

        {/* Conector M12 inferior para la sonda de suelo */}
        <mesh position={[0, -0.16, 0]} material={materials.allenScrew}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
        </mesh>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. MICRO-BEACONS INTERACTIVOS (HOVER EXPAND)                 */}
      {/* ──────────────────────────────────────────────────────────── */}

      {/* 1. Hotspot Pantalla */}
      {screenVisible && (
        <Html position={[0, 0.65, 0.22]} center distanceFactor={2.4}>
          <div
            onMouseEnter={() => setHoveredHotspot('screen')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('screen')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'screen'
                ? 'w-6 h-6 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-5 h-5 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[9px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9px] font-bold px-2 py-0.5 backdrop-blur-md border ${
              activeHotspot === 'screen' || hoveredHotspot === 'screen'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Pantalla Táctil
            </div>
          </div>
        </Html>
      )}

      {/* 2. Hotspot Sensores Ambientales */}
      {screenVisible && (
        <Html position={[0.68, -0.26, 0.22]} center distanceFactor={2.4}>
          <div
            onMouseEnter={() => setHoveredHotspot('sensors')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('sensors')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'sensors'
                ? 'w-6 h-6 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-5 h-5 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[9px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3.5s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9px] font-bold px-2 py-0.5 backdrop-blur-md border ${
              activeHotspot === 'sensors' || hoveredHotspot === 'sensors'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Sensores Suelo/Aire
            </div>
          </div>
        </Html>
      )}

      {/* 3. Hotspot Protocolo MCP */}
      {screenVisible && (
        <Html position={[0, -0.74, 0.2]} center distanceFactor={2.4}>
          <div
            onMouseEnter={() => setHoveredHotspot('mcp')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('mcp')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'mcp'
                ? 'w-6 h-6 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-5 h-5 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[9px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:4s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9px] font-bold px-2 py-0.5 backdrop-blur-md border ${
              activeHotspot === 'mcp' || hoveredHotspot === 'mcp'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Protocolo MCP
            </div>
          </div>
        </Html>
      )}

      {/* 4. Hotspot Montaje: Visible desde ATRÁS */}
      {cameraIsBehind && (
        <Html position={[0, 0.25, -0.15]} center distanceFactor={2.4}>
          <div
            onMouseEnter={() => setHoveredHotspot('mount')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('mount')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'mount'
                ? 'w-6 h-6 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-5 h-5 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[9px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9px] font-bold px-2 py-0.5 backdrop-blur-md border ${
              activeHotspot === 'mount' || hoveredHotspot === 'mount'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Fijación Caño
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
