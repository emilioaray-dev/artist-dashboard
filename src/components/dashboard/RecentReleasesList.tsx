"use client";

import { Release, ReleaseStatus } from "@/types";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { FadeIn } from "@/components/motion/FadeIn";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AudioWaveform } from "../releases/AudioWaveform";
import { usePlayerStore } from "@/store/player-store";

type RecentReleasesListProps = {
  releases: Release[];
  className?: string;
};

/**
 * Compact list with thumbnail, title, status badge, revenue + trend
 * StaggerContainer animation, links to /releases
 */
export function RecentReleasesList({ releases, className }: RecentReleasesListProps) {
  // Determine status badge styling
  const statusColors: Record<ReleaseStatus, string> = {
    draft: "bg-gray-500",
    scheduled: "bg-blue-500",
    live: "bg-green-500",
    archived: "bg-gray-700"
  };

  // Calculate revenue trend (simplified for mock data)
  const getRevenueTrend = (revenue: number) => {
    return revenue > 2000000 ? "up" : "down";
  };

  return (
    <StaggerContainer className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Releases</h3>
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
          const trendColor = revenueTrend === "up" ? "text-positive" : "text-negative";

          return (
            <FadeIn key={release.id}>
              <Link
                href={`/releases`}
                className="block rounded-lg border p-4 hover:bg-accent/5 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-16 overflow-hidden rounded-md">
                    {release.coverArtUrl ? (
                      <img
                        src={release.coverArtUrl}
                        alt={release.title}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-muted">
                        <span className="text-xs text-muted-foreground">No cover</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="truncate font-medium">{release.title}</h4>
                      <span className={cn(
                        "ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white",
                        statusColors[release.status]
                      )}>
                        {release.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(release.releaseDate)}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium">{formatCurrency(release.totalRevenue)}</span>
                      <span className={cn("text-xs font-medium", trendColor)}>
                        {trendIcon} {(release.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  
                  {/* Audio player */}
                  <div className="ml-4">
                    <AudioWaveform release={release} />
                  </div>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </StaggerContainer>
  );
}