import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-surface-container-low border-ouline border-1 text-on-surface shadow-xs hover:bg-surface-container",
        outline:
          "border border-outline-variant text-outline bg-surface-container-lowest hover:bg-surface-container px-4",
        primary:
          "bg-primary border-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container",
        secondary:
          "bg-secondary-container border-secondary text-on-secondary-container hover:bg-secondary/80",
        secondaryOutline:
          "border border-secondary-container text-secondary-container hover:bg-secondary/80",
        success:
          "bg-green-200 border-green-950 text-green-800 hover:bg-green-400",
        ghost: "border-0 hover:bg-surface-container-low hover:text-on-surface",
        link: "border-0 text-blue-500 underline-offset-4 hover:underline",
        agent:
          "bg-linear-to-r/oklab from-primary to-primary-container text-on-primary border-primary ",
        error:
          "bg-error-container border-error text-on-error-container hover:bg-error/90 focus-visible:ring-destructive/20",
      },
      size: {
        default: "px-4 py-1 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
