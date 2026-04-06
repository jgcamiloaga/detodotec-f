"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  User,
  LogOut,
  MapPin,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { cn } from "@/lib/utils";

// Dummy Categories for the Mega Menu
const CATEGORIES = [
  "Ofertas",
  "Laptops",
  "Smartphones",
  "Gaming",
  "Audio",
  "Monitores",
  "Accesorios",
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { getTotalItems, getTotalPrice, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Search Focus Overlay */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSearchFocused(false)}
          />
        )}
      </AnimatePresence>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-colors duration-300",
          isScrolled ? "bg-primary shadow-xl" : "bg-primary"
        )}
      >
        {/* TOP BAR - Desktop Only */}
        <div className="hidden lg:flex items-center justify-between border-b border-white/10 px-4 h-9 text-[11px] font-medium text-white/80 bg-primary/95">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <MapPin className="h-3.5 w-3.5" />
              Enviar a Lima, Perú
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-secondary font-bold tracking-wide uppercase">
              🚀 Envíos gratis a todo el Perú en compras mayores a S/ 200
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <HelpCircle className="h-3.5 w-3.5" /> Ayuda
            </Link>
            <Link href="#" className="hover:text-white transition-colors">Vender</Link>
          </div>
        </div>

        {/* MAIN BAR */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4 lg:gap-8">

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden flex items-center justify-center p-2 -ml-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0" onClick={() => setIsSearchFocused(false)}>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-display font-extrabold text-2xl leading-none tracking-tight text-white">
                  DeTodo<span className="text-accent">Tec</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/70">
                  Tu tech store
                </span>
              </div>
            </Link>

            {/* Category Trigger (Desktop) */}
            <div className="hidden lg:flex items-center group relative shrink-0">
              <button className="flex items-center gap-2 text-white/90 hover:text-white font-medium py-2 px-3 rounded-lg hover:bg-white/10 transition-colors">
                <Menu className="h-5 w-5" />
                <span>Categorías</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Fake Dropdown */}
              <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-2xl border p-2 flex flex-col gap-1">
                  {CATEGORIES.map(c => (
                    <Link key={c} href={`/products?category=${c.toLowerCase()}`} className="px-4 py-2 hover:bg-slate-100 rounded-lg text-sm text-slate-700 font-medium transition-colors">
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Expansive Search Bar */}
            <div className={cn(
              "flex-1 max-w-3xl transition-all duration-300",
              isSearchFocused ? "relative z-50 scale-[1.02]" : "relative"
            )}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-foreground rounded-full pl-12 pr-4 h-11 border-none focus:ring-4 focus:ring-accent/50 outline-none text-sm placeholder:text-muted-foreground transition-shadow"
                  placeholder="Buscar laptops, audífonos, gaming, marcas..."
                />
                <button type="submit" className="absolute inset-y-1 right-1 px-4 bg-accent hover:bg-accent/90 text-white rounded-full text-sm font-bold transition-colors">
                  Buscar
                </button>
              </form>

              {/* Fake Live Search Results */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border p-4 text-sm text-foreground overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wider">Tendencias actuales</p>
                    <div className="flex flex-col gap-2">
                      <button className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                        <Search className="h-4 w-4 text-slate-400" /> Macbooks con chip M3
                      </button>
                      <button className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                        <Search className="h-4 w-4 text-slate-400" /> Sillas Gamer
                      </button>
                      <button className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-3">
                        <Search className="h-4 w-4 text-slate-400" /> Audífonos Sony WH-1000XM5
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Cluster (Account, Cart) */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 relative z-10">

              {/* Account Dropdown */}
              <div className="hidden lg:flex items-center group relative">
                {isAuthenticated && user ? (
                  <>
                    <Link href="#" className="flex items-center gap-3 text-white hover:bg-white/10 p-2 rounded-xl transition-colors">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-white/20 font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[11px] text-white/70">Hola, {user.name}</span>
                        <span className="text-sm font-bold">Mi cuenta <ChevronDown className="inline h-3 w-3" /></span>
                      </div>
                    </Link>
                    <div className="absolute top-full right-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-2xl border p-2 flex flex-col gap-1">
                        <Link href="#" className="px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700">Mis pedidos</Link>
                        <Link href="#" className="px-4 py-2 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700">Favoritos</Link>
                        <div className="h-px bg-slate-100 my-1" />
                        <button onClick={logout} className="px-4 py-2 hover:bg-destructive/10 text-destructive rounded-lg text-sm font-medium text-left flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href="/login" className="flex items-center gap-3 text-white hover:bg-white/10 p-2 rounded-xl transition-colors">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[11px] text-white/70">Bienvenido</span>
                      <span className="text-sm font-bold">Ingresa / Regístrate</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Mobile Profile Icon */}
              <div className="lg:hidden">
                {isAuthenticated ? (
                  <button onClick={logout} className="flex items-center justify-center h-10 w-10 bg-white/20 text-white rounded-full font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center justify-center h-10 w-10 text-white hover:bg-white/10 rounded-full transition-colors">
                    <User className="h-6 w-6" />
                  </Link>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 p-2 pr-3 sm:px-3 sm:py-2.5 rounded-xl transition-colors relative"
                aria-label={`Carrito con ${totalItems} productos`}
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[11px] font-bold border-2 border-primary"
                      >
                        {totalItems > 99 ? "99+" : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-white/70 font-medium">Mi carrito</span>
                  <span className="text-sm font-bold text-white">S/ {totalPrice.toLocaleString('es-PE')}</span>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* MOBILE EXTRA SEARCH BAR (Fijado abajo del header original) */}
        {/* Usamos el principal en mobile también, pero si ocupase mucho espacio se suele separar. En este diseño, la barra principal se adapta con flex-1. */}

      </header>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="p-4 bg-primary text-white flex items-center justify-between">
                <span className="font-bold text-lg">Menú</span>
                <button onClick={() => setIsMobileOpen(false)} className="p-1 hover:bg-white/20 rounded-md">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 py-4">
                <div className="px-4 pb-4 mb-4 border-b">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categorías destacadas</p>
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c}
                      href={`/products?category=${c.toLowerCase()}`}
                      className="block py-3 font-medium text-slate-700 hover:text-primary"
                    >
                      {c}
                    </Link>
                  ))}
                </div>

                <div className="px-4">
                  <Link href="#" className="flex items-center gap-3 py-3 text-slate-700 font-medium">
                    <MapPin className="h-5 w-5 text-slate-400" /> Envíos y Tiendas
                  </Link>
                  <Link href="#" className="flex items-center gap-3 py-3 text-slate-700 font-medium">
                    <HelpCircle className="h-5 w-5 text-slate-400" /> Centro de ayuda
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
