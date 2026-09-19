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

  // Suave micro-oscilación de las plantas simulando el flujo de los ventiladores de la sala
  useFrame((state) => {
    if (foliageGroupRef.current) {
      const t = state.clock.getElapsedTime()
      foliageGroupRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 1.4 + i * 0.8) * 0.02
        child.rotation.x = Math.cos(t * 1.1 + i * 0.6) * 0.015
      })
    }
  })

  // Materiales de alta fidelidad para el cultivo
  const materials = useMemo(() => {
    return {
      // Tela geotextil transpirable de la cama elevada
      fabricBed: new THREE.MeshStandardMaterial({
        color: '#1a1f26',
        roughness: 0.88,
        metalness: 0.05,
      }),
      // Borde reforzado con costura técnica
      bedRim: new THREE.MeshStandardMaterial({
        color: '#11151c',
        roughness: 0.92,
        metalness: 0.05,
      }),
      // Sustrato orgánico vivo (Living Soil)
      livingSoil: new THREE.MeshStandardMaterial({
        color: '#16120e',
        roughness: 0.95,
        metalness: 0.02,
      }),
      // Estructura tubular de soporte (Aluminio técnico)
      structurePipe: new THREE.MeshStandardMaterial({
        color: '#758398',
        metalness: 0.85,
        roughness: 0.28,
      }),
      pipeJoint: new THREE.MeshStandardMaterial({
        color: '#2a3240',
        metalness: 0.7,
        roughness: 0.35,
      }),
      // Luminaria LED - Disipador de aluminio anodizado
      ledHeatsink: new THREE.MeshStandardMaterial({
        color: '#1e2430',
        metalness: 0.9,
        roughness: 0.2,
      }),
      // Diodos LED blanco cálido (Full Spectrum 3500K)
      ledWhiteDiodes: new THREE.MeshStandardMaterial({
        color: '#fff5e6',
        emissive: '#fff0d0',
        emissiveIntensity: 2.8,
        roughness: 0.1,
      }),
      // Diodos LED rojo profundo (Deep Red 660nm de floración)
      ledRedDiodes: new THREE.MeshStandardMaterial({
        color: '#ff2d55',
        emissive: '#ff1a40',
        emissiveIntensity: 3.2,
        roughness: 0.1,
      }),
      // Red de tutorado (Trellis netting)
      trellisNet: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.5,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6,
      }),
      // Tallo botánico
      plantStem: new THREE.MeshStandardMaterial({
        color: '#27522d',
        roughness: 0.75,
        metalness: 0.05,
      }),
      // Hojas de cannabis (Verde clorofila con sutil translucidez)
      plantLeaf: new THREE.MeshStandardMaterial({
        color: '#2d6a36',
        roughness: 0.45,
        metalness: 0.08,
        side: THREE.DoubleSide,
      }),
      // Hojas nuevas superiores
      plantLeafBright: new THREE.MeshStandardMaterial({
        color: '#3da34c',
        roughness: 0.4,
        metalness: 0.05,
        side: THREE.DoubleSide,
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
        color: '#10141d',
        roughness: 0.8,
        metalness: 0.1,
      }),
    }
  }, [])

  // Posiciones de las plantas en la cama B2 (3 filas x 4 columnas sobre la cama)
  const plantPositions = useMemo(() => {
    const list: [number, number, number][] = []
    const xPositions = [-2.0, -0.7, 0.7, 2.0]
    const zPositions = [-0.6, 0.2, 0.9]

    xPositions.forEach((x, xi) => {
      zPositions.forEach((z, zi) => {
        // Leves variaciones naturales de ubicación y escala
        const jitterX = ((xi * 13 + zi * 7) % 5 - 2) * 0.06
        const jitterZ = ((xi * 7 + zi * 11) % 5 - 2) * 0.06
        list.push([x + jitterX, -1.62, z + jitterZ])
      })
    })
    return list
  }, [])

  // Curva Bezier 3D para el cable flexible que une Growy con la sonda de suelo
  const cableTubeGeometry = useMemo(() => {
    // Origen: Conector inferior de Growy en [0, -1.1, 0]
    // Destino: Cabezal de la sonda clavada en el sustrato [1.1, -2.15, 0.55]
    const p0 = new THREE.Vector3(0, -1.1, 0)
    const p1 = new THREE.Vector3(0.2, -1.6, 0.1)
    const p2 = new THREE.Vector3(0.65, -2.25, 0.35)
    const p3 = new THREE.Vector3(1.1, -2.15, 0.55)
    
    const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3)
    return new THREE.TubeGeometry(curve, 32, 0.026, 12, false)
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. LUMINARIA LED PROFESIONAL SUPERIOR MULTIBARRA              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 2.8, -0.1]}>
        {/* Luz cenital biológica emitida por las barras hacia la cama */}
        <spotLight
          position={[0, 0.1, 0]}
          target-position={[0, -2.0, 0]}
          intensity={3.4}
          distance={7.0}
          angle={Math.PI / 2.5}
          penumbra={0.7}
          color="#fff6e8"
        />
        {/* Acento lumínico de espectro PAR rojizo */}
        <pointLight
          position={[0, -0.2, 0]}
          intensity={1.9}
          distance={4.5}
          color="#ff7a59"
        />

        {/* Chasis principal de la lámpara */}
        <mesh position={[0, 0.08, 0]} material={materials.ledHeatsink}>
          <boxGeometry args={[5.2, 0.06, 2.4]} />
        </mesh>

        {/* 5 Barras LED paralelas de disipación de calor */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((zPos, idx) => (
          <group key={idx} position={[0, 0, zPos]}>
            <mesh material={materials.ledHeatsink}>
              <boxGeometry args={[5.0, 0.09, 0.16]} />
            </mesh>
            <mesh position={[0, -0.05, 0]} material={materials.ledWhiteDiodes}>
              <boxGeometry args={[4.85, 0.015, 0.07]} />
            </mesh>
            {[-2.0, -1.2, -0.4, 0.4, 1.2, 2.0].map((xP, i) => (
              <mesh key={i} position={[xP, -0.055, 0]} material={materials.ledRedDiodes}>
                <sphereGeometry args={[0.024, 12, 12]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Cables tensores que suspenden la lámpara */}
        {[
          [-2.2, 0.08, -1.0],
          [2.2, 0.08, -1.0],
          [-2.2, 0.08, 1.0],
          [2.2, 0.08, 1.0]
        ].map((coord, idx) => (
          <mesh key={idx} position={[coord[0], 0.7, coord[2]]} material={materials.structurePipe}>
            <cylinderGeometry args={[0.012, 0.012, 1.3, 8]} />
          </mesh>
        ))}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. ESTRUCTURA TUBULAR DE LA SALA TÉCNICA                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Postes verticales esquineros */}
        {[
          [-3.0, 0.1, -1.4],
          [3.0, 0.1, -1.4],
          [-3.0, 0.1, 1.4],
          [3.0, 0.1, 1.4],
        ].map((pos, idx) => (
          <group key={idx} position={[pos[0], pos[1], pos[2]]}>
            <mesh material={materials.structurePipe}>
              <cylinderGeometry args={[0.08, 0.08, 5.6, 16]} />
            </mesh>
            <mesh position={[0, 2.7, 0]} material={materials.pipeJoint}>
              <sphereGeometry args={[0.13, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* Travesaños superiores perimetrales */}
        <mesh position={[0, 2.8, -1.4]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.07, 0.07, 6.0, 16]} />
        </mesh>
        <mesh position={[0, 2.8, 1.4]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.07, 0.07, 6.0, 16]} />
        </mesh>
        <mesh position={[-3.0, 2.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.07, 0.07, 2.8, 16]} />
        </mesh>
        <mesh position={[3.0, 2.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.07, 0.07, 2.8, 16]} />
        </mesh>

        {/* Travesaño perimetral inferior de base de cama */}
        <mesh position={[0, -2.25, -1.4]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.06, 0.06, 6.0, 16]} />
        </mesh>
        <mesh position={[0, -2.25, 1.4]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.06, 0.06, 6.0, 16]} />
        </mesh>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. CAMA DE CULTIVO TEXTIL ELEVADA ("CAMA B2")                */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, -2.7, 0]}>
        {/* Cuerpo textil de la cama (Living Soil Bed) */}
        <mesh position={[0, 0, 0]} material={materials.fabricBed}>
          <boxGeometry args={[5.6, 0.85, 2.6]} />
        </mesh>

        {/* Borde superior perimetral reforzado con costura */}
        <mesh position={[0, 0.44, 0]} material={materials.bedRim}>
          <boxGeometry args={[5.7, 0.08, 2.7]} />
        </mesh>

        {/* Superficie de sustrato orgánico / Living Soil */}
        <mesh position={[0, 0.43, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.livingSoil}>
          <planeGeometry args={[5.45, 2.45]} />
        </mesh>

        {/* Patas de apoyo elevadas */}
        {[-2.4, 0, 2.4].map((xP, i) => (
          <group key={i} position={[xP, -0.6, 0]}>
            <mesh position={[0, 0, -1.1]} material={materials.pipeJoint}>
              <boxGeometry args={[0.18, 0.4, 0.18]} />
            </mesh>
            <mesh position={[0, 0, 1.1]} material={materials.pipeJoint}>
              <boxGeometry args={[0.18, 0.4, 0.18]} />
            </mesh>
          </group>
        ))}

        {/* Cartel identificatorio técnico de la cama */}
        <Html position={[0, 0.15, 1.34]} center transform distanceFactor={3.2}>
          <div className="px-2.5 py-0.5 rounded bg-black/85 border border-emerald-500/40 text-emerald-400 font-mono text-[9px] font-bold tracking-widest flex items-center gap-1.5 shadow-xl select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CAMA B2 • 27 PLANTAS</span>
          </div>
        </Html>
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. RED DE TUTORADO / TRELLIS NET (SCROG)                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, -1.8, 0]}>
        {/* Marco tensor de la red */}
        <mesh position={[0, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} material={materials.trellisNet}>
          <cylinderGeometry args={[0.015, 0.015, 5.4, 8]} />
        </mesh>
        <mesh position={[0, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} material={materials.trellisNet}>
          <cylinderGeometry args={[0.015, 0.015, 5.4, 8]} />
        </mesh>
        <mesh position={[-2.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.trellisNet}>
          <cylinderGeometry args={[0.015, 0.015, 2.4, 8]} />
        </mesh>
        <mesh position={[2.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.trellisNet}>
          <cylinderGeometry args={[0.015, 0.015, 2.4, 8]} />
        </mesh>

        {/* Hilos longitudinales de la red */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((z, idx) => (
          <mesh key={idx} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]} material={materials.trellisNet}>
            <cylinderGeometry args={[0.007, 0.007, 5.35, 6]} />
          </mesh>
        ))}
        {/* Hilos transversales de la red */}
        {[-2.2, -1.5, -0.8, 0, 0.8, 1.5, 2.2].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.trellisNet}>
            <cylinderGeometry args={[0.007, 0.007, 2.35, 6]} />
          </mesh>
        ))}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. CANOPIA VEGETAL VIVA (PLANTAS CON ESPACIADO ELEGANTE)      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group ref={foliageGroupRef}>
        {plantPositions.map((pos, pIdx) => {
          const heightScale = 0.78 + (pIdx % 4) * 0.08
          return (
            <group key={pIdx} position={[pos[0], -2.26, pos[2]]} scale={[1, heightScale, 1]}>
              {/* Tallo principal */}
              <mesh position={[0, 0.28, 0]} material={materials.plantStem}>
                <cylinderGeometry args={[0.03, 0.05, 0.56, 8]} />
              </mesh>

              {/* Ramas laterales y hojas compuestas */}
              {[0.16, 0.32, 0.46].map((nodeY, nIdx) => (
                <group key={nIdx} position={[0, nodeY, 0]}>
                  {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, leafIdx) => (
                    <group 
                      key={leafIdx} 
                      rotation={[0.3, angle + (pIdx * 0.4), 0.25]}
                    >
                      <mesh position={[0.2, 0.04, 0]} rotation={[0, 0, -0.2]} material={materials.plantLeaf}>
                        <coneGeometry args={[0.11, 0.32, 5]} />
                      </mesh>
                      <mesh position={[0.16, 0.04, 0.07]} rotation={[0, 0.25, -0.22]} material={materials.plantLeafBright}>
                        <coneGeometry args={[0.07, 0.22, 4]} />
                      </mesh>
                      <mesh position={[0.16, 0.04, -0.07]} rotation={[0, -0.25, -0.22]} material={materials.plantLeafBright}>
                        <coneGeometry args={[0.07, 0.22, 4]} />
                      </mesh>
                    </group>
                  ))}
                </group>
              ))}

              {/* Corona apical floreciente que asoma por encima de la red */}
              <group position={[0, 0.58, 0]}>
                <mesh material={materials.plantLeafBright}>
                  <sphereGeometry args={[0.15, 8, 8]} />
                </mesh>
                {[0, 1.2, 2.4, 3.6, 4.8].map((rotA, i) => (
                  <mesh 
                    key={i} 
                    position={[Math.cos(rotA) * 0.12, 0.04, Math.sin(rotA) * 0.12]} 
                    rotation={[0.35, rotA, 0.25]} 
                    material={materials.plantLeaf}
                  >
                    <coneGeometry args={[0.06, 0.18, 4]} />
                  </mesh>
                ))}
              </group>
            </group>
          )
        })}
      </group>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. SONDA INDUSTRIAL DE SUELO (XZ-LMUS-SM-TM) & CABLEADO      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Cable curvo que baja desde Growy hacia el sustrato */}
        <mesh geometry={cableTubeGeometry} material={materials.sensorCable} />

        {/* Sonda clavada en el sustrato en [1.1, -2.18, 0.55] */}
        <group position={[1.1, -2.18, 0.55]}>
          {/* Cuerpo cilíndrico de resina epoxi impermeable */}
          <mesh position={[0, 0.12, 0]} material={materials.sensorBody}>
            <cylinderGeometry args={[0.05, 0.05, 0.24, 16]} />
          </mesh>
          <mesh position={[0, 0.24, 0]} material={materials.pipeJoint}>
            <cylinderGeometry args={[0.035, 0.045, 0.06, 16]} />
          </mesh>
          <mesh position={[0, 0.14, 0]} material={materials.ledWhiteDiodes}>
            <cylinderGeometry args={[0.052, 0.052, 0.02, 16]} />
          </mesh>
          <mesh position={[-0.02, -0.05, 0]} material={materials.sensorProngs}>
            <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
          </mesh>
          <mesh position={[0.02, -0.05, 0]} material={materials.sensorProngs}>
            <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
          </mesh>

          {/* Micro-beacon interactivo high-end sobre la sonda */}
          <Html position={[0, 0.35, 0]} center distanceFactor={3.2}>
            <div
              onClick={() => onSelectHotspot('soil_probe')}
              className="flex items-center gap-1.5 cursor-pointer group select-none pointer-events-auto"
            >
              <div className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                activeHotspot === 'soil_probe'
                  ? 'w-7 h-7 bg-cyan-400 text-black shadow-lg shadow-cyan-400/50 scale-110'
                  : 'w-6 h-6 bg-black/85 border border-cyan-400/60 text-cyan-300 hover:scale-110 hover:border-cyan-300'
              }`}>
                <span className="text-[10px] font-mono font-bold leading-none">+</span>
                <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping [animation-duration:3s]" />
              </div>
              <div className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap rounded-full font-mono text-[9.5px] font-bold px-2.5 py-1 backdrop-blur-md border ${
                activeHotspot === 'soil_probe'
                  ? 'max-w-[200px] opacity-100 bg-cyan-500 text-black border-cyan-400 shadow-md'
                  : 'max-w-0 opacity-0 -translate-x-2 pointer-events-none p-0 border-transparent group-hover:max-w-[200px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black/90 group-hover:text-cyan-300 group-hover:border-cyan-500/40'
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
