import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Trazabilidad', href: '#traceability' },
  { name: 'Funciones', href: '#features' },
  { name: 'Precios', href: '#pricing' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#traceability');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const top = section.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(`#${sections[i]}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-3 md:top-5 left-0 right-0 z-50 px-3 sm:px-6 flex flex-col items-center pointer-events-none"
    >
      {/* Outer Floating Pill Capsule */}
      <div
        className={`pointer-events-auto w-full max-w-6xl md:max-w-7xl rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-500 ${
          isScrolled
            ? 'bg-[#020617]/90 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(34,197,94,0.15)]'
            : 'bg-[#020617]/75 backdrop-blur-xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_15px_rgba(34,197,94,0.08)]'
        }`}
      >
        {/* Left: Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2 group shrink-0"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <img
            src="/LOGOTRAZAPP.png"
            alt="TrazAPP Logo"
            className="h-8 sm:h-10 md:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.2)]"
          />
        </motion.a>

        {/* Center: Inner Pill Segmented Navigation (Badge Gigante Estilo miFiestAPP) */}
        <nav className="hidden lg:flex items-center bg-[#091124]/90 border border-white/10 rounded-full p-1.5 shadow-inner backdrop-blur-md relative">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.href)}
                className={`relative px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'text-white bg-gradient-to-b from-white/10 to-emerald-500/20 border border-emerald-500/40 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activePillBar"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-7 h-[3px] bg-emerald-400 rounded-full shadow-[0_0_10px_#22c55e]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: CTA Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <motion.a
            href="https://software.trazapp.ar"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <button className="flex items-center gap-2 rounded-full border border-white/15 hover:border-emerald-500/40 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white px-4 md:px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Iniciar Sesión</span>
            </button>
          </motion.a>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link to="/register">
              <button className="relative group overflow-hidden rounded-full border border-emerald-500/60 hover:border-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 text-white px-5 md:px-6 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Comenzar</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full max-w-6xl mt-3 bg-[#020617]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl lg:hidden flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5 p-1.5 bg-[#091124]/90 border border-white/10 rounded-2xl">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                    activeSection === link.href
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  {activeSection === link.href && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                  )}
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10">
              <a
                href="https://software.trazapp.ar"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full"
              >
                <button className="w-full flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 text-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Iniciar Sesión</span>
                </button>
              </a>

              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <button className="w-full flex items-center justify-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/20 text-white px-4 py-3 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <span>Comenzar</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

