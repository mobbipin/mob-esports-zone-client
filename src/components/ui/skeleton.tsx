import React from "react";

export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}> = ({ width = "100%", height = 20, className = "", style = {} }) => (
  <div
    className={`animate-pulse bg-gray-700 rounded ${className}`}
    style={{ width, height, ...style }}
  />
);

export default Skeleton; 