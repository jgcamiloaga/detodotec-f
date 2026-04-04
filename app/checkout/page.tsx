import { Metadata } from "next";
import { CheckoutForm } from "@/features/checkout/components/client/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Finaliza tu compra",
  description: "Completa tu información de envío y pago para finalizar tu pedido en DeTodoTec.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white py-10">
        <div className="container mx-auto px-4">
          <p className="text-white/60 text-sm mb-1">Inicio / Carrito / Checkout</p>
          <h1 className="font-display font-extrabold text-3xl">
            Finalizar compra
          </h1>
        </div>
      </div>
      <CheckoutForm />
    </div>
  );
}
