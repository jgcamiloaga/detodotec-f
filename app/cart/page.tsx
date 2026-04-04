import { Metadata } from "next";
import { CartView } from "@/features/cart/components/client/CartView";

export const metadata: Metadata = {
  title: "Mi carrito",
  description: "Revisa y edita los productos en tu carrito de compras antes de proceder al pago.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white py-10">
        <div className="container mx-auto px-4">
          <p className="text-white/60 text-sm mb-1">Inicio / Carrito</p>
          <h1 className="font-display font-extrabold text-3xl">
            Mi carrito
          </h1>
        </div>
      </div>
      <CartView />
    </div>
  );
}
