import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

interface GrowBedEnvironmentProps {
  activeHotspot: string | null
  onSelectHotspot: (hotspot: string) => void
  telemetry: {
    temp: number
    hum: number
    vpd: number
    soilMoisture: number
  }
}

export function GrowBedEnvironment({
  activeHotspot,
  onSelectHotspot,
  telemetry
}: GrowBedEnvironmentProps) {
  const foliageGroupRef = useRef<THREE.Group>(null)

  // Micro-oscilación botánica de las plantas simulando el flujo laminar de aire en la sala técnica
  useFrame((state) => {
    if (foliageGroupRef.current) {
      const t = state.clock.getElapsedTime()
      foliageGroupRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 1.3 + i * 0.7) * 0.018
        child.rotation.x = Math.cos(t * 1.1 + i * 0.5) * 0.014
      })
    }
  })

  // Materiales PBR de alta fidelidad para el cultivo
  const materials = useMemo(() => {
    return {
      // Tela geotextil transpirable de la cama elevada B2
      fabricBed: new THREE.MeshStandardMaterial({
        color: '#1a1f26',
        roughness: 0.88,
        metalness: 0.05,
      }),
      // Borde reforzado con costura técnica
      bedRim: new THREE.MeshStandardMaterial({
        color: '#10141b',
        roughness: 0.92,
        metalness: 0.05,
      }),
      // Base estructural de madera de soporte (como en foto real)
      woodStructure: new THREE.MeshStandardMaterial({
        color: '#5c4028',
        roughness: 0.75,
        metalness: 0.05,
      }),
      // Sustrato orgánico vivo (Living Soil)
      livingSoil: new THREE.MeshStandardMaterial({
        color: '#14100c',
        roughness: 0.96,
        metalness: 0.02,
      }),
      // Estructura tubular de soporte (PVC / Aluminio técnico blanco y gris)
      structurePipe: new THREE.MeshStandardMaterial({
        color: '#8b9ab0',
        metalness: 0.82,
        roughness: 0.28,
      }),
      pipeJointWhite: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.15,
        roughness: 0.4,
      }),
      pipeJoint: new THREE.MeshStandardMaterial({
        color: '#2a3240',
        metalness: 0.7,
        roughness: 0.35,
      }),
      // Luminaria LED - Disipador de aluminio extruido
      ledHeatsink: new THREE.MeshStandardMaterial({
        color: '#1c222e',
        metalness: 0.9,
        roughness: 0.22,
      }),
      // Diodos LED blanco cálido (Full Spectrum 3500K)
      ledWhiteDiodes: new THREE.MeshStandardMaterial({
        color: '#fff5e6',
        emissive: '#fff0d0',
        emissiveIntensity: 2.9,
        roughness: 0.1,
      }),
      // Diodos LED rojo profundo (Deep Red 660nm)
      ledRedDiodes: new THREE.MeshStandardMaterial({
        color: '#ff2d55',
        emissive: '#ff1a40',
        emissiveIntensity: 3.4,
        roughness: 0.1,
      }),
      // Red de tutorado SCROG
      trellisNet: new THREE.MeshStandardMaterial({
        color: '#e8edf5',
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
      }),
      // Tallo botánico leñoso
      plantStem: new THREE.MeshStandardMaterial({
        color: '#2d5a32',
        roughness: 0.75,
        metalness: 0.05,
      }),
      // Hojas de cannabis (Verde clorofila)
      plantLeaf: new THREE.MeshStandardMaterial({
        color: '#286835',
        roughness: 0.42,
        metalness: 0.08,
        side: THREE.DoubleSide,
      }),
      // Hojas apicales nuevas
      plantLeafBright: new THREE.MeshStandardMaterial({
        color: '#3cb352',
        roughness: 0.38,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
      // Cogollos / colas en floración
      plantCola: new THREE.MeshStandardMaterial({
        color: '#348e42',
        emissive: '#13401c',
        emissiveIntensity: 0.2,
        roughness: 0.6,
      }),
      // Sensor industrial de suelo (Sonda XZ-LMUS-SM-TM)
      sensorBody: new THREE.MeshStandardMaterial({
        color: '#0d1117',
        roughness: 0.35,
        metalness: 0.3,
      }),
      sensorProngs: new THREE.MeshStandardMaterial({
        color: '#d0d8e2',
        metalness: 0.98,
        roughness: 0.12,
      }),
      sensorCable: new THREE.MeshStandardMaterial({
        color: '#11151c',
        roughness: 0.8,
        metalness: 0.1,
      }),
      // Ducto corrugado de ventilación
      ventDuct: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        metalness: 0.85,
        roughness: 0.3,
      }),
    }
  }, [])

  // Posiciones de las 27 plantas reales en el bunker de cultivo (9 filas de profundidad en Z x 3 columnas en X)
  // Las plantas se extienden en profundidad desde z = 0.0 (justo detrás de Growy) hasta z = -5.6 (fondo del bunker)
  const plantPositions = useMemo(() => {
    const list: [number, number, number][] = []
    const xPositions = [-0.65, 0.0, 0.65]
    const zPositions = [0.0, -0.7, -1.4, -2.1, -2.8, -3.5, -4.2, -4.9, -5.6]

    xPositions.forEach((x, xi) => {
      zPositions.forEach((z, zi) => {
        const jitterX = ((xi * 11 + zi * 7) % 5 - 2) * 0.03
        const jitterZ = ((xi * 7 + zi * 13) % 5 - 2) * 0.03
        list.push([x + jitterX, -0.45, z + jitterZ])
      })
    })
    return list
  }, [])

  // Curva Bezier 3D para el cable flexible de la sonda XZ-LMUS-SM-TM
  // Sale del conector inferior M12 de Growy en [0, -0.38, 0.6] y baja hasta la sonda en [0.65, -0.42, 0.1]
  const cableTubeGeometry = useMemo(() => {
    const p0 = new THREE.Vector3(0, -0.38, 0.6)
    const p1 = new THREE.Vector3(0.2, -0.55, 0.45)
    const p2 = new THREE.Vector3(0.5, -0.52, 0.25)
    const p3 = new THREE.Vector3(0.65, -0.42, 0.1)
    
    const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3)
    return new THREE.TubeGeometry(curve, 32, 0.016, 10, false)
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. LUMINARIA LED LONGITUDINAL MULTIBARRA EN PROFUNDIDAD       */}
      {/* Se extiende a lo largo de todo el pasillo (desde z = 0.7 a z = -5.8) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 1.7, -2.55]}>
        {/* Luz cenital que baña el cultivo y genera perspectiva real */}
        <spotLight
          position={[0, 0.2, 2.8]}
          target-position={[0, -0.45, -2.5]}
          intensity={3.8}
          distance={9.0}
          angle={Math.PI / 2.3}
          penumbra={0.65}
          color="#fff6eb"
        />
        <pointLight
          position={[0, -0.1, 0]}
          intensity={2.0}
          distance={6.5}
          color="#ff7a59"
        />

        {/* Chasis principal longitudinal */}
        <mesh position={[0, 0.05, 0]} material={materials.ledHeatsink}>
          <boxGeometry args={[1.9, 0.04, 6.5]} />
        </mesh>

        {/* 6 Barras LED paralelas en profundidad como en las fotos y videos reales */}
        {[-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0]}>
            <mesh material={materials.ledHeatsink}>
              <boxGeometry args={[0.08, 0.05, 6.35]} />
            </mesh>
            {/* Tira continua de diodos emisivos blanco cálido */}
            <mesh position={[0, -0.028, 0]} material={materials.ledWhiteDiodes}>
              <boxGeometry args={[0.045, 0.01, 6.25]} />
            </mesh>
            {/* Diodos rojos Deep Red 660nm intercalados */}
            {[-2.8, -2.0, -1.2, -0.4, 0.4, 1.2, 2.0, 2.8].map((zP, i) => (
              <mesh key={i} position={[0, -0.034, zP]} material={materials.ledRedDiodes}>
                <sphereGeometry args={[0.015, 8, 8]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Cables tensores de suspensión desde el techo */}
        {[
          [-0.85, 0.05, -2.8],
          [0.85, 0.05, -2.8],
          [-0.85, 0.05, 0],
          [0.85, 0.05, 0],
          [-0.85, 0.05, 2.8],
          [0.85, 0.05, 2.8],
        ].map((coord, idx) => (
          <mesh key={idx} position={[coord[0], 0.45, coord[2]]} material={materials.structurePipe}>
            <cylinderGeometry args={[0.007, 0.007, 0.9, 6]} />
          </mesh>
        ))}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. DUCTO DE VENTILACIÓN SUPERIOR DE LA SALA                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[-1.35, 1.85, -2.55]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.ventDuct}>
          <cylinderGeometry args={[0.2, 0.2, 6.8, 20]} />
        </mesh>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. ESTRUCTURA TUBULAR DEL CORREDOR Y TRAVESAÑO FRONTAL       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Postes verticales de la estructura a los costados de la cama */}
        {[
          [-1.15, 0.5, 0.6],
          [1.15, 0.5, 0.6],
          [-1.15, 0.5, -2.55],
          [1.15, 0.5, -2.55],
          [-1.15, 0.5, -5.8],
          [1.15, 0.5, -5.8],
        ].map((pos, idx) => (
          <group key={idx} position={[pos[0], pos[1], pos[2]]}>
            <mesh material={materials.structurePipe}>
              <cylinderGeometry args={[0.045, 0.045, 2.4, 16]} />
            </mesh>
            <mesh position={[0, 1.2, 0]} material={materials.pipeJointWhite}>
              <sphereGeometry args={[0.07, 12, 12]} />
            </mesh>
            <mesh position={[0, -0.4, 0]} material={materials.pipeJointWhite}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
            </mesh>
          </group>
        ))}

        {/* ── TRAVESAÑO FRONTAL PRINCIPAL: DONDE SE MONTA GROWY ──────── */}
        {/* Cruza de izquierda a derecha en z = 0.6 a la altura de Growy */}
        <mesh position={[0, 0.1, 0.6]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.045, 0.045, 2.3, 20]} />
        </mesh>

        {/* Largueros longitudinales superiores (corren en Z hacia el fondo) */}
        <mesh position={[-1.15, 1.7, -2.55]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.04, 0.04, 6.5, 16]} />
        </mesh>
        <mesh position={[1.15, 1.7, -2.55]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.04, 0.04, 6.5, 16]} />
        </mesh>

        {/* Travesaños transversales superiores de unión */}
        {[0.6, -2.55, -5.8].map((zBeam, i) => (
          <mesh key={i} position={[0, 1.7, zBeam]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
            <cylinderGeometry args={[0.038, 0.038, 2.3, 16]} />
          </mesh>
        ))}

        {/* Travesaño longitudinal medio que sostiene la red SCROG */}
        <mesh position={[-1.15, 0.08, -2.55]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.035, 0.035, 6.4, 12]} />
        </mesh>
        <mesh position={[1.15, 0.08, -2.55]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.035, 0.035, 6.4, 12]} />
        </mesh>

        {/* Travesaño posterior del fondo */}
        <mesh position={[0, 0.1, -5.8]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.045, 0.045, 2.3, 16]} />
        </mesh>

        {/* Pared técnica del fondo de la sala (a z = -5.9) */}
        <mesh position={[0, 0.5, -5.9]} material={materials.fabricBed}>
          <planeGeometry args={[3.0, 3.2]} />
        </mesh>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. CAMA TEXTIL B2 ELEVADA SOBRE MESA DE MADERA (6.4m EN Z)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, -0.72, -2.55]}>
        {/* Mesa de madera soporte inferior (como en foto real) */}
        <mesh position={[0, -0.32, 0]} material={materials.woodStructure}>
          <boxGeometry args={[2.15, 0.08, 6.4]} />
        </mesh>
        {/* Patas de la mesa */}
        {[-2.8, -1.4, 0, 1.4, 2.8].map((zLeg, i) => (
          <group key={i} position={[0, -0.65, zLeg]}>
            <mesh position={[-0.95, 0, 0]} material={materials.woodStructure}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
            </mesh>
            <mesh position={[0.95, 0, 0]} material={materials.woodStructure}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
            </mesh>
          </group>
        ))}

        {/* Contenedor textil geotextil de la Cama B2 */}
        <mesh position={[0, 0.08, 0]} material={materials.fabricBed}>
          <boxGeometry args={[2.08, 0.56, 6.35]} />
        </mesh>

        {/* Borde superior reforzado con costura */}
        <mesh position={[0, 0.37, 0]} material={materials.bedRim}>
          <boxGeometry args={[2.14, 0.05, 6.42]} />
        </mesh>

        {/* Superficie de Living Soil (Sustrato vivo) */}
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.livingSoil}>
          <planeGeometry args={[2.0, 6.25]} />
        </mesh>

        {/* Rótulo técnico de la Cama B2 en el frontal visible */}
        <Html position={[0, 0.1, 3.22]} center transform distanceFactor={2.4}>
          <div className="px-2.5 py-0.5 rounded bg-black/90 border border-emerald-500/50 text-emerald-400 font-mono text-[8.5px] font-bold tracking-widest flex items-center gap-1.5 shadow-2xl select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CAMA B2 • 27 PLANTAS • LOTE VEG/FLOR</span>
          </div>
        </Html>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. RED DE TUTORADO SCROG A LO LARGO DEL CORREDOR              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0.08, -2.55]}>
        {/* Hilos longitudinales de la red */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.trellisNet}>
            <cylinderGeometry args={[0.005, 0.005, 6.3, 6]} />
          </mesh>
        ))}
        {/* Hilos transversales cada 0.65m en profundidad */}
        {[-2.9, -2.25, -1.6, -0.95, -0.3, 0.35, 1.0, 1.65, 2.3, 2.95].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]} material={materials.trellisNet}>
            <cylinderGeometry args={[0.005, 0.005, 2.05, 6]} />
          </mesh>
        ))}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. CANOPIA DE 27 PLANTAS EXTENDIÉNDOSE HACIA EL FONDO         */}
      {/* Fila 1 está a z = 0.0 (justo detrás de Growy) y fila 9 a z = -5.6 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group ref={foliageGroupRef}>
        {plantPositions.map((pos, pIdx) => {
          const heightScale = 0.88 + (pIdx % 3) * 0.08
          return (
            <group key={pIdx} position={pos} scale={[1, heightScale, 1]}>
              {/* Tallo principal botánico */}
              <mesh position={[0, 0.28, 0]} material={materials.plantStem}>
                <cylinderGeometry args={[0.025, 0.045, 0.56, 8]} />
              </mesh>

              {/* Ramas laterales con hojas compuestas de cannabis */}
              {[0.16, 0.32, 0.46].map((nodeY, nIdx) => (
                <group key={nIdx} position={[0, nodeY, 0]}>
                  {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, leafIdx) => (
                    <group 
                      key={leafIdx} 
                      rotation={[0.28, angle + (pIdx * 0.35), 0.22]}
                    >
                      <mesh position={[0.2, 0.04, 0]} rotation={[0, 0, -0.2]} material={materials.plantLeaf}>
                        <coneGeometry args={[0.12, 0.34, 5]} />
                      </mesh>
                      <mesh position={[0.16, 0.04, 0.08]} rotation={[0, 0.25, -0.22]} material={materials.plantLeafBright}>
                        <coneGeometry args={[0.07, 0.24, 4]} />
                      </mesh>
                      <mesh position={[0.16, 0.04, -0.08]} rotation={[0, -0.25, -0.22]} material={materials.plantLeafBright}>
                        <coneGeometry args={[0.07, 0.24, 4]} />
                      </mesh>
                    </group>
                  ))}
                </group>
              ))}

              {/* Corona apical floreciente (Cola de floración) */}
              <group position={[0, 0.6, 0]}>
                <mesh material={materials.plantCola}>
                  <sphereGeometry args={[0.16, 8, 8]} />
                </mesh>
                {[0, 1.25, 2.5, 3.75, 5.0].map((rotA, i) => (
                  <mesh 
                    key={i} 
                    position={[Math.cos(rotA) * 0.13, 0.04, Math.sin(rotA) * 0.13]} 
                    rotation={[0.35, rotA, 0.25]} 
                    material={materials.plantLeafBright}
                  >
                    <coneGeometry args={[0.065, 0.2, 4]} />
                  </mesh>
                ))}
              </group>
            </group>
          )
        })}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. SONDA INDUSTRIAL DE SUELO (XZ-LMUS-SM-TM)                  */}
      {/* Clavada en el sustrato vivo de la fila delantera             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Cable curvo que baja desde Growy hacia la sonda */}
        <mesh geometry={cableTubeGeometry} material={materials.sensorCable} />

        {/* Sonda clavada en [0.65, -0.42, 0.1] */}
        <group position={[0.65, -0.42, 0.1]}>
          <mesh position={[0, 0.12, 0]} material={materials.sensorBody}>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 16]} />
          </mesh>
          <mesh position={[0, 0.22, 0]} material={materials.pipeJoint}>
            <cylinderGeometry args={[0.03, 0.038, 0.05, 16]} />
          </mesh>
          <mesh position={[0, 0.13, 0]} material={materials.ledWhiteDiodes}>
            <cylinderGeometry args={[0.042, 0.042, 0.015, 16]} />
          </mesh>
          <mesh position={[-0.018, -0.05, 0]} material={materials.sensorProngs}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
          </mesh>
          <mesh position={[0.018, -0.05, 0]} material={materials.sensorProngs}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
          </mesh>

          {/* Micro-beacon de la sonda */}
          <Html position={[0, 0.32, 0]} center distanceFactor={2.4}>
            <div
              onClick={() => onSelectHotspot('soil_probe')}
              className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
            >
              <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                activeHotspot === 'soil_probe'
                  ? 'w-6 h-6 bg-cyan-400 text-black shadow-lg shadow-cyan-400/50 scale-110'
                  : 'w-5 h-5 bg-black/85 border border-cyan-400/60 text-cyan-300 hover:scale-110 hover:border-cyan-300'
              }`}>
                <span className="text-[9px] font-mono font-bold leading-none">+</span>
                <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping [animation-duration:3s]" />
              </div>
              <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9px] font-bold px-2 py-0.5 backdrop-blur-md border ${
                activeHotspot === 'soil_probe'
                  ? 'max-w-[190px] opacity-100 bg-cyan-500 text-black border-cyan-400 shadow-md'
                  : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent group-hover:max-w-[190px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black/90 group-hover:text-cyan-300 group-hover:border-cyan-500/40'
              }`}>
                Sonda Suelo ({telemetry.soilMoisture.toFixed(0)}% VWC)
              </div>
            </div>
          </Html>
        </group>
      </group>
    </group>
  )
}
