import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-2xl border border-white/5 relative z-10"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
          <p className="text-slate-400">Ingresa a tu panel de control</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Contraseña</label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button className="w-full bg-green-500 hover:bg-green-600 text-white mt-4">
            Iniciar Sesión
          </Button>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
