"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, Loader2, Phone, MapPin, AtSign } from "lucide-react";
import Link from "next/link";
import { authService } from "../../services/auth-service";
import { Button } from "@/features/ui/atoms/Button";
import { Input } from "@/features/ui/atoms/Input";
import { showToast } from "@/features/ui/atoms/Toaster";

export function RegisterForm() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
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
    
    try {
      // Real registration request
      await authService.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        address: formData.address,
        roles: ["019deacd-8edd-7476-947f-0aa33fa587b5"] // Default "USER" role
      });
      
      showToast({
        title: "¡Cuenta creada!",
        description: "Bienvenido a DeTodoTec. Ahora puedes iniciar sesión.",
        type: "success",
      });
      
      router.push("/login"); // Redirect to login page
    } catch (error: any) {
      showToast({
        title: "Error de registro",
        description: error.message || "No se pudo crear la cuenta. Intenta nuevamente.",
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
          Crear cuenta
        </h1>
        <p className="text-muted-foreground text-sm">
          Únete a DeTodoTec y disfruta de beneficios exclusivos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Juan"
            required
            leftIcon={<User className="h-4 w-4" />}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Apellido"
            type="text"
            placeholder="Pérez"
            required
            leftIcon={<User className="h-4 w-4" />}
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
          />
        </div>

        <Input
          label="Nombre de usuario"
          type="text"
          placeholder="juanperez"
          required
          leftIcon={<AtSign className="h-4 w-4" />}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
          label="Teléfono"
          type="tel"
          placeholder="+51987654321"
          required
          leftIcon={<Phone className="h-4 w-4" />}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Input
          label="Dirección"
          type="text"
          placeholder="Av. Javier Prado 123"
          required
          leftIcon={<MapPin className="h-4 w-4" />}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
