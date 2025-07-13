import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
  variant?: "default" | "text" | "circular" | "rectangular";
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  height, 
  width, 
  variant = "default",
  lines = 1,
  ...props 
}) => {
  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse rounded bg-gray-700",
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
            style={{ height: height || "1rem" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gray-700",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-none",
        className
      )}
      style={{ 
        height: height || "1rem", 
        width: width || "100%" 
      }}
      {...props}
    />
  );
};

// Enhanced skeleton components for specific use cases
export const CardSkeleton: React.FC = () => (
  <div className="bg-[#15151a] border-[#292932] rounded-xl p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

export const TournamentCardSkeleton: React.FC = () => (
  <div className="bg-[#15151a] border-[#292932] rounded-xl overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-700"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="h-10 bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <div className="h-8 bg-gray-700 rounded w-1/3"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-[#15151a] border-[#292932] rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#15151a] border-[#292932] rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-[#15151a] border-[#292932] rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
); 