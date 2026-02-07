"use client";

import { Card, CardContent } from "@/components/ui/core/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import React from "react";
import { MetricProps } from "@/types/component-types";

interface ExtendedMetricProps extends MetricProps {
  icon: React.ElementType;
  value: string;
}

/**
 * Metric card matching the example dashboard style
 * With icon, formatted value with countUp micro-interaction via Motion
 * Trend badge with % and arrow, primary accent for icon
 *
 * NOTE: For explicit variants, use MetricCardPositive, MetricCardNegative, or MetricCardNeutral
 * from MetricCardVariant component instead of this generic version
 */
const MetricCardComponent = ({
  icon: Icon,
  title,
  value,
  change,
  prefix = "",
  className,
}: ExtendedMetricProps) => {
  const isPositive = change !== undefined && change >= 0;
  const changeValue = change !== undefined ? Math.abs(change) : 0;

  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <p className="text-muted-foreground text-sm">{title}</p>
          <div className="bg-muted rounded-lg p-2">
            <Icon className="text-muted-foreground size-5" />
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-foreground text-2xl font-medium">
                {prefix}
              </span>
            )}
            <span className="text-foreground text-2xl font-bold">{value}</span>
          </div>
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                isPositive
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {isPositive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {isPositive ? "+" : "-"}
              {changeValue}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricCard = React.memo(MetricCardComponent);

MetricCard.displayName = "MetricCard";
