"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

type MetricCardProps = {
  icon: React.ElementType;
  title: string;
  value: string;
  change?: number;
  prefix?: string;
  delay?: number;
  className?: string;
};

/**
 * Metric card matching the example dashboard style
 * With icon, formatted value with countUp micro-interaction via Motion
 * Trend badge with % and arrow, primary accent for icon
 */
export function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  change,
  prefix = "",
  delay = 0,
  className 
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const changeValue = change !== undefined ? Math.abs(change) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <div className="mt-2 flex items-baseline gap-1">
                {prefix && <span className="text-2xl font-medium text-foreground">{prefix}</span>}
                <span className="text-2xl font-bold text-foreground">{value}</span>
              </div>
            </div>
            <div className="rounded-full bg-primary p-3 text-primary-foreground">
              <Icon className="size-5" />
            </div>
          </div>
          {change !== undefined && (
            <div className="mt-4 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? '+' : '-'}{changeValue}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}