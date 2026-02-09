"use client";

import { AudioWaveform } from "@/components/audio/AudioWaveform";
import { Card, CardContent } from "@/components/ui/core/card";
import { Link } from "@/i18n/navigation";
import { ROUTES, STATUS_COLORS } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Release } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

type ReleaseCardProps = {
  release: Release;
  className?: string;
  priority?: boolean;
};

/**
 * Release card with cover art, status badge, title, type + date, revenue + trend
 * Includes AudioWaveform integrated below cover art
 * Hover effect: subtle card lift + border glow with amber accent
 */
export function ReleaseCard({
  release,
  className,
  priority = false,
}: Readonly<ReleaseCardProps>) {
  const locale = useLocale();
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");
  // Calculate revenue trend (simplified for mock data)
  const revenueTrend = release.totalRevenue > 2000000 ? "up" : "down";
  const trendIcon = revenueTrend === "up" ? "↑" : "↓";
  const trendColor = revenueTrend === "up" ? "text-positive" : "text-negative";

  return (
    <Card
      className={cn("card-hover group overflow-hidden p-0 px-0", className)}
    >
      <CardContent className="px-0">
        <Link href={ROUTES.releaseDetail(release.id)} className="block">
          <div className="relative mb-3">
            {/* Cover Art */}
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              {release.coverArtUrl ? (
                <Image
                  src={release.coverArtUrl}
                  alt={release.title}
                  width={300}
                  height={300}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={priority}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="bg-muted flex size-full items-center justify-center">
                  <span className="text-muted-foreground">
                    {tCommon("noCover")}
                  </span>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 left-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  STATUS_COLORS[release.status],
                )}
              >
                {t(`status.${release.status}`)}
              </span>
            </div>
          </div>
        </Link>

        <div className="p-4">
          {/* Title and Info */}
          <div className="mb-2">
            <h3 className="truncate font-semibold">{release.title}</h3>
            <p className="text-muted-foreground text-xs capitalize">
              {release.type} • {formatDate(release.releaseDate, locale)}
            </p>
          </div>

          {/* Revenue and Trend */}
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {formatCurrency(release.totalRevenue, locale)}
            </span>
            <span className={cn("text-xs font-medium", trendColor)}>
              {trendIcon} {(release.totalRevenue / 1000000).toFixed(1)}K
            </span>
          </div>

          {/* Audio Waveform — outside link to prevent navigation on play */}
          <div className="mt-3" data-testid="audio-waveform-container">
            <AudioWaveform release={release} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
