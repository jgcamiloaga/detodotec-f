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
  LogIn,
  Package,
} from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { cn } from "@/lib/utils";



import { catalogService } from "@/features/products/services/catalog-service";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);

  const { getTotalItems, getTotalPrice, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const totalItems = mounted ? getTotalItems() : 0;
  const totalPrice = mounted ? getTotalPrice() : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    catalogService.getCategories().then(res => {
      const parents = res.filter(c => !c.parentId);
      setDbCategories(parents);
    }).catch(console.error);

    catalogService.getProducts(0, 3).then(res => {
      if (res && res.content) {
        setTrendingProducts(res.content);
      }
    }).catch(console.error);
  }, []);

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

        {/* MAIN BAR */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-24 gap-4 md:gap-6 lg:gap-10">

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
            <div className="hidden lg:flex items-center group relative shrink-0 z-50">
              <button className="flex items-center gap-2 text-white/90 hover:text-white font-medium py-2.5 px-4 rounded-xl hover:bg-white/10 transition-all duration-200">
                <Menu className="h-5 w-5" />
                <span className="text-[15px]">Catálogo</span>
                <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:rotate-180 text-white/70" />
              </button>
              {/* Dropdown */}
              <div className="absolute top-full left-0 w-[420px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left group-hover:translate-y-0 translate-y-2">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-4 flex flex-row gap-4">
                  {/* Tipos de Servicio */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Servicios</p>
                    <Link href={`/products?skuType=SALE`} className="px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] text-slate-700 font-medium transition-colors flex items-center justify-between group/link">
                      Venta
                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 text-slate-400" />
                    </Link>
                    <Link href={`/products?skuType=RENTAL`} className="px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] text-slate-700 font-medium transition-colors flex items-center justify-between group/link">
                      Alquiler
                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 text-slate-400" />
                    </Link>
                  </div>

                  <div className="w-px bg-slate-100" />

                  {/* Categorías */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Categorías</p>
                    {dbCategories.map(c => (
                      <Link key={c.slug} href={`/products?categorySlug=${c.slug}`} className="px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] text-slate-700 font-medium transition-colors flex items-center justify-between group/link">
                        {c.name}
                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 text-slate-400" />
                      </Link>
                    ))}
                  </div>
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
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-foreground rounded-full pl-11 pr-28 h-12 md:h-14 border-none focus:ring-4 focus:ring-accent/40 outline-none text-[15px] placeholder:text-slate-400 shadow-sm transition-all duration-200"
                  placeholder="Busca marcas, productos y más..."
                />
                <button type="submit" className="absolute inset-y-1.5 right-1.5 md:inset-y-2 md:right-2 px-6 bg-accent hover:bg-accent/90 text-white rounded-full text-[14px] font-bold transition-transform active:scale-95 shadow-sm">
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
                      {trendingProducts.map((prod) => (
                        <Link 
                          key={prod.id}
                          href={`/products/${prod.id}?tipo=${prod.skuType}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-3"
                        >
                          <Search className="h-4 w-4 text-slate-400" /> {prod.name}
                        </Link>
                      ))}
                      {trendingProducts.length === 0 && (
                        <span className="text-muted-foreground text-sm px-3">Cargando tendencias...</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Cluster (Account, Cart) */}
            <div className="flex items-center gap-4 md:gap-6 lg:gap-10 shrink-0 relative z-10">

              {/* Account Dropdown */}
              <div className="hidden lg:flex items-center group relative pb-2 -mb-2 z-50">
                <button className="flex items-center gap-3 text-white hover:bg-white/10 px-2 py-1.5 md:px-3 md:py-2.5 rounded-2xl transition-colors text-left focus:outline-none">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 border border-white/10 font-bold text-[15px] shadow-sm">
                    {isAuthenticated && user ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                  <div className="flex flex-col leading-tight">
                    {isAuthenticated && user ? (
                      <span className="text-[12px] text-white/80 font-medium">Hola, {user.name.split(' ')[0]}</span>
                    ) : (
                      <span className="text-[12px] text-white/80 font-medium">Bienvenido</span>
                    )}
                    <span className="text-[14px] font-bold flex items-center gap-1">
                      Mi cuenta <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180 text-white/70" />
                    </span>
                  </div>
                </button>

                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-2.5 flex flex-col gap-1.5 relative overflow-hidden">

                    {!isAuthenticated && (
                      <Link href="/login" className="px-4 py-2.5 hover:bg-primary/5 rounded-xl text-[14px] font-semibold text-primary flex items-center gap-3 transition-colors mb-1">
                        <LogIn className="h-5 w-5" /> Iniciar Sesión
                      </Link>
                    )}

                    <Link href="/profile" className="px-4 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] font-medium text-slate-700 flex items-center gap-3 transition-colors">
                      <User className="h-5 w-5 text-slate-400" /> Perfil
                    </Link>
                    <Link href="/orders" className="px-4 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] font-medium text-slate-700 flex items-center gap-3 transition-colors">
                      <Package className="h-5 w-5 text-slate-400" /> Mis pedidos
                    </Link>
                    <Link href="/addresses" className="px-4 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] font-medium text-slate-700 flex items-center gap-3 transition-colors">
                      <MapPin className="h-5 w-5 text-slate-400" /> Direcciones de entrega
                    </Link>

                    {isAuthenticated && user?.role === "admin" && (
                      <Link href="/admin/base-products" className="px-4 py-2.5 hover:bg-slate-50 rounded-xl text-[14px] font-medium text-primary flex items-center gap-3 transition-colors border-l-2 border-primary ml-1">
                        <Package className="h-5 w-5 text-primary" /> Panel de Administración
                      </Link>
                    )}

                    {isAuthenticated && (
                      <>
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                        <button onClick={logout} className="px-4 py-2.5 hover:bg-destructive/10 text-destructive rounded-xl text-[14px] font-medium text-left flex items-center gap-3 transition-colors">
                          <LogOut className="h-5 w-5" /> Cerrar sesión
                        </button>
                      </>
                    )}
                  </div>
                </div>
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
              <div className="flex items-center justify-center">
                <Link
                  href="/cart"
                  className="group flex items-center justify-center h-11 w-11 md:h-12 md:w-12 bg-white/15 hover:bg-white/25 border border-white/10 rounded-2xl transition-all shadow-sm relative shrink-0"
                  aria-label={`Carrito con ${totalItems} productos`}
                >
                  <div className="relative flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 md:h-[22px] md:w-[22px] text-white group-hover:scale-110 transition-transform" />
                    <AnimatePresence>
                      {totalItems > 0 && (
                        <motion.span
                          key="badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2.5 -right-2.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-[11px] font-bold border-2 border-primary"
                        >
                          {totalItems > 99 ? "99+" : totalItems}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </div>

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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Servicios</p>
                  <Link 
                    href="/products?skuType=SALE"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Venta
                  </Link>
                  <Link 
                    href="/products?skuType=RENTAL"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Alquiler
                  </Link>
                </div>

                <div className="px-4 pb-4 mb-4 border-b">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categorías destacadas</p>
                  {dbCategories.map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/products?categorySlug=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {cat.name}
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
