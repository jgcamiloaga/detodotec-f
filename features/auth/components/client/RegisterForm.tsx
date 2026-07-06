"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, Loader2, Phone, MapPin, AtSign, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { authService } from "../../services/auth-service";
import { Button } from "@/features/ui/atoms/Button";
import { Input } from "@/features/ui/atoms/Input";
import { showToast } from "@/features/ui/atoms/Toaster";

export function RegisterForm() {
  const router = useRouter();
  
  const [step, setStep] = useState<"register" | "verify">("register");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
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
        description: "Hemos enviado un código de verificación a tu correo.",
        type: "success",
      });
      
      setStep("verify");
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.verifyUser(verificationCode, formData.email);
      
      showToast({
        title: "¡Cuenta verificada!",
        description: "Tu cuenta ha sido verificada. Ahora puedes iniciar sesión.",
        type: "success",
      });
      
      router.push("/login");
    } catch (error: any) {
      showToast({
        title: "Error de verificación",
        description: error.message || "El código ingresado es incorrecto o ha expirado.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await authService.resendCode(formData.email);
      showToast({
        title: "Código reenviado",
        description: "Se ha enviado un nuevo código de verificación a tu correo.",
        type: "success",
      });
    } catch (error: any) {
      showToast({
        title: "Error al reenviar",
        description: error.message || "No se pudo reenviar el código. Inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (step === "verify") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card w-full max-w-md mx-auto p-8 rounded-2xl shadow-card border border-border"
      >
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-2">
            Verifica tu cuenta
          </h1>
          <p className="text-muted-foreground text-sm">
            Ingresa el código de verificación enviado a <span className="font-semibold text-foreground">{formData.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            label="Código de verificación"
            type="text"
            placeholder="Introduce el código"
            required
            leftIcon={<KeyRound className="h-4 w-4" />}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full font-bold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verificar Cuenta"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-4 text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isResending}
            className="text-secondary font-semibold hover:underline text-sm disabled:opacity-50"
          >
            {isResending ? "Reenviando..." : "¿No recibiste el código? Reenviar"}
          </button>

          <button
            type="button"
            onClick={() => setStep("register")}
            className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al registro
          </button>
        </div>
      </motion.div>
    );
  }

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

