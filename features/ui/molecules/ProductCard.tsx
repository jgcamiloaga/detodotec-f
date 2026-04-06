import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { Badge } from "@/features/ui/atoms/Badge";
import { RatingStars } from "@/features/ui/molecules/RatingStars";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { AddToCartButton } from "@/features/products/components/client/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? calculateDiscount(product.originalPrice, product.price)
      : null;

  return (
    <article className="product-card bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 group">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="new">Nuevo</Badge>}
          {product.isBestSeller && (
            <Badge variant="bestseller">Best Seller</Badge>
          )}
          {discount && discount > 0 && (
            <Badge variant="sale">-{discount}%</Badge>
          )}
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-3">
            <Badge variant="destructive" size="sm">
              ¡Solo {product.stock} disponibles!
            </Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand + Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
            {product.brand}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.category.name}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 hover:text-secondary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <RatingStars
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
          className="mb-3"
        />

        {/* Price + Cart */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-foreground leading-tight">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <AddToCartButton product={product} iconOnly />
        </div>
      </div>
    </article>
  );
}
