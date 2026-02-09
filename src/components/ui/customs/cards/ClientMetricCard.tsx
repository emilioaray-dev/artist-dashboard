"use client";

import { MetricCard } from "./MetricCard";
import { MetricProps } from "@/types/component-types";
import { SlideInAnimation } from "@/components/motion/AnimationUtils";
import React from "react";
import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

interface ClientMetricCardProps extends Omit<MetricProps, "icon"> {
  icon: string;
  value: string;
  delay?: number;
}

export function ClientMetricCard({
  delay = 0,
  icon,
  ...props
}: Readonly<ClientMetricCardProps>) {
  // Mapear nombres de iconos a componentes
  const iconComponents: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    DollarSign,
    Users,
    ShoppingCart,
    TrendingUp,
  };

  const SelectedIcon = iconComponents[icon] || DollarSign;

  return (
    <SlideInAnimation delay={delay} duration={0.3}>
      <MetricCard {...props} icon={SelectedIcon} />
    </SlideInAnimation>
  );
}
