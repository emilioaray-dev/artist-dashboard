import { cn } from "@/lib/utils";
import { FadeIn } from "../motion/FadeIn";
import { Music } from "lucide-react";

type EmptyStateProps = {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

/**
 * Empty state component with centered icon, message, and optional CTA
 * Includes FadeIn animation
 */
export function EmptyState({ 
  icon: Icon = Music, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <FadeIn>
      <div className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center",
        className
      )}>
        <div className="mb-4 rounded-full bg-muted p-3">
          {Icon && <Icon className="size-8 text-muted-foreground" />}
        </div>
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        {action && <div>{action}</div>}
      </div>
    </FadeIn>
  );
}