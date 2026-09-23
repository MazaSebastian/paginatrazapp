import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Volume2, VolumeX, ShieldCheck, Activity, Cpu, Mouse, ChevronDown } from 'lucide-react'
import { playAppleBootChime, playHapticTap } from '@/utils/appleBootAudio'

interface GrowyWelcomePortalProps {
  isOpen: boolean
  onClose: () => void
}

export function GrowyWelcomePortal({ isOpen, onClose }: GrowyWelcomePortalProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [blinking, setBlinking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isActivating, setIsActivating] = useState(false)
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Métricas latentes rotativas para mostrar el poder de TrazAPP OS
  const latentMetrics = [
    { label: 'CANOPY VPD', value: '1.18 kPa', state: 'OPTIMAL' },
    { label: 'TEMP / HUMEDAD', value: '24.2°C • 59%', state: 'CALIBRATED' },
    { label: 'PAR / PPFD', value: '740 μmol/m²s', state: 'FULL CYCLE' },
    { label: 'REPROCANN CIPHER', value: 'INASE 2026 SEAL', state: 'PROTECTED' },
    { label: 'DISPENSARIO CLOUD', value: 'STOCK SYNC LIVE', state: 'ACTIVE' },
  ]

  // Rotación suave de telemetría latente
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setCurrentMetricIndex((prev) => (prev + 1) % latentMetrics.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [isOpen, latentMetrics.length])

  // Bloquear el scroll nativo del body para evitar confusión visual con la scrollbar
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Seguimiento suave del cursor del mouse y eventos de entrada (scroll, wheel, teclas, touch)
  useEffect(() => {
    if (!isOpen) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalizar coordenadas respecto al centro de la ventana (-1 a 1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      setMousePos({ x: nx, y: ny })
    }

    // Si el usuario intenta scrollear con rueda o trackpad -> Abre TrazAPP OS inmediatamente
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 8 || Math.abs(e.deltaX) > 8) {
        handleEnterApp()
      }
    }

    // Si el usuario presiona Enter, Espacio, Flecha Abajo o Escape -> Entra
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape', 'Enter', ' ', 'ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        handleEnterApp()
      }
    }

    // Si el usuario en móvil desliza el dedo -> Entra
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const touchDeltaY = Math.abs(e.touches[0].clientY - touchStartY)
      if (touchDeltaY > 15) {
        handleEnterApp()
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isOpen])

  // Parpadeo orgánico probabilístico
  useEffect(() => {
    if (!isOpen) return

    let timeoutId: ReturnType<typeof setTimeout>

    const triggerBlink = () => {
      setBlinking(true)
      setTimeout(() => {
        setBlinking(false)
        const nextBlink = Math.random() * 3200 + 2600
        timeoutId = setTimeout(triggerBlink, nextBlink)
      }, 150)
    }

    timeoutId = setTimeout(triggerBlink, 2200)
    return () => clearTimeout(timeoutId)
  }, [isOpen])

  // Función al activar / entrar
  const handleEnterApp = () => {
    if (isActivating) return
    setIsActivating(true)

    if (soundEnabled) {
      playAppleBootChime(0.30)
    }

    // Persistir en sessionStorage para no bloquear futuras recargas
    try {
      sessionStorage.setItem('trazapp_intro_seen', 'true')
    } catch (e) {
      // Ignorar si sessionStorage no está disponible
    }

    // Transición cinemática con delay para apreciar el flash/apertura
    setTimeout(() => {
      onClose()
      setIsActivating(false)
    }, 650)
  }

  // Cálculo de desplazamiento de pupilas (eye tracking)
  const maxPupilOffset = 18 // px
  const pupilX = mousePos.x * maxPupilOffset
  const pupilY = mousePos.y * (maxPupilOffset * 0.75)

  // Leve tilt 3D del visor
  const tiltX = -mousePos.y * 6
  const tiltY = mousePos.x * 8

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.12,
            filter: 'blur(26px)',
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 sm:p-8 bg-[#040711] text-white select-none overflow-hidden cursor-pointer"
          style={{ perspective: 1200 }}
          onClick={handleEnterApp}
        >
          {/* Fondo espacial profundo con luz radial bioluminiscente */}
          <div 
            className="absolute inset-0 pointer-events-none -z-10"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.05) 50%, #040711 100%)'
            }}
          />

          {/* Scanlines CRT muy sutiles de monitor industrial */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 -z-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)',
              backgroundSize: '100% 4px'
            }}
          />

          {/* Glow ambiental que sigue sutilmente al cursor */}
          <motion.div 
            className="absolute w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none -z-10"
            animate={{
              x: mousePos.x * 100,
              y: mousePos.y * 70,
            }}
            transition={{ type: 'spring', damping: 40, stiffness: 60 }}
          />

          {/* ── TOP HEADER MINIMALISTA ──────────────────────────────────── */}
          <header className="w-full max-w-5xl flex items-center justify-between z-20 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-[11px] font-mono tracking-wider font-bold text-emerald-300">
                  TRAZAPP BIOTECH OS v2.4
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Botón de Sonido */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  playHapticTap()
                  setSoundEnabled(!soundEnabled)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-mono transition-colors"
                title={soundEnabled ? 'Silenciar audio de bienvenida' : 'Activar audio'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Audio ON' : 'Mute'}</span>
              </button>

              {/* Botón Saltar Intro */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEnterApp()
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 text-xs font-medium hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Saltar intro</span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline bg-black/40 px-1 rounded">Esc</span>
              </button>
            </div>
          </header>

          {/* ── CUERPO CENTRAL: GROWY EN MODO ROSTRO INMERSIVO ──────────── */}
          <div 
            onClick={handleEnterApp}
            className="flex-1 flex flex-col items-center justify-center my-auto cursor-pointer group relative z-20 w-full max-w-4xl py-6"
          >
            {/* Globo de Diálogo de Growy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 text-center max-w-xl px-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>ASISTENTE BIOTECNOLÓGICO IA</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-slate-200 tracking-tight leading-relaxed">
                "Hola, soy <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">Growy</span>. Monitorizo cada parámetro de tu cultivo y blindo la trazabilidad de tu club."
              </h2>
            </motion.div>

            {/* Visor Hardware Icónico de Growy con seguimiento 3D */}
            <motion.div
              animate={{
                rotateX: tiltX,
                rotateY: tiltY,
                scale: isActivating ? 1.08 : 1,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="relative p-7 sm:p-10 rounded-[3rem] bg-[#070d19]/90 border border-emerald-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.18)] backdrop-blur-2xl transition-all duration-300 group-hover:border-emerald-400/60 group-hover:shadow-[0_20px_80px_rgba(16,185,129,0.28)]"
            >
              {/* Reflejo de cristal superior */}
              <div className="absolute inset-x-8 top-2 h-[1px] bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

              {/* Status Header dentro de la pantalla */}
              <div className="flex items-center justify-center text-[11px] font-mono mb-6 px-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span className="text-emerald-400 font-bold tracking-wider">TrazAPP OS - Growy</span>
                </div>
              </div>

              {/* OJOS ICÓNICOS DE GROWY (EYE-TRACKING ACTIVO) */}
              <div className="flex items-center gap-12 sm:gap-20 my-3 px-4">
                {/* Ojo Izquierdo */}
                <div 
                  className={`w-20 sm:w-28 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-150 relative overflow-hidden flex items-center justify-center shadow-2xl ${
                    blinking ? 'h-2' : 'h-24 sm:h-32'
                  } bg-gradient-to-b from-cyan-300 via-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(45,212,191,0.9)]`}
                >
                  {!blinking && (
                    <>
                      {/* Pupila que sigue al cursor con lerp */}
                      <motion.div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 shadow-[0_0_16px_white] absolute"
                        style={{
                          transform: `translate(${pupilX}px, ${pupilY}px)`
                        }}
                      />
                      {/* Reflejo de luz especular en la esquina */}
                      <div className="w-3 h-3 rounded-full bg-white/80 absolute top-3 right-3 pointer-events-none" />
                    </>
                  )}
                </div>

                {/* Ojo Derecho */}
                <div 
                  className={`w-20 sm:w-28 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-150 relative overflow-hidden flex items-center justify-center shadow-2xl ${
                    blinking ? 'h-2' : 'h-24 sm:h-32'
                  } bg-gradient-to-b from-cyan-300 via-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(45,212,191,0.9)]`}
                >
                  {!blinking && (
                    <>
                      {/* Pupila que sigue al cursor con lerp */}
                      <motion.div 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 shadow-[0_0_16px_white] absolute"
                        style={{
                          transform: `translate(${pupilX}px, ${pupilY}px)`
                        }}
                      />
                      {/* Reflejo de luz especular en la esquina */}
                      <div className="w-3 h-3 rounded-full bg-white/80 absolute top-3 right-3 pointer-events-none" />
                    </>
                  )}
                </div>
              </div>

              {/* Ondas sonoras / actividad neuronal inferior */}
              <div className="mt-7 pt-4 border-t border-white/[0.08] flex items-center justify-between px-2 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400/90">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  SISTEMA NEURONAL ACTIVO
                </span>
                <span className="text-slate-500">TRAZAPP SENSE • S1</span>
              </div>
            </motion.div>

            {/* ── BOTÓN ICÓNICO CON RESPLANDOR "BREATHE" PULSANTE SUAVE ───────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-10 relative flex flex-col items-center"
            >
              {/* Resplandor Breathe Suave y Elegante (Sin saltos bruscos ni ping exagerado) */}
              <motion.div 
                className="absolute inset-0 -m-4 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none"
                animate={{
                  opacity: [0.3, 0.65, 0.3],
                  scale: [0.96, 1.04, 0.96],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEnterApp()
                }}
                className={`relative px-8 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide flex items-center gap-3 transition-all duration-300 shadow-2xl cursor-pointer ${
                  isActivating
                    ? 'bg-white text-emerald-950 scale-105 shadow-[0_0_60px_white]'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 hover:brightness-110 shadow-[0_10px_35px_rgba(16,185,129,0.4)] group-hover:scale-105'
                }`}
              >
                <Sparkles className={`w-5 h-5 ${isActivating ? 'animate-spin' : ''}`} />
                <span>{isActivating ? 'INICIANDO TRAZAPP OS...' : 'HACÉ CLIC PARA CONOCER TRAZAPP OS'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/35 px-4 py-1.5 rounded-full shadow-lg shadow-black/50"
              >
                <Mouse className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Hacé clic o scrolleá para ingresar</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              </motion.div>
            </motion.div>
          </div>

          {/* ── FOOTER TELEMETRÍA LATENTE ROTATIVA ──────────────────────── */}
          <footer className="w-full max-w-4xl z-20 pb-2">
            <div className="bg-black/50 border border-white/[0.08] rounded-2xl p-3.5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-slate-400">TELEMETRÍA EN VIVO:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentMetricIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="font-bold text-emerald-300 flex items-center gap-2"
                  >
                    <span>{latentMetrics[currentMetricIndex].label}:</span>
                    <span className="text-white">{latentMetrics[currentMetricIndex].value}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {latentMetrics[currentMetricIndex].state}
                    </span>
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  GESTIÓN NORMATIVA ARGENTINA
                </span>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
