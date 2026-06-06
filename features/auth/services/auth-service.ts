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
    const user = await authApi.get<User>('/users/me');

    user.role = "customer";

    if (typeof window !== "undefined") {
      try {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          const payloadBase64 = token.split('.')[1];
          const payloadJson = JSON.parse(atob(payloadBase64));
          if (payloadJson.authorities && payloadJson.authorities.includes("ROLE_ADMIN")) {
            user.role = "admin";
          }
        }
      } catch (e) {
        console.error("Failed to decode token for role", e);
      }
    }
    return user;
  },

  async getUserById(id: string): Promise<User> {
    return authApi.get<User>(`/users/${id}`);
  }
};
