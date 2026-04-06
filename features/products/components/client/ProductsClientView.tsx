"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/features/ui/molecules/ProductCard";
import { ProductCardSkeleton } from "@/features/ui/atoms/Skeleton";
import { Button } from "@/features/ui/atoms/Button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "laptops", name: "Laptops" },
  { id: "smartphones", name: "Smartphones" },
  { id: "audio", name: "Audio" },
  { id: "monitores", name: "Monitores" },
  { id: "accesorios", name: "Accesorios" },
  { id: "gaming", name: "Gaming" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor calificación" },
  { value: "newest", label: "Más recientes" },
];

const PRICE_RANGES = [
  { label: "Hasta $500K", min: 0, max: 500_000 },
  { label: "$500K – $2M", min: 500_000, max: 2_000_000 },
  { label: "$2M – $5M", min: 2_000_000, max: 5_000_000 },
  { label: "$5M – $10M", min: 5_000_000, max: 10_000_000 },
  { label: "Más de $10M", min: 10_000_000, max: Infinity },
];

interface ProductsClientViewProps {
  initialProducts: Product[];
}

export function ProductsClientView({ initialProducts }: ProductsClientViewProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");

  // Init from URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
    const sort = searchParams.get("sort");
    if (sort) setSortBy(sort);
    setTimeout(() => setIsLoading(false), 400);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Category
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.includes(p.category.id)
      );
    }

    // Price range
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(
        (p) => p.price >= range.min && p.price <= range.max
      );
    }

    // Rating
    if (minRating !== null) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result = result.filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
        break;
      default: // featured
        result = result.filter((p) => p.isFeatured).concat(result.filter((p) => !p.isFeatured));
    }

    return result;
  }, [initialProducts, search, selectedCategories, selectedPriceRange, minRating, sortBy]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRange !== null ||
    minRating !== null ||
    search.trim().length > 0;

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setMinRating(null);
    setSearch("");
    setSortBy("featured");
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar productos, marcas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
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
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-accent text-white text-xs font-bold">
              !
            </span>
          )}
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
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          selectedCategories.includes(cat.id)
                            ? "bg-primary text-white border-primary"
                            : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex-1 min-w-48">
                  <p className="text-sm font-semibold text-foreground mb-3">Precio</p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedPriceRange(selectedPriceRange === i ? null : i)
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          selectedPriceRange === i
                            ? "bg-secondary text-white border-secondary"
                            : "bg-background text-foreground border-border hover:border-secondary hover:text-secondary"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex-1 min-w-32">
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Calificación mínima
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[4, 4.5, 4.8].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setMinRating(minRating === rating ? null : rating)
                        }
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          minRating === rating
                            ? "bg-amber-400 text-white border-amber-400"
                            : "bg-background text-foreground border-border hover:border-amber-400"
                        )}
                      >
                        ★ {rating}+
                      </button>
                    ))}
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
          <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-destructive hover:underline flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
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
            {filteredProducts.map((product) => (
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
      )}
    </div>
  );
}
