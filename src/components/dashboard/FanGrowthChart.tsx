"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { motion } from "motion/react";
import { FadeIn } from "@/components/motion/FadeIn";
import { EngagementMetrics, FanData } from "@/types";

type FanGrowthChartProps = {
  engagementData: EngagementMetrics;
};

/**
 * Fan growth chart with Total vs Active fans lines
 * Amber gradient fill, tooltips, responsive, FadeIn wrapper
 */
export function FanGrowthChart({ engagementData }: FanGrowthChartProps) {
  // Prepare chart data
  const chartData = engagementData.fanHistory.map((day: FanData) => ({
    date: day.date,
    total: day.count,
    active: day.activeFans,
  }));

  // Define chart config
  const chartConfig = {
    total: {
      label: "Total Fans",
      color: "#F59E0B", // amber
    },
    active: {
      label: "Active Fans",
      color: "#10B981", // green
    },
  };

  return (
    <FadeIn>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="border-b py-5">
            <CardTitle>Fan Growth</CardTitle>
            <CardDescription>
              Showing fan growth over time
            </CardDescription>
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
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
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
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
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
      </motion.div>
    </FadeIn>
  );
}