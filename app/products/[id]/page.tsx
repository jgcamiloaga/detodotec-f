import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductById,
  getRelatedProducts,
} from "@/features/products/data/mock-products";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.category.id);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
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
            <Link
              href={`/products?category=${product.category.id}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium line-clamp-1 max-w-48">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Gallery (client) */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Product info (server) */}
          <div className="flex flex-col gap-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="muted">{product.category.name}</Badge>
              {product.isNew && <Badge variant="new">Nuevo</Badge>}
              {product.isBestSeller && <Badge variant="bestseller">Best Seller</Badge>}
              {discount && <Badge variant="sale">-{discount}% OFF</Badge>}
            </div>

            {/* Brand + Name */}
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-wider mb-1">
                {product.brand}
              </p>
              <h1 className="font-display font-extrabold text-2xl lg:text-3xl xl:text-4xl text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
            />

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="font-display font-extrabold text-3xl lg:text-4xl text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge variant="sale" size="lg" className="mb-1">
                    Ahorra {formatPrice(product.originalPrice - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 10 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">En stock</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning font-medium">
                    ¡Solo {product.stock} disponibles!
                  </span>
                </>
              ) : (
                <span className="text-sm text-destructive font-medium">Sin stock</span>
              )}
            </div>

            {/* Add to cart (client) */}
            <ProductActions product={product} />

            {/* Benefits */}
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

        {/* Specs */}
        {product.specs && (
          <div className="mb-16">
            <h2 className="font-display font-bold text-2xl text-foreground mb-6">
              Especificaciones técnicas
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex items-start gap-4 px-6 py-4 ${
                    i % 2 === 0 ? "bg-muted/30" : "bg-card"
                  }`}
                >
                  <span className="font-semibold text-sm text-foreground min-w-40 shrink-0">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
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
