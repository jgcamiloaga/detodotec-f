import { orderApi } from "@/lib/api-client";

export interface ItemRequest {
  productId: string;
  type: "SALE" | "RENTAL" | "BUNDLE";
  quantity: number;
}

export interface OrderRequest {
  listItem: ItemRequest[];
  platform: "WEB";
  currency: "PEN";
}

export interface OrderResponse {
  orderId: string;
  mpPreferenceId: string;
  initPoint: string;
  payerName: string;
  payerEmail: string;
  totalItems: number;
  totalAmount: number;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
  paymentStatus: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
}

export interface OrderDetailsResponse {
  id: string;
  orderCode: string;
  mpPreferenceId: string;
  total: number;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
  paymentStatus: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  totalItems: number;
  totalPerItem: number;
}

export const orderService = {
  async createOrder(payload: OrderRequest): Promise<OrderResponse> {
    return orderApi.post<OrderResponse>('/orders', payload);
  },

  async getMyOrders(): Promise<OrderDetailsResponse[]> {
    return orderApi.get<OrderDetailsResponse[]>('/orders/me');
  }
};
