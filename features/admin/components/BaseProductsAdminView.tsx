"use client";

import { useEffect, useState } from "react";
import { catalogService } from "@/features/products/services/catalog-service";
import { BaseProductResponse } from "@/lib/types";
import { Edit, Trash2, Plus, Tag, DollarSign } from "lucide-react";
import Image from "next/image";
import BaseProductModal from "./BaseProductModal";
import ConfigureProductModal from "./ConfigureProductModal";
import { getSafeImageUrl } from "@/lib/utils";

export default function BaseProductsAdminView() {
  const [baseProducts, setBaseProducts] = useState<BaseProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BaseProductResponse | null>(null);

  const fetchBaseProducts = async () => {
    setIsLoading(true);
    try {
      const data = await catalogService.getBaseProducts();
      setBaseProducts(data);
    } catch (err) {
      setError("Error al cargar los productos base");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseProducts();
  }, []);

  const handleOpenConfig = (product: BaseProductResponse) => {
    setSelectedProduct(product);
    setIsConfigModalOpen(true);
  };

  if (isLoading && baseProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Productos Base</h2>
          <p className="text-sm text-slate-500">Gestiona los modelos genéricos del catálogo</p>
        </div>
        <button 
          onClick={() => setIsBaseModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          <span>Nuevo Producto Base</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-sm text-slate-600">ID / Imagen</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Nombre</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Categoría</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Tipo</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Estado</th>
                <th className="p-4 font-semibold text-sm text-slate-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {baseProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No hay productos base registrados.
                  </td>
                </tr>
              ) : (
                baseProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                          {product.pictureUrl && product.pictureUrl.length > 0 ? (
                            <Image
                              src={getSafeImageUrl(product.pictureUrl[0].url)}
                              alt={product.nombre}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <span className="text-xs">Sin img</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono" title={product.id}>
                          {product.id.split('-')[0]}...
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{product.nombre}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]" title={product.descripcion}>
                        {product.descripcion}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {product.categoryNombre}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{product.tipo}</td>
                    <td className="p-4">
                      {product.activo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenConfig(product)}
                          className={`p-2 rounded-md transition-colors ${
                            product.activo 
                              ? "text-green-500 hover:text-green-600 hover:bg-green-50" 
                              : "text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                          }`}
                          title={product.activo ? "Editar Precio y Stock" : "Configurar Precio y Stock"}
                        >
                          {product.activo ? <DollarSign size={16} /> : <Tag size={16} />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BaseProductModal 
        isOpen={isBaseModalOpen} 
        onClose={() => setIsBaseModalOpen(false)} 
        onSuccess={fetchBaseProducts}
      />

      <ConfigureProductModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSuccess={() => {
          // You might want to refresh the products list or show a toast notification here
          fetchBaseProducts();
          alert("Producto configurado exitosamente. Ya debería aparecer en el catálogo.");
        }}
        product={selectedProduct}
      />
    </div>
  );
}
