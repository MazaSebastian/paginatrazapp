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
      groupRef.current.position.y = Math.sin(t * 1.1) * 0.025

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

  // Textura procedural de polímero técnico impreso en 3D
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
          ctx.fillStyle = '#181e28'
          ctx.fillRect(x, y, 16, 16)
          ctx.fillStyle = '#222938'
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

  // Materiales PBR 100% opacos (sin transparencia que genere artefactos de z-buffer)
  const materials = useMemo(() => {
    return {
      graphiteBody: new THREE.MeshStandardMaterial({
        color: '#131720',
        roughness: 0.55,
        metalness: 0.2,
      }),
      carbonPlate: new THREE.MeshStandardMaterial({
        color: '#171c26',
        map: technicalPolymerTexture || undefined,
        roughness: 0.45,
        metalness: 0.35,
      }),
      allenScrew: new THREE.MeshStandardMaterial({
        color: '#c8d2e0',
        metalness: 0.95,
        roughness: 0.18,
      }),
      aluminumPipe: new THREE.MeshStandardMaterial({
        color: '#8b9bb4',
        metalness: 0.88,
        roughness: 0.22,
      }),
      rubberClamp: new THREE.MeshStandardMaterial({
        color: '#0d1017',
        roughness: 0.75,
        metalness: 0.1,
      }),
      screenGlass: new THREE.MeshStandardMaterial({
        color: '#03050a',
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
        emissiveIntensity: 0.9,
        roughness: 0.2,
      }),
      technicalLabel: new THREE.MeshStandardMaterial({
        color: '#2a3444',
        metalness: 0.8,
        roughness: 0.3,
      })
    }
  }, [technicalPolymerTexture])

  // Coordenadas de los 6 tornillos Allen esquineros frontales
  const screwPositions: [number, number, number][] = [
    [-1.5, 1.15, 0.56],
    [1.5, 1.15, 0.56],
    [-1.5, -1.15, 0.56],
    [1.5, -1.15, 0.56],
    [-1.5, 0.1, 0.56],
    [1.5, 0.1, 0.56],
  ]

  return (
    <group ref={groupRef} position={[0, 0.25, 0]}>
      {/* ── CAÑO ESTRUCTURAL DE SALA (TENT POLE / MOUNTING PIPE) ────── */}
      <mesh position={[0, 0.35, -1.05]} rotation={[0, 0, Math.PI / 2]} material={materials.aluminumPipe}>
        <cylinderGeometry args={[0.22, 0.22, 7.5, 32]} />
      </mesh>

      {/* ── ABRAZADERAS TRASERAS DE MONTAJE (DUAL HEAVY CLAMPS) ─────── */}
      {[-0.85, 0.85].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.35, -0.65]}>
          {/* Anillo de la abrazadera */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.rubberClamp}>
            <cylinderGeometry args={[0.32, 0.32, 0.24, 24]} />
          </mesh>
          {/* Brazo de anclaje a la carcasa */}
          <mesh position={[0, -0.15, 0.22]} material={materials.graphiteBody}>
            <boxGeometry args={[0.24, 0.35, 0.38]} />
          </mesh>
          {/* Tornillo pasante de ajuste */}
          <mesh position={[0, 0.32, 0]} material={materials.allenScrew}>
            <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
          </mesh>
        </group>
      ))}

      {/* ── CUERPO PRINCIPAL OPACO (CARCASA INDUSTRIAL GRAFITO) ─────── */}
      <mesh position={[0, 0, 0]} material={materials.graphiteBody}>
        <boxGeometry args={[3.2, 2.6, 1.05]} />
      </mesh>

      {/* ── PLACA SUPERIOR DE FIBRA DE CARBONO ──────────────────────── */}
      <mesh position={[0, 1.31, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.carbonPlate}>
        <planeGeometry args={[3.1, 0.95]} />
      </mesh>

      {/* ── PARTE TRASERA: PANEL SÓLIDO TOTALMENTE OPACO ─────────────── */}
      <mesh position={[0, 0, -0.53]} rotation={[0, Math.PI, 0]} material={materials.carbonPlate}>
        <planeGeometry args={[3.05, 2.45]} />
      </mesh>

      {/* Placa técnica metálica trasera grabada en láser */}
      <mesh position={[0, -0.45, -0.54]} rotation={[0, Math.PI, 0]} material={materials.technicalLabel}>
        <boxGeometry args={[1.8, 0.7, 0.015]} />
      </mesh>

      {/* Rotulado técnico impreso sobre la placa trasera */}
      {cameraIsBehind && (
        <Html position={[0, -0.45, -0.56]} rotation={[0, Math.PI, 0]} transform distanceFactor={2.5}>
          <div className="text-center font-mono text-[8px] text-slate-300 select-none bg-black/40 p-2 rounded border border-white/10">
            <div className="text-emerald-400 font-bold text-[9px]">GROWY INDUSTRIAL CONTROLLER</div>
            <div className="text-slate-400 text-[7.5px] mt-0.5">MODEL G1-PRO • MCP v1.0 EMBEDDED</div>
            <div className="text-slate-500 text-[7px]">IP65 RATED • 24V DC • TRAZAPP BIOTECH</div>
          </div>
        </Html>
      )}

      {/* ── PANEL FRONTAL SUPERIOR (BEZEL PANTALLA) ─────────────────── */}
      <mesh position={[0, 0.32, 0.53]} material={materials.carbonPlate}>
        <planeGeometry args={[2.9, 1.7]} />
      </mesh>

      {/* ── PANTALLA TÁCTIL (OCULTADA AUTOMÁTICAMENTE AL MIRAR DE ATRÁS) ── */}
      <group position={[0, 0.32, 0.54]}>
        {/* Vidrio frontal 100% opaco con marco negro */}
        <mesh material={materials.screenGlass}>
          <planeGeometry args={[2.7, 1.5]} />
        </mesh>

        {/* El contenido HTML interactivo SOLO se renderiza cuando la cámara mira de frente */}
        {screenVisible && (
          <Html
            transform
            distanceFactor={1.9}
            position={[0, 0, 0.015]}
            className="w-[380px] h-[220px] rounded-xl overflow-hidden shadow-2xl pointer-events-auto"
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

      {/* ── VISERA FRONTAL INFERIOR CON REJILLAS DE VENTILACIÓN ─────── */}
      <group position={[0, -0.85, 0.45]}>
        <mesh material={materials.graphiteBody}>
          <boxGeometry args={[3.0, 0.72, 0.35]} />
        </mesh>
        <mesh position={[0, 0, 0.18]} material={materials.carbonPlate}>
          <planeGeometry args={[2.8, 0.65]} />
        </mesh>

        {/* Dial central con anillo de fibra de carbono */}
        <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} material={materials.allenScrew}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.29]} material={materials.glowEmerald}>
          <circleGeometry args={[0.07, 16]} />
        </mesh>

        {/* Rejillas circulares concéntricas de sensores (Izquierda y Derecha) */}
        {[-0.85, 0.85].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0.19]}>
            <mesh material={materials.sensorVent}>
              <ringGeometry args={[0.05, 0.12, 24]} />
            </mesh>
            <mesh material={materials.sensorVent}>
              <ringGeometry args={[0.16, 0.22, 24]} />
            </mesh>
            <mesh material={materials.sensorVent}>
              <ringGeometry args={[0.25, 0.29, 24]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── TORNILLERÍA ALLEN VISTA METÁLICA ────────────────────────── */}
      {screwPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.allenScrew}>
            <cylinderGeometry args={[0.075, 0.075, 0.08, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubberClamp}>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 6]} />
          </mesh>
        </group>
      ))}

      {/* ── TOMA INFERIOR DE SONDA DE SUELO (CONECTOR INDUSTRIAL M12) ── */}
      <group position={[0, -1.35, 0]}>
        <mesh position={[0, 0, 0]} material={materials.allenScrew}>
          <cylinderGeometry args={[0.14, 0.14, 0.22, 16]} />
        </mesh>
        <mesh position={[0, -0.2, 0]} material={materials.rubberClamp}>
          <cylinderGeometry args={[0.06, 0.06, 0.25, 16]} />
        </mesh>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MICRO-BEACONS INTERACTIVOS HIGH-END (PULSO SUTIL + EXPAND HOVER) */}
      {/* ──────────────────────────────────────────────────────────── */}

      {/* 1. Hotspot Pantalla: Sólo visible desde el frente */}
      {screenVisible && (
        <Html position={[0, 1.45, 0.6]} center distanceFactor={3.2}>
          <div
            onMouseEnter={() => setHoveredHotspot('screen')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('screen')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'screen'
                ? 'w-7 h-7 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-6 h-6 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[10px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9.5px] font-bold px-2.5 py-1 backdrop-blur-md border ${
              activeHotspot === 'screen' || hoveredHotspot === 'screen'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Pantalla Táctil
            </div>
          </div>
        </Html>
      )}

      {/* 2. Hotspot Sensores Ambientales: En la visera frontal */}
      {screenVisible && (
        <Html position={[1.35, -0.85, 0.6]} center distanceFactor={3.2}>
          <div
            onMouseEnter={() => setHoveredHotspot('sensors')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('sensors')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'sensors'
                ? 'w-7 h-7 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-6 h-6 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[10px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3.5s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9.5px] font-bold px-2.5 py-1 backdrop-blur-md border ${
              activeHotspot === 'sensors' || hoveredHotspot === 'sensors'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Sensores Suelo/Aire
            </div>
          </div>
        </Html>
      )}

      {/* 3. Hotspot Protocolo MCP: Centro inferior */}
      {screenVisible && (
        <Html position={[0, -1.8, 0.4]} center distanceFactor={3.2}>
          <div
            onMouseEnter={() => setHoveredHotspot('mcp')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('mcp')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'mcp'
                ? 'w-7 h-7 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-6 h-6 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[10px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:4s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9.5px] font-bold px-2.5 py-1 backdrop-blur-md border ${
              activeHotspot === 'mcp' || hoveredHotspot === 'mcp'
                ? 'max-w-[180px] opacity-100 bg-emerald-500 text-black border-emerald-400 shadow-md'
                : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent'
            }`}>
              Protocolo MCP
            </div>
          </div>
        </Html>
      )}

      {/* 4. Hotspot Montaje: Sólo visible cuando se mira desde ATRÁS */}
      {cameraIsBehind && (
        <Html position={[0, 0.9, -0.8]} center distanceFactor={3.2}>
          <div
            onMouseEnter={() => setHoveredHotspot('mount')}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => onSelectHotspot('mount')}
            className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
          >
            <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
              activeHotspot === 'mount'
                ? 'w-7 h-7 bg-emerald-400 text-black shadow-lg shadow-emerald-400/50 scale-110'
                : 'w-6 h-6 bg-black/85 border border-emerald-400/60 text-emerald-300 hover:scale-110 hover:border-emerald-300'
            }`}>
              <span className="text-[10px] font-mono font-bold leading-none">+</span>
              <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping [animation-duration:3s]" />
            </div>
            <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9.5px] font-bold px-2.5 py-1 backdrop-blur-md border ${
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

