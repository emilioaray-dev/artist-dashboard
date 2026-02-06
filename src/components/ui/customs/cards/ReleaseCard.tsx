"use client";

import { Card, CardContent } from "@/components/ui/core/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { usePlayerStore } from "@/store/player-store";
import { Release } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";
import Image from "next/image";
import { AudioWaveform } from "@/components/audio/AudioWaveform";
import { useLocale, useTranslations } from "next-intl";

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
export function ReleaseCard({ release, className, priority = false }: ReleaseCardProps) {
  const locale = useLocale();
  const t = useTranslations("Releases");
  const tCommon = useTranslations("Common");
  // Get player state and actions
  const { currentTrack, isPlaying, play, pause } = usePlayerStore();
  const isCurrentTrack = currentTrack === release.audioUrl;

  // Handle play/pause for this release
  const togglePlayback = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play(
        release.audioUrl ||
          "https://pub-d285a77a938b46bf93539cdd85ba963b.r2.dev/Nul%20Tiel%20Records%20-%20Jeopardy.mp3",
      );
    }
  };

  // Calculate revenue trend (simplified for mock data)
  const revenueTrend = release.totalRevenue > 2000000 ? "up" : "down";
  const trendIcon = revenueTrend === "up" ? "↑" : "↓";
  const trendColor = revenueTrend === "up" ? "text-positive" : "text-negative";

  return (
    <Card
      className={cn(
        "group hover:shadow-accent/20 overflow-hidden transition-all duration-300 hover:shadow-lg",
        "border-surface-elevated hover:border-accent/50 border",
        className,
      )}
    >
      <CardContent className="p-4">
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
                <span className="text-muted-foreground">{tCommon("noCover")}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white",
                STATUS_COLORS[release.status],
              )}
            >
              {t(`status.${release.status}`)}
            </span>
          </div>
        </div>

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

        {/* Audio Waveform */}
        <div className="mt-3" data-testid="audio-waveform-container">
          <AudioWaveform release={release} onPlayPause={togglePlayback} />
        </div>
      </CardContent>
    </Card>
  );
}
