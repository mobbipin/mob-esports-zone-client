import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#f34024] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#f34024] text-white hover:bg-[#d6331f]",
        secondary:
          "border-transparent bg-[#292932] text-white hover:bg-[#3a3a42]",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline:
          "border-[#292932] text-white hover:bg-[#292932]",
        success:
          "border-transparent bg-green-600 text-white hover:bg-green-700",
        warning:
          "border-transparent bg-yellow-600 text-white hover:bg-yellow-700",
        info:
          "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        purple:
          "border-transparent bg-purple-600 text-white hover:bg-purple-700",
        pink:
          "border-transparent bg-pink-600 text-white hover:bg-pink-700",
        gray:
          "border-transparent bg-gray-600 text-white hover:bg-gray-700",
        glass:
          "border-white/20 bg-white/10 text-white backdrop-blur-sm",
        gradient:
          "border-transparent bg-gradient-to-r from-[#f34024] to-[#9147ff] text-white",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ 
  className, 
  variant, 
  size,
  icon,
  children,
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
