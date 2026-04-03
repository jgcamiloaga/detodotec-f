import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/features/cart/components/client/CartProvider";
import { Header } from "@/features/ui/organisms/Header";
import { Footer } from "@/features/ui/organisms/Footer";
import { Toaster } from "@/features/ui/atoms/Toaster";

export const metadata: Metadata = {
  title: {
    default: "DeTodoTec — Tu tienda de tecnología",
    template: "%s | DeTodoTec",
  },
  description:
    "Encuentra laptops, smartphones, audio, monitores y accesorios tech de las mejores marcas. Envíos a todo el Perú con los mejores precios garantizados.",
  keywords: [
    "tecnología",
    "laptop",
    "smartphone",
    "auriculares",
    "monitor",
    "gaming",
    "perú",
    "ecommerce",
  ],
  authors: [{ name: "DeTodoTec" }],
  creator: "DeTodoTec",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://detodotec.com",
    siteName: "DeTodoTec",
    title: "DeTodoTec — Tu tienda de tecnología",
    description:
      "Encuentra laptops, smartphones, audio y accesorios tech de las mejores marcas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#1E3A8A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
