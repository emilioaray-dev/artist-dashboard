"use client";

import dynamic from "next/dynamic";
import { RevenueChartSkeleton } from "@/components/ui/customs/feedback/RevenueChartSkeleton";
import { EngagementMetrics } from "@/types";

const FanGrowthChart = dynamic(
  () =>
    import("@/components/ui/customs/charts/FanGrowthChart").then((mod) => ({
      default: mod.FanGrowthChart,
    })),
  {
    ssr: false,
    loading: () => <RevenueChartSkeleton />,
  },
);

type DynamicFanGrowthChartProps = {
  engagementData: EngagementMetrics;
};

export function DynamicFanGrowthChart({
  engagementData,
}: Readonly<DynamicFanGrowthChartProps>) {
  return <FanGrowthChart engagementData={engagementData} />;
}
