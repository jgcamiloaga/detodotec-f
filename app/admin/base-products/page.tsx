import { Metadata } from "next";
import BaseProductsAdminView from "@/features/admin/components/BaseProductsAdminView";

export const metadata: Metadata = {
  title: "Gestión de Productos Base - Admin | DeTodoTec",
  description: "Panel de administración para productos base",
};

export default function AdminBaseProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Administración</h1>
      <BaseProductsAdminView />
    </div>
  );
}
