import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Funciones', href: '#features' },
    { name: 'Precios', href: '#pricing' },
    { name: 'Integraciones', href: '#' },
    { name: 'API', href: '#' },
  ],
  company: [
    { name: 'Nosotros', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Carreras', href: '#' },
    { name: 'Prensa', href: '#' },
  ],
  resources: [
    { name: 'Documentación', href: '#' },
    { name: 'Centro de Ayuda', href: '#' },
    { name: 'Comunidad', href: '#' },
    { name: 'Contacto', href: '#' },
  ],
  legal: [
    { name: 'Privacidad', href: '#' },
    { name: 'Términos', href: '#' },
    { name: 'Seguridad', href: '#' },
    { name: 'Cookies', href: '#' },
  ],
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <img src="/LOGOTRAZAPP.png" alt="GrowAPP Logo" className="h-20 w-auto" />
            </motion.a>

            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Solución completa de trazabilidad para el cultivo de cannabis medicinal.
              Seguimiento completo de principio a fin, cada paso rastreado y verificado.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4 text-green-500" />
                <span>creapp.ar@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>Buenos Aires, Argentina</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-green-500" />
                <span>+54 9 11-3028-8564</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Producto</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} TrazAPP by CreAPP. Todos los derechos reservados.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-green-400 hover:bg-white/10 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
