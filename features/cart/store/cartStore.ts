"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState, ProductCatalogResponse, ProductDetailResponse } from "@/lib/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: ProductCatalogResponse | ProductDetailResponse, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.product.id === product.id);

        // Normalize to ProductCatalogResponse
        const normalizedProduct: ProductCatalogResponse = {
          id: product.id,
          name: product.name,
          price: product.price,
          skuType: product.skuType,
          stock: product.stock || 99,
          categorySlugs: 'categorySlugs' in product ? product.categorySlugs : "",
          url: 'images' in product && product.images?.length
             ? product.images[0].url
             : ('url' in product ? product.url : "/placeholder.jpg")
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
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: "detodotec-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
