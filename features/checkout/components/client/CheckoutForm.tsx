"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Button } from "@/features/ui/atoms/Button";
import { formatPrice } from "@/lib/utils";
import { orderService } from "../../services/order-service";
import { showToast } from "@/features/ui/atoms/Toaster";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotalPrice();
  const shipping = total >= 200 ? 0 : 15;
  const grandTotal = total + shipping;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const listItem = items.map((item) => ({
        productId: item.product.id,
        type: item.product.skuType,
        quantity: item.quantity,
      }));

      await orderService.createOrder({
        listItem,
        platform: "WEB",
        currency: "PEN",
      });

      clearCart();
      showToast({
        title: "¡Pedido registrado exitosamente!",
        description: "Se ha enviado un correo para realizar el pago de forma externa.",
        type: "success",
      });
      
      router.push("/orders");
    } catch (error: any) {
      console.error(error);
      showToast({
        title: "Error al crear pedido",
        description: error.message || "Ocurrió un error al procesar tu orden. Intenta nuevamente.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Tu carrito está vacío.</p>
        <Link href="/products">
          <Button variant="accent">Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/cart" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Detalle de Productos */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-display font-bold text-xl text-foreground mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-secondary" />
              Resumen del Pedido
            </h2>

            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.product.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0 border">
                    <Image
                      src={item.product.url || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cantidad: {item.quantity} · Tipo: {item.product.skuType === "SALE" ? "Venta" : "Alquiler"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje de Pago Externo */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4 items-start">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-sm text-foreground mb-1">
                Pago coordinado por correo
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Al confirmar tu pedido, nuestro sistema registrará la orden y te enviará un correo electrónico de forma inmediata con las instrucciones y el enlace seguro de Mercado Pago para realizar tu pago de manera externa.
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de Totales y Confirmación */}
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
            <h3 className="font-display font-bold text-base text-foreground pb-3 border-b">
              Detalle de Pago
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({getTotalItems()} productos)</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo de envío</span>
                <span className={shipping === 0 ? "text-success font-medium" : "font-medium"}>
                  {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                </span>
              </div>
              
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="font-bold text-base">Total</span>
                <span className="text-xl font-extrabold text-foreground">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              className="w-full font-bold pt-3"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                "Confirmar Pedido"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
