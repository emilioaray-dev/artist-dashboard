// src/types/component-types.ts

// Interfaces comunes para componentes de la aplicación

// Props base para componentes que aceptan clases CSS personalizadas
export interface ClassNameProps {
  className?: string;
}

// Props base para componentes que aceptan hijos
export interface ChildrenProps {
  children: React.ReactNode;
}

// Props base combinadas
export interface BaseComponentProps extends ClassNameProps, ChildrenProps {}

// Props para componentes de tarjetas
export interface CardProps extends ClassNameProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

// Props para componentes de métricas
export interface MetricProps extends ClassNameProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: number; // Porcentaje de cambio
  icon?: React.ElementType;
  trend?: "up" | "down" | "neutral";
}

// Props para componentes de gráficos
export interface ChartProps<T> extends ClassNameProps {
  data: T[];
  config: Record<string, unknown>;
  aspectRatio?: number;
  title?: string;
  description?: string;
}

// Props para componentes de skeleton
export interface SkeletonProps extends ClassNameProps {
  variant?:
    | "metric-card"
    | "chart"
    | "list-item"
    | "avatar"
    | "text-line"
    | "button"
    | "custom";
  count?: number;
  width?: string | number;
  height?: string | number;
}

// Props para componentes de botones
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  asChild?: boolean;
}

// Props para componentes de animación
export interface AnimationProps extends ClassNameProps {
  animationType?: "fadeIn" | "slideIn" | "scaleIn" | "stagger";
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

// Props para componentes de formulario
export interface FormFieldProps extends ClassNameProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

// Props para componentes de lista
export interface ListProps<T> extends ClassNameProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  emptyState?: React.ReactNode;
}
