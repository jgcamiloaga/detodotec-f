import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        accent: "bg-accent text-white",
        success: "bg-success text-white",
        destructive: "bg-destructive text-white",
        outline: "border-2 border-primary text-primary bg-transparent",
        muted: "bg-muted text-muted-foreground",
        new: "bg-gradient-to-r from-secondary to-primary text-white",
        sale: "bg-gradient-to-r from-accent to-orange-400 text-white",
        bestseller: "bg-gradient-to-r from-success to-emerald-400 text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
