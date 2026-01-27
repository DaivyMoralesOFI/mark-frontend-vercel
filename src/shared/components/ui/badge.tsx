import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/core/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-4 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary [a&]:hover:bg-primary/90",
        primaryOutline:
          "border-primary bg-primary-container text-on-primary-container [a&]:hover:bg-primary-container/90",
        secondary:
          "border-secondary bg-secondary text-on-secondary [a&]:hover:bg-secondary/90",
        secondaryOutline:
          "border-secondary bg-secondary-container text-on-secondary-container [a&]:hover:bg-secondary-container/90",
        tertiaryOutline:
          "border-tertiary bg-tertiary-container text-on-tertiary-container [a&]:hover:bg-tertiary-container/90",
        destructive:
          "border-error bg-error-container text-on-error-container [a&]:hover:bg-error-container/90",
        outline:
          "text-on-surface [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "bg-transparent text-on-surface border-0",
        agent:
          "rounded-sm bg-linear-to-r/oklab from-primary to-primary-container text-on-primary border-primary",
        high: "bg-red-100 text-red-700 border border-red-700",
        medium: "bg-yellow-100 text-yellow-700 border border-yellow-700",
        low: "bg-green-100 text-green-700 border border-green-700",
        gold: "bg-amber-300 border-amber-600 text-amber-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
