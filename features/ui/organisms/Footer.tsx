import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Productos: [
    { label: "Laptops", href: "/products?category=laptops" },
    { label: "Smartphones", href: "/products?category=smartphones" },
    { label: "Audio", href: "/products?category=audio" },
    { label: "Monitores", href: "/products?category=monitores" },
    { label: "Gaming", href: "/products?category=gaming" },
  ],
  Empresa: [
    { label: "Sobre nosotros", href: "/about" },
    { label: "Blog tech", href: "/blog" },
    { label: "Trabaja con nosotros", href: "/jobs" },
    { label: "Afiliados", href: "/affiliates" },
  ],
  Soporte: [
    { label: "Centro de ayuda", href: "/help" },
    { label: "Seguimiento de pedido", href: "/tracking" },
    { label: "Devoluciones", href: "/returns" },
    { label: "Garantías", href: "/warranty" },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter / X" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="font-display font-extrabold text-2xl">
                DeTodo<span className="text-accent">Tec</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-6">
              Tu tienda online de tecnología con los mejores productos, precios garantizados y envíos a todo el Perú.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 text-accent" />
                <span>hola@detodotec.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 text-accent" />
                <span>+51 (1) 234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Lima, Perú</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 text-white/70 hover:bg-accent hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white hover:translate-x-0.5 transition-all duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} DeTodoTec. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
