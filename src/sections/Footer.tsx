import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Hardware Growy 3D', href: '#growy' },
      { name: 'Telemetría IoT', href: '#iot' },
      { name: 'Trazabilidad Genética', href: '#trazabilidad' },
      { name: 'Dispensario & REPROCANN', href: '#dispensario' },
      { name: 'Gobernanza & Finanzas', href: '#gobernanza' },
      { name: 'Planes & Precios', href: '#precios' },
    ],
    legal: [
      { name: 'Términos de Servicio', href: '#' },
      { name: 'Política de Privacidad', href: '#' },
      { name: 'Ley 25.326 Protección de Datos', href: '#' },
      { name: 'Secreto Médico & Seguridad AES-256', href: '#' },
    ],
    company: [
      { name: 'Sobre CreAPP', href: '#' },
      { name: 'Soporte Técnico', href: 'https://wa.me/5491130288564' },
      { name: 'Documentación de API', href: '#' },
      { name: 'Contacto Comercial', href: 'mailto:creapp.ar@gmail.com' },
    ]
  }

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#050810] text-slate-400 text-xs">
      {/* Top Emerald Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (Col 2) */}
          <div className="sm:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <img
                src="/LOGOTRAZAPP.png"
                alt="TrazAPP Logo"
                className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]"
              />
            </a>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma Cloud de Trazabilidad, IoT y Gestión Operativa para Clubes de Cultivo, Dispensarios e Industria del Cannabis Medicinal en Argentina.
            </p>

            <div className="pt-2 space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>creapp.ar@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+54 9 11-3028-8564</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>

          {/* Módulos */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-emerald-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Marco Normativo */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Marco Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-emerald-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte y Empresa */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Contacto & Empresa</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} TrazAPP OS by CreAPP. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Infraestructura Segura • Servidores Cloud en Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
