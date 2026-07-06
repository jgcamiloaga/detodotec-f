import { authApi } from "@/lib/api-client";
import { User } from "@/lib/types";
import { useAuthStore } from "../store/authStore";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  roles: string[];
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: Record<string, string>): Promise<LoginResponse> {
    return authApi.post<LoginResponse>('/auth/login', credentials);
  },

  async register(payload: RegisterPayload): Promise<User> {
    return authApi.post<User>('/auth/register', payload);
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    return authApi.post<RefreshResponse>('/auth/refresh', refreshToken);
  },

  async getCurrentUser(): Promise<User> {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1];
          const payloadJson = JSON.parse(atob(payloadBase64));
          const name = `${payloadJson.firstName || ""} ${payloadJson.lastName || ""}`.trim();
          return {
            id: payloadJson.userId,
            name: name || payloadJson.sub || "Usuario",
            email: payloadJson.email,
            role: payloadJson.authorities && payloadJson.authorities.includes("ROLE_ADMIN") ? "admin" : "customer"
          };
        } catch (e) {
          console.error("Failed to decode token", e);
        }
      }
    }
    throw new Error("No authenticated user found");
  },

  async getUserById(id: string): Promise<User> {
    return authApi.get<User>(`/users/${id}`);
  },

  async verifyUser(code: string, email: string): Promise<void> {
    return authApi.post<void>('/users/verify', { code, email });
  },

  async resendCode(email: string): Promise<void> {
    return authApi.post<void>('/users/resend-code', null, { params: { email } });
  }
};

