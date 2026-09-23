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
        color: '#28542d',
        roughness: 0.78,
        metalness: 0.04,
      }),
      // Hojas de abanico principales (Verde clorofila profundo)
      plantLeaf: new THREE.MeshStandardMaterial({
        color: '#1f5b2b',
        roughness: 0.44,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
      // Hojas tiernas / foliolo basal
      plantLeafBright: new THREE.MeshStandardMaterial({
        color: '#2ea843',
        roughness: 0.4,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
      // Hojas de azúcar (sugar leaves entre los cogollos)
      sugarLeaf: new THREE.MeshStandardMaterial({
        color: '#3cb654',
        roughness: 0.35,
        metalness: 0.08,
        side: THREE.DoubleSide,
      }),
      // Cogollos / cálices en floración
      plantCola: new THREE.MeshStandardMaterial({
        color: '#2b6e36',
        roughness: 0.65,
        metalness: 0.04,
      }),
      // Pistilos maduros (pelillos anaranjados/ámbar de flor madura)
      pistil: new THREE.MeshStandardMaterial({
        color: '#d97706',
        emissive: '#b45309',
        emissiveIntensity: 0.35,
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
        list.push([x + jitterX, -0.38, z + jitterZ])
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

  // Geometría procedural del folíolo botánico de Cannabis (lanceolado con nervadura y punta afilada)
  const leafletGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    // Curva que define el perfil aserrado/lanceolado característico
    shape.bezierCurveTo(0.016, 0.04, 0.024, 0.11, 0, 0.22) // Punta apical
    shape.bezierCurveTo(-0.024, 0.11, -0.016, 0.04, 0, 0) // Retorno a la base
    return new THREE.ShapeGeometry(shape)
  }, [])

  // Geometría compacta de cálice floral (dodecaedro para faceteado orgánico de resina)
  const calyxGeometry = useMemo(() => {
    return new THREE.DodecahedronGeometry(0.04, 1)
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
            <mesh position={[0, -0.08, 0]} material={materials.pipeJointWhite}>
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

        {/* Travesaño longitudinal medio que sostiene la red SCROG elevada */}
        <mesh position={[-1.15, 0.42, -2.55]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.035, 0.035, 6.4, 12]} />
        </mesh>
        <mesh position={[1.15, 0.42, -2.55]} rotation={[Math.PI / 2, 0, 0]} material={materials.structurePipe}>
          <cylinderGeometry args={[0.035, 0.035, 6.4, 12]} />
        </mesh>

        {/* Travesaño posterior del fondo */}
        <mesh position={[0, 0.42, -5.8]} rotation={[0, 0, Math.PI / 2]} material={materials.structurePipe}>
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
      <group position={[0, 0.42, -2.55]}>
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
      {/* 6. CANOPIA DE 27 PLANTAS DE CANNABIS EXTENDIÉNDOSE AL FONDO  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group ref={foliageGroupRef}>
        {plantPositions.map((pos, pIdx) => {
          const heightScale = 0.96 + (pIdx % 4) * 0.07
          const baseRotation = (pIdx * 1.37) % (Math.PI * 2)

          return (
            <group key={pIdx} position={pos} rotation={[0, baseRotation, 0]} scale={[1, heightScale, 1]}>
              {/* Tallo botánico leñoso principal, alto y vigoroso */}
              <mesh position={[0, 0.44, 0]} material={materials.plantStem}>
                <cylinderGeometry args={[0.016, 0.034, 0.88, 8]} />
              </mesh>

              {/* 6 Pisos de Nudos vegetativos con hojas de abanico características de Cannabis (Fan Leaves) */}
              {[
                { y: 0.12, fanScale: 1.20, branches: 4, droop: 0.38 },
                { y: 0.25, fanScale: 1.35, branches: 4, droop: 0.30 },
                { y: 0.39, fanScale: 1.25, branches: 4, droop: 0.24 }, // A ras de la red SCROG
                { y: 0.53, fanScale: 1.12, branches: 4, droop: 0.18 }, // Superando la red SCROG
                { y: 0.67, fanScale: 0.96, branches: 4, droop: 0.14 },
                { y: 0.80, fanScale: 0.80, branches: 3, droop: 0.10 },
              ].map((tier, tIdx) => (
                <group key={tIdx} position={[0, tier.y, 0]}>
                  {Array.from({ length: tier.branches }).map((_, bIdx) => {
                    const branchAngle = (bIdx * (Math.PI * 2) / tier.branches) + (tIdx * 0.42)
                    return (
                      <group key={bIdx} rotation={[0, branchAngle, 0]}>
                        {/* Pecíolo botánico */}
                        <mesh position={[0.09, -0.01, 0]} rotation={[0, 0, -tier.droop]} material={materials.plantStem}>
                          <cylinderGeometry args={[0.004, 0.005, 0.18, 5]} />
                        </mesh>

                        {/* Abanico de 5 folíolos (Palmate Leaf auténtico de cannabis) */}
                        <group 
                          position={[0.18, -0.01 - (tier.droop * 0.09), 0]} 
                          rotation={[tier.droop * 0.5, 0, -tier.droop]}
                          scale={[tier.fanScale, tier.fanScale, tier.fanScale]}
                        >
                          {/* Folíolo Central (Lanza principal más larga) */}
                          <mesh geometry={leafletGeometry} material={materials.plantLeaf} scale={[1.15, 1.35, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2]} />
                          
                          {/* Folíolos Laterales Medios (±26°) */}
                          <mesh geometry={leafletGeometry} material={materials.plantLeaf} scale={[0.96, 1.15, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2 - 0.45]} />
                          <mesh geometry={leafletGeometry} material={materials.plantLeaf} scale={[0.96, 1.15, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2 + 0.45]} />

                          {/* Folíolos Basales Menores (±52°) */}
                          <mesh geometry={leafletGeometry} material={materials.plantLeafBright} scale={[0.76, 0.90, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2 - 0.9]} />
                          <mesh geometry={leafletGeometry} material={materials.plantLeafBright} scale={[0.76, 0.90, 1]} rotation={[Math.PI / 2, 0, -Math.PI / 2 + 0.9]} />
                        </group>
                      </group>
                    )
                  })}
                </group>
              ))}

              {/* 4 Ramas laterales satélite que suben en abanico cruzando la red SCROG */}
              {[
                { x: -0.16, z: 0.14, angle: -0.38 },
                { x: 0.16, z: 0.14, angle: 0.38 },
                { x: -0.14, z: -0.16, angle: -0.35 },
                { x: 0.14, z: -0.16, angle: 0.35 }
              ].map((branch, rIdx) => (
                <group key={rIdx} position={[branch.x, 0.46, branch.z]}>
                  {/* Tallo lateral en ángulo hacia el marco del tutorado */}
                  <mesh position={[branch.x * 0.4, 0.10, branch.z * 0.4]} rotation={[0, 0, branch.angle]} material={materials.plantStem}>
                    <cylinderGeometry args={[0.007, 0.010, 0.24, 6]} />
                  </mesh>
                  {/* Cogollo satélite frondoso cruzando la red */}
                  <group position={[branch.x * 0.85, 0.22, branch.z * 0.85]} scale={[0.75, 0.85, 0.75]}>
                    <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0, 0.05, 0]} scale={[1.1, 1.3, 1.1]} />
                    <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0, -0.02, 0]} scale={[1.25, 1.1, 1.25]} />
                    <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0, 0.11, 0]} scale={[0.85, 1.1, 0.85]} />
                    {/* Hojas resinosas satélite */}
                    {[0, Math.PI * 0.66, Math.PI * 1.33].map((rot, i) => (
                      <mesh key={i} geometry={leafletGeometry} material={materials.sugarLeaf} scale={[0.5, 0.68, 1]} rotation={[Math.PI / 2 - 0.28, 0, rot]} />
                    ))}
                    {/* Pistilos satélite */}
                    <mesh position={[0.02, 0.06, 0.02]} material={materials.pistil}>
                      <cylinderGeometry args={[0.0018, 0.0018, 0.035, 4]} />
                    </mesh>
                  </group>
                </group>
              ))}

              {/* COLA APICAL PRINCIPAL (Gran cogollo dominante, alzándose sobre la canopia) */}
              <group position={[0, 0.86, 0]}>
                {/* Estructura estratificada de cálices apilados en cono botánico orgánico */}
                <group position={[0, 0, 0]}>
                  {/* Base ancha de cálices florales */}
                  <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0, -0.04, 0]} scale={[1.6, 1.3, 1.6]} />
                  <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0.03, 0.02, 0.02]} scale={[1.4, 1.2, 1.35]} />
                  {/* Nivel medio de la flor */}
                  <mesh geometry={calyxGeometry} material={materials.plantCola} position={[-0.02, 0.08, -0.015]} scale={[1.25, 1.3, 1.2]} />
                  <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0.01, 0.14, 0.01]} scale={[1.05, 1.25, 1.05]} />
                  {/* Punta apical de la flor */}
                  <mesh geometry={calyxGeometry} material={materials.plantCola} position={[0, 0.20, 0]} scale={[0.80, 1.35, 0.80]} />
                </group>

                {/* 4 Niveles de Sugar Leaves (Hojitas de azúcar brotando entre los cálices) */}
                {[
                  { y: -0.02, r: 0.075, scale: 0.65, rotZ: 0.38, count: 5 },
                  { y: 0.05,  r: 0.060, scale: 0.52, rotZ: 0.28, count: 5 },
                  { y: 0.12,  r: 0.045, scale: 0.40, rotZ: 0.20, count: 4 },
                  { y: 0.18,  r: 0.032, scale: 0.30, rotZ: 0.12, count: 3 },
                ].map((tier, sIdx) => (
                  <group key={sIdx} position={[0, tier.y, 0]}>
                    {Array.from({ length: tier.count }).map((_, i) => {
                      const a = (i * (Math.PI * 2) / tier.count) + (sIdx * 0.6)
                      return (
                        <mesh
                          key={i}
                          geometry={leafletGeometry}
                          material={materials.sugarLeaf}
                          position={[Math.cos(a) * tier.r, 0, Math.sin(a) * tier.r]}
                          rotation={[Math.PI / 2 - tier.rotZ, 0, a + Math.PI / 2]}
                          scale={[tier.scale, tier.scale * 1.2, 1]}
                        />
                      )
                    })}
                  </group>
                ))}

                {/* Pistilos maduros (pelillos ámbar/anaranjados de maduración) */}
                {[
                  [0.045, -0.01, 0.035],
                  [-0.04, 0.04, 0.03],
                  [0.02, 0.10, -0.04],
                  [-0.03, 0.14, 0.02],
                  [0.015, 0.18, 0.025],
                  [-0.01, 0.22, -0.015],
                ].map((pPos, i) => (
                  <mesh key={i} position={pPos as [number, number, number]} material={materials.pistil}>
                    <cylinderGeometry args={[0.002, 0.002, 0.04, 4]} />
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
