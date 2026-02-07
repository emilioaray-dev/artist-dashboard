"use client";

import { AudioWaveform } from "@/components/audio/AudioWaveform";
import { Button } from "@/components/ui/core/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/core/chart";
import { MetricCard } from "@/components/ui/customs/cards/MetricCard";
import { Link } from "@/i18n/navigation";
import { CHANNEL_INFO, ROUTES, STATUS_COLORS } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { usePlayerStore } from "@/store/player-store";
import { Channel, DailySales, Release } from "@/types";
import {
  ArrowLeft,
  DollarSign,
  ExternalLink,
  Share2,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type ReleaseDetailContentProps = {
  release: Release;
  dailySales: DailySales[];
};

export default function ReleaseDetailContent({
  release,
  dailySales,
}: ReleaseDetailContentProps) {
  const locale = useLocale();
  const t = useTranslations("ReleaseDetail");
  const tReleases = useTranslations("Releases");
  const tFormats = useTranslations("Formats");
  const tCommon = useTranslations("Common");

  const { currentTrack, isPlaying, play, pause } = usePlayerStore();
  const audioUrl = release.audioUrl || `/api/audio/${release.id}`;
  const isCurrentTrack = currentTrack === audioUrl;

  const togglePlayback = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play(audioUrl);
    }
  };

  // Conversion rate: buyers / total fans (mock a reasonable %)
  const conversionRate =
    release.totalSales > 0
      ? ((release.totalSales / (release.totalSales * 4)) * 100).toFixed(1)
      : "0.0";

  // Chart data
  const chartData = dailySales.map((day) => ({
    date: day.date,
    revenue: day.revenue,
  }));

  const chartConfig = {
    revenue: {
      label: t("dailyRevenue"),
      color: CHANNEL_INFO.direct_to_fan.color,
    },
  };

  // Sales by channel data
  const channels = Object.entries(release.revenueByChannel) as [
    Channel,
    number,
  ][];
  const maxChannelRevenue = Math.max(...channels.map(([, rev]) => rev), 1);

  return (
    <div className="container mx-auto">
      {/* Back button — sticky like other page headers */}
      <div className="bg-background/80 sticky top-0 z-10 -mx-4 mb-6 px-4 pt-6 pb-4 backdrop-blur-sm md:-mx-6 md:px-6">
        <Link
          href={ROUTES.releases}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          {t("backToReleases")}
        </Link>
      </div>

      {/* Header: cover art + metadata */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row">
        {/* Cover Art */}
        <div className="shrink-0">
          <div className="size-[248px] overflow-hidden rounded-xl shadow-lg">
            {release.coverArtUrl ? (
              <Image
                src={release.coverArtUrl}
                alt={release.title}
                width={192}
                height={192}
                priority
                className="size-full object-cover"
              />
            ) : (
              <div className="bg-muted flex size-full items-center justify-center">
                <span className="text-muted-foreground">
                  {tCommon("noCover")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                STATUS_COLORS[release.status],
              )}
            >
              {tReleases(`status.${release.status}`)}
            </span>
            <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize">
              {release.type}
            </span>
          </div>

          <h1 className="text-foreground mb-2 text-3xl font-bold">
            {release.title}
          </h1>

          <p className="text-muted-foreground mb-4 text-sm">
            {t("releasedOn", {
              date: formatDate(release.releaseDate, locale),
            })}
          </p>

          <div className="mb-4 flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 size-4" />
              {t("share")}
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 size-4" />
              {t("viewLive")}
            </Button>
          </div>

          {/* Audio player — compact, below actions */}
          <div className="max-w-md origin-top">
            <AudioWaveform release={release} onPlayPause={togglePlayback} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={DollarSign}
          title={t("totalRevenue")}
          value={formatCurrency(release.totalRevenue, locale)}
          change={release.totalRevenue > 0 ? 5.2 : 0}
        />
        <MetricCard
          icon={ShoppingCart}
          title={t("unitsSold")}
          value={release.totalSales.toLocaleString(locale)}
          change={release.totalSales > 0 ? 3.1 : 0}
        />
        <MetricCard
          icon={TrendingUp}
          title={t("conversionRate")}
          value={`${conversionRate}%`}
          change={release.totalSales > 0 ? 1.8 : 0}
        />
      </div>

      {/* Revenue chart + Sales by channel side by side */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue Over Time */}
        <Card className="card-hover lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("revenueOverTime")}</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient
                    id="releaseRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={CHANNEL_INFO.direct_to_fan.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHANNEL_INFO.direct_to_fan.color}
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
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#releaseRevenueGradient)"
                  stroke={CHANNEL_INFO.direct_to_fan.color}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales by Channel */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>{t("salesByChannel")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels.map(([channel, revenue]) => {
                const info = CHANNEL_INFO[channel];
                const channelLabels: Record<Channel, string> = {
                  direct_to_fan: tFormats("directToFan"),
                  digital: tFormats("digital"),
                  physical: tFormats("physical"),
                  bundles: tFormats("bundles"),
                };
                const percentage = (revenue / maxChannelRevenue) * 100;

                return (
                  <div key={channel}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {channelLabels[channel]}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(revenue, locale)}
                      </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
