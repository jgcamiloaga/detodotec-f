import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/client/LoginForm";
import { AuthBackground } from "@/features/auth/components/client/AuthBackground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Ingresa a tu cuenta de DeTodoTec para gestionar tus pedidos y acceder a ofertas exclusivas.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AuthBackground />
      
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors text-sm font-medium mb-10 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>
        
        <div className="flex-1 flex items-center justify-center -mt-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
