import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SectionSkeletonProps = {
  rows?: number;
  className?: string;
};

/**
 * Configurable skeleton matching card/chart/metric shapes
 * With pulse animation
 */
export function SectionSkeleton({ 
  rows = 3, 
  className 
}: SectionSkeletonProps) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-16" />
      </div>
      
      {/* Rows of content skeletons */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}