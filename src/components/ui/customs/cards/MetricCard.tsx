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
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              {prefix && (
                <span className="text-foreground text-2xl font-medium">
                  {prefix}
                </span>
              )}
              <span className="text-foreground text-2xl font-bold">
                {value}
              </span>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground rounded-full bg-[#D97706] p-3 text-white">
            <Icon className="size-5" />
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-4 flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="text-positive h-4 w-4" />
            ) : (
              <TrendingDown className="text-negative h-4 w-4" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? "text-positive" : "text-negative"}`}
            >
              {isPositive ? "+" : "-"}
              {changeValue}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MetricCard = React.memo(MetricCardComponent);

MetricCard.displayName = "MetricCard";
