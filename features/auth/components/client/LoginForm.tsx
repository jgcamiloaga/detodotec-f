"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { Button } from "@/features/ui/atoms/Button";
import { Input } from "@/features/ui/atoms/Input";
import { showToast } from "@/features/ui/atoms/Toaster";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Fake login
    const name = formData.email.split("@")[0]; // Simple fake name
    login(formData.email, name.charAt(0).toUpperCase() + name.slice(1));
    
    showToast({
      title: "¡Bienvenido de vuelta!",
      description: "Has iniciado sesión exitosamente.",
      type: "success",
    });
    
    setIsLoading(false);
    router.push("/");
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
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
