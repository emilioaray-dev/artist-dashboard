import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/FadeIn";
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
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <FadeIn>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center",
          className,
        )}
      >
        <div className="bg-muted mb-4 rounded-full p-3">
          {Icon && <Icon className="text-muted-foreground size-8" />}
        </div>
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
        {action && <div>{action}</div>}
      </div>
    </FadeIn>
  );
}
