import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  CheckCheck, 
  Send, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react'

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
  time: string
  buttons?: string[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text: '🌿 ¡Hola Julián! Te escribimos desde el Dispensario de *Asociación Cannabis TrazAPP*.\n\n✅ Tu membresía solidaria está *AL DÍA*.\n📊 *Cupo restante este mes:* 20 gramos certificados.\n\n¿Qué te gustaría gestionar hoy?',
    time: '11:42',
    buttons: ['🌿 Stock en Dispensario', '📋 Mi Estado REPROCANN', '🚨 Alerta IoT Cultivo']
  }
]

export function InteractiveWhatsAppBot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)

  const handleAction = (userText: string, botReply: string, buttons?: string[]) => {
    if (isTyping) return

    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: userText,
        time: timeStr
      }
    ])

    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: timeStr,
          buttons
        }
      ])
      setIsTyping(false)
    }, 900)
  }

  const handleButtonPress = (btnText: string) => {
    if (btnText.includes('Stock en Dispensario')) {
      handleAction(
        '🌿 ¿Qué variedades y extractos tienen disponibles hoy?',
        '✨ *Stock Disponible en Dispensario (Actualizado 11:43 hs):*\n\n1️⃣ *Lemon Haze (Fenotipo #04)*\n• Lote: #TRZ-2026-LH04\n• THC 20.4% • CBD 0.8%\n• Terpenos: Limoneno y Terpinoleno\n• Stock disponible: 1.480g\n\n2️⃣ *CBD Harlequin 15:1 (Gotero 30ml)*\n• Lote: #OIL-15:1-B09\n• Stock disponible: 32 frascos\n\n¿Querés reservar 10g para retiro hoy?',
        ['✅ Reservar 10g Lemon Haze', '📋 Ver Análisis Cromatográfico']
      )
    } else if (btnText.includes('Mi Estado REPROCANN')) {
      handleAction(
        '📋 Consultar mi registro REPROCANN',
        '🛡️ *Ficha Legal REPROCANN Verificada:*\n\n• *N° de Trámite:* RPC-88421-AR\n• *Estado:* VIGENTE Y AUTORIZADO ✅\n• *Vencimiento:* 18 de Noviembre de 2026\n• *Médica:* Dra. Silvina Ramos (MN 124.901)\n• *Límite legal mensual:* 40 gramos\n• *Retirado este mes:* 20 gramos\n• *Disponible para entrega:* 20 gramos\n\nTu documentación se encuentra 100% al día para retiro en el dispensario.',
        ['🌿 Ver Stock en Dispensario', '🔄 Menú Principal']
      )
    } else if (btnText.includes('Alerta IoT Cultivo')) {
      handleAction(
        '🚨 Simular Alerta Agronómica',
        '⚠️ *NOTIFICACIÓN AUTOMÁTICA DE SALA ALPHA-03:*\n\nSensor #04 registró un pico térmico de *28.4°C* a las 11:41 hs.\n\n⚙️ *Acción Automática del Sistema:*\n• Extractor forzado activado al 100%.\n• Aire acondicionado suplementario encendido.\n\nTemperatura estabilizada en *23.8°C*. Parámetros normales restablecidos sin daño foliar.',
        ['🔄 Menú Principal']
      )
    } else if (btnText.includes('Reservar 10g')) {
      handleAction(
        '✅ Reservar 10g Lemon Haze',
        '🎉 *¡Reserva Confirmada! Remito #TRZ-9941*\n\nTe guardamos 10g del lote #TRZ-2026-LH04 en el dispensario.\n\n📍 Podés pasar a retirar hoy de 14:00 a 20:00 hs con tu DNI.\nTu nuevo cupo restante del mes será de *10 gramos*.\n\n¡Te esperamos!',
        ['🔄 Menú Principal']
      )
    } else if (btnText.includes('Ver Análisis')) {
      handleAction(
        '📋 Ver Análisis Cromatográfico',
        '🔬 *Certificado Cromatografía HPLC Lote #LH04:*\n\n• THC Total: 20.42% w/w\n• CBD Total: 0.85% w/w\n• Terpenos Totales: 2.8%\n• Metales pesados (Pb, Cd, As): NO DETECTADOS\n• Mohos y levaduras: < 10 UFC/g (Aprobado)\n\nFirma técnica avalada por Laboratorio Bio-Canna Argentina.',
        ['🌿 Reservar 10g Lemon Haze', '🔄 Menú Principal']
      )
    } else {
      // Menu principal
      setMessages(INITIAL_MESSAGES)
    }
  }

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES)
    setIsTyping(false)
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-[40px] bg-[#0c121e] border-4 border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] overflow-hidden relative text-white">
      {/* Dynamic Island / Parlante Notch */}
      <div className="bg-[#0b101c] pt-3 pb-2 px-6 flex items-center justify-between border-b border-white/[0.06]">
        <span className="text-[11px] font-mono text-slate-400 font-semibold">9:41</span>
        <div className="w-20 h-4 bg-black/60 rounded-full flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>
        <span className="text-[10px] text-slate-400 font-mono">5G • 100%</span>
      </div>

      {/* WhatsApp Header Bar */}
      <div className="bg-[#064e3b] px-4 py-3 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#064e3b] absolute bottom-0 right-0" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-xs leading-none">TrazAPP Bot Oficial</h4>
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
            </div>
            <span className="text-[10px] text-emerald-200/80">Meta Cloud API • En línea</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-200">
          <button
            onClick={resetChat}
            title="Reiniciar chat"
            className="p-1 rounded-full hover:bg-emerald-700/50 text-emerald-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div 
        className="p-3 sm:p-4 h-[380px] overflow-y-auto space-y-3 bg-[#080d17] bg-opacity-95"
        style={{
          backgroundImage: 'radial-gradient(#10b981 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0'
        }}
      >
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot'
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-md ${
                  isBot
                    ? 'bg-[#131d2e] border border-white/[0.08] text-slate-100 rounded-tl-xs'
                    : 'bg-[#059669] text-white rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                <div className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${isBot ? 'text-slate-400' : 'text-emerald-100'}`}>
                  <span>{msg.time}</span>
                  {!isBot && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                </div>
              </div>

              {/* Bot Action Buttons */}
              {isBot && msg.buttons && msg.buttons.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2 w-[85%]">
                  {msg.buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleButtonPress(btn)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold text-left flex items-center justify-between transition-all cursor-pointer shadow-sm"
                    >
                      <span>{btn}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">→</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-[#131d2e] border border-white/[0.08] w-fit rounded-tl-xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
          </motion.div>
        )}
      </div>

      {/* Input Placeholder Bottom Bar */}
      <div className="p-3 bg-[#0b101c] border-t border-white/[0.06] flex items-center gap-2 text-slate-400">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-full px-3.5 py-2 text-[11px] text-slate-400">
          Escribe un mensaje...
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
          <Send className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  )
}
