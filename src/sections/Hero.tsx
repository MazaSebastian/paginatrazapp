import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SplitText } from '@/components/ui/SplitText'
import { TextType } from '@/components/ui/TextType'
import { SpecularButton } from '@/components/ui/SpecularButton'
import { useIsMobile } from '@/hooks/use-mobile'

interface HeroProps {
  onOpenDemo: () => void
  onExploreModules: () => void
}

export function Hero({ onOpenDemo, onExploreModules }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[82vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden pt-3 sm:pt-12 pb-14 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-b from-emerald-600/15 via-teal-600/10 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Grid Pattern sutil con máscara elíptica suave */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none -z-10"
        style={{
          backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 35%, black 20%, transparent 85%)'
        }}
      />

      {/* Gradiente de fusión suave hacia la siguiente sección (elimina el corte abrupto de fondo) */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-b from-transparent via-[#060913]/70 to-[#060913] pointer-events-none -z-10" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto flex flex-col items-center pt-1 sm:pt-6"
        style={isMobile ? {} : { y, opacity }}
      >

        {/* Headline con SplitText */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.12]">
          <SplitText
            text="La plataforma que profesionaliza tu cultivo y "
            tag="span"
            className="text-white"
            delay={25}
            duration={0.65}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 35 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.05}
            rootMargin="0px"
            textAlign="center"
          />
          <SplitText
            text="blinda tu club cannábico"
            tag="span"
            className="text-emerald-400 inline-block font-black drop-shadow-[0_0_25px_rgba(16,185,129,0.25)]"
            delay={25}
            duration={0.65}
            splitType="chars"
            from={{ opacity: 0, y: 35 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />
        </h1>

        {/* Subtítulo dinámico con TextType */}
        <div className="mt-6 max-w-3xl mx-auto min-h-[64px] sm:min-h-[52px]">
          <TextType
            text="Descubrí en vivo cómo operan nuestras herramientas: telemetría ambiental IoT, pasaporte genético inviolable con QR, dispensario legal con cupo REPROCANN y gobernanza de clubes."
            as="p"
            className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal inline"
            typingSpeed={16}
            initialDelay={400}
            loop={false}
            showCursor={true}
            cursorCharacter="|"
            cursorClassName="text-emerald-400 font-bold ml-1"
          />
        </div>

        {/* Botones de Acción Specular */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <SpecularButton
            size="lg"
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
            proximity={280}
            onClick={onOpenDemo}
            className="w-full sm:w-auto h-14 px-8 shadow-xl shadow-emerald-600/25 cursor-pointer"
          >
            <span className="font-extrabold text-base flex items-center gap-2.5">
              Agendar Demo en Vivo
              <ArrowRight className="w-5 h-5" />
            </span>
          </SpecularButton>

          <SpecularButton
            size="lg"
            radius={16}
            tint="#0f172a"
            tintOpacity={0.96}
            textColor="#ffffff"
            lineColor="#10b981"
            baseColor="#1e293b"
            intensity={1.2}
            shineSize={20}
            shineFade={45}
            thickness={1.5}
            speed={0.4}
            followMouse
            proximity={280}
            onClick={onExploreModules}
            className="w-full sm:w-auto h-14 px-8 border border-white/15 shadow-sm cursor-pointer hover:border-emerald-400/60"
          >
            <span className="font-bold text-base text-slate-200 flex items-center gap-2">
              Explorar Módulos en Vivo
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </span>
          </SpecularButton>
        </div>

      </motion.div>
    </section>
  )
}
