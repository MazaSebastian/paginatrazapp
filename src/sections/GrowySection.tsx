import { useState } from 'react'
import { motion } from 'framer-motion'
import { GrowyCanvas } from '@/components/growy3d/GrowyCanvas'
import { GrowyMcpTerminal } from '@/components/growy3d/GrowyMcpTerminal'
import { SplitText } from '@/components/ui/SplitText'
import { 
  ArrowRight,
  Bot
} from 'lucide-react'
import { SpecularButton } from '@/components/ui/SpecularButton'

interface GrowySectionProps {
  onOpenDemo: () => void
}

export function GrowySection({ onOpenDemo }: GrowySectionProps) {
  const [screenMode, setScreenMode] = useState<'face' | 'sense'>('face')
  const [currentScenario, setCurrentScenario] = useState<'normal' | 'vpd_drop' | 'dry_soil'>('normal')
  const [activeHotspot, setActiveHotspot] = useState<string | null>('screen')

  // Telemetría reactiva
  const [telemetry, setTelemetry] = useState({
    temp: 20.7,
    hum: 65.6,
    vpd: 0.55,
    soilMoisture: 91.4,
    plantsCount: 27
  })

  const [alertActive, setAlertActive] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // Simulador de caída de VPD
  const handleSimulateVpdDrop = () => {
    setCurrentScenario('vpd_drop')
    setAlertActive(true)
    setAlertMessage('VPD CRÍTICO: 0.38 kPa (HUMEDAD 88.2%)')
    setTelemetry({
      temp: 23.8,
      hum: 88.2,
      vpd: 0.38,
      soilMoisture: 89.0,
      plantsCount: 27
    })
  }

  // Simulador de suelo seco
  const handleSimulateDrySoil = () => {
    setCurrentScenario('dry_soil')
    setAlertActive(true)
    setAlertMessage('DÉFICIT HÍDRICO EN MACETAS A3 & B2')
    setTelemetry({
      temp: 21.2,
      hum: 63.0,
      vpd: 0.62,
      soilMoisture: 22.0,
      plantsCount: 27
    })
  }

  // Reset a condiciones óptimas
  const handleResetSimulation = () => {
    setCurrentScenario('normal')
    setAlertActive(false)
    setAlertMessage('')
    setTelemetry({
      temp: 20.7,
      hum: 65.6,
      vpd: 0.55,
      soilMoisture: 91.4,
      plantsCount: 27
    })
  }

  return (
    <section id="growy" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Separador de luz etéreo con gradiente de desvanecimiento hacia los extremos */}
      <div className="absolute top-0 inset-x-4 sm:inset-x-16 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />

      {/* Background glow sutil */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Header de la Sección con animaciones de entrada fluidas (estilo Dental-IA) */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center justify-center gap-1.5"
        >
          <Bot className="w-4 h-4" />
          Hardware Inteligente de Cultivo • Protocolo MCP
        </motion.div>
        
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          <span className="inline-block whitespace-nowrap mr-2.5">
            <SplitText
              text="Conocé a"
              tag="span"
              className="text-white mr-2"
              delay={25}
              duration={0.6}
              splitType="chars"
              from={{ opacity: 0, y: 35 }}
              to={{ opacity: 1, y: 0 }}
              rootMargin="-50px"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.85, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 inline-block"
            >
              Growy:
            </motion.span>
          </span>
          <SplitText
            text="tu asistente de cultivo con Inteligencia Artificial"
            tag="span"
            className="text-white"
            delay={18}
            duration={0.6}
            splitType="chars"
            from={{ opacity: 0, y: 35 }}
            to={{ opacity: 1, y: 0 }}
            rootMargin="-50px"
          />
        </h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Diseñado para montarse directamente en tu bunker, carpa o cultivo. Monitorea sustrato y atmósfera en tiempo real y expone el control biológico a modelos como <span className="text-emerald-400 font-semibold">Claude</span>, <span className="text-emerald-400 font-semibold">Gemini</span> y <span className="text-emerald-400 font-semibold">ChatGPT / Codex</span> a través del protocolo abierto <span className="text-teal-300 font-semibold font-mono">MCP</span>.
        </motion.p>
      </div>

      {/* Visor 3D Interactivo + Terminal de Simulación MCP (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Columna Izquierda: Visor 3D de Growy (7 cols en desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <GrowyCanvas
            mode={screenMode}
            onToggleMode={() => setScreenMode(prev => prev === 'face' ? 'sense' : 'face')}
            alertActive={alertActive}
            alertMessage={alertMessage}
            telemetry={telemetry}
            activeHotspot={activeHotspot}
            onSelectHotspot={(h) => setActiveHotspot(h)}
          />
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2 font-mono">
            <span>🖱️ Hacé clic y arrastrá para rotar 360° • Rueda del mouse para zoom</span>
            <span className="text-emerald-400 font-bold hidden sm:inline">Apto Ambientes Húmedos</span>
          </div>
        </div>

        {/* Columna Derecha: Consola MCP & Copiloto IA (5 cols en desktop) */}
        <div className="lg:col-span-5 flex flex-col">
          <GrowyMcpTerminal
            onSimulateVpdDrop={handleSimulateVpdDrop}
            onSimulateDrySoil={handleSimulateDrySoil}
            onResetSimulation={handleResetSimulation}
            alertActive={alertActive}
            currentScenario={currentScenario}
            activeHotspot={activeHotspot}
            onSelectHotspot={(h) => setActiveHotspot(h)}
          />
        </div>
      </div>



      {/* CTA inferior de la sección */}
      <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0a1220] to-[#070c17] border border-emerald-500/30 flex flex-col items-center justify-center text-center gap-6">
        <div className="max-w-2xl mx-auto text-center">
          <h4 className="text-xl sm:text-2xl font-bold text-white text-center">
            ¿Querés equipar tus salas de cultivo con Growy?
          </h4>
          <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto text-center">
            Coordiná una demostración técnica en vivo para ver cómo Growy cambia tu forma de cultivar.
          </p>
        </div>
        <div className="flex justify-center">
          <SpecularButton
            size="md"
            radius={16}
            tint="#059669"
            tintOpacity={1}
            textColor="#ffffff"
            lineColor="#6ee7b7"
            baseColor="#047857"
            intensity={1.4}
            shineSize={20}
            shineFade={45}
            thickness={1.5}
          speed={0.4}
          followMouse
          proximity={240}
          onClick={onOpenDemo}
          className="h-12 px-7 rounded-2xl shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center shrink-0"
        >
          <span className="font-bold text-sm text-white flex items-center gap-2">
            Solicitar Demostración de Growy
            <ArrowRight className="w-4 h-4" />
          </span>
        </SpecularButton>
        </div>
      </div>
    </section>
  )
}
