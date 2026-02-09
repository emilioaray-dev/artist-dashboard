import { Skeleton } from "@/components/ui/core/skeleton";
import React from "react";
import { SkeletonProps } from "@/types/component-types";

// Skeleton variant types
type SkeletonVariant =
  | "metric-card"
  | "chart"
  | "list-item"
  | "avatar"
  | "text-line"
  | "button"
  | "custom";

interface GenericSkeletonProps extends SkeletonProps {
  variant?: SkeletonVariant;
}

const CHART_BAR_WIDTHS = [
  "w-full",
  "w-5/6",
  "w-4/6",
  "w-3/6",
  "w-2/6",
] as const;

/**
 * Generic skeleton component for different content types.
 * Standardizes loading states across the application.
 */
export const GenericSkeleton: React.FC<GenericSkeletonProps> = ({
  variant = "custom",
  className = "",
  count = 1,
  width,
  height,
}) => {
  // Generate skeleton based on variant
  const renderSkeletonByVariant = () => {
    switch (variant) {
      case "metric-card":
        return (
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="mb-4 h-4 w-1/3" />
            <Skeleton className="mb-2 h-8 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        );

      case "chart":
        return (
          <div className="bg-card rounded-xl border p-6">
            <Skeleton className="mb-6 h-6 w-1/4" />
            <div className="space-y-4">
              {CHART_BAR_WIDTHS.map((width) => (
                <Skeleton key={width} className={`h-4 ${width}`} />
              ))}
            </div>
          </div>
        );

      case "list-item":
        return (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        );

      case "avatar":
        return <Skeleton className="h-10 w-10 rounded-full" />;

      case "text-line":
        return <Skeleton className="h-4 w-full" />;

      case "button":
        return <Skeleton className="h-10 w-full" />;

      case "custom":
      default:
        return (
          <Skeleton
            className={className}
            style={{ width: width || undefined, height: height || undefined }}
          />
        );
    }
  };

  // If count > 1, render multiple skeletons
  if (count > 1) {
    return (
      <div className={className}>
        {Array.from({ length: count }, (_, index) => (
          <div key={`skeleton-${index}`} className="mb-2 last:mb-0">
            {renderSkeletonByVariant()}
          </div>
        ))}
      </div>
    );
  }

  return renderSkeletonByVariant();
};
