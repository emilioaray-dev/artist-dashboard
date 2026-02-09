// src/types/component-types.ts

// Common component interfaces

// Base props for components that accept custom CSS classes
export interface ClassNameProps {
  className?: string;
}

// Base props for components that accept children
export interface ChildrenProps {
  children: React.ReactNode;
}

// Combined base props
export interface BaseComponentProps extends ClassNameProps, ChildrenProps {}

// Card component props
export interface CardProps extends ClassNameProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

// Metric component props
export interface MetricProps extends ClassNameProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: number; // Change percentage
  icon?: React.ElementType;
  trend?: "up" | "down" | "neutral";
}

// Chart component props
export interface ChartProps<T> extends ClassNameProps {
  data: T[];
  config: Record<string, unknown>;
  aspectRatio?: number;
  title?: string;
  description?: string;
}

// Skeleton component props
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

// Button component props
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

// Animation component props
export interface AnimationProps extends ClassNameProps {
  animationType?: "fadeIn" | "slideIn" | "scaleIn" | "stagger";
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

// Form field component props
export interface FormFieldProps extends ClassNameProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

// List component props
export interface ListProps<T> extends ClassNameProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  emptyState?: React.ReactNode;
}
