import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: RatingStarsProps) {
  const sizeMap = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  const textMap = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;
    if (rating >= value) return "full";
    if (rating >= value - 0.5) return "half";
    return "empty";
  });

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <span key={i}>
            {type === "full" && (
              <Star
                className={cn(sizeMap[size], "fill-amber-400 stroke-amber-400")}
              />
            )}
            {type === "half" && (
              <StarHalf
                className={cn(sizeMap[size], "fill-amber-400 stroke-amber-400")}
              />
            )}
            {type === "empty" && (
              <Star
                className={cn(sizeMap[size], "fill-muted stroke-muted-foreground/40")}
              />
            )}
          </span>
        ))}
      </div>
      <span className={cn(textMap[size], "font-semibold text-foreground")}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={cn(textMap[size], "text-muted-foreground ml-1")}>
          ({reviewCount.toLocaleString("es-PE")})
        </span>
      )}
    </div>
  );
}
