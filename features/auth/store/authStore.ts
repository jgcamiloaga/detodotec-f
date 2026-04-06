import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, name) => {
        // Mocking a successful login response
        const mockUser: User = {
          id: `usr_${Math.random().toString(36).substring(2, 9)}`,
          email,
          name,
          role: "customer",
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      register: (name, email) => {
        // Mocking a successful register response
        const mockUser: User = {
          id: `usr_${Math.random().toString(36).substring(2, 9)}`,
          email,
          name,
          role: "customer",
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "detodotec-auth-storage",
    }
  )
);
