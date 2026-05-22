import { authApi } from "@/lib/api-client";
import { User } from "@/lib/types";

// Types corresponding to backend endpoints
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
  /**
   * Authenticate user and get tokens
   */
  async login(credentials: Record<string, string>): Promise<LoginResponse> {
    return authApi.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Register a new user account
   */
  async register(payload: RegisterPayload): Promise<User> {
    return authApi.post<User>('/auth/register', payload);
  },

  /**
   * Refresh access token
   */
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    // The endpoint expects the plain string as body, not a JSON object
    // Wait, the API spec says it takes the string as body. Let's make sure our request handler handles this if needed.
    // Actually, looking at the curl command, it sends the string but with application/json. 
    // JSON.stringify("string") is a valid JSON.
    return authApi.post<RefreshResponse>('/auth/refresh', refreshToken);
  },

  /**
   * Get authenticated user profile
   */
  async getCurrentUser(): Promise<User> {
    const user = await authApi.get<User>('/users/me');
    
    // Default to customer
    user.role = "customer";

    // Try to decode token to find role
    if (typeof window !== "undefined") {
      try {
        // authApi might have the token in its interceptor, but we can also get it from Zustand or localStorage
        // Since we can't easily access zustand from here without circular deps, let's just parse the state from local storage
        const authData = localStorage.getItem("detodotec-auth-storage");
        if (authData) {
          const parsed = JSON.parse(authData);
          const token = parsed?.state?.accessToken;
          if (token) {
            const payloadBase64 = token.split('.')[1];
            const payloadJson = JSON.parse(atob(payloadBase64));
            if (payloadJson.authorities && payloadJson.authorities.includes("ROLE_ADMIN")) {
              user.role = "admin";
            }
          }
        }
      } catch (e) {
        console.error("Failed to decode token for role", e);
      }
    }
    return user;
  },

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User> {
    return authApi.get<User>(`/users/${id}`);
  }
};
