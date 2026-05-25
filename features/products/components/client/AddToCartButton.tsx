"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/features/cart/store/cartStore";
import { ProductCatalogoResponse, IProductDetails } from "@/lib/types";
import { Button } from "@/features/ui/atoms/Button";
import { showToast } from "@/features/ui/atoms/Toaster";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: ProductCatalogoResponse | IProductDetails;
  quantity?: number;
  iconOnly?: boolean;
  className?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  iconOnly = false,
  className,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const stock = 'stock' in product ? product.stock : 99; // Assume in stock if details
    if (stock === 0) return;

    addItem(product, quantity);
    setAdded(true);
    showToast({
      type: "success",
      title: "¡Agregado al carrito!",
      description: product.nombre,
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const stock = 'stock' in product ? product.stock : 99;

  if (iconOnly) {
    return (
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        disabled={stock === 0 || added}
        aria-label={`Agregar ${product.nombre} al carrito`}
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 font-semibold shadow-sm",
          added
            ? "bg-success text-white"
            : "bg-accent text-white hover:bg-accent-600 hover:shadow-glow-accent",
          stock === 0 && "bg-muted text-muted-foreground cursor-not-allowed",
          className
        )}
      >
        <motion.span
          key={added ? "check" : "cart"}
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {added ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
        </motion.span>
      </motion.button>
    );
  }

  return (
    <Button
      variant="accent"
      size="lg"
      onClick={handleAdd}
      disabled={stock === 0 || added}
      className={cn("w-full gap-2", className)}
      leftIcon={
        added ? (
          <Check className="h-5 w-5" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )
      }
    >
      {stock === 0
        ? "Sin stock"
        : added
        ? "¡Agregado!"
        : "Agregar al carrito"}
    </Button>
  );
}
