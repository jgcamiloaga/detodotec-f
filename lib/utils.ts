import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(
  original: number,
  current: number
): number {
  return Math.round(((original - current) / original) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "…";
}

export function getStarArray(rating: number): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

export function getSafeImageUrl(url: string | undefined | null): string {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("/")) {
    return url;
  }
  if (!ASSETS_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_ASSETS_BASE_URL environment variable");
  }

  // Si es un path relativo que no empieza con /, asumimos que viene del bucket configurado.
  return `${ASSETS_BASE_URL.replace(/\/$/, "")}/${url}`;
}
