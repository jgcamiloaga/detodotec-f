"use client";

import { useState, useEffect } from "react";
import { X, DollarSign, Package, Loader2 } from "lucide-react";
import { catalogService } from "@/features/products/services/catalog-service";
import { ProductResponse, SkuType } from "@/lib/types";

interface ConfigureProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: ProductResponse | null;
}

export default function ConfigureProductModal({ isOpen, onClose, onSuccess, product }: ConfigureProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [configId, setConfigId] = useState<string | null>(null);

  const [skuType, setSkuType] = useState<SkuType>("SALE");

  useEffect(() => {
    if (isOpen && product) {
      setPrecio("");
      setStock("");
      setConfigId(null);
      setError(null);

      // Intenta cargar la configuración de SALE y RENTAL
      setIsFetching(true);
      catalogService.getProductById(product.id, skuType)
        .then((data) => {
          if (data && data.price !== undefined) {
            setPrecio(data.price.toString());
            setStock(data.stock.toString());
            setConfigId(data.id);
          } else {
            setConfigId(null);
          }
        })
        .catch(() => {
          setConfigId(null); // No configurado aún
        })
        .finally(() => setIsFetching(false));
    }
  }, [isOpen, product, skuType]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const parsedPrecio = parseFloat(precio);
      const parsedStock = parseInt(stock, 10);

      if (skuType === "SALE") {
        if (configId) {
          // Update existing
          await catalogService.updateVenta(configId, {
            productId: product.id,
            price: parsedPrecio,
            stock: parsedStock,
          });
        } else {
          // Create new
          await catalogService.createVenta({
            productId: product.id,
            price: parsedPrecio,
            stock: parsedStock,
          });
        }
      } else if (skuType === "RENTAL") {
        if (configId) {
          // Update existing
          await catalogService.updateAlquiler(configId, {
            productId: product.id,
            monthlyPrice: parsedPrecio,
            weeklyPrice: parsedPrecio / 4, // Aproximado por ahora
            securityDeposit: parsedPrecio * 2,
            stock: parsedStock,
          });
        } else {
          // Create new
          await catalogService.createAlquiler({
            productId: product.id,
            monthlyPrice: parsedPrecio,
            weeklyPrice: parsedPrecio / 4,
            securityDeposit: parsedPrecio * 2,
            stock: parsedStock,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al configurar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const getPriceLabel = () => {
    return skuType === "RENTAL" ? "Precio por Mes (S/)" : "Precio de Venta (S/)";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {configId ? "Editar Precio y Stock" : "Configurar Producto"}
            </h2>
            <p className="text-sm text-slate-500">
              Configuración de inventario y precios
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-6 flex flex-col gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <p className="text-xs text-slate-500">ID: {product.id}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSkuType("SALE")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  skuType === "SALE" ? "bg-primary text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Venta
              </button>
              <button
                type="button"
                onClick={() => setSkuType("RENTAL")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  skuType === "RENTAL" ? "bg-primary text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                Alquiler
              </button>
            </div>
          </div>

          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Cargando datos actuales...</p>
            </div>
          ) : (
            <form id="configure-product-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{getPriceLabel()}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Stock Inicial</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Cantidad en inventario"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="configure-product-form"
            disabled={isLoading || isFetching}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {configId ? "Actualizar Configuración" : "Guardar Configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}
