"use client";

import { buttonVariants } from "@/components/ui/core/button";
import { ROUTES, STATUS_COLORS } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Release } from "@/types";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { AudioWaveform } from "@/components/audio/AudioWaveform";
import { useLocale, useTranslations } from "next-intl";

type RecentReleasesListProps = {
  releases: Release[];
  className?: string;
};

/**
 * Compact list with thumbnail, title, status badge, revenue + trend
 * Version without motion components for server compatibility
 */
export function RecentReleasesList({
  releases,
  className,
}: Readonly<RecentReleasesListProps>) {
  const locale = useLocale();
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");

  // Calculate revenue trend (simplified for mock data)
  const getRevenueTrend = (revenue: number) => {
    return revenue > 2000000 ? "up" : "down";
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("recentReleases")}</h2>
          <Link
            href={ROUTES.releases}
            className={cn(buttonVariants({ variant: "ghost" }), "text-sm")}
          >
            {tCommon("viewAll")}
          </Link>
        </div>

        {releases.slice(0, 5).map((release) => {
          const revenueTrend = getRevenueTrend(release.totalRevenue);
          const trendIcon = revenueTrend === "up" ? "↑" : "↓";
          const trendColor =
            revenueTrend === "up" ? "text-positive" : "text-negative";

          return (
            <div
              key={release.id}
              className="hover:bg-accent/5 rounded-lg border p-4 hover:shadow-sm"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 md:flex md:items-center md:gap-4">
                {/* Link: contents on mobile (children become grid items), flex on desktop */}
                <Link
                  href={ROUTES.releaseDetail(release.id)}
                  className="contents md:flex md:flex-1 md:items-center md:gap-4"
                >
                  {/* Cover — spans 2 rows on mobile grid */}
                  <div className="relative row-span-2 size-16 self-start overflow-hidden rounded-md md:row-auto md:self-auto">
                    {release.coverArtUrl ? (
                      <Image
                        src={release.coverArtUrl}
                        alt={release.title}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex size-full items-center justify-center">
                        <span className="text-muted-foreground text-xs">
                          {tCommon("noCover")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info — contents on mobile, block on desktop */}
                  <div className="contents md:block md:min-w-0 md:flex-1">
                    {/* Title + Badge */}
                    <div className="contents md:flex md:items-start md:justify-between">
                      <h3 className="min-w-0 truncate font-medium">
                        {release.title}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center justify-self-end rounded-full px-2 py-1 text-xs font-medium text-white md:ml-2 md:justify-self-auto",
                          STATUS_COLORS[release.status],
                        )}
                      >
                        {t(`status.${release.status}`)}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-muted-foreground col-span-2 text-xs md:col-auto md:mt-1">
                      {formatDate(release.releaseDate, locale)}
                    </p>

                    {/* Revenue + Trend */}
                    <div className="contents md:mt-2 md:flex md:items-center md:justify-between">
                      <span className="col-span-2 font-medium md:col-auto">
                        {formatCurrency(release.totalRevenue, locale)}
                      </span>
                      <span
                        className={cn(
                          "justify-self-end pr-2 text-xs font-medium md:justify-self-auto md:pr-0",
                          trendColor,
                        )}
                      >
                        {trendIcon}{" "}
                        {(release.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Audio Waveform — spans all grid cols on mobile */}
                <div className="col-span-3 md:col-auto md:ml-4">
                  <AudioWaveform release={release} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
