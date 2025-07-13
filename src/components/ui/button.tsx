import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f34024] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1e] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-[#f34024] text-white shadow hover:bg-[#d6331f] hover:shadow-md hover:shadow-[#f34024]/15",
        destructive:
          "bg-red-600 text-white shadow hover:bg-red-700 hover:shadow-md hover:shadow-red-600/15",
        outline:
          "border-2 border-[#292932] bg-transparent text-white shadow hover:bg-[#292932] hover:border-[#f34024] hover:shadow-md hover:shadow-[#f34024]/15",
        secondary:
          "bg-[#292932] text-white shadow hover:bg-[#3a3a42] hover:shadow-md",
        ghost: 
          "text-white hover:bg-[#292932] hover:text-[#f34024]",
        link: 
          "text-[#f34024] underline-offset-4 hover:underline hover:text-[#d6331f]",
        gradient:
          "bg-gradient-to-r from-[#f34024] to-[#9147ff] text-white shadow hover:from-[#d6331f] hover:to-[#7c3aed] hover:shadow-md hover:shadow-[#f34024]/15",
        glass:
          "backdrop-blur-sm bg-white/10 border border-white/20 text-white shadow hover:bg-white/20 hover:shadow-md",
        success:
          "bg-green-600 text-white shadow hover:bg-green-700 hover:shadow-md hover:shadow-green-600/15",
        warning:
          "bg-yellow-600 text-white shadow hover:bg-yellow-700 hover:shadow-md hover:shadow-yellow-600/15",
      },
      size: {
        xs: "h-6 px-2 text-xs rounded",
        sm: "h-8 px-3 text-sm rounded",
        default: "h-9 px-4 py-2",
        lg: "h-10 px-8 text-base",
        xl: "h-12 px-10 text-lg rounded-lg",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      loading: {
        true: "opacity-75 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    asChild = false, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
