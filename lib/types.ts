export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "admin";
}

export type SkuType = "SALE" | "RENTAL" | "BUNDLE";
export type GeneralStatus = "ENABLED" | "DISABLED";
export type ReservationStatus = "PENDING" | "COMPLETE" | "CANCELED";

export interface ProductImgResponse {
  id: string;
  url: string;
  order: number;
}

export interface CategoryDetailsResponse {
  id: string;
  name: string;
  path: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  categoryStatus: GeneralStatus;
  parentId: string | null;
  imgUrl: string | null;
  path: string;
}

export interface CategoryTreeResponse {
  id: string;
  name: string;
  children: CategoryTreeResponse[];
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  status: GeneralStatus;
  images: ProductImgResponse[];
  categories: CategoryDetailsResponse[];
}

export interface ProductCatalogResponse {
  id: string;
  name: string;
  skuType: SkuType;
  price: number;
  stock: number;
  categorySlugs: string;
  url: string;
}

export interface ProductDetailResponse {
  id: string;
  name: string;
  description?: string;
  skuType: SkuType;
  price: number;
  stock: number;
  categories?: CategoryDetailsResponse[];
  images?: ProductImgResponse[];
}

export interface SaleProductResponse {
  id: string;
  productId: string;
  price: number;
  stock: number;
  images: ProductImgResponse[];
}

export interface RentalProductResponse {
  id: string;
  productId: string;
  weeklyPrice: number;
  monthlyPrice: number;
  securityDeposit: number;
  stock: number;
  images: ProductImgResponse[];
}

export interface BundleItemResponse {
  id: string;
  productSaleId: string;
  weight: number;
}

export interface ProductBundleResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  items: BundleItemResponse[];
  images: ProductImgResponse[];
}

export interface CategoryRequest {
  name: string;
  slug: string;
  parentId?: string;
}

export interface SaleProductRequest {
  productId: string;
  price: number;
  stock: number;
}

export interface RentalProductRequest {
  productId: string;
  weeklyPrice: number;
  monthlyPrice: number;
  securityDeposit: number;
  stock: number;
}

export interface BundleItemRequest {
  productSaleId: string;
  weight: number;
}

export interface ProductBundleRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  items: BundleItemRequest[];
  rollsCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ConsumerResponse<T> {
  isError: boolean;
  code: number;
  message: string;
  data: T;
}

export interface CartItem {
  product: ProductCatalogResponse;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductCatalogResponse | ProductDetailResponse, quantity?: number) => void;
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
