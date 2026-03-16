import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import ShinyText from '@/components/ShinyText';

export function AnimatedMockups() {
    const containerRef = useRef(null);
    const isMobile = useIsMobile();

    // Set up scroll-linked animations
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end center"] // Start animation when top enters viewport, end when bottom hits center
    });

    // Transformations for Left Phone
    const leftPhoneX = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "-50%" : "-90%"]);
    const leftPhoneY = useTransform(scrollYProgress, [0, 1], [100, isMobile ? 30 : 20]);
    const leftPhoneRotate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -6 : -10]);
    const leftPhoneScale = useTransform(scrollYProgress, [0, 1], [0.8, isMobile ? 0.85 : 0.9]);

    // Transformations for Right Phone
    const rightPhoneX = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "50%" : "90%"]);
    const rightPhoneY = useTransform(scrollYProgress, [0, 1], [100, isMobile ? 30 : 20]);
    const rightPhoneRotate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 6 : 10]);
    const rightPhoneScale = useTransform(scrollYProgress, [0, 1], [0.8, isMobile ? 0.85 : 0.9]);

    // Transformations for Center Phone
    const centerPhoneY = useTransform(scrollYProgress, [0, 1], [150, 0]);
    const centerPhoneScale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

    // Glow Effect Opacity and Scale
    const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
    const glowScale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

    return (
        <div ref={containerRef} className="relative w-full max-w-6xl mx-auto py-10 md:py-24 flex flex-col items-center justify-center">
            {/* Título de la sección */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-12 md:mb-20 z-20 px-4"
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                    <ShinyText text="Acceso a tu información," />
                    <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                        desde cualquier lugar.
                    </span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                    Control total de tus cultivos, pacientes y dispensarios en la palma de tu mano.
                    Sincronización en tiempo real con la máxima seguridad.
                </p>
            </motion.div>

            {/* Contenedor de los teléfonos */}
            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[525px] flex items-center justify-center perspective-1000 mt-4 md:mt-8">

                {/* Resplandor (Glow) de fondo optimizado */}
                <motion.div
                    style={{ opacity: glowOpacity, scale: glowScale }}
                    className="absolute inset-0 max-w-3xl mx-auto bg-green-500/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none will-change-transform"
                />

                {/* Teléfono Izquierdo (telefono1.png) */}
                <motion.div
                    className="absolute z-10 w-[31%] md:w-[20%] max-w-[225px] will-change-transform"
                    style={{
                        x: leftPhoneX,
                        y: leftPhoneY,
                        scale: leftPhoneScale,
                        rotateZ: leftPhoneRotate
                    }}
                >
                    {/* Animación de levitación optimizada (solo Y) */}
                    <motion.img
                        src="/telefono1.png"
                        alt="App View 1"
                        className="w-full h-auto drop-shadow-2xl object-contain will-change-transform"
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </motion.div>

                {/* Teléfono Derecho (telefono3.png) */}
                <motion.div
                    className="absolute z-10 w-[31%] md:w-[20%] max-w-[225px] will-change-transform"
                    style={{
                        x: rightPhoneX,
                        y: rightPhoneY,
                        scale: rightPhoneScale,
                        rotateZ: rightPhoneRotate
                    }}
                >
                    {/* Animación de levitación optimizada (solo Y) */}
                    <motion.img
                        src="/telefono3.png"
                        alt="App View 3"
                        className="w-full h-auto drop-shadow-2xl object-contain will-change-transform"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    />
                </motion.div>

                {/* Teléfono Central (telefono2.png - Login) */}
                <motion.div
                    className="absolute z-20 w-[39%] md:w-[22%] max-w-[268px] will-change-transform"
                    style={{
                        y: centerPhoneY,
                        scale: centerPhoneScale
                    }}
                >
                    {/* Animación de levitación optimizada (solo Y) */}
                    <motion.img
                        src="/telefono2.png"
                        alt="App Login View"
                        className="w-full h-auto drop-shadow-[0_20px_50px_rgba(34,197,94,0.4)] object-contain will-change-transform"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    />
                </motion.div>

            </div>
        </div>
    );
}
