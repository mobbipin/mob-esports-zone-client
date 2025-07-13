import * as React from "react";
import { cn } from "../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error" | "gradient";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    variant = "default",
    size = "default",
    showLabel = false,
    animated = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const progressStyles = {
      default: "bg-[#f34024]",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600",
      gradient: "bg-gradient-to-r from-[#f34024] to-[#9147ff]",
    };

    const sizeStyles = {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    };

    return (
      <div className="w-full" ref={ref} {...props}>
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span className="text-sm font-medium text-white">
              Progress
            </span>
          )}
          {showLabel && (
            <span className="text-sm text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        <div
          className={cn(
            "w-full bg-[#292932] rounded-full overflow-hidden",
            sizeStyles[size],
            className
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out",
              progressStyles[variant],
              animated && "animate-pulse"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress }; 