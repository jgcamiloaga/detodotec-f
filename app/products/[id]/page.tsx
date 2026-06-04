import { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogService } from "@/features/products/services/catalog-service";
import { ProductCard } from "@/features/ui/molecules/ProductCard";
import { RatingStars } from "@/features/ui/molecules/RatingStars";
import { Badge } from "@/features/ui/atoms/Badge";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/features/products/components/client/ProductGallery";
import { ProductActions } from "@/features/products/components/client/ProductActions";
import {
  Shield,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ProductDetailResponse, SkuType } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipo?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { tipo } = await searchParams;
  try {
    const product = await catalogService.getProductById(id, (tipo as SkuType) || "SALE");
    return {
      title: product.name,
      description: product.description,
    };
  } catch (error) {
    return { title: "Producto no encontrado" };
  }
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { tipo } = await searchParams;

  let product: ProductDetailResponse;
  let related = [];

  try {
    product = await catalogService.getProductById(id, (tipo as any) || "SALE");
    const relatedPage = await catalogService.getProducts(0, 4, product.skuType);
    related = relatedPage.content.filter(p => p.id !== product.id);
  } catch (error) {
    return notFound();
  }

  const stock = 10;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-foreground transition-colors">
              Productos
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium line-clamp-1 max-w-48">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          <ProductGallery images={product.images?.map((img: any) => img.url) || ["/placeholder.jpg"]} name={product.name} />

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                DETODOTEC
              </p>
              <h1 className="font-display font-extrabold text-2xl lg:text-3xl xl:text-4xl text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            <RatingStars
              rating={4.5}
              reviewCount={12}
              size="md"
            />

            <div className="flex items-end gap-3">
              <span className="font-display font-extrabold text-3xl lg:text-4xl text-foreground">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2">
              {stock > 10 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">En stock</span>
                </>
              ) : stock > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning font-medium">
                    ¡Solo {stock} disponibles!
                  </span>
                </>
              ) : (
                <span className="text-sm text-destructive font-medium">Sin stock</span>
              )}
            </div>

            <ProductActions product={product} />

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
              {[
                { icon: Truck, text: "Envío express" },
                { icon: Shield, text: "Garantía oficial" },
                { icon: RotateCcw, text: "30 días devolución" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted text-center"
                >
                  <Icon className="h-5 w-5 text-secondary" />
                  <span className="text-xs font-medium text-muted-foreground leading-tight">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-6">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
