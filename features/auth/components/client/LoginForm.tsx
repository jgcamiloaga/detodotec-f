"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/auth-service";
import { Button } from "@/features/ui/atoms/Button";
import { Input } from "@/features/ui/atoms/Input";
import { showToast } from "@/features/ui/atoms/Toaster";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Real login request to the gateway/auth service
      const tokens = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      // Temporarily save tokens so getCurrentUser can use them immediately
      useAuthStore.getState().updateTokens(tokens.accessToken, tokens.refreshToken);

      // Fetch full user profile
      const user = await authService.getCurrentUser();

      // Update global auth state with tokens and user
      setAuth(user, tokens.accessToken, tokens.refreshToken);

      showToast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión exitosamente.",
        type: "success",
      });

      router.push("/");
    } catch (error: any) {
      showToast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales inválidas o error de conexión.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card w-full max-w-md mx-auto p-8 rounded-2xl shadow-card border border-border"
    >
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">
          Iniciar sesión
        </h1>
        <p className="text-muted-foreground text-sm">
          Ingresa tus datos para acceder a tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Usuario"
          type="text"
          placeholder="usuario"
          required
          leftIcon={<User className="h-4 w-4" />}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />

        <div className="space-y-1">
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <div className="flex justify-end">
            <Link
              href="#"
              className="text-xs text-secondary hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full mt-6 font-bold"
          rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Ingresar"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-secondary font-semibold hover:underline"
        >
          Regístrate aquí
        </Link>
      </div>
    </motion.div>
  );
}
