"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState, ProductCatalogoResponse, IProductDetails } from "@/lib/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: ProductCatalogoResponse | IProductDetails, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.product.id === product.id);

        // Normalize to ProductCatalogoResponse
        const normalizedProduct: ProductCatalogoResponse = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          tipo: product.tipo,
          stock: 'stock' in product ? product.stock : 99, // default stock if from details
          imagenUrl: 'urlsImagenes' in product ? product.urlsImagenes[0] : (product as any).imagenUrl
        };

        if (existing) {
          set({
            items: items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, normalizedProduct.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product: normalizedProduct, quantity }] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.precio * i.quantity, 0),
    }),
    {
      name: "detodotec-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
