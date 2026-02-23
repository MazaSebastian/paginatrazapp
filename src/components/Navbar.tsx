import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Trazabilidad', href: '#traceability' },
  { name: 'Funciones', href: '#features' },
  // { name: 'IA Asistente', href: '#ai' },
  { name: 'Precios', href: '#pricing' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-[#020617]/20 backdrop-blur-xl border-b border-white/5 shadow-lg py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src="/LOGOTRAZAPP.png" alt="GrowAPP Logo" className="h-16 w-auto" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="relative px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-green-500 group-hover:w-1/2 transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <a href="https://software.trazapp.ar" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    Iniciar Sesión
                  </Button>
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/register">
                  <Button className="bg-[#020617]/40 backdrop-blur-xl border border-white/10 hover:border-green-500/50 text-white font-medium px-5 py-2 rounded-lg transition-all duration-300 hover:shadow-green-lg">
                    Comenzar
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden"
          >
            <div className="glass-strong mx-4 rounded-2xl p-4 border border-white/5">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-2">
                  <a href="https://software.trazapp.ar" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-slate-400 hover:text-white"
                    >
                      Iniciar Sesión
                    </Button>
                  </a>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      Comenzar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
