"use client";

import { useCartStore } from "@/features/cart/store/cartStore";
import { ReactNode } from "react";

export function CartProvider({ children }: { children: ReactNode }) {
  // CartProvider initializes the Zustand store on the client
  // The store is persisted via localStorage
  return <>{children}</>;
}
