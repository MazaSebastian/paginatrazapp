import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { BlurText } from '@/components/BlurText';

const countryPrefixes = [
    { code: '+54', country: '🇦🇷 Argentina' },
    { code: '+56', country: '🇨🇱 Chile' },
    { code: '+57', country: '🇨🇴 Colombia' },
    { code: '+52', country: '🇲🇽 México' },
    { code: '+51', country: '🇵🇪 Perú' },
    { code: '+598', country: '🇺🇾 Uruguay' },
    { code: '+595', country: '🇵🇾 Paraguay' },
    { code: '+591', country: '🇧🇴 Bolivia' },
    { code: '+55', country: '🇧🇷 Brasil' },
    { code: '+58', country: '🇻🇪 Venezuela' },
    { code: '+593', country: '🇪🇨 Ecuador' },
    { code: '+506', country: '🇨🇷 Costa Rica' },
    { code: '+507', country: '🇵🇦 Panamá' },
    { code: '+1', country: '🇺🇸 Estados Unidos' },
    { code: '+34', country: '🇪🇸 España' },
];

export function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isPageReady, setIsPageReady] = useState(false);

    // Cinematic success states
    const [submissionState, setSubmissionState] = useState<'idle' | 'success_step_1' | 'success_step_2' | 'success_step_done'>('idle');

    // Mount effect to fade in the page smoothly after a short delay
    // This allows the heavy 3D Canvas backgrounds to initialize behind a black screen
    // preventing the harsh white glitch
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPageReady(true);
        }, 800); // 800ms delay to ensure 3D canvas is ready
        return () => clearTimeout(timer);
    }, []);

    const [searchParams] = useSearchParams();
    const defaultPlan = searchParams.get('plan') || '';

    const [formData, setFormData] = useState({
        name: '',
        countryCode: '+54',
        phone: '',
        email: '',
        plan: defaultPlan,
        source: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await emailjs.send(
                'service_e5sucmy',
                'template_wogw9bs',
                {
                    name: formData.name,
                    phone: `${formData.countryCode} ${formData.phone}`,
                    email: formData.email,
                    plan: formData.plan,
                    source: formData.source || 'No especificado',
                },
                'G1EQqBFxisDmG1ZPa'
            );

            // We no longer trigger a success toast because we have the cinematic text
            // Start the cinematic sequence
            setSubmissionState('success_step_1');

            // Wait 5 seconds for the first message to animate and be readable
            // (800ms fade in + ~1500ms blur in + 2700ms reading time)
            setTimeout(() => {
                setSubmissionState('success_step_2');

                // Wait another 4 seconds for "Muchas Gracias!" to animate and be read
                // (It mounts 800ms later due to mode="wait" on AnimatePresence)
                setTimeout(() => {
                    // Trigger fade out of the second message
                    setSubmissionState('success_step_done');

                    // Wait for the exit animation to finish (800ms) before navigating
                    setTimeout(() => {
                        navigate('/');
                    }, 800);
                }, 4000);
            }, 5000);

        } catch (error) {
            console.error('Error enviando email:', error);
            toast.error('Error al enviar la solicitud', {
                description: 'Por favor, intenta nuevamente más tarde.',
                style: {
                    background: '#0F172A',
                    color: '#fff',
                    border: '1px solid #EF4444'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Global Loader/Mask to hide the WebGL initialization flash */}
            <AnimatePresence>
                {!isPageReady && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center pointer-events-none"
                    >
                        <Loader2 className="w-8 h-8 text-green-500 animate-spin opacity-50" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden py-24">
                <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {submissionState === 'idle' ? (
                        <motion.div
                            key="registration-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isPageReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-[calc(100%-2rem)] md:w-full max-w-xl glass p-6 md:p-8 rounded-2xl border border-white/5 relative z-10 my-auto mx-4 md:mx-auto"
                        >
                            <div className="mb-8 text-center">
                                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Volver al inicio
                                </Link>
                                <h2 className="text-3xl font-bold text-white mb-2">Comienza Ahora</h2>
                                <p className="text-slate-400">Déjanos tus datos y nos pondremos en contacto para ayudarte a escalar tu cultivo.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 transition-colors"
                                            placeholder="Ej: Juan Pérez"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Número de Teléfono *</label>
                                        <div className="flex gap-2">
                                            <Select
                                                value={formData.countryCode}
                                                onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger className="w-[100px] h-[46px] bg-[#1A2235] border border-white/5 rounded-lg px-2 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-colors text-center cursor-pointer">
                                                    <SelectValue placeholder="+54" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#0F172A] border border-white/10 text-white z-[110]">
                                                    {countryPrefixes.map((prefix) => (
                                                        <SelectItem key={prefix.country} value={prefix.code} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                                            {prefix.country.split(' ')[0]} {prefix.code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="flex-1 min-w-0 bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 transition-colors"
                                                placeholder="11 1234-5678"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500/50 transition-colors"
                                        placeholder="tu@email.com"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">¿En qué plan estás interesado? *</label>
                                    <Select
                                        required
                                        value={formData.plan}
                                        onValueChange={(value) => setFormData({ ...formData, plan: value })}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full h-[46px] bg-[#1A2235] border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-colors text-left font-normal flex justify-between items-center">
                                            <SelectValue placeholder="Selecciona un plan..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0F172A] border border-white/10 text-white z-[110]">
                                            <SelectItem value="individual" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Plan Individual</SelectItem>
                                            <SelectItem value="team" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Plan Equipo</SelectItem>
                                            <SelectItem value="ngo" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Plan ONG / Club</SelectItem>
                                            <SelectItem value="no_estoy_seguro" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Aún no estoy seguro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">¿Cómo nos conociste?</label>
                                    <Select
                                        value={formData.source}
                                        onValueChange={(value) => setFormData({ ...formData, source: value })}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full h-[46px] bg-[#1A2235] border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-colors text-left font-normal flex justify-between items-center">
                                            <SelectValue placeholder="Opcional..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0F172A] border border-white/10 text-white z-[110]">
                                            <SelectItem value="instagram" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Instagram</SelectItem>
                                            <SelectItem value="google" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Búsqueda de Google</SelectItem>
                                            <SelectItem value="recomendacion" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Recomendación de un amigo/colega</SelectItem>
                                            <SelectItem value="evento" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Evento o Expo</SelectItem>
                                            <SelectItem value="otro" className="focus:bg-white/10 focus:text-green-400 cursor-pointer">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white mt-6 py-6 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Solicitar Contacto'
                                    )}
                                </Button>

                                <p className="text-center text-xs text-slate-500 mt-4">
                                    Al enviar este formulario, aceptas que nos contactemos contigo para proveerte información sobre nuestros servicios.
                                </p>
                            </form>
                        </motion.div>
                    ) : submissionState === 'success_step_1' ? (
                        <motion.div
                            key="success-step-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 text-center"
                        >
                            <BlurText
                                text={`${formData.name.split(' ')[0]}, ¡en breve se contactará nuestro equipo!`}
                                delay={40}
                                animateBy="words"
                                direction="top"
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-tight drop-shadow-2xl"
                            />
                        </motion.div>
                    ) : submissionState === 'success_step_2' ? (
                        <motion.div
                            key="success-step-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
                            transition={{ duration: 0.8 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 text-center"
                        >
                            <BlurText
                                text="¡Muchas Gracias!"
                                delay={80}
                                animateBy="letters"
                                direction="bottom"
                                className="text-3xl md:text-5xl lg:text-6xl font-black text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                            />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </>
    );
}
