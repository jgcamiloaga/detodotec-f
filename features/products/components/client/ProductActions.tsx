"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { ProductCatalogResponse, ProductDetailResponse } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { Button } from "@/features/ui/atoms/Button";

interface ProductActionsProps {
  product: ProductCatalogResponse | ProductDetailResponse;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const stock = 'stock' in product ? product.stock : 99;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () =>
    setQuantity((q) => Math.min(stock, q + 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Cantidad:</span>
        <div className="flex items-center rounded-xl border border-border overflow-hidden">
          <button
            onClick={decrease}
            disabled={quantity === 1}
            className="flex items-center justify-center h-10 w-10 text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <motion.span
            key={quantity}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center h-10 w-12 font-bold text-foreground border-x border-border"
          >
            {quantity}
          </motion.span>
          <button
            onClick={increase}
            disabled={quantity >= stock}
            className="flex items-center justify-center h-10 w-10 text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <div className="flex-1">
          <AddToCartButton product={product} quantity={quantity} className="w-full" />
        </div>
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`flex items-center justify-center h-12 w-12 rounded-xl border-2 transition-all ${
            isWishlisted
              ? "border-red-400 bg-red-50 text-red-500"
              : "border-border text-muted-foreground hover:border-red-300 hover:text-red-400"
          }`}
          aria-label={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={`h-5 w-5 transition-all ${isWishlisted ? "fill-current" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
