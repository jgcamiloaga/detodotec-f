"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Search,
  Loader2
} from "lucide-react";
import { PageProductCatalogoResponse, ProductCatalogoResponse, CategoryResponse } from "@/lib/types";
import { ProductCard } from "@/features/ui/molecules/ProductCard";
import { ProductCardSkeleton } from "@/features/ui/atoms/Skeleton";
import { Button } from "@/features/ui/atoms/Button";
import { cn } from "@/lib/utils";
import { catalogService } from "@/features/products/services/catalog-service";

// Simple useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface ProductsClientViewProps {
  initialData: PageProductCatalogoResponse | null;
}

export function ProductsClientView({ initialData }: ProductsClientViewProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(!initialData);
  const [data, setData] = useState<PageProductCatalogoResponse | null>(initialData);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // State variables for filters
  const [tipo, setTipo] = useState<string>("");
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [sort, setSort] = useState<string>("nombre,ASC");
  const [page, setPage] = useState(0);

  // Memoize the filters object to avoid infinite loop in useDebounce
  const filters = useMemo(
    () => ({ page, tipo, categorySlug, sort }),
    [page, tipo, categorySlug, sort]
  );

  // Debounce the changing filter values so we don't spam the API
  const debouncedFilters = useDebounce(filters, 300);

  // Load categories
  useEffect(() => {
    catalogService.getCategories().then((res) => {
      setCategories(res);
    }).catch(console.error);
  }, []);

  // Fetch products when debounced filters change
  useEffect(() => {
    // skip initial fetch if we just mounted and have initial data (page 0, no filters)
    if (initialData && debouncedFilters.page === 0 && !debouncedFilters.tipo && !debouncedFilters.categorySlug && debouncedFilters.sort === "nombre,ASC") return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const sortArr = debouncedFilters.sort ? [debouncedFilters.sort] : undefined;
        const res = await catalogService.getProducts(
          debouncedFilters.page,
          20,
          debouncedFilters.tipo || undefined,
          debouncedFilters.categorySlug || undefined,
          sortArr
        );
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedFilters, initialData]);

  const clearFilters = () => {
    setTipo("");
    setCategorySlug("");
    setSort("nombre,ASC");
    setPage(0);
  };

  const hasActiveFilters = tipo !== "" || categorySlug !== "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Type / Busqueda placeholder */}
        <div className="relative flex-1 w-full">
          {/* In this version, we don't have text search in the backend, so we filter by Tipo */}
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setPage(0);
            }}
            className="w-full h-10 pl-3 pr-8 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            <option value="VENTA">Venta</option>
            <option value="ALQUILER">Alquiler</option>
            <option value="BOX">Caja Sorpresa (Box)</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(0);
            }}
            className="h-10 pl-3 pr-8 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
          >
            <option value="nombre,ASC">Nombre (A-Z)</option>
            <option value="nombre,DESC">Nombre (Z-A)</option>
            <option value="precio,ASC">Precio: menor a mayor</option>
            <option value="precio,DESC">Precio: mayor a menor</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Filters toggle */}
        <Button
          variant={filtersOpen ? "default" : "outline"}
          size="md"
          onClick={() => setFiltersOpen(!filtersOpen)}
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        >
          Categorías
        </Button>

        {/* View mode */}
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center justify-center h-10 w-10 transition-colors",
              viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-card text-muted-foreground hover:text-foreground"
            )}
            aria-label="Vista cuadrícula"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center justify-center h-10 w-10 transition-colors",
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-card text-muted-foreground hover:text-foreground"
            )}
            aria-label="Vista lista"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex flex-wrap gap-6">
                {/* Categories */}
                <div className="flex-1 min-w-48">
                  <p className="text-sm font-semibold text-foreground mb-3">Categoría</p>
                  <div className="flex flex-col gap-4">
                    {categories.filter(c => !c.parent).map((parentCat) => {
                      const children = categories.filter(c => c.parent === parentCat.id);
                      return (
                        <div key={parentCat.id} className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setCategorySlug(categorySlug === parentCat.slug ? "" : parentCat.slug);
                                setPage(0);
                              }}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                                categorySlug === parentCat.slug
                                  ? "bg-primary text-white border-primary"
                                  : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                              )}
                            >
                              {parentCat.nombre}
                            </button>
                          </div>

                          {children.length > 0 && (categorySlug === parentCat.slug || children.some(c => c.slug === categorySlug)) && (
                            <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-border ml-2">
                              {children.map((childCat) => (
                                <button
                                  key={childCat.id}
                                  onClick={() => {
                                    setCategorySlug(categorySlug === childCat.slug ? "" : childCat.slug);
                                    setPage(0);
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                                    categorySlug === childCat.slug
                                      ? "bg-primary text-white border-primary"
                                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                                  )}
                                >
                                  {childCat.nombre}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {categories.length === 0 && <span className="text-sm text-muted-foreground">Cargando categorías...</span>}
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{data?.totalElements || 0}</span>{" "}
          {data?.totalElements === 1 ? "producto encontrado" : "productos encontrados"}
        </p>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            No encontramos productos
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Intenta con otros filtros o explora todas las categorías disponibles.
          </p>
          <Button variant="default" onClick={clearFilters}>
            Ver todos los productos
          </Button>
        </motion.div>
      ) : (
        <>
          <motion.div
            layout
            className={cn(
              "grid gap-5 lg:gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}
          >
            <AnimatePresence mode="popLayout">
              {data.content.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                disabled={data.first}
                onClick={() => {
                  setPage(p => Math.max(0, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {data.number + 1} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={data.last}
                onClick={() => {
                  setPage(p => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
