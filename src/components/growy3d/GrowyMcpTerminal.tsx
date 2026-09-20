import { useState } from 'react'
import { 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Bot, 
  RefreshCw 
} from 'lucide-react'

interface GrowyMcpTerminalProps {
  onSimulateVpdDrop: () => void
  onSimulateDrySoil: () => void
  onResetSimulation: () => void
  alertActive: boolean
  currentScenario: 'normal' | 'vpd_drop' | 'dry_soil'
  activeHotspot: string | null
  onSelectHotspot: (hotspot: string) => void
}

export function GrowyMcpTerminal({
  onSimulateVpdDrop,
  onSimulateDrySoil,
  onResetSimulation,
  alertActive: _alertActive,
  currentScenario,
  activeHotspot,
  onSelectHotspot
}: GrowyMcpTerminalProps) {
  const [activeTab, setActiveTab] = useState<'mcp' | 'chat' | 'specs'>('mcp')
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; mcpTool?: string }>>([
    {
      role: 'user',
      text: '¿Cómo viene el clima en la Sala 01 y qué estado tienen las Lemon Cherry?'
    },
    {
      role: 'assistant',
      text: 'Consultando telemetría de Growy en tiempo real... La temperatura se mantiene en 20.7°C con 65.6% de humedad. El VPD actual es de 0.55 kPa (estabilidad vegetativa óptima). Las 18 macetas de Lemon Cherry presentan conductividad de 1.8 mS/cm y humedad de sustrato al 91.4%. No se detectan anomalías biológicas.',
      mcpTool: 'trazapp_get_room_telemetry({ room_id: "SALA_01", metrics: ["vpd", "soil_vwc", "temp", "ec"] })'
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleAskPredefined = (question: string, tool: string, answer: string) => {
    setIsTyping(true)
    setChatHistory(prev => [...prev, { role: 'user', text: question }])

    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: answer, 
          mcpTool: tool 
        }
      ])
      setIsTyping(false)
    }, 1100)
  }

  const hotspotInfo: Record<string, { title: string; desc: string; specs: string[] }> = {
    screen: {
      title: 'Pantalla Táctil TrazAPP SENSE',
      desc: 'Panel OLED multitáctil capacitivo integrado. Permite alternar entre el Face Mode (rostro IA biofílico con telemetría viva) y el Sense Mode (mapa de 27 plantas en Cama B2, genéticas activas y registro de incidencias sin teléfono).',
      specs: ['Panel OLED 6.5" 1080p', 'Respuesta táctil industrial', 'Apto condensación y humedad']
    },
    sensors: {
      title: 'Monitoreo Ambiental & Sustrato',
      desc: 'Adquisición de datos en tiempo real: medición de humedad de suelo, humedad ambiental y temperatura ambiental. Cálculo dinámico de VPD para el control preciso de la transpiración biológica.',
      specs: ['Humedad de suelo en tiempo real', 'Humedad y temperatura ambiental', 'VPD calculado por algoritmo Tetens']
    },
    soil_probe: {
      title: 'Sonda Industrial de Sustrato (XZ-LMUS-SM-TM)',
      desc: 'Sonda de inserción directa de grado industrial para living soil y camas técnicas. Púas de acero inoxidable 316L con medición de contenido volumétrico de agua (VWC) y temperatura radicular en tiempo real.',
      specs: ['Púas de acero inoxidable 316L', 'Conexión por cable blindado M12', 'Lectura VWC 0-100% y Temp -40°C a 80°C']
    },
    mount: {
      title: 'Montaje Universal en Caño Estructural',
      desc: 'Doble abrazadera industrial mecanizada con recubrimiento amortiguador. Diseñada para anclarse a tubos estructurales de 16mm a 32mm típicos de salas profesionales y armarios de cultivo.',
      specs: ['Tornillos de ajuste Allen M6', 'Carga máxima 12 kg', 'Aislación contra vibración de extractores']
    },
    mcp: {
      title: 'Agente Autónomo & Protocolo MCP',
      desc: 'Growy implementa un servidor de MCP local que expone la sala a LLMs (Claude, Gemini, ChatGPT/Codex). Permite diagnósticos en lenguaje natural, apertura de tareas automáticas y transiciones de lote sin intervención manual.',
      specs: ['Protocolo MCP v1.0', 'Cifrado mTLS extremo a extremo', 'Fallback offline con buffer local SQLite']
    }
  }

  return (
    <div className="flex flex-col h-full rounded-3xl bg-[#090e18]/85 border border-white/[0.08] p-5 sm:p-6 backdrop-blur-xl shadow-xl justify-between">
      <div>
        {/* Header con tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-sm font-bold text-white tracking-tight">Centro de Simulación Growy</div>
              <div className="text-[11px] text-slate-400 font-mono">Hardware IoT + Protocolo MCP</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 bg-black/40 p-1 rounded-full border border-white/[0.08] mx-auto sm:mx-0">
            <button
              onClick={() => setActiveTab('mcp')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mcp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulador
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Copiloto IA
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Detalle
            </button>
          </div>
        </div>

        {/* CONTENIDO TAB 1: SIMULADOR MCP Y CASOS DE USO */}
        {activeTab === 'mcp' && (
          <div className="mt-4 space-y-4">
            <div className="text-xs text-slate-300 text-center mx-auto max-w-lg leading-relaxed">
              Interactuá con los sensores de Growy para observar cómo reacciona el modelo 3D y cómo se ejecutan las herramientas del protocolo MCP en tiempo real:
            </div>

            {/* Botones de escenarios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={onSimulateVpdDrop}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  currentScenario === 'vpd_drop'
                    ? 'bg-rose-500/15 border-rose-500/50 text-white'
                    : 'bg-black/30 border-white/[0.06] text-slate-300 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1.5 w-full flex-wrap">
                  <span className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Caída Crítica de VPD
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                    0.38 kPa
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug text-center">
                  Humedad al 88%. El modelo 3D entra en alerta roja y el MCP ordena activar deshumidificadores.
                </p>
              </button>

              <button
                onClick={onSimulateDrySoil}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  currentScenario === 'dry_soil'
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-black/30 border-white/[0.06] text-slate-300 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1.5 w-full flex-wrap">
                  <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Sustrato Seco (A3 & B2)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                    VWC 22%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug text-center">
                  Sonda TDR detecta déficit hídrico. MCP crea automáticamente tarea de fertirriego.
                </p>
              </button>
            </div>

            {/* Botón de Reset */}
            {currentScenario !== 'normal' && (
              <button
                onClick={onResetSimulation}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all text-center"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restablecer Parámetros Óptimos de Sala</span>
              </button>
            )}

            {/* Consola de traza MCP en vivo */}
            <div className="mt-3 rounded-2xl bg-black/60 border border-white/[0.08] p-3.5 font-mono text-[11px]">
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-white/[0.06] text-[10px] text-slate-400 gap-2 text-center">
                <span className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold mx-auto sm:mx-0">
                  <Terminal className="w-3 h-3" />
                  LOG PROTOCOLO MCP TRAZAPP
                </span>
                <span className="mx-auto sm:mx-0">STATUS: 200 OK</span>
              </div>

              <div className="space-y-1.5 mt-2.5 text-slate-300 text-[10.5px]">
                {currentScenario === 'normal' && (
                  <>
                    <div className="text-slate-500"># Monitoreo periódico autónomo</div>
                    <div>
                      <span className="text-emerald-400">CALL</span>{' '}
                      <span className="text-teal-300">trazapp_get_room_telemetry</span>
                      <span className="text-slate-400">({'{ room_id: "SALA_01" }'})</span>
                    </div>
                    <div className="text-slate-400 pl-3">
                      ↳ Temp: 20.7°C | HR: 65.6% | VPD: 0.55 kPa | VWC: 91.4%
                    </div>
                    <div className="text-emerald-400/90 pl-3">
                      ✓ Estado de cultivo: ESTABILIDAD PERFECTA
                    </div>
                  </>
                )}

                {currentScenario === 'vpd_drop' && (
                  <>
                    <div className="text-rose-400 font-bold"># ALERTA DETECTADA POR GROWY</div>
                    <div>
                      <span className="text-rose-400">CALL</span>{' '}
                      <span className="text-teal-300">trazapp_create_task</span>
                      <span className="text-slate-400">
                        ({'{ priority: "HIGH", action: "ACTIVATE_DEHUMIDIFIER", target_vpd: 0.95 }'})
                      </span>
                    </div>
                    <div className="text-slate-300 pl-3">
                      ↳ Notificación WhatsApp enviada al cultivador de guardia:
                      <br />
                      <span className="text-amber-300">"VPD cayó a 0.38 kPa. Extractor activado automáticamente."</span>
                    </div>
                    <div className="text-emerald-400 pl-3">✓ Tarea #882 foliada en libro oficial</div>
                  </>
                )}

                {currentScenario === 'dry_soil' && (
                  <>
                    <div className="text-amber-400 font-bold"># DÉFICIT HÍDRICO RADICULAR EN MACETAS A3 y B2</div>
                    <div>
                      <span className="text-amber-400">CALL</span>{' '}
                      <span className="text-teal-300">trazapp_create_task</span>
                      <span className="text-slate-400">
                        ({'{ title: "Fertirriego Contingencia", plants: ["A3", "B2"], ec_target: 1.8 }'})
                      </span>
                    </div>
                    <div className="text-slate-300 pl-3">
                      ↳ Cálculo nutricional: 250ml solución A+B ajustada a pH 6.2
                    </div>
                    <div className="text-emerald-400 pl-3">✓ Sincronizado en panel TRAZAPP SENSE</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO TAB 2: COPILOTO IA CONVERSACIONAL (CHAT MCP) */}
        {activeTab === 'chat' && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-slate-300 text-center mx-auto max-w-lg leading-relaxed">
              Preguntale a la Inteligencia Artificial conectada a Growy vía MCP. Respuestas con rigor agronómico:
            </div>

            {/* Historial de chat */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl text-xs ${
                    msg.role === 'user'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-white ml-6'
                      : 'bg-black/50 border border-white/[0.08] text-slate-200 mr-4'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-[11px]">
                    {msg.role === 'user' ? (
                      <span className="text-emerald-400">Cultivador</span>
                    ) : (
                      <span className="text-teal-300 flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" />
                        Copiloto Growy MCP
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.mcpTool && (
                    <div className="mt-2 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-emerald-400/80">
                      🔧 Tool: {msg.mcpTool}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-400 italic flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Consultando servidor MCP de Growy...</span>
                </div>
              )}
            </div>

            {/* Preguntas predefinidas de alto impacto agronómico */}
            <div className="pt-2 border-t border-white/[0.08] space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 text-center">Preguntas sugeridas:</div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleAskPredefined(
                    '¿Cómo viene el secado del lote B-4 de Tapeche?',
                    'trazapp_get_room_telemetry({ batch_id: "LOT-B4", days_in_cure: 6 })',
                    'El lote B-4 lleva 6 días de secado a 18.2°C y 58% HR. La tasa de pérdida de humedad hídrica es de 1.4% diario (óptima para preservación de terpenos beta-mirceno). Estimamos liberación de lote para trimming en 72 horas.'
                  )}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  "¿Cómo viene el secado del lote B-4 de Tapeche?" →
                </button>
                <button
                  onClick={() => handleAskPredefined(
                    '¿Es momento de pasar la sala a 12/12 de floración?',
                    'trazapp_update_batch_stage({ current_stage: "VEG", vegetative_days: 28, canopy_coverage: "88%" })',
                    'La sala vegetativa acumula 28 días con una cobertura foliar del 88% y nudos internodales densos. Podés cambiar el fotoperiodo a 12/12 este viernes tras realizar defoliación baja y poda apical.'
                  )}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-center text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  "¿Es momento de pasar la sala a 12/12 de floración?" →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO TAB 3: DETALLES DE INGENIERÍA Y HOTSPOT ACTIVO */}
        {activeTab === 'specs' && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-slate-300 text-center mx-auto max-w-lg leading-relaxed">
              Tocá los hotspots en el modelo 3D para inspeccionar la arquitectura de hardware de Growy:
            </div>

            {/* Hotspot actual */}
            {activeHotspot && hotspotInfo[activeHotspot] ? (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-emerald-300 mb-1 text-center">
                  {hotspotInfo[activeHotspot].title}
                </div>
                <p className="text-[11.5px] text-slate-300 leading-relaxed text-center">
                  {hotspotInfo[activeHotspot].desc}
                </p>
                <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex flex-wrap items-center justify-center gap-1.5 w-full">
                  {hotspotInfo[activeHotspot].specs.map((s, idx) => (
                    <span key={idx} className="text-[9.5px] font-mono bg-black/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-center text-slate-400 text-xs">
                Seleccioná cualquier hotspot flotante en el visor 3D (Pantalla, Sensores, Montaje o Protocolo MCP) para ver su desglose técnico.
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onSelectHotspot('screen')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs text-slate-300 cursor-pointer"
              >
                [+] Pantalla Touch
              </button>
              <button
                onClick={() => onSelectHotspot('sensors')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs text-slate-300 cursor-pointer"
              >
                [+] Sensores Suelo & Aire
              </button>
              <button
                onClick={() => onSelectHotspot('mount')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs text-slate-300 cursor-pointer"
              >
                [+] Montaje Caño
              </button>
              <button
                onClick={() => onSelectHotspot('mcp')}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-center text-xs text-slate-300 cursor-pointer"
              >
                [+] Protocolo MCP
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer de compatibilidad institucional */}
      <div className="pt-4 mt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-center sm:justify-between text-center gap-2 text-[11px] text-slate-400 font-mono">
        <span className="flex items-center justify-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Conectado a TrazAPP OS
        </span>
        <span className="text-slate-500">MCP Protocol v1.0</span>
      </div>
    </div>
  )
}
