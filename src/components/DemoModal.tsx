import { useState } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [nombre, setNombre] = useState('')
  const [organizacion, setOrganizacion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tipo, setTipo] = useState('Club de Cultivo (50 a 150 socios)')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const mensaje = encodeURIComponent(
      `¡Hola TrazAPP! 👋 Me gustaría agendar una demostración en vivo de la plataforma de trazabilidad.\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `🏛️ *Club / Organización:* ${organizacion}\n` +
      `📱 *WhatsApp:* ${telefono}\n` +
      `🌱 *Perfil:* ${tipo}\n\n` +
      `¿Podemos coordinar una llamada de 15 minutos para ver la plataforma funcionando?`
    )

    const whatsappUrl = `https://wa.me/5491130288564?text=${mensaje}`

    setIsSubmitted(true)
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
    }, 600)
  }

  const handleClose = () => {
    setIsSubmitted(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg rounded-3xl bg-[#090d16]/95 backdrop-blur-2xl border border-emerald-500/20 p-6 sm:p-8 text-left text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)]">
        {!isSubmitted ? (
          <div>
            <DialogHeader className="gap-1 text-left">
              <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Ver TrazAPP en Acción
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-400 mt-1">
                Conectate con un especialista técnico para recorrer la telemetría IoT, el validador REPROCANN y la trazabilidad de lotes para tu club o proyecto.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nombre" className="text-xs font-semibold text-slate-300">
                  Nombre y Apellido
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Facundo Gómez"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-[#0f172a]/70 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/60 focus:ring-emerald-500/20 rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="organizacion" className="text-xs font-semibold text-slate-300">
                  Nombre del Club / Proyecto
                </Label>
                <Input
                  id="organizacion"
                  placeholder="Ej: Asociación Cannabis Medicinal del Sur"
                  required
                  value={organizacion}
                  onChange={(e) => setOrganizacion(e.target.value)}
                  className="bg-[#0f172a]/70 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/60 focus:ring-emerald-500/20 rounded-xl h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="text-xs font-semibold text-slate-300">
                    Número de WhatsApp
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="Ej: +54 9 11 2345-6789"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="bg-[#0f172a]/70 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/60 focus:ring-emerald-500/20 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tipo" className="text-xs font-semibold text-slate-300">
                    Tipo de Operación
                  </Label>
                  <select
                    id="tipo"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-[#0f172a]/70 border border-white/10 text-white text-xs rounded-xl h-11 px-3 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Club de Cultivo (hasta 50 socios)">Club (hasta 50 socios)</option>
                    <option value="Club de Cultivo (50 a 150 socios)">Club (50 a 150 socios)</option>
                    <option value="Asociación Civil (150 a 500 socios)">Asociación (+150 socios)</option>
                    <option value="Productor / Laboratorio Industrial">Productor / Lab Industrial</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Coordinar Demo por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Confidencialidad absoluta • Sin compromiso comercial</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Solicitud Recibida!</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Te estamos redirigiendo a WhatsApp oficial de TrazAPP para confirmar el día y horario que mejor te quede.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl text-xs"
              >
                Cerrar ventana
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
