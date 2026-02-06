"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/core/chart";
import { Skeleton } from "@/components/ui/core/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/core/tabs";
import { getCachedSales } from "@/lib/actions";
import { CHART_COLORS, TIME_RANGES } from "@/lib/constants";
import { DailySales, SalesSummary } from "@/types";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type RevenueChartProps = {
  initialSalesData: SalesSummary;
};

/**
 * Revenue chart with time range tabs and clickable legend
 * Uses shadcn/ui AreaChart with Gross vs Net lines
 */
export function RevenueChart({ initialSalesData }: RevenueChartProps) {
  const [selectedRange, setSelectedRange] = useState<"7d" | "30d" | "90d">(
    "30d",
  );
  const [currentSalesData, setCurrentSalesData] =
    useState<SalesSummary>(initialSalesData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSalesData(initialSalesData);
  }, [initialSalesData]);

  const [activeChannels] = useState<Record<string, boolean>>({
    gross: true,
    net: true,
    direct_to_fan: true,
    digital: true,
    physical: true,
    bundles: true,
  });

  const handleRangeChange = async (value: string) => {
    const range = value as "7d" | "30d" | "90d";
    setSelectedRange(range);
    setIsLoading(true);
    try {
      const newSalesData = await getCachedSales(range);
      setCurrentSalesData(newSalesData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = currentSalesData.dailyData
    ? currentSalesData.dailyData.map((day: DailySales) => ({
        date: day.date,
        gross: day.revenue,
        net: day.revenue,
        direct_to_fan: day.revenueByChannel.direct_to_fan,
        digital: day.revenueByChannel.digital,
        physical: day.revenueByChannel.physical,
        bundles: day.revenueByChannel.bundles,
      }))
    : [];

  const chartConfig = {
    gross: CHART_COLORS.gross,
    net: CHART_COLORS.net,
    direct_to_fan: CHART_COLORS.direct_to_fan,
    digital: CHART_COLORS.digital,
    physical: CHART_COLORS.physical,
    bundles: CHART_COLORS.bundles,
  };

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Revenue</CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-4 w-[250px]" />
            ) : (
              `Showing revenue data for ${currentSalesData.periodStart || ""} to ${currentSalesData.periodEnd || ""}`
            )}
          </CardDescription>
        </div>
        <Tabs
          value={selectedRange}
          onValueChange={handleRangeChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            {TIME_RANGES.map((range) => (
              <TabsTrigger
                key={range.value}
                value={range.value}
                disabled={isLoading}
              >
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              {activeChannels.gross && (
                <Area
                  dataKey="gross"
                  type="natural"
                  fill="var(--color-gross)"
                  fillOpacity={0.4}
                  stroke="var(--color-gross)"
                  stackId="a"
                />
              )}
              {activeChannels.net && (
                <Area
                  dataKey="net"
                  type="natural"
                  fill="var(--color-net)"
                  fillOpacity={0.4}
                  stroke="var(--color-net)"
                  stackId="a"
                />
              )}
              {activeChannels.direct_to_fan && (
                <Area
                  dataKey="direct_to_fan"
                  type="natural"
                  fill="var(--color-direct_to_fan)"
                  fillOpacity={0.4}
                  stroke="var(--color-direct_to_fan)"
                  stackId="a"
                />
              )}
              {activeChannels.digital && (
                <Area
                  dataKey="digital"
                  type="natural"
                  fill="var(--color-digital)"
                  fillOpacity={0.4}
                  stroke="var(--color-digital)"
                  stackId="a"
                />
              )}
              {activeChannels.physical && (
                <Area
                  dataKey="physical"
                  type="natural"
                  fill="var(--color-physical)"
                  fillOpacity={0.4}
                  stroke="var(--color-physical)"
                  stackId="a"
                />
              )}
              {activeChannels.bundles && (
                <Area
                  dataKey="bundles"
                  type="natural"
                  fill="var(--color-bundles)"
                  fillOpacity={0.4}
                  stroke="var(--color-bundles)"
                  stackId="a"
                />
              )}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
