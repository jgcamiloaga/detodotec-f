import { Metadata } from "next";
import { getProducts } from "@/features/products/data/mock-products";
import { ProductsClientView } from "@/features/products/components/client/ProductsClientView";

export const metadata: Metadata = {
  title: "Todos los productos",
  description:
    "Explora nuestro catálogo completo de laptops, smartphones, audio, monitores, gaming y accesorios tech. Filtra por categoría, precio y calificación.",
};

export default async function ProductsPage() {
  const products = await getProducts();

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
            {products.length} productos disponibles — Envíos a todo el Perú
          </p>
        </div>
      </div>

      {/* Products view with filters (client) */}
      <ProductsClientView initialProducts={products} />
    </div>
  );
}
