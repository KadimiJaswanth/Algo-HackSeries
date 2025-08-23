import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur hover:scale-105 hover:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 hover:border-primary/50 hover:shadow-primary/25",
        secondary:
          "border-secondary/30 bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground hover:from-secondary/30 hover:to-secondary/20 hover:border-secondary/50",
        destructive:
          "border-destructive/30 bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive hover:from-destructive/30 hover:to-destructive/20 hover:border-destructive/50 hover:shadow-destructive/25",
        outline: "text-foreground border-border/50 hover:border-primary/50 hover:bg-primary/10 hover:text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
