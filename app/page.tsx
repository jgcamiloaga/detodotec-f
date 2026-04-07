import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Headphones, Zap, Monitor, Smartphone, Volume2, Gamepad2, Laptop, Package } from "lucide-react";
import { getFeaturedProducts } from "@/features/products/data/mock-products";
import { ProductCard } from "@/features/ui/molecules/ProductCard";
import { HeroCTA } from "@/features/ui/organisms/HeroCTA";

const CATEGORIES = [
  { id: "laptops", name: "Laptops", icon: Laptop, color: "bg-blue-50 text-blue-600", href: "/products?category=laptops" },
  { id: "smartphones", name: "Smartphones", icon: Smartphone, color: "bg-purple-50 text-purple-600", href: "/products?category=smartphones" },
  { id: "audio", name: "Audio", icon: Volume2, color: "bg-green-50 text-green-600", href: "/products?category=audio" },
  { id: "monitores", name: "Monitores", icon: Monitor, color: "bg-orange-50 text-orange-600", href: "/products?category=monitores" },
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "bg-red-50 text-red-600", href: "/products?category=gaming" },
  { id: "accesorios", name: "Accesorios", icon: Package, color: "bg-teal-50 text-teal-600", href: "/products?category=accesorios" },
];

const BENEFITS = [
  {
    icon: Truck,
    title: "Envío rápido",
    description: "Despacho en 24-72 horas a todo el Perú",
    color: "text-secondary",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    description: "Pago 100% seguro con cifrado SSL",
    color: "text-success",
  },
  {
    icon: CreditCard,
    title: "Hasta 36 cuotas",
    description: "Paga con todas las tarjetas y PSE",
    color: "text-accent",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description: "Atención personalizada siempre disponible",
    color: "text-primary",
  },
];

export const metadata = {
  title: "DeTodoTec — Tecnología que transforma tu vida",
  description:
    "Descubre los mejores productos tech: laptops, smartphones, audio y más. Envíos gratis, garantía oficial y los mejores precios de Perú.",
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-hero overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-secondary/20 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/30 blur-[80px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Zap className="h-4 w-4 text-accent" />
                <span>Nuevos productos cada semana</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-6">
                Tecnología que
                <span className="block text-accent mt-1">transforma</span>
                <span className="block text-white/90">tu vida</span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Los mejores productos tech del mercado con garantía oficial, envíos expresos y los precios más competitivos de Perú.
              </p>

              <HeroCTA />

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
                {[
                  { value: "20K+", label: "Clientes felices" },
                  { value: "500+", label: "Productos" },
                  { value: "4.9★", label: "Calificación" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-display font-extrabold text-2xl text-white">
                      {stat.value}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating product cards preview */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative h-[480px] w-[420px]">
                {/* Main card */}
                <div className="absolute top-0 right-0 w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-white/5">
                    <Image
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80"
                      alt="MacBook Pro"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wide">Apple</p>
                  <p className="text-white font-semibold text-sm mt-0.5">MacBook Pro 16" M3 Max</p>
                  <p className="text-accent font-bold text-lg mt-1">$18.500.000</p>
                </div>

                {/* Secondary floating cards */}
                <div className="absolute bottom-16 left-0 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1545127398-14699f92334b?w=200&q=80"
                        alt="Sony WH-1000XM5"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold line-clamp-1">Sony WH-1000XM5</p>
                      <p className="text-accent text-sm font-bold">$1.290.000</p>
                    </div>
                  </div>
                </div>

                {/* Badge card */}
                <div className="absolute bottom-0 right-4 bg-success text-white rounded-xl px-4 py-2.5 shadow-xl">
                  <p className="text-xs font-medium">Envío gratis</p>
                  <p className="text-sm font-bold">en todo el Perú</p>
                </div>

                {/* Floating badge top left */}
                <div className="absolute top-4 left-4 bg-accent text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-md">
                  Hasta 30% OFF
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full fill-background">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ─── BENEFITS BAR ─── */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:shadow-soft transition-shadow"
              >
                <div className={`p-2 rounded-lg bg-muted ${benefit.color}`}>
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                Lo más destacado
              </p>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-foreground">
                Productos destacados
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-secondary font-semibold text-sm hover:gap-2.5 transition-all group"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link href="/products">
              <span className="inline-flex items-center gap-1.5 text-secondary font-semibold">
                Ver todos los productos <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-hero p-8 md:p-12 lg:p-16">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-[60px]" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-secondary/20 blur-[60px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                  <Zap className="h-4 w-4" />
                  Oferta por tiempo limitado
                </div>
                <h2 className="font-display font-extrabold text-3xl lg:text-5xl text-white mb-4">
                  Hasta <span className="text-accent">30% OFF</span>
                  <br className="hidden md:block" /> en laptops premium
                </h2>
                <p className="text-white/70 text-lg max-w-md">
                  Aprovecha nuestras ofertas exclusivas en las mejores laptops del mercado. ¡Cupos limitados!
                </p>
              </div>
              <div className="flex flex-col gap-3 min-w-fit">
                <Link href="/products?category=laptops">
                  <span className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-600 transition-all hover:shadow-glow-accent active:scale-95">
                    Ver laptops
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Link>
                <Link href="/products">
                  <span className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all">
                    Explorar todo
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
