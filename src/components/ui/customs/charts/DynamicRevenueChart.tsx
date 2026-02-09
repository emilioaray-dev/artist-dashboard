"use client";

import dynamic from "next/dynamic";
import { RevenueChartSkeleton } from "@/components/ui/customs/feedback/RevenueChartSkeleton";
import { SalesSummary } from "@/types";

const RevenueChart = dynamic(
  () =>
    import("@/components/ui/customs/charts/RevenueChart").then((mod) => ({
      default: mod.RevenueChart,
    })),
  {
    ssr: false,
    loading: () => <RevenueChartSkeleton />,
  },
);

type DynamicRevenueChartProps = {
  initialSalesData: SalesSummary;
};

export function DynamicRevenueChart({
  initialSalesData,
}: Readonly<DynamicRevenueChartProps>) {
  return <RevenueChart initialSalesData={initialSalesData} />;
}
