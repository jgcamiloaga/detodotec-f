export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "admin";
}

// Catálogo: Lista de productos
export interface ProductCatalogoResponse {
  id: string;
  nombre: string;
  tipo: "VENTA" | "ALQUILER" | "BOX";
  precio: number;
  stock: number;
  imagenUrl: string;
}

// Catálogo: Detalles de producto
export interface IProductDetails {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "VENTA" | "ALQUILER" | "BOX";
  precio: number;
  stock: number;
  categoria: string;
  urlsImagenes: string[];
}

export interface CategoryResponse {
  id: string;
  nombre: string;
  slug: string;
  parent: string | null;
  isEnabled: boolean;
}

export interface PictureUrlResponse {
  url: string;
  orden: number;
}

export interface BaseProductResponse {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  activo: boolean;
  categoryId: string;
  categoryNombre: string;
  pictureUrl: PictureUrlResponse[];
  createdAt: string;
}

export interface PageProductCatalogoResponse {
  content: ProductCatalogoResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ProductVentaRequest {
  precio: number;
  stock: number;
  productId: string;
}

export interface ProductAlquilerRequest {
  precioMes: number;
  stock: number;
  productId: string;
}

export interface CartItem {
  product: ProductCatalogoResponse;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductCatalogoResponse | IProductDetails, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CheckoutStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number | null;
  sortBy: SortOption;
  search: string;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";
