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
import { useLocale, useTranslations } from "next-intl";

type RevenueChartProps = {
  initialSalesData: SalesSummary;
};

/**
 * Revenue chart with time range tabs and clickable legend
 * Uses shadcn/ui AreaChart with Gross vs Net lines
 */
export function RevenueChart({ initialSalesData }: RevenueChartProps) {
  const locale = useLocale();
  const t = useTranslations("Formats");
  const tCommon = useTranslations("Common");
  const tOverview = useTranslations("Overview");
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
    gross: { ...CHART_COLORS.gross, label: t("grossRevenue") },
    net: { ...CHART_COLORS.net, label: t("netRevenue") },
    direct_to_fan: { ...CHART_COLORS.direct_to_fan, label: t("directToFan") },
    digital: { ...CHART_COLORS.digital, label: t("digital") },
    physical: { ...CHART_COLORS.physical, label: t("physical") },
    bundles: { ...CHART_COLORS.bundles, label: t("bundles") },
  };

  const timeRangeLabels: Record<string, string> = {
    "7d": t("timeRange7d"),
    "30d": t("timeRange30d"),
    "90d": t("timeRange90d"),
  };

  return (
    <Card className="card-hover">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{tOverview("revenue")}</CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-4 w-[250px]" />
            ) : (
              tCommon("showingDataFor", {
                start: currentSalesData.periodStart || "",
                end: currentSalesData.periodEnd || "",
              })
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
                {timeRangeLabels[range.value] || range.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p>{tCommon("loadingChartData")}</p>
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
              <defs>
                <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(42, 100%, 50%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(42, 100%, 50%)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(142, 70%, 45%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142, 70%, 45%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(220, 15%, 18%)"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString(locale, {
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
                  fill="url(#grossGradient)"
                  stroke="hsl(42, 100%, 50%)"
                  strokeWidth={2}
                  stackId="a"
                />
              )}
              {activeChannels.net && (
                <Area
                  dataKey="net"
                  type="natural"
                  fill="url(#netGradient)"
                  stroke="hsl(142, 70%, 45%)"
                  strokeWidth={2}
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
                  strokeWidth={2}
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
                  strokeWidth={2}
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
                  strokeWidth={2}
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
                  strokeWidth={2}
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
