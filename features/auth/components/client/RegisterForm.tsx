"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { Button } from "@/features/ui/atoms/Button";
import { Input } from "@/features/ui/atoms/Input";
import { showToast } from "@/features/ui/atoms/Toaster";

export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Fake registration
    register(formData.name, formData.email);
    
    showToast({
      title: "¡Cuenta creada!",
      description: "Bienvenido a DeTodoTec.",
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
          Crear cuenta
        </h1>
        <p className="text-muted-foreground text-sm">
          Únete a DeTodoTec y disfruta de beneficios exclusivos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Juan Pérez"
          required
          leftIcon={<User className="h-4 w-4" />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          required
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          required
          leftIcon={<Lock className="h-4 w-4" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          required
          leftIcon={<Lock className="h-4 w-4" />}
          error={error}
          value={formData.confirmPassword}
          onChange={(e) => {
            setError("");
            setFormData({ ...formData, confirmPassword: e.target.value });
          }}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full mt-6 font-bold"
          rightIcon={!isLoading && <UserPlus className="h-4 w-4" />}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Registrarse"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link 
          href="/login" 
          className="text-secondary font-semibold hover:underline"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </motion.div>
  );
}
