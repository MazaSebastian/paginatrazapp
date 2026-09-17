import { useState } from 'react'
import { GrowyCanvas } from '@/components/growy3d/GrowyCanvas'
import { GrowyMcpTerminal } from '@/components/growy3d/GrowyMcpTerminal'
import { 
  Sprout, 
  Wind, 
  ShieldCheck, 
  Cpu, 
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
    plantsCount: 18,
    co2: 780
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
      plantsCount: 18,
      co2: 920
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
      plantsCount: 18,
      co2: 760
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
      plantsCount: 18,
      co2: 780
    })
  }

  return (
    <section id="growy" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] scroll-mt-24">
      {/* Background glow sutil */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Header de la Sección (Limpio y corporativo, sin badges AI Slop) */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center justify-center gap-1.5">
          <Bot className="w-4 h-4" />
          Hardware Inteligente de Cultivo • Protocolo MCP
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Conocé a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Growy</span>: el copiloto físico de tu cultivo con Inteligencia Artificial
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Diseñado para montarse directamente en los caños de tu sala o carpa técnica. Monitorea sustrato y atmósfera en tiempo real, interactúa mediante su rostro ciberpunk biofílico y expone el control biológico a modelos como <span className="text-emerald-400 font-semibold">Gemini</span> y <span className="text-emerald-400 font-semibold">Claude</span> a través del protocolo abierto <span className="text-teal-300 font-semibold font-mono">MCP (Model Context Protocol)</span>.
        </p>
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
            <span className="text-emerald-400 font-bold hidden sm:inline">Diseño Industrial IP65</span>
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

      {/* Bento Grid de Especificaciones de Hardware & Sensores */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Card 1: Sensores de Suelo */}
        <div className="p-6 rounded-3xl bg-[#090e18]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Monitoreo Radicular</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sonda TDR de 3 agujas para medición de humedad volumétrica de sustrato (VWC), electroconductividad (EC) y temperatura de raíz.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-emerald-400">
            Precisión ±1.5% VWC
          </div>
        </div>

        {/* Card 2: Clima y Atmósfera */}
        <div className="p-6 rounded-3xl bg-[#090e18]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wind className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Cálculo de VPD & CO₂</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sensor NDIR de CO₂ hasta 5000 ppm y cálculo dinámico de Déficit de Presión de Vapor en hojas para optimizar la transpiración vegetal.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-teal-400">
            Algoritmo Tetens en vivo
          </div>
        </div>

        {/* Card 3: Chasis Industrial */}
        <div className="p-6 rounded-3xl bg-[#090e18]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Carcasa Fibra de Carbono</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Grafito técnico texturizado, tornillería Allen inoxidable vista y abrazaderas de anclaje rápido para caños de 16mm a 32mm.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-cyan-400">
            Resistente a humedad 95% IP65
          </div>
        </div>

        {/* Card 4: Protocolo MCP */}
        <div className="p-6 rounded-3xl bg-[#090e18]/80 border border-white/[0.08] hover:border-emerald-500/30 transition-all group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Protocolo MCP Nativo</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Permite a agentes de IA consultar telemetría, crear tareas de contingencia en TrazAPP y sugerir cambios de fotoperiodo en lenguaje natural.
          </p>
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-emerald-400">
            Compatible Claude & Gemini
          </div>
        </div>
      </div>

      {/* CTA inferior de la sección */}
      <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0a1220] to-[#070c17] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            ¿Querés equipar tus salas de cultivo con Growy?
          </h4>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Coordiná una demostración técnica en vivo para ver cómo Growy se conecta a tus armarios o salas y se sincroniza con TrazAPP OS.
          </p>
        </div>
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
    </section>
  )
}
