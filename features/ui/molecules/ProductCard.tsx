import Link from "next/link";
import Image from "next/image";
import { ProductCatalogoResponse } from "@/lib/types";
import { Badge } from "@/features/ui/atoms/Badge";
import { formatPrice, getSafeImageUrl } from "@/lib/utils";
import { AddToCartButton } from "@/features/products/components/client/AddToCartButton";

interface ProductCardProps {
  product: ProductCatalogoResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  // We don't have originalPrice/discount in the new catalog schema directly yet
  // But we do have 'tipo' which we can show as a badge

  return (
    <article className="product-card bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group">
      {/* Image */}
      <Link href={`/products/${product.id}?tipo=${product.tipo}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
          <Image
            src={getSafeImageUrl(product.imagenUrl)}
            alt={product.nombre}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant="new" className="uppercase">{product.tipo}</Badge>
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-3">
            <Badge variant="destructive" size="sm">
              ¡Solo {product.stock} disp.!
            </Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <Link href={`/products/${product.id}?tipo=${product.tipo}`}>
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 hover:text-secondary transition-colors mb-4">
            {product.nombre}
          </h3>
        </Link>

        {/* Price + Cart */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-foreground leading-tight">
              {formatPrice(product.precio)}
            </p>
          </div>
          <AddToCartButton product={product as any} iconOnly />
        </div>
      </div>
    </article>
  );
}
