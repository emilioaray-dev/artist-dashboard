"use client";

import { buttonVariants } from "@/components/ui/core/button";
import { STATUS_COLORS } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Release } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { AudioWaveform } from "@/components/audio/AudioWaveform";

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
}: RecentReleasesListProps) {
  // Calculate revenue trend (simplified for mock data)
  const getRevenueTrend = (revenue: number) => {
    return revenue > 2000000 ? "up" : "down";
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Releases</h2>
          <Link
            href="/releases"
            className={cn(buttonVariants({ variant: "ghost" }), "text-sm")}
          >
            View all
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
                  href={`/releases`}
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
                          No cover
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
                        {release.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDate(release.releaseDate)}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium">
                        {formatCurrency(release.totalRevenue)}
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
