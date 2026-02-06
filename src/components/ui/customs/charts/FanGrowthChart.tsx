"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/core/chart";
import { SlideInAnimation } from "@/components/motion/AnimationUtils";
import { CHART_COLORS } from "@/lib/constants";
import { EngagementMetrics, FanData } from "@/types";
import { useLocale, useTranslations } from "next-intl";

type FanGrowthChartProps = {
  engagementData: EngagementMetrics;
};

/**
 * Fan growth chart with Total vs Active fans lines
 * Amber gradient fill, tooltips, responsive, FadeIn wrapper
 */
export function FanGrowthChart({ engagementData }: FanGrowthChartProps) {
  const locale = useLocale();
  const t = useTranslations("Fans");
  const tFormats = useTranslations("Formats");

  // Prepare chart data
  const chartData = engagementData.fanHistory.map((day: FanData) => ({
    date: day.date,
    total: day.count,
    active: day.activeFans,
  }));

  const chartConfig = {
    total: { ...CHART_COLORS.totalFans, label: tFormats("totalFans") },
    active: { ...CHART_COLORS.activeFans, label: tFormats("activeFans") },
  };

  return (
    <SlideInAnimation duration={0.3}>
      <Card>
        <CardHeader className="border-b py-5">
          <CardTitle>{t("fanGrowth")}</CardTitle>
          <CardDescription>{t("fanGrowthSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
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
                  return new Date(value).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  }
                  return value.toString();
                }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="total"
                type="monotone"
                fill="var(--color-total)"
                fillOpacity={0.4}
                stroke="var(--color-total)"
                stackId="a"
              />
              <Area
                dataKey="active"
                type="monotone"
                fill="var(--color-active)"
                fillOpacity={0.4}
                stroke="var(--color-active)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </SlideInAnimation>
  );
}
