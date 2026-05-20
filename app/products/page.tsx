import { Metadata } from "next";
import { catalogService } from "@/features/products/services/catalog-service";
import { ProductsClientView } from "@/features/products/components/client/ProductsClientView";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Todos los productos",
  description:
    "Explora nuestro catálogo completo de laptops, smartphones, audio, monitores, gaming y accesorios tech. Filtra por categoría, precio y calificación.",
};

export default async function ProductsPage() {
  // Fetch first page of products
  let initialData = null;
  try {
    initialData = await catalogService.getProducts(0, 20);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-gradient-to-br from-primary to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-white/60 text-sm mb-2">Inicio / Productos</p>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl mb-2">
            Todos los productos
          </h1>
          <p className="text-white/70">
            {initialData ? initialData.totalElements : 0} productos disponibles — Envíos a todo el Perú
          </p>
        </div>
      </div>

      {/* Products view with filters (client) */}
      <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
        <ProductsClientView initialData={initialData} />
      </Suspense>
    </div>
  );
}
