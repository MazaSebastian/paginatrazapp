import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/sections/Hero'
import { GrowyWelcomePortal } from '@/components/GrowyWelcomePortal'
import { GrowySection } from '@/sections/GrowySection'
import { InteractiveIoTRoom } from '@/components/interactive/InteractiveIoTRoom'
import { InteractiveBatchTracker } from '@/components/interactive/InteractiveBatchTracker'
import { InteractiveDispensary } from '@/components/interactive/InteractiveDispensary'
import { Pricing } from '@/sections/Pricing'
import { FaqSection } from '@/sections/FaqSection'
import { Footer } from '@/sections/Footer'
import { DemoModal } from '@/components/DemoModal'
import { TextType } from '@/components/ui/TextType'
import { SplitText } from '@/components/ui/SplitText'
import { BlurText } from '@/components/ui/BlurText'
import { motion } from 'framer-motion'
import { Cpu, Dna, Stethoscope } from 'lucide-react'

export function TrazappCorporateLanding() {
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isIntroOpen, setIsIntroOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const seen = sessionStorage.getItem('trazapp_intro_seen')
        return !seen // True si nunca lo vio en la sesión actual
      } catch (e) {
        return false
      }
    }
    return false
  })

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const navOffset = window.innerWidth < 640 ? 80 : 96
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }

  return (
    <div className="w-full min-h-screen bg-[#060913] text-slate-100 selection:bg-emerald-500/30 selection:text-white font-sans antialiased overflow-x-hidden relative">
      {/* Portal de Bienvenida Cinemático con Growy en Modo Rostro */}
      <GrowyWelcomePortal 
        isOpen={isIntroOpen} 
        onClose={() => setIsIntroOpen(false)} 
      />

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Navbar Capsule Flotante con Barra Institucional */}
      <Navbar 
        onOpenDemo={() => setIsDemoOpen(true)} 
        onOpenIntro={() => setIsIntroOpen(true)} 
      />

      <main className="relative z-10">
        {/* ── HERO SECTION ────────────────────────────────────────────── */}
        <Hero 
          onOpenDemo={() => setIsDemoOpen(true)} 
          onExploreModules={() => scrollToSection('growy')} 
        />

        {/* ── SECCIÓN GROWY: HARDWARE 3D & ASISTENTE IA MCP ────────────── */}
        <GrowySection onOpenDemo={() => setIsDemoOpen(true)} />

        {/* ── SECCIÓN 1 INTERACTIVA: TELEMETRÍA IOT ───────────────────── */}
        <section id="iot" className="w-full py-20 bg-[#070c17]/80 border-t border-white/[0.08] scroll-mt-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-2"
              >
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Módulo 01 • Telemetría Ambiental IoT
                </span>
              </motion.div>
              <SplitText
                text="Centro de Control & Salas en Vivo"
                tag="h2"
                className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                delay={28}
                duration={0.6}
                splitType="chars"
                from={{ opacity: 0, y: 35 }}
                to={{ opacity: 1, y: 0 }}
                rootMargin="-50px"
                textAlign="center"
              />
              <div className="mt-2 min-h-[44px] sm:min-h-[28px]">
                <TextType
                  text="Supervisá en tiempo real los parámetros críticos de tus salas: Déficit de Presión de Vapor (VPD), temperatura, humedad y fotoperiodo con alertas automáticas."
                  as="p"
                  className="text-sm text-slate-300 inline"
                  typingSpeed={16}
                  initialDelay={300}
                  startOnVisible={true}
                  loop={false}
                  showCursor={true}
                  cursorCharacter="|"
                  cursorClassName="text-emerald-400 font-bold ml-0.5"
                />
              </div>
            </div>

            <InteractiveIoTRoom />
          </div>
        </section>

        {/* ── SECCIÓN 2 INTERACTIVA: TRAZABILIDAD GENÉTICA ───────────────── */}
        <section id="trazabilidad" className="w-full py-20 bg-[#060a14] border-t border-white/[0.08] scroll-mt-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-2"
              >
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5" />
                  Módulo 02 • Trazabilidad Biotecnológica
                </span>
              </motion.div>
              <BlurText
                text="Matriz de Trazabilidad & Pasaporte de Lote"
                as="h2"
                delay={75}
                animateBy="words"
                direction="top"
                rootMargin="-50px"
                className="text-3xl sm:text-4xl font-black text-white tracking-tight justify-center"
              />
              <div className="mt-2 min-h-[44px] sm:min-h-[28px]">
                <TextType
                  text="Seguí la cadena de custodia de cada flor: desde la planta madre y esquejes hasta la floración, secado y liberación de lote con Hash SHA-256."
                  as="p"
                  className="text-sm text-slate-300 inline"
                  typingSpeed={16}
                  initialDelay={300}
                  startOnVisible={true}
                  loop={false}
                  showCursor={true}
                  cursorCharacter="|"
                  cursorClassName="text-emerald-400 font-bold ml-0.5"
                />
              </div>
            </div>

            <InteractiveBatchTracker />
          </div>
        </section>

        {/* ── SECCIÓN 3 INTERACTIVA: DISPENSARIO & REPROCANN ─────────────── */}
        <section id="dispensario" className="w-full py-20 bg-[#070c17]/80 border-t border-white/[0.08] scroll-mt-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-2"
              >
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Módulo 03 • Dispensario Médico Legal
                </span>
              </motion.div>
              <SplitText
                text="Validación REPROCANN & Entrega Blindada"
                tag="h2"
                className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                delay={28}
                duration={0.6}
                splitType="chars"
                from={{ opacity: 0, y: 35 }}
                to={{ opacity: 1, y: 0 }}
                rootMargin="-50px"
                textAlign="center"
              />
              <div className="mt-2 min-h-[44px] sm:min-h-[28px]">
                <TextType
                  text="Simulá la entrega a socios registrados: control estricto de cupo legal de 40g mensuales, verificación de vigencia médica y remito digital inmutable."
                  as="p"
                  className="text-sm text-slate-300 inline"
                  typingSpeed={16}
                  initialDelay={300}
                  startOnVisible={true}
                  loop={false}
                  showCursor={true}
                  cursorCharacter="|"
                  cursorClassName="text-emerald-400 font-bold ml-0.5"
                />
              </div>
            </div>

            <InteractiveDispensary />
          </div>
        </section>




        {/* ── PLANES Y PRECIOS ────────────────────────────────────────── */}
        <Pricing onOpenDemo={() => setIsDemoOpen(true)} />

        {/* ── FAQ CON ACCORDION ───────────────────────────────────────── */}
        <FaqSection onOpenDemo={() => setIsDemoOpen(true)} />
      </main>

      {/* ── FOOTER CORPORATIVO ───────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
