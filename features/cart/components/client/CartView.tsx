"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Button } from "@/features/ui/atoms/Button";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } =
    useCartStore();

  const total = getTotalPrice();
  const shipping = total >= 200 ? 0 : 15;
  const subtotal = total;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl mb-6"
        >
          🛒
        </motion.div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-3">
          Tu carrito está vacío
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Agrega productos increíbles y vuelve aquí para completar tu compra.
        </p>
        <Link href="/products">
          <Button variant="accent" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
            Explorar productos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">
              {getTotalItems()} {getTotalItems() === 1 ? "producto" : "productos"}
            </p>
            <button
              onClick={clearCart}
              className="text-sm text-destructive hover:underline flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Vaciar carrito
            </button>
          </div>

          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 p-4 bg-card border border-border rounded-2xl shadow-card"
              >
                {/* Image */}
                <Link href={`/products/${item.product.id}?tipo=${item.product.skuType}`} className="shrink-0">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={item.product.url || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-0.5">
                    {item.product.skuType}
                  </p>
                  <Link href={`/products/${item.product.id}?tipo=${item.product.skuType}`}>
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 hover:text-secondary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="font-bold text-lg text-foreground mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Quantity + delete */}
                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Subtotal */}
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>

                  {/* Quantity control */}
                  <div className="flex items-center rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="flex items-center justify-center h-7 w-7 hover:bg-muted transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex items-center justify-center h-7 w-8 text-sm font-bold border-x border-border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="flex items-center justify-center h-7 w-7 hover:bg-muted disabled:opacity-40 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue shopping */}
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-secondary font-medium hover:gap-2 transition-all">
            <ShoppingBag className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card sticky top-24">
            <h2 className="font-display font-bold text-lg text-foreground mb-5">
              Resumen de orden
            </h2>

            {/* Promo code */}
            <div className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Código de descuento"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <Button variant="outline" size="md">
                Aplicar
              </Button>
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-4 w-4" /> Envío
                </span>
                {shipping === 0 ? (
                  <span className="font-medium text-success">¡Gratis!</span>
                ) : (
                  <span className="font-medium">{formatPrice(shipping)}</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  Agrega {formatPrice(200 - subtotal)} más para envío gratis
                </p>
              )}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-extrabold text-xl text-foreground">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/checkout" className="block">
              <Button
                variant="accent"
                size="lg"
                className="w-full text-base font-bold"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Proceder al pago
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>Pago seguro</span>
              <span>·</span>
              <span>Envío asegurado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
