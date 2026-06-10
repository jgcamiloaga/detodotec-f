import { catalogApi } from "@/lib/api-client";
import { 
  ConsumerResponse,
  PageResponse,
  ProductCatalogResponse,
  ProductResponse,
  CategoryTreeResponse,
  CategoryResponse,
  SaleProductRequest,
  SaleProductResponse,
  RentalProductRequest,
  RentalProductResponse,
  ProductBundleRequest,
  ProductBundleResponse,
  SkuType
} from "@/lib/types";

export const catalogService = {
  async getProducts(
    page: number = 0,
    size: number = 20,
    skuType?: SkuType,
    categorySlug?: string,
    minPrice?: number,
    maxPrice?: number
  ): Promise<PageResponse<ProductCatalogResponse>> {
    const params: Record<string, any> = { page, size };
    if (skuType) params.skuType = skuType;
    if (categorySlug) params.categorySlug = categorySlug;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    const res = await catalogApi.get<ConsumerResponse<any> | PageResponse<ProductCatalogResponse>>('/catalog', { params });
    const data = (res as ConsumerResponse<any>).data !== undefined ? (res as ConsumerResponse<any>).data : res;
    
    if (Array.isArray(data)) {
      return {
        content: data,
        totalElements: data.length,
        totalPages: 1,
        number: page,
        size: size,
        first: page === 0,
        last: data.length < size,
        empty: data.length === 0
      };
    }
    
    return data as PageResponse<ProductCatalogResponse>;
  },

  async getProductById(id: string, type: SkuType): Promise<any> {
    return catalogApi.get<any>(`/catalog/${id}`, {
      params: { type }
    });
  },

  async getCategoriesTree(parentId: string): Promise<CategoryTreeResponse> {
    const res = await catalogApi.get<ConsumerResponse<CategoryTreeResponse>>(`/categories/tree/${parentId}`);
    return res.data;
  },

  async getCategories(page: number = 0, size: number = 100): Promise<CategoryResponse[]> {
    const res = await catalogApi.get<ConsumerResponse<CategoryResponse[]>>('/categories', { params: { page: page.toString(), size: size.toString() } });
    return res.data;
  },

  async getBaseProducts(page: number = 0, size: number = 20): Promise<any> {
    const res = await catalogApi.get<ConsumerResponse<any>>('/products', { params: { page: page.toString(), size: size.toString() } });
    return res.data;
  },

  async getBaseProductById(id: string): Promise<ProductResponse> {
    const res = await catalogApi.get<ConsumerResponse<ProductResponse>>(`/products/${id}`);
    return res.data;
  },

  async createBaseProduct(formData: FormData): Promise<ProductResponse> {
    const res = await catalogApi.post<ConsumerResponse<ProductResponse>>('/products', formData);
    return res.data;
  },

  async createVenta(data: SaleProductRequest): Promise<SaleProductResponse> {
    const res = await catalogApi.post<ConsumerResponse<SaleProductResponse>>('/admin/sale-products', data);
    return res.data;
  },

  async updateVenta(id: string, data: Partial<SaleProductRequest>): Promise<SaleProductResponse> {
    return catalogApi.post<SaleProductResponse>(`/admin/sale-products/${id}`, data, { method: 'PATCH' });
  },

  async createAlquiler(data: RentalProductRequest): Promise<RentalProductResponse> {
    const res = await catalogApi.post<ConsumerResponse<RentalProductResponse>>('/admin/rental-products', data);
    return res.data;
  },

  async updateAlquiler(id: string, data: Partial<RentalProductRequest>): Promise<RentalProductResponse> {
    return catalogApi.post<RentalProductResponse>(`/admin/rental-products/${id}`, data, { method: 'PATCH' });
  },

  async replenishSaleStock(id: string, quantity: number): Promise<void> {
    await catalogApi.post(`/admin/sale-products/${id}/replenish`, null, { params: { quantity: quantity.toString() }, method: 'PATCH' });
  },

  async withdrawSaleStock(id: string, quantity: number): Promise<void> {
    await catalogApi.post(`/admin/sale-products/${id}/withdraw`, null, { params: { quantity: quantity.toString() }, method: 'PATCH' });
  },

  async replenishRentalStock(id: string, quantity: number): Promise<void> {
    await catalogApi.post(`/admin/rental-products/${id}/replenish`, null, { params: { quantity: quantity.toString() }, method: 'PATCH' });
  },

  async withdrawRentalStock(id: string, quantity: number): Promise<void> {
    await catalogApi.post(`/admin/rental-products/${id}/withdraw`, null, { params: { quantity: quantity.toString() }, method: 'PATCH' });
  }
};
