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
              className="hover:bg-accent/5 block rounded-lg border p-4 hover:shadow-sm"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <Link
                  href={ROUTES.releaseDetail(release.id)}
                  className="flex flex-1 items-center gap-4 sm:w-full md:w-fit"
                >
                  <div className="relative size-16 overflow-hidden rounded-md">
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

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="truncate font-medium">{release.title}</h3>
                      <span
                        className={cn(
                          "ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white",
                          STATUS_COLORS[release.status],
                        )}
                      >
                        {t(`status.${release.status}`)}
                      </span>
                    </div>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDate(release.releaseDate, locale)}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium">
                        {formatCurrency(release.totalRevenue, locale)}
                      </span>
                      <span className={cn("text-xs font-medium", trendColor)}>
                        {trendIcon}{" "}
                        {(release.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Audio player */}
                <div className="ml-4">
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
