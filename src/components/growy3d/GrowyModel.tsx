import { useRef, useMemo } from 'react'
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

  // Suave flotación / respiración biológica del dispositivo
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime()
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.04
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
          ctx.fillStyle = '#1c222e'
          ctx.fillRect(x, y, 16, 16)
          ctx.fillStyle = '#262f3f'
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

  // Materiales PBR
  const materials = useMemo(() => {
    return {
      graphiteBody: new THREE.MeshStandardMaterial({
        color: '#151922',
        roughness: 0.45,
        metalness: 0.25,
      }),
      carbonPlate: new THREE.MeshStandardMaterial({
        color: '#1a202c',
        map: technicalPolymerTexture || undefined,
        roughness: 0.35,
        metalness: 0.4,
      }),
      allenScrew: new THREE.MeshStandardMaterial({
        color: '#c0c8d4',
        metalness: 0.95,
        roughness: 0.15,
      }),
      aluminumPipe: new THREE.MeshStandardMaterial({
        color: '#8b9bb4',
        metalness: 0.85,
        roughness: 0.25,
      }),
      rubberClamp: new THREE.MeshStandardMaterial({
        color: '#0d1017',
        roughness: 0.7,
        metalness: 0.1,
      }),
      screenGlass: new THREE.MeshPhysicalMaterial({
        color: '#04070f',
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.2,
        transparent: true,
        opacity: 0.85,
      }),
      sensorVent: new THREE.MeshStandardMaterial({
        color: '#090d14',
        roughness: 0.8,
        metalness: 0.5,
      }),
      glowEmerald: new THREE.MeshStandardMaterial({
        color: '#10b981',
        emissive: '#10b981',
        emissiveIntensity: 0.8,
        roughness: 0.2,
      })
    }
  }, [technicalPolymerTexture])

  // Coordenadas de los 4 tornillos Allen esquineros frontales
  const screwPositions: [number, number, number][] = [
    [-1.5, 1.15, 0.56],
    [1.5, 1.15, 0.56],
    [-1.5, -1.15, 0.56],
    [1.5, -1.15, 0.56],
    [-1.5, 0.1, 0.56],
    [1.5, 0.1, 0.56],
  ]

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── CAÑO ESTRUCTURAL DE SALA (TENT POLE / MOUNTING PIPE) ────── */}
      <mesh position={[0, 0.35, -1.05]} rotation={[0, 0, Math.PI / 2]} material={materials.aluminumPipe}>
        <cylinderGeometry args={[0.22, 0.22, 7.5, 32]} />
      </mesh>

      {/* ── ABRAZADERAS TRASERAS DE MONTAJE (DUAL CLAMPS) ───────────── */}
      {[-0.85, 0.85].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0.35, -0.65]}>
          {/* Anillo de la abrazadera */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.rubberClamp}>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
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

      {/* ── CUERPO PRINCIPAL (CARCASA INDUSTRIAL GRAFITO) ──────────── */}
      <mesh position={[0, 0, 0]} material={materials.graphiteBody}>
        <boxGeometry args={[3.2, 2.6, 1.05]} />
      </mesh>

      {/* ── PLACA SUPERIOR DE FIBRA DE CARBONO ──────────────────────── */}
      <mesh position={[0, 1.31, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.carbonPlate}>
        <planeGeometry args={[3.1, 0.95]} />
      </mesh>

      {/* ── PANEL TRASERO CON FIBRA DE CARBONO Y LOGO ──────────────── */}
      <mesh position={[0, 0, -0.53]} rotation={[0, Math.PI, 0]} material={materials.carbonPlate}>
        <planeGeometry args={[3.0, 2.4]} />
      </mesh>
      {/* Placa técnica metálica trasera con relieve */}
      <mesh position={[0, -0.4, -0.54]} rotation={[0, Math.PI, 0]} material={materials.aluminumPipe}>
        <planeGeometry args={[1.6, 0.65]} />
      </mesh>

      {/* ── PANEL FRONTAL SUPERIOR (BEZEL PANTALLA) ─────────────────── */}
      <mesh position={[0, 0.32, 0.53]} material={materials.carbonPlate}>
        <planeGeometry args={[2.9, 1.7]} />
      </mesh>

      {/* ── PANTALLA TÁCTIL DE ALTA DEFINICIÓN (HTML 3D TRANSFORM) ─── */}
      <group position={[0, 0.32, 0.54]}>
        {/* Base de la pantalla con vidrio físico */}
        <mesh material={materials.screenGlass}>
          <planeGeometry args={[2.7, 1.5]} />
        </mesh>

        {/* Contenido interactivo renderizado con DOM real en el espacio 3D */}
        <Html
          transform
          distanceFactor={1.9}
          position={[0, 0, 0.01]}
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
      </group>

      {/* ── VISERA FRONTAL INFERIOR CON REJILLAS DE VENTILACIÓN ─────── */}
      <group position={[0, -0.85, 0.45]}>
        {/* Placa abatible inferior */}
        <mesh material={materials.graphiteBody}>
          <boxGeometry args={[3.0, 0.72, 0.35]} />
        </mesh>
        <mesh position={[0, 0, 0.18]} material={materials.carbonPlate}>
          <planeGeometry args={[2.8, 0.65]} />
        </mesh>

        {/* Dial / Selector central con anillo de fibra de carbono */}
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
          {/* Cabeza del tornillo cilíndrico */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.allenScrew}>
            <cylinderGeometry args={[0.075, 0.075, 0.08, 16]} />
          </mesh>
          {/* Hendidura hexagonal Allen interior */}
          <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubberClamp}>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 6]} />
          </mesh>
        </group>
      ))}

      {/* ── TOMA INFERIOR DE SONDA DE SUELO (CONECTOR INDUSTRIAL M12) ── */}
      <group position={[0, -1.35, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} material={materials.allenScrew}>
          <cylinderGeometry args={[0.14, 0.14, 0.22, 16]} />
        </mesh>
        {/* Cable trenzado negro que va hacia las macetas */}
        <mesh position={[0, -0.35, 0]} material={materials.rubberClamp}>
          <cylinderGeometry args={[0.06, 0.06, 0.55, 16]} />
        </mesh>
      </group>

      {/* ── HOTSPOTS / PUNTOS DE INSPECCIÓN FLOTANTES EN 3D ─────────── */}
      {/* Hotspot 1: Pantalla TrazAPP SENSE */}
      <Html position={[0, 1.2, 0.6]} center>
        <button
          onClick={() => onSelectHotspot('screen')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-all backdrop-blur-md cursor-pointer border shadow-lg ${
            activeHotspot === 'screen'
              ? 'bg-emerald-500 text-black border-emerald-400 scale-110 shadow-emerald-500/40'
              : 'bg-black/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
          }`}
        >
          [+] Pantalla Touch
        </button>
      </Html>

      {/* Hotspot 2: Sensores Suelo & Aire */}
      <Html position={[1.4, -0.9, 0.6]} center>
        <button
          onClick={() => onSelectHotspot('sensors')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-all backdrop-blur-md cursor-pointer border shadow-lg ${
            activeHotspot === 'sensors'
              ? 'bg-emerald-500 text-black border-emerald-400 scale-110 shadow-emerald-500/40'
              : 'bg-black/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
          }`}
        >
          [+] Sensores Suelo/Aire
        </button>
      </Html>

      {/* Hotspot 3: Montaje Universal Caño */}
      <Html position={[-1.4, 0.7, -0.7]} center>
        <button
          onClick={() => onSelectHotspot('mount')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-all backdrop-blur-md cursor-pointer border shadow-lg ${
            activeHotspot === 'mount'
              ? 'bg-emerald-500 text-black border-emerald-400 scale-110 shadow-emerald-500/40'
              : 'bg-black/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
          }`}
        >
          [+] Montaje Caño
        </button>
      </Html>

      {/* Hotspot 4: Agente IA MCP Autónomo */}
      <Html position={[0, -1.8, 0.2]} center>
        <button
          onClick={() => onSelectHotspot('mcp')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-all backdrop-blur-md cursor-pointer border shadow-lg ${
            activeHotspot === 'mcp'
              ? 'bg-emerald-500 text-black border-emerald-400 scale-110 shadow-emerald-500/40'
              : 'bg-black/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
          }`}
        >
          [+] Protocolo MCP
        </button>
      </Html>
    </group>
  )
}
