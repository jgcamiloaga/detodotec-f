"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Loader2, 
  ChevronRight, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "@/features/ui/atoms/Button";
import { formatPrice } from "@/lib/utils";
import { orderService, OrderDetailsResponse } from "@/features/checkout/services/order-service";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("No se pudo cargar el historial de órdenes. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "FAILED":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-success/15 text-success border border-success/20";
      case "CANCELLED":
        return "bg-muted text-muted-foreground border border-border";
      case "FAILED":
        return "bg-destructive/15 text-destructive border border-destructive/20";
      default:
        return "bg-warning/15 text-warning border border-warning/20";
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-success/15 text-success border border-success/20";
      case "REJECTED":
        return "bg-destructive/15 text-destructive border border-destructive/20";
      case "CANCELLED":
        return "bg-muted text-muted-foreground border border-border";
      default:
        return "bg-warning/15 text-warning border border-warning/20";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "COMPLETED": return "Completado";
      case "APPROVED": return "Aprobado";
      case "CANCELLED": return "Cancelado";
      case "FAILED": return "Fallido";
      case "REJECTED": return "Rechazado";
      case "PENDING": return "Pendiente";
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-sm">Cargando tus órdenes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-white/60 text-sm mb-1">Inicio / Cuenta / Mis Órdenes</p>
          <h1 className="font-display font-extrabold text-3xl">
            Historial de Órdenes
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl p-6 text-center max-w-lg mx-auto">
            <AlertCircle className="h-10 w-10 mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg mb-2">Hubo un error</h3>
            <p className="text-sm mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">No tienes órdenes todavía</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Una vez que realices una compra, verás el estado de tu pedido y de tu pago reflejado en esta sección.
            </p>
            <Link href="/products">
              <Button variant="accent">Explorar productos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={order.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5 mb-5">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Código de Orden</span>
                    <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                      #{order.orderCode || order.id.slice(0, 8)}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Estado de Orden</span>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusBadge(order.orderStatus)}`}>
                        {getOrderStatusIcon(order.orderStatus)}
                        {translateStatus(order.orderStatus)}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Estado de Pago</span>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        <CreditCard className="h-3 w-3" />
                        {translateStatus(order.paymentStatus)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="grid grid-cols-2 sm:flex sm:gap-10 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Total de Items</p>
                      <p className="font-bold text-foreground">{order.totalItems} productos</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Monto Total</p>
                      <p className="font-extrabold text-foreground text-lg">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end">
                    <Link href={`/orders/${order.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto font-medium" rightIcon={<ChevronRight className="h-4 w-4" />}>
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
