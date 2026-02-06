import { Skeleton } from "@/components/ui/core/skeleton";
import React from "react";
import { SkeletonProps } from "@/types/component-types";

// Tipos para las variantes de skeleton
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

/**
 * Componente genérico de skeleton para diferentes tipos de contenido
 * Permite estandarizar los estados de carga en toda la aplicación
 */
export const GenericSkeleton: React.FC<GenericSkeletonProps> = ({
  variant = "custom",
  className = "",
  count = 1,
  width,
  height,
}) => {
  // Función para generar skeleton basado en la variante
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
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-4 ${
                    i === 0
                      ? "w-full"
                      : i === 1
                        ? "w-5/6"
                        : i === 2
                          ? "w-4/6"
                          : i === 3
                            ? "w-3/6"
                            : "w-2/6"
                  }`}
                />
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

  // Si count > 1, renderizar múltiples skeletons
  if (count > 1) {
    return (
      <div className={className}>
        {[...Array(count)].map((_, index) => (
          <div key={index} className="mb-2 last:mb-0">
            {renderSkeletonByVariant()}
          </div>
        ))}
      </div>
    );
  }

  return renderSkeletonByVariant();
};
