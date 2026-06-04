"use client";

import { useState, useEffect } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { catalogService } from "@/features/products/services/catalog-service";
import { CategoryResponse } from "@/lib/types";

interface BaseProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BaseProductModal({ isOpen, onClose, onSuccess }: BaseProductModalProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ENABLED");
  const [categorySlug, setCategorySlug] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch categories when modal opens
      catalogService.getCategories()
        .then(setCategories)
        .catch(console.error);
    } else {
      // Reset form on close
      setName("");
      setDescription("");
      setStatus("ENABLED");
      setCategorySlug("");
      setImage(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categorySlug) {
      setError("Por favor selecciona una categoría");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("categorySlugs", categorySlug); // Asumiendo uno por ahora
      if (image) {
        formData.append("images", image);
      }

      await catalogService.createBaseProduct(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error al crear el producto base");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Nuevo Producto Base</h2>
            <p className="text-sm text-slate-500">Crea el molde del producto antes de ponerlo en venta.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form id="base-product-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Ej. AMD Ryzen 5 5600X"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Categoría</label>
                <select
                  required
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="" disabled>Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.parentId ? `— ${cat.name}` : cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Descripción</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1 flex flex-col justify-center">
                <label className="text-sm font-medium text-slate-700 mb-2">Estado Inicial</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={status === "ENABLED"}
                    onChange={(e) => setStatus(e.target.checked ? "ENABLED" : "DISABLED")}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-slate-600">
                    {status === "ENABLED" ? "Activo (Visible)" : "Inactivo (Oculto)"}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Imagen Principal</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {image ? (
                  <div className="text-center flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-slate-700">{image.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-700">Haz clic para subir o arrastra la imagen</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP hasta 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </form>
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
            form="base-product-form"
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}
