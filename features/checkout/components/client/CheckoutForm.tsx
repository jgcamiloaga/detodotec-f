"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Truck,
  User,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Button } from "@/features/ui/atoms/Button";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "shipping", label: "Envío", icon: Truck },
  { id: "payment", label: "Pago", icon: CreditCard },
  { id: "confirm", label: "Confirmar", icon: CheckCircle2 },
];

const PERU_DEPARTMENTS = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho",
  "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco",
  "Ica", "Junín", "La Libertad", "Lambayeque", "Lima",
  "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura",
  "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali",
];

export function CheckoutForm() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber] = useState(`DT-${Math.floor(100000 + Math.random() * 900000)}`);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "Lima",
    postalCode: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    method: "card",
  });

  const total = getTotalPrice();
  const shipping = total >= 200 ? 0 : 15;
  const grandTotal = total + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    clearCart();
    setIsProcessing(false);
    setIsSuccess(true);
  };

  const updateShipping = (field: string, value: string) =>
    setShippingData((prev) => ({ ...prev, [field]: value }));
  const updatePayment = (field: string, value: string) =>
    setPaymentData((prev) => ({ ...prev, [field]: value }));

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center h-24 w-24 rounded-full bg-success/10 mb-6"
        >
          <CheckCircle2 className="h-12 w-12 text-success" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display font-extrabold text-3xl text-foreground mb-2">
            ¡Pedido confirmado!
          </h2>
          <p className="text-muted-foreground mb-1">
            Número de orden:{" "}
            <span className="font-bold text-foreground">{orderNumber}</span>
          </p>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Te hemos enviado un correo de confirmación a{" "}
            <span className="font-medium">{shippingData.email}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button variant="accent" size="lg">
                Seguir comprando
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Ir al inicio
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all",
                i === step
                  ? "bg-primary text-white shadow-md"
                  : i < step
                  ? "bg-success/10 text-success cursor-pointer hover:bg-success/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {i < step ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleShippingSubmit}
                className="bg-card border border-border rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-2 mb-6">
                  <User className="h-5 w-5 text-secondary" />
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Información de envío
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Nombre completo"
                    placeholder="Juan García"
                    required
                    value={shippingData.fullName}
                    onChange={(v) => updateShipping("fullName", v)}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="juan@email.com"
                    required
                    value={shippingData.email}
                    onChange={(v) => updateShipping("email", v)}
                  />
                  <InputField
                    label="Teléfono"
                    type="tel"
                    placeholder="+51 900 123 456"
                    required
                    value={shippingData.phone}
                    onChange={(v) => updateShipping("phone", v)}
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label="Dirección"
                      placeholder="Calle 123 # 45-67, Apto 8"
                      required
                      value={shippingData.address}
                      onChange={(v) => updateShipping("address", v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Departamento
                    </label>
                    <select
                      required
                      value={shippingData.department}
                      onChange={(e) => updateShipping("department", e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      {PERU_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <InputField
                    label="Ciudad"
                    placeholder="Lima"
                    required
                    value={shippingData.city}
                    onChange={(v) => updateShipping("city", v)}
                  />
                  <InputField
                    label="Código postal"
                    placeholder="110111"
                    value={shippingData.postalCode}
                    onChange={(v) => updateShipping("postalCode", v)}
                  />
                </div>

                <div className="mt-6 flex gap-3">
                  <Link href="/cart" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                      Volver
                    </Button>
                  </Link>
                  <Button type="submit" variant="accent" size="lg" className="flex-1" rightIcon={<ChevronRight className="h-4 w-4" />}>
                    Continuar al pago
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 1 && (
              <motion.form
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePaymentSubmit}
                className="bg-card border border-border rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Método de pago
                  </h2>
                </div>

                <div className="flex gap-3 mb-6">
                  {[
                    { id: "card", label: "💳 Tarjeta" },
                    { id: "pse", label: "🏦 PSE" },
                    { id: "nequi", label: "📱 Nequi" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => updatePayment("method", m.id)}
                      className={cn(
                        "flex-1 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                        paymentData.method === m.id
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border text-muted-foreground hover:border-secondary/50"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentData.method === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <InputField
                        label="Número de tarjeta"
                        placeholder="1234 5678 9012 3456"
                        required
                        value={paymentData.cardNumber}
                        onChange={(v) => updatePayment("cardNumber", formatCard(v))}
                        maxLength={19}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputField
                        label="Nombre en la tarjeta"
                        placeholder="JUAN GARCIA"
                        required
                        value={paymentData.cardName}
                        onChange={(v) => updatePayment("cardName", v.toUpperCase())}
                      />
                    </div>
                    <InputField
                      label="Fecha de expiración"
                      placeholder="MM/AA"
                      required
                      value={paymentData.expiry}
                      onChange={(v) => updatePayment("expiry", formatExpiry(v))}
                      maxLength={5}
                    />
                    <InputField
                      label="CVV"
                      placeholder="123"
                      required
                      type="password"
                      value={paymentData.cvv}
                      onChange={(v) => updatePayment("cvv", v.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                    />
                  </div>
                )}

                {paymentData.method === "pse" && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-4xl mb-3">🏦</p>
                    <p className="font-medium">Serás redirigido a PSE al confirmar</p>
                  </div>
                )}

                {paymentData.method === "nequi" && (
                  <InputField
                    label="Número de celular Nequi"
                    placeholder="300 123 4567"
                    required
                    value={paymentData.cvv}
                    onChange={(v) => updatePayment("cvv", v)}
                  />
                )}

                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground bg-muted rounded-xl px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  Tu información está protegida con cifrado SSL de 256 bits
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(0)}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Revisar pedido
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-card"
              >
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Confirmar pedido
                  </h2>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-secondary" /> Envío a
                    </p>
                    <button onClick={() => setStep(0)} className="text-xs text-secondary hover:underline">
                      Editar
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {shippingData.fullName} · {shippingData.address}, {shippingData.city}, {shippingData.department}
                  </p>
                  <p className="text-sm text-muted-foreground">{shippingData.email}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-secondary" /> Pago con
                    </p>
                    <button onClick={() => setStep(1)} className="text-xs text-secondary hover:underline">
                      Editar
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {paymentData.method === "card"
                      ? `Tarjeta terminada en ${paymentData.cardNumber.slice(-4) || "****"}`
                      : paymentData.method === "pse"
                      ? "PSE — transferencia bancaria"
                      : "Nequi"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Volver
                  </Button>
                  <Button
                    variant="accent"
                    size="lg"
                    className="flex-1 font-bold"
                    onClick={handleConfirm}
                    isLoading={isProcessing}
                  >
                    {isProcessing ? "Procesando..." : `Pagar ${formatPrice(grandTotal)}`}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card sticky top-24">
            <h3 className="font-display font-bold text-base text-foreground mb-4">
              Tu pedido ({getTotalItems()} items)
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.product.url || "/placeholder.jpg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                    <span className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold leading-none">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">
                      {item.product.name}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-foreground shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className={shipping === 0 ? "text-success font-medium" : ""}>
                  {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-lg">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  className,
  onChange,
  ...props
}: {
  label: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & { className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {props.required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
      />
    </div>
  );
}
