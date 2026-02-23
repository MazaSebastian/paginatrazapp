import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Bot, Wifi, Thermometer, Droplets, Sun, Wind, MessageSquare, Sparkles, Send } from 'lucide-react';
import { TiltCard } from '@/components/TiltCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const sensorData = [
  { label: 'Temperatura', value: 24.5, suffix: '°C', icon: Thermometer, status: 'optimal', color: '#22C55E' },
  { label: 'Humedad', value: 62, suffix: '%', icon: Droplets, status: 'optimal', color: '#3B82F6' },
  { label: 'Luz', value: 18, suffix: 'h', icon: Sun, status: 'active', color: '#F59E0B' },
  { label: 'CO2', value: 800, suffix: 'ppm', icon: Wind, status: 'good', color: '#8B5CF6' },
];

const chatMessages = [
  { type: 'user', text: '¿Cómo están mis plantas hoy?' },
  { type: 'ai', text: '¡Tu Lote #2847 está prosperando! La temperatura y humedad están en el rango óptimo. Noté un aumento del 12% en la tasa de crecimiento comparado con la semana pasada.' },
  { type: 'user', text: '¿Cuándo debo ajustar el ciclo de luz?' },
  { type: 'ai', text: 'Basado en la etapa vegetativa actual, recomiendo cambiar a ciclo de luz 12/12 en 5 días. Te enviaré un recordatorio.' },
];

// Animated Sensor Card with live updates
function SensorCard({ sensor, index }: { sensor: typeof sensorData[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [currentValue, setCurrentValue] = useState(sensor.value);

  // Simulate live data updates
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.2;
      setCurrentValue(prev => Number((prev + variation).toFixed(1)));
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass rounded-xl p-4 border border-white/5 hover:border-green-500/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <motion.div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${sensor.color}20` }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <sensor.icon className="w-5 h-5" style={{ color: sensor.color }} />
        </motion.div>
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: sensor.color }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {currentValue.toFixed(1)}{sensor.suffix}
      </div>
      <div className="text-xs text-slate-500">{sensor.label}</div>

      {/* Mini sparkline */}
      <div className="flex items-end gap-0.5 h-6 mt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ backgroundColor: sensor.color }}
            initial={{ height: '20%' }}
            animate={{ height: `${20 + Math.random() * 60}%` }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Chat Interface Component with typing animation
function ChatInterface() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev < chatMessages.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50, rotateY: -15 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="glass rounded-2xl border border-white/5 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Chat Header */}
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-3">
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(34, 197, 94, 0.4)',
              '0 0 0 10px rgba(34, 197, 94, 0)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
        <div>
          <div className="text-sm font-medium text-white">Asistente GrowAI</div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            En línea
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-4 space-y-4 h-64 overflow-hidden">
        <AnimatePresence>
          {chatMessages.slice(0, visibleMessages).map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm overflow-hidden ${msg.type === 'user'
                  ? 'bg-green-500 text-white rounded-br-md'
                  : 'bg-white/10 text-slate-300 rounded-bl-md border border-white/5'
                  }`}
              >
                {msg.type === 'ai' && visibleMessages === index + 1 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.01 }}
                  >
                    {msg.text.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                )}
                {(msg.type === 'user' || visibleMessages > index + 1) && msg.text}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {visibleMessages < chatMessages.length && visibleMessages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 px-4 py-2 rounded-2xl rounded-bl-md flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-white/5">
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:border-green-500/30 transition-colors cursor-text"
          whileHover={{ scale: 1.01 }}
        >
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-500 flex-1">Pregunta cualquier cosa sobre tu cultivo...</span>
          <motion.div
            className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(34, 197, 94, 0.4)' }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-4 h-4 text-green-400" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Tuya Integration Badge
function TuyaBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 cursor-pointer group"
      whileHover={{ scale: 1.05, borderColor: 'rgba(34, 197, 94, 0.5)' }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <Wifi className="w-4 h-4 text-green-400" />
      </motion.div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Impulsado por</span>
      <span className="text-sm font-semibold text-white">Tuya IoT</span>
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-green-400"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

export function AIIntegration() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="ai" className="relative py-32 overflow-hidden" ref={sectionRef}>
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(34, 197, 94, 0.05), transparent, rgba(52, 211, 153, 0.05), transparent)',
          filter: 'blur(100px)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-green-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <TuyaBadge />

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-6"
          >
            <span className="block text-gradient mb-2">
              Inteligencia de Cultivo
            </span>
            <span className="block">
              con Gemini
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Nuestro asistente de IA monitorea continuamente tus cultivos a través de sensores IoT,
            proporcionando información en tiempo real y recomendaciones automatizadas.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Sensor Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <TiltCard tiltAmount={5}>
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-green-500/30 transition-colors">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(34, 197, 94, 0.4)',
                          '0 0 0 8px rgba(34, 197, 94, 0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bot className="w-5 h-5 text-green-400" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Monitoreo en Vivo</h3>
                      <p className="text-xs text-slate-500">Lote #2847 • Cuarto A3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    En vivo
                  </div>
                </div>

                {/* Sensor Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {sensorData.map((sensor, index) => (
                    <SensorCard key={sensor.label} sensor={sensor} index={index} />
                  ))}
                </div>

                {/* Mini Chart */}
                <div className="mt-6 p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-400">Tasa de Crecimiento</span>
                    <motion.span
                      className="text-sm text-green-400"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      +<AnimatedCounter value={12} suffix="%" duration={2} /> ↑
                    </motion.span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90, 85, 95].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={isInView ? { height: `${height}%` } : {}}
                        transition={{
                          duration: 0.8,
                          delay: 0.5 + i * 0.05,
                          ease: [0.34, 1.56, 0.64, 1]
                        }}
                        className="flex-1 rounded-t-sm bg-green-500/30 hover:bg-green-400/50 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Right: Chat Interface */}
          <div>
            <ChatInterface />

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              {[
                'Alertas en tiempo real',
                'Análisis predictivo',
                'Programación automatizada',
                'Comandos de voz',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="w-3 h-3 text-green-400" />
                  </motion.div>
                  <span className="text-sm text-slate-400 hover:text-green-300 transition-colors">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
