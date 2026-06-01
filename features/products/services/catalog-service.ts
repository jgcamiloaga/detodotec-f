import { catalogApi } from "@/lib/api-client";
import { ProductCatalogoResponse, IProductDetails, CategoryResponse, PageProductCatalogoResponse, BaseProductResponse } from "@/lib/types";

export const catalogService = {
  /**
   * Get all products from the catalog (paginated with optional filters)
   */
  async getProducts(
    page: number = 0,
    size: number = 20,
    tipo?: string,
    categorySlug?: string,
    sort?: string[]
  ): Promise<PageProductCatalogoResponse> {
    const params: Record<string, any> = { page, size };
    if (tipo) params.tipo = tipo;
    if (categorySlug) params.categorySlug = categorySlug;
    if (sort) params.sort = sort;

    return catalogApi.get<PageProductCatalogoResponse>('/products', { params });
  },

  /**
   * Get a single product by Configuration ID and Tipo
   */
  async getProductById(id: string, tipo: string): Promise<IProductDetails> {
    return catalogApi.get<IProductDetails>(`/products/${id}`, {
      params: { tipo }
    });
  },

  /**
   * Get a single product configuration by its Base Product ID and Tipo
   */
  async getProductByBaseId(baseId: string, tipo: string): Promise<IProductDetails> {
    return catalogApi.get<IProductDetails>(`/products/base/${baseId}`, {
      params: { tipo }
    });
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryResponse[]> {
    return catalogApi.get<CategoryResponse[]>('/categories');
  },

  /**
   * Get all base products
   */
  async getBaseProducts(): Promise<BaseProductResponse[]> {
    return catalogApi.get<BaseProductResponse[]>('/base-products');
  },

  /**
   * Create a new base product
   */
  async createBaseProduct(formData: FormData): Promise<BaseProductResponse> {
    return catalogApi.post<BaseProductResponse>('/base-products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Configure a base product as VENTA
   */
  async createVenta(data: import('@/lib/types').ProductVentaRequest): Promise<IProductDetails> {
    return catalogApi.post<IProductDetails>('/products/venta', data);
  },

  /**
   * Configure a base product as ALQUILER
   */
  async createAlquiler(data: import('@/lib/types').ProductAlquilerRequest): Promise<IProductDetails> {
    return catalogApi.post<IProductDetails>('/products/alquiler', data);
  },

  /**
   * Update an existing VENTA configuration
   */
  async updateVenta(ventaId: string, data: import('@/lib/types').ProductVentaRequest): Promise<IProductDetails> {
    return catalogApi.put<IProductDetails>(`/products/venta/${ventaId}`, data);
  },

  /**
   * Update an existing ALQUILER configuration
   */
  async updateAlquiler(alquilerId: string, data: import('@/lib/types').ProductAlquilerRequest): Promise<IProductDetails> {
    return catalogApi.put<IProductDetails>(`/products/alquiler/${alquilerId}`, data);
  }
};
