import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Menu, X } from 'lucide-react'
import { SpecularButton } from '@/components/ui/SpecularButton'

interface NavbarProps {
  onOpenDemo: () => void
  onOpenIntro?: () => void
}

export function Navbar({ onOpenDemo, onOpenIntro }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('iot')

  const navItems = [
    { id: 'growy', label: 'Growy 3D' },
    { id: 'iot', label: 'Telemetría' },
    { id: 'trazabilidad', label: 'Trazabilidad' },
    { id: 'dispensario', label: 'Dispensario' },
    { id: 'gobernanza', label: 'Gobernanza' },
    { id: 'precios', label: 'Precios' },
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const target = document.getElementById(id)
    if (!target) return

    const navOffset = window.innerWidth < 640 ? 80 : 96
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition

    const duration = Math.min(Math.max(Math.abs(distance) * 0.55, 700), 1000)
    let startTimestamp: number | null = null

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const timeElapsed = timestamp - startTimestamp
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easeInOutCubic(progress)

      window.scrollTo(0, startPosition + distance * ease)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    const sectionIds = ['growy', 'iot', 'trazabilidad', 'dispensario', 'gobernanza', 'precios']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.15 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* ── BARRA SUPERIOR INSTITUCIONAL CENTRADA ───────────────────────── */}
      <div className="border-b border-white/[0.06] bg-[#070b14]/95 backdrop-blur-md py-2 px-4 text-xs text-slate-400 z-50 relative">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-center text-[11px] sm:text-xs">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              TrazAPP OS
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300">
              Plataforma Cloud de Trazabilidad, IoT y Gestión Integral de Cannabis Medicinal en Argentina
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 shrink-0">
            <span className="text-slate-700 hidden sm:inline">|</span>
            {onOpenIntro && (
              <>
                <button
                  type="button"
                  onClick={onOpenIntro}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  title="Ver portal de bienvenida interactivo de Growy"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Ver Intro</span>
                </button>
                <span className="text-slate-600">•</span>
              </>
            )}
            <Link
              to="/login"
              className="text-slate-300 hover:text-white transition-colors font-medium hover:underline"
            >
              Acceso a Clubes
            </Link>
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenDemo}
              className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline underline-offset-2 cursor-pointer transition-colors"
            >
              Solicitar Demo
            </button>
          </div>
        </div>
      </div>

      {/* ── NAVBAR FLOTANTE ESTILO PILL CAPSULE ───────────────────────────── */}
      <header className="sticky top-2.5 sm:top-4 z-40 w-full max-w-full px-2 sm:px-6 pointer-events-none transition-all duration-300">
        <div
          className={`pointer-events-auto max-w-5xl mx-auto rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-[#090e18]/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.12)] border border-emerald-500/30 ring-1 ring-white/10'
              : 'bg-[#090e18]/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_15px_rgba(16,185,129,0.06)] border border-white/[0.08] ring-1 ring-white/5'
          }`}
        >
          <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
            {/* Lado Izquierdo: Logo TrazAPP (Ancho balanceado 1:1 con el lado derecho) */}
            <div className="w-32 sm:w-40 flex items-center justify-start shrink-0">
              <a href="#" className="flex items-center gap-2 group">
                <img
                  src="/LOGOTRAZAPP.png"
                  alt="TrazAPP Logo"
                  className="h-7 sm:h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform"
                />
              </a>
            </div>

            {/* Centro: Navegación Capsule (Matemáticamente centrada y concisa) */}
            <nav className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/[0.08]">
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer z-10 ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-[0_2px_12px_rgba(16,185,129,0.3)] -z-10"
                      />
                    )}
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Lado Derecho: Mismo ancho (w-32 sm:w-40) con un único botón limpio para simetría visual */}
            <div className="w-32 sm:w-40 flex items-center justify-end shrink-0 gap-2">
              <SpecularButton
                size="sm"
                radius={20}
                tint="#059669"
                tintOpacity={1}
                textColor="#ffffff"
                lineColor="#6ee7b7"
                baseColor="#047857"
                intensity={1.3}
                shineSize={18}
                shineFade={40}
                thickness={1.5}
                speed={0.4}
                followMouse
                proximity={180}
                onClick={onOpenDemo}
                className="h-9 px-4 rounded-full shadow-sm shadow-emerald-600/20 cursor-pointer flex items-center justify-center"
              >
                <span className="font-semibold text-xs text-white whitespace-nowrap">
                  Agendar Demo
                </span>
              </SpecularButton>

              {/* Botón menú móvil */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown flotante móvil */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mt-2 max-w-md mx-auto p-4 bg-[#090e18]/95 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 shadow-2xl ring-1 ring-white/10 flex flex-col gap-1 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    scrollToSection(item.id)
                  }}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-2xl transition-colors flex items-center justify-between text-left cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                      Actual
                    </span>
                  )}
                </button>
              )
            })}
            <div className="pt-3 mt-1 border-t border-white/[0.08] flex items-center justify-between px-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-slate-300 hover:text-emerald-400 py-1"
              >
                Acceso Clubes →
              </Link>
              {onOpenIntro && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenIntro()
                  }}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 py-1"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Ver Intro</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
