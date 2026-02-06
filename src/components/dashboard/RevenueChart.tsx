"use client";

import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { TIME_RANGES } from "@/lib/constants";
import { SalesSummary, DailySales } from "@/types";

type RevenueChartProps = {
  salesData: SalesSummary;
};

/**
 * Revenue chart with time range tabs and clickable legend
 * Uses shadcn/ui AreaChart with Gross vs Net lines
 */
export function RevenueChart({ salesData }: RevenueChartProps) {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeChannels, setActiveChannels] = useState<Record<string, boolean>>({
    gross: true,
    net: true,
    direct_to_fan: true,
    digital: true,
    physical: true,
    bundles: true,
  });

  // Toggle channel visibility
  const toggleChannel = (channel: string) => {
    setActiveChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  // Prepare chart data
  const chartData = salesData.dailyData.map((day: DailySales) => ({
    date: day.date,
    gross: day.revenue,
    net: day.revenue, // For simplicity, using same value; in real app, would be different
    direct_to_fan: day.revenueByChannel.direct_to_fan,
    digital: day.revenueByChannel.digital,
    physical: day.revenueByChannel.physical,
    bundles: day.revenueByChannel.bundles,
  }));

  // Define chart config
  const chartConfig = {
    gross: {
      label: "Gross Revenue",
      color: "#F59E0B", // amber
    },
    net: {
      label: "Net Revenue",
      color: "#10B981", // green
    },
    direct_to_fan: {
      label: "Direct to Fan",
      color: "#F59E0B", // amber
    },
    digital: {
      label: "Digital",
      color: "#3B82F6", // blue
    },
    physical: {
      label: "Physical",
      color: "#10B981", // green
    },
    bundles: {
      label: "Bundles",
      color: "#8B5CF6", // violet
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              Showing revenue data for {salesData.periodStart} to {salesData.periodEnd}
            </CardDescription>
          </div>
          <Tabs 
            value={selectedRange} 
            onValueChange={(value) => setSelectedRange(value as '7d' | '30d' | '90d')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              {TIME_RANGES.map((range) => (
                <TabsTrigger key={range.value} value={range.value}>
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
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
        </CardContent>
      </Card>
    </motion.div>
  );
}